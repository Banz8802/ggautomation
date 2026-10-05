import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import ProcessSection from '@/components/ProcessSection';
import TrainingsSection from '@/components/TrainingsSection';
import { 
  ChevronRight, 
  Sparkles, 
  Waves, 
  ArrowRight, 
  ShieldCheck
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Trainings & Seminars | GG Automation Construction Services',
  description:
    'Hands-on technical trainings, floating solar PV seminars, and clean energy workshops organized by GG Automation Construction Services and Power Ai Philippines.',
};

export default function TrainingsPage() {
  return (
    <div className="bg-[#091833] min-h-screen text-white">
      {/* -------------------------------------------------------------------------- */}
      {/* Page Header Hero Banner                                                    */}
      {/* -------------------------------------------------------------------------- */}
      <section className="relative bg-[#091833] text-white py-14 sm:py-20 overflow-hidden border-b border-white/10">
        {/* Ambient Atmospheric Glows */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/15 rounded-full blur-[130px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#e51a24]/15 rounded-full blur-[130px] pointer-events-none"></div>
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:28px_28px] opacity-[0.04] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-4 text-center">
          {/* Breadcrumbs */}
          <nav className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-[#ffc000]">Trainings & Seminars</span>
          </nav>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
            Technical Trainings & Seminars
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Hands-on technical capacity building, live floating solar demonstrations, and continuous engineering education empowering engineers, LGUs, and clean energy developers across the Philippines.
          </p>

          {/* Key Credentials Badges */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-3 text-xs font-bold text-slate-300">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-cyan-400 backdrop-blur-sm">
              <Waves className="w-4 h-4" />
              <span>Live Floating Solar PV Demo</span>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[#ffc000] backdrop-blur-sm">
              <Sparkles className="w-4 h-4" />
              <span>Power Ai Philippines Collaboration</span>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-emerald-400 backdrop-blur-sm">
              <ShieldCheck className="w-4 h-4" />
              <span>PEC & Safety Compliant</span>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------------------- */}
      {/* Dynamic Trainings & Seminars Section                                       */}
      {/* -------------------------------------------------------------------------- */}
      <TrainingsSection />

      {/* -------------------------------------------------------------------------- */}
      {/* Our Turnkey Engineering Process (ProcessSection)                            */}
      {/* -------------------------------------------------------------------------- */}
      <ProcessSection />

      {/* -------------------------------------------------------------------------- */}
      {/* Bottom Consultation & Training Request CTA Banner                          */}
      {/* -------------------------------------------------------------------------- */}
      <section className="py-16 bg-gradient-to-b from-[#091833] to-[#040812] border-t border-white/10 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="bg-gradient-to-r from-slate-900 via-[#0b7337]/30 to-slate-900 border border-emerald-500/30 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-2xl backdrop-blur-xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider border border-emerald-500/30">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Upskill Your Team & Engineers</span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white max-w-2xl mx-auto">
              Host a Custom Solar Training or Workshop with GG Automation
            </h2>

            <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
              We provide customized on-site and classroom technical training for corporate facility teams, engineering faculties, and clean energy developers.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-sm sm:text-base font-bold bg-[#e51a24] hover:bg-[#c8141d] text-white shadow-xl hover:shadow-red-950/40 transition-all hover:scale-105"
              >
                <span>Request Custom Training / Seminar</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-sm sm:text-base font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all"
              >
                <span>View Our Projects Portfolio</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
