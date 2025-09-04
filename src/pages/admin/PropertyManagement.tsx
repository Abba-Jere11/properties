import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  Eye,
  MapPin,
  Home,
  DollarSign,
  Bed,
  Bath,
  Square,
  Upload
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const PropertyManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstate, setFilterEstate] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isAddingProperty, setIsAddingProperty] = useState(false);
  const { toast } = useToast();

  // Mock properties data - in real app this would come from database
  const [properties, setProperties] = useState([
    {
      id: "PROP-001",
      title: "Modern 3-Bedroom Bungalow",
      estate: "Bakassi Estate",
      type: "Bungalow",
      bedrooms: 3,
      bathrooms: 2,
      area: "600 sqm",
      price: 35000000,
      status: "available",
      description: "Beautiful modern bungalow with premium finishes and spacious rooms.",
      features: ["Fitted Kitchen", "Parking Space", "Security House", "Boys Quarter"],
      images: ["/src/assets/property-1.jpg"],
      location: "Plot 15, Block A",
      dateAdded: "2024-01-15"
    },
    {
      id: "PROP-002", 
      title: "Luxury 4-Bedroom Duplex",
      estate: "Teachers Village",
      type: "Duplex",
      bedrooms: 4,
      bathrooms: 3,
      area: "800 sqm",
      price: 45000000,
      status: "sold",
      description: "Spacious duplex perfect for large families with modern amenities.",
      features: ["Master Suite", "Study Room", "Guest Toilet", "Garden Space"],
      images: ["/src/assets/property-2.jpg"],
      location: "Plot 8, Teachers Block",
      dateAdded: "2024-01-10"
    },
    {
      id: "PROP-003",
      title: "Executive 2-Bedroom Flat",
      estate: "Bakassi Estate", 
      type: "Apartment",
      bedrooms: 2,
      bathrooms: 2,
      area: "400 sqm",
      price: 25000000,
      status: "pending",
      description: "Well-designed apartment with modern fixtures and fittings.",
      features: ["Open Plan", "Built-in Wardrobe", "Balcony", "Parking"],
      images: ["/src/assets/property-3.jpg"],
      location: "Plot 22, Block C",
      dateAdded: "2024-01-20"
    }
  ]);

  const [newProperty, setNewProperty] = useState({
    title: "",
    estate: "",
    type: "",
    bedrooms: "",
    bathrooms: "",
    area: "",
    price: "",
    description: "",
    features: "",
    location: "",
    status: "available"
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      available: { color: "bg-green-500", text: "Available" },
      sold: { color: "bg-red-500", text: "Sold" },
      pending: { color: "bg-yellow-500", text: "Pending" }
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <Badge className={`${config.color} text-white`}>
        {config.text}
      </Badge>
    );
  };

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEstate = filterEstate === "all" || property.estate === filterEstate;
    const matchesStatus = filterStatus === "all" || property.status === filterStatus;
    
    return matchesSearch && matchesEstate && matchesStatus;
  });

  const handleAddProperty = () => {
    if (!newProperty.title || !newProperty.estate || !newProperty.price) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const property = {
      id: `PROP-${String(properties.length + 1).padStart(3, '0')}`,
      ...newProperty,
      price: parseInt(newProperty.price),
      bedrooms: parseInt(newProperty.bedrooms),
      bathrooms: parseInt(newProperty.bathrooms),
      features: newProperty.features.split(',').map(f => f.trim()).filter(f => f),
      images: ["/placeholder.svg"],
      dateAdded: new Date().toISOString().split('T')[0]
    };

    setProperties([...properties, property]);
    setNewProperty({
      title: "",
      estate: "",
      type: "",
      bedrooms: "",
      bathrooms: "",
      area: "",
      price: "",
      description: "",
      features: "",
      location: "",
      status: "available"
    });
    setIsAddingProperty(false);
    
    toast({
      title: "Property Added",
      description: "New property has been successfully added to the system.",
    });
  };

  const handleDeleteProperty = (id: string) => {
    setProperties(properties.filter(p => p.id !== id));
    toast({
      title: "Property Deleted",
      description: "Property has been removed from the system.",
    });
  };

  const updatePropertyStatus = (id: string, status: string) => {
    setProperties(properties.map(p => p.id === id ? { ...p, status } : p));
    toast({
      title: "Status Updated",
      description: `Property status changed to ${status}.`,
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Property Management</h1>
          <p className="text-muted-foreground">Manage your property listings and inventory</p>
        </div>
        
        <Dialog open={isAddingProperty} onOpenChange={setIsAddingProperty}>
          <DialogTrigger asChild>
            <Button className="hero-gradient text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add New Property
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Property</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Property Title *</Label>
                  <Input
                    id="title"
                    value={newProperty.title}
                    onChange={(e) => setNewProperty({...newProperty, title: e.target.value})}
                    placeholder="e.g., Modern 3-Bedroom Bungalow"
                  />
                </div>
                <div>
                  <Label htmlFor="estate">Estate *</Label>
                  <Select value={newProperty.estate} onValueChange={(value) => setNewProperty({...newProperty, estate: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Estate" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Bakassi Estate">Bakassi Estate</SelectItem>
                      <SelectItem value="Teachers Village">Teachers Village</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="type">Property Type</Label>
                  <Select value={newProperty.type} onValueChange={(value) => setNewProperty({...newProperty, type: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Bungalow">Bungalow</SelectItem>
                      <SelectItem value="Duplex">Duplex</SelectItem>
                      <SelectItem value="Apartment">Apartment</SelectItem>
                      <SelectItem value="Flat">Flat</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="bedrooms">Bedrooms</Label>
                  <Input
                    id="bedrooms"
                    type="number"
                    value={newProperty.bedrooms}
                    onChange={(e) => setNewProperty({...newProperty, bedrooms: e.target.value})}
                    placeholder="3"
                  />
                </div>
                <div>
                  <Label htmlFor="bathrooms">Bathrooms</Label>
                  <Input
                    id="bathrooms"
                    type="number"
                    value={newProperty.bathrooms}
                    onChange={(e) => setNewProperty({...newProperty, bathrooms: e.target.value})}
                    placeholder="2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="area">Land Area</Label>
                  <Input
                    id="area"
                    value={newProperty.area}
                    onChange={(e) => setNewProperty({...newProperty, area: e.target.value})}
                    placeholder="600 sqm"
                  />
                </div>
                <div>
                  <Label htmlFor="price">Price (₦) *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={newProperty.price}
                    onChange={(e) => setNewProperty({...newProperty, price: e.target.value})}
                    placeholder="35000000"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={newProperty.location}
                  onChange={(e) => setNewProperty({...newProperty, location: e.target.value})}
                  placeholder="Plot 15, Block A"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newProperty.description}
                  onChange={(e) => setNewProperty({...newProperty, description: e.target.value})}
                  placeholder="Beautiful modern property with premium finishes..."
                  className="min-h-[80px]"
                />
              </div>

              <div>
                <Label htmlFor="features">Features (comma-separated)</Label>
                <Input
                  id="features"
                  value={newProperty.features}
                  onChange={(e) => setNewProperty({...newProperty, features: e.target.value})}
                  placeholder="Fitted Kitchen, Parking Space, Security House"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsAddingProperty(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddProperty} className="hero-gradient text-white">
                  Add Property
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Properties</p>
                <p className="text-3xl font-bold">{properties.length}</p>
              </div>
              <Home className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Available</p>
                <p className="text-3xl font-bold text-green-600">
                  {properties.filter(p => p.status === 'available').length}
                </p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Sold</p>
                <p className="text-3xl font-bold text-red-600">
                  {properties.filter(p => p.status === 'sold').length}
                </p>
              </div>
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Value</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(properties.reduce((sum, p) => sum + p.price, 0))}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search properties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={filterEstate} onValueChange={setFilterEstate}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by Estate" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Estates</SelectItem>
                <SelectItem value="Bakassi Estate">Bakassi Estate</SelectItem>
                <SelectItem value="Teachers Village">Teachers Village</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="sold">Sold</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties.map((property) => (
          <Card key={property.id} className="overflow-hidden hover:shadow-elegant transition-all duration-300">
            <div className="aspect-video bg-muted relative overflow-hidden">
              <img 
                src={property.images[0]} 
                alt={property.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 right-3">
                {getStatusBadge(property.status)}
              </div>
            </div>
            
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold truncate">{property.title}</h3>
                  <Badge variant="outline" className="text-xs">
                    {property.id}
                  </Badge>
                </div>
                
                <div className="flex items-center text-muted-foreground text-sm">
                  <MapPin className="w-4 h-4 mr-1" />
                  {property.location}, {property.estate}
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Bed className="w-4 h-4 mr-1 text-primary" />
                      {property.bedrooms}
                    </div>
                    <div className="flex items-center">
                      <Bath className="w-4 h-4 mr-1 text-primary" />
                      {property.bathrooms}
                    </div>
                    <div className="flex items-center">
                      <Square className="w-4 h-4 mr-1 text-primary" />
                      {property.area}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-2">
                  <div className="font-bold text-primary">
                    {formatCurrency(property.price)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Added {property.dateAdded}
                  </div>
                </div>
                
                <div className="flex gap-2 pt-3">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="w-3 h-3 mr-1" />
                    View
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Edit3 className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="px-2 text-red-600 hover:bg-red-50"
                    onClick={() => handleDeleteProperty(property.id)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
                
                {property.status === 'available' && (
                  <div className="flex gap-2 pt-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1 text-xs"
                      onClick={() => updatePropertyStatus(property.id, 'pending')}
                    >
                      Mark Pending
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1 text-xs"
                      onClick={() => updatePropertyStatus(property.id, 'sold')}
                    >
                      Mark Sold
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProperties.length === 0 && (
        <Card className="p-12 text-center">
          <div className="text-muted-foreground">
            <Home className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No properties found</h3>
            <p>Try adjusting your search terms or filters.</p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default PropertyManagement;