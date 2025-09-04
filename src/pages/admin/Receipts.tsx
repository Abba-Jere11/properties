import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Eye, 
  CheckCircle, 
  XCircle, 
  Search,
  CreditCard,
  Calendar,
  FileImage,
  FileText as FileTextIcon,
  Download,
  Upload
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useReceipts } from "@/hooks/useReceipts";
import { Skeleton } from "@/components/ui/skeleton";

const AdminReceiptsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: receipts, isLoading, error } = useReceipts({
    search: searchTerm,
    status: statusFilter === "all" ? undefined : statusFilter
  });

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

  const getFileIcon = (fileType: string) => {
    return fileType === 'pdf' ? 
      <FileTextIcon className="w-4 h-4 text-red-600" /> : 
      <FileImage className="w-4 h-4 text-blue-600" />;
  };

  const handleApprove = (receiptId: string, clientName: string) => {
    toast({
      title: "Receipt Approved",
      description: `Receipt ${receiptId} approved. Documents generated for ${clientName}.`,
    });
  };

  const handleReject = (receiptId: string) => {
    toast({
      title: "Receipt Rejected",
      description: `Receipt ${receiptId} rejected. Client notified with reason.`,
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Receipts Management</h1>
            <p className="text-muted-foreground">Loading receipts...</p>
          </div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Receipts Management</h1>
          <p className="text-red-600">Error loading receipts. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Receipts Management</h1>
          <p className="text-muted-foreground">Review and verify payment receipts from clients</p>
        </div>
        <Button>
          <Download className="w-4 h-4 mr-2" />
          Export Receipts
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Upload className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{receipts?.length || 0}</p>
                <p className="text-sm text-muted-foreground">Total Receipts</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{receipts?.filter(r => r.payments?.status === 'completed').length || 0}</p>
                <p className="text-sm text-muted-foreground">Approved</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <XCircle className="w-5 h-5 text-red-600" />
              <div>
                <p className="text-2xl font-bold">{receipts?.filter(r => r.payments?.status === 'failed').length || 0}</p>
                <p className="text-sm text-muted-foreground">Rejected</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold">{receipts?.filter(r => r.payments?.status === 'pending').length || 0}</p>
                <p className="text-sm text-muted-foreground">Pending Review</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search receipts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex space-x-2">
              <Button 
                variant={statusFilter === "all" ? "default" : "outline"}
                onClick={() => setStatusFilter("all")}
                size="sm"
              >
                All
              </Button>
              <Button 
                variant={statusFilter === "pending" ? "default" : "outline"}
                onClick={() => setStatusFilter("pending")}
                size="sm"
              >
                Pending
              </Button>
              <Button 
                variant={statusFilter === "approved" ? "default" : "outline"}
                onClick={() => setStatusFilter("approved")}
                size="sm"
              >
                Approved
              </Button>
              <Button 
                variant={statusFilter === "rejected" ? "default" : "outline"}
                onClick={() => setStatusFilter("rejected")}
                size="sm"
              >
                Rejected
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Receipts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Receipts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Receipt ID</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Application ID</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>File</TableHead>
                  <TableHead>Upload Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
               </TableHeader>
               <TableBody>
                 {receipts?.map((receipt) => (
                   <TableRow key={receipt.id}>
                     <TableCell className="font-medium">{receipt.receipt_number}</TableCell>
                     <TableCell>
                       <div>
                         <p className="font-medium">{receipt.profiles?.first_name} {receipt.profiles?.last_name}</p>
                         <p className="text-sm text-muted-foreground">{receipt.profiles?.email}</p>
                       </div>
                     </TableCell>
                     <TableCell>{receipt.payments?.application_id?.slice(0, 8)}</TableCell>
                     <TableCell className="font-medium">{formatCurrency(receipt.amount)}</TableCell>
                     <TableCell>
                       <div className="flex items-center space-x-2">
                         <FileTextIcon className="w-4 h-4 text-red-600" />
                         <span className="text-sm truncate max-w-[100px]">{receipt.receipt_number}.pdf</span>
                       </div>
                     </TableCell>
                     <TableCell>{new Date(receipt.created_at).toLocaleDateString()}</TableCell>
                     <TableCell>{getStatusBadge(receipt.payments?.status || 'pending')}</TableCell>
                     <TableCell>
                       <div className="flex space-x-2">
                         <Button variant="outline" size="sm">
                           <Eye className="w-4 h-4 mr-1" />
                           View
                         </Button>
                         {receipt.payments?.status === 'pending' && (
                           <>
                             <Button 
                               size="sm" 
                               className="bg-green-600 hover:bg-green-700"
                               onClick={() => handleApprove(receipt.id, `${receipt.profiles?.first_name} ${receipt.profiles?.last_name}`)}
                             >
                               <CheckCircle className="w-4 h-4 mr-1" />
                               Approve
                             </Button>
                             <Button 
                               variant="destructive" 
                               size="sm"
                               onClick={() => handleReject(receipt.id)}
                             >
                               <XCircle className="w-4 h-4 mr-1" />
                               Reject
                             </Button>
                           </>
                         )}
                       </div>
                     </TableCell>
                   </TableRow>
                 )) || []}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Payment Processing Info */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-6">
          <h3 className="font-medium text-green-900 mb-2">Automatic Document Generation</h3>
          <div className="text-sm text-green-800 space-y-1">
            <p>• <strong>First Payment (Any Amount):</strong> Generates Offer Letter</p>
            <p>• <strong>≥50% Payment:</strong> Generates Provisional Allocation Letter</p>
            <p>• <strong>100% Payment:</strong> Generates Full Allocation Pack (Sales Agreement, Deed of Assignment)</p>
            <p>• All documents are automatically emailed to clients and stored in their dashboard</p>
          </div>
        </CardContent>
      </Card>

      {/* Bank Account Information */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <h3 className="font-medium text-blue-900 mb-2">Payment Account Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
            <div>
              <p><strong>Bakassi Estate Account:</strong></p>
              <p>Account Name: Thinklab Properties - Bakassi Estate</p>
              <p>Bank: Zenith Bank</p>
              <p>Account Number: 0512044944</p>
            </div>
            <div>
              <p><strong>Teachers Village Account:</strong></p>
              <p>Account Name: Thinklab Properties - Teachers Village</p>
              <p>Bank: First Bank</p>
              <p>Account Number: 2011223344</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminReceiptsPage;