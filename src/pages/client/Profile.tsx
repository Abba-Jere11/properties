import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Edit3, 
  Save, 
  X,
  MessageCircle,
  HeadphonesIcon,
  Shield
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

const ClientProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "John Doe",
    email: "john.doe@email.com",
    phone: "+234 (0) 123 456 7890",
    address: "123 Victoria Island, Lagos, Nigeria",
    nextOfKin: "Jane Doe",
    nextOfKinPhone: "+234 (0) 987 654 3210",
    nextOfKinRelationship: "Spouse",
    emergencyContact: "+234 (0) 111 222 3333"
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    toast({
      title: "Profile Updated",
      description: "Your profile information has been successfully updated.",
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Reset form data to original values
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Profile</h1>
          <p className="text-muted-foreground">Manage your personal information and preferences</p>
        </div>
        <div className="flex space-x-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleCancel}>
                <X className="w-4 h-4 mr-1" />
                Cancel
              </Button>
              <Button onClick={handleSave}>
                <Save className="w-4 h-4 mr-1" />
                Save Changes
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <Edit3 className="w-4 h-4 mr-1" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      {/* Account Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Account Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="font-medium text-green-900">Application</p>
              <Badge className="bg-green-100 text-green-800 mt-1">Approved</Badge>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <p className="font-medium text-yellow-900">Payment Status</p>
              <Badge className="bg-yellow-100 text-yellow-800 mt-1">50% Paid</Badge>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="font-medium text-blue-900">Property</p>
              <Badge className="bg-blue-100 text-blue-800 mt-1">Provisionally Allocated</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="w-5 h-5 mr-2" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              {isEditing ? (
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                />
              ) : (
                <p className="mt-1 p-2 bg-muted rounded-md">{formData.fullName}</p>
              )}
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              {isEditing ? (
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
              ) : (
                <p className="mt-1 p-2 bg-muted rounded-md">{formData.email}</p>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              {isEditing ? (
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                />
              ) : (
                <p className="mt-1 p-2 bg-muted rounded-md">{formData.phone}</p>
              )}
            </div>
            <div>
              <Label htmlFor="emergencyContact">Emergency Contact</Label>
              {isEditing ? (
                <Input
                  id="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                />
              ) : (
                <p className="mt-1 p-2 bg-muted rounded-md">{formData.emergencyContact}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="address">Home Address</Label>
            {isEditing ? (
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                rows={3}
              />
            ) : (
              <p className="mt-1 p-2 bg-muted rounded-md">{formData.address}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Next of Kin Information */}
      <Card>
        <CardHeader>
          <CardTitle>Next of Kin Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nextOfKin">Next of Kin Name</Label>
              {isEditing ? (
                <Input
                  id="nextOfKin"
                  value={formData.nextOfKin}
                  onChange={(e) => handleInputChange('nextOfKin', e.target.value)}
                />
              ) : (
                <p className="mt-1 p-2 bg-muted rounded-md">{formData.nextOfKin}</p>
              )}
            </div>
            <div>
              <Label htmlFor="nextOfKinRelationship">Relationship</Label>
              {isEditing ? (
                <Input
                  id="nextOfKinRelationship"
                  value={formData.nextOfKinRelationship}
                  onChange={(e) => handleInputChange('nextOfKinRelationship', e.target.value)}
                />
              ) : (
                <p className="mt-1 p-2 bg-muted rounded-md">{formData.nextOfKinRelationship}</p>
              )}
            </div>
          </div>
          
          <div>
            <Label htmlFor="nextOfKinPhone">Next of Kin Phone Number</Label>
            {isEditing ? (
              <Input
                id="nextOfKinPhone"
                value={formData.nextOfKinPhone}
                onChange={(e) => handleInputChange('nextOfKinPhone', e.target.value)}
              />
            ) : (
              <p className="mt-1 p-2 bg-muted rounded-md">{formData.nextOfKinPhone}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Property Information */}
      <Card>
        <CardHeader>
          <CardTitle>My Property Purchase</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div>
                <p className="font-medium">Estate</p>
                <p className="text-muted-foreground">Bakassi GRA</p>
              </div>
              <div>
                <p className="font-medium">Property Type</p>
                <p className="text-muted-foreground">2-Bedroom Bungalow</p>
              </div>
              <div>
                <p className="font-medium">Payment Plan</p>
                <p className="text-muted-foreground">Murabahah - 24 Months</p>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <p className="font-medium">Application ID</p>
                <p className="text-muted-foreground">APP001</p>
              </div>
              <div>
                <p className="font-medium">Total Cost</p>
                <p className="text-muted-foreground">₦5,000,000</p>
              </div>
              <div>
                <p className="font-medium">Amount Paid</p>
                <p className="text-muted-foreground">₦2,500,000 (50%)</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Support Section */}
      <Card>
        <CardHeader>
          <CardTitle>Need Help?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="outline" className="justify-start">
              <HeadphonesIcon className="w-4 h-4 mr-3" />
              Call Support: +234 (0) 123 456 7890
            </Button>
            <Button variant="outline" className="justify-start">
              <MessageCircle className="w-4 h-4 mr-3" />
              WhatsApp Chat
            </Button>
          </div>
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Office Hours:</strong> Monday - Friday: 8:00 AM - 6:00 PM | Saturday: 9:00 AM - 2:00 PM
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientProfilePage;