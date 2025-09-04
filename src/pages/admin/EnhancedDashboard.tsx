import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  FileText, 
  CreditCard, 
  DollarSign, 
  Home,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Eye,
  Download,
  Calendar,
  Bell,
  Activity,
  BarChart3,
  PieChart,
  ArrowUp,
  ArrowDown
} from "lucide-react";

const EnhancedDashboard = () => {
  // Mock data - in real app this would come from APIs
  const kpiData = {
    totalApplications: 247,
    applicationsChange: "+12%",
    pendingApprovals: 23,
    approvalsChange: "-5%",
    totalRevenue: 1250000000,
    revenueChange: "+18%",
    unitsSold: 89,
    unitsChange: "+8%"
  };

  const estateData = [
    {
      name: "Bakassi Estate",
      totalUnits: 50,
      sold: 32,
      available: 18,
      revenue: 850000000,
      progress: 64
    },
    {
      name: "Teachers Village", 
      totalUnits: 40,
      sold: 25,
      available: 15,
      revenue: 400000000,
      progress: 62.5
    }
  ];

  const recentApplications = [
    {
      id: "APP-001",
      client: "Ahmed Ibrahim",
      estate: "Bakassi Estate",
      amount: 35000000,
      status: "pending",
      date: "2024-03-10",
      priority: "high"
    },
    {
      id: "APP-002",
      client: "Fatima Usman",
      estate: "Teachers Village", 
      amount: 28000000,
      status: "approved",
      date: "2024-03-09",
      priority: "normal"
    },
    {
      id: "APP-003",
      client: "Muhammad Ali",
      estate: "Bakassi Estate",
      amount: 45000000, 
      status: "review",
      date: "2024-03-08",
      priority: "high"
    },
    {
      id: "APP-004",
      client: "Aisha Musa",
      estate: "Teachers Village",
      amount: 32000000,
      status: "pending",
      date: "2024-03-07",
      priority: "normal"
    }
  ];

  const pendingReceipts = [
    {
      id: "RCP-001",
      client: "Ahmed Ibrahim",
      estate: "Bakassi Estate", 
      amount: 17500000,
      type: "Bank Transfer",
      date: "2024-03-10",
      urgency: "high"
    },
    {
      id: "RCP-002",
      client: "Khadija Yusuf",
      estate: "Teachers Village",
      amount: 14000000,
      type: "Cash Deposit",
      date: "2024-03-09",
      urgency: "medium"
    },
    {
      id: "RCP-003",
      client: "Ibrahim Suleiman",
      estate: "Bakassi Estate",
      amount: 22500000,
      type: "Cheque",
      date: "2024-03-08",
      urgency: "low"
    }
  ];

  const notifications = [
    {
      id: 1,
      type: "urgent",
      title: "Payment Overdue",
      message: "3 clients have overdue payments totaling ₦52M",
      time: "2 hours ago"
    },
    {
      id: 2,
      type: "info", 
      title: "New Application",
      message: "Maryam Hassan submitted application for Bakassi Estate",
      time: "4 hours ago"
    },
    {
      id: 3,
      type: "success",
      title: "Receipt Verified",
      message: "₦35M payment verified for Ahmed Ibrahim",
      time: "6 hours ago"
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const config = {
      pending: { color: "bg-yellow-500", text: "Pending" },
      approved: { color: "bg-green-500", text: "Approved" },
      rejected: { color: "bg-red-500", text: "Rejected" },
      review: { color: "bg-blue-500", text: "Under Review" }
    };
    const statusConfig = config[status as keyof typeof config] || config.pending;
    return (
      <Badge className={`${statusConfig.color} text-white text-xs`}>
        {statusConfig.text}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const config = {
      high: { color: "text-red-600", icon: AlertTriangle },
      normal: { color: "text-blue-600", icon: Clock },
      low: { color: "text-gray-600", icon: Clock }
    };
    const priorityConfig = config[priority as keyof typeof config];
    const Icon = priorityConfig.icon;
    return (
      <div className={`flex items-center ${priorityConfig.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        <span className="text-xs capitalize">{priority}</span>
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening with your properties.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button className="hero-gradient text-white">
            <Activity className="w-4 h-4 mr-2" />
            Real-time View
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Applications</p>
                <p className="text-3xl font-bold">{kpiData.totalApplications}</p>
                <div className="flex items-center text-sm mt-1">
                  <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-green-500">{kpiData.applicationsChange}</span>
                  <span className="text-muted-foreground ml-1">vs last month</span>
                </div>
              </div>
              <FileText className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Approvals</p>
                <p className="text-3xl font-bold text-yellow-600">{kpiData.pendingApprovals}</p>
                <div className="flex items-center text-sm mt-1">
                  <ArrowDown className="w-4 h-4 text-red-500 mr-1" />
                  <span className="text-red-500">{kpiData.approvalsChange}</span>
                  <span className="text-muted-foreground ml-1">vs last month</span>
                </div>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(kpiData.totalRevenue)}
                </p>
                <div className="flex items-center text-sm mt-1">
                  <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-green-500">{kpiData.revenueChange}</span>
                  <span className="text-muted-foreground ml-1">vs last month</span>
                </div>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Units Sold</p>
                <p className="text-3xl font-bold text-blue-600">{kpiData.unitsSold}</p>
                <div className="flex items-center text-sm mt-1">
                  <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-green-500">{kpiData.unitsChange}</span>
                  <span className="text-muted-foreground ml-1">vs last month</span>
                </div>
              </div>
              <Home className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Estate Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Estate Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {estateData.map((estate, index) => (
                <div key={index} className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold">{estate.name}</h3>
                    <Badge variant="outline">{estate.sold}/{estate.totalUnits} Sold</Badge>
                  </div>
                  
                  <Progress value={estate.progress} className="h-2" />
                  
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Revenue</p>
                      <p className="font-semibold">{formatCurrency(estate.revenue)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Available</p>
                      <p className="font-semibold text-green-600">{estate.available}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Progress</p>
                      <p className="font-semibold text-blue-600">{estate.progress}%</p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Applications */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Recent Applications
                </CardTitle>
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentApplications.map((app) => (
                  <div key={app.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{app.client}</h4>
                        <p className="text-sm text-muted-foreground">{app.estate}</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-semibold">{formatCurrency(app.amount)}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {getStatusBadge(app.status)}
                        {getPriorityBadge(app.priority)}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-3 h-3" />
                      </Button>
                      {app.status === 'pending' && (
                        <Button size="sm" className="hero-gradient text-white">
                          Review
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Pending Receipts */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Pending Receipt Verification
                </CardTitle>
                <Badge variant="secondary">
                  {pendingReceipts.length} Pending
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingReceipts.map((receipt) => (
                  <div key={receipt.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{receipt.client}</h4>
                        <p className="text-sm text-muted-foreground">
                          {receipt.estate} • {receipt.type}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-semibold">{formatCurrency(receipt.amount)}</p>
                      <p className="text-sm text-muted-foreground">{receipt.date}</p>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-3 h-3 mr-1" />
                        View
                      </Button>
                      <Button size="sm" className="hero-gradient text-white">
                        Verify
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start hero-gradient text-white">
                <FileText className="w-4 h-4 mr-2" />
                Review Applications
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <CreditCard className="w-4 h-4 mr-2" />
                Verify Payments
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Home className="w-4 h-4 mr-2" />
                Manage Properties
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Users className="w-4 h-4 mr-2" />
                Manage Users
              </Button>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Recent Notifications
                </CardTitle>
                <Badge variant="destructive">
                  {notifications.filter(n => n.type === 'urgent').length}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {notifications.map((notification) => (
                <div key={notification.id} className="space-y-2">
                  <div className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      notification.type === 'urgent' ? 'bg-red-500' :
                      notification.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                    }`} />
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold">{notification.title}</h4>
                      <p className="text-xs text-muted-foreground mb-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground">{notification.time}</p>
                    </div>
                  </div>
                  {notification.id < notifications.length && (
                    <div className="border-b border-border" />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Calendar/Schedule */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Today's Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 p-2 bg-blue-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Site Visit</p>
                  <p className="text-xs text-muted-foreground">Bakassi Estate - 10:00 AM</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-2 bg-yellow-50 rounded-lg">
                <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Client Meeting</p>
                  <p className="text-xs text-muted-foreground">Ahmed Ibrahim - 2:00 PM</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-2 bg-green-50 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Document Review</p>
                  <p className="text-xs text-muted-foreground">Legal Team - 4:00 PM</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EnhancedDashboard;