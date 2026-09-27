'use client';

import React, { useState } from 'react';
import SectionHeading from './SectionHeading';
import { Sun, Cpu, Waves, Wrench, BatteryCharging, BarChart3, ArrowRight, Check } from 'lucide-react';

const services = [
  {
    id: 'solar-epc',
    icon: <Sun className="w-6 h-6" />,
    badge: 'Core Service',
    title: 'Renewable Energy EPC & Consultation',
    shortDesc: 'Complete turnkey solar engineering, procurement, construction, and grid connection.',
    fullDesc: 'We handle every aspect of solar photovoltaic system deployment—from initial shade modeling and electrical simulation to equipment procurement, certified installation, net-metering processing, and utility grid interconnection.',
    features: [
      'Commercial & Industrial Rooftop Solar PV',
      'Ground-Mounted Solar Power Plants',
      'Turnkey Net-Metering & Utility Approvals',
      'Financial ROI & Energy Payback Modeling',
    ],
  },
  {
    id: 'electrical-engineering',
    icon: <Cpu className="w-6 h-6" />,
    badge: 'Turnkey Power',
    title: 'Electrical Engineering Services',
    shortDesc: 'Professional high/low voltage electrical design, wiring, and panel distribution.',
    fullDesc: 'Our licensed electrical engineers specialize in high and low voltage power distribution, transformer installations, switchgear maintenance, breaker panel upgrades, and complete facility wiring.',
    features: [
      'High & Low Voltage Electrical Installations',
      'Custom Main Distribution Switchboard & Panel Assembly',
      'Transformer Supply, Testing & Commissioning',
      'Electrical Code & Safety Compliance Audits',
    ],
  },
  {
    id: 'floating-solar',
    icon: <Waves className="w-6 h-6" />,
    badge: 'Innovation',
    title: 'Floating Solar PV Systems',
    shortDesc: 'Pioneering clean energy platforms on water reservoirs, lakes, and aquaculture ponds.',
    fullDesc: 'Floating Solar PV unlocks clean power generation on water surfaces while mitigating land constraints. Benefits include natural water-cooling boost to panel efficiency and reduced reservoir water evaporation.',
    features: [
      'Reservoir & Lake Anchor Mooring Design',
      'HDPE UV-Resistant Modular Floating Structures',
      'High-Efficiency Marine-Grade PV Modules',
      'Environmental Impact & Water Quality Monitoring',
    ],
  },
  {
    id: 'operations-maintenance',
    icon: <Wrench className="w-6 h-6" />,
    badge: 'Life Cycle Care',
    title: 'Operations & Preventive Maintenance (O&M)',
    shortDesc: 'Proactive 24/7 system monitoring, thermal imaging inspection, and performance tuning.',
    fullDesc: 'Protect your renewable energy asset investment with GG Automation’s certified O&M packages. We ensure maximum solar yield through scheduled panel cleaning, inverter health checks, and rapid breakdown response.',
    features: [
      'Thermal Imaging & Drone Hotspot Detection',
      'IV Curve Diagnostics & Electrical Testing',
      'Automated Solar Panel Washing & Debris Removal',
      '24/7 Cloud Remote Monitoring & Diagnostics',
    ],
  },
  {
    id: 'energy-storage',
    icon: <BatteryCharging className="w-6 h-6" />,
    badge: 'Grid Resiliency',
    title: 'Energy Storage Systems (BESS) & Micro-Grids',
    shortDesc: 'Lithium battery energy storage for zero-outage backup and island micro-grids.',
    fullDesc: 'Ensure continuous 24/7 operation during power grid interruptions with smart Battery Energy Storage Systems (BESS). Integrated with hybrid inverters for seamless automatic generator or solar switching.',
    features: [
      'Lithium Iron Phosphate (LiFePO4) Battery Racks',
      'Hybrid Peak-Shaving & Load Displacement',
      'Off-Grid Island Micro-Grid Controllers',
      'Uninterrupted Power Supply (UPS) Zero-Transfer Time',
    ],
  },
  {
    id: 'energy-audits',
    icon: <BarChart3 className="w-6 h-6" />,
    badge: 'Efficiency',
    title: 'Energy Conservation & Power Quality Audits',
    shortDesc: 'Comprehensive energy usage analysis, harmonic filtering, and power factor correction.',
    fullDesc: 'Optimize your building energy profile. We conduct power quality measurements to eliminate penalty charges from utility providers and identify energy waste across HVAC, lighting, and heavy machinery.',
    features: [
      'Harmonic Analysis & Transient Voltage Suppression',
      'Automatic Power Factor Capacitor Banks (APFC)',
      'Building Energy Audit & Energy Baseline Reports',
      'Smart Metering & Sub-Metering Installations',
    ],
  },
];

export default function ServicesSection() {
  const [activeService, setActiveService] = useState(services[0].id);

  const selected = services.find((s) => s.id === activeService) || services[0];

  return (
    <section id="services" className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Section Heading */}
        <SectionHeading
          badge="OUR SERVICES"
          title="Turnkey Engineering & Solar Solutions"
          subtitle="From initial site feasibility and CAD design to procurement, construction, and lifetime maintenance, we provide end-to-end engineering excellence."
        />

        {/* Services Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => {
            const isSelected = service.id === activeService;
            return (
              <div
                key={service.id}
                onClick={() => setActiveService(service.id)}
                className={`cursor-pointer rounded-2xl p-7 border transition-all duration-300 flex flex-col justify-between group ${
                  isSelected
                    ? 'bg-[#091833] text-white border-[#e51a24] shadow-xl ring-2 ring-[#e51a24]/50 translate-y-[-4px]'
                    : 'bg-white text-slate-800 border-slate-200 hover:border-[#e51a24]/40 hover:shadow-lg hover:translate-y-[-2px]'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                      isSelected ? 'bg-[#e51a24] text-white' : 'bg-slate-100 text-[#091833] group-hover:bg-[#e51a24] group-hover:text-white'
                    }`}>
                      {service.icon}
                    </div>
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                      isSelected ? 'bg-white/10 text-[#ffc000]' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {service.badge}
                    </span>
                  </div>

                  <h3 className={`text-xl font-bold ${isSelected ? 'text-white' : 'text-[#091833] group-hover:text-[#e51a24]'}`}>
                    {service.title}
                  </h3>

                  <p className={`text-sm leading-relaxed ${isSelected ? 'text-slate-300' : 'text-slate-600'}`}>
                    {service.shortDesc}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-200/20 flex items-center justify-between">
                  <span className={`text-xs font-extrabold ${isSelected ? 'text-[#ffc000]' : 'text-[#e51a24]'}`}>
                    {isSelected ? 'Currently Viewing' : 'Click for Specs'}
                  </span>
                  <ArrowRight className={`w-4 h-4 transition-transform ${isSelected ? 'text-[#ffc000] translate-x-1' : 'text-slate-400 group-hover:text-[#e51a24] group-hover:translate-x-1'}`} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Service Detailed Showcase Card */}
        <div className="bg-[#091833] rounded-2xl p-8 sm:p-10 text-white shadow-2xl border border-white/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#e51a24]/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-[#ffc000] uppercase tracking-widest bg-white/10 px-3 py-1 rounded-full">
                <span>{selected.badge}</span>
                <span>•</span>
                <span>Detailed Overview</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                {selected.title}
              </h3>

              <p className="text-slate-300 text-base leading-relaxed">
                {selected.fullDesc}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {selected.features.map((feat, fIdx) => (
                  <div key={fIdx} className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-[#e51a24] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-sm text-slate-200 font-medium">{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 bg-white/5 p-6 sm:p-8 rounded-xl border border-white/10 space-y-6 text-center lg:text-left">
              <h4 className="text-lg font-bold text-[#ffc000]">Request Engineering Proposal</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Get a customized technical quotation, payback ROI schedule, and system design tailored for your facility.
              </p>
              <a
                href="#calculator"
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg text-sm font-bold bg-[#e51a24] hover:bg-[#c8141d] text-white shadow-lg transition-all"
              >
                <span>Request Free Consultation</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
