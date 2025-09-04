import { useState } from "react";
import { Search, MapPin, Home, DollarSign, Bed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <Card className="p-6 shadow-elegant bg-white/95 backdrop-blur-sm border-0">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* Location */}
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Select>
            <SelectTrigger className="pl-10 border-muted">
              <SelectValue placeholder="Estate" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bakassi">Bakassi Estate</SelectItem>
              <SelectItem value="teachers">Teachers Village</SelectItem>
              <SelectItem value="all">All Estates</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Property Type */}
        <div className="relative">
          <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Select>
            <SelectTrigger className="pl-10 border-muted">
              <SelectValue placeholder="Property Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bungalow">Bungalow</SelectItem>
              <SelectItem value="duplex">Duplex</SelectItem>
              <SelectItem value="apartment">Apartment</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Price Range */}
        <div className="relative">
          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Select>
            <SelectTrigger className="pl-10 border-muted">
              <SelectValue placeholder="Price Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0-30m">₦0 - ₦30M</SelectItem>
              <SelectItem value="30m-40m">₦30M - ₦40M</SelectItem>
              <SelectItem value="40m+">₦40M+</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Bedrooms */}
        <div className="relative">
          <Bed className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Select>
            <SelectTrigger className="pl-10 border-muted">
              <SelectValue placeholder="Bedrooms" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 Bedroom</SelectItem>
              <SelectItem value="2">2 Bedrooms</SelectItem>
              <SelectItem value="3">3 Bedrooms</SelectItem>
              <SelectItem value="4+">4+ Bedrooms</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Search Button */}
        <Button className="hero-gradient text-white font-medium h-10">
          <Search className="w-4 h-4 mr-2" />
          Search Properties
        </Button>
      </div>
    </Card>
  );
};

export default SearchBar;