export const employees = [
  { id: 1, loginId: 'OISAAA20220001', firstName: 'Sansukumar', lastName: 'A', email: 'sansu@dayflow.com', phone: '+91 98765 43210', role: 'ADMIN', department: 'Engineering', designation: 'Senior Developer', dateOfJoining: '2022-01-15', profilePicture: null, status: 'present', address: 'Chennai, Tamil Nadu', gender: 'Male', dateOfBirth: '1995-06-20', bloodGroup: 'B+', maritalStatus: 'Single', nationality: 'Indian', empCode: 'EMP001', education: 'B.E. Computer Science', skills: 'People Ops, React, Leadership' },
  { id: 2, loginId: 'OIRARR20220002', firstName: 'Rahul', lastName: 'R', email: 'rahul@dayflow.com', phone: '+91 98765 43211', role: 'EMPLOYEE', department: 'Engineering', designation: 'Software Developer', dateOfJoining: '2022-03-10', profilePicture: null, status: 'present', address: 'Bangalore, Karnataka', gender: 'Male', dateOfBirth: '1997-08-12', bloodGroup: 'O+', maritalStatus: 'Single', nationality: 'Indian', empCode: 'EMP002', education: 'B.Tech IT', skills: 'Java, Spring Boot' },
  { id: 3, loginId: 'OIPRSS20220003', firstName: 'Priya', lastName: 'S', email: 'priya@dayflow.com', phone: '+91 98765 43212', role: 'EMPLOYEE', department: 'Design', designation: 'UI/UX Designer', dateOfJoining: '2022-05-20', profilePicture: null, status: 'leave', address: 'Mumbai, Maharashtra', gender: 'Female', dateOfBirth: '1996-03-15', bloodGroup: 'A+', maritalStatus: 'Married', nationality: 'Indian', empCode: 'EMP003', education: 'B.Des', skills: 'Figma, Research' },
  { id: 4, loginId: 'OIARKK20220004', firstName: 'Arjun', lastName: 'K', email: 'arjun@dayflow.com', phone: '+91 98765 43213', role: 'EMPLOYEE', department: 'Marketing', designation: 'Marketing Manager', dateOfJoining: '2022-07-01', profilePicture: null, status: 'absent', address: 'Hyderabad, Telangana', gender: 'Male', dateOfBirth: '1994-11-28', bloodGroup: 'AB+', maritalStatus: 'Married', nationality: 'Indian', empCode: 'EMP004', education: 'MBA', skills: 'Growth, Brand' },
  { id: 5, loginId: 'OIMESS20220005', firstName: 'Meera', lastName: 'S', email: 'meera@dayflow.com', phone: '+91 98765 43214', role: 'HR', department: 'HR', designation: 'HR Officer', dateOfJoining: '2022-09-15', profilePicture: null, status: 'present', address: 'Pune, Maharashtra', gender: 'Female', dateOfBirth: '1998-01-05', bloodGroup: 'O-', maritalStatus: 'Single', nationality: 'Indian', empCode: 'EMP005', education: 'MBA HR', skills: 'Recruiting, Payroll' },
  { id: 6, loginId: 'OIVIRR20230001', firstName: 'Vikram', lastName: 'R', email: 'vikram@dayflow.com', phone: '+91 98765 43215', role: 'EMPLOYEE', department: 'Finance', designation: 'Accountant', dateOfJoining: '2023-01-10', profilePicture: null, status: 'present', address: 'Delhi', gender: 'Male', dateOfBirth: '1993-07-22', bloodGroup: 'A-', maritalStatus: 'Married', nationality: 'Indian', empCode: 'EMP006', education: 'CA', skills: 'GST, Audit' },
  { id: 7, loginId: 'OIANNN20230002', firstName: 'Ananya', lastName: 'N', email: 'ananya@dayflow.com', phone: '+91 98765 43216', role: 'EMPLOYEE', department: 'Engineering', designation: 'Backend Developer', dateOfJoining: '2023-03-20', profilePicture: null, status: 'present', address: 'Chennai, Tamil Nadu', gender: 'Female', dateOfBirth: '1999-04-18', bloodGroup: 'B-', maritalStatus: 'Single', nationality: 'Indian', empCode: 'EMP007', education: 'B.E. CSE', skills: 'Python, APIs' },
  { id: 8, loginId: 'OIKATT20230003', firstName: 'Karthik', lastName: 'T', email: 'karthik@dayflow.com', phone: '+91 98765 43217', role: 'EMPLOYEE', department: 'Sales', designation: 'Sales Executive', dateOfJoining: '2023-06-05', profilePicture: null, status: 'absent', address: 'Coimbatore, Tamil Nadu', gender: 'Male', dateOfBirth: '1996-09-30', bloodGroup: 'O+', maritalStatus: 'Single', nationality: 'Indian', empCode: 'EMP008', education: 'B.Com', skills: 'CRM, Outreach' },
]

