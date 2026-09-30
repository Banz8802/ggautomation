'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import SectionHeading from './SectionHeading';
import { ShieldCheck, Zap, BatteryCharging, ArrowRight, CheckCircle2 } from 'lucide-react';

const solarSystems = [
  {
    id: 'ongrid',
    title: 'On-Grid Solar System',
    tagline: 'Grid-Tied with Net-Metering Savings',
    badge: 'Most Popular for Commercial',
    badgeColor: 'bg-[#e51a24] text-white',
    icon: <Zap className="w-8 h-8 text-[#ffc000]" />,
    description:
      'Directly synchronized with your utility provider (e.g. VECO, MERALCO, CEBECO). Sunlight powers daytime consumption, and excess energy is exported back to the grid for utility bill credits.',
    benefits: [
      'Lowest Initial Investment & Fastest Payback (3 - 4 Years)',
      'Utility Net-Metering Enabled for Monthly Energy Credits',
      'No battery maintenance costs required',
      'Ideal for offices, malls, schools & daytime operating factories',
    ],
    idealFor: 'Commercial buildings, hypermarkets, industrial plants operating 8am - 6pm.',
    specs: {
      payback: '3 - 4 Years',
      gridDependency: 'Required',
      batteryBackup: 'Optional',
      efficiency: 'Up to 98.6%',
    },
  },
  {
    id: 'hybrid',
    title: 'Hybrid Solar System',
    tagline: 'Grid Savings + Uninterrupted Battery Backup',
    badge: 'High Reliability',
    badgeColor: 'bg-[#ffc000] text-[#091833]',
    icon: <BatteryCharging className="w-8 h-8 text-[#ffc000]" />,
    description:
      'The best of both worlds. Generates solar energy for immediate consumption, exports excess to grid via net-metering, and stores surplus energy in lithium batteries for automatic outage backup.',
    benefits: [
      'Uninterrupted 24/7 Power Security During Blackouts',
      'Smart Battery Energy Management System (BEMS)',
      'Peak-Shaving: Uses stored energy during high tariff rates',
      'Protects sensitive IT servers, cold storage & critical medical gear',
    ],
    idealFor: 'Data centers, hospitals, resorts, luxury residences, cold storage facilities.',
    specs: {
      payback: '4 - 6 Years',
      gridDependency: 'Hybrid / Smart Sync',
      batteryBackup: 'Included (LiFePO4)',
      efficiency: 'Up to 97.8%',
    },
  },
  {
    id: 'offgrid',
    title: 'Off-Grid Solar System',
    tagline: '100% Autonomous Clean Energy Independence',
    badge: '100% Clean Energy Independence',
    badgeColor: 'bg-[#0b7337] text-white shadow-sm',
    icon: <ShieldCheck className="w-8 h-8 text-emerald-400" />,
    description:
      'Completely independent from utility power lines. Engineered with robust solar PV panels, high-capacity lithium battery banks, and backup diesel generator auto-start integration.',
    benefits: [
      'Zero monthly electricity bills forever',
      'Total energy independence for un-electrified remote regions',
      'Heavy-duty industrial off-grid inverters with pure sine wave',
      'Designed for harsh tropical & coastal environments',
    ],
    idealFor: 'Remote island resorts, agricultural farms, mountain estates, telecom towers.',
    specs: {
      payback: 'Immediate ROI vs Diesel',
      gridDependency: 'None (Standalone)',
      batteryBackup: 'Primary Source',
      efficiency: 'Up to 96.5%',
    },
  },
];

export default function SolarSystemsSection() {
  const [selectedSystem, setSelectedSystem] = useState(solarSystems[0].id);

  return (
    <section id="solar-systems" className="py-20 sm:py-24 bg-[#091833] text-white relative overflow-hidden border-b border-white/10 scroll-mt-16">
      {/* Yellow Highlight Ambient Glow Halos */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[550px] bg-[#ffc000]/12 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute top-0 right-10 w-96 h-96 bg-[#ffc000]/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-10 w-96 h-96 bg-[#ffc000]/8 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Subtle Tech Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.03] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">
        {/* Section Heading */}
        <SectionHeading
          badge="INTRODUCTION"
          title="Solar Power Systems Comparison"
          subtitle="Explore our custom-engineered solar PV architectures designed to match your specific energy profile, budget, and power reliability requirements."
          theme="dark"
        />

        {/* System Choice Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {solarSystems.map((system) => {
            const isSelected = system.id === selectedSystem;
            return (
              <div
                key={system.id}
                onClick={() => setSelectedSystem(system.id)}
                className={`cursor-pointer rounded-3xl p-8 border transition-all duration-300 flex flex-col justify-between backdrop-blur-xl group ${
                  isSelected
                    ? 'bg-slate-900/95 border-[#ffc000] shadow-2xl shadow-[#ffc000]/20 ring-2 ring-[#ffc000]/60 scale-[1.02]'
                    : 'bg-slate-900/80 border-white/10 hover:border-[#ffc000]/50 hover:bg-slate-900/95 shadow-xl hover:shadow-2xl hover:shadow-[#ffc000]/10 hover:-translate-y-1'
                }`}
              >
                <div className="space-y-6">
                  {/* Top Badge & Icon */}
                  <div className="flex items-center justify-between">
                    <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 group-hover:border-[#ffc000]/40 transition-colors">
                      {system.icon}
                    </div>
                    <span className={`text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider ${system.badgeColor}`}>
                      {system.badge}
                    </span>
                  </div>

                  {/* Title */}
                  <div>
                    <h3 className="text-2xl font-black text-white group-hover:text-[#ffc000] transition-colors">
                      {system.title}
                    </h3>
                    <p className="text-xs font-bold text-[#ffc000] mt-1 tracking-wide">
                      {system.tagline}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-slate-300 leading-relaxed font-normal">
                    {system.description}
                  </p>

                  {/* Feature Bullets */}
                  <div className="space-y-2.5 pt-2 border-t border-white/10">
                    {system.benefits.map((benefit, bIdx) => (
                      <div key={bIdx} className="flex items-start gap-2.5 text-xs text-slate-200 font-medium">
                        <CheckCircle2 className="w-4 h-4 text-[#ffc000] flex-shrink-0 mt-0.5" />
                        <span className="leading-snug">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Specs Footer */}
                <div className="pt-6 mt-6 border-t border-white/10 space-y-4">
                  <div className="grid grid-cols-2 gap-3 text-xs bg-white/5 p-3.5 rounded-2xl border border-white/10">
                    <div>
                      <span className="text-slate-400 block font-medium">Estimated Payback</span>
                      <span className="font-black text-white text-sm">{system.specs.payback}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-medium">Battery Storage</span>
                      <span className="font-black text-[#ffc000] text-sm">{system.specs.batteryBackup}</span>
                    </div>
                  </div>

                  <Link
                    href="/contact"
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-xs font-black bg-[#ffc000] hover:bg-[#e5a800] text-[#091833] shadow-lg shadow-[#ffc000]/20 transition-all hover:gap-3 group-hover:shadow-[#ffc000]/30"
                  >
                    <span>Request System Estimate</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
