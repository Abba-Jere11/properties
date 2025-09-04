import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  CreditCard, 
  Search, 
  Filter, 
  Download, 
  Check, 
  X, 
  Eye,
  Receipt,
  AlertCircle,
  FileText
} from "lucide-react";
import { usePayments, useVerifyPayment, useRejectPayment } from "@/hooks/usePayments";
import { Skeleton } from "@/components/ui/skeleton";

const PaymentsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: payments, isLoading, error } = usePayments({
    search: searchTerm
  });
  
  const verifyPayment = useVerifyPayment();
  const rejectPayment = useRejectPayment();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Payments & Receipts</h1>
            <p className="text-muted-foreground">Loading payment data...</p>
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
          <h1 className="text-2xl font-bold text-foreground">Payments & Receipts</h1>
          <p className="text-red-600">Error loading payment data. Please try again.</p>
        </div>
      </div>
    );
  }

  const handleVerifyPayment = (paymentId: string) => {
    verifyPayment.mutate(paymentId);
  };

  const handleRejectPayment = (paymentId: string) => {
    const reason = prompt("Please provide a reason for rejection:");
    if (reason) {
      rejectPayment.mutate({ id: paymentId, reason });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-success text-success-foreground">Verified</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "failed":
        return <Badge className="bg-destructive text-destructive-foreground">Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPaymentProgress = (paid: number, total: number) => {
    return total > 0 ? (paid / total) * 100 : 0;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const filteredPayments = payments?.filter(payment =>
    payment.applications?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.applications?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.payment_reference?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Payments & Receipts</h1>
          <p className="text-muted-foreground">Verify payments and manage receipt uploads</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-4 h-4 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">{filteredPayments.filter(p => p.status === 'pending').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Verified</p>
                <p className="text-2xl font-bold">{filteredPayments.filter(p => p.status === 'completed').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <CreditCard className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                <p className="text-xl font-bold">
                  {formatCurrency(filteredPayments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0))}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Receipt className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">This Month</p>
                <p className="text-xl font-bold">
                  {formatCurrency(filteredPayments.filter(p => {
                    const paymentDate = new Date(p.created_at);
                    const thisMonth = new Date();
                    return paymentDate.getMonth() === thisMonth.getMonth() && 
                           paymentDate.getFullYear() === thisMonth.getFullYear();
                  }).reduce((sum, p) => sum + p.amount, 0))}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search payments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="w-5 h-5 mr-2" />
            Payment Records ({filteredPayments.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Payment ID</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Estate</TableHead>
                  <TableHead>Payment Progress</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.map((payment) => {
                  const progress = getPaymentProgress(payment.amount, payment.applications?.total_amount || payment.amount);
                  return (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium">{payment.id.slice(0, 8)}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {payment.applications?.first_name} {payment.applications?.last_name}
                          </p>
                          <p className="text-xs text-muted-foreground">{payment.applications?.id?.slice(0, 8)}</p>
                        </div>
                      </TableCell>
                      <TableCell>Estate</TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>{formatCurrency(payment.amount)}</span>
                            <span className="text-muted-foreground">
                              {formatCurrency(payment.applications?.total_amount || payment.amount)}
                            </span>
                          </div>
                          <Progress value={progress} className="h-2" />
                          <p className="text-xs text-muted-foreground">{progress.toFixed(1)}% paid</p>
                        </div>
                      </TableCell>
                      <TableCell>Installment</TableCell>
                      <TableCell className="font-mono text-sm">{payment.payment_reference || 'N/A'}</TableCell>
                      <TableCell>{getStatusBadge(payment.status)}</TableCell>
                      <TableCell>{new Date(payment.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Payment Details - {payment.id.slice(0, 8)}</DialogTitle>
                                <DialogDescription>
                                  Review payment information and receipt
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-6">
                                {/* Payment Summary */}
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <h4 className="font-medium">Payment Information</h4>
                                    <div className="text-sm space-y-1">
                                      <p><span className="font-medium">Client:</span> {payment.applications?.first_name} {payment.applications?.last_name}</p>
                                      <p><span className="font-medium">Plan:</span> Installment</p>
                                      <p><span className="font-medium">Method:</span> {payment.payment_method || 'Bank Transfer'}</p>
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <h4 className="font-medium">Amount Details</h4>
                                    <div className="text-sm space-y-1">
                                      <p><span className="font-medium">Total:</span> {formatCurrency(payment.applications?.total_amount || payment.amount)}</p>
                                      <p><span className="font-medium">This Payment:</span> {formatCurrency(payment.amount)}</p>
                                      <p><span className="font-medium">Reference:</span> {payment.payment_reference || 'N/A'}</p>
                                    </div>
                                  </div>
                                </div>

                                {/* Actions */}
                                {payment.status === "pending" && (
                                  <div className="border-t pt-4 flex gap-3">
                                    <Button
                                      onClick={() => handleVerifyPayment(payment.id)}
                                      className="flex-1"
                                      disabled={verifyPayment.isPending}
                                    >
                                      <Check className="w-4 h-4 mr-2" />
                                      Verify Payment
                                    </Button>
                                    <Button
                                      variant="destructive"
                                      onClick={() => handleRejectPayment(payment.id)}
                                      className="flex-1"
                                      disabled={rejectPayment.isPending}
                                    >
                                      <X className="w-4 h-4 mr-2" />
                                      Reject Payment
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </DialogContent>
                          </Dialog>

                          {payment.status === "pending" && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => handleVerifyPayment(payment.id)}
                                disabled={verifyPayment.isPending}
                              >
                                <Check className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleRejectPayment(payment.id)}
                                disabled={rejectPayment.isPending}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentsPage;