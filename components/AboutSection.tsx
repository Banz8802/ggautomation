import React from 'react';
import Image from 'next/image';
import SectionHeading from './SectionHeading';
import { Lightbulb, Sun, Shield, Layers, CheckCircle2, Award, Zap, Building2 } from 'lucide-react';

const pillars = [
  {
    icon: <Sun className="w-6 h-6 text-[#e51a24]" />,
    title: 'Renewable Energy',
    description: 'Rooftop solar PV, floating solar systems, micro-grid integration, and clean power generation.',
  },
  {
    icon: <Zap className="w-6 h-6 text-[#ffc000]" />,
    title: 'Energy Engineering',
    description: 'Comprehensive electrical diagnostics, load analysis, power quality monitoring, and system design.',
  },
  {
    icon: <Lightbulb className="w-6 h-6 text-[#e51a24]" />,
    title: 'Energy Efficiency',
    description: 'Smart power factor correction, HVAC optimization, LED retrofits, and peak-shaving solutions.',
  },
  {
    icon: <Building2 className="w-6 h-6 text-[#ffc000]" />,
    title: 'Turnkey Construction',
    description: 'Licensed engineering construction, structural mounting, grid compliance, and utility net metering.',
  },
];

const highlights = [
  'Certified Licensed Engineering Team & Solar EPC Specialists',
  'Tier-1 Solar PV Equipment & 25-Year Performance Guarantee',
  'Custom Engineered Solutions for Commercial, Industrial & Residential',
  'Seamless Net-Metering Approval with Local Distribution Utilities',
];

export default function AboutSection() {
  return (
    <section id="about" className="py-20 bg-slate-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <SectionHeading
          badge="WE ARE"
          title="Sustainability Specialist & Engineering Partner"
          subtitle="GG Automation Construction Services is dedicated to empowering businesses and communities with sustainable, high-yield clean energy solutions and turnkey engineering excellence."
        />

        {/* Top Feature Grid & Image Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Image & Stats Overlay */}
          <div className="lg:col-span-6 relative">
            <div className="relative h-[380px] sm:h-[450px] rounded-2xl overflow-hidden shadow-2xl border border-slate-200">
              <Image
                src="/images/about-company.jpg"
                alt="GG Automation Engineering Team"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#091833]/80 via-transparent to-transparent"></div>
            </div>

            {/* Experience Floating Badge */}
            <div className="absolute -bottom-6 -right-4 sm:right-6 bg-white p-5 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-4 max-w-xs">
              <div className="w-12 h-12 rounded-xl bg-[#e51a24]/10 flex items-center justify-center flex-shrink-0">
                <Award className="w-7 h-7 text-[#e51a24]" />
              </div>
              <div>
                <div className="text-2xl font-black text-[#091833]">10+ Years</div>
                <div className="text-xs font-semibold text-slate-500">Engineering & Construction Excellence</div>
              </div>
            </div>
          </div>

          {/* About Text Content */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-[#091833]">
                Accelerating the Philippines' Transition to Clean Energy
              </h3>
              <p className="text-slate-600 leading-relaxed">
                GG Automation Construction Services combines deep electrical engineering expertise with state-of-the-art solar technology. We specialize in handling small to medium scale installations, preventive maintenance, and utility-scale projects.
              </p>
              <p className="text-slate-600 leading-relaxed">
                Whether powering commercial hypermarkets, educational campuses, industrial plants, or floating solar reservoirs, our solutions are engineered for safety, maximum energy yield, and long-term utility bill savings.
              </p>
            </div>

            {/* Bullet List */}
            <div className="space-y-3 pt-2">
              {highlights.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#e51a24] flex-shrink-0 mt-0.5" />
                  <span className="text-sm font-semibold text-slate-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 4 Core Pillars Grid */}
        <div className="pt-8 border-t border-slate-200">
          <div className="text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-[#e51a24]">CORE PILLARS</span>
            <h3 className="text-2xl font-extrabold text-[#091833] mt-1">Four Pillars of Our Sustainable Operations</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((pillar, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-xl border border-slate-200 hover:border-[#e51a24]/40 shadow-sm hover:shadow-md transition-all group duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-50 group-hover:bg-[#091833] flex items-center justify-center mb-4 transition-colors">
                  {pillar.icon}
                </div>
                <h4 className="text-lg font-bold text-[#091833] mb-2 group-hover:text-[#e51a24] transition-colors">
                  {pillar.title}
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
