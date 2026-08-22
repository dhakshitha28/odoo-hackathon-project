package com.Dayflow.dto.request;

import com.Dayflow.model.EmploymentType;
import com.Dayflow.model.Gender;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

import java.time.LocalDate;

@Data
public class CreateEmployeeRequest {

    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^[0-9]{10}$", message = "Phone number must be 10 digits")
    private String phoneNumber;

    private LocalDate dateOfBirth;

    private Gender gender;

    private String profilePictureUrl;

    @NotBlank(message = "Department is required")
    private String department;

    @NotBlank(message = "Job position is required")
    private String jobPosition;

    private Long managerId;

    @NotNull(message = "Date of joining is required")
    private LocalDate dateOfJoining;

    private EmploymentType employmentType;

    private String address;

    private String city;

    private String state;

    private String country;

    @Pattern(regexp = "^$|^[0-9]{6}$", message = "PIN code must be 6 digits")
    private String pinCode;

    private String skills;

    private String certifications;

    private String resumeUrl;
}
