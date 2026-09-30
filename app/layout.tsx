import type { Metadata } from 'next';
import './globals.css';
import TopBar from '@/components/TopBar';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ChatBot from '@/components/ChatBot';

export const metadata: Metadata = {
  title: 'GG Automation Construction Services | Renewable Energy & Solar EPC Specialist',
  description: 'GG Automation Construction Services is a licensed EPC contractor in the Philippines specializing in rooftop solar PV, floating solar arrays, electrical engineering, and commercial energy efficiency.',
  keywords: [
    'GG Automation',
    'Solar Philippines',
    'Solar EPC Cebu',
    'Floating Solar PV',
    'On Grid Solar System',
    'Hybrid Solar Energy',
    'Off Grid Power',
    'Net Metering Philippines',
    'Electrical Engineering Services',
    'Bohol Solar Installation',
    'Davao Renewable Energy',
  ],
  authors: [{ name: 'GG Automation Construction Services' }],
  openGraph: {
    title: 'GG Automation Construction Services | Renewable Energy & Solar EPC Specialist',
    description: 'Engineering high-yield renewable energy power systems, rooftop solar PV, and floating solar arrays across the Philippines.',
    url: 'https://ggautomation.tech',
    siteName: 'GG Automation Construction Services',
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased bg-white text-slate-900 flex flex-col min-h-screen">
        <TopBar />
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
        <ChatBot />
      </body>
    </html>
  );
}
