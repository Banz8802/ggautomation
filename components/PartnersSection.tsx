'use client';

import React, { useState, useEffect, useRef } from 'react';
import SectionHeading from './SectionHeading';
import Image from 'next/image';
import { 
  ShieldCheck, 
  Award, 
  Zap, 
  Cpu, 
  Waves, 
  CheckCircle2, 
  Sparkles,
  Layers
} from 'lucide-react';

interface PartnerBrand {
  name: string;
  tag: string;
  image?: string;
  fallbackIcon?: string;
}

// Category 2: HIGH END SYSTEMS (folder: /images/high-end/)
const highEndPartners: PartnerBrand[] = [
  { name: 'Chisage ESS', tag: 'Hybrid Inverters & ESS', image: '/images/high-end/chisage.webp' },
  { name: 'SMA Solar', tag: 'German Solar Inverters', image: '/images/high-end/sma.webp' },
  { name: 'SolarEdge', tag: 'DC Optimizers & Inverters', image: '/images/high-end/solaredge.webp' },
  { name: 'Sungrow', tag: 'Hybrid & Commercial Inverters', image: '/images/high-end/sungrow.webp' },
];

// Category 1: Companies & Collaborators (folder: /images/comp/)
const componentPartners: PartnerBrand[] = [
  { name: 'Gaisano Capital', tag: 'Commercial Partner', image: '/images/comp/gaisano-c.webp' },
  { name: 'Gaisano Grand', tag: 'Commercial Malls', image: '/images/comp/gaisano-g.webp' },
  { name: 'Monark Equipment', tag: 'Heavy Equipment Partner', image: '/images/comp/monark.webp' },
  { name: 'Canadian Solar', tag: 'Solar PV Tech', image: '/images/comp/canad.webp' },
  { name: 'E-Formula', tag: 'Engineering Solutions', image: '/images/comp/eformula.webp' },
  { name: 'Daeeun', tag: 'Solar Energy Tech', image: '/images/comp/daeeun1.webp' },
  { name: 'Deco', tag: 'Construction & Development', image: '/images/comp/deco.webp' },
  { name: 'Ditro', tag: 'Industrial Automation', image: '/images/comp/ditro.webp' },
  { name: 'Japan Partner', tag: 'Renewable Technology', image: '/images/comp/japan.webp' },
  { name: 'Ocean Park', tag: 'Commercial Client', image: '/images/comp/oceanp.webp' },
];

// Category 3: OTHER SYSTEMS (folder: /images/other-sys/)
const otherSysPartners: PartnerBrand[] = [
  { name: 'Astronergy', tag: 'Tier-1 Solar Modules', image: '/images/other-sys/astro.webp' },
  { name: 'GCL System', tag: 'High-Efficiency PV', image: '/images/other-sys/gcl.webp' },
  { name: 'Growatt', tag: 'Smart Solar Inverters', image: '/images/other-sys/growatt.webp' },
  { name: 'Huawei FusionSolar', tag: 'Smart PV Solutions', image: '/images/other-sys/huawei.webp' },
  { name: 'JA Solar', tag: 'High Power Modules', image: '/images/other-sys/jasolar.webp' },
  { name: 'Jinko Solar', tag: 'N-Type Tiger Neo', image: '/images/other-sys/jinko.webp' },
  { name: 'LONGi Solar', tag: 'Hi-MO Monocrystalline', image: '/images/other-sys/longi.webp' },
  { name: 'Suntech', tag: 'Tier-1 Solar Panels', image: '/images/other-sys/suntech.webp' },
  { name: 'Trina Solar', tag: 'Vertex Ultra-High PV', image: '/images/other-sys/trina.webp' },
];

function PartnerCard({ brand, folder }: { brand: PartnerBrand; folder: string }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="h-16 sm:h-20 w-auto flex-shrink-0 flex items-center justify-center mx-[10px] select-none transition-transform duration-300 hover:scale-105">
      {brand.image && !imgError ? (
        <Image
          src={brand.image}
          alt={brand.name}
          width={260}
          height={80}
          className="h-full w-auto max-w-none object-contain"
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="text-center space-y-1 px-4 py-2 rounded-2xl bg-white border border-slate-200">
          <div className="text-xs sm:text-sm font-black text-[#091833] group-hover:text-[#e51a24] transition-colors tracking-tight truncate">
            {brand.name}
          </div>
          <div className="text-[10px] font-bold text-slate-500 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-md truncate inline-block">
            {brand.tag}
          </div>
        </div>
      )}
    </div>
  );
}

function SteadyPartnerRow({
  title,
  brands,
  folder,
  intervalMs = 3500,
}: {
  title?: string;
  brands: PartnerBrand[];
  folder: string;
  intervalMs?: number;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const hasMoreThan4 = brands.length > 4;

  const prevSlide = () => {
    if (!scrollRef.current) return;
    const el = scrollRef.current;
    if (el.scrollLeft <= 20) {
      el.scrollTo({ left: el.scrollWidth, behavior: 'smooth' });
    } else {
      el.scrollBy({ left: -260, behavior: 'smooth' });
    }
  };

  const nextSlide = () => {
    if (!scrollRef.current) return;
    const el = scrollRef.current;
    if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 30) {
      el.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      el.scrollBy({ left: 260, behavior: 'smooth' });
    }
  };

  // Delayed step-by-step auto-scroll every 3.5s
  useEffect(() => {
    if (!hasMoreThan4 || isHovered) return;

    const timer = setInterval(() => {
      nextSlide();
    }, intervalMs);

    return () => clearInterval(timer);
  }, [hasMoreThan4, isHovered, intervalMs]);

  return (
    <div 
      className="space-y-3"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Category Header (Centered) */}
      {title && (
        <div className="text-center pt-2">
          <h4 className="text-xs sm:text-sm md:text-base font-black text-[#091833] tracking-widest uppercase">
            {title}
          </h4>
        </div>
      )}

      {/* Steady Logos Container with Navigation Arrows and Uniform Spacing */}
      <div className="relative flex items-center justify-center max-w-6xl mx-auto px-2 sm:px-4">
        {/* Left Arrow Button */}
        {hasMoreThan4 && (
          <button
            onClick={prevSlide}
            aria-label="Previous partners"
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white hover:bg-[#e51a24] text-[#091833] hover:text-white shadow-md border border-slate-200 flex items-center justify-center flex-shrink-0 transition-all cursor-pointer hover:scale-110 active:scale-95 z-20 mr-1 sm:mr-3"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* Scrollable Viewport Window */}
        <div
          ref={scrollRef}
          className={`flex-1 flex items-center overflow-x-auto scroll-smooth py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
            !hasMoreThan4 ? 'justify-center' : 'justify-start'
          }`}
        >
          {brands.map((brand, idx) => (
            <PartnerCard key={`${brand.name}-${idx}`} brand={brand} folder={folder} />
          ))}
        </div>

        {/* Right Arrow Button */}
        {hasMoreThan4 && (
          <button
            onClick={nextSlide}
            aria-label="Next partners"
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white hover:bg-[#e51a24] text-[#091833] hover:text-white shadow-md border border-slate-200 flex items-center justify-center flex-shrink-0 transition-all cursor-pointer hover:scale-110 active:scale-95 z-20 ml-1 sm:mr-3"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

export default function PartnersSection() {
  return (
    <section id="partners" className="py-16 sm:py-20 bg-white relative overflow-hidden border-t border-b border-slate-200 scroll-mt-16">
      {/* Background Subtle Tech Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#091833_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.03] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        {/* Section Heading */}
        <SectionHeading
          badge="OUR NETWORK"
          title="Companies & Collaborators"
        />

        {/* 3 Steady 4-Logo Rows */}
        <div className="space-y-10">
          
          {/* Row 1: Companies & Collaborators (Steady 4 logos, no category title) */}
          <SteadyPartnerRow
            brands={componentPartners}
            folder="images/comp"
          />

          {/* Row 2: HIGH END SYSTEMS (Steady 4 logos, centered title) */}
          <SteadyPartnerRow
            title="HIGH END SYSTEMS"
            brands={highEndPartners}
            folder="images/high-end"
          />

          {/* Row 3: OTHER SYSTEMS (Steady 4 logos, centered title) */}
          <SteadyPartnerRow
            title="OTHER SYSTEMS"
            brands={otherSysPartners}
            folder="images/other-sys"
          />

        </div>
      </div>
    </section>
  );
}

