import React from 'react';
import SectionHeading from './SectionHeading';
import { ShieldCheck, Award, Layers, DollarSign } from 'lucide-react';

const tier1Brands = [
  { name: 'SMA Solar', type: 'German Inverters' },
  { name: 'SolarEdge', type: 'Smart Optimization' },
  { name: 'Sungrow', type: 'Central & String Inverters' },
  { name: 'Huawei FusionSolar', type: 'Smart PV Solutions' },
  { name: 'Jinko Solar', type: 'Tier-1 PV Modules' },
  { name: 'Trina Solar', type: 'High-Efficiency Panels' },
  { name: 'Canadian Solar', type: 'Global Solar Modules' },
  { name: 'LONGi Solar', type: 'N-Type Monocrystalline' },
];

const fundingTiers = [
  {
    range: '100 kWp - 500 kWp',
    type: 'Commercial & Medium Industrial',
    desc: 'Flexible equipment leasing & bank debt financing for medium business roofs.',
    icon: <Award className="w-6 h-6 text-[#e51a24]" />,
  },
  {
    range: '500 kWp - 5 MWp',
    type: 'Large Industrial & Malls',
    desc: 'Zero-Capital Expenditure (Zero-CAPEX) Power Purchase Agreements (PPA).',
    icon: <Layers className="w-6 h-6 text-[#ffc000]" />,
  },
  {
    range: '5 MWp - 500 MW',
    type: 'Utility Scale & Floating PV',
    desc: 'Structured clean energy fund consortiums & IPP joint venture projects.',
    icon: <DollarSign className="w-6 h-6 text-emerald-400" />,
  },
];

export default function PartnersSection() {
  return (
    <section id="partners" className="py-20 bg-white relative border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Section Heading */}
        <SectionHeading
          badge="PARTNER"
          title="World-Class Equipment & Project Financing"
          subtitle="We partner exclusively with BloombergNEF Tier-1 solar manufacturers and accredited clean energy funders to guarantee maximum reliability and financial yield."
        />

        {/* Tier 1 Hardware Brands Grid */}
        <div className="space-y-6">
          <div className="text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-[#e51a24]">TIER-1 HARDWARE PARTNERS</span>
            <h3 className="text-xl font-extrabold text-[#091833] mt-1">International Standard Solar Panels & Inverters</h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            {tier1Brands.map((brand, idx) => (
              <div
                key={idx}
                className="bg-slate-50 p-4 rounded-xl border border-slate-200 hover:border-[#e51a24] text-center hover:shadow-md transition-all duration-200 group"
              >
                <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center mx-auto mb-2 text-[#091833] group-hover:text-[#e51a24] transition-colors">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="font-extrabold text-sm text-[#091833] group-hover:text-[#e51a24] transition-colors">
                  {brand.name}
                </div>
                <div className="text-[10px] text-slate-500 font-medium mt-0.5">
                  {brand.type}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Project Funding Capabilities Banner */}
        <div className="bg-[#091833] rounded-2xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden border border-white/10">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#ffc000]/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-[#ffc000]">PROJECT FINANCING & PPA</span>
              <h3 className="text-2xl sm:text-3xl font-black text-white">
                Zero-CAPEX Solar Funding (100 kWp to 500 MW)
              </h3>
              <p className="text-sm text-slate-300">
                GG Automation collaborates with financial partners to offer zero upfront capital options where you simply pay for solar energy generated at a discounted rate.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {fundingTiers.map((tier, idx) => (
                <div
                  key={idx}
                  className="bg-white/5 backdrop-blur-md p-6 rounded-xl border border-white/10 space-y-3 hover:border-[#ffc000]/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-white/10">
                      {tier.icon}
                    </div>
                    <div>
                      <div className="text-xl font-black text-[#ffc000]">{tier.range}</div>
                      <div className="text-xs font-bold text-white">{tier.type}</div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed pt-1">
                    {tier.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
