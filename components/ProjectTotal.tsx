'use client';

import { useEffect, useState } from 'react';
import { HardHat } from 'lucide-react';
import Link from 'next/link';
import { projects as bundledProjects, ProjectRawInput, parseRawProjects } from '@/data/projectsData';

export default function ProjectTotal({ variant = 'stat' }: { variant?: 'stat' | 'badge' }) {
  const [total, setTotal] = useState(bundledProjects.length);

  useEffect(() => {
    let isMounted = true;

    async function loadTotal() {
      try {
        const response = await fetch('/api/projects', { cache: 'no-store' });
        if (!response.ok) return;

        const data = await response.json();
        if (data.success && Array.isArray(data.projects) && isMounted) {
          setTotal(parseRawProjects(data.projects as ProjectRawInput[]).length);
        }
      } catch {
        // Keep the bundled total if the projects API is unavailable.
      }
    }

    loadTotal();
    return () => {
      isMounted = false;
    };
  }, []);

  if (variant === 'badge') {
    return (
      <div className="absolute top-6 left-6 z-20 bg-white p-4 sm:p-5 rounded-2xl shadow-xl border border-slate-200 flex items-center gap-4 max-w-xs">
        <div className="w-12 h-12 rounded-xl bg-[#e51a24]/10 border border-[#e51a24]/20 flex items-center justify-center flex-shrink-0">
          <HardHat className="w-7 h-7 text-[#e51a24]" />
        </div>
        <div>
          <div className="text-2xl font-black text-[#091833]">{total} Projects</div>
          <div className="text-xs font-bold text-slate-500">Portfolio total</div>
        </div>
      </div>
    );
  }

  return (
    <Link href="/projects" className="group p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 text-center space-y-0.5 transition-all duration-200 hover:-translate-y-1 hover:border-[#0b7337]/40 hover:bg-emerald-50/70 hover:shadow-lg hover:shadow-emerald-900/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffc000]">
      <div className="text-xl sm:text-2xl font-black text-[#091833]">{total}</div>
      <div className="text-[11px] font-bold text-slate-800 leading-tight">Projects</div>
      <div className="text-[10px] text-slate-500">Portfolio total</div>
    </Link>
  );
}
