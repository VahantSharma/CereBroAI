
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface TumorTypeCardProps {
  id: string;
  title: string;
  description: string;
  images: string[];
}

const TumorTypeCard = ({ id, title, description, images }: TumorTypeCardProps) => {
  return (
    <Card className="overflow-hidden bg-cerebro-dark border-white/10 transition-all hover:border-cerebro-accent/50">
      <div className="grid grid-cols-1 md:grid-cols-2">
        {images.map((image, index) => (
          <div key={index} className="relative h-48 overflow-hidden">
            <img 
              src={image} 
              alt={`${title} MRI scan ${index + 1}`} 
              className="w-full h-full object-cover transition-transform hover:scale-105"
            />
          </div>
        ))}
      </div>
      <div className="p-6">
        <h3 className="heading-sm mb-3">{title}</h3>
        <p className="text-gray-300 mb-4">{description.substring(0, 150)}...</p>
        <Button asChild variant="ghost" className="group hover:bg-cerebro-accent/10">
          <Link to={`/tumor-types/${id}`} className="flex items-center justify-between">
            Learn more
            <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      </div>
    </Card>
  );
};

export default TumorTypeCard;
