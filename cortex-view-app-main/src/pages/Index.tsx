import ChatBot from "@/components/ChatBot";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import {
  ArrowRight,
  BrainCircuit,
  RefreshCw,
  Shield,
  Target,
} from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: <BrainCircuit className="w-10 h-10 text-cerebro-accent" />,
      title: "Advanced Neural Networks",
      description:
        "Utilizes state-of-the-art deep learning algorithms specifically trained on vast datasets of brain MRI scans.",
    },
    {
      icon: <Target className="w-10 h-10 text-cerebro-accent" />,
      title: "High Accuracy Detection",
      description:
        "Identifies and classifies brain tumors with precision, helping medical professionals make informed decisions.",
    },
    {
      icon: <RefreshCw className="w-10 h-10 text-cerebro-accent" />,
      title: "Real-time Analysis",
      description:
        "Processes medical images quickly and provides instant feedback, saving critical time in diagnostic workflows.",
    },
    {
      icon: <Shield className="w-10 h-10 text-cerebro-accent" />,
      title: "Secure & Private",
      description:
        "All patient data and medical images are handled with strict security protocols to ensure privacy and compliance.",
    },
  ];

  const tumorTypes = [
    {
      id: "meningioma",
      title: "Meningioma",
      description:
        "A tumor that grows in the membranes that cover the brain and spinal cord. Most meningiomas are noncancerous.",
    },
    {
      id: "glioma",
      title: "Glioma",
      description:
        "Tumors that grow in the brain or spinal cord, starting in the glial cells that surround and support neurons.",
    },
    {
      id: "pituitary",
      title: "Pituitary Tumor",
      description:
        "An abnormal growth of cells in the pituitary gland, a small gland at the base of the brain.",
    },
    {
      id: "no-tumor",
      title: "No Tumor",
      description:
        "Normal brain tissue without any abnormal cell growth, used as a control in the detection system.",
    },
  ];

  return (
    <div className="min-h-screen bg-cerebro-darker text-white">
      <Navbar />

      <main>
        <Hero />

        {/* Features Section */}
        <section className="py-24 bg-cerebro-dark">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="heading-lg mb-4">Advanced AI Technology</h2>
              <p className="text-lg text-gray-300">
                Our platform leverages cutting-edge artificial intelligence to
                transform the way brain tumors are detected and classified.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <Card
                  key={index}
                  className="bg-cerebro-darker border-white/10 p-6 hover:border-cerebro-accent/50 transition-all"
                >
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-medium mb-3">{feature.title}</h3>
                  <p className="text-gray-300">{feature.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Tumor Types Section */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="heading-lg mb-4">Brain Tumor Types</h2>
              <p className="text-lg text-gray-300">
                CereBro AI can detect and classify several types of brain tumors
                with high accuracy.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {tumorTypes.map((tumor, index) => (
                <Card
                  key={index}
                  className="bg-cerebro-dark border-white/10 p-6 hover:border-cerebro-accent/50 transition-all"
                >
                  <h3 className="text-2xl font-medium mb-3">{tumor.title}</h3>
                  <p className="text-gray-300 mb-4">{tumor.description}</p>
                  <Button
                    asChild
                    variant="ghost"
                    className="group hover:bg-cerebro-accent/10"
                  >
                    <Link
                      to={
                        isAuthenticated ? `/tumor-types#${tumor.id}` : "/signin"
                      }
                      className="flex items-center"
                    >
                      Learn more
                      <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </Card>
              ))}
            </div>

            <div className="text-center mt-12">
              <Button
                asChild
                size="lg"
                className="bg-cerebro-accent hover:bg-cerebro-accent/90"
              >
                <Link to={isAuthenticated ? "/tumor-types" : "/signin"}>
                  View All Tumor Types
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <ContactSection />
      </main>

      <Footer />

      {/* Chatbot Integration */}
      <ChatBot />
    </div>
  );
};

export default Index;
