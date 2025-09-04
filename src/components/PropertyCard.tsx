import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, MapPin, Bed, Bath, Square, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface PropertyCardProps {
  id: string;
  title: string;
  price: string;
  location: string;
  estate: string;
  bedrooms: number;
  bathrooms: number;
  landSize: string;
  buildingSize: string;
  image: string;
  status: "available" | "sold" | "pending";
  featured?: boolean;
}

const PropertyCard = ({
  id,
  title,
  price,
  location,
  estate,
  bedrooms,
  bathrooms,
  landSize,
  buildingSize,
  image,
  status,
  featured = false,
}: PropertyCardProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const statusColors = {
    available: "bg-status-available text-white",
    sold: "bg-status-sold text-white", 
    pending: "bg-status-pending text-white",
  };

  const statusText = {
    available: "Available",
    sold: "Sold",
    pending: "Pending Payment",
  };

  return (
    <Card className="group overflow-hidden shadow-card hover:shadow-elegant transition-all duration-300 border-0 bg-white">
      <div className="relative overflow-hidden">
        {/* Image */}
        <div className="aspect-[4/3] overflow-hidden bg-muted">
          <img
            src={image}
            alt={title}
            className={cn(
              "w-full h-full object-cover transition-all duration-500",
              "group-hover:scale-105",
              imageLoaded ? "opacity-100" : "opacity-0"
            )}
            onLoad={() => setImageLoaded(true)}
          />
          {!imageLoaded && (
            <div className="absolute inset-0 bg-muted animate-pulse" />
          )}
        </div>

        {/* Status Badge */}
        <Badge
          className={cn(
            "absolute top-3 left-3 text-xs font-medium px-2 py-1",
            statusColors[status]
          )}
        >
          {statusText[status]}
        </Badge>

        {/* Featured Badge */}
        {featured && (
          <Badge className="absolute top-3 right-12 bg-amber-500 text-white text-xs font-medium px-2 py-1">
            Featured
          </Badge>
        )}

        {/* Heart Icon */}
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "absolute top-3 right-3 w-8 h-8 p-0 bg-white/90 backdrop-blur-sm",
            "hover:bg-white hover:scale-110 transition-all duration-200",
            isLiked && "text-red-500"
          )}
          onClick={() => setIsLiked(!isLiked)}
        >
          <Heart className={cn("w-4 h-4", isLiked && "fill-current")} />
        </Button>

        {/* View Property Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Link to={`/property/${id}`}>
            <Button className="bg-white text-foreground hover:bg-white/90">
              <Eye className="w-4 h-4 mr-2" />
              View Property
            </Button>
          </Link>
        </div>
      </div>

      <CardContent className="p-6">
        {/* Price & Estate */}
        <div className="flex justify-between items-start mb-3">
          <div>
            <p className="text-2xl font-bold text-primary">{price}</p>
            <p className="text-sm text-muted-foreground">{estate}</p>
          </div>
        </div>

        {/* Title */}
        <Link to={`/property/${id}`}>
          <h3 className="font-semibold text-lg text-foreground mb-2 hover:text-primary transition-colors line-clamp-2">
            {title}
          </h3>
        </Link>

        {/* Location */}
        <div className="flex items-center text-muted-foreground mb-4">
          <MapPin className="w-4 h-4 mr-1" />
          <span className="text-sm">{location}</span>
        </div>

        {/* Property Details */}
        {/* <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div className="flex items-center">
            <Bed className="w-4 h-4 mr-2 text-muted-foreground" />
            <span>{bedrooms} Bedrooms</span>
          </div>
          <div className="flex items-center">
            <Bath className="w-4 h-4 mr-2 text-muted-foreground" />
            <span>{bathrooms} Bathrooms</span>
          </div>
          <div className="flex items-center">
            <Square className="w-4 h-4 mr-2 text-muted-foreground" />
            <span>{landSize} Land</span>
          </div>
          <div className="flex items-center">
            <Square className="w-4 h-4 mr-2 text-muted-foreground" />
            <span>{buildingSize} Built</span>
          </div>
        </div> */}

        {/* CTA Button */}
        <Link to={`/property/${id}`} className="block">
          <Button 
            className="w-full hero-gradient text-white font-medium hover:opacity-90 transition-opacity"
            disabled={status === "sold"}
          >
            {status === "sold" ? "Sold Out" : "View Details"}
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default PropertyCard;