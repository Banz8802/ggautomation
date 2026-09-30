import React from 'react';
import Image from 'next/image';
import SectionHeading from './SectionHeading';
import {
  Sun,
  Zap,
  Lightbulb,
  Building2,
  Award,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Cpu,
  BadgeCheck,
  Clock,
  ThumbsUp,
  BarChart3
} from 'lucide-react';

const whyChooseUs = [
  {
    icon: <ShieldCheck className="w-6 h-6 text-[#0b7337]" />,
    bg: 'bg-emerald-50 text-[#0b7337] border-emerald-200/60',
    title: 'PRC-Licensed Engineering',
    desc: 'Led by certified Professional Electrical Engineers and Master Electricians adhering to PEC and IEEE standards.',
  },
  {
    icon: <BadgeCheck className="w-6 h-6 text-[#e51a24]" />,
    bg: 'bg-red-50 text-[#e51a24] border-red-200/60',
    title: 'Turnkey Utility Net-Metering',
    desc: 'Hassle-free DU coordination and approvals (VECO, MERALCO, CEBECO) so you start earning bill credits fast.',
  },
  {
    icon: <Award className="w-6 h-6 text-[#ffc000]" />,
    bg: 'bg-amber-50 text-[#ffc000] border-amber-200/60',
    title: 'Tier-1 Hardware & 25-Yr Warranty',
    desc: 'Only BloombergNEF Tier-1 solar modules and tier-ranked inverters with full manufacturer warranties.',
  },
  {
    icon: <Cpu className="w-6 h-6 text-[#091833]" />,
    bg: 'bg-slate-100 text-[#091833] border-slate-200',
    title: 'End-to-End Automation & SCADA',
    desc: 'Smart digital monitoring, auto-sync generators, transformer banking, and PLC automation under one roof.',
  },
];

const pillars = [
  {
    icon: <Sun className="w-6 h-6 text-emerald-400" />,
    iconBg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
    title: 'Renewable Energy EPC',
    description: 'Custom rooftop solar PV, pioneering floating solar installations, micro-grids, and BESS storage systems.',
  },
  {
    icon: <Zap className="w-6 h-6 text-[#ff6b6b]" />,
    iconBg: 'bg-red-500/10 border-red-500/30 text-[#ff6b6b]',
    title: 'High-Voltage Engineering',
    description: 'Transformer banking, substation construction, power factor correction, and industrial automation.',
  },
  {
    icon: <Lightbulb className="w-6 h-6 text-[#ffc000]" />,
    iconBg: 'bg-amber-500/10 border-amber-500/30 text-[#ffc000]',
    title: 'Energy Efficiency Audits',
    description: 'ISO-compliant energy auditing, power quality analysis, thermal scanning, and load optimization.',
  },
  {
    icon: <Building2 className="w-6 h-6 text-sky-400" />,
    iconBg: 'bg-sky-500/10 border-sky-500/30 text-sky-400',
    title: 'Turnkey Construction & O&M',
    description: 'Structural roof reinforcements, preventative maintenance, panel washing, and lifetime asset care.',
  },
];

const stats = [
  { label: 'Years Experience', value: '10+', sub: 'EPC & Construction' },
  { label: 'Engineering Standards', value: '100%', sub: 'PEC & IEEE Compliant' },
  { label: 'Solar Warranty', value: '25 Yrs', sub: 'Linear Performance' },
  { label: 'Energy Savings', value: 'Up to 80%', sub: 'Utility Bill Reduction' },
];

export default function AboutSection() {
  return (
    <section id="about" className="py-20 sm:py-24 bg-white text-slate-900 relative overflow-hidden scroll-mt-16 border-b border-slate-200">
      {/* Background Subtle Tech Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#091833_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.03] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 relative z-10">

        {/* Section Heading */}
        <SectionHeading
          badge="OUR IDENTITY & EXPERTISE"
          title="Sustainability Specialist & Engineering Partner"
          subtitle="GG Automation Construction Services is dedicated to empowering businesses and communities with sustainable, high-yield clean energy solutions and turnkey engineering excellence."
        />

        {/* Story & Image Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          {/* Visual Showcase (Left) */}
          <div className="lg:col-span-6 relative">
            <div className="relative h-[380px] sm:h-[480px] rounded-3xl overflow-hidden shadow-2xl border border-slate-200 bg-slate-900 group">
              <Image
                src="/images/about-company.webp"
                alt="GG Automation Engineering Team"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#091833]/90 via-[#091833]/20 to-transparent"></div>

              {/* Bottom Tag */}
              <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold border border-white/20">
                  <Sparkles className="w-3.5 h-3.5 text-[#ffc000]" />
                  <span>Cebu & Nationwide EPC Capabilities</span>
                </div>
                <h4 className="text-xl font-black text-white">
                  Engineering Safety, Yield & Long-Term Reliability
                </h4>
              </div>
            </div>

            {/* Experience Floating Badge */}
            <div className="absolute -bottom-6 -right-3 sm:right-6 bg-white p-4 sm:p-5 rounded-2xl shadow-xl border border-slate-200 flex items-center gap-4 max-w-xs">
              <div className="w-12 h-12 rounded-xl bg-[#e51a24]/10 border border-[#e51a24]/20 flex items-center justify-center flex-shrink-0">
                <Award className="w-7 h-7 text-[#e51a24]" />
              </div>
              <div>
                <div className="text-2xl font-black text-[#091833]">10+ Years</div>
                <div className="text-xs font-bold text-slate-500">Engineering & EPC Excellence</div>
              </div>
            </div>
          </div>

          {/* About Narrative & Highlights (Right) */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-3">
              <span className="text-xs font-black uppercase tracking-widest text-[#e51a24] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#e51a24]"></span>
                WHO WE ARE
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-[#091833] tracking-tight leading-snug">
                Accelerating the Philippines&apos; Transition to Clean, Reliable Power
              </h3>
            </div>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
              <strong className="text-slate-900 font-bold">GG Automation Construction Services</strong> combines deep electrical engineering expertise with state-of-the-art solar technology. We deliver certified turnkey solutions across residential, commercial, and industrial facilities.
            </p>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
              From initial solar feasibility audits and 3D structural modeling to transformer banking and lifetime preventive maintenance (PMS), we protect your investment with precision engineering.
            </p>

            {/* Micro Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {stats.map((stat, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 text-center space-y-0.5">
                  <div className="text-xl sm:text-2xl font-black text-[#091833]">{stat.value}</div>
                  <div className="text-[11px] font-bold text-slate-800 leading-tight">{stat.label}</div>
                  <div className="text-[10px] text-slate-500">{stat.sub}</div>
                </div>
              ))}
            </div>

            {/* Official Brand Slogan Green Banner */}
            <div className="rounded-2xl bg-gradient-to-r from-[#0b7337] via-[#0d7e3a] to-[#064420] p-4 sm:p-5 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4 border border-emerald-600/30">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center font-black text-sm text-[#ffc000] border border-white/20 flex-shrink-0">
                  GG
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-200 block">Our Company Promise</span>
                  <p className="text-base sm:text-lg font-extrabold italic tracking-wide text-white">
                    &ldquo;on the job, to better everybody&apos;s life!&rdquo;
                  </p>
                </div>
              </div>
              <a
                href="/contact"
                className="px-4 py-2 rounded-xl bg-white text-[#0b7337] hover:bg-emerald-50 text-xs font-black shadow-md transition-all whitespace-nowrap"
              >
                Partner With Us
              </a>
            </div>
          </div>
        </div>

        {/* Why Choose Us Highlight Cards */}
        <div className="space-y-8 pt-6 border-t border-slate-200">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-xs font-black uppercase tracking-widest text-[#e51a24]">ADVANTAGE</span>
            <h3 className="text-2xl sm:text-3xl font-black text-[#091833] tracking-tight">
              Why Choose GG Automation?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              Four cornerstones of reliability that make us the trusted engineering contractor for leading companies.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyChooseUs.map((item, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-3xl border border-slate-200 hover:border-[#e51a24]/40 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
              >
                <div className="space-y-3">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${item.bg}`}>
                    {item.icon}
                  </div>
                  <h4 className="text-lg font-black text-[#091833] group-hover:text-[#e51a24] transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4 Core Pillars Grid (Dark Background Showcase) */}
        <div className="bg-[#091833] text-white rounded-3xl p-8 sm:p-12 border border-white/10 shadow-2xl relative overflow-hidden">
          {/* Subtle Ambient Glow Halos */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#0b7337]/15 rounded-full blur-[90px] pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#e51a24]/15 rounded-full blur-[90px] pointer-events-none"></div>
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.03] pointer-events-none"></div>

          <div className="relative z-10 space-y-10">
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0b7337]/20 border border-[#0b7337]/40 text-emerald-400 text-xs font-black uppercase tracking-widest">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span>DISCIPLINES</span>
              </div>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
                Our Core Operational Pillars
              </h3>
              <p className="text-xs sm:text-sm text-slate-300">
                End-to-end engineering excellence across generation, distribution, efficiency, and maintenance.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {pillars.map((pillar, idx) => (
                <div
                  key={idx}
                  className="bg-slate-900/80 hover:bg-slate-900/95 backdrop-blur-xl p-6 rounded-2xl border border-white/10 hover:border-emerald-400/40 shadow-xl hover:shadow-2xl transition-all duration-300 group flex flex-col justify-between hover:-translate-y-1"
                >
                  <div>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 border transition-transform group-hover:scale-110 ${pillar.iconBg}`}>
                      {pillar.icon}
                    </div>
                    <h4 className="text-lg font-black text-white mb-2 group-hover:text-emerald-300 transition-colors">
                      {pillar.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                      {pillar.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
