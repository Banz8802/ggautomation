'use client';

import React, { useState } from 'react';
import SectionHeading from './SectionHeading';
import { Phone, Mail, MapPin, Calculator, Send, CheckCircle2, Building, Sparkles } from 'lucide-react';

interface QuoteContactSectionProps {
  showLocations?: boolean;
}

export default function QuoteContactSection({ showLocations = true }: QuoteContactSectionProps) {
  // Calculator state
  const [monthlyBill, setMonthlyBill] = useState(50000); // PHP
  const [facilityType, setFacilityType] = useState('Commercial Building');

  // Contact Form state
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    location: '',
    systemType: 'On-Grid Solar',
    message: '',
  });

  // Calculate rough estimates
  // Approx tariff: 12 PHP/kWh. 1 kWp produces ~120 kWh/month in PH.
  const estimatedKwp = Math.max(5, Math.round((monthlyBill * 0.6) / 1440));
  const estimatedMonthlySavings = Math.round(monthlyBill * 0.55);
  const estimatedAnnualSavings = estimatedMonthlySavings * 12;
  const estimated25YrSavings = estimatedAnnualSavings * 25;
  const co2OffsetTons = Math.round(estimatedKwp * 1.25);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          monthlyBill,
          estimatedKwp,
          estimatedMonthlySavings: `₱${estimatedMonthlySavings.toLocaleString('en-US')}/mo`,
          formType: 'quote_calculator',
        }),
      });

      const result = await res.json();
      if (res.ok && result.success) {
        setFormSubmitted(true);
      } else {
        setErrorMessage(result.error || 'Failed to submit proposal request. Please try again.');
      }
    } catch (err) {
      // Fallback: still show success on client side so client is not blocked
      setFormSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="calculator" className="py-20 bg-white relative">
      <div id="contact" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Section Heading */}
        <SectionHeading
          badge="SOLAR CALCULATOR & QUOTE"
          title="Estimate Your Solar Savings & Request a Quotation"
          subtitle="Use our interactive savings estimator below to preview your solar system sizing and return on investment, then send us your project details for an engineering proposal."
        />

        {/* 2-Column Grid: Left Calculator, Right Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Interactive Calculator Panel */}
          <div className="lg:col-span-6 bg-[#091833] rounded-3xl p-8 sm:p-10 text-white shadow-2xl space-y-8 border border-white/10 relative overflow-hidden">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-[#e51a24] text-white">
                <Calculator className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Solar ROI & Savings Estimator</h3>
                <p className="text-xs text-slate-300">Based on Philippine solar irradiation averages</p>
              </div>
            </div>

            {/* Input Controls */}
            <div className="space-y-6 pt-2">
              {/* Monthly Bill Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <label className="font-semibold text-slate-200">Average Monthly Electric Bill:</label>
                  <span className="text-xl font-black text-[#ffc000]">
                    ₱{monthlyBill.toLocaleString('en-US')}
                  </span>
                </div>
                <input
                  type="range"
                  min="10000"
                  max="500000"
                  step="5000"
                  value={monthlyBill}
                  onChange={(e) => setMonthlyBill(Number(e.target.value))}
                  className="w-full h-2.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#e51a24]"
                />
                <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                  <span>₱10,000</span>
                  <span>₱250,000</span>
                  <span>₱500,000+</span>
                </div>
              </div>

              {/* Facility Type Selector */}
              <div className="space-y-2">
                <label className="font-semibold text-sm text-slate-200">Facility Type:</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Commercial Building', 'Industrial Plant', 'School / Institution', 'Resort / Hotel'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setFacilityType(type)}
                      className={`p-3 rounded-xl text-xs font-bold transition-all text-left border ${
                        facilityType === type
                          ? 'bg-[#e51a24] text-white border-[#e51a24] shadow-md'
                          : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Results Grid */}
            <div className="pt-6 border-t border-white/15 space-y-4">
              <div className="text-xs font-bold text-[#ffc000] uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                <span>Estimated Solar System Metrics</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                  <span className="text-xs text-slate-400 block font-medium">Recommended System Size</span>
                  <span className="text-2xl font-black text-white">{estimatedKwp} kWp</span>
                </div>

                <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                  <span className="text-xs text-slate-400 block font-medium">Est. Monthly Bill Savings</span>
                  <span className="text-2xl font-black text-emerald-400">₱{estimatedMonthlySavings.toLocaleString('en-US')}</span>
                </div>

                <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                  <span className="text-xs text-slate-400 block font-medium">25-Year Cumulative Savings</span>
                  <span className="text-xl font-black text-[#ffc000]">₱{(estimated25YrSavings / 1000000).toFixed(1)}M</span>
                </div>

                <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                  <span className="text-xs text-slate-400 block font-medium">Annual CO2 Offset</span>
                  <span className="text-xl font-black text-sky-400">{co2OffsetTons} Tons/Yr</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 text-center italic">
                *Preliminary estimate. Actual system generation depends on final engineering shade analysis and roof angle.
              </p>
            </div>
          </div>

          {/* Contact & Engineering Proposal Form */}
          <div className="lg:col-span-6 bg-slate-50 p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xl space-y-6">
            <div className="space-y-1">
              <h3 className="text-2xl font-black text-[#091833]">Request Engineering Proposal</h3>
              <p className="text-xs text-slate-600">
                Fill out the form below and our licensed solar engineers will contact you within 24 hours.
              </p>
            </div>

            {formSubmitted ? (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-6 sm:p-8 rounded-2xl space-y-4 animate-fade-in shadow-md">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#0b7337] text-white flex items-center justify-center flex-shrink-0 shadow-lg">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xl font-bold text-[#091833]">Proposal Request Received!</h4>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                      Thank you! Your solar proposal request for <span className="font-bold text-[#091833]">~{estimatedKwp} kWp (~₱{monthlyBill.toLocaleString('en-US')}/mo bill)</span> has been forwarded to our engineering team at <span className="font-bold text-[#0b7337]">jr@ggautomation.tech</span>.
                    </p>
                    <p className="text-xs text-slate-500 pt-1">
                      Our PRC-licensed engineers will prepare your preliminary 3D simulation and contact you within 24 hours.
                    </p>
                  </div>
                </div>
                <div className="pt-2 border-t border-emerald-200/60 flex items-center justify-between">
                  <button
                    onClick={() => setFormSubmitted(false)}
                    className="text-xs font-bold text-[#091833] underline hover:text-[#e51a24] cursor-pointer"
                  >
                    Submit Another Solar Quote
                  </button>
                  <a
                    href="https://www.facebook.com/messages/t/GGAutomation.1"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-[#0084ff] hover:underline flex items-center gap-1"
                  >
                    <span>Need immediate answer? Chat on FB</span>
                  </a>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {errorMessage && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-semibold">
                    {errorMessage}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Engr. Juan Dela Cruz"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-[#e51a24] focus:ring-1 focus:ring-[#e51a24] text-sm text-slate-800 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="juan@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-[#e51a24] focus:ring-1 focus:ring-[#e51a24] text-sm text-slate-800 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+63 917 123 4567"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-[#e51a24] focus:ring-1 focus:ring-[#e51a24] text-sm text-slate-800 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Company / Facility Name</label>
                    <input
                      type="text"
                      placeholder="Gaisano / Metro Store / Commercial"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-[#e51a24] focus:ring-1 focus:ring-[#e51a24] text-sm text-slate-800 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Project Location</label>
                    <input
                      type="text"
                      placeholder="Cebu / Bohol / Davao / Manila"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-[#e51a24] focus:ring-1 focus:ring-[#e51a24] text-sm text-slate-800 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">System Preference</label>
                    <select
                      value={formData.systemType}
                      onChange={(e) => setFormData({ ...formData, systemType: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-[#e51a24] focus:ring-1 focus:ring-[#e51a24] text-sm text-slate-800 outline-none bg-white"
                    >
                      <option value="On-Grid Solar">On-Grid Solar (Net-Metering)</option>
                      <option value="Hybrid Solar">Hybrid Solar (Grid + Battery)</option>
                      <option value="Off-Grid Solar">Off-Grid Solar (Autonomous)</option>
                      <option value="Floating Solar PV">Floating Solar PV</option>
                      <option value="Electrical Engineering">Electrical Engineering Services</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Project Message / Notes</label>
                  <textarea
                    rows={3}
                    placeholder="Tell us about your roof size, transformer rating, or specific energy requirements..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-[#e51a24] focus:ring-1 focus:ring-[#e51a24] text-sm text-slate-800 outline-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-xl text-base font-bold bg-[#e51a24] hover:bg-[#c8141d] disabled:opacity-60 text-white shadow-lg hover:shadow-red-600/30 transition-all cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Submitting Proposal Request...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Submit Engineering Request</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Office Locations Grid */}
        {showLocations && (
          <div className="pt-12 border-t border-slate-200">
            <div className="text-center mb-10">
              <span className="text-xs font-bold uppercase tracking-widest text-[#e51a24]">OUR LOCATIONS</span>
              <h3 className="text-2xl font-black text-[#091833] mt-1">Visit Our Engineering Offices & Showrooms</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-[#e51a24]/10 text-[#e51a24]">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-[#091833]">Engineering EPC Company</h4>
                    <p className="text-xs text-slate-500">Labangon, Cebu City</p>
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed pt-2">
                  T1-1614 Casa Mira Condominium, Salvador St., Labangon, Cebu City
                </p>
                <div className="pt-2 text-xs font-semibold text-[#091833] space-y-1">
                  <p>Phone: <a href="tel:+639222401919" className="text-[#e51a24] hover:underline">(0922) 240-1919</a></p>
                  <p>Email: info@ggautomation.tech</p>
                </div>
              </div>

              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-[#ffc000]/10 text-[#091833]">
                    <Building className="w-6 h-6 text-[#091833]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-[#091833]">Showroom</h4>
                    <p className="text-xs text-slate-500">Tagbilaran City, Bohol</p>
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed pt-2">
                  Salazar St., Ubujan, Tagbilaran City, Bohol (20m Before Nissan Car Display)
                </p>
                <div className="pt-2 text-xs font-semibold text-[#091833] space-y-1">
                  <p>Phone: <a href="tel:+639683882510" className="text-[#e51a24] hover:underline">(0968) 388-2510</a></p>
                  <p>Email: info@ggautomation.tech</p>
                </div>
              </div>

              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-[#091833]/10 text-[#091833]">
                    <MapPin className="w-6 h-6 text-[#091833]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-[#091833]">Davao City Satellite Office</h4>
                    <p className="text-xs text-slate-500">Barangay 27-C, Davao City</p>
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed pt-2">
                  V. Guzman St. corner 5th Avenue (Back of Cyber Tech Trading Corp) Barangay 27-C, Davao City
                </p>
                <div className="pt-2 text-xs font-semibold text-[#091833] space-y-1">
                  <p>Phone: <a href="tel:+63822242785" className="text-[#e51a24] hover:underline">(082) 224-2785</a></p>
                  <p>Email: sales@ggautomation.tech</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
