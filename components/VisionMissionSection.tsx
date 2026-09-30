import React from 'react';
import SectionHeading from './SectionHeading';
import { Target, Compass, Sparkles, ShieldCheck, HeartHandshake, CheckCircle2, Award, Zap } from 'lucide-react';

const missionPoints = [
  'Deliver world-class, PEC & IEEE-compliant solar EPC and electrical engineering services with zero-compromise safety.',
  'Accelerate the Philippines\' shift to clean, renewable power to reduce environmental impact and utility overhead for all clients.',
  'Empower residential, commercial, and industrial sectors with high-efficiency Tier-1 technology and seamless utility net-metering.',
  'Provide responsive, lifelong preventive maintenance (O&M) and automation solutions that safeguard customer investments.',
];

const coreValues = [
  {
    icon: <ShieldCheck className="w-5 h-5 text-[#0b7337]" />,
    title: 'Safety & Integrity',
    desc: 'Uncompromising adherence to electrical codes, professional ethics, and safety protocols.',
  },
  {
    icon: <Zap className="w-5 h-5 text-[#e51a24]" />,
    title: 'Engineering Precision',
    desc: 'Exact 3D simulations, certified calculations, and high-yield turnkey execution.',
  },
  {
    icon: <HeartHandshake className="w-5 h-5 text-[#ffc000]" />,
    title: 'Client Commitment',
    desc: 'Dedicated partnership from initial feasibility study to lifetime preventive maintenance.',
  },
  {
    icon: <Award className="w-5 h-5 text-[#091833]" />,
    title: 'Sustainable Impact',
    desc: 'Creating tangible energy savings and measurable carbon footprint reductions.',
  },
];

export default function VisionMissionSection() {
  return (
    <section className="py-20 sm:py-24 bg-slate-50 text-slate-900 relative overflow-hidden border-b border-slate-200">
      {/* Background Subtle Tech Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#091833_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.03] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">
        
        {/* Section Heading */}
        <SectionHeading
          badge="OUR PURPOSE & DIRECTION"
          title="Vision, Mission & Core Values"
          subtitle="Guided by our commitment to engineering excellence and sustainable progress, we shape the clean energy future of the Philippines."
        />

        {/* 2-Column Vision & Mission Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-stretch">
          
          {/* Vision Card */}
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/90 shadow-xl relative overflow-hidden flex flex-col justify-between group hover:border-[#0b7337]/50 transition-all duration-300">
            {/* Ambient Background Accents */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl -z-10 pointer-events-none"></div>
            <div className="absolute top-0 left-0 h-1.5 w-full bg-gradient-to-r from-[#0b7337] via-emerald-400 to-[#0b7337]"></div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-[#0b7337] shadow-sm">
                  <Compass className="w-7 h-7" />
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-[#0b7337] border border-emerald-200 text-xs font-black uppercase tracking-wider">
                  OUR VISION
                </span>
              </div>

              <div className="space-y-3">
                <h3 className="text-2xl sm:text-3xl font-black text-[#091833] tracking-tight">
                  Empowering a Resilient, Solar-Powered Nation
                </h3>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  To be the foremost and most trusted renewable energy EPC contractor and electrical automation engineering partner in the Philippines—leading the transition toward accessible, sustainable, and reliable clean power for every business and community.
                </p>
              </div>

              {/* Highlight Quote Box */}
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/60 text-xs font-semibold text-[#0b7337] space-y-1">
                <div className="font-bold uppercase tracking-wider text-[11px] text-emerald-800">Long-Term Aspiration</div>
                <p className="text-slate-700 leading-relaxed font-normal">
                  Building nationwide clean infrastructure that reduces power dependency, safeguards the environment, and delivers decades of clean energy independence.
                </p>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex items-center gap-2 text-xs font-bold text-slate-500">
              <Sparkles className="w-4 h-4 text-[#0b7337]" />
              <span>Forward-Looking Engineering & Sustainable Innovation</span>
            </div>
          </div>

          {/* Mission Card */}
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/90 shadow-xl relative overflow-hidden flex flex-col justify-between group hover:border-[#e51a24]/50 transition-all duration-300">
            {/* Ambient Background Accents */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-50 rounded-full blur-3xl -z-10 pointer-events-none"></div>
            <div className="absolute top-0 left-0 h-1.5 w-full bg-gradient-to-r from-[#e51a24] via-red-400 to-[#e51a24]"></div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-200/80 flex items-center justify-center text-[#e51a24] shadow-sm">
                  <Target className="w-7 h-7" />
                </div>
                <span className="px-3 py-1 rounded-full bg-red-50 text-[#e51a24] border border-red-200 text-xs font-black uppercase tracking-wider">
                  OUR MISSION
                </span>
              </div>

              <div className="space-y-3">
                <h3 className="text-2xl sm:text-3xl font-black text-[#091833] tracking-tight">
                  Precision Engineering for Measurable Impact
                </h3>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  We are dedicated to providing turnkey renewable energy solutions that combine professional electrical engineering, high-yield Tier-1 hardware, and lifetime asset care.
                </p>
              </div>

              {/* Key Mission Pillars */}
              <div className="space-y-2.5 pt-1">
                {missionPoints.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#e51a24] flex-shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm text-slate-700 font-medium leading-snug">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Official Slogan Anchor */}
            <div className="pt-6 border-t border-slate-100 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#e51a24]">
                <span className="w-2 h-2 rounded-full bg-[#e51a24] animate-ping"></span>
                <span>Our Pledge:</span>
              </div>
              <span className="text-xs font-black italic text-[#091833]">
                &ldquo;on the job, to better everybody&apos;s life!&rdquo;
              </span>
            </div>
          </div>

        </div>

        {/* Core Values Strip */}
        <div className="space-y-8 pt-4">
          <div className="text-center space-y-1">
            <span className="text-xs font-black uppercase tracking-widest text-[#0b7337]">OUR PRINCIPLES</span>
            <h3 className="text-2xl font-black text-[#091833]">Core Values That Drive Us</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreValues.map((val, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 space-y-3 group hover:-translate-y-1"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center group-hover:scale-110 transition-transform">
                  {val.icon}
                </div>
                <h4 className="text-base font-black text-[#091833] group-hover:text-[#0b7337] transition-colors">
                  {val.title}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {val.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
