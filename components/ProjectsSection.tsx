'use client';

import React, { useState } from 'react';
import SectionHeading from './SectionHeading';
import Image from 'next/image';
import { MapPin, Zap, Building, CheckCircle } from 'lucide-react';

const projects = [
  {
    id: 'super-metro',
    title: 'Super Metro Toledo Rooftop Solar',
    category: 'Commercial Retail',
    location: 'Toledo City, Cebu',
    capacity: '100+ kWp',
    client: 'Metro Retail Stores Group Inc.',
    image: '/images/hero-solar-engineering.jpg',
    description: 'Rooftop solar PV system engineered to reduce daytime peak energy demand for a major hypermarket retail store.',
    tags: ['On-Grid', 'Commercial', 'Net-Metering'],
  },
  {
    id: 'uclm-campus',
    title: 'UCLM Campus 433kW Solar Installation',
    category: 'Educational Campus',
    location: 'Mandaue City, Cebu',
    capacity: '433 kWp',
    client: 'University of Cebu L M',
    image: '/images/hero-commercial-systems.jpg',
    description: 'Comprehensive campus-wide rooftop solar energy installation reducing carbon emissions and powering educational facilities.',
    tags: ['On-Grid', 'Institutional', '433 kWp'],
  },
  {
    id: 'sonamco-floating',
    title: 'Sonamco Floating Solar Project',
    category: 'Floating Solar PV',
    location: 'Laguna / Visayas Region',
    capacity: '242 kWp',
    client: 'Sonamco Corporation',
    image: '/images/hero-floating-solar.jpg',
    description: 'Pioneering floating photovoltaic system deployed on water reservoir, boosting panel cooling efficiency and conserving water.',
    tags: ['Floating PV', 'Innovation', 'Reservoir'],
  },
  {
    id: 'gaisano-capital',
    title: 'Gaisano Capital Commercial Solar',
    category: 'Hypermarket Chain',
    location: 'Cebu & Visayas',
    capacity: '713 kWp & 834 kWp',
    client: 'Gaisano Capital Group',
    image: '/images/about-company.jpg',
    description: 'High-yield commercial solar PV systems installed across multiple flagship mall roofs to hedge against rising grid electricity tariffs.',
    tags: ['Multi-Site', 'Commercial', '834 kWp'],
  },
  {
    id: 'bohol-bee-farm',
    title: 'Bohol Bee Farm Resort Solar PV',
    category: 'Eco Tourism & Resort',
    location: 'Panglao, Bohol',
    capacity: '108 kWp',
    client: 'Bohol Bee Farm Resort',
    image: '/images/hero-solar-engineering.jpg',
    description: 'Eco-friendly hybrid solar power system supporting sustainable tourism with clean solar power and battery resilience.',
    tags: ['Hybrid Solar', 'Resort', '108 kWp'],
  },
  {
    id: 'san-agustin',
    title: 'San Agustin Academy Solar PV',
    category: 'Educational Institution',
    location: 'Panglao, Bohol',
    capacity: '85 kWp',
    client: 'San Agustin Academy',
    image: '/images/hero-commercial-systems.jpg',
    description: 'Institutional solar installation designed to significantly lower monthly utility overhead for school operations.',
    tags: ['Institutional', 'On-Grid', '85 kWp'],
  },
];

const categories = ['All Projects', 'Commercial Retail', 'Educational Campus', 'Floating Solar PV', 'Eco Tourism & Resort'];

export default function ProjectsSection() {
  const [activeCategory, setActiveCategory] = useState('All Projects');

  const filteredProjects = activeCategory === 'All Projects'
    ? projects
    : projects.filter((p) => p.category === activeCategory);

  return (
    <section id="projects" className="py-20 bg-slate-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Section Heading */}
        <SectionHeading
          badge="FEATURED PROJECTS"
          title="Proven Track Record in Solar EPC"
          subtitle="Explore some of our landmark commercial rooftop, institutional, and floating solar PV projects installed across the Philippines."
        />

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all duration-200 ${
                activeCategory === cat
                  ? 'bg-[#e51a24] text-white shadow-md'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-[#e51a24]/40 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                {/* Image Container */}
                <div className="relative h-56 w-full overflow-hidden bg-slate-900">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#091833]/90 via-transparent to-transparent"></div>

                  {/* Capacity Badge */}
                  <div className="absolute top-4 right-4 bg-[#e51a24] text-white text-xs font-black px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 fill-current" />
                    <span>{project.capacity}</span>
                  </div>

                  {/* Location Overlay */}
                  <div className="absolute bottom-4 left-4 right-4 text-white flex items-center gap-1.5 text-xs font-medium">
                    <MapPin className="w-3.5 h-3.5 text-[#ffc000]" />
                    <span>{project.location}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-[#e51a24]" />
                    <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                      {project.client}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-[#091833] group-hover:text-[#e51a24] transition-colors leading-snug">
                    {project.title}
                  </h3>

                  <p className="text-sm text-slate-600 leading-relaxed">
                    {project.description}
                  </p>
                </div>
              </div>

              {/* Tags Footer */}
              <div className="px-6 pb-6 pt-2 flex flex-wrap gap-2">
                {project.tags.map((tag, tIdx) => (
                  <span
                    key={tIdx}
                    className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-slate-100 text-slate-600"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
