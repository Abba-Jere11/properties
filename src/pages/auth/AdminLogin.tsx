import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { UserCog, Eye, EyeOff, ArrowLeft, UserPlus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("Admin");
  const [lastName, setLastName] = useState("User");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const { signIn, signUp, user, isAdmin, loading, profile } = useAuth();

  // Debug logging
  console.log('AdminLogin - user:', user?.email, 'isAdmin:', isAdmin, 'profile:', profile);

  // Redirect if already logged in as admin
  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>;
  }
  
  if (user && isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  // If user exists but isn't admin, show error
  if (user && !isAdmin && profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">Access Denied</h2>
          <p className="text-muted-foreground mb-4">
            You are logged in as {user.email} but don't have admin access.
            Current role: {profile.role}
          </p>
          <Button onClick={() => window.location.href = '/'}>Go Home</Button>
        </div>
      </div>
    );
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await signIn(email, password);
    
    if (error) {
      console.error("Login error:", error);
    }
    
    setIsLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await signUp(email, password, firstName, lastName);
    
    if (error) {
      console.error("Sign up error:", error);
    } else {
      // Switch back to login view after successful signup
      setIsSignUp(false);
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-muted/30 to-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back to Home */}
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>

        <Card className="shadow-elegant border-0">
          <CardHeader className="text-center pb-6">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <UserCog className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">
              {isSignUp ? "Create Admin Account" : "Admin Login"}
            </CardTitle>
            <p className="text-muted-foreground">
              {isSignUp ? "Set up your admin dashboard" : "Access your admin dashboard"}
            </p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={isSignUp ? handleSignUp : handleLogin} className="space-y-4">
              {isSignUp && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        placeholder="Enter first name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        placeholder="Enter last name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                        className="h-11"
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder={isSignUp ? "Create a password" : "Enter your password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-11 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-11 hero-gradient text-white font-medium"
                disabled={isLoading}
              >
                {isLoading 
                  ? (isSignUp ? "Creating Account..." : "Signing In...") 
                  : (isSignUp ? "Create Admin Account" : "Sign In")
                }
              </Button>
            </form>

            <div className="mt-6 text-center space-y-4">
              <Button 
                type="button"
                variant="outline" 
                className="w-full"
                onClick={() => setIsSignUp(!isSignUp)}
                disabled={isLoading}
              >
                <UserPlus className="w-4 h-4 mr-2" />
                {isSignUp ? "Already have an account? Sign In" : "Create New Admin Account"}
              </Button>

              <p className="text-sm text-muted-foreground">
                Not an admin?{" "}
                <Link to="/client/login" className="text-primary hover:underline font-medium">
                  Client Login
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground">
            © 2024 Thinklab Properties. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;