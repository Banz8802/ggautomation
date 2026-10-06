'use client';

import React, { useState, useEffect } from 'react';
import Logo from './Logo';
import { Menu, X, ArrowRight } from 'lucide-react';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Services', href: '/services' },
  { name: 'Projects', href: '/projects' },
  { name: 'About Us', href: '/about' },
  { name: 'Trainings', href: '/trainings' },
  { name: 'News & Updates', href: '/news-updates' },
  { name: 'Careers', href: '/careers' },
  { name: 'Contact', href: '/contact' },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-md py-3 border-b border-slate-100' 
        : 'bg-white py-4 shadow-sm border-b border-slate-200'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <a href="/" className="outline-none focus:ring-2 focus:ring-[#e51a24] rounded-lg">
          <Logo variant="dark" />
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm font-semibold text-slate-700 hover:text-[#e51a24] transition-colors relative py-1 group whitespace-nowrap"
            >
              {link.name}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#e51a24] transition-all duration-300 group-hover:w-full"></span>
            </a>
          ))}
        </nav>

        {/* CTA Button */}
        <div className="hidden md:flex items-center">
          <a
            href="/contact"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold bg-[#e51a24] hover:bg-[#c8141d] text-white shadow-md hover:shadow-lg transition-all duration-200 group"
          >
            <span>Book Now</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-lg text-slate-700 hover:text-[#e51a24] hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-[#e51a24]"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[65px] bg-slate-900/60 backdrop-blur-sm z-40" onClick={() => setMobileMenuOpen(false)}>
          <div 
            className="absolute top-0 right-0 w-full max-w-sm bg-white h-full shadow-2xl p-6 flex flex-col justify-between overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-4">
              <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Navigation</span>
                <button 
                  onClick={() => setMobileMenuOpen(false)} 
                  className="p-1 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex flex-col space-y-2">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-3 rounded-lg text-base font-semibold text-slate-800 hover:bg-slate-50 hover:text-[#e51a24] transition-all flex items-center justify-between"
                  >
                    <span>{link.name}</span>
                    <ArrowRight className="w-4 h-4 text-slate-300" />
                  </a>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 space-y-3">
              <a
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-lg text-sm font-bold bg-[#e51a24] text-white shadow-md"
              >
                <span>Book Now</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <div className="text-center text-xs text-slate-500 pt-2">
                <p>Call Us: (0922) 240-1919</p>
                <p>Email: jr@ggautomation.tech</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
