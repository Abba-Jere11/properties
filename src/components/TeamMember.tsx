import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Linkedin, Mail, Phone } from "lucide-react";

interface TeamMemberProps {
  name: string;
  role: string;
  bio: string;
  image: string;
  
}

const TeamMember = ({ name, role, bio, image,  }: TeamMemberProps) => {
  return (
    <Card className="overflow-hidden shadow-card hover:shadow-elegant transition-all duration-300">
      <div className="aspect-square overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>
      <CardContent className="p-6">
        <div className="text-center mb-4">
          <h3 className="text-xl font-bold text-foreground mb-1">{name}</h3>
          <p className="text-primary font-semibold mb-2">{role}</p>
        </div>
        
        <p className="text-muted-foreground text-sm leading-relaxed mb-4">
          {bio}
        </p>
        
        {/* <div className="mb-4">
          <h4 className="text-sm font-semibold mb-2">Specializations:</h4>
          <div className="flex flex-wrap gap-1">
            {specialization.map((spec, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {spec}
              </Badge>
            ))}
          </div>
        </div> */}
        
        <div className="pt-4 border-t border-border">
          {/* <div className="flex justify-center space-x-4">
            <a
              href={`mailto:${contact.email}`}
              className="p-2 rounded-full bg-muted hover:bg-primary hover:text-white transition-colors"
            >
              <Mail className="w-4 h-4" />
            </a>
            <a
              href={`tel:${contact.phone}`}
              className="p-2 rounded-full bg-muted hover:bg-primary hover:text-white transition-colors"
            >
              <Phone className="w-4 h-4" />
            </a>
            {contact.linkedin && (
              <a
                href={contact.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-muted hover:bg-primary hover:text-white transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            )}
          </div> */}
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamMember;