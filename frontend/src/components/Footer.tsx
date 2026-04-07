import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Instagram, Twitter, Facebook } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-neutral-400 py-12 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="text-2xl font-bold text-white tracking-tight">
              Kwetu<span className="text-blue-500">Creations</span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed max-w-md">
              Your home for premium digital designs, AI-powered business automation, and custom web solutions. 
              We blend creativity with technology to elevate your brand.
            </p>
            <div className="mt-6 flex space-x-4">
              <a href="#" className="p-2 bg-neutral-800 rounded-full hover:bg-neutral-700 transition-colors">
                <Instagram className="w-5 h-5 text-white" />
              </a>
              <a href="#" className="p-2 bg-neutral-800 rounded-full hover:bg-neutral-700 transition-colors">
                <Twitter className="w-5 h-5 text-white" />
              </a>
              <a href="#" className="p-2 bg-neutral-800 rounded-full hover:bg-neutral-700 transition-colors">
                <Facebook className="w-5 h-5 text-white" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/services" className="hover:text-white transition-colors">Services</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-blue-500" />
                <span>info@kwetucreations.com</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-blue-500" />
                <span>+254 700 000 000</span>
              </li>
              <li className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-blue-500" />
                <span>Nairobi, Kenya</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-neutral-800 text-center text-xs">
          <p>&copy; {new Date().getFullYear()} Kwetu Creations. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
