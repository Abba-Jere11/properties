import { Link } from "react-router-dom";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin,
  Home,
  Building2,
  Users,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import LogoLogin from "./logo-login";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Company Info */}
          <div className="space-y-6">
            <div>
              <LogoLogin/>
              <p className="text-slate-300 leading-relaxed">
                Your trusted partner in finding premium properties in Nigeria. 
                Building dreams, creating communities.
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center">
                <MapPin className="w-5 h-5 mr-3 text-red-400" />
                <span className="text-slate-300">87 Samuel Ladoke Boulevard, Garki, Abuja</span>
              </div>
              <div className="flex items-center">
                <Phone className="w-5 h-5 mr-3 text-red-400" />
                <span className="text-slate-300">+234 8096419609</span>
              </div>
              <div className="flex items-center">
                <Mail className="w-5 h-5 mr-3 text-red-400" />
                <span className="text-slate-300">sales@thinklabproperties.com.ng</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-slate-300 hover:text-white flex items-center transition-colors">
                  <Home className="w-4 h-4 mr-2" />
                  Home
                </Link>
              </li>
              <li>
                <Link to="/properties" className="text-slate-300 hover:text-white flex items-center transition-colors">
                  <Building2 className="w-4 h-4 mr-2" />
                  Properties
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-slate-300 hover:text-white flex items-center transition-colors">
                  <Users className="w-4 h-4 mr-2" />
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-slate-300 hover:text-white flex items-center transition-colors">
                  <Phone className="w-4 h-4 mr-2" />
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/apply" className="text-slate-300 hover:text-white flex items-center transition-colors">
                  <FileText className="w-4 h-4 mr-2" />
                  Apply Now
                </Link>
              </li>
            </ul>
          </div>

          {/* Our Estates */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Our Estates</h4>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/properties?estate=bakassi" 
                  className="text-slate-300 hover:text-white transition-colors block"
                >
                  <div className="flex items-center justify-between">
                    <span>Bakassi Estate</span>
                    <Badge variant="secondary" className="text-xs">GRA</Badge>
                  </div>
                  <p className="text-sm text-slate-400 mt-1">Premium bungalows</p>
                </Link>
              </li>
              <li>
                <Link 
                  to="/properties?estate=teachers" 
                  className="text-slate-300 hover:text-white transition-colors block"
                >
                  <div className="flex items-center justify-between">
                    <span>Teachers Village</span>
                    <Badge variant="secondary" className="text-xs">Community</Badge>
                  </div>
                  <p className="text-sm text-slate-400 mt-1">Educational community</p>
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter & Social */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Stay Connected</h4>
            <div className="space-y-4">
              <p className="text-slate-300 text-sm">
                Subscribe to get updates on new properties and exclusive offers.
              </p>
              
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <Button className="hero-gradient text-white px-4">
                  Subscribe
                </Button>
              </div>

              <div className="flex space-x-4 pt-4">
                <Button variant="ghost" size="sm" className="p-2 text-slate-300 hover:text-white hover:bg-slate-800">
                  <Facebook className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="sm" className="p-2 text-slate-300 hover:text-white hover:bg-slate-800">
                  <Twitter className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="sm" className="p-2 text-slate-300 hover:text-white hover:bg-slate-800">
                  <Instagram className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="sm" className="p-2 text-slate-300 hover:text-white hover:bg-slate-800">
                  <Linkedin className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-slate-400 text-sm">
              © {currentYear} Thinklab Properties. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm">
              <Link to="/privacy" className="text-slate-400 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-slate-400 hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link to="/cookies" className="text-slate-400 hover:text-white transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;