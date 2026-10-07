import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import QuoteContactSection from '@/components/QuoteContactSection';
import VicinityContactSection from '@/components/VicinityContactSection';
import { Mail, Phone, ChevronRight, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact Us & Solar Quotation | GG Automation Construction Services',
  description:
    'Get in touch with GG Automation Construction Services. Calculate your solar savings, request a formal engineering proposal, or visit our offices in Cebu, Bohol, and Davao.',
};

export default function ContactPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Page Header Hero Banner */}
      <section className="relative bg-[#091833] text-white py-14 sm:py-18 overflow-hidden border-b border-white/10">
        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#0b7337]/15 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#e51a24]/15 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.03] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-4 text-center">
          {/* Breadcrumb */}
          <nav className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-[#ffc000]">Contact Us</span>
          </nav>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
            Contact & Solar Quotation
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Estimate your solar return on investment, request a detailed turnkey EPC engineering proposal, or visit any of our regional hubs across the Philippines.
          </p>

          {/* Quick Contact Badges */}
          <div className="pt-3 flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-slate-300">
            <a
              href="tel:+639222401919"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all text-white"
            >
              <Phone className="w-3.5 h-3.5 text-[#e51a24]" />
              <span>(0922) 240-1919</span>
            </a>
            <a
              href="mailto:info@ggautomation.tech"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all text-white"
            >
              <Mail className="w-3.5 h-3.5 text-[#ffc000]" />
              <span>info@ggautomation.tech</span>
            </a>
            <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-emerald-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Cebu • Bohol • Davao</span>
            </div>
          </div>
        </div>
      </section>

      {/* 1. Solar Calculator & Engineering Proposal Quote Section */}
      <QuoteContactSection showLocations={false} />

      {/* 2. Office Locations & Interactive Multi-Branch Vicinity Map Section */}
      <VicinityContactSection />
    </div>
  );
}
