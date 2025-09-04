import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { 
  Download, 
  Calendar,
  TrendingUp,
  TrendingDown,
  Building2,
  DollarSign,
  FileText,
  Users,
  Activity,
  Target
} from "lucide-react";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { Skeleton } from "@/components/ui/skeleton";

const AdminReportsPage = () => {
  const [dateRange, setDateRange] = useState("last-month");
  
  const { data: dashboardStats, isLoading, error } = useDashboardStats();

  // Mock data for charts (replace with real data when available)
  const salesData = [
    { month: 'Jan', sales: 45000000, applications: 12, completions: 8 },
    { month: 'Feb', sales: 78000000, applications: 19, completions: 15 },
    { month: 'Mar', sales: 52000000, applications: 15, completions: 12 },
    { month: 'Apr', sales: 89000000, applications: 22, completions: 18 },
    { month: 'May', sales: 125000000, applications: 28, completions: 24 },
    { month: 'Jun', sales: 156000000, applications: 35, completions: 30 },
  ];

  const estatePerformance = [
    { name: 'Bakassi GRA', revenue: 285000000, units: 78, completion: 65 },
    { name: 'Teachers Village', revenue: 156000000, units: 49, completion: 80 },
  ];

  const paymentMethodData = [
    { name: 'Bank Transfer', value: 75, color: '#3b82f6' },
    { name: 'Cash Deposit', value: 20, color: '#10b981' },
    { name: 'Online Payment', value: 5, color: '#f59e0b' },
  ];

  const unitTypeData = [
    { type: '2-Bedroom Bungalow', sold: 45, available: 25, revenue: 225000000 },
    { type: '3-Bedroom Duplex', sold: 32, available: 18, revenue: 168000000 },
    { type: '4-Bedroom Bungalow', sold: 18, available: 12, revenue: 135000000 },
    { type: 'Plot of Land', sold: 25, available: 40, revenue: 62500000 },
  ];

  const auditData = [
    {
      id: 1,
      action: "Application Approved",
      admin: "Admin User",
      details: "APP001 - John Doe approved for Bakassi GRA",
      timestamp: "2024-01-21 10:30:00",
      type: "approval"
    },
    {
      id: 2,
      action: "Receipt Verified",
      admin: "Admin User",
      details: "RCP002 - ₦3,500,000 payment verified for Sarah Johnson",
      timestamp: "2024-01-21 09:15:00",
      type: "verification"
    },
    {
      id: 3,
      action: "Document Generated",
      admin: "System",
      details: "Full Allocation Pack generated for APP002",
      timestamp: "2024-01-21 08:45:00",
      type: "document"
    },
    {
      id: 4,
      action: "User Suspended",
      admin: "Admin User",
      details: "USR003 - Michael Brown suspended due to payment issues",
      timestamp: "2024-01-20 16:20:00",
      type: "user_action"
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Reports & Analytics</h1>
            <p className="text-muted-foreground">Loading analytics...</p>
          </div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Reports & Analytics</h1>
          <p className="text-red-600">Error loading analytics. Please try again.</p>
        </div>
      </div>
    );
  }

  const getActionBadge = (type: string) => {
    const variants = {
      approval: "bg-green-100 text-green-800",
      verification: "bg-blue-100 text-blue-800",
      document: "bg-purple-100 text-purple-800",
      user_action: "bg-orange-100 text-orange-800"
    };
    return (
      <Badge className={variants[type as keyof typeof variants]}>
        {type.replace('_', ' ').charAt(0).toUpperCase() + type.replace('_', ' ').slice(1)}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Reports & Analytics</h1>
          <p className="text-muted-foreground">Comprehensive business intelligence and audit logs</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            Date Range
          </Button>
          <Button>
            <Download className="w-4 h-4 mr-2" />
            Export Reports
          </Button>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(0)}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                Total revenue
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats?.totalApplications || 0}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                All time applications
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Applications</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats?.pendingApplications || 0}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-yellow-600 flex items-center">
                <Calendar className="w-3 h-3 mr-1" />
                Awaiting review
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Estates</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats?.totalSales || 0}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center">
                <Building2 className="w-3 h-3 mr-1" />
                Total estates
              </span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue and Sales Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `₦${(value/1000000).toFixed(0)}M`} />
                <Tooltip formatter={(value: any) => formatCurrency(value)} />
                <Line type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Applications vs Completions</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="applications" fill="#f59e0b" name="Applications" />
                <Bar dataKey="completions" fill="#10b981" name="Completions" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Estate Performance and Payment Methods */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Estate Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {estatePerformance.map((estate, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{estate.name}</h4>
                    <Badge variant="outline">{estate.completion}% Complete</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Revenue</p>
                      <p className="font-medium">{formatCurrency(estate.revenue)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Units Sold</p>
                      <p className="font-medium">{estate.units} units</p>
                    </div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full" 
                      style={{ width: `${estate.completion}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={paymentMethodData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {paymentMethodData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Unit Type Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Unit Type Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Unit Type</th>
                  <th className="text-left p-2">Sold</th>
                  <th className="text-left p-2">Available</th>
                  <th className="text-left p-2">Revenue</th>
                  <th className="text-left p-2">Performance</th>
                </tr>
              </thead>
              <tbody>
                {unitTypeData.map((unit, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-2 font-medium">{unit.type}</td>
                    <td className="p-2">{unit.sold}</td>
                    <td className="p-2">{unit.available}</td>
                    <td className="p-2">{formatCurrency(unit.revenue)}</td>
                    <td className="p-2">
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${(unit.sold / (unit.sold + unit.available)) * 100}%` }}
                        ></div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Audit Log */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="w-5 h-5 mr-2" />
            Audit Log
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {auditData.map((entry) => (
              <div key={entry.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <p className="font-medium">{entry.action}</p>
                      {getActionBadge(entry.type)}
                    </div>
                    <p className="text-sm text-muted-foreground">{entry.details}</p>
                    <p className="text-xs text-muted-foreground">by {entry.admin}</p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">{entry.timestamp}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminReportsPage;