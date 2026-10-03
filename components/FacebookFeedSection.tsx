'use client';

import React, { useEffect, useState } from 'react';
import SectionHeading from './SectionHeading';
import Image from 'next/image';
import Script from 'next/script';
import { 
  MessageSquare, 
  ExternalLink, 
  ThumbsUp, 
  Share2, 
  Sparkles, 
  Calendar, 
  MapPin, 
  ShieldCheck, 
  Eye, 
  RefreshCw 
} from 'lucide-react';

import { facebookPosts } from '@/data/facebookPosts';

const fbPageUrl = 'https://www.facebook.com/GGAutomation.1';


export default function FacebookFeedSection() {
  const [activeTab, setActiveTab] = useState<'stream' | 'plugin'>('stream');
  const [sdkLoaded, setSdkLoaded] = useState(false);

  useEffect(() => {
    // If window.FB exists, re-parse XFBML when tab switches to plugin
    if (typeof window !== 'undefined' && (window as unknown as { FB?: { XFBML?: { parse: () => void } } }).FB) {
      try {
        (window as unknown as { FB: { XFBML: { parse: () => void } } }).FB.XFBML.parse();
      } catch (err) {
        console.error('FB parse error', err);
      }
    }
  }, [activeTab]);

  return (
    <section id="social-feed" className="py-20 bg-slate-50 relative overflow-hidden border-y border-slate-200">
      {/* Facebook SDK Scripts */}
      <div id="fb-root"></div>
      <Script
        async
        defer
        crossOrigin="anonymous"
        src="https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v19.0"
        onLoad={() => {
          setSdkLoaded(true);
          if (typeof window !== 'undefined' && (window as unknown as { FB?: { XFBML?: { parse: () => void } } }).FB) {
            (window as unknown as { FB: { XFBML: { parse: () => void } } }).FB.XFBML.parse();
          }
        }}
      />

      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#091833_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        {/* Section Heading */}
        <SectionHeading
          badge="LIVE COMMUNITY & UPDATES"
          title="Connect With GG Automation on Facebook"
          subtitle="Follow our official Facebook page for live solar installation videos, recent engineering milestones, customer turnover ceremonies, and upcoming energy seminars."
        />

        {/* Tab & Filter Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-200">
          <div className="flex items-center gap-2 bg-slate-200/80 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('stream')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'stream'
                  ? 'bg-white text-[#091833] shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Latest Facebook Highlights
            </button>
            <button
              onClick={() => setActiveTab('plugin')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'plugin'
                  ? 'bg-white text-[#091833] shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Official FB Page Widget
            </button>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={fbPageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#1877F2] hover:bg-[#166fe5] text-white shadow-sm transition-all"
            >
              <ThumbsUp className="w-3.5 h-3.5" />
              <span>@GGAutomation.1</span>
              <ExternalLink className="w-3 h-3 ml-0.5 opacity-80" />
            </a>
          </div>
        </div>

        {/* Tab 1: Interactive Feed Showcase (Always visible & super fast) */}
        {activeTab === 'stream' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {facebookPosts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-3xl overflow-hidden shadow-lg border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Post Image Container */}
                  <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent"></div>
                    <div className="absolute top-3 left-3 bg-[#e51a24] text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow-md">
                      {post.tag}
                    </div>
                  </div>

                  {/* Post Content */}
                  <div className="p-6 space-y-3">
                    <div className="flex items-center justify-between text-[11px] text-slate-500 font-semibold">
                      <div className="flex items-center gap-1 text-[#e51a24]">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{post.date}</span>
                      </div>
                      {post.location && (
                        <div className="flex items-center gap-1 text-slate-500">
                          <MapPin className="w-3.5 h-3.5 text-[#ffc000]" />
                          <span>{post.location}</span>
                        </div>
                      )}
                    </div>

                    <h4 className="text-base font-bold text-[#091833] line-clamp-2 group-hover:text-[#e51a24] transition-colors">
                      {post.title}
                    </h4>

                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>
                </div>

                {/* Footer Interaction Bar */}
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs font-semibold text-slate-500">
                    <span className="flex items-center gap-1">
                      <ThumbsUp className="w-3.5 h-3.5 text-[#1877F2]" />
                      <span>{post.likes ?? 100}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                      <span>{post.comments ?? 25}</span>
                    </span>
                  </div>

                  <a
                    href={post.postUrl || fbPageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#1877F2] hover:text-[#0d65d9] transition-colors"
                  >
                    <span>View Post</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Official Facebook Page Plugin & Direct Embed */}
        {activeTab === 'plugin' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* FB Embed Frame */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 shadow-xl border border-slate-200 flex flex-col items-center">
              <div className="w-full flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#1877F2] text-white flex items-center justify-center font-bold text-sm shadow-sm">
                    f
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#091833]">Official Facebook Timeline</h4>
                    <p className="text-[11px] text-slate-500">facebook.com/GGAutomation.1</p>
                  </div>
                </div>
                <a
                  href={fbPageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1877F2] hover:text-[#0d65d9] bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
                >
                  <span>Open in App / Web</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* FB Official Page Plugin */}
              <div className="w-full flex justify-center overflow-hidden rounded-2xl bg-slate-50 border border-slate-200/80 min-h-[500px] p-2">
                <div
                  className="fb-page"
                  data-href={fbPageUrl}
                  data-tabs="timeline,events"
                  data-width="500"
                  data-height="550"
                  data-small-header="false"
                  data-adapt-container-width="true"
                  data-hide-cover="false"
                  data-show-facepile="true"
                >
                  <blockquote cite={fbPageUrl} className="fb-xfbml-parse-ignore p-6 text-center space-y-3">
                    <p className="text-sm font-semibold text-slate-700">
                      Loading GG Automation Official Facebook Timeline...
                    </p>
                    <p className="text-xs text-slate-500">
                      If your browser ad-blocker or privacy shield prevents embedded social widgets, you can view the live feed directly:
                    </p>
                    <a
                      href={fbPageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1877F2] text-white text-xs font-bold rounded-xl shadow-md"
                    >
                      <ThumbsUp className="w-4 h-4" />
                      <span>Go to facebook.com/GGAutomation.1</span>
                    </a>
                  </blockquote>
                </div>
              </div>
            </div>

            {/* Quick Actions & Messenger */}
            <div className="lg:col-span-5 bg-gradient-to-br from-[#091833] to-[#0f2347] text-white p-8 rounded-3xl shadow-xl border border-white/10 space-y-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 bg-[#e51a24]/20 border border-[#e51a24]/40 text-[#ffc000] text-xs font-bold px-3 py-1 rounded-full">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Real-time Engineering Updates</span>
                </div>
                <h3 className="text-2xl font-black text-white">Join Our Clean Energy Community</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Discover how businesses, commercial facilities, and institutions across the Philippines reduce electricity costs by up to 80% with GG Automation turnkey solar EPC solutions.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <a
                  href={fbPageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold bg-[#1877F2] hover:bg-[#166fe5] text-white shadow-lg transition-all duration-200 group"
                >
                  <ThumbsUp className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>Follow Us on Facebook</span>
                  <ExternalLink className="w-4 h-4 ml-1 opacity-70" />
                </a>

                <a
                  href="https://www.facebook.com/messages/t/GGAutomation.1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all duration-200"
                >
                  <MessageSquare className="w-4 h-4 text-[#ffc000]" />
                  <span>Message Us on Messenger</span>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Bar: Action callout */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#1877F2]/10 text-[#1877F2] flex items-center justify-center flex-shrink-0">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-extrabold text-[#091833]">Have a question for our Solar Engineers?</h4>
              <p className="text-xs text-slate-500">Send us a direct message on Facebook Messenger for quick feasibility and quotation inquiries.</p>
            </div>
          </div>

          <a
            href="https://www.facebook.com/messages/t/GGAutomation.1"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold bg-[#091833] hover:bg-[#e51a24] text-white transition-all shadow-md flex-shrink-0"
          >
            <span>Chat on Messenger</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}

