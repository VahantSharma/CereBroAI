
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TumorDetailSectionProps {
  id: string;
  title: string;
  description: string;
  images: string[];
  learnMoreUrl: string;
  symptoms: string[];
  treatments: string[];
}

const TumorDetailSection = ({
  id,
  title,
  description,
  images,
  learnMoreUrl,
  symptoms,
  treatments,
}: TumorDetailSectionProps) => {
  return (
    <section id={id} className="py-24 border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="heading-lg mb-6">{title}</h2>
            <p className="text-gray-300 mb-6 leading-relaxed">{description}</p>
            
            <div className="mb-8">
              <h3 className="text-xl font-medium mb-3">Common Symptoms</h3>
              <ul className="list-disc pl-5 space-y-1.5 text-gray-300">
                {symptoms.map((symptom, index) => (
                  <li key={index}>{symptom}</li>
                ))}
              </ul>
            </div>
            
            <div className="mb-8">
              <h3 className="text-xl font-medium mb-3">Treatment Options</h3>
              <ul className="list-disc pl-5 space-y-1.5 text-gray-300">
                {treatments.map((treatment, index) => (
                  <li key={index}>{treatment}</li>
                ))}
              </ul>
            </div>
            
            <Button asChild className="bg-cerebro-accent hover:bg-cerebro-accent/90">
              <a href={learnMoreUrl} target="_blank" rel="noopener noreferrer" className="flex items-center">
                Learn More
                <ExternalLink className="ml-2 w-4 h-4" />
              </a>
            </Button>
          </div>
          
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {images.map((image, index) => (
                <div 
                  key={index} 
                  className="glass-card rounded-lg overflow-hidden"
                >
                  <img 
                    src={image} 
                    alt={`${title} MRI scan ${index + 1}`} 
                    className="w-full h-auto"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TumorDetailSection;