const firstPassword = (loginId) => loginId

export const demoAccounts = [
  { email: 'sansu@dayflow.com', loginId: 'OISAAA20220001', password: firstPassword('OISAAA20220001'), mustChangePassword: false, pending: false },
  { email: 'meera@dayflow.com', loginId: 'OIMESS20220005', password: firstPassword('OIMESS20220005'), mustChangePassword: false, pending: false },
  { email: 'rahul@dayflow.com', loginId: 'OIRARR20220002', password: firstPassword('OIRARR20220002'), mustChangePassword: false, pending: false },
  { email: 'priya@dayflow.com', loginId: 'OIPRSS20220003', password: firstPassword('OIPRSS20220003'), mustChangePassword: true, pending: false },
  { email: 'arjun@dayflow.com', loginId: 'OIARKK20220004', password: firstPassword('OIARKK20220004'), mustChangePassword: false, pending: false },
  { email: 'vikram@dayflow.com', loginId: 'OIVIRR20230001', password: firstPassword('OIVIRR20230001'), mustChangePassword: false, pending: false },
  { email: 'ananya@dayflow.com', loginId: 'OIANNN20230002', password: firstPassword('OIANNN20230002'), mustChangePassword: false, pending: false },
  { email: 'karthik@dayflow.com', loginId: 'OIKATT20230003', password: firstPassword('OIKATT20230003'), mustChangePassword: false, pending: false },
]

export const departments = ['Engineering', 'Design', 'Marketing', 'HR', 'Finance', 'Sales', 'Operations']

export const attendanceRecords = [
  { id: 1, employeeId: 2, date: '2026-08-22', checkIn: '09:00', checkOut: '18:30', status: 'PRESENT', extraHours: 0 },
  { id: 2, employeeId: 2, date: '2026-08-21', checkIn: '09:15', checkOut: '19:00', status: 'PRESENT', extraHours: 0.5 },
  { id: 3, employeeId: 2, date: '2026-08-20', checkIn: '09:00', checkOut: '17:30', status: 'PRESENT', extraHours: 0 },
  { id: 4, employeeId: 2, date: '2026-08-19', checkIn: null, checkOut: null, status: 'ABSENT', extraHours: 0 },
  { id: 5, employeeId: 2, date: '2026-08-18', checkIn: '09:00', checkOut: '13:00', status: 'HALF_DAY', extraHours: 0 },
  { id: 6, employeeId: 3, date: '2026-08-22', checkIn: null, checkOut: null, status: 'LEAVE', extraHours: 0 },
  { id: 7, employeeId: 3, date: '2026-08-21', checkIn: null, checkOut: null, status: 'LEAVE', extraHours: 0 },
  { id: 8, employeeId: 4, date: '2026-08-22', checkIn: null, checkOut: null, status: 'ABSENT', extraHours: 0 },
  { id: 9, employeeId: 5, date: '2026-08-22', checkIn: '08:55', checkOut: '18:00', status: 'PRESENT', extraHours: 0 },
  { id: 10, employeeId: 6, date: '2026-08-22', checkIn: '09:30', checkOut: '18:15', status: 'PRESENT', extraHours: 0 },
  { id: 11, employeeId: 7, date: '2026-08-22', checkIn: '09:00', checkOut: '17:45', status: 'PRESENT', extraHours: 0 },
  { id: 12, employeeId: 1, date: '2026-08-22', checkIn: '08:45', checkOut: null, status: 'PRESENT', extraHours: 0 },
]

export const leaveRequests = [
  { id: 1, employeeId: 3, leaveType: 'SICK', startDate: '2026-08-22', endDate: '2026-08-23', remarks: 'Feeling unwell, need rest', status: 'PENDING', attachmentUrl: null, reviewedBy: null, reviewedAt: null },
  { id: 2, employeeId: 4, leaveType: 'PAID', startDate: '2026-08-25', endDate: '2026-08-27', remarks: 'Family function', status: 'PENDING', attachmentUrl: null, reviewedBy: null, reviewedAt: null },
  { id: 3, employeeId: 2, leaveType: 'PAID', startDate: '2026-08-10', endDate: '2026-08-11', remarks: 'Personal work', status: 'APPROVED', attachmentUrl: null, reviewedBy: 1, reviewedAt: '2026-08-09' },
  { id: 4, employeeId: 5, leaveType: 'UNPAID', startDate: '2026-07-15', endDate: '2026-07-16', remarks: 'Emergency', status: 'REJECTED', attachmentUrl: null, reviewedBy: 1, reviewedAt: '2026-07-14' },
  { id: 5, employeeId: 7, leaveType: 'SICK', startDate: '2026-08-18', endDate: '2026-08-18', remarks: 'Doctor appointment', status: 'APPROVED', attachmentUrl: 'medical-cert.pdf', reviewedBy: 1, reviewedAt: '2026-08-17' },
]

