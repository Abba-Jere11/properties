import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, Mail, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isloading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubscribed(true);
      setIsLoading(false);
      toast({
        title: "Successfully Subscribed!",
        description: "You'll receive updates about new properties and exclusive offers.",
      });
    }, 1000);
  };

  if (isSubscribed) {
    return (
      <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">You're All Set!</h3>
          <p className="text-muted-foreground">
            Welcome to the Thinklab Properties family. You'll receive updates about new properties,
            exclusive offers, and market insights.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-elegant">
      <CardHeader className="text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="w-8 h-8 text-primary" />
        </div>
        <CardTitle className="text-2xl">Stay Updated</CardTitle>
        <p className="text-muted-foreground">
          Get the latest property listings, exclusive offers, and market insights delivered to your inbox.
        </p>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="newsletter-email">Email Address</Label>
            <Input
              id="newsletter-email"
              type="email"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2"
              disabled={isloading}
            />
          </div>
          
          <div className="flex items-start space-x-2">
            <input 
              type="checkbox" 
              id="newsletter-consent" 
              className="mt-1" 
              required 
            />
            <Label htmlFor="newsletter-consent" className="text-sm text-muted-foreground">
              I agree to receive marketing communications from Thinklab Properties. 
              You can unsubscribe at any time.
            </Label>
          </div>

          <Button 
            type="submit" 
            className="w-full hero-gradient text-white" 
            disabled={isloading}
          >
            {isloading ? (
              "Subscribing..."
            ) : (
              <>
                Subscribe Now
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground">
            Join over 500+ property investors who trust us for market insights.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default Newsletter;