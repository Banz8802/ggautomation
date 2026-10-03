'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  MessageSquare,
  MessageCircle,
  X,
  Send,
  Sparkles,
  Zap,
  Sun,
  ShieldCheck,
  Phone,
  PhoneCall,
  ArrowRight,
  ExternalLink,
  Calculator,
  Building2,
  RefreshCw,
  ChevronDown,
  Minimize2,
  Maximize2,
  HelpCircle,
  CheckCircle2,
  MapPin,
  UserCheck
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  time: string;
  quickActions?: { label: string; action: string; href?: string; isExternal?: boolean }[];
  calculationResult?: {
    systemSize: string;
    monthlySavings: string;
    annualSavings: string;
    recommendedType: string;
  };
}

const FB_MESSENGER_URL = 'https://www.facebook.com/messages/t/GGAutomation.1';

const initialBotMessage: ChatMessage = {
  id: 'msg-1',
  sender: 'bot',
  text: 'Hello! 👋 Welcome to GG Automation Construction Services. I am your AI Solar & Electrical Engineering Assistant.\n\nHow can I assist your project today? You can calculate solar savings, explore our systems, or talk directly with our live engineering team on Facebook Messenger.',
  time: 'Just now',
  quickActions: [
    { label: '💬 Talk to Live Human (FB Messenger)', action: 'human', href: FB_MESSENGER_URL, isExternal: true },
    { label: '💡 Estimate Solar Savings', action: 'calc' },
    { label: '⚡ On-Grid vs Hybrid vs Off-Grid', action: 'systems' },
    { label: '🌊 Floating Solar Tech', action: 'floating' },
    { label: '🏢 Commercial & School Solar', action: 'projects' },
    { label: '💼 Zero-Capex PPA Funding', action: 'funder' },
    { label: '📍 Office & Contact Info', action: 'contact' },
  ],
};

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([initialBotMessage]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(1);
  const [hasOpened, setHasOpened] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto scroll to latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setUnreadCount(0);
      setHasOpened(true);
    }
  }, [isOpen, messages, isTyping]);

  const handleOpen = () => {
    setIsOpen(true);
    setIsMinimized(false);
    setUnreadCount(0);
    setTimeout(() => inputRef.current?.focus(), 200);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleReset = () => {
    setMessages([
      {
        ...initialBotMessage,
        id: `msg-${Date.now()}`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const calculateSolar = (monthlyBill: number) => {
    // Estimations based on ~₱12/kWh in Philippines
    const kwhPerMonth = monthlyBill / 12;
    const dailyKwh = kwhPerMonth / 30;
    const peakSunHours = 4.2; // Average in Visayas & Mindanao
    const estimatedKwp = Math.max(1, Math.round((dailyKwh / peakSunHours) * 10) / 10);
    const estimatedMonthlySavings = Math.round(monthlyBill * 0.7); // Up to 70% offset
    const estimatedAnnualSavings = estimatedMonthlySavings * 12;

    let systemType = 'On-Grid Solar System (Net-Metering)';
    if (monthlyBill > 150000) {
      systemType = 'Commercial High-Yield On-Grid PV with Substation Sync';
    } else if (monthlyBill < 10000) {
      systemType = 'Residential On-Grid / Hybrid Micro-Inverter System';
    }

    return {
      systemSize: `${estimatedKwp} kWp`,
      monthlySavings: `₱${estimatedMonthlySavings.toLocaleString()}/mo`,
      annualSavings: `₱${estimatedAnnualSavings.toLocaleString()}/yr`,
      recommendedType: systemType,
    };
  };

  const processBotResponse = (userInput: string) => {
    setIsTyping(true);

    setTimeout(() => {
      const lower = userInput.toLowerCase();
      let replyText = '';
      let quickActions: { label: string; action: string; href?: string; isExternal?: boolean }[] | undefined = undefined;
      let calcResult: any = undefined;

      // Extract number for electric bill
      const numberMatch = userInput.match(/\b\d+[\d,]*\b/);
      const rawNumber = numberMatch ? parseInt(numberMatch[0].replace(/,/g, ''), 10) : null;

      if (rawNumber && rawNumber >= 1000 && (lower.includes('bill') || lower.includes('peso') || lower.includes('php') || lower.includes('cost') || lower.includes('month') || lower.includes('save') || lower.includes('calc') || lower.includes('₱'))) {
        calcResult = calculateSolar(rawNumber);
        replyText = `Based on your monthly electric bill of ₱${rawNumber.toLocaleString()}:\n\n` +
          `⚡ **Estimated Capacity**: ~${calcResult.systemSize}\n` +
          `💰 **Estimated Monthly Savings**: Up to ${calcResult.monthlySavings}\n` +
          `📈 **Estimated Annual Savings**: ${calcResult.annualSavings}\n` +
          `🛠️ **Recommended Architecture**: ${calcResult.recommendedType}\n\n` +
          `Would you like our engineering team to prepare a detailed 3D CAD simulation and exact ROI proposal?`;
        
        quickActions = [
          { label: '💬 Chat on Messenger (Live Engineer)', action: 'fb', href: FB_MESSENGER_URL, isExternal: true },
          { label: '📅 Request Free Site Survey', action: 'go_contact', href: '/contact' },
          { label: '📁 View Completed Projects', action: 'go_projects', href: '/projects' },
        ];
      } else if (
        lower.includes('human') ||
        lower.includes('agent') ||
        lower.includes('person') ||
        lower.includes('representative') ||
        lower.includes('rep') ||
        lower.includes('live') ||
        lower.includes('real person') ||
        lower.includes('facebook') ||
        lower.includes('messenger') ||
        lower.includes('fb') ||
        lower.includes('talk to someone') ||
        lower.includes('customer service') ||
        lower.includes('support') ||
        lower.includes('operator')
      ) {
        replyText = '👨‍💼 **Connect with our Live Engineering Team**:\n\n' +
          'Our PRC-licensed engineers and technical consultants are ready to assist you right now!\n\n' +
          '• **Facebook Messenger**: Chat live with our engineering desk.\n' +
          '• **Cebu Office Hotline**: (0922) 240-1919\n' +
          '• **Bohol Office Hotline**: (0968) 388-2510\n' +
          '• **Davao Satellite**: (082) 224-2785\n' +
          '• **Official Email**: info@ggautomation.tech\n\n' +
          'Click the button below to start a live chat on Facebook Messenger:';
        
        quickActions = [
          { label: '💬 Chat on Facebook Messenger', action: 'fb', href: FB_MESSENGER_URL, isExternal: true },
          { label: '📞 Call Cebu: (0922) 240-1919', action: 'tel', href: 'tel:+639222401919' },
          { label: '📅 Book Free Site Survey', action: 'go_contact', href: '/contact' },
        ];
      } else if (lower.includes('calc') || lower.includes('estimate') || lower.includes('saving') || lower.includes('roi') || lower.includes('how much')) {
        replyText = '💡 **Instant Solar Savings Estimator**\n\nPlease type your average monthly electric bill amount (e.g. "₱15,000" or "50000") and I will calculate your recommended solar kWp capacity and expected annual savings!';
        quickActions = [
          { label: '₱5,000 / month', action: 'input_5000' },
          { label: '₱25,000 / month', action: 'input_25000' },
          { label: '₱80,000 / month', action: 'input_80000' },
          { label: '₱250,000+ / month', action: 'input_250000' },
          { label: '💬 Talk to Human (Messenger)', action: 'human', href: FB_MESSENGER_URL, isExternal: true },
        ];
      } else if (lower.includes('system') || lower.includes('on-grid') || lower.includes('hybrid') || lower.includes('off-grid')) {
        replyText = '⚡ **Solar Power System Architectures**:\n\n' +
          '1. **On-Grid System (Recommended for utility savings)**: Directly synchronizes with distribution utilities (VECO/Meralco). Lowers daytime peak bills with Net-Metering.\n\n' +
          '2. **Hybrid Solar System**: Connected to the grid with Lithium battery storage backup during power brownouts.\n\n' +
          '3. **Off-Grid Autonomous**: 100% independent solar + battery array for remote islands and agricultural sites.\n\n' +
          '4. **Floating Solar PV**: Water-reservoir mounted solar array with natural evaporative cooling.';
        
        quickActions = [
          { label: 'Explore Systems Page', action: 'go_services', href: '/services' },
          { label: '💬 Chat with Engineer (Messenger)', action: 'human', href: FB_MESSENGER_URL, isExternal: true },
          { label: 'Consult Our Engineers', action: 'go_contact', href: '/contact' },
        ];
      } else if (lower.includes('floating') || lower.includes('water') || lower.includes('lake') || lower.includes('sonamco')) {
        replyText = '🌊 **Floating Solar PV Innovation**:\n\n' +
          'GG Automation is a pioneer in floating solar in the Philippines, such as the **Sonamco 242kW Floating Solar Array** in Negros Oriental.\n\n' +
          '• **Natural Water Cooling**: Boosts photovoltaic panel yield by 10-15%.\n' +
          '• **Zero Land Footprint**: Utilizes aquaculture ponds and industrial water reservoirs.\n' +
          '• **Suppresses Water Evaporation**: Conserves water volume.';
        
        quickActions = [
          { label: 'View Sonamco Case Study', action: 'go_projects', href: '/projects' },
          { label: '💬 Inquire with Engineer (FB)', action: 'human', href: FB_MESSENGER_URL, isExternal: true },
          { label: 'Inquire Floating EPC', action: 'go_contact', href: '/contact' },
        ];
      } else if (lower.includes('project') || lower.includes('school') || lower.includes('commercial') || lower.includes('portfolio') || lower.includes('uclm') || lower.includes('metro') || lower.includes('gaisano')) {
        replyText = '🏢 **Key Completed & On-Going Solar Projects**:\n\n' +
          '• **UCLM Campus (433 kWp)**: University of Cebu Lapu-Lapu & Mandaue rooftop installation.\n' +
          '• **Super Metro Toledo City (100+ kWp)**: Major commercial retail on-grid solar.\n' +
          '• **Gaisano Capital T. Padilla (214 kWp)**: Commercial hypermarket on-grid setup.\n' +
          '• **Sonamco Floating Solar (242 kWp)**: Industrial water-surface array in Negros Oriental.\n' +
          '• **Monterrazas Luxury Residence (13 kWp)**: High-end residential solar setup.';
        
        quickActions = [
          { label: 'Browse Full Project Gallery', action: 'go_projects', href: '/projects' },
          { label: '💬 Talk to Solar Consultant', action: 'human', href: FB_MESSENGER_URL, isExternal: true },
          { label: 'Request Proposal', action: 'go_contact', href: '/contact' },
        ];
      } else if (lower.includes('fund') || lower.includes('ditrolic') || lower.includes('ppa') || lower.includes('lease') || lower.includes('zero capex') || lower.includes('financing')) {
        replyText = '💼 **Zero-Capex Solar Financing & PPA Partners**:\n\n' +
          'We partner with institutional clean energy funders to provide Power Purchase Agreements (PPA) and corporate solar leasing:\n\n' +
          '• **Ditrolic Energy**: Net-Zero committed solar financing partner (Malaysia & Singapore).\n' +
          '• **1MW – 5MW**: Singaporean Clean Energy Fund.\n' +
          '• **10MW – 500MW**: European Sovereign Infrastructure Transition Fund.\n' +
          '• **100kWp – 5MW**: Philippine Commercial & Industrial Local Capital.';
        
        quickActions = [
          { label: 'View Funder Details', action: 'go_services', href: '/services#funders' },
          { label: '💬 Discuss PPA on Messenger', action: 'human', href: FB_MESSENGER_URL, isExternal: true },
          { label: 'Inquire PPA Eligibility', action: 'go_contact', href: '/contact' },
        ];
      } else if (lower.includes('contact') || lower.includes('address') || lower.includes('location') || lower.includes('phone') || lower.includes('office') || lower.includes('branch')) {
        replyText = '📍 **GG Automation Offices & Contact Details**:\n\n' +
          '• **Cebu EPC Company (Head Office)**:\n  T1-1614 Casa Mira Condominium, Salvador St., Labangon, Cebu City\n  📞 Phone: (0922) 240-1919\n\n' +
          '• **Bohol Showroom**:\n  Salazar St., Ubujan, Tagbilaran City, Bohol (20m Before Nissan Car Display)\n  📞 Phone: (0968) 388-2510\n\n' +
          '• **Davao City Satellite Office**:\n  V. Guzman St. corner 5th Avenue (Back of Cyber Tech Trading Corp) Barangay 27-C, Davao City\n  📞 Phone: (082) 224-2785\n\n' +
          '💬 **Facebook Messenger**: facebook.com/messages/t/GGAutomation.1\n' +
          '✉️ **Email**: info@ggautomation.tech';
        
        quickActions = [
          { label: '💬 Chat on Facebook Messenger', action: 'fb', href: FB_MESSENGER_URL, isExternal: true },
          { label: 'Open Contact & Map Page', action: 'go_contact', href: '/contact' },
          { label: 'Call Cebu (0922) 240-1919', action: 'tel', href: 'tel:+639222401919' },
          { label: 'Call Bohol (0968) 388-2510', action: 'tel', href: 'tel:+639683882510' },
          { label: 'Call Davao (082) 224-2785', action: 'tel', href: 'tel:+63822242785' },
        ];
      } else {
        replyText = 'Thank you for your message! Our PRC-licensed solar engineers are ready to assist you with customized site inspections, electrical audits, and turnkey EPC proposals.\n\nWould you like to chat with a live engineer on Messenger, book a free site survey, calculate your solar ROI, or view our completed projects?';
        quickActions = [
          { label: '💬 Talk to Human (Messenger)', action: 'human', href: FB_MESSENGER_URL, isExternal: true },
          { label: '📅 Book Free Site Survey', action: 'go_contact', href: '/contact' },
          { label: '💡 Estimate Solar ROI', action: 'calc' },
          { label: '📁 View Completed Projects', action: 'go_projects', href: '/projects' },
          { label: '⚡ Explore Services', action: 'go_services', href: '/services' },
        ];
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now()}`,
          sender: 'bot',
          text: replyText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          quickActions,
          calculationResult: calcResult,
        },
      ]);
      setIsTyping(false);
    }, 600);
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;

    const userText = input.trim();
    setInput('');

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: userText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMsg]);
    processBotResponse(userText);
  };

  const handleQuickAction = (action: string, label: string, href?: string, isExternal?: boolean) => {
    if (href) {
      if (isExternal || href.startsWith('http')) {
        window.open(href, '_blank', 'noopener,noreferrer');
        return;
      } else if (href.startsWith('tel:') || href.startsWith('mailto:')) {
        window.location.href = href;
        return;
      } else {
        window.location.href = href;
        return;
      }
    }

    if (action === 'human') {
      const newMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        sender: 'user',
        text: 'I want to talk to a human representative / Facebook Messenger',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, newMsg]);
      processBotResponse('human');
    } else if (action === 'calc') {
      const newMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        sender: 'user',
        text: 'Estimate my Solar Savings',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, newMsg]);
      processBotResponse('calc');
    } else if (action === 'systems') {
      const newMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        sender: 'user',
        text: 'What are the Solar System Types?',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, newMsg]);
      processBotResponse('system types');
    } else if (action === 'floating') {
      const newMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        sender: 'user',
        text: 'Tell me about Floating Solar',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, newMsg]);
      processBotResponse('floating solar');
    } else if (action === 'projects') {
      const newMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        sender: 'user',
        text: 'Show me Commercial & School projects',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, newMsg]);
      processBotResponse('commercial projects');
    } else if (action === 'funder') {
      const newMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        sender: 'user',
        text: 'Zero-Capex Solar PPA Funding',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, newMsg]);
      processBotResponse('funding ppa');
    } else if (action === 'contact') {
      const newMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        sender: 'user',
        text: 'Office Locations & Contact Info',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, newMsg]);
      processBotResponse('contact info');
    } else if (action.startsWith('input_')) {
      const val = action.replace('input_', '');
      const newMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        sender: 'user',
        text: `My monthly electric bill is ₱${parseInt(val, 10).toLocaleString()}`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, newMsg]);
      processBotResponse(`bill ₱${val}`);
    }
  };

  return (
    <>
      {/* -------------------------------------------------------------------------- */}
      {/* Floating Trigger Button & Teaser Speech Bubble                             */}
      {/* -------------------------------------------------------------------------- */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-auto">
        
        {/* Floating Bubble Teaser (Shown when closed) */}
        {!isOpen && !hasOpened && (
          <div 
            onClick={handleOpen}
            className="mb-3 cursor-pointer bg-white text-slate-800 text-xs font-bold py-2.5 px-4 rounded-2xl shadow-xl border border-slate-200/90 flex items-center gap-2.5 animate-bounce hover:border-[#e51a24]/40 transition-all select-none"
          >
            <div className="w-2 h-2 rounded-full bg-[#0b7337] animate-ping"></div>
            <span>Need a Solar Estimate? Ask our AI!</span>
            <div className="w-2 h-2 bg-white transform rotate-45 absolute -bottom-1 right-6 border-r border-b border-slate-200"></div>
          </div>
        )}

        {/* Trigger Button */}
        {!isOpen ? (
          <button
            onClick={handleOpen}
            aria-label="Open Solar AI Chat Assistant"
            className="group relative flex items-center gap-3 px-4 sm:px-5 py-3.5 rounded-full bg-gradient-to-r from-[#091833] via-[#0d2247] to-[#091833] text-white shadow-2xl hover:shadow-cyan-900/40 border border-white/20 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
          >
            {/* Glowing Halo */}
            <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#e51a24]/30 via-[#ffc000]/30 to-[#0b7337]/30 blur-md opacity-70 group-hover:opacity-100 transition-opacity"></span>

            <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-white/15 p-1 shadow-inner overflow-hidden border border-white/25">
              <Image
                src="/images/icon-logo.png"
                alt="GG Automation Icon"
                width={32}
                height={32}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="relative text-left hidden sm:block">
              <div className="text-xs font-black tracking-wide text-white flex items-center gap-1.5">
                <span>GG Solar AI</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              </div>
              <div className="text-[10px] text-slate-300 font-medium">Instant Consultation</div>
            </div>

            {unreadCount > 0 && (
              <span className="relative flex items-center justify-center w-5 h-5 rounded-full bg-[#e51a24] text-white text-[10px] font-black shadow-md">
                {unreadCount}
              </span>
            )}
          </button>
        ) : null}
      </div>

      {/* -------------------------------------------------------------------------- */}
      {/* Interactive Chat Window Modal                                              */}
      {/* -------------------------------------------------------------------------- */}
      {isOpen && (
        <div 
          className={`fixed right-4 sm:right-6 z-50 transition-all duration-300 flex flex-col bg-[#091833] border border-white/15 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-2xl ${
            isMinimized 
              ? 'bottom-6 w-[320px] sm:w-[360px] h-16' 
              : 'bottom-4 sm:bottom-6 w-[calc(100vw-2rem)] sm:w-[420px] h-[580px] max-h-[85vh]'
          }`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 via-[#0d2247] to-slate-900 p-4 border-b border-white/10 flex items-center justify-between text-white select-none">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative flex-shrink-0">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#e51a24] via-[#ffc000] to-[#0b7337] p-0.5 shadow-lg">
                  <div className="w-full h-full bg-[#091833] rounded-[14px] flex items-center justify-center overflow-hidden p-1.5">
                    <Image
                      src="/images/icon-logo.png"
                      alt="GG Automation Logo"
                      width={36}
                      height={36}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#091833]"></span>
              </div>

              <div className="min-w-0">
                <h3 className="text-sm font-black text-white tracking-tight flex items-center gap-1.5 truncate">
                  <span>GG Automation AI</span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-[#e51a24]/20 border border-[#e51a24]/40 text-[#ff8a8a]">
                    PRO
                  </span>
                </h3>
                <p className="text-[11px] text-emerald-400 font-medium truncate flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  <span>Solar Engineer Active</span>
                </p>
              </div>
            </div>

            {/* Header Control Buttons */}
            <div className="flex items-center gap-1 flex-shrink-0">
              <button
                onClick={handleReset}
                title="Restart Conversation"
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsMinimized(!isMinimized)}
                title={isMinimized ? 'Expand' : 'Minimize'}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </button>

              <button
                onClick={handleClose}
                title="Close Chat"
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Chat Body (Hidden when minimized) */}
          {!isMinimized && (
            <>
              {/* Message List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-[#091833] via-[#060f22] to-[#040916] text-xs [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-white/10">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl p-3.5 shadow-md leading-relaxed whitespace-pre-line ${
                        msg.sender === 'user'
                          ? 'bg-[#e51a24] text-white rounded-br-xs'
                          : 'bg-slate-900/90 text-slate-100 border border-white/10 rounded-bl-xs'
                      }`}
                    >
                      {msg.text}

                      {/* Calculation Result Card (if any) */}
                      {msg.calculationResult && (
                        <div className="mt-3 p-3 rounded-xl bg-white/5 border border-cyan-400/30 space-y-2">
                          <div className="flex items-center gap-1.5 text-[#ffc000] font-black text-xs">
                            <Calculator className="w-4 h-4" />
                            <span>Quick Solar Sizing Model</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-[11px]">
                            <div className="bg-black/30 p-2 rounded-lg">
                              <span className="text-slate-400 block">Capacity</span>
                              <span className="font-bold text-white text-xs">{msg.calculationResult.systemSize}</span>
                            </div>
                            <div className="bg-black/30 p-2 rounded-lg">
                              <span className="text-slate-400 block">Est. Savings</span>
                              <span className="font-bold text-emerald-400 text-xs">{msg.calculationResult.monthlySavings}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <span className="text-[10px] text-slate-500 mt-1 px-1">{msg.time}</span>

                    {/* Quick Action Buttons */}
                    {msg.quickActions && (
                      <div className="flex flex-wrap gap-1.5 mt-2.5 max-w-[95%]">
                        {msg.quickActions.map((qa, idx) => {
                          const isFb = qa.href?.includes('facebook.com/messages') || qa.href?.includes('m.me') || qa.action === 'human' || qa.action === 'fb';
                          const isTel = qa.href?.startsWith('tel:') || qa.action === 'tel';
                          return (
                            <button
                              key={idx}
                              onClick={() => handleQuickAction(qa.action, qa.label, qa.href, qa.isExternal)}
                              className={`px-3 py-1.5 rounded-xl border text-[11px] font-bold transition-all duration-200 hover:scale-105 active:scale-95 text-left flex items-center gap-1.5 cursor-pointer shadow-sm ${
                                isFb
                                  ? 'bg-gradient-to-r from-[#0084ff]/25 to-[#00c6ff]/20 hover:from-[#0084ff] hover:to-[#0070d6] text-sky-200 hover:text-white border-[#0084ff]/50 hover:shadow-md hover:shadow-[#0084ff]/30'
                                  : isTel
                                  ? 'bg-emerald-500/20 hover:bg-emerald-600 text-emerald-200 hover:text-white border-emerald-500/40 hover:shadow-md hover:shadow-emerald-500/30'
                                  : 'bg-white/10 hover:bg-[#ffc000] text-slate-200 hover:text-[#091833] border-white/10'
                              }`}
                            >
                              {isFb ? (
                                <svg className="w-3.5 h-3.5 flex-shrink-0 fill-current" viewBox="0 0 24 24">
                                  <path d="M12 2C6.477 2 2 6.145 2 11.258c0 2.91 1.455 5.518 3.735 7.207v3.535l3.39-1.862c.907.251 1.875.388 2.875.388 5.523 0 10-4.145 10-9.268C22 6.145 17.523 2 12 2zm1.066 12.443l-2.612-2.784-5.099 2.784 5.61-5.955 2.678 2.784 5.033-2.784-5.61 5.955z" />
                                </svg>
                              ) : isTel ? (
                                <PhoneCall className="w-3.5 h-3.5 flex-shrink-0" />
                              ) : null}
                              <span>{qa.label}</span>
                              {qa.href && (qa.isExternal || qa.href.startsWith('http') ? <ExternalLink className="w-3 h-3 opacity-70" /> : <ArrowRight className="w-3 h-3 opacity-70" />)}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex items-center gap-2 text-slate-400 text-xs">
                    <div className="w-8 h-8 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center p-1.5 overflow-hidden">
                      <Image
                        src="/images/icon-logo.png"
                        alt="GG Automation"
                        width={24}
                        height={24}
                        className="w-full h-full object-contain animate-pulse"
                      />
                    </div>
                    <div className="flex items-center gap-1 bg-slate-900/80 px-3 py-2 rounded-2xl border border-white/10">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce"></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.2s]"></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.4s]"></span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input Bar & Action Ribbon */}
              <div className="p-3 bg-slate-950 border-t border-white/10 space-y-2.5">
                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Ask solar sizing, monthly bill, talk to human..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-white/10 text-white placeholder-slate-400 text-xs outline-none border border-white/10 focus:border-[#ffc000] transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim()}
                    aria-label="Send Message"
                    className="p-2.5 rounded-xl bg-[#e51a24] hover:bg-[#c8141d] disabled:opacity-40 disabled:hover:bg-[#e51a24] text-white transition-all cursor-pointer flex-shrink-0"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>

                {/* Enhanced Contact & Human Handoff Action Bar */}
                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-white/5">
                  <a 
                    href={FB_MESSENGER_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-gradient-to-r from-[#0084ff]/25 via-[#0084ff]/35 to-[#00c6ff]/25 hover:from-[#0084ff] hover:to-[#0070d6] text-[#78c5ff] hover:text-white border border-[#0084ff]/50 hover:border-[#0084ff] transition-all text-[11px] font-bold group shadow-md hover:shadow-[#0084ff]/40"
                  >
                    <div className="relative flex items-center justify-center flex-shrink-0">
                      <span className="animate-ping absolute inline-flex h-2.5 w-2.5 rounded-full bg-cyan-400 opacity-75"></span>
                      <svg className="w-3.5 h-3.5 fill-current relative flex-shrink-0" viewBox="0 0 24 24">
                        <path d="M12 2C6.477 2 2 6.145 2 11.258c0 2.91 1.455 5.518 3.735 7.207v3.535l3.39-1.862c.907.251 1.875.388 2.875.388 5.523 0 10-4.145 10-9.268C22 6.145 17.523 2 12 2zm1.066 12.443l-2.612-2.784-5.099 2.784 5.61-5.955 2.678 2.784 5.033-2.784-5.61 5.955z" />
                      </svg>
                    </div>
                    <span className="truncate">Talk to Human (FB)</span>
                  </a>

                  <a 
                    href="tel:+639222401919" 
                    className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/40 hover:border-emerald-400 transition-all text-[11px] font-bold group shadow-md hover:shadow-emerald-500/30"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-emerald-400 group-hover:text-white group-hover:scale-110 transition-transform flex-shrink-0" />
                    <span className="truncate">Call Hotline</span>
                  </a>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
