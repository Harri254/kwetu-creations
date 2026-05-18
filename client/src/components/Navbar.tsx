import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { LogIn, LogOut, User as UserIcon, Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "../lib/utils";
// @ts-ignore
import logo from "../assets/KwetuArtwork.png";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const navLinkClass =
    "relative text-primary/70 hover:text-secondary transition-colors after:absolute after:left-0 after:-bottom-2 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-secondary after:transition-transform after:duration-300 hover:after:scale-x-100 [&.active]:text-secondary [&.active]:after:scale-x-100";

  return (
    <nav className="sticky top-0 z-50 border-b border-primary/10 bg-white/90 backdrop-blur-xl shadow-[0_10px_40px_rgba(7,46,74,0.08)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center ">
            <NavLink
              to="/"
              className="text-2xl font-bold tracking-tight"
            >
              <img src={logo} alt="Kwetu Creations Logo" className="w-[4em] h-[2em] " />
            </NavLink>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink to="/" className={navLinkClass}>Home</NavLink>
            <NavLink to="/products" className={navLinkClass}>Showcase</NavLink>
            <NavLink to="/about" className={navLinkClass}>About</NavLink>
            <NavLink to="/services" className={navLinkClass}>Services</NavLink>
            <NavLink to="/contact" className={navLinkClass}>Contact</NavLink>

            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 rounded-full border border-primary/10 bg-primary/5 px-2 py-1 text-primary">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || ""}
                      className="w-8 h-8 rounded-full border border-secondary/30"
                    />
                  ) : (
                    <UserIcon className="w-8 h-8 p-1 rounded-full border border-secondary/30 bg-white" />
                  )}
                  <span className="text-sm font-medium">
                    {user.displayName?.split(" ")[0]}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="p-2 text-primary/55 hover:text-secondary transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="flex items-center space-x-2 rounded-full bg-secondary px-5 py-2.5 text-white shadow-[0_12px_24px_rgba(196,103,27,0.28)] transition-all hover:-translate-y-0.5 hover:bg-[#ad5817]"
              >
                <LogIn className="w-4 h-4" />
                <span>Login</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="rounded-full border border-primary/10 bg-primary/5 p-2 text-primary"
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "md:hidden overflow-hidden border-b border-primary/10 bg-white/95 backdrop-blur-xl transition-all duration-300",
          isOpen ? "max-h-96" : "max-h-0",
        )}
      >
        <div className="px-4 pt-2 pb-6 space-y-2">
          <NavLink
            to="/"
            onClick={() => setIsOpen(false)}
            className="block rounded-xl px-3 py-2 text-primary/75 hover:bg-primary/5 hover:text-secondary [&.active]:bg-secondary/10 [&.active]:text-secondary"
          >
            Home
          </NavLink>
          <NavLink
            to="/products"
            onClick={() => setIsOpen(false)}
            className="block rounded-xl px-3 py-2 text-primary/75 hover:bg-primary/5 hover:text-secondary [&.active]:bg-secondary/10 [&.active]:text-secondary"
          >
            Showcase
          </NavLink>
          <NavLink
            to="/about"
            onClick={() => setIsOpen(false)}
            className="block rounded-xl px-3 py-2 text-primary/75 hover:bg-primary/5 hover:text-secondary [&.active]:bg-secondary/10 [&.active]:text-secondary"
          >
            About
          </NavLink>
          <NavLink
            to="/services"
            onClick={() => setIsOpen(false)}
            className="block rounded-xl px-3 py-2 text-primary/75 hover:bg-primary/5 hover:text-secondary [&.active]:bg-secondary/10 [&.active]:text-secondary"
          >
            Services
          </NavLink>
          <NavLink
            to="/contact"
            onClick={() => setIsOpen(false)}
            className="block rounded-xl px-3 py-2 text-primary/75 hover:bg-primary/5 hover:text-secondary [&.active]:bg-secondary/10 [&.active]:text-secondary"
          >
            Contact
          </NavLink>
          {user ? (
            <button
              onClick={() => {
                logout();
                setIsOpen(false);
              }}
              className="w-full rounded-xl border border-primary/10 bg-primary/5 px-3 py-2 text-left text-primary hover:bg-secondary/10 hover:text-secondary"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => {
                navigate("/login");
                setIsOpen(false);
              }}
              className="w-full rounded-xl bg-secondary px-3 py-2 text-left text-white shadow-[0_10px_20px_rgba(196,103,27,0.2)]"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
