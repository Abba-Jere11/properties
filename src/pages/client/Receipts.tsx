import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Eye, Download, Calendar } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const ClientReceiptsPage = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const mockReceipts = [
    {
      id: 1,
      fileName: "payment_receipt_001.pdf",
      uploadDate: "2024-01-15",
      amount: "₦2,500,000",
      status: "approved",
      description: "Initial payment - 50%"
    },
    {
      id: 2,
      fileName: "bank_transfer_002.jpg",
      uploadDate: "2024-01-10",
      amount: "₦1,250,000",
      status: "pending",
      description: "Second installment"
    },
    {
      id: 3,
      fileName: "receipt_003.pdf",
      uploadDate: "2024-01-05",
      amount: "₦500,000",
      status: "rejected",
      description: "Documentation fee",
      rejectionReason: "Receipt image unclear, please reupload"
    }
  ];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      toast({
        title: "Receipt Uploaded",
        description: "Your receipt has been submitted for verification.",
      });
      setSelectedFile(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      approved: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      rejected: "bg-red-100 text-red-800"
    };
    return (
      <Badge className={variants[status as keyof typeof variants]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Receipt Management</h1>
        <p className="text-muted-foreground">Upload and track your payment receipts</p>
      </div>

      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Upload className="w-5 h-5 mr-2" />
            Upload New Receipt
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="receipt">Select Receipt File (PDF or Image)</Label>
            <Input
              id="receipt"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileSelect}
            />
          </div>
          {selectedFile && (
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span className="text-sm">{selectedFile.name}</span>
              <Button onClick={handleUpload}>
                Upload Receipt
              </Button>
            </div>
          )}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Bank Details for Payment</h4>
            <div className="text-sm text-blue-800 space-y-1">
              <p><strong>Account Name:</strong> Thinklab Properties - Bakassi Estate</p>
              <p><strong>Bank:</strong> Zenith Bank</p>
              <p><strong>Account Number:</strong> 0512044944</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Receipts History */}
      <Card>
        <CardHeader>
          <CardTitle>Receipt History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockReceipts.map((receipt) => (
              <div key={receipt.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <div>
                      <p className="font-medium">{receipt.fileName}</p>
                      <p className="text-sm text-muted-foreground">{receipt.description}</p>
                      {receipt.status === 'rejected' && receipt.rejectionReason && (
                        <p className="text-sm text-red-600 mt-1">{receipt.rejectionReason}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="text-sm text-muted-foreground flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {receipt.uploadDate}
                    </span>
                    <span className="font-medium">{receipt.amount}</span>
                    {getStatusBadge(receipt.status)}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientReceiptsPage;