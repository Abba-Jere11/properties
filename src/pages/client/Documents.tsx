import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Calendar, CheckCircle } from "lucide-react";

const ClientDocumentsPage = () => {
  const mockDocuments = [
    {
      id: 1,
      name: "Application Form",
      description: "Completed property purchase application",
      status: "available",
      dateGenerated: "2024-01-15",
      type: "application"
    },
    {
      id: 2,
      name: "Offer Letter",
      description: "Official property offer letter",
      status: "available",
      dateGenerated: "2024-01-16",
      type: "offer"
    },
    {
      id: 3,
      name: "Provisional Allocation Letter",
      description: "Property allocation confirmation (50% payment)",
      status: "available",
      dateGenerated: "2024-01-18",
      type: "allocation"
    },
    {
      id: 4,
      name: "Sales Agreement",
      description: "Legal sales agreement document",
      status: "pending",
      dateGenerated: null,
      type: "agreement",
      requirement: "100% payment completed"
    },
    {
      id: 5,
      name: "Deed of Assignment",
      description: "Property ownership transfer document",
      status: "pending",
      dateGenerated: null,
      type: "deed",
      requirement: "100% payment completed"
    },
    {
      id: 6,
      name: "Certificate of Occupancy",
      description: "Government-issued occupancy certificate",
      status: "pending",
      dateGenerated: null,
      type: "certificate",
      requirement: "Available when property development is complete"
    }
  ];

  const getDocumentIcon = (type: string) => {
    return <FileText className="w-5 h-5 text-primary" />;
  };

  const getStatusBadge = (status: string) => {
    if (status === 'available') {
      return (
        <Badge className="bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          Available
        </Badge>
      );
    }
    return (
      <Badge className="bg-yellow-100 text-yellow-800">
        Pending
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">My Documents</h1>
        <p className="text-muted-foreground">Download and manage your property documents</p>
      </div>

      {/* Document Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Document Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Documents Generated</span>
              <span className="text-sm text-muted-foreground">3 of 6 complete</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div className="bg-primary h-2 rounded-full" style={{ width: '50%' }}></div>
            </div>
            <p className="text-xs text-muted-foreground">
              Complete your payment to unlock additional documents
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Documents List */}
      <div className="grid gap-4">
        {mockDocuments.map((document) => (
          <Card key={document.id} className={document.status === 'pending' ? 'opacity-75' : ''}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {getDocumentIcon(document.type)}
                  <div>
                    <h3 className="font-medium">{document.name}</h3>
                    <p className="text-sm text-muted-foreground">{document.description}</p>
                    {document.status === 'pending' && document.requirement && (
                      <p className="text-xs text-orange-600 mt-1">
                        Requirement: {document.requirement}
                      </p>
                    )}
                    {document.dateGenerated && (
                      <div className="flex items-center text-xs text-muted-foreground mt-1">
                        <Calendar className="w-3 h-3 mr-1" />
                        Generated: {document.dateGenerated}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {getStatusBadge(document.status)}
                  {document.status === 'available' && (
                    <Button size="sm">
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Help Section */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <h3 className="font-medium text-blue-900 mb-2">Need Help?</h3>
          <p className="text-sm text-blue-800 mb-4">
            If you have questions about your documents or need assistance, please contact our support team.
          </p>
          <Button variant="outline" size="sm">
            Contact Support
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientDocumentsPage;