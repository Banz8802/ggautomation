import React from 'react';

interface LogoProps {
  variant?: 'light' | 'dark';
  className?: string;
}

export default function Logo({ variant = 'dark', className = '' }: LogoProps) {
  const isDark = variant === 'dark';
  
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Brand Icon Emblem */}
      <div className="relative w-10 h-10 md:w-11 md:h-11 flex-shrink-0 flex items-center justify-center rounded-xl bg-gradient-to-br from-[#091833] to-[#0f2347] p-2 shadow-md border border-[#e51a24]/30 group-hover:border-[#e51a24] transition-colors">
        {/* Decorative Grid pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#e51a24_1px,transparent_1px)] [background-size:6px_6px] opacity-20 rounded-xl"></div>
        <svg 
          viewBox="0 0 36 36" 
          fill="none" 
          className="w-full h-full relative z-10 drop-shadow-sm"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* GG Interlocking Arcs */}
          <path 
            d="M8 18C8 12.4772 12.4772 8 18 8C22.5 8 26.3 11 27.5 15" 
            stroke="#e51a24" 
            strokeWidth="3.5" 
            strokeLinecap="round" 
          />
          <path 
            d="M28 18C28 23.5228 23.5228 28 18 28C13.5 28 9.7 25 8.5 21" 
            stroke="#ffc000" 
            strokeWidth="3.5" 
            strokeLinecap="round" 
          />
          {/* Central Solar/Lightning Bolt Accent */}
          <path 
            d="M19 10L14 19H19L17 26L23 16H18L20 10Z" 
            fill="#ffffff" 
            stroke="#091833" 
            strokeWidth="0.5"
          />
        </svg>
      </div>

      {/* Brand Text */}
      <div className="flex flex-col leading-tight">
        <div className="flex items-center gap-1 font-extrabold text-lg md:text-xl tracking-tight">
          <span className="text-[#e51a24]">GG</span>
          <span className={isDark ? 'text-[#091833]' : 'text-white'}>AUTOMATION</span>
        </div>
        <span className={`text-[10px] md:text-[11px] font-bold tracking-widest uppercase ${isDark ? 'text-slate-600' : 'text-slate-300'}`}>
          Construction Services
        </span>
      </div>
    </div>
  );
}
