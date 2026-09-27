import React from 'react';
import SectionHeading from './SectionHeading';
import { Search, Compass, HardHat, Activity, ArrowRight } from 'lucide-react';

const steps = [
  {
    number: '01',
    title: 'Site Inspection & Load Assessment',
    icon: <Search className="w-6 h-6 text-[#e51a24]" />,
    description: 'Our licensed engineers perform structural roof inspection, shade mapping, and electrical load logging to determine your exact energy consumption baseline.',
    details: ['Structural Integrity Audit', 'Drone Roof Mapping & Azimuth Check', 'Transformer & Main Switchboard Audit'],
  },
  {
    number: '02',
    title: '3D CAD Simulation & Financial ROI',
    icon: <Compass className="w-6 h-6 text-[#ffc000]" />,
    description: 'We generate high-accuracy PVsyst solar production simulations, structural layout blueprints, and transparent ROI payback schedules.',
    details: ['3D Solar Yield Modeling', 'Tier-1 Equipment Specification', 'Net-Metering ROI Financial Projection'],
  },
  {
    number: '03',
    title: 'Turnkey Construction & Grid Testing',
    icon: <HardHat className="w-6 h-6 text-[#e51a24]" />,
    description: 'Certified engineers and technicians install wind-resistant aluminum mounting, solar arrays, string inverters, and electrical protection devices.',
    details: ['PEC & National Electrical Code Standard', 'Wind Load Resistant Racking', 'Pre-Commissioning Voltage & Safety Tests'],
  },
  {
    number: '04',
    title: 'Utility Interconnection & 24/7 O&M',
    icon: <Activity className="w-6 h-6 text-emerald-400" />,
    description: 'We handle complete local Distribution Utility (DU) Net-Metering permits and activate 24/7 cloud remote monitoring on your smartphone or desktop.',
    details: ['DU Net-Metering Approval', 'Cloud App Real-Time Generation Tracking', 'Preventive Maintenance & Warranty Coverage'],
  },
];

export default function ProcessSection() {
  return (
    <section id="process" className="py-20 bg-[#091833] text-white relative overflow-hidden">
      {/* Decorative Grid Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:3rem_3rem]"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Section Heading */}
        <SectionHeading
          badge="THE PROCESS"
          title="Our Turnkey Engineering Process"
          subtitle="From initial load profiling to final grid interconnection and lifetime maintenance, we ensure a seamless and hassle-free transition to solar power."
          theme="dark"
        />

        {/* 4-Step Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="bg-white/5 backdrop-blur-md rounded-2xl p-7 border border-white/10 hover:border-[#e51a24]/50 transition-all duration-300 flex flex-col justify-between group relative"
            >
              <div className="space-y-4">
                {/* Header Number & Icon */}
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-white/10 group-hover:bg-[#e51a24] flex items-center justify-center transition-colors">
                    {step.icon}
                  </div>
                  <span className="text-3xl font-black text-white/20 group-hover:text-[#ffc000] transition-colors">
                    {step.number}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white group-hover:text-[#ffc000] transition-colors">
                  {step.title}
                </h3>

                <p className="text-sm text-slate-300 leading-relaxed">
                  {step.description}
                </p>

                <div className="pt-3 space-y-2 border-t border-white/10">
                  {step.details.map((d, dIdx) => (
                    <div key={dIdx} className="text-xs text-slate-400 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#e51a24]"></span>
                      <span>{d}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA Banner */}
        <div className="bg-gradient-to-r from-[#e51a24] to-red-700 rounded-2xl p-8 text-white shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h4 className="text-2xl font-black">Ready to Start Your Site Assessment?</h4>
            <p className="text-sm text-white/90">
              Our engineering team will conduct a free preliminary solar production analysis for your building.
            </p>
          </div>
          <a
            href="#calculator"
            className="px-8 py-3.5 rounded-lg text-sm font-bold bg-[#091833] hover:bg-[#050d1e] text-white shadow-xl transition-all whitespace-nowrap flex items-center gap-2"
          >
            <span>Schedule Free Survey</span>
            <ArrowRight className="w-4 h-4 text-[#ffc000]" />
          </a>
        </div>
      </div>
    </section>
  );
}
