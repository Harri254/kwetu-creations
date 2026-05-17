import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Instagram, Twitter, Facebook } from 'lucide-react';
// @ts-ignore
import logo from "../assets/KwetuArtwork.png";

export default function Footer() {
  return (
    <footer className="border-t border-primary/10 bg-primary text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="text-2xl font-bold tracking-tight">
              <img src={logo} alt="Kwetu Creations Logo" className="w-[4em] h-[2em]" />
            </Link>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-white/72">
              Your home for premium digital designs, AI-powered business automation, and custom web solutions. 
              We blend creativity with technology to elevate your brand.
            </p>
            <div className="mt-6 flex space-x-4">
              <a href="#" className="rounded-full bg-white/10 p-2 transition-colors hover:bg-secondary">
                <Instagram className="w-5 h-5 text-white" />
              </a>
              <a href="#" className="rounded-full bg-white/10 p-2 transition-colors hover:bg-secondary">
                <Twitter className="w-5 h-5 text-white" />
              </a>
              <a href="#" className="rounded-full bg-white/10 p-2 transition-colors hover:bg-secondary">
                <Facebook className="w-5 h-5 text-white" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="mb-4 font-semibold text-secondary">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="text-white/72 transition-colors hover:text-secondary">Home</Link></li>
              <li><Link to="/about" className="text-white/72 transition-colors hover:text-secondary">About Us</Link></li>
              <li><Link to="/services" className="text-white/72 transition-colors hover:text-secondary">Services</Link></li>
              <li><Link to="/contact" className="text-white/72 transition-colors hover:text-secondary">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="mb-4 font-semibold text-secondary">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center space-x-3 text-white/72">
                <Mail className="w-4 h-4 text-secondary" />
                <span>info@kwetucreations.com</span>
              </li>
              <li className="flex items-center space-x-3 text-white/72">
                <Phone className="w-4 h-4 text-secondary" />
                <span>+254 700 000 000</span>
              </li>
              <li className="flex items-center space-x-3 text-white/72">
                <MapPin className="w-4 h-4 text-secondary" />
                <span>Nairobi, Kenya</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 border-t border-white/10 pt-8 text-center text-xs text-white/60">
          <p>&copy; {new Date().getFullYear()} Kwetu Creations. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
