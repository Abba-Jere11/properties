import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  CreditCard, 
  Calendar, 
  Building2,
  FileText,
  CheckCircle,
  XCircle,
  Download
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ApplicationDetailsProps {
  application: any;
  isOpen: boolean;
  onClose: () => void;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
}

const ApplicationDetails: React.FC<ApplicationDetailsProps> = ({ 
  application, 
  isOpen, 
  onClose,
  onApprove,
  onReject
}) => {
  if (!application) return null;

  const handleApprove = () => {
    if (onApprove) {
      onApprove(application.id);
    }
    onClose();
  };

  const handleReject = () => {
    const reason = prompt("Please provide a reason for rejection:");
    if (reason && onReject) {
      onReject(application.id);
    }
    onClose();
  };

  const handleDownloadPDF = async () => {
    if (application.application_pdf_url) {
      // Open existing PDF
      window.open(application.application_pdf_url, '_blank');
      toast({
        title: "PDF Opened",
        description: `Application PDF opened in new tab.`,
      });
    } else {
      // Generate PDF first
      try {
        const response = await fetch('https://uyfnjohydenzdelykjla.supabase.co/functions/v1/generate-application-pdf', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ applicationId: application.id }),
        });

        const data = await response.json();
        if (data.success) {
          window.open(data.pdfUrl, '_blank');
          toast({
            title: "PDF Generated",
            description: `Application PDF generated and opened successfully.`,
          });
        } else {
          throw new Error(data.error || 'Failed to generate PDF');
        }
      } catch (error) {
        console.error('Error generating PDF:', error);
        toast({
          title: "Error",
          description: "Failed to generate PDF. Please try again.",
          variant: "destructive"
        });
      }
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800"
    };
    return (
      <Badge className={variants[status as keyof typeof variants]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Application Details - {application.id}</span>
            {getStatusBadge(application.status)}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Client Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Client Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                  <p className="font-medium">{application.first_name} {application.last_name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <p>{application.email}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Phone</label>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <p>{application.phone}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Occupation</label>
                  <p>{application.occupation || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Employer</label>
                  <p>{application.employer || 'N/A'}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Address</label>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                    <p>{application.address}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Monthly Income</label>
                  <p>₦{application.monthly_income ? Number(application.monthly_income).toLocaleString() : 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Created At</label>
                  <p>{new Date(application.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Property Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Property Selection
              </CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Estate</label>
                  <p className="font-medium">{application.estates?.name || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Property</label>
                  <p>{application.properties?.title || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Selected Street</label>
                  <p>{application.selected_street || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Selected House</label>
                  <p>{application.selected_house || 'N/A'}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Payment Plan</label>
                  <p>{application.payment_plan?.replace('musharakah', 'murabahah','outright','ijarah') || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Total Cost</label>
                  <p className="font-bold text-lg">₦{Number(application.total_amount).toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <p className="capitalize">{application.status}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next of Kin */}
          <Card>
            <CardHeader>
              <CardTitle>Next of Kin Information</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Name</label>
                  <p className="font-medium">{application.next_of_kin_name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Phone</label>
                  <p>{application.next_of_kin_phone}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Relationship</label>
                  <p>{application.next_of_kin_relationship}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Address</label>
                  <p>{application.next_of_kin_address}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {application.status === 'rejected' && application.rejection_reason && (
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="text-red-700">Rejection Reason</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-red-600">{application.rejection_reason}</p>
              </CardContent>
            </Card>
          )}

          <Separator />

          {/* Actions */}
          <div className="flex flex-wrap gap-3 justify-end">
            <Button variant="outline" onClick={handleDownloadPDF}>
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
            
            {application.status === 'pending' && (
              <>
                <Button 
                  variant="destructive"
                  onClick={handleReject}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject Application
                </Button>
                <Button 
                  className="bg-green-600 hover:bg-green-700"
                  onClick={handleApprove}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve Application
                </Button>
              </>
            )}

            {application.status === 'approved' && (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Application Approved</span>
              </div>
            )}

            {application.status === 'rejected' && (
              <div className="flex items-center gap-2 text-red-600">
                <XCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Application Rejected</span>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ApplicationDetails;