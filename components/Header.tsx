'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Logo from './Logo';
import { Menu, X, ArrowRight, Phone, Mail, MapPin } from 'lucide-react';

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
  const pathname = usePathname();
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

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };
    if (mobileMenuOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  return (
    <>
      <header className={`sticky top-0 z-40 transition-all duration-300 ${
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
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <a
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-semibold transition-colors relative py-1 group whitespace-nowrap ${
                    isActive ? 'text-[#e51a24]' : 'text-slate-700 hover:text-[#e51a24]'
                  }`}
                >
                  {link.name}
                  <span className={`absolute bottom-0 left-0 h-0.5 bg-[#e51a24] transition-all duration-300 ${
                    isActive ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}></span>
                </a>
              );
            })}
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
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Overlay (Placed outside header so backdrop-filter does not clip fixed elements) */}
      <div 
        className={`lg:hidden fixed inset-0 z-50 transition-opacity duration-300 ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden={!mobileMenuOpen}
      >
        {/* Backdrop Overlay */}
        <div 
          className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
        />

        {/* Slide-over Drawer Panel */}
        <div 
          className={`absolute top-0 right-0 w-full max-w-sm h-full max-h-screen bg-white shadow-2xl flex flex-col justify-between overflow-y-auto transition-transform duration-300 ease-out ${
            mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div>
            {/* Drawer Top Bar */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
              <a href="/" onClick={() => setMobileMenuOpen(false)}>
                <Logo variant="dark" />
              </a>
              <button 
                onClick={() => setMobileMenuOpen(false)} 
                className="p-2 -mr-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-[#e51a24]"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Nav Links */}
            <nav className="p-4 sm:p-5 flex flex-col space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-3 py-1">
                Navigation
              </span>
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-3.5 py-3 rounded-xl text-base font-semibold transition-all flex items-center justify-between ${
                      isActive 
                        ? 'bg-red-50 text-[#e51a24] font-bold' 
                        : 'text-slate-800 hover:bg-slate-50 hover:text-[#e51a24]'
                    }`}
                  >
                    <span>{link.name}</span>
                    <ArrowRight className={`w-4 h-4 transition-transform ${
                      isActive ? 'text-[#e51a24] translate-x-0.5' : 'text-slate-300'
                    }`} />
                  </a>
                );
              })}
            </nav>
          </div>

          {/* Drawer Footer with Actions and Contacts */}
          <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/70 space-y-4">
            <a
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-sm font-bold bg-[#e51a24] hover:bg-[#c8141d] text-white shadow-md active:scale-[0.99] transition-all"
            >
              <span>Book Free Consultation</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <div className="space-y-1.5 text-xs text-slate-600 pt-1">
              <a 
                href="tel:+639222401919" 
                className="flex items-center gap-2 hover:text-[#e51a24] transition-colors py-0.5"
              >
                <Phone className="w-3.5 h-3.5 text-[#e51a24]" />
                <span className="font-semibold">(0922) 240-1919</span>
              </a>
              <a 
                href="mailto:info@ggautomation.tech" 
                className="flex items-center gap-2 hover:text-[#e51a24] transition-colors py-0.5"
              >
                <Mail className="w-3.5 h-3.5 text-[#e51a24]" />
                <span>info@ggautomation.tech</span>
              </a>
              <div className="flex items-center gap-2 text-slate-400 pt-1">
                <MapPin className="w-3.5 h-3.5 text-[#ffc000]" />
                <span className="text-[11px]">Offices: Cebu • Bohol • Davao</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