export const salaryData = [
  { employeeId: 1, monthlyWage: 120000, yearlyWage: 1440000, noOfWorkingDays: 26, workingDaysPerWeek: 5, basic: 60000, hra: 30000, standardAllowance: 4167, performanceBonus: 9996, leaveTravelAllowance: 10000, pf: 7200, professionalTax: 200 },
  { employeeId: 2, monthlyWage: 75000, yearlyWage: 900000, noOfWorkingDays: 26, workingDaysPerWeek: 5, basic: 37500, hra: 18750, standardAllowance: 5000, performanceBonus: 6250, leaveTravelAllowance: 6250, pf: 4500, professionalTax: 200 },
  { employeeId: 3, monthlyWage: 65000, yearlyWage: 780000, noOfWorkingDays: 26, workingDaysPerWeek: 5, basic: 32500, hra: 16250, standardAllowance: 4000, performanceBonus: 5416, leaveTravelAllowance: 5416, pf: 3900, professionalTax: 200 },
  { employeeId: 4, monthlyWage: 80000, yearlyWage: 960000, noOfWorkingDays: 26, workingDaysPerWeek: 5, basic: 40000, hra: 20000, standardAllowance: 5000, performanceBonus: 6666, leaveTravelAllowance: 6666, pf: 4800, professionalTax: 200 },
  { employeeId: 5, monthlyWage: 55000, yearlyWage: 660000, noOfWorkingDays: 26, workingDaysPerWeek: 5, basic: 27500, hra: 13750, standardAllowance: 3000, performanceBonus: 4583, leaveTravelAllowance: 4583, pf: 3300, professionalTax: 200 },
  { employeeId: 6, monthlyWage: 60000, yearlyWage: 720000, noOfWorkingDays: 26, workingDaysPerWeek: 5, basic: 30000, hra: 15000, standardAllowance: 3500, performanceBonus: 5000, leaveTravelAllowance: 5000, pf: 3600, professionalTax: 200 },
  { employeeId: 7, monthlyWage: 70000, yearlyWage: 840000, noOfWorkingDays: 26, workingDaysPerWeek: 5, basic: 35000, hra: 17500, standardAllowance: 4500, performanceBonus: 5833, leaveTravelAllowance: 5833, pf: 4200, professionalTax: 200 },
  { employeeId: 8, monthlyWage: 50000, yearlyWage: 600000, noOfWorkingDays: 26, workingDaysPerWeek: 5, basic: 25000, hra: 12500, standardAllowance: 3000, performanceBonus: 4166, leaveTravelAllowance: 4166, pf: 3000, professionalTax: 200 },
]

export const notifications = [
  { id: 1, type: 'LEAVE_REQUEST', message: 'Priya S has requested sick leave for Aug 22-23', read: false, createdAt: '2026-08-22T09:30:00', employeeId: 3 },
  { id: 2, type: 'LEAVE_REQUEST', message: 'Arjun K has requested paid leave for Aug 25-27', read: false, createdAt: '2026-08-22T08:15:00', employeeId: 4 },
  { id: 3, type: 'ATTENDANCE', message: 'Karthik T has not checked in today', read: true, createdAt: '2026-08-22T10:00:00', employeeId: 8 },
  { id: 4, type: 'SYSTEM', message: 'Monthly payroll has been generated', read: true, createdAt: '2026-08-21T16:00:00', employeeId: null },
]

export const activityLog = [
  { id: 1, action: 'checked in', employee: 'Rahul R', time: '09:00 AM', date: '2026-08-22' },
  { id: 2, action: 'checked in', employee: 'Meera S', time: '08:55 AM', date: '2026-08-22' },
  { id: 3, action: 'requested leave', employee: 'Priya S', time: '09:30 AM', date: '2026-08-22' },
  { id: 4, action: 'checked in', employee: 'Vikram R', time: '09:30 AM', date: '2026-08-22' },
  { id: 5, action: 'checked in', employee: 'Ananya N', time: '09:00 AM', date: '2026-08-22' },
  { id: 6, action: 'requested leave', employee: 'Arjun K', time: '08:15 AM', date: '2026-08-22' },
]

export function getEmployee(id) {
  return employees.find((e) => e.id === id)
}

export function getEmployeeSalary(id) {
  return salaryData.find((s) => s.employeeId === id)
}

export function getEmployeeAttendance(id) {
  return attendanceRecords.filter((a) => a.employeeId === id)
}

export function getEmployeeLeaves(id) {
  return leaveRequests.filter((l) => l.employeeId === id)
}

export function getAttendance(employeeId, date) {
  return attendanceRecords.find((a) => a.employeeId === employeeId && a.date === date)
}

export function getUnreadNotificationCount() {
  return notifications.filter((n) => !n.read).length
}

export function isManager(role) {
  return role === 'ADMIN' || role === 'HR'
}
