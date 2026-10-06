import React from 'react';
import type { Metadata } from 'next';
import CareersSection from '@/components/CareersSection';

export const metadata: Metadata = {
  title: 'Careers & Hiring | GG Automation Construction Services',
  description:
    'Join GG Automation Construction Services in Cebu City. We are hiring Sales Representatives and Administrative Staff. Build your career in the clean solar energy industry!',
};

export default function CareersPage() {
  return (
    <div className="bg-[#091833] min-h-screen text-white">
      <CareersSection />
    </div>
  );
}
