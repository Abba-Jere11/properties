import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Home, 
  MapPin, 
  CreditCard, 
  FileText, 
  Calendar, 
  AlertCircle,
  CheckCircle,
  Download,
  Upload,
  Bell,
  XCircle
} from "lucide-react";
import bakassiHero from "@/assets/bakassi-estate-hero.jpg";
import { useClientDashboard } from "@/hooks/useClientDashboard";
import { Skeleton } from "@/components/ui/skeleton";

const ClientDashboard = () => {
  const { data: dashboardData, isLoading, error } = useClientDashboard();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-6">
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Skeleton className="h-96" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-64" />
            <Skeleton className="h-32" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Client Dashboard</h1>
          <p className="text-red-600">Error loading dashboard data. Please try again.</p>
        </div>
      </div>
    );
  }

  if (!dashboardData) return null;

  const paymentProgress = dashboardData.paymentProgress;
  const remainingAmount = dashboardData.totalAmount - dashboardData.totalPaid;
  const currentApplication = dashboardData.applications[0]; // Get first/main application

  const propertyFeatures = [
    "Land: 700 sqm",
    "Building: 180 sqm", 
    "2 Bedrooms",
    "2 Sitting Rooms",
    "Kitchen",
    "3 Toilets",
    "Backyard: 100 sqm",
    "Fenced Estate",
    "33KVA Electricity",
    "Water Reticulation",
    "Green Landscape",
    "Nearby Mall & School"
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusBadge = () => {
    if (paymentProgress >= 100) {
      return <Badge className="bg-success text-success-foreground">Fully Allocated</Badge>;
    } else if (paymentProgress >= 50) {
      return <Badge className="bg-blue-100 text-blue-800">Provisional Allocation</Badge>;
    } else {
      return <Badge className="bg-yellow-100 text-yellow-800">Pending Payment</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-6">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Welcome back, Jere! 👋
        </h1>
        <p className="text-muted-foreground">
          Here's an overview of your property purchase with Thinklab Properties
        </p>
      </div>

      {/* Purchase Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Property Details */}
        <div className="lg:col-span-2">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Home className="w-5 h-5 mr-2 text-primary" />
                  Property Overview
                </div>
                {getStatusBadge()}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Estate Image */}
              <div className="relative h-48 rounded-lg overflow-hidden">
                <img
                  src={bakassiHero}
                  alt={currentApplication?.estate_name || 'Estate'}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-bold">{currentApplication?.estate_name || 'Estate'}</h3>
                  <p className="text-sm opacity-90">{currentApplication?.estate_name || 'Estate'}</p>
                </div>
              </div>

              {/* Selected Units */}
              <div>
                <h4 className="font-medium mb-3 flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-primary" />
                  Selected Properties
                </h4>
                <div className="space-y-2">
                  {currentApplication ? (
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <span className="font-medium">
                        {currentApplication.selected_street} - {currentApplication.selected_house}
                      </span>
                    </div>
                  ) : (
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <span className="font-medium">No property selected</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Property Features */}
              <div>
                <h4 className="font-medium mb-3">Property Features</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {propertyFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center text-sm">
                      <CheckCircle className="w-4 h-4 text-success mr-2 flex-shrink-0" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment Summary */}
        <div className="space-y-6">
          {/* Payment Progress */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="w-5 h-5 mr-2 text-primary" />
                Payment Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">
                  {paymentProgress.toFixed(1)}%
                </div>
                <Progress value={paymentProgress} className="h-3 mb-2" />
                <p className="text-sm text-muted-foreground">
                  {formatCurrency(dashboardData.totalPaid)} of {formatCurrency(dashboardData.totalAmount)}
                </p>
              </div>

              <div className="space-y-3 pt-4 border-t">
                <div className="flex justify-between text-sm">
                  <span>Total Amount:</span>
                  <span className="font-medium">{formatCurrency(dashboardData.totalAmount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Amount Paid:</span>
                  <span className="font-medium text-success">{formatCurrency(dashboardData.totalPaid)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Balance:</span>
                  <span className="font-medium text-primary">{formatCurrency(remainingAmount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Payment Plan:</span>
                  <span className="font-medium">{currentApplication?.payment_plan?.replace('_', ' ') || 'N/A'}</span>
                </div>
              </div>

              <Button className="w-full mt-4">
                <Upload className="w-4 h-4 mr-2" />
                Upload Receipt
              </Button>
            </CardContent>
          </Card>

          {/* Next Payment Due */}
          <Card className="shadow-card">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">Next Payment Due</p>
                  <p className="text-xs text-muted-foreground">{dashboardData.nextPaymentDue || 'TBD'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="w-4 h-4 mr-2" />
                Download Documents
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Download className="w-4 h-4 mr-2" />
                Payment History
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <AlertCircle className="w-4 h-4 mr-2" />
                Contact Support
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Activity */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="w-5 h-5 mr-2 text-primary" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dashboardData.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start space-x-4 p-3 rounded-lg border border-border">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  activity.status === "success" ? "bg-success/10" : 
                  activity.status === "pending" ? "bg-yellow-100" : "bg-muted"
                }`}>
                  {activity.icon === 'CheckCircle' && <CheckCircle className={`w-4 h-4 ${
                    activity.status === "success" ? "text-success" :
                    activity.status === "pending" ? "text-yellow-600" : "text-muted-foreground"
                  }`} />}
                  {activity.icon === 'Upload' && <Upload className={`w-4 h-4 ${
                    activity.status === "success" ? "text-success" :
                    activity.status === "pending" ? "text-yellow-600" : "text-muted-foreground"
                  }`} />}
                  {activity.icon === 'FileText' && <FileText className={`w-4 h-4 ${
                    activity.status === "success" ? "text-success" :
                    activity.status === "pending" ? "text-yellow-600" : "text-muted-foreground"
                  }`} />}
                  {activity.icon === 'XCircle' && <XCircle className={`w-4 h-4 ${
                    activity.status === "success" ? "text-success" :
                    activity.status === "pending" ? "text-yellow-600" : "text-muted-foreground"
                  }`} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-sm">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{new Date(activity.date).toLocaleDateString()}</p>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientDashboard;