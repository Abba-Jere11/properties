import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Bell, 
  CheckCircle, 
  AlertCircle, 
  FileText, 
  CreditCard,
  Clock
} from "lucide-react";
import { useNotifications, useMarkAllNotificationsAsRead, useMarkNotificationAsRead, useUnreadNotificationCount } from "@/hooks/useNotifications";

const ClientNotificationsPage = () => {
  const { data: notifications = [], isLoading } = useNotifications();
  const { data: unreadCount = 0 } = useUnreadNotificationCount();
  const markAllRead = useMarkAllNotificationsAsRead();
  const markAsRead = useMarkNotificationAsRead();

  const getNotificationIcon = (type: string) => {
    const iconClass = "w-5 h-5";
    switch (type) {
      case 'success':
        return <CheckCircle className={`${iconClass} text-green-600`} />;
      case 'warning':
        return <AlertCircle className={`${iconClass} text-yellow-600`} />;
      case 'info':
        return <Bell className={`${iconClass} text-blue-600`} />;
      default:
        return <Bell className={`${iconClass} text-gray-600`} />;
    }
  };

  const getNotificationBadge = (type: string) => {
    const variants = {
      success: "bg-green-100 text-green-800",
      warning: "bg-yellow-100 text-yellow-800",
      info: "bg-blue-100 text-blue-800"
    };
    
    const labels = {
      success: "Approved",
      warning: "Reminder",
      info: "Update"
    };

    return (
      <Badge className={variants[type as keyof typeof variants]}>
        {labels[type as keyof typeof labels]}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
          <p className="text-muted-foreground">Stay updated with your property purchase</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary">
            {unreadCount} unread
          </Badge>
          <Button variant="outline" size="sm" onClick={() => markAllRead.mutate()} disabled={markAllRead.isPending}>
            Mark All Read
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="font-medium">2 Approved</p>
              <p className="text-sm text-muted-foreground">Recent approvals</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="font-medium">{notifications.filter(n => n.type === 'info').length} Updates</p>
              <p className="text-sm text-muted-foreground">New documents and updates</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center space-x-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="font-medium">1 Reminder</p>
              <p className="text-sm text-muted-foreground">Pending actions</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notifications List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`flex items-start space-x-4 p-4 rounded-lg border transition-colors ${
                  !notification.is_read ? 'bg-muted/50 border-primary/20' : 'bg-background'
                }`}
              >
                <div className="flex-shrink-0 mt-0.5">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className={`font-medium ${!notification.is_read ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {notification.title}
                    </h4>
                    <div className="flex items-center space-x-2">
                      {getNotificationBadge(notification.type)}
                      {!notification.is_read && (
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {notification.message}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {new Date(notification.created_at).toLocaleString()}
                    </span>
                    {!notification.is_read && (
                      <Button variant="outline" size="sm" onClick={() => markAsRead.mutate(notification.id)}>
                        Mark read
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Email Notifications</p>
              <p className="text-sm text-muted-foreground">Receive updates via email</p>
            </div>
            <Button variant="outline" size="sm">
              Enabled
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">SMS Notifications</p>
              <p className="text-sm text-muted-foreground">Receive updates via SMS</p>
            </div>
            <Button variant="outline" size="sm">
              Disabled
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientNotificationsPage;