import React from 'react';

interface SectionHeadingProps {
  badge: string;
  title: string;
  subtitle?: string;
  centered?: boolean;
  theme?: 'light' | 'dark';
}

export default function SectionHeading({
  badge,
  title,
  subtitle,
  centered = true,
  theme = 'light',
}: SectionHeadingProps) {
  const isDark = theme === 'dark';

  return (
    <div className={`space-y-3 ${centered ? 'text-center max-w-3xl mx-auto' : 'max-w-2xl'}`}>
      {/* Category Red Badge */}
      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-widest ${
        isDark 
          ? 'bg-[#e51a24]/20 text-[#ffc000] border border-[#e51a24]/40' 
          : 'bg-[#e51a24]/10 text-[#e51a24] border border-[#e51a24]/20'
      }`}>
        <span className="w-1.5 h-1.5 rounded-full bg-[#e51a24] animate-ping"></span>
        <span>{badge}</span>
      </div>

      {/* Title */}
      <h2 className={`text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight leading-tight ${
        isDark ? 'text-white' : 'text-[#091833]'
      }`}>
        {title}
      </h2>

      {/* Optional Subtitle */}
      {subtitle && (
        <p className={`text-base sm:text-lg font-normal leading-relaxed ${
          isDark ? 'text-slate-300' : 'text-slate-600'
        }`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
