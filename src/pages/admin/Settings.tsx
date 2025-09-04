import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { 
  Settings as SettingsIcon, 
  Mail,
  Bell,
  Shield,
  Database,
  Globe,
  CreditCard,
  FileText,
  Users,
  Save,
  Upload,
  Download
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

const AdminSettingsPage = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [autoDocGeneration, setAutoDocGeneration] = useState(true);
  const [requireApproval, setRequireApproval] = useState(true);

  const handleSaveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "System settings have been updated successfully.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">System Settings</h1>
          <p className="text-muted-foreground">Configure system preferences and integrations</p>
        </div>
        <Button onClick={handleSaveSettings}>
          <Save className="w-4 h-4 mr-2" />
          Save All Settings
        </Button>
      </div>

      {/* Company Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Globe className="w-5 h-5 mr-2" />
            Company Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="companyName">Company Name</Label>
              <Input id="companyName" defaultValue="Thinklab Properties Limited" />
            </div>
            <div>
              <Label htmlFor="companyEmail">Company Email</Label>
              <Input id="companyEmail" type="email" defaultValue="info@thinklabproperties.com" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="companyPhone">Company Phone</Label>
              <Input id="companyPhone" defaultValue="+234 (0) 123 456 7890" />
            </div>
            <div>
              <Label htmlFor="website">Website</Label>
              <Input id="website" defaultValue="https://thinklabproperties.com" />
            </div>
          </div>
          <div>
            <Label htmlFor="address">Company Address</Label>
            <Textarea 
              id="address" 
              defaultValue="123 Victoria Island, Lagos State, Nigeria"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Bank Account Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="w-5 h-5 mr-2" />
            Bank Account Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium">Bakassi Estate Account</h4>
              <div className="space-y-2">
                <Label htmlFor="bakassiBank">Bank Name</Label>
                <Input id="bakassiBank" defaultValue="Zenith Bank" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bakassiAccount">Account Number</Label>
                <Input id="bakassiAccount" defaultValue="0512044944" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bakassiAccountName">Account Name</Label>
                <Input id="bakassiAccountName" defaultValue="Thinklab Properties - Bakassi Estate" />
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium">Teachers Village Account</h4>
              <div className="space-y-2">
                <Label htmlFor="teachersBank">Bank Name</Label>
                <Input id="teachersBank" defaultValue="First Bank" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="teachersAccount">Account Number</Label>
                <Input id="teachersAccount" defaultValue="2011223344" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="teachersAccountName">Account Name</Label>
                <Input id="teachersAccountName" defaultValue="Thinklab Properties - Teachers Village" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="w-5 h-5 mr-2" />
            Notification Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Email Notifications</p>
              <p className="text-sm text-muted-foreground">Send email notifications for important events</p>
            </div>
            <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">SMS Notifications</p>
              <p className="text-sm text-muted-foreground">Send SMS alerts to clients</p>
            </div>
            <Switch checked={smsNotifications} onCheckedChange={setSmsNotifications} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="adminEmail">Admin Notification Email</Label>
            <Input id="adminEmail" type="email" defaultValue="admin@thinklabproperties.com" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="smsProvider">SMS Provider API Key</Label>
            <Input id="smsProvider" type="password" placeholder="Enter SMS provider API key" />
          </div>
        </CardContent>
      </Card>

      {/* Document Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Document Generation Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Auto Document Generation</p>
              <p className="text-sm text-muted-foreground">Automatically generate documents when payments are approved</p>
            </div>
            <Switch checked={autoDocGeneration} onCheckedChange={setAutoDocGeneration} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="documentTemplate">Document Template Directory</Label>
            <div className="flex space-x-2">
              <Input id="documentTemplate" defaultValue="/templates/documents/" readOnly />
              <Button variant="outline">
                <Upload className="w-4 h-4 mr-1" />
                Upload
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="logoUpload">Company Logo</Label>
            <div className="flex space-x-2">
              <Input id="logoUpload" type="file" accept="image/*" />
              <Button variant="outline">
                <Upload className="w-4 h-4 mr-1" />
                Upload Logo
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Security Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Require Admin Approval</p>
              <p className="text-sm text-muted-foreground">All applications require admin approval before client access</p>
            </div>
            <Switch checked={requireApproval} onCheckedChange={setRequireApproval} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
            <Input id="sessionTimeout" type="number" defaultValue="60" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxAttempts">Max Login Attempts</Label>
            <Input id="maxAttempts" type="number" defaultValue="5" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="passwordLength">Minimum Password Length</Label>
            <Input id="passwordLength" type="number" defaultValue="8" />
          </div>
        </CardContent>
      </Card>

      {/* System Backup */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Database className="w-5 h-5 mr-2" />
            System Backup & Maintenance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Database Backup</h4>
                <Badge className="bg-green-100 text-green-800">Active</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-4">Last backup: Today at 2:00 AM</p>
              <Button variant="outline" className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Download Backup
              </Button>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Document Archive</h4>
                <Badge className="bg-blue-100 text-blue-800">Scheduled</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-4">Next archive: Tomorrow at 3:00 AM</p>
              <Button variant="outline" className="w-full">
                <Upload className="w-4 h-4 mr-2" />
                Manual Archive
              </Button>
            </Card>
          </div>

          <div className="space-y-2">
            <Label htmlFor="backupFreq">Backup Frequency</Label>
            <select className="w-full p-2 border rounded-md" defaultValue="daily">
              <option value="hourly">Every Hour</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
          </div>
        </CardContent>
      </Card>
      
      {/* Integration Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Third-Party Integrations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="emailProvider">Email Service Provider</Label>
              <select className="w-full p-2 border rounded-md" defaultValue="smtp">
                <option value="smtp">SMTP</option>
                <option value="sendgrid">SendGrid</option>
                <option value="mailgun">Mailgun</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="smsService">SMS Service Provider</Label>
              <select className="w-full p-2 border rounded-md" defaultValue="twilio">
                <option value="twilio">Twilio</option>
                <option value="nexmo">Vonage (Nexmo)</option>
                <option value="local">Local Provider</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="apiKey">Email API Key</Label>
            <Input id="apiKey" type="password" placeholder="Enter email service API key" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSettingsPage;