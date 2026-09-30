import React from 'react';
import Image from 'next/image';

interface LogoProps {
  variant?: 'light' | 'dark';
  className?: string;
  width?: number;
  height?: number;
  src?: string;
}

export default function Logo({ 
  variant = 'dark', 
  className = '', 
  width = 200, 
  height = 48,
  src,
}: LogoProps) {
  const isDark = variant === 'dark';
  const logoSrc = src || (isDark ? '/images/logo-trans.webp' : '/images/logo-footer.png');

  return (
    <div className={`flex items-center select-none ${className}`}>
      <Image
        src={logoSrc}
        alt="GG Automation Construction Services"
        width={width}
        height={height}
        className="h-9 sm:h-10 md:h-11 w-auto object-contain transition-all duration-200"
        priority={isDark}
      />
    </div>
  );
}


