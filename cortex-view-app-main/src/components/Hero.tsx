import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  const { isAuthenticated } = useAuth();

  // Determine the target route based on authentication status
  const getStartedLink = isAuthenticated ? "/dashboard" : "/signup";

  return (
    <section className="min-h-screen flex items-center relative overflow-hidden pt-20">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-40 right-10 w-72 h-72 bg-cerebro-accent/20 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-cerebro-secondary/10 rounded-full filter blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1 className="heading-xl text-gradient">CereBro AI</h1>
            <p className="text-xl md:text-2xl text-gray-300 leading-relaxed max-w-2xl">
              An AI-based medical imaging tool for detecting and classifying
              brain tumors with high accuracy.
            </p>
            <p className="text-gray-400 max-w-xl leading-relaxed">
              Using deep learning and advanced computer vision, CereBro AI helps
              in improving diagnostic efficiency by automating the detection of
              tumors, reducing human error, and hastening the planning of
              treatments.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                asChild
                size="lg"
                className="bg-cerebro-accent hover:bg-cerebro-accent/90 text-white"
              >
                <Link to={getStartedLink}>
                  {isAuthenticated ? "Go to Dashboard" : "Get Started"}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/20 hover:bg-white/5"
              >
                <Link to="/about">Learn More</Link>
              </Button>
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="relative">
              <div className="glass-card p-4 rounded-2xl overflow-hidden">
                <img
                  src="/lovable-uploads/95c3e0ed-8e22-4682-a96c-2a21629010eb.png"
                  alt="Brain MRI scan"
                  className="w-full h-auto rounded-xl"
                />
                <div className="absolute bottom-8 left-8 right-8 glass-card p-4 rounded-lg">
                  <h3 className="font-medium text-cerebro-accent mb-1">
                    AI Detection in Progress
                  </h3>
                  <p className="text-sm text-gray-300">
                    Neural network analyzing medical imaging data for tumor
                    identification and classification.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
