package com.Dayflow.service;

import com.Dayflow.dto.request.CreateLeaveRequest;
import com.Dayflow.dto.response.EmployeeAllocationResponse;
import com.Dayflow.dto.response.LeaveBalanceResponse;
import com.Dayflow.dto.response.LeaveRequestResponse;
import com.Dayflow.exception.BadRequestException;
import com.Dayflow.exception.ConflictException;
import com.Dayflow.exception.ForbiddenException;
import com.Dayflow.exception.ResourceNotFoundException;
import com.Dayflow.model.LeaveType;
import com.Dayflow.model.TimeOff;
import com.Dayflow.model.TimeOffStatus;
import com.Dayflow.model.User;
import com.Dayflow.repository.TimeOffRepository;
import com.Dayflow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EmployeeLeaveService {

    private static final double DEFAULT_PAID = 24.0;
    private static final double DEFAULT_SICK = 7.0;

    private final EmployeeContextService employeeContextService;
    private final CurrentUserService currentUserService;
    private final TimeOffRepository timeOffRepository;
    private final UserRepository userRepository;
    private final EmployeeNotificationService notificationService;

    @Transactional(readOnly = true)
    public List<LeaveRequestResponse> getLeaveRequests() {
        return getLeaveRequests(employeeContextService.requireEmployee());
    }

    @Transactional(readOnly = true)
    public List<LeaveRequestResponse> getLeaveRequests(User employee) {
        return timeOffRepository.findByUserIdOrderByIdDesc(employee.getId())
            .stream()
            .map(this::toLeave)
            .toList();
    }

    @Transactional(readOnly = true)
    public LeaveBalanceResponse getLeaveBalance() {
        return toBalance(employeeContextService.requireEmployee());
    }

    @Transactional(readOnly = true)
    public LeaveBalanceResponse getLeaveBalance(User employee) {
        return toBalance(employee);
    }

    @Transactional
    public LeaveRequestResponse createLeaveRequest(CreateLeaveRequest request) {
        User employee = employeeContextService.requireEmployee();

        if (request.getLeaveType() == null) {
            throw new BadRequestException("Leave type is invalid");
        }
        if (request.getEndDate().isBefore(request.getStartDate())) {
            throw new BadRequestException("Start date cannot be after end date");
        }

        double days = ChronoUnit.DAYS.between(request.getStartDate(), request.getEndDate()) + 1.0;
        String remarks = request.getRemarks() != null ? request.getRemarks() : request.getReason();

        if (request.getLeaveType() == LeaveType.SICK_LEAVE
            && (request.getAttachmentUrl() == null || request.getAttachmentUrl().isBlank())) {
            throw new BadRequestException("Sick leave requires a certificate attachment");
        }

        if (timeOffRepository.existsOverlapping(employee.getId(), request.getStartDate(), request.getEndDate())) {
            throw new BadRequestException("An overlapping leave request already exists for these dates");
        }

        if (request.getLeaveType() == LeaveType.PAID_TIME_OFF && paidBalance(employee) < days) {
            throw new BadRequestException("Insufficient paid time off balance");
        }
        if (request.getLeaveType() == LeaveType.SICK_LEAVE && sickBalance(employee) < days) {
            throw new BadRequestException("Insufficient sick leave balance");
        }

        TimeOff leave = TimeOff.builder()
            .user(employee)
            .startDate(request.getStartDate())
            .endDate(request.getEndDate())
            .leaveType(request.getLeaveType())
            .reason(remarks)
            .attachmentUrl(request.getAttachmentUrl())
            .numberOfDays(days)
            .status(TimeOffStatus.PENDING)
            .createdAt(LocalDateTime.now())
            .build();
        timeOffRepository.save(leave);

        notificationService.notify(employee, "LEAVE_REQUEST", "Your leave request was submitted and is pending approval.");
        return toLeave(leave);
    }

    @Transactional
    public LeaveRequestResponse reviewLeave(Long leaveId, TimeOffStatus status) {
        return processReview(leaveId, status, null);
    }

    @Transactional(readOnly = true)
    public List<LeaveRequestResponse> listCompanyTimeOff(String search, TimeOffStatus status) {
        User reviewer = requireAdminOrHr();
        String query = search == null ? "" : search.trim().toLowerCase();

        return timeOffRepository.findByUser_Company_IdOrderByIdDesc(reviewer.getCompany().getId())
            .stream()
            .filter(leave -> status == null || leave.getStatus() == status)
            .filter(leave -> matchesSearch(leave, query))
            .map(this::toLeave)
            .toList();
    }

    @Transactional(readOnly = true)
    public LeaveRequestResponse getCompanyTimeOff(Long id) {
        return toLeave(findCompanyLeave(id));
    }

    @Transactional
    public LeaveRequestResponse approveTimeOff(Long id) {
        return processReview(id, TimeOffStatus.APPROVED, null);
    }

    @Transactional
    public LeaveRequestResponse rejectTimeOff(Long id, String comment) {
        return processReview(id, TimeOffStatus.REJECTED, comment);
    }

    @Transactional(readOnly = true)
    public List<EmployeeAllocationResponse> listCompanyAllocations() {
        User reviewer = requireAdminOrHr();
        return userRepository.searchCompanyEmployees(reviewer.getCompany().getId(), "")
            .stream()
            .map(employee -> EmployeeAllocationResponse.builder()
                .employeeId(employee.getEmployeeId())
                .employeeName(employee.getFirstName() + " " + employee.getLastName())
                .paidTimeOffAvailable(paidBalance(employee))
                .sickLeaveAvailable(sickBalance(employee))
                .unpaidLeaveInfo("Unpaid leave does not use a fixed allocation")
                .build())
            .toList();
    }

    private LeaveRequestResponse processReview(Long leaveId, TimeOffStatus status, String comment) {
        User reviewer = requireAdminOrHr();
        if (status != TimeOffStatus.APPROVED && status != TimeOffStatus.REJECTED) {
            throw new BadRequestException("Status must be APPROVED or REJECTED");
        }

        TimeOff leave = findCompanyLeave(leaveId, reviewer);

        if (leave.getStatus() != TimeOffStatus.PENDING) {
            throw new ConflictException("Request has already been processed");
        }

        leave.setStatus(status);
        if (status == TimeOffStatus.REJECTED && comment != null && !comment.isBlank()) {
            leave.setRejectionComment(comment.trim());
        }
        timeOffRepository.save(leave);

        if (status == TimeOffStatus.APPROVED) {
            deductBalance(leave);
            notificationService.notify(leave.getUser(), "LEAVE_APPROVED", "Your leave request was approved.");
        } else {
            notificationService.notify(leave.getUser(), "LEAVE_REJECTED", "Your leave request was rejected.");
        }

        return toLeave(leave);
    }

    private TimeOff findCompanyLeave(Long id) {
        return findCompanyLeave(id, requireAdminOrHr());
    }

    private TimeOff findCompanyLeave(Long id, User reviewer) {
        TimeOff leave = timeOffRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Time Off request not found"));
        if (!leave.getUser().getCompany().getId().equals(reviewer.getCompany().getId())) {
            throw new ForbiddenException("User does not have permission");
        }
        return leave;
    }

    private User requireAdminOrHr() {
        User reviewer = currentUserService.getCurrentUser();
        if (!currentUserService.canCreateEmployee(reviewer)) {
            throw new ForbiddenException("User does not have permission");
        }
        return reviewer;
    }

    private boolean matchesSearch(TimeOff leave, String query) {
        if (query == null || query.isBlank()) {
            return true;
        }
        User employee = leave.getUser();
        String type = leave.getLeaveType() == null ? "" : leave.getLeaveType().name().toLowerCase();
        String status = leave.getStatus() == null ? "" : leave.getStatus().name().toLowerCase();
        String name = (employee.getFirstName() + " " + employee.getLastName()).toLowerCase();
        return name.contains(query)
            || employee.getEmployeeId().toLowerCase().contains(query)
            || employee.getLoginId().toLowerCase().contains(query)
            || type.contains(query.replace(" ", "_"))
            || status.contains(query);
    }

    public long pendingCount(User employee) {
        return timeOffRepository.countByUserIdAndStatus(employee.getId(), TimeOffStatus.PENDING);
    }

    private void deductBalance(TimeOff leave) {
        User employee = leave.getUser();
        double days = leave.getNumberOfDays() == null ? 0 : leave.getNumberOfDays();
        if (leave.getLeaveType() == LeaveType.PAID_TIME_OFF) {
            employee.setPaidTimeOffBalance(paidBalance(employee) - days);
        } else if (leave.getLeaveType() == LeaveType.SICK_LEAVE) {
            employee.setSickLeaveBalance(sickBalance(employee) - days);
        }
        userRepository.save(employee);
    }

    private LeaveBalanceResponse toBalance(User employee) {
        return LeaveBalanceResponse.builder()
            .paidTimeOffAvailable(paidBalance(employee))
            .sickLeaveAvailable(sickBalance(employee))
            .unpaidLeaveInfo("Unpaid leave does not use a fixed allocation")
            .build();
    }

    private double paidBalance(User employee) {
        return employee.getPaidTimeOffBalance() == null ? DEFAULT_PAID : employee.getPaidTimeOffBalance();
    }

    private double sickBalance(User employee) {
        return employee.getSickLeaveBalance() == null ? DEFAULT_SICK : employee.getSickLeaveBalance();
    }

    private LeaveRequestResponse toLeave(TimeOff leave) {
        return LeaveRequestResponse.builder()
            .id(leave.getId())
            .employeeId(leave.getUser().getEmployeeId())
            .leaveType(leave.getLeaveType())
            .startDate(leave.getStartDate())
            .endDate(leave.getEndDate())
            .numberOfDays(leave.getNumberOfDays())
            .remarks(leave.getReason())
            .attachmentUrl(leave.getAttachmentUrl())
            .status(leave.getStatus())
            .rejectionComment(leave.getRejectionComment())
            .createdAt(leave.getCreatedAt())
            .employeeName(leave.getUser().getFirstName() + " " + leave.getUser().getLastName())
            .build();
    }
}
