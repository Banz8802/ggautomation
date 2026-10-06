import React from 'react';
import type { Metadata } from 'next';
import AdminHomeCategoriesManager from '@/components/admin/AdminHomeCategoriesManager';
import Link from 'next/link';
import { ArrowLeft, LayoutGrid } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Home Project Categories | GG Automation Admin CRM',
  description: 'Manage homepage solar sector cards, custom images, and slideshow carousels.',
};

export default function AdminHomeCategoriesPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8 space-y-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between border-b border-white/10 pb-4">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Main Admin CRM</span>
        </Link>
        <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold">
          <LayoutGrid className="w-4 h-4 text-[#ffc000]" />
          <span>Home Project Categories Control</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        <AdminHomeCategoriesManager />
      </div>
    </div>
  );
}
