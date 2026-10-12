'use client';

import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show button after scrolling down 200px
      if (window.scrollY > 200) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    // Check initial scroll position
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div
      className={`fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-40 transition-all duration-300 ease-out ${
        isVisible
          ? 'opacity-100 translate-y-0 pointer-events-auto scale-100'
          : 'opacity-0 translate-y-3 pointer-events-none scale-90'
      }`}
    >
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Go to top"
        title="Go to top"
        className="group relative flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#091833]/90 hover:bg-[#e51a24] text-white border border-white/20 hover:border-[#e51a24] shadow-xl hover:shadow-red-600/30 backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#ffc000]"
      >
        {/* Glowing aura on hover */}
        <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#e51a24]/30 to-[#ffc000]/30 blur-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

        {/* Arrow Icon with subtle upward animation on hover */}
        <ArrowUp className="w-5 h-5 relative z-10 transition-transform duration-200 group-hover:-translate-y-0.5" strokeWidth={2.5} />

        {/* Desktop Tooltip */}
        <span className="absolute right-full mr-2.5 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-slate-900/95 text-white text-[11px] font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 shadow-xl border border-white/10 hidden sm:block">
          Go to top
          <span className="absolute top-1/2 -translate-y-1/2 -right-1 border-4 border-transparent border-l-slate-900/95" />
        </span>
      </button>
    </div>
  );
}
