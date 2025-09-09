import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle, Star, Users, Award, MapPin, Phone, MessageCircle, Bed, Bath, Square, Eye, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import SearchBar from "@/components/SearchBar";
import Footer from "@/components/Footer";
import { getFeaturedProperties, properties } from "@/data/properties";
import bakassiHero from "@/assets/bakassi-estate-hero.jpg";
import teachersHero from "@/assets/teachers-village-hero.jpg";
import bakassi1 from "@/assets/bakassi/bakassi 1.jpg";
import marina3 from "@/assets/marina/marina 3.jpg";
import HomePage from "@/components/guidelines";
import ScrollToTopButton from "@/components/scroll-to-top-button";

const Index = () => {
  const featuredProperties = getFeaturedProperties();

  const estates = [
    {
      name: "Bakassi Estate",
      subtitle: "Bakassi GRA",
      description: "Premium residential development in the heart of Maiduguri",
      image: bakassiHero,
      features: ["24/7 Security", "33KVA Power", "Water Reticulation", "Green Landscape"],
      link: "/properties?estate=bakassi"
    },
    {
      name: "Teachers Village",
      subtitle: "Educational Community",
      description: "Family-friendly estate designed for educational professionals",
      image: teachersHero,
      features: ["Education Focused", "Community Centers", "Playgrounds", "Family Safe"],
      link: "/properties?estate=teachers"
    }
  ];

  const stats = [
    { number: "2", label: "Premium Estates", icon: MapPin },
    { number: "1000+", label: "Luxury Units", icon: Award },
    { number: "100%", label: "Customer Satisfaction", icon: Star },
    { number: "24/7", label: "Security & Support", icon: Users }
  ];

  const whyChooseUs = [
    {
      title: "Flexible Payment Plans",
      description: "Choose from Outright, Musharakah, Murabahah, or Ijarah payment options",
      icon: CheckCircle
    },
    {
      title: "Prime Locations",
      description: "Strategic locations in Maiduguri with access to malls, schools, and amenities",
      icon: MapPin
    },
    {
      title: "Quality Construction",
      description: "Modern architecture with premium finishes and contemporary design",
      icon: Award
    },
    {
      title: "Secure Investment",
      description: "Fenced estates with 24/7 security, proper documentation and legal compliance",
      icon: CheckCircle
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background with gradient overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            // src={bakassiHero} 
             src={marina3} 
            alt="Thinklab Properties"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-slide-up">
            <Badge className="mb-6 bg-primary/20 text-white border-white/20 px-4 py-2 text-sm">
              🏠 Dream Homes in Maiduguri
            </Badge>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Discover Your
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">
                Dream Home
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
              Spacious family bungalow sitting on 700sqm with multiple bedrooms, spacious parlours, multiple toilets, a kitchen and a backyard
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link to="/properties">
                <Button size="lg" className="hero-gradient text-white font-semibold px-8 py-4 text-lg">
                  Browse Properties
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/login">
                {/* <Button size="lg" variant="outline" className="border-white text-foreground hover:bg-white hover:text-foreground px-8 py-4 text-lg">
                  Client Login
                </Button> */}
              </Link>
              <Link to="/apply">
                <Button size="lg" variant="outline" className="border-white text-foreground hover:bg-white hover:text-foreground hover:text-xl px-8 py-4 text-lg">
                  Apply Now
                </Button>
              </Link>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm mb-3">
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-white">{stat.number}</div>
                  <div className="text-sm text-white/80">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2"></div>
          </div>
        </div>
      </section>

      <HomePage/>

      {/* Search Section */}
      {/* <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Find Your Perfect Property</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Search through our premium collection of properties in Maiduguri's most desirable locations
            </p>
          </div>
          <SearchBar />
        </div>
      </section> */}

      {/* Featured Properties */}


      {/* Estates Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4 text-primary">Our Premium Estates</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover luxury living in Nigeria's most prestigious residential and commercial developments
            </p>
          </div>

          {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {estates.map((estate, index) => (
              <Card key={index} className="overflow-hidden shadow-card hover:shadow-elegant transition-all duration-300 border-0">
                <div className="relative h-64">
                  <img
                    src={estate.image}
                    alt={estate.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-6 left-6 text-white">
                    <h3 className="text-2xl font-bold mb-1">{estate.name}</h3>
                    <p className="text-sm opacity-90">{estate.subtitle}</p>
                  </div>
                </div>
                <CardContent className="p-6">
                  <p className="text-3xl font-bold text-primary mb-2">40,000,000</p>
                  <p className="text-muted-foreground mb-4">{estate.description}</p>
                  <div className="grid grid-cols-2 gap-2 mb-6">
                    {estate.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center text-sm">
                        <CheckCircle className="w-4 h-4 text-primary mr-2" />
                        {feature}
                      </div>
                    ))}
                  </div>
                  <Link to={estate.link}>
                    <Button className="w-full hero-gradient text-white">
                      Explore {estate.name}
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div> */}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {properties.map((property, index) => (
              <Card key={index} className="overflow-hidden shadow-card hover:shadow-elegant transition-all duration-300 border-0">
                <div className="relative h-70">
                  <img
                    src={property.image}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-6 left-6 text-white">
                    <h3 className="text-2xl font-bold mb-1  text-red text-primary">{property.estate}</h3>
                    <p className="text-sm opacity-90">{property.title}</p>
                  </div>
                </div>
                <CardContent className="p-6">
                  <p className="text-3xl font-bold text-primary mb-2">{property.price}</p>
                  <p className="text-muted-foreground mb-4">{property.description}</p>
                  <div className="grid grid-cols-2 gap-2 mb-6">
                    {property.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center text-sm">
                        <CheckCircle className="w-4 h-4 text-primary mr-2" />
                        {feature}
                      </div>
                    ))}
                  </div>
                    <Link to={`/property/${property.id}`}>
                    <Button className="w-full hero-gradient text-white">
                      Explore {property.estate}
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

              <div className="text-center mt-12">
            <Link to="/properties">
              <Button variant="outline" size="lg">
                View All Properties
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Why Choose Thinklab Properties</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience the difference with our commitment to quality, security, and customer satisfaction
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyChooseUs.map((item, index) => (
              <Card key={index} className="text-center p-6 border-0 shadow-card hover:shadow-elegant transition-all duration-300">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <item.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="text-center p-8 md:p-12 border-0 shadow-elegant bg-gradient-to-br from-white to-muted/50">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Ready to Find Your Dream Home?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Our team is ready to help you find the perfect property in Maiduguri. 
              Get started with your property search today.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/apply">
                <Button size="lg" className="hero-gradient text-white font-semibold px-8">
                  Apply for Property
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="px-8">
                <Phone className="mr-2 w-5 h-5" />
                Call Us Now
              </Button>
              <Button size="lg" variant="outline" className="px-8">
                <MessageCircle className="mr-2 w-5 h-5" />
                WhatsApp Chat
              </Button>
            </div>

            <div className="mt-8 pt-8 border-t border-border">
              <p className="text-sm text-muted-foreground">
                <strong>Contact:</strong> +234 (0) 8096419609 | sales@thinklabproperties.com.ng
              </p>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <Footer />
      <ScrollToTopButton/>
    </div>
  );
};

export default Index;
