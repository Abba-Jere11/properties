import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  description?: string;
}

const KPICard = ({ 
  title, 
  value, 
  change, 
  changeType = "neutral", 
  icon: Icon,
  description 
}: KPICardProps) => {
  return (
    <Card className="shadow-card hover:shadow-elegant transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-center space-x-2">
              <h3 className="text-2xl font-bold text-foreground">{value}</h3>
              {change && (
                <span className={`text-sm font-medium ${
                  changeType === "positive" ? "text-success" :
                  changeType === "negative" ? "text-destructive" :
                  "text-muted-foreground"
                }`}>
                  {change}
                </span>
              )}
            </div>
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </div>
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
            <Icon className="w-6 h-6 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default KPICard;