'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import SectionHeading from './SectionHeading';
import { ArrowRight, Home, Building2, Factory, GraduationCap, Sparkles } from 'lucide-react';

const serviceTypes = [
  {
    id: 'residential',
    title: 'Residential',
    icon: <Home className="w-5 h-5 text-[#0b7337]" />,
    image: '/images/service-residential.webp',
    headline: 'Turn your roof into a source of savings.',
    description:
      'GG Automation delivers smart, efficient solar solutions that cut your electricity bills and power your home with clean energy. We handle everything—from design to installation and net-metering support—so you can enjoy worry-free savings and a greener lifestyle.',
    link: '/projects',
    badge: 'Home Solar',
  },
  {
    id: 'commercial',
    title: 'Commercial',
    icon: <Building2 className="w-5 h-5 text-[#e51a24]" />,
    image: '/images/service-commercial.webp',
    headline: 'Power your business, lower your overhead.',
    description:
      'GG Automation provides tailored solar solutions for commercial spaces, helping you cut energy costs, boost efficiency, and showcase your commitment to sustainability. We deliver full-service installations with minimal disruption to your operations.',
    link: '/projects',
    badge: 'Business Solar',
  },
  {
    id: 'industrial',
    title: 'Industrial',
    icon: <Factory className="w-5 h-5 text-[#ffc000]" />,
    image: '/images/service-industrial.webp',
    headline: 'Energy solutions built for heavy demand.',
    description:
      'Our industrial solar systems are engineered for high-performance and long-term reliability. From factories to large facilities, GG Automation ensures robust installations that reduce operating costs and future-proof your energy needs.',
    link: '/projects',
    badge: 'Heavy Industry',
  },
  {
    id: 'schools',
    title: 'School & Universities',
    icon: <GraduationCap className="w-5 h-5 text-indigo-500" />,
    image: '/images/uclm-roof2.webp',
    headline: 'Clean campus energy, lower institutional overhead.',
    description:
      'GG Automation designs turnkey institutional solar installations for campuses, academies, and universities. We help educational institutions cut operating costs, advance sustainability, and provide live energy learning for students.',
    link: '/projects',
    badge: 'Campus Solar',
  },
];

export default function SolarServiceTypesSection() {
  return (
    <section id="services" className="py-20 sm:py-24 bg-white text-slate-900 relative overflow-hidden border-b border-slate-200 scroll-mt-16">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#091833_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.03] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14 relative z-10">
        {/* Section Heading */}
        <SectionHeading
          badge="SOLAR SERVICES & SECTORS"
          title="Engineered Solar Solutions for Every Sector"
          subtitle="Whether powering private homes, commercial shopping malls, massive industrial plants, or providing lifetime maintenance, GG Automation delivers certified clean energy excellence."
        />

        {/* 4-Card Column Grid matching reference layout with modern UI/UX */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {serviceTypes.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl p-5 border border-slate-200/90 hover:border-[#e51a24]/40 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1.5"
            >
              <div className="space-y-4">
                {/* Card Top Image with Rounded Corners */}
                <Link href={item.link} className="block relative h-48 sm:h-52 w-full rounded-2xl overflow-hidden bg-slate-100 shadow-inner">
                  <Image
                    src={item.image}
                    alt={`${item.title} Solar Services`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent"></div>
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md text-[#091833] text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm border border-slate-200">
                    {item.badge}
                  </div>
                </Link>

                {/* Card Title */}
                <Link href={item.link} className="block">
                  <h3 className="text-xl sm:text-2xl font-black text-[#091833] tracking-tight group-hover:text-[#e51a24] transition-colors">
                    {item.title}
                  </h3>
                </Link>

                {/* Headline & Body Copy */}
                <div className="space-y-2">
                  <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                    {item.headline}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal line-clamp-5">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-6 mt-4 border-t border-slate-100">
                <Link
                  href={item.link}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl text-xs sm:text-sm font-bold bg-[#e51a24] hover:bg-[#c8141d] text-white shadow-md hover:shadow-red-600/30 transition-all duration-200 group/btn"
                >
                  <span>Learn more</span>
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
