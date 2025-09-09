import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  ArrowLeft, 
  Heart, 
  Share2, 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Car, 
  Shield, 
  Zap, 
  Droplets,
  TreePine,
  Phone,
  MessageCircle,
  Download,
  Calculator,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import Navigation from "@/components/Navigation";
import PropertyCard from "@/components/PropertyCard";
import { getPropertyById, properties } from "@/data/properties";
import { cn } from "@/lib/utils";

const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [isLiked, setIsLiked] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);

  const property = getPropertyById(id || "");
  
  if (!property) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Property Not Found</h1>
          <p className="text-muted-foreground mb-8">The property you're looking for doesn't exist.</p>
          <Link to="/properties">
            <Button>Browse All Properties</Button>
          </Link>
        </div>
      </div>
    );
  }

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

  // Get similar properties (same estate, different property)
  const similarProperties = properties
    .filter(p => p.estate === property.estate && p.id !== property.id)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Breadcrumb */}
      <div className="border-b border-border bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-2 text-sm">
            <Link to="/" className="text-muted-foreground hover:text-primary">Home</Link>
            <span className="text-muted-foreground">/</span>
            <Link to="/properties" className="text-muted-foreground hover:text-primary">Properties</Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground font-medium">{property.title}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Back Button */}
            <Link to="/properties" className="inline-flex items-center text-muted-foreground hover:text-primary mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Properties
            </Link>

            {/* Image Gallery */}
            <div className="mb-8">
              <div className="relative aspect-[16/10] rounded-xl overflow-hidden mb-4">
                <img
                  src={property.images[currentImage]}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  <Badge className={cn("text-xs font-medium px-3 py-1", statusColors[property.status])}>
                    {statusText[property.status]}
                  </Badge>
                  {property.featured && (
                    <Badge className="bg-amber-500 text-white text-xs font-medium px-3 py-1">
                      Featured
                    </Badge>
                  )}
                </div>
                <div className="absolute top-4 right-4 flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="bg-white/90 backdrop-blur-sm"
                    onClick={() => setIsLiked(!isLiked)}
                  >
                    <Heart className={cn("w-4 h-4", isLiked && "fill-current text-red-500")} />
                  </Button>
                  <Button variant="secondary" size="sm" className="bg-white/90 backdrop-blur-sm">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Image Thumbnails */}
              <div className="grid grid-cols-3 gap-3">
                {property.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImage(index)}
                    className={cn(
                      "aspect-[4/3] rounded-lg overflow-hidden border-2 transition-all",
                      currentImage === index ? "border-primary" : "border-transparent hover:border-border"
                    )}
                  >
                    <img src={image} alt={`View ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Property Details */}
            <div className="space-y-8">
              {/* Header */}
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">{property.title}</h1>
                    <div className="flex items-center text-muted-foreground mb-4">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>{property.location} 
                        {/* • {property.streetName}, {property.houseNumber} */}
                        </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-primary">{property.price}</p>
                    <p className="text-sm text-muted-foreground">Outright Purchase</p>
                  </div>
                </div>

                {/* Key Details */}
        


                {property.propertyType === "residential" ? (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-muted/30 rounded-xl">
    <div className="text-center">
      <Bed className="w-6 h-6 mx-auto mb-2 text-primary" />
      <p className="font-semibold">{property.bedrooms}</p>
      <p className="text-sm text-muted-foreground">Bedrooms</p>
    </div>
    <div className="text-center">
      <Bed className="w-6 h-6 mx-auto mb-2 text-primary" />
      <p className="font-semibold">2</p>
      <p className="text-sm text-muted-foreground">Living Room</p>
    </div>
    <div className="text-center">
      <Bath className="w-6 h-6 mx-auto mb-2 text-primary" />
      <p className="font-semibold">{property.bathrooms}</p>
      <p className="text-sm text-muted-foreground">Bathrooms</p>
    </div>
    <div className="text-center">
      <Square className="w-6 h-6 mx-auto mb-2 text-primary" />
      <p className="font-semibold">{property.landSize}</p>
      <p className="text-sm text-muted-foreground">Land Size</p>
    </div>
    <div className="text-center">
      <Square className="w-6 h-6 mx-auto mb-2 text-primary" />
      <p className="font-semibold">{property.buildingSize}</p>
      <p className="text-sm text-muted-foreground">Built-up</p>
    </div>
  </div>
) : null}




              </div>

              {/* Description */}
              <div>
                <h2 className="text-2xl font-semibold mb-4">About This Property</h2>
                <p className="text-muted-foreground leading-relaxed">{property.description}</p>
              </div>

              {/* Property Features */}
              <div>
                <h2 className="text-2xl font-semibold mb-4">Property Features</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {property.features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <CheckCircle2 className="w-5 h-5 text-primary mr-3 flex-shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Plans */}
           {/* Price */}
<div className="flex justify-between items-center text-lg">
  <span className="text-muted-foreground">Price:</span>
  <span className="font-bold text-primary">
    {property.propertyType === "residential"
      ? `₦${property.paymentPlans?.outright?.amount.toLocaleString()}`
      : "₦..."}
  </span>
</div>

{/* Payment Options & Details → Only for Residential */}
{property.propertyType === "residential" && property.paymentPlans?.outright && (
  <div>
    <h2 className="text-2xl font-semibold mb-4">Payment Options</h2>
    <Tabs defaultValue="outright" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="outright">Outright</TabsTrigger>
        <TabsTrigger value="musharakah">Musharakah</TabsTrigger>
        <TabsTrigger value="murabahah">Murabahah</TabsTrigger>
        <TabsTrigger value="ijarah">Ijarah</TabsTrigger>
      </TabsList>

      {/* Outright */}
      <TabsContent value="outright" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Outright Purchase</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-lg">
                <span>Total Amount:</span>
                <span className="font-bold text-primary">
                  ₦{property.paymentPlans.outright.amount.toLocaleString()}
                </span>
              </div>
              <p className="text-muted-foreground">
                {property.paymentPlans.outright.description}
              </p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Musharakah */}
      <TabsContent value="musharakah" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Musharakah Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">First Stake</p>
                  <p className="font-bold text-lg">
                    ₦{property.paymentPlans.musharakah.firstStake.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Annual Rental</p>
                  <p className="font-bold text-lg">
                    ₦{property.paymentPlans.musharakah.rentalValue.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Appreciation</p>
                  <p className="font-bold text-lg">
                    {property.paymentPlans.musharakah.appreciation}% yearly
                  </p>
                </div>
              </div>
              <p className="text-muted-foreground">
                {property.paymentPlans.musharakah.description}
              </p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Murabahah */}
      <TabsContent value="murabahah" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Murabahah Installments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="mb-4">
                <p className="text-sm text-muted-foreground">Minimum Deposit</p>
                <p className="font-bold text-lg">
                  ₦{property.paymentPlans.murabahah.minimumDeposit.toLocaleString()}
                </p>
              </div>
              <div className="space-y-3">
                {property.paymentPlans.murabahah.plans.map((plan, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-3 border rounded-lg"
                  >
                    <div>
                      <p className="font-semibold">{plan.duration} Months</p>
                      <p className="text-sm text-muted-foreground">
                        ₦{plan.monthlyPayment.toLocaleString()} monthly
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">
                        ₦{plan.totalAmount.toLocaleString()}
                      </p>
                      <p className="text-sm text-muted-foreground">Total</p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-muted-foreground">
                {property.paymentPlans.murabahah.description}
              </p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Ijarah */}
      <TabsContent value="ijarah" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Ijarah (Rental/Lease)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-lg">
                <span>Annual Rent:</span>
                <span className="font-bold text-primary">
                  ₦{property.paymentPlans.ijarah.annualRent.toLocaleString()}
                </span>
              </div>
              <p className="text-muted-foreground">
                {property.paymentPlans.ijarah.description}
              </p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>

    {/* Bank Details */}
    <Card className="bg-muted/30 mt-6">
      {/* <CardHeader>
        <CardTitle>Payment Details</CardTitle>
      </CardHeader> */}
      {/* <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Account Name:</span>
            <span className="font-semibold">{property.bankDetails.accountName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Bank:</span>
            <span className="font-semibold">{property.bankDetails.bankName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Account Number:</span>
            <span className="font-bold text-primary">{property.bankDetails.accountNumber}</span>
          </div>
        </div>
      </CardContent> */}
    </Card>
  </div>
)}

            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Contact Card */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Interested in this property?</h3>
                  <div className="space-y-3">
                    <Link to={`/apply?property=${property.id}`}>
                      <Button className="w-full hero-gradient text-white" disabled={property.status === "sold"}>
                        {property.status === "sold" ? "Sold Out" : "Apply Now"}
                      </Button>
                    </Link>


                    {/* <Button variant="outline" className="w-full">
                      <Phone className="w-4 h-4 mr-2" />
                      Call Now
                    </Button>
                    <Button variant="outline" className="w-full">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      WhatsApp
                    </Button> */}


                    <Button
  variant="outline"
  className="w-full"
  asChild
>
  <a href="tel:+2348096419609">
    <Phone className="w-4 h-4 mr-2" />
    Call Now
  </a>
</Button>

<Button
  variant="outline"
  className="w-full"
  asChild
>
  <a
    href="https://wa.me/2348096419609"
    target="_blank"
    rel="noopener noreferrer"
  >
    <MessageCircle className="w-4 h-4 mr-2" />
    WhatsApp
  </a>
</Button>

                    <Button variant="outline" className="w-full">
                      <Download className="w-4 h-4 mr-2" />
                      Download Brochure
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Mortgage Calculator */}
              {/* <Card>
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <Calculator className="w-5 h-5 mr-2 text-primary" />
                    <h3 className="font-semibold">Mortgage Calculator</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Calculate your monthly payments for different payment plans.
                  </p>
                  <Button variant="outline" className="w-full">
                    Calculate Payments
                  </Button>
                </CardContent>
              </Card> */}

              {/* Property Stats */}
              <Card>
  <CardContent className="p-6">
    <h3 className="font-semibold mb-4">Property Details</h3>
    <div className="space-y-3 text-sm">
      {/* Always show Property ID + Estate */}
      {/* <div className="flex justify-between">
        <span className="text-muted-foreground">Property ID:</span>
        <span className="font-medium">{property.id}</span>
      </div> */}
      <div className="flex justify-between">
        <span className="text-muted-foreground">Estate:</span>
        <span className="font-medium">{property.estate}</span>
      </div>

      {/* Only show these if propertyType === "residential" */}
      {property.propertyType === "residential" && (
        <>
          {/* <div className="flex justify-between">
            <span className="text-muted-foreground">Street:</span>
            <span className="font-medium">{property.streetName}</span>
          </div> */}
          {/* <div className="flex justify-between">
            <span className="text-muted-foreground">House:</span>
            <span className="font-medium">{property.houseNumber}</span>
          </div> */}
          
           <div className="flex justify-between">
            <span className="text-muted-foreground">Living Rooms:</span>
            <span className="font-medium">2</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Sitting Rooms:</span>
            <span className="font-medium">{property.sittingRooms}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Toilets:</span>
            <span className="font-medium">{property.toilets}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Backyard:</span>
            <span className="font-medium">{property.backyardSize}</span>
          </div>
        </>
      )}
    </div>
  </CardContent>
</Card>

            </div>
          </div>
        </div>

        {/* Similar Properties */}
        {similarProperties.length > 0 && (
          <section className="mt-16">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">Similar Properties in {property.estate}</h2>
              <Link to={`/properties?estate=${property.estate.toLowerCase().includes('bakassi') ? 'bakassi' : 'teachers'}`}>
                <Button variant="outline">View All in {property.estate}</Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarProperties.map((similarProperty) => (
                <PropertyCard key={similarProperty.id} {...similarProperty} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default PropertyDetail;