
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { Mail, MessageSquare, Send } from "lucide-react";

const ContactSection = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Message sent",
        description: "Thank you for contacting us. We'll get back to you soon.",
      });
      
      // Reset form
      const form = e.target as HTMLFormElement;
      form.reset();
    }, 1500);
  };
  
  return (
    <section id="contact" className="py-24 bg-cerebro-dark">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="heading-lg mb-4">Drop Us an Email</h2>
          <p className="text-lg text-gray-300">
            Have questions about our brain tumor detection technology or interested in collaboration? Get in touch with our team.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="glass-card p-8 rounded-xl">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Your Name</Label>
                    <Input 
                      id="name" 
                      placeholder="John Doe" 
                      required 
                      className="bg-white/5 border-white/10 focus-visible:ring-cerebro-accent"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="john@example.com" 
                      required 
                      className="bg-white/5 border-white/10 focus-visible:ring-cerebro-accent"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input 
                    id="subject" 
                    placeholder="How can we help you?" 
                    required 
                    className="bg-white/5 border-white/10 focus-visible:ring-cerebro-accent"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea 
                    id="message" 
                    placeholder="Your message..." 
                    rows={5} 
                    required 
                    className="bg-white/5 border-white/10 focus-visible:ring-cerebro-accent resize-none"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-cerebro-accent hover:bg-cerebro-accent/90"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <Send className="mr-2 h-4 w-4" />
                      Send Message
                    </span>
                  )}
                </Button>
              </form>
            </div>
          </div>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-medium mb-4">Contact Information</h3>
              <p className="text-gray-300 mb-6">
                Our team is dedicated to advancing brain tumor detection technology. We'd love to hear from you, whether you have questions about our technology, want to collaborate, or need assistance.
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-cerebro-accent/20 p-3 rounded-full">
                  <Mail className="w-6 h-6 text-cerebro-accent" />
                </div>
                <div>
                  <h4 className="font-medium mb-1">Email Us</h4>
                  <p className="text-gray-300">info@cerebroai.com</p>
                  <p className="text-gray-300">support@cerebroai.com</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-cerebro-accent/20 p-3 rounded-full">
                  <MessageSquare className="w-6 h-6 text-cerebro-accent" />
                </div>
                <div>
                  <h4 className="font-medium mb-1">Live Chat</h4>
                  <p className="text-gray-300">Our support team is available Mon-Fri, 9am-5pm EST.</p>
                  <Button variant="link" className="p-0 h-auto text-cerebro-accent">
                    Start a conversation
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
