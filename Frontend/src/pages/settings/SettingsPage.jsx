import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { User, Bell, Shield, Palette } from 'lucide-react'

export default function SettingsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Settings</h2>
        <p className="text-sm text-muted-foreground mt-1">Manage your account settings</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><User className="h-4 w-4" /> Profile Settings</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Display Name</label>
              <input className="input" defaultValue="Sansukumar A" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Email</label>
              <input className="input" defaultValue="sansu@dayflow.com" disabled />
            </div>
            <Button>Save Changes</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Shield className="h-4 w-4" /> Security</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Current Password</label>
              <input type="password" className="input" placeholder="Enter current password" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">New Password</label>
              <input type="password" className="input" placeholder="Enter new password" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Confirm Password</label>
              <input type="password" className="input" placeholder="Confirm new password" />
            </div>
            <Button variant="secondary">Update Password</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Bell className="h-4 w-4" /> Notifications</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {['Email notifications', 'Leave request alerts', 'Attendance reminders', 'Payroll notifications'].map(item => (
              <label key={item} className="flex items-center justify-between py-2">
                <span className="text-sm">{item}</span>
                <div className="h-5 w-9 bg-primary-500 rounded-full relative cursor-pointer">
                  <div className="h-4 w-4 bg-white rounded-full absolute top-0.5 right-0.5 shadow-sm" />
                </div>
              </label>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Palette className="h-4 w-4" /> Appearance</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Theme settings coming soon.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
