'use client';

import React from 'react';
import Logo from './Logo';
import { Phone, Mail, MapPin, ChevronUp, ArrowRight } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#000000] text-slate-300 pt-16 pb-8 border-t border-white/15 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Main Footer Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          
          {/* Brand Info */}
          <div className="lg:col-span-4 space-y-5">
            <Logo variant="light" />
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-sm">
              GG Automation Construction Services is a premier renewable energy EPC contractor in the Philippines dedicated to high-yield solar PV installations, electrical engineering, floating solar arrays, and energy efficiency.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://www.facebook.com/GGAutomation.1"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#e51a24] text-white flex items-center justify-center transition-colors"
                aria-label="Facebook Page"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#e51a24] text-white flex items-center justify-center transition-colors"
                aria-label="YouTube Channel"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/10 pb-2">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-xs">
              {[
                { name: 'Home', href: '/' },
                { name: 'Services', href: '/services' },
                { name: 'Projects', href: '/projects' },
                { name: 'About Us', href: '/about' },
                { name: 'Trainings', href: '/trainings' },
                { name: 'News & Updates', href: '/news-updates' },
                { name: 'Careers', href: '/careers' },
                { name: 'Contact', href: '/contact' },
              ].map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="hover:text-[#ffc000] transition-colors flex items-center gap-1.5"
                  >
                    <ArrowRight className="w-3 h-3 text-[#e51a24]" />
                    <span>{link.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Links */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/10 pb-2">
              Our Services
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li>Renewable Energy EPC & Design</li>
              <li>On-Grid & Net-Metering Solar</li>
              <li>Hybrid Solar & Battery Storage</li>
              <li>Off-Grid Autonomous Power</li>
              <li>Floating Solar PV Systems</li>
              <li>High/Low Voltage Electrical Wiring</li>
              <li>Solar Preventive Maintenance (O&M)</li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/10 pb-2">
              Contact Us
            </h4>
            <ul className="space-y-3 text-xs text-slate-300">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#e51a24] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">Cebu EPC Hub: <span className="font-normal text-slate-300">Labangon, Cebu City</span></p>
                  <p className="font-semibold text-white">Bohol Showroom: <span className="font-normal text-slate-300">Ubujan, Tagbilaran</span></p>
                  <p className="font-semibold text-white">Davao Office: <span className="font-normal text-slate-300">Brgy 27-C, Davao City</span></p>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-[#e51a24] flex-shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <div><span className="text-slate-400">Cebu:</span> <a href="tel:+639222401919" className="hover:text-[#ffc000] font-medium text-white">(0922) 240-1919</a></div>
                  <div><span className="text-slate-400">Bohol:</span> <a href="tel:+639683882510" className="hover:text-[#ffc000] font-medium text-white">(0968) 388-2510</a></div>
                  <div><span className="text-slate-400">Davao:</span> <a href="tel:+63822242785" className="hover:text-[#ffc000] font-medium text-white">(082) 224-2785</a></div>
                </div>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#e51a24] flex-shrink-0" />
                <a href="mailto:info@ggautomation.tech" className="hover:text-[#ffc000]">
                  info@ggautomation.tech
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Brand Slogan Green Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-[#0b7337] via-[#0d7e3a] to-[#064420] p-4 sm:p-5 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 border border-emerald-500/30">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded-lg bg-white/20 text-[#ffc000] text-xs font-black">
              GG AUTOMATION
            </span>
            <p className="text-sm sm:text-base font-extrabold italic tracking-wide text-white">
              &ldquo;on the job, to better everybody&apos;s life!&rdquo;
            </p>
          </div>
          <a
            href="/contact"
            className="px-5 py-2.5 rounded-xl bg-white text-[#0b7337] hover:bg-emerald-50 text-xs font-black shadow-md transition-all whitespace-nowrap"
          >
            Get Free Quote &rarr;
          </a>
        </div>

        {/* Bottom Bar & Copyright */}
        <div className="pt-8 pb-6 sm:pb-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} GG Automation Construction Services. All rights reserved.</p>

          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Clean Energy Engineering & Construction</span>
            </span>
            <button
              onClick={scrollToTop}
              className="p-2.5 rounded-full bg-white/10 hover:bg-[#e51a24] text-white transition-colors focus:outline-none"
              aria-label="Back to Top"
              title="Back to Top"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
