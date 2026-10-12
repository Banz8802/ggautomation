import React from 'react';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

export default function TopBar() {
  return (
    <div className="bg-[#091833] text-slate-300 text-xs py-2 border-b border-white/10 hidden sm:block">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap justify-between items-center gap-4">
        {/* Left Side: Contact details */}
        <div className="flex items-center gap-6 flex-wrap">
          <a 
            href="tel:+639681761919" 
            className="flex items-center gap-2 hover:text-[#ffc000] transition-colors"
            title="Call Sales & Marketing"
          >
            <Phone className="w-3.5 h-3.5 text-[#e51a24]" />
            <span className="font-medium">Sales &amp; Marketing: +63-968-176-1919</span>
          </a>
          <a 
            href="mailto:info@ggautomation.tech" 
            className="flex items-center gap-2 hover:text-[#ffc000] transition-colors"
            title="Email Us"
          >
            <Mail className="w-3.5 h-3.5 text-[#e51a24]" />
            <span>info@ggautomation.tech</span>
          </a>
          <div className="hidden lg:flex items-center gap-2 text-slate-400">
            <Clock className="w-3.5 h-3.5 text-[#ffc000]" />
            <span>Mon - Sat: 8:00 AM - 5:00 PM</span>
          </div>

          {/* Brand Slogan */}
          <div className="hidden 2xl:flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#0b7337]/30 border border-[#0b7337]/60 text-emerald-300 text-[11px] font-medium tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>&ldquo;On the job, to better everybody&apos;s life!&rdquo;</span>
          </div>
        </div>

        {/* Right Side: Locations & Socials */}
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-1.5 text-slate-300">
            <MapPin className="w-3.5 h-3.5 text-[#e51a24]" />
            <span className="font-semibold text-white">Offices:</span>
            <span className="text-slate-300">Cebu | Bohol | Davao</span>
          </div>

          <div className="h-3.5 w-px bg-slate-700"></div>

          <div className="flex items-center gap-3">
            <a 
              href="https://www.facebook.com/GGAutomation.1" 
              target="_blank" 
              rel="noreferrer"
              className="p-1 hover:text-[#ffc000] hover:bg-white/5 rounded transition-all"
              aria-label="Facebook Page"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
