import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone, Mail, MessageCircle, ChevronDown, UserCog, User, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import LogoLogin from "./logo-login";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Properties", href: "/properties" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 ">
           <LogoLogin/>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  isActive(item.href)
                    ? "text-primary border-b-2 border-primary"
                    : "text-muted-foreground"
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Phone className="w-4 h-4" />
              <span>+234 (0)8096419609</span>
            </div>
            
            {/* Login Dropdown */}
            <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
              <DropdownMenuTrigger asChild>
                <Button size="sm" className="hero-gradient text-white font-medium">
                  Login
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                className="w-48 bg-white border border-border shadow-elegant z-50" 
                align="end"
              >
                {/* <DropdownMenuItem asChild>
                  <Link 
                    to="/admin/login" 
                    className="flex items-center px-4 py-2 text-sm hover:bg-muted transition-colors"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <UserCog className="w-4 h-4 mr-2" />
                    Admin Login
                  </Link>
                </DropdownMenuItem> */}
                <DropdownMenuItem asChild>
                  <Link 
                    to="/client/login" 
                    className="flex items-center px-4 py-2 text-sm hover:bg-muted transition-colors"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <User className="w-4 h-4 mr-2" />
                    Client Login
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link 
                    to="/apply" 
                    className="flex items-center px-4 py-2 text-sm text-primary hover:bg-primary/10 transition-colors font-medium"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Apply for Property
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden border-t border-border bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "block px-3 py-2 text-base font-medium rounded-md transition-colors",
                    isActive(item.href)
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-primary hover:bg-muted"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="border-t border-border mt-4 pt-4">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-3 px-3">
                  <Phone className="w-4 h-4" />
                  <span>+234 (0) 08123000067</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-4 px-3">
                  <Mail className="w-4 h-4" />
                  <span>sales@thinklabproperties.com.ng</span>
                </div>
                <div className="px-3 space-y-2">
                  {/* <Link to="/admin/login">
                    <Button variant="outline" className="w-full justify-start" onClick={() => setIsOpen(false)}>
                      <UserCog className="w-4 h-4 mr-2" />
                      Admin Login
                    </Button>
                  </Link> */}
                  <Link to="/client/login">
                    <Button variant="outline" className="w-full justify-start" onClick={() => setIsOpen(false)}>
                      <User className="w-4 h-4 mr-2" />
                      Client Login
                    </Button>
                  </Link>
                  <Link to="/apply">
                    <Button className="w-full hero-gradient text-white font-medium" onClick={() => setIsOpen(false)}>
                      Apply for Property
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;