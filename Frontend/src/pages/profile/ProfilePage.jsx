import { useParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Avatar } from '../../components/ui/Avatar'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/Tabs'
import { getEmployee, getEmployeeSalary, getEmployeeAttendance } from '../../data/mockData'
import { MapPin, Phone, Mail, Edit } from 'lucide-react'
import Button from '../../components/ui/Button'

export default function ProfilePage() {
  const { id } = useParams()
  const { user } = useAuth()
  const isAdmin = user?.role === 'ADMIN'
  const profileUser = id ? getEmployee(parseInt(id)) : user
  const salary = getEmployeeSalary(profileUser?.id)
  const attendance = getEmployeeAttendance(profileUser?.id)

  if (!profileUser) {
    return <div className="text-center py-12 text-muted-foreground">Employee not found</div>
  }

  const canEdit = isAdmin || !id

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <Avatar firstName={profileUser.firstName} lastName={profileUser.lastName} size="xl" src={profileUser.profilePicture} />
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-xl font-bold text-foreground">{profileUser.firstName} {profileUser.lastName}</h2>
                <Badge variant={profileUser.role === 'ADMIN' ? 'info' : 'muted'}>{profileUser.role === 'ADMIN' ? 'Admin' : 'Employee'}</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-2">{profileUser.designation} · {profileUser.department}</p>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5" />{profileUser.email}</span>
                <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" />{profileUser.phone}</span>
                <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{profileUser.address}</span>
              </div>
            </div>
            {canEdit && (
              <Button variant="secondary" icon={Edit}>Edit Profile</Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="personal">
        <TabsList>
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="job">Job Details</TabsTrigger>
          <TabsTrigger value="salary">Salary Info</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="personal">
          <Card>
            <CardHeader><CardTitle>Personal Details</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { label: 'Full Name', value: `${profileUser.firstName} ${profileUser.lastName}` },
                  { label: 'Employee ID', value: profileUser.loginId },
                  { label: 'Email', value: profileUser.email },
                  { label: 'Phone', value: profileUser.phone },
                  { label: 'Date of Birth', value: profileUser.dateOfBirth || '—' },
                  { label: 'Gender', value: profileUser.gender || '—' },
                  { label: 'Blood Group', value: profileUser.bloodGroup || '—' },
                  { label: 'Marital Status', value: profileUser.maritalStatus || '—' },
                  { label: 'Nationality', value: profileUser.nationality || '—' },
                  { label: 'Address', value: profileUser.address || '—' },
                ].map(item => (
                  <div key={item.label}>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">{item.label}</p>
                    <p className="text-sm font-medium">{item.value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="job">
          <Card>
            <CardHeader><CardTitle>Job Details</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { label: 'Department', value: profileUser.department },
                  { label: 'Designation', value: profileUser.designation },
                  { label: 'Date of Joining', value: profileUser.dateOfJoining },
                  { label: 'Employee Code', value: profileUser.empCode },
                  { label: 'Role', value: profileUser.role === 'ADMIN' ? 'Admin / HR Officer' : 'Employee' },
                ].map(item => (
                  <div key={item.label}>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">{item.label}</p>
                    <p className="text-sm font-medium">{item.value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="salary">
          <Card>
            <CardHeader><CardTitle>Salary Information</CardTitle></CardHeader>
            <CardContent>
              {salary ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-muted rounded-lg p-4">
                      <p className="text-xs text-muted-foreground mb-1">Monthly Wage</p>
                      <p className="text-lg font-bold">₹{salary.monthlyWage?.toLocaleString('en-IN')}</p>
                    </div>
                    <div className="bg-muted rounded-lg p-4">
                      <p className="text-xs text-muted-foreground mb-1">Yearly Wage</p>
                      <p className="text-lg font-bold">₹{salary.yearlyWage?.toLocaleString('en-IN')}</p>
                    </div>
                    <div className="bg-muted rounded-lg p-4">
                      <p className="text-xs text-muted-foreground mb-1">Working Days</p>
                      <p className="text-lg font-bold">{salary.noOfWorkingDays}/month</p>
                    </div>
                    <div className="bg-muted rounded-lg p-4">
                      <p className="text-xs text-muted-foreground mb-1">PF Contribution</p>
                      <p className="text-lg font-bold">₹{salary.pf?.toLocaleString('en-IN')}</p>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="table">
                      <thead><tr><th>Component</th><th className="text-right">Amount</th></tr></thead>
                      <tbody>
                        {[
                          { name: 'Basic Salary', amount: salary.basic },
                          { name: 'House Rent Allowance', amount: salary.hra },
                          { name: 'Standard Allowance', amount: salary.standardAllowance },
                          { name: 'Performance Bonus', amount: salary.performanceBonus },
                          { name: 'Leave Travel Allowance', amount: salary.leaveTravelAllowance },
                          { name: 'Provident Fund', amount: salary.pf },
                          { name: 'Professional Tax', amount: salary.professionalTax },
                        ].map(c => (
                          <tr key={c.name}>
                            <td className="font-medium">{c.name}</td>
                            <td className="text-right">₹{c.amount?.toLocaleString('en-IN')}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No salary information available</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendance">
          <Card>
            <CardHeader><CardTitle>Attendance History</CardTitle></CardHeader>
            <CardContent>
              {attendance.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="table">
                    <thead><tr><th>Date</th><th>Check In</th><th>Check Out</th><th>Status</th><th>Extra Hours</th></tr></thead>
                    <tbody>
                      {attendance.map(a => (
                        <tr key={a.id}>
                          <td>{new Date(a.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                          <td>{a.checkIn || '—'}</td>
                          <td>{a.checkOut || '—'}</td>
                          <td><Badge variant={a.status === 'PRESENT' ? 'success' : a.status === 'LEAVE' ? 'info' : a.status === 'HALF_DAY' ? 'warning' : 'destructive'}>{a.status}</Badge></td>
                          <td>{a.extraHours > 0 ? `+${a.extraHours}h` : '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No attendance records</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader><CardTitle>Documents</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center py-8">No documents uploaded yet</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
