
import { Brain, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-cerebro-dark border-t border-white/10 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Brain className="w-7 h-7 text-cerebro-accent" />
              <span className="font-serif text-xl font-semibold">CereBro AI</span>
            </div>
            <p className="text-sm text-gray-400 max-w-xs">
              An AI-based medical imaging tool for detecting and classifying brain tumors with high accuracy.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium text-lg mb-4">Navigation</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/" className="hover:text-cerebro-accent transition-colors">Home</Link></li>
              <li><Link to="/about" className="hover:text-cerebro-accent transition-colors">About</Link></li>
              <li><Link to="/tumor-types" className="hover:text-cerebro-accent transition-colors">Tumor Types</Link></li>
              <li><Link to="/dashboard" className="hover:text-cerebro-accent transition-colors">Dashboard</Link></li>
              <li><Link to="/contact" className="hover:text-cerebro-accent transition-colors">Connect</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-lg mb-4">Tumor Types</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/tumor-types#meningioma" className="hover:text-cerebro-accent transition-colors">Meningioma</Link></li>
              <li><Link to="/tumor-types#glioma" className="hover:text-cerebro-accent transition-colors">Glioma</Link></li>
              <li><Link to="/tumor-types#pituitary" className="hover:text-cerebro-accent transition-colors">Pituitary Tumor</Link></li>
              <li><Link to="/tumor-types#no-tumor" className="hover:text-cerebro-accent transition-colors">No Tumor</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-lg mb-4">Contact</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start space-x-2">
                <Mail className="w-5 h-5 mt-0.5 text-cerebro-accent" />
                <span>info@cerebroai.com</span>
              </li>
              <li className="flex items-start space-x-2">
                <Phone className="w-5 h-5 mt-0.5 text-cerebro-accent" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-start space-x-2">
                <MapPin className="w-5 h-5 mt-0.5 text-cerebro-accent" />
                <span>Bennett University, Greater Noida, UP, India</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} CereBro AI. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 text-sm text-gray-500">
            <span>A product by Karan & Vahant</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
