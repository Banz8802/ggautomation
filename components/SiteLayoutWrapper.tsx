'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import TopBar from '@/components/TopBar';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ChatBot from '@/components/ChatBot';

export default function SiteLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin) {
    return (
      <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
        {children}
      </main>
    );
  }

  return (
    <>
      <TopBar />
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
      <ChatBot />
    </>
  );
}
