import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Index from "./pages/Index";
import Properties from "./pages/Properties";
import PropertyDetail from "./pages/PropertyDetail";
import Apply from "./pages/Apply";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

// Auth Pages
import AdminLogin from "./pages/auth/AdminLogin";
import ClientLogin from "./pages/auth/ClientLogin";
import Login from "./pages/auth/Login";

// Admin Dashboard
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminApplicationsPage from "./pages/admin/Applications";
import AdminReceiptsPage from "./pages/admin/Receipts";
import AdminEstatesPage from "./pages/admin/Estates";
import AdminDocumentsPage from "./pages/admin/Documents";
import AdminUsersPage from "./pages/admin/Users";
import AdminReportsPage from "./pages/admin/Reports";
import AdminSettingsPage from "./pages/admin/Settings";

// Client Dashboard  
import ClientLayout from "./components/client/ClientLayout";
import ClientDashboard from "./pages/client/Dashboard";
import ClientReceiptsPage from "./pages/client/Receipts";
import ClientDocumentsPage from "./pages/client/Documents";
import ClientNotificationsPage from "./pages/client/Notifications";
import ClientProfilePage from "./pages/client/Profile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/properties" element={<Properties />} />
            <Route path="/property/:id" element={<PropertyDetail />} />
            <Route path="/apply" element={<Apply />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            
            {/* General Login Route */}
            <Route 
              path="/login" 
              element={
                <ProtectedRoute requireAuth={false}>
                  <Login />
                </ProtectedRoute>
              } 
            />
            
            {/* Auth Routes */}
            <Route 
              path="/admin/login" 
              element={
                <ProtectedRoute requireAuth={false} redirectTo="/admin">
                  <AdminLogin />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/client/login" 
              element={
                <ProtectedRoute requireAuth={false} redirectTo="/client">
                  <ClientLogin />
                </ProtectedRoute>
              } 
            />
            
            {/* Admin Dashboard Routes */}
            <Route path="/admin" element={
              <ProtectedRoute requireAdmin={true}>
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route index element={<AdminDashboard />} />
              <Route path="applications" element={<AdminApplicationsPage />} />
              <Route path="receipts" element={<AdminReceiptsPage />} />
              <Route path="estates" element={<AdminEstatesPage />} />
              <Route path="documents" element={<AdminDocumentsPage />} />
              <Route path="users" element={<AdminUsersPage />} />
              <Route path="reports" element={<AdminReportsPage />} />
              <Route path="settings" element={<AdminSettingsPage />} />
            </Route>

            {/* Client Dashboard Routes */}
            <Route path="/client" element={
              <ProtectedRoute requireClient={true}>
                <ClientLayout />
              </ProtectedRoute>
            }>
              <Route index element={<ClientDashboard />} />
              <Route path="receipts" element={<ClientReceiptsPage />} />
              <Route path="documents" element={<ClientDocumentsPage />} />
              <Route path="notifications" element={<ClientNotificationsPage />} />
              <Route path="profile" element={<ClientProfilePage />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
