import { Link } from 'react-router-dom';
import { useFirebase } from '../contexts/FirebaseContext';
import { LogIn, LogOut, User as UserIcon, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../lib/utils';

export default function Navbar() {
  const { user, login, logout } = useFirebase();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-neutral-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-neutral-900 tracking-tight">
              Kwetu<span className="text-blue-600">Creations</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-neutral-600 hover:text-neutral-900 transition-colors">Home</Link>
            <Link to="/products" className="text-neutral-600 hover:text-neutral-900 transition-colors">Templates</Link>
            <Link to="/about" className="text-neutral-600 hover:text-neutral-900 transition-colors">About</Link>
            <Link to="/services" className="text-neutral-600 hover:text-neutral-900 transition-colors">Services</Link>
            <Link to="/contact" className="text-neutral-600 hover:text-neutral-900 transition-colors">Contact</Link>
            
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-neutral-700">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt={user.displayName || ''} className="w-8 h-8 rounded-full border border-neutral-200" />
                  ) : (
                    <UserIcon className="w-8 h-8 p-1 rounded-full border border-neutral-200" />
                  )}
                  <span className="text-sm font-medium">{user.displayName?.split(' ')[0]}</span>
                </div>
                <button 
                  onClick={logout}
                  className="p-2 text-neutral-500 hover:text-red-600 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button 
                onClick={login}
                className="flex items-center space-x-2 bg-neutral-900 text-white px-4 py-2 rounded-lg hover:bg-neutral-800 transition-colors"
              >
                <LogIn className="w-4 h-4" />
                <span>Login</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-neutral-600 p-2">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={cn("md:hidden bg-white border-b border-neutral-200 overflow-hidden transition-all duration-300", isOpen ? "max-h-96" : "max-h-0")}>
        <div className="px-4 pt-2 pb-6 space-y-2">
          <Link to="/" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-neutral-600 hover:bg-neutral-50 rounded-md">Home</Link>
          <Link to="/products" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-neutral-600 hover:bg-neutral-50 rounded-md">Templates</Link>
          <Link to="/about" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-neutral-600 hover:bg-neutral-50 rounded-md">About</Link>
          <Link to="/services" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-neutral-600 hover:bg-neutral-50 rounded-md">Services</Link>
          <Link to="/contact" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-neutral-600 hover:bg-neutral-50 rounded-md">Contact</Link>
          {user ? (
            <button onClick={() => { logout(); setIsOpen(false); }} className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded-md">Logout</button>
          ) : (
            <button onClick={() => { login(); setIsOpen(false); }} className="w-full text-left px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-md">Login</button>
          )}
        </div>
      </div>
    </nav>
  );
}
