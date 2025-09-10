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
  User, 
  Eye, 
  UserX, 
  Search,
  Mail,
  Phone,
  Calendar,
  FileText,
  CreditCard,
  Shield,
  UserPlus,
  MoreVertical,
  Edit
} from "lucide-react";
import { useProfiles, useProfileStats, useUpdateProfileStatus } from "@/hooks/useProfiles";
import { CreateClientDialog } from "@/components/admin/CreateClientDialog";
import { Skeleton } from "@/components/ui/skeleton";

const AdminUsersPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [userTypeFilter, setUserTypeFilter] = useState("all");

  const { data: profiles, isLoading, error } = useProfiles({
    role: userTypeFilter === "all" ? undefined : userTypeFilter,
    search: searchTerm
  });

  const { data: stats } = useProfileStats();
  const updateStatus = useUpdateProfileStatus();

  const getUserTypeBadge = (userType: string) => {
    const variants = {
      client: "bg-blue-100 text-blue-800",
      admin: "bg-red-100 text-red-800",
      agent: "bg-green-100 text-green-800",
      staff: "bg-purple-100 text-purple-800"
    };
    return (
      <Badge className={variants[userType as keyof typeof variants]}>
        {userType.charAt(0).toUpperCase() + userType.slice(1)}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "bg-green-100 text-green-800",
      suspended: "bg-red-100 text-red-800",
      inactive: "bg-gray-100 text-gray-800"
    };
    return (
      <Badge className={variants[status as keyof typeof variants]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const handleToggleStatus = (profile: any) => {
    updateStatus.mutate({ id: profile.id, is_active: !profile.is_active });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">User Management</h1>
            <p className="text-muted-foreground">Loading users...</p>
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
          <h1 className="text-2xl font-bold text-foreground">User Management</h1>
          <p className="text-red-600">Error loading users. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">User Management</h1>
          <p className="text-muted-foreground">Manage clients, agents, staff, and admin users</p>
        </div>
        <CreateClientDialog />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <User className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{stats?.totalClients || 0}</p>
                <p className="text-sm text-muted-foreground">Total Clients</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-red-600" />
              <div>
                <p className="text-2xl font-bold">{stats?.totalAdmins || 0}</p>
                <p className="text-sm text-muted-foreground">Admin Users</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <User className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{stats?.totalAgents || 0}</p>
                <p className="text-sm text-muted-foreground">Agents</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <UserX className="w-5 h-5 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">{stats?.suspended || 0}</p>
                <p className="text-sm text-muted-foreground">Suspended</p>
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
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex space-x-2">
              <Button 
                variant={userTypeFilter === "all" ? "default" : "outline"}
                onClick={() => setUserTypeFilter("all")}
                size="sm"
              >
                All
              </Button>
              <Button 
                variant={userTypeFilter === "client" ? "default" : "outline"}
                onClick={() => setUserTypeFilter("client")}
                size="sm"
              >
                Clients
              </Button>
              <Button 
                variant={userTypeFilter === "admin" ? "default" : "outline"}
                onClick={() => setUserTypeFilter("admin")}
                size="sm"
              >
                Admins
              </Button>
              <Button 
                variant={userTypeFilter === "agent" ? "default" : "outline"}
                onClick={() => setUserTypeFilter("agent")}
                size="sm"
              >
                Agents
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Estate</TableHead>
                  <TableHead>Activity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
               </TableHeader>
               <TableBody>
                 {profiles?.map((profile) => (
                   <TableRow key={profile.id}>
                     <TableCell>
                       <div className="flex items-center space-x-3">
                         <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                           <span className="text-sm font-medium text-white">
                             {profile.first_name.charAt(0)}
                           </span>
                         </div>
                         <div>
                           <p className="font-medium">{profile.first_name} {profile.last_name}</p>
                           <p className="text-sm text-muted-foreground">{profile.id.slice(0, 8)}</p>
                         </div>
                       </div>
                     </TableCell>
                     <TableCell>
                       <div className="space-y-1">
                         <div className="flex items-center text-sm">
                           <Mail className="w-3 h-3 mr-1 text-muted-foreground" />
                           {profile.email}
                         </div>
                         <div className="flex items-center text-sm text-muted-foreground">
                           <Phone className="w-3 h-3 mr-1" />
                           {profile.phone || 'N/A'}
                         </div>
                       </div>
                     </TableCell>
                     <TableCell>{getUserTypeBadge(profile.role)}</TableCell>
                     <TableCell>
                       <span className="text-sm text-muted-foreground">N/A</span>
                     </TableCell>
                     <TableCell>
                       <span className="text-sm text-muted-foreground">
                         Joined: {new Date(profile.created_at).toLocaleDateString()}
                       </span>
                     </TableCell>
                     <TableCell>{getStatusBadge(profile.is_active ? 'active' : 'inactive')}</TableCell>
                     <TableCell>
                       <div className="flex space-x-2">
                         <Button variant="outline" size="sm">
                           <Eye className="w-4 h-4 mr-1" />
                           View
                         </Button>
                         <Button variant="outline" size="sm">
                           <Edit className="w-4 h-4 mr-1" />
                           Edit
                         </Button>
                         <Button 
                           variant={profile.is_active ? "destructive" : "outline"} 
                           size="sm"
                           onClick={() => handleToggleStatus(profile)}
                           disabled={updateStatus.isPending}
                         >
                           <UserX className="w-4 h-4 mr-1" />
                           {profile.is_active ? 'Suspend' : 'Activate'}
                         </Button>
                       </div>
                     </TableCell>
                   </TableRow>
                 )) || []}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* User Management Info */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <h3 className="font-medium text-blue-900 mb-2">User Management Features</h3>
          <div className="text-sm text-blue-800 space-y-1">
            <p>• <strong>View Profile:</strong> See complete user details, applications, and activity history</p>
            <p>• <strong>Client Dashboard:</strong> Direct access to client's property purchase status</p>
            <p>• <strong>Suspend/Activate:</strong> Control user access to the system</p>
            <p>• <strong>Role Management:</strong> Assign different permission levels (Client, Agent, Admin)</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUsersPage;