import React from 'react';
import HeroSlider from '@/components/HeroSlider';
import AboutSection from '@/components/AboutSection';
import ServicesSection from '@/components/ServicesSection';
import SolarSystemsSection from '@/components/SolarSystemsSection';
import ProcessSection from '@/components/ProcessSection';
import ProjectsSection from '@/components/ProjectsSection';
import PartnersSection from '@/components/PartnersSection';
import EventsSection from '@/components/EventsSection';
import QuoteContactSection from '@/components/QuoteContactSection';

export default function Home() {
  return (
    <>
      <HeroSlider />
      <AboutSection />
      <ServicesSection />
      <SolarSystemsSection />
      <ProcessSection />
      <ProjectsSection />
      <PartnersSection />
      <EventsSection />
      <QuoteContactSection />
    </>
  );
}
