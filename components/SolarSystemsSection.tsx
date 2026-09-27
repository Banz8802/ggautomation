'use client';

import React, { useState } from 'react';
import SectionHeading from './SectionHeading';
import { ShieldCheck, Zap, BatteryCharging, ArrowRight, CheckCircle2 } from 'lucide-react';

const solarSystems = [
  {
    id: 'ongrid',
    title: 'On-Grid Solar System',
    tagline: 'Grid-Tied with Net-Metering Savings',
    badge: 'Most Popular for Commercial',
    badgeColor: 'bg-[#e51a24] text-white',
    icon: <Zap className="w-8 h-8 text-[#e51a24]" />,
    description: 'Directly synchronized with your utility provider (e.g. VECO, MERALCO, CEBECO). Sunlight powers daytime consumption, and excess energy is exported back to the grid for utility bill credits.',
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
    description: 'The best of both worlds. Generates solar energy for immediate consumption, exports excess to grid via net-metering, and stores surplus energy in lithium batteries for automatic outage backup.',
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
    badge: 'Remote & Island Ready',
    badgeColor: 'bg-[#091833] text-white border border-white/20',
    icon: <ShieldCheck className="w-8 h-8 text-emerald-400" />,
    description: 'Completely independent from utility power lines. Engineered with robust solar PV panels, high-capacity lithium battery banks, and backup diesel generator auto-start integration.',
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
    <section id="solar-systems" className="py-20 bg-slate-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Section Heading */}
        <SectionHeading
          badge="INTRODUCTION"
          title="Solar Power Systems Comparison"
          subtitle="Explore our custom-engineered solar PV architectures designed to match your specific energy profile, budget, and power reliability requirements."
        />

        {/* System Choice Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {solarSystems.map((system) => {
            const isSelected = system.id === selectedSystem;
            return (
              <div
                key={system.id}
                onClick={() => setSelectedSystem(system.id)}
                className={`cursor-pointer rounded-2xl p-8 border transition-all duration-300 flex flex-col justify-between ${
                  isSelected
                    ? 'bg-white border-[#e51a24] shadow-2xl ring-2 ring-[#e51a24]/50 scale-[1.02]'
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md'
                }`}
              >
                <div className="space-y-6">
                  {/* Top Badge & Icon */}
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      {system.icon}
                    </div>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase ${system.badgeColor}`}>
                      {system.badge}
                    </span>
                  </div>

                  {/* Title */}
                  <div>
                    <h3 className="text-2xl font-extrabold text-[#091833]">
                      {system.title}
                    </h3>
                    <p className="text-xs font-semibold text-[#e51a24] mt-1">
                      {system.tagline}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {system.description}
                  </p>

                  {/* Feature Bullets */}
                  <div className="space-y-2.5 pt-2">
                    {system.benefits.map((benefit, bIdx) => (
                      <div key={bIdx} className="flex items-start gap-2.5 text-xs text-slate-700 font-medium">
                        <CheckCircle2 className="w-4 h-4 text-[#e51a24] flex-shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Specs Footer */}
                <div className="pt-6 mt-6 border-t border-slate-100 space-y-4">
                  <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div>
                      <span className="text-slate-400 block font-medium">Estimated Payback</span>
                      <span className="font-extrabold text-[#091833]">{system.specs.payback}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-medium">Battery Storage</span>
                      <span className="font-extrabold text-[#091833]">{system.specs.batteryBackup}</span>
                    </div>
                  </div>

                  <a
                    href="#calculator"
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-lg text-xs font-bold bg-[#091833] hover:bg-[#e51a24] text-white transition-colors"
                  >
                    <span>Request System Estimate</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
