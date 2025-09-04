import { Link } from "react-router-dom";
import { Home, ArrowLeft, Phone, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navigation from "@/components/Navigation";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Card className="text-center shadow-elegant border-0">
          <CardContent className="p-12">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 mb-6">
                <Home className="w-12 h-12 text-primary" />
              </div>
              <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Page Not Found
              </h2>
              <p className="text-lg text-muted-foreground max-w-md mx-auto">
                The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/">
                  <Button className="hero-gradient text-white px-6">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Home
                  </Button>
                </Link>
                <Link to="/properties">
                  <Button variant="outline" className="px-6">
                    Browse Properties
                  </Button>
                </Link>
              </div>

              <div className="pt-8 border-t border-border">
                <p className="text-sm text-muted-foreground mb-4">
                  Need help finding what you're looking for?
                </p>
                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                  <Button variant="outline" size="sm">
                    <Phone className="w-4 h-4 mr-2" />
                    Call Support
                  </Button>
                  <Button variant="outline" size="sm">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Live Chat
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Popular Links */}
        <div className="mt-12">
          <h3 className="text-lg font-semibold text-center mb-6">Popular Pages</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            <Link 
              to="/" 
              className="text-center p-4 rounded-lg hover:bg-muted transition-colors"
            >
              <Home className="w-6 h-6 mx-auto mb-2 text-primary" />
              <span className="text-sm font-medium">Home</span>
            </Link>
            <Link 
              to="/properties" 
              className="text-center p-4 rounded-lg hover:bg-muted transition-colors"
            >
              <Home className="w-6 h-6 mx-auto mb-2 text-primary" />
              <span className="text-sm font-medium">Properties</span>
            </Link>
            <Link 
              to="/about" 
              className="text-center p-4 rounded-lg hover:bg-muted transition-colors"
            >
              <Home className="w-6 h-6 mx-auto mb-2 text-primary" />
              <span className="text-sm font-medium">About</span>
            </Link>
            <Link 
              to="/contact" 
              className="text-center p-4 rounded-lg hover:bg-muted transition-colors"
            >
              <Home className="w-6 h-6 mx-auto mb-2 text-primary" />
              <span className="text-sm font-medium">Contact</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
