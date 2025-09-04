import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, Clock, MessageCircle, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "",
    interest: "",
    message: "",
    consent: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.message) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.consent) {
      toast({
        title: "Consent Required",
        description: "Please agree to receive communications.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Message Sent!",
        description: "Thank you for contacting us. We'll get back to you within 24 hours.",
      });
      setIsSubmitting(false);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        subject: "",
        interest: "",
        message: "",
        consent: false
      });
    }, 1000);
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Phone Number",
      details: ["+234 (0) 812 300 0067",],
      action: "Call Now"
    },
    {
      icon: Mail,
      title: "Email Address",
      details: ["info@thinklabproperties.com.ng", "sales@thinklabproperties.com.ng"],
      action: "Send Email"
    },
    {
      icon: MapPin,
      title: "Office Address",
      details: ["87 Samuel ladoke Boulevard", "Garki, Abuja, Nigeria"],
      action: "Get Directions"
    },
    {
      icon: Clock,
      title: "Working Hours",
      details: ["Monday - Friday: 8:00 AM - 5:00 PM", ],
      action: "Visit Us"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Header */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
            Contact Us
          </h1>
          <p className="text-xl text-muted-foreground">
            Ready to find your dream home? Get in touch with our team today.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-primary mb-4">Get In Touch</h2>
                <p className="text-muted-foreground">
                  We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                </p>
              </div>

              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <Card key={index} className="border-0 shadow-card">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                            <info.icon className="w-6 h-6 text-primary" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-primary mb-2">{info.title}</h3>
                          <div className="space-y-1">
                            {info.details.map((detail, idx) => (
                              <p key={idx} className="text-sm text-muted-foreground">{detail}</p>
                            ))}
                          </div>
                          <Button variant="outline" size="sm" className="mt-3">
                            {info.action}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Quick Actions */}
              <Card className="border-0 shadow-card bg-muted/30">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-primary mb-4">Quick Contact</h3>
                  <div className="space-y-3">
                    <Button className="w-full hero-gradient text-white">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      WhatsApp Chat
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Phone className="w-4 h-4 mr-2" />
                      Request Callback
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-elegant">
              <CardHeader>
                <CardTitle className="text-2xl text-primary">Send Us a Message</CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input 
                        id="firstName" 
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder="Your first name" 
                        className="mt-2" 
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input 
                        id="lastName" 
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        placeholder="Your last name" 
                        className="mt-2" 
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input 
                        id="email" 
                        name="email"
                        type="email" 
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="your.email@example.com" 
                        className="mt-2" 
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input 
                        id="phone" 
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+234 xxx xxx xxxx" 
                        className="mt-2" 
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Input 
                      id="subject" 
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="What is this regarding?" 
                      className="mt-2" 
                    />
                  </div>

                  <div>
                    <Label htmlFor="interest">I'm interested in</Label>
                    <select 
                      name="interest"
                      value={formData.interest}
                      onChange={handleInputChange}
                      className="w-full mt-2 px-3 py-2 border border-input rounded-md bg-background"
                    >
                      <option value="">Select an option</option>
                      <option value="bakassi">Bakassi Estate Properties</option>
                      <option value="teachers">Teachers Village Properties</option>
                      <option value="general">General Inquiry</option>
                      <option value="payment">Payment Plans</option>
                      <option value="viewing">Schedule a Viewing</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="message">Message *</Label>
                    <Textarea 
                      id="message" 
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Tell us more about your inquiry..." 
                      className="mt-2 min-h-[120px]" 
                      required
                    />
                  </div>

                  <div className="flex items-start space-x-2">
                    <input 
                      type="checkbox" 
                      id="consent" 
                      name="consent"
                      checked={formData.consent}
                      onChange={handleInputChange}
                      className="mt-1" 
                      required
                    />
                    <Label htmlFor="consent" className="text-sm text-muted-foreground">
                      I agree to receive communications from Thinklab Properties regarding my inquiry.
                    </Label>
                  </div>

                  <Button 
                    type="submit"
                    className="w-full hero-gradient text-white py-3"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 mr-2 animate-spin" />
                        Sending Message...
                      </>
                    ) : (
                      "Send Message"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Map Section */}
        {/* <section className="mt-16">
          <Card className="border-0 shadow-card">
            <CardHeader>
              <CardTitle className="text-center">Visit Our Office</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-96 bg-muted flex items-center justify-center text-muted-foreground relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10"></div>
                <div className="text-center relative z-10">
                  <MapPin className="w-12 h-12 mx-auto mb-4 text-primary" />
                  <h3 className="text-lg font-semibold mb-2">Our Location</h3>
                  <p className="text-muted-foreground mb-1">Plot 123, Baga Road</p>
                  <p className="text-muted-foreground mb-4">Maiduguri, Borno State</p>
                  <Button variant="outline" className="hero-gradient text-white border-0">
                    Get Directions
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section> */}
      </div>
      
      <Footer />
    </div>
  );
};

export default Contact;