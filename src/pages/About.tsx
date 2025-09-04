import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import TeamMember from "@/components/TeamMember";
import Newsletter from "@/components/Newsletter";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Award, Users, MapPin } from "lucide-react";

const About = () => {
  const values = [
    {
      icon: CheckCircle2,
      title: "Quality Construction",
      description: "We use premium materials and modern construction techniques to ensure lasting quality."
    },
    {
      icon: Award,
      title: "Excellence in Service",
      description: "Our commitment to excellence drives everything we do, from planning to delivery."
    },
    {
      icon: Users,
      title: "Customer First",
      description: "We prioritize our customers' needs and satisfaction above all else."
    },
    {
      icon: MapPin,
      title: "Prime Locations",
      description: "Strategically located properties in Maiduguri's most desirable areas."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
            About Thinklab Properties
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Creating dream homes and building communities in Nigera for over a decade. 
            We are committed to providing quality housing solutions that meet the needs of modern families.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <Card className="border-0 shadow-card">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-4 text-primary">Our Mission</h2>
                <p className="text-muted-foreground leading-relaxed">
                  To provide affordable, quality, and innovative real estate solutions that empower families, 
      individuals, and businesses to achieve their property goals while building sustainable 
      communities that enhance the quality of life across Nigeria.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-card">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-4 text-primary">Our Vision</h2>
                <p className="text-muted-foreground leading-relaxed">
                  To be a leading real estate development company in Nigeria and beyond, 
      recognized for innovation, integrity, and excellence in creating vibrant 
      residential and commercial communities that stand the test of time.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">Our Values</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The principles that guide our work and define our commitment to excellence
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center border-0 shadow-card hover:shadow-elegant transition-all duration-300">
                <CardContent className="p-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                    <value.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-3 text-foreground">{value.title}</h3>
                  <p className="text-muted-foreground text-sm">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-6">Our Story</h2>
          </div>

          <div className="prose prose-lg max-w-none">
            <div className="space-y-6 text-muted-foreground">
              <p>
                Thinklab Properties was founded with a mission to redefine the real estate
                landscape across Nigeria by delivering innovative, affordable, and sustainable
                housing solutions. What started as a focused development company has grown into
                a trusted name in property development, estate management, and investment
                opportunities nationwide.
              </p>

              <p>
                Our portfolio now includes a diverse range of projects — from premium residential
                estates and modern smart homes to non-residential and commercial developments
                designed for businesses and investors. Whether it’s family-focused communities
                like Bakassi Estate and Teachers Village, or large-scale urban projects across
                other regions, Thinklab Properties is committed to building environments where
                people and businesses can thrive.
              </p>

              <p>
                To make real estate accessible, we offer flexible and inclusive payment plans,
                including Sharia-compliant options such as Musharakah, Murabahah, and Ijarah.
                This ensures that more families, professionals, and investors can find housing
                and property solutions that align with their needs and values.
              </p>

              <p>
                Today, Thinklab Properties continues to expand its reach, guided by our
                core values of quality, integrity, and customer satisfaction. With every
                project, we aim to set new standards in property development while contributing
                to the growth and modernization of communities across Nigeria.
              </p>

            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">10+</div>
              <div className="text-muted-foreground">Years of Experience</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">2</div>
              <div className="text-muted-foreground">Premium Estates</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">50+</div>
              <div className="text-muted-foreground">Quality Units</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">100%</div>
              <div className="text-muted-foreground">Customer Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">Meet Our Team</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our experienced professionals are dedicated to helping you find your perfect property
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <TeamMember
              name="Dr Said Kori"
              role="Chairman & CEO"
              bio=""
              image="/dr_said_kori.png"
            />
            
            <TeamMember
              name="Dr Babagana Adam"
              role="Group Managing Director"
              bio=""
              image="/md-removebg-preview.png"
              
             
            />
            
            <TeamMember
              name="Arch Ifeanyi Chu mni"
              role="Executive Director Operations & Projects"
              bio=""
              image="/ife.jpg"
             
              
            />
            <TeamMember
              name="Mrs Veronica Braimoh"
              role="Executive Director Corporate & Shared Services "
              bio=""
              image="/vero.jpg"
             
              
            />
            <TeamMember
              name="Muhammad Aliyu Lawan"
              role="Group Head of Projects"
              bio=""
              image="/yasheki.jpg"
             
              
            />
           
            <TeamMember
              name="Muhammad Kois Ismail"
              role="C T O"
              bio=""
              image="/kois.jpg"
              
             
            />
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <Newsletter />
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;