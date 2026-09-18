import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Compass, BarChart3, Award, Menu, X } from "lucide-react";

export const Navbar: React.FC = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { path: "/", label: "Framework & Blueprint", icon: Compass },
    { path: "/insights", label: "Performance Insights", icon: BarChart3 },
    { path: "/profiles", label: "Future Ready Profiles", icon: Award },
  ];

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Wordmark */}
          <Link to="/" className="flex items-center space-x-3 group">
            <img 
              src="/lof-logo.png" 
              alt="Lab of Future - Be Curious" 
              className="h-8 sm:h-9 w-auto object-contain group-hover:scale-105 transition-transform" 
            />
            <div className="h-6 w-px bg-slate-200 hidden sm:block" />
            <div className="hidden sm:flex items-center space-x-1.5">
              <span className="font-display font-bold tracking-tight text-slate-900 text-sm md:text-base">
                STREAMER
              </span>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-blue-50 text-streamer-science border border-blue-200">
                Portfolio
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                    active
                      ? "bg-slate-100 text-slate-900 font-semibold border border-slate-200 shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? "text-streamer-science" : "text-slate-400"}`} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Global Operations Tag */}
          <div className="hidden lg:flex items-center space-x-3 pl-4 border-l border-slate-200">
            <div className="flex items-center space-x-2 text-xs text-slate-600 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>4 Global Centres Active</span>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-streamer-science"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-4 space-y-1 shadow-md">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-base font-medium ${
                  active
                    ? "bg-slate-100 text-slate-900 font-semibold border border-slate-200"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <Icon className={`w-5 h-5 ${active ? "text-streamer-science" : "text-slate-400"}`} />
                <span>{link.label}</span>
              </Link>
            );
          })}
          <div className="pt-2 mt-2 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between px-3">
            <span>Global K-12 STEM Infrastructure</span>
            <span className="text-emerald-600 font-semibold font-mono">Live</span>
          </div>
        </div>
      )}
    </nav>
  );
};
