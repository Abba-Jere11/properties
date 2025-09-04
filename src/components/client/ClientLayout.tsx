import { Outlet, Link, useLocation } from "react-router-dom";
import { 
  Home, 
  Receipt, 
  FileText, 
  Bell, 
  User,
  LogOut,
  Menu,
  X,
  Phone,
  MessageCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useUnreadNotificationCount } from "@/hooks/useNotifications";
import { useReceipts } from "@/hooks/useReceipts";
import { useApplications } from "@/hooks/useApplications";
import { useAuth } from "@/contexts/AuthContext";

const ClientLayout = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { data: unreadCount = 0 } = useUnreadNotificationCount();
  const { data: receipts = [] } = useReceipts();
  const { data: applications = [] } = useApplications();
  const { user } = useAuth();
  const clientApp = applications[0];

  const navigation = [
    { name: "Overview", href: "/client", icon: Home },
    { name: "Receipts", href: "/client/receipts", icon: Receipt, badge: receipts.length ? String(receipts.length) : undefined },
    { name: "Documents", href: "/client/documents", icon: FileText },
    { name: "Notifications", href: "/client/notifications", icon: Bell, badge: unreadCount ? String(unreadCount) : undefined },
    { name: "Profile", href: "/client/profile", icon: User },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar */}
      <div className={cn(
        "fixed inset-0 z-50 lg:hidden",
        sidebarOpen ? "block" : "hidden"
      )}>
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
        <div className="fixed left-0 top-0 h-full w-64 bg-card border-r border-border shadow-elegant">
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 className="text-xl font-bold text-primary">My Dashboard</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          <nav className="p-4 space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-white"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <div className="flex items-center">
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </div>
                  {item.badge && (
                    <Badge variant="secondary" className="ml-auto">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex min-h-0 flex-1 flex-col bg-card border-r border-border">
          <div className="flex items-center justify-center p-6 border-b border-border">
            <div className="text-center">
              <h2 className="text-xl font-bold text-primary">My Property</h2>
              <p className="text-sm text-muted-foreground">Client Dashboard</p>
            </div>
          </div>
          
          {/* Client Info Card */}
          <div className="p-4 border-b border-border">
            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-sm font-medium text-white">{(user?.email?.[0] || 'U').toUpperCase()}</span>
                </div>
                <div>
                  <p className="font-medium text-sm">{user?.email || 'Unknown User'}</p>
                  <p className="text-xs text-muted-foreground">{clientApp?.id ? clientApp.id.slice(0,8) : 'No App ID'}</p>
                </div>
              </div>
              <div className="text-xs space-y-1">
                <p><span className="font-medium">Estate:</span> {clientApp?.estates?.name || '—'}</p>
                <p><span className="font-medium">Status:</span> 
                  <Badge className="ml-1">{clientApp?.status || '—'}</Badge>
                </p>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-white"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <div className="flex items-center">
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </div>
                  {item.badge && (
                    <Badge variant="secondary" className="ml-auto">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Support Section */}
          <div className="p-4 border-t border-border space-y-2">
            <Button variant="ghost" className="w-full justify-start text-muted-foreground" size="sm">
              <Phone className="w-4 h-4 mr-3" />
              Call Support
            </Button>
            <Button variant="ghost" className="w-full justify-start text-muted-foreground" size="sm">
              <MessageCircle className="w-4 h-4 mr-3" />
              WhatsApp Chat
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start text-muted-foreground" 
              size="sm"
              onClick={() => {
                window.location.href = '/';
              }}
            >
              <LogOut className="w-4 h-4 mr-3" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top header */}
        <header className="bg-card border-b border-border shadow-sm">
          <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </Button>
              <h1 className="ml-4 lg:ml-0 text-xl font-semibold text-foreground">
                {navigation.find(item => item.href === location.pathname)?.name || "Dashboard"}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-5 h-5" />
                <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs bg-primary">
                  {unreadCount}
                </Badge>
              </Button>
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <span className="text-sm font-medium text-white">JD</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ClientLayout;