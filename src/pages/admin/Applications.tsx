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
  Download, 
  CheckCircle, 
  XCircle, 
  Search,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import ApplicationDetails from "@/components/admin/ApplicationDetails";
import { useApplications, useApproveApplication, useRejectApplication } from "@/hooks/useApplications";
import { Skeleton } from "@/components/ui/skeleton";


const AdminApplicationsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);

  const { data: applications, isLoading, error } = useApplications({
    search: searchTerm,
    status: statusFilter === "all" ? undefined : statusFilter
  });

  const approveApplication = useApproveApplication();
  const rejectApplication = useRejectApplication();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Applications Management</h1>
            <p className="text-muted-foreground">Loading applications...</p>
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
          <h1 className="text-2xl font-bold text-foreground">Applications Management</h1>
          <p className="text-red-600">Error loading applications. Please try again.</p>
        </div>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount);
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

  const handleApprove = (applicationId: string) => {
    approveApplication.mutate(applicationId);
  };

  const handleReject = (applicationId: string) => {
    // In a real app, you'd show a modal to collect rejection reason
    const reason = prompt("Please provide a reason for rejection:");
    if (reason) {
      rejectApplication.mutate({ id: applicationId, reason });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Applications Management</h1>
          <p className="text-muted-foreground">Review and manage property purchase applications</p>
        </div>
        <Button>
          <Download className="w-4 h-4 mr-2" />
          Export Applications
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search applications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Applications Table */}
      <Card>
        <CardHeader>
          <CardTitle>Applications List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Application ID</TableHead>
                  <TableHead>Applicant</TableHead>
                  <TableHead>Estate & Location</TableHead>
                  <TableHead>Units</TableHead>
                  <TableHead>Payment Plan</TableHead>
                  <TableHead>Total Cost</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications?.map((application) => (
                  <TableRow key={application.id}>
                    <TableCell className="font-medium">{application.id.slice(0, 8)}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{application.first_name} {application.last_name}</p>
                        <p className="text-sm text-muted-foreground">{application.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{application.estates?.name}</p>
                        <p className="text-sm text-muted-foreground">{application.selected_street}, {application.selected_house}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">1</TableCell>
                    <TableCell>{application.payment_plan.replace('_', ' ')}</TableCell>
                    <TableCell className="font-medium">{formatCurrency(application.total_amount)}</TableCell>
                    <TableCell>{getStatusBadge(application.status)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setSelectedApplication(application);
                            setShowDetails(true);
                          }}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        {application.status === 'pending' && (
                          <>
                            <Button 
                              size="sm" 
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => handleApprove(application.id)}
                              disabled={approveApplication.isPending}
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => handleReject(application.id)}
                              disabled={rejectApplication.isPending}
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <ApplicationDetails
        application={selectedApplication}
        isOpen={showDetails}
        onClose={() => {
          setShowDetails(false);
          setSelectedApplication(null);
        }}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
};

export default AdminApplicationsPage;