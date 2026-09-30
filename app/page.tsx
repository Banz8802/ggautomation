import React from 'react';
import HeroSlider from '@/components/HeroSlider';
import SolarServiceTypesSection from '@/components/SolarServiceTypesSection';
import SolarSystemsSection from '@/components/SolarSystemsSection';
import AboutSection from '@/components/AboutSection';
import VicinityContactSection from '@/components/VicinityContactSection';
import PartnersSection from '@/components/PartnersSection';
import FunderSection from '@/components/FunderSection';

export default function Home() {
  return (
    <>
      <HeroSlider />
      <SolarServiceTypesSection />
      <SolarSystemsSection />
      <AboutSection />
      <VicinityContactSection />
      <PartnersSection />
      <FunderSection />
    </>
  );
}


