'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { CheckCircle2, Send, ShieldCheck, X } from 'lucide-react';

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const fieldClassName =
  'w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition-all focus:border-[#e51a24] focus:bg-white focus:ring-2 focus:ring-[#e51a24]/20';

export default function InquiryModal({ isOpen, onClose }: InquiryModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    preferredBranch: 'Cebu Head Office',
    service: 'Solar PV Rooftop Installation',
    message: '',
  });

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) {
      dialog.showModal();
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, formType: 'contact_page' }),
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        setErrorMessage(result.error || 'Failed to send inquiry. Please try again.');
        return;
      }

      setFormSubmitted(true);
    } catch {
      setErrorMessage('Unable to send your inquiry. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="inquiry-modal-title"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose();
      }}
      className="m-auto max-h-[90vh] w-[calc(100%-2rem)] max-w-2xl overflow-y-auto rounded-3xl border border-slate-200 bg-white p-0 text-slate-900 shadow-2xl backdrop:bg-slate-950/60"
    >
      <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5 sm:px-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-[#e51a24]">
            Let&apos;s talk solar &amp; engineering
          </p>
          <h2 id="inquiry-modal-title" className="mt-1 text-2xl font-black tracking-tight text-[#091833]">
            Send Us an Inquiry
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Share your project requirements and our engineering team will reach out.
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close inquiry form"
          className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="p-6 sm:p-8">
        {formSubmitted ? (
          <div className="space-y-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#0b7337] text-white shadow-lg">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-[#0b7337]">Thank You! Inquiry Received</h3>
            <p className="mx-auto max-w-sm text-sm text-slate-700">
              We have received your project details. A member of our engineering team will contact you shortly.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl bg-[#091833] px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#e51a24]"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMessage && (
              <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-600">
                {errorMessage}
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-1.5 text-xs font-bold text-slate-800">
                <span>Full Name <span className="text-[#e51a24]">*</span></span>
                <input
                  type="text"
                  required
                  autoComplete="name"
                  placeholder="e.g. Engr. Juan Dela Cruz"
                  value={formData.name}
                  onChange={(event) => setFormData({ ...formData, name: event.target.value })}
                  className={fieldClassName}
                />
              </label>
              <label className="space-y-1.5 text-xs font-bold text-slate-800">
                <span>Phone / Mobile <span className="text-[#e51a24]">*</span></span>
                <input
                  type="tel"
                  required
                  autoComplete="tel"
                  placeholder="e.g. +63 917 123 4567"
                  value={formData.phone}
                  onChange={(event) => setFormData({ ...formData, phone: event.target.value })}
                  className={fieldClassName}
                />
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-1.5 text-xs font-bold text-slate-800">
                <span>Email Address <span className="text-[#e51a24]">*</span></span>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="e.g. juan@company.com"
                  value={formData.email}
                  onChange={(event) => setFormData({ ...formData, email: event.target.value })}
                  className={fieldClassName}
                />
              </label>
              <label className="space-y-1.5 text-xs font-bold text-slate-800">
                <span>Nearest Preferred Branch</span>
                <select
                  value={formData.preferredBranch}
                  onChange={(event) => setFormData({ ...formData, preferredBranch: event.target.value })}
                  className={`${fieldClassName} text-slate-800`}
                >
                  <option value="Cebu Head Office">Cebu Head Office (Central Visayas / Nationwide)</option>
                  <option value="Bohol Showroom & Branch">Bohol Showroom &amp; Branch</option>
                  <option value="Davao Regional Branch">Davao Regional Branch (Mindanao)</option>
                </select>
              </label>
            </div>

            <label className="block space-y-1.5 text-xs font-bold text-slate-800">
              <span>Service / Scope Needed</span>
              <select
                value={formData.service}
                onChange={(event) => setFormData({ ...formData, service: event.target.value })}
                className={`${fieldClassName} text-slate-800`}
              >
                <option value="Solar PV Rooftop Installation">Residential Solar PV System</option>
                <option value="Commercial & Industrial Solar EPC">Commercial &amp; Industrial Solar EPC</option>
                <option value="Hybrid Solar with Battery Backup">Hybrid Solar with LiFePO4 Battery</option>
                <option value="Off-Grid Autonomous Power">Off-Grid Autonomous Solar</option>
                <option value="Floating Solar PV Solution">Floating Solar PV EPC</option>
                <option value="Electrical Engineering & Transformer Banking">Electrical Engineering / High Voltage</option>
                <option value="Preventive Maintenance & Solar Cleaning">Solar PMS &amp; Panel Cleaning</option>
              </select>
            </label>

            <label className="block space-y-1.5 text-xs font-bold text-slate-800">
              <span>Project Details / Location / Monthly Bill</span>
              <textarea
                rows={3}
                placeholder="Share your project city, estimated monthly electric bill, roof type, or specific engineering requirements..."
                value={formData.message}
                onChange={(event) => setFormData({ ...formData, message: event.target.value })}
                className={`${fieldClassName} resize-y`}
              />
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#e51a24] py-3.5 text-sm font-black text-white shadow-lg transition-all hover:bg-[#c8141d] hover:shadow-red-600/30 disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  <span>Sending Inquiry...</span>
                </>
              ) : (
                <>
                  <span>Submit Project Inquiry</span>
                  <Send className="h-4 w-4" />
                </>
              )}
            </button>

            <p className="flex items-center justify-center gap-2 text-center text-[11px] text-slate-500">
              <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-[#0b7337]" />
              Your privacy is protected. Inquiries are sent directly to our engineering desk.
            </p>
          </form>
        )}
      </div>
    </dialog>
  );
}
