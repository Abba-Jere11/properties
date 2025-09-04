import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Filter, SlidersHorizontal, Grid, List, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Navigation from "@/components/Navigation";
import SearchBar from "@/components/SearchBar";
import PropertyCard from "@/components/PropertyCard";
import { properties } from "@/data/properties";

const Properties = () => {
  const [searchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("newest");
  const [filterEstate, setFilterEstate] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterBedrooms, setFilterBedrooms] = useState("all");
  const [filterPriceRange, setFilterPriceRange] = useState("all");

  // Get estate from URL params
  const estateParam = searchParams.get("estate");
  
  // Initialize filter from URL params
  useMemo(() => {
    if (estateParam) {
      if (estateParam === "bakassi") setFilterEstate("Bakassi Estate");
      if (estateParam === "teachers") setFilterEstate("Teachers Village");
    }
  }, [estateParam]);

  // Filter and sort properties
  const filteredProperties = useMemo(() => {
    let filtered = [...properties];

    // Filter by estate
    if (filterEstate !== "all") {
      filtered = filtered.filter(property => property.estate === filterEstate);
    }

    // Filter by status
    if (filterStatus !== "all") {
      filtered = filtered.filter(property => property.status === filterStatus);
    }

    // Filter by bedrooms
    if (filterBedrooms !== "all") {
      filtered = filtered.filter(property => property.bedrooms.toString() === filterBedrooms);
    }

    // Filter by price range
    if (filterPriceRange !== "all") {
      if (filterPriceRange === "0-30m") {
        filtered = filtered.filter(property => property.priceNumeric < 30000000);
      } else if (filterPriceRange === "30m-40m") {
        filtered = filtered.filter(property => property.priceNumeric >= 30000000 && property.priceNumeric <= 40000000);
      } else if (filterPriceRange === "40m+") {
        filtered = filtered.filter(property => property.priceNumeric > 40000000);
      }
    }

    // Sort properties
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.priceNumeric - b.priceNumeric);
        break;
      case "price-high":
        filtered.sort((a, b) => b.priceNumeric - a.priceNumeric);
        break;
      case "newest":
      default:
        // Keep original order for newest
        break;
    }

    return filtered;
  }, [filterEstate, filterStatus, filterBedrooms, filterPriceRange, sortBy]);

  const estateCounts = {
    bakassi: properties.filter(p => p.estate === "Bakassi Estate").length,
    teachers: properties.filter(p => p.estate === "Teachers Village").length,
  };

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Estate Filter */}
      <div>
        <h3 className="font-semibold mb-3">Estate</h3>
        <Select value={filterEstate} onValueChange={setFilterEstate}>
          <SelectTrigger>
            <SelectValue placeholder="All Estates" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Estates</SelectItem>
            <SelectItem value="Bakassi Estate">Bakassi Estate ({estateCounts.bakassi})</SelectItem>
            <SelectItem value="Teachers Village">Teachers Village ({estateCounts.teachers})</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Status Filter */}
      <div>
        <h3 className="font-semibold mb-3">Availability</h3>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger>
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="available">Available</SelectItem>
            <SelectItem value="pending">Pending Payment</SelectItem>
            <SelectItem value="sold">Sold</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Bedrooms Filter */}
      <div>
        <h3 className="font-semibold mb-3">Bedrooms</h3>
        <Select value={filterBedrooms} onValueChange={setFilterBedrooms}>
          <SelectTrigger>
            <SelectValue placeholder="All Bedrooms" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Bedrooms</SelectItem>
            <SelectItem value="1">1 Bedroom</SelectItem>
            <SelectItem value="2">2 Bedrooms</SelectItem>
            <SelectItem value="3">3 Bedrooms</SelectItem>
            <SelectItem value="4">4+ Bedrooms</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Price Range Filter */}
      <div>
        <h3 className="font-semibold mb-3">Price Range</h3>
        <Select value={filterPriceRange} onValueChange={setFilterPriceRange}>
          <SelectTrigger>
            <SelectValue placeholder="All Prices" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Prices</SelectItem>
            <SelectItem value="0-30m">₦0 - ₦30M</SelectItem>
            <SelectItem value="30m-40m">₦30M - ₦40M</SelectItem>
            <SelectItem value="40m+">₦40M+</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Clear Filters */}
      <Button 
        variant="outline" 
        className="w-full"
        onClick={() => {
          setFilterEstate("all");
          setFilterStatus("all");
          setFilterBedrooms("all");
          setFilterPriceRange("all");
        }}
      >
        Clear All Filters
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Header */}
      {/* <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              {estateParam === "bakassi" && "Bakassi Estate Properties"}
              {estateParam === "teachers" && "Teachers Village Properties"}
              {!estateParam && "All Properties"}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover premium properties in Maiduguri's most desirable locations
            </p>
          </div>
          <SearchBar />
        </div>
      </section> */}
      <section className="py-8 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
            Thinklab Properties
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
           Discover luxury living in Nigeria's most prestigious residential and commercial developments
          </p>
        </div>
      </section>


      {/* Results Section */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Desktop Filters Sidebar */}
            {/* <div className="hidden lg:block w-80">
              <Card className="p-6 sticky top-24">
                <div className="flex items-center mb-6">
                  <Filter className="w-5 h-5 mr-2" /> 
                  <h2 className="text-lg font-semibold">Filters</h2>
                </div>
                <FilterContent />
              </Card>
            </div> */}

            {/* Main Content */}
            <div className="flex-1">
              {/* Controls Bar */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div className="flex items-center gap-4">
                  {/* <p className="text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">{filteredProperties.length}</span> properties found
                  </p> */}
                  
                  {/* Estate badges */}
                  {/* {filterEstate !== "all" && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {filterEstate}
                    </Badge>
                  )} */}
                </div>

                <div className="flex items-center gap-4">
                  {/* Mobile Filters */}
                  {/* <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="sm" className="lg:hidden">
                        <SlidersHorizontal className="w-4 h-4 mr-2" />
                        Filters
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-80">
                      <SheetHeader>
                        <SheetTitle>Filter Properties</SheetTitle>
                        <SheetDescription>
                          Refine your search to find the perfect property
                        </SheetDescription>
                      </SheetHeader>
                      <div className="mt-6">
                        <FilterContent />
                      </div>
                    </SheetContent>
                  </Sheet>  */}

                  {/* Sort Dropdown */}
                   {/* <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                    </SelectContent>
                  </Select> */}

                  {/* View Mode Toggle */}
                   <div className="hidden sm:flex border rounded-lg p-1">
                    <Button
                      variant={viewMode === "grid" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("grid")}
                      className="px-3"
                    >
                      <Grid className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("list")}
                      className="px-3"
                    >
                      <List className="w-4 h-4" />
                    </Button>
                  </div> 
                </div>
              </div>

              {/* Properties Grid */}
              {filteredProperties.length === 0 ? (
                <Card className="p-12 text-center">
                  {/* <div className="text-muted-foreground">
                    <MapPin className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-semibold mb-2">No properties found</h3>
                    <p>Try adjusting your filters to see more results.</p>
                  </div> */}
                </Card>
              ) : (
                <div className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 gap-6"
                    : "space-y-6"
                }>
                  {filteredProperties.map((property) => (
                    <PropertyCard key={property.id} {...property} />
                  ))}
                </div>
              )}

              {/* Load More Button (for future pagination) */}
              {filteredProperties.length > 0 && (
                <div className="text-center mt-12">
                  <p className="text-sm text-muted-foreground mb-4">
                    Showing {filteredProperties.length} of {properties.length} properties
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Properties;
