import React from 'react';
import SectionHeading from './SectionHeading';
import Image from 'next/image';
import { Calendar, MapPin, ArrowRight, Waves, Users } from 'lucide-react';

export default function EventsSection() {
  return (
    <section id="trainings" className="py-20 bg-slate-50 relative scroll-mt-20">
      <div id="news-updates" className="scroll-mt-24"></div>
      <div id="events" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Section Heading */}
        <SectionHeading
          badge="TRAININGS, EVENTS & NEWS"
          title="Floating Solar PV Seminar, Trainings & Live Demo"
          subtitle="Stay updated with GG Automation's latest technical trainings, industry seminars, clean energy demonstrations, and workshop updates across the Philippines."
        />

        {/* Featured Event Card */}
        <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-slate-200 grid grid-cols-1 lg:grid-cols-12">
          {/* Image */}
          <div className="lg:col-span-6 relative h-[320px] lg:h-auto min-h-[300px]">
            <Image
              src="/images/hero-floating-solar.jpg"
              alt="Floating Solar PV Seminar Cavinti Laguna"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#091833]/80 via-transparent to-transparent lg:hidden"></div>

            <div className="absolute top-4 left-4 bg-[#e51a24] text-white text-xs font-black px-3 py-1.5 rounded-full shadow-md uppercase tracking-wider">
              FEATURED SEMINAR
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-6 p-8 lg:p-12 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500">
                <div className="flex items-center gap-1.5 text-[#e51a24]">
                  <Calendar className="w-4 h-4" />
                  <span>Technical Demonstration</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-600">
                  <MapPin className="w-4 h-4 text-[#ffc000]" />
                  <span>Cavinti, Laguna, Philippines</span>
                </div>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-[#091833]">
                Advancing Floating Solar Photovoltaic Technology in the Philippines
              </h3>

              <p className="text-sm text-slate-600 leading-relaxed">
                GG Automation hosted a live seminar and on-site technical demonstration in Cavinti, Laguna, bringing together municipal leaders, energy engineers, and environmental stakeholders to showcase water-reservoir floating PV structures.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-center gap-2 text-xs font-bold text-[#091833] bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <Waves className="w-4 h-4 text-[#e51a24]" />
                  <span>Reservoir & Lake Anchoring</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-[#091833] bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <Users className="w-4 h-4 text-[#ffc000]" />
                  <span>LGU & Industry Delegates</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-extrabold text-[#e51a24] uppercase tracking-wider">
                Clean Tech Innovation
              </span>
              <a
                href="/contact"
                className="inline-flex items-center gap-2 text-sm font-bold text-[#091833] hover:text-[#e51a24] transition-colors"
              >
                <span>Inquire About Future Workshops</span>
                <ArrowRight className="w-4 h-4 text-[#e51a24]" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
