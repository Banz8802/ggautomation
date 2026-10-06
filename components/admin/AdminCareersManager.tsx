'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Briefcase,
  Upload,
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Search,
  ExternalLink,
  MapPin,
  Clock,
  Mail,
  Sparkles,
  ShieldCheck,
  Building2,
  X,
  Copy,
  Check,
  FileText,
  Sliders,
  Image as ImageIcon
} from 'lucide-react';
import { initialCareersData, CareersData, CareersPageSettings, JobItem } from '@/data/careersData';

interface AdminCareersManagerProps {
  showToast: (type: 'success' | 'error', text: string) => void;
  onJobsCountChange?: (count: number) => void;
}

export default function AdminCareersManager({ showToast, onJobsCountChange }: AdminCareersManagerProps) {
  const [careersData, setCareersData] = useState<CareersData>(initialCareersData);
  const [isLoading, setIsLoading] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'positions' | 'page_settings'>('positions');

  // Job Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All');

  // Page Settings Form State
  const [settingsForm, setSettingsForm] = useState<CareersPageSettings>(initialCareersData.pageSettings);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);
  const [isUploadingPoster, setIsUploadingPoster] = useState(false);
  const [isUploadingJobBanner, setIsUploadingJobBanner] = useState(false);
  const [uploadingJobId, setUploadingJobId] = useState<string | null>(null);
  const [newGeneralReq, setNewGeneralReq] = useState('');
  const bannerFileInputRef = useRef<HTMLInputElement>(null);
  const posterFileInputRef = useRef<HTMLInputElement>(null);
  const jobBannerFileInputRef = useRef<HTMLInputElement>(null);
  const cardBannerFileInputRef = useRef<{ [key: string]: HTMLInputElement | null }>({});

  // Job Modal State
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [jobModalMode, setJobModalMode] = useState<'create' | 'edit'>('create');
  const [jobFormData, setJobFormData] = useState<JobItem>({
    id: '',
    title: '',
    department: 'Sales & Business Development',
    location: 'Cebu City, Philippines',
    type: 'Full-Time',
    status: 'Open',
    experience: 'Entry Level / Fresh Graduates Welcome',
    preference: 'Preferably female and resident of Cebu City',
    description: '',
    bannerImage: '',
    requirements: [
      'Excellent at communication and interpersonal skills',
      'Responsible and organized',
      'Willing to learn and grow',
      'Team-oriented and hardworking',
      'Preferably female and resident of Cebu City'
    ],
    responsibilities: [
      'Engage with prospective solar energy clients',
      'Assist in generating proposals and coordinate with the engineering team'
    ],
    tags: ['Full-Time', 'Cebu City', 'Sales']
  });
  const [newRequirement, setNewRequirement] = useState('');
  const [newResponsibility, setNewResponsibility] = useState('');
  const [newTag, setNewTag] = useState('');
  const [deleteConfirmJobId, setDeleteConfirmJobId] = useState<string | null>(null);
  const [isSavingJob, setIsSavingJob] = useState(false);

  // Helper for reading file as Data URL
  const readFileAsDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Fetch careers data
  const fetchCareersData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/careers');
      const data = await res.json();
      if (res.ok && data.success && data.careers) {
        setCareersData(data.careers);
        setSettingsForm(data.careers.pageSettings || initialCareersData.pageSettings);
        if (onJobsCountChange && Array.isArray(data.careers.jobs)) {
          onJobsCountChange(data.careers.jobs.length);
        }
      }
    } catch {
      showToast('error', 'Failed to fetch careers data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCareersData();
  }, []);

  // Filtered jobs memo
  const departments = useMemo(() => {
    return ['All', ...Array.from(new Set((careersData.jobs || []).map((j) => j.department)))];
  }, [careersData.jobs]);

  const filteredJobs = useMemo(() => {
    return (careersData.jobs || []).filter((job) => {
      const matchesDept = selectedDepartment === 'All' || job.department === selectedDepartment;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        q === '' ||
        job.title.toLowerCase().includes(q) ||
        job.department.toLowerCase().includes(q) ||
        job.location.toLowerCase().includes(q) ||
        job.description.toLowerCase().includes(q);
      return matchesDept && matchesSearch;
    });
  }, [careersData.jobs, selectedDepartment, searchQuery]);

  // Handle Banner Upload
  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingBanner(true);
    try {
      const uploadData = new FormData();
      uploadData.append('file', files[0]);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: uploadData,
      });
      const data = await res.json();

      if (res.ok && data.success && data.url) {
        setSettingsForm((prev) => ({ ...prev, bannerImage: data.url }));
        showToast('success', 'Banner image uploaded successfully!');
      } else {
        const base64 = await readFileAsDataUrl(files[0]);
        setSettingsForm((prev) => ({ ...prev, bannerImage: base64 }));
        showToast('success', 'Banner image processed successfully!');
      }
    } catch {
      try {
        const base64 = await readFileAsDataUrl(files[0]);
        setSettingsForm((prev) => ({ ...prev, bannerImage: base64 }));
        showToast('success', 'Banner image processed successfully!');
      } catch {
        showToast('error', 'Failed to upload banner image');
      }
    } finally {
      setIsUploadingBanner(false);
      if (bannerFileInputRef.current) bannerFileInputRef.current.value = '';
    }
  };

  // Handle Poster Upload
  const handlePosterUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingPoster(true);
    try {
      const uploadData = new FormData();
      uploadData.append('file', files[0]);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: uploadData,
      });
      const data = await res.json();

      if (res.ok && data.success && data.url) {
        setSettingsForm((prev) => ({ ...prev, posterImage: data.url }));
        showToast('success', 'Hiring flyer poster uploaded successfully!');
      } else {
        const base64 = await readFileAsDataUrl(files[0]);
        setSettingsForm((prev) => ({ ...prev, posterImage: base64 }));
        showToast('success', 'Hiring flyer processed successfully!');
      }
    } catch {
      try {
        const base64 = await readFileAsDataUrl(files[0]);
        setSettingsForm((prev) => ({ ...prev, posterImage: base64 }));
        showToast('success', 'Hiring flyer processed successfully!');
      } catch {
        showToast('error', 'Failed to upload poster image');
      }
    } finally {
      setIsUploadingPoster(false);
      if (posterFileInputRef.current) posterFileInputRef.current.value = '';
    }
  };

  // Handle Job Banner Upload in modal
  const handleJobBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingJobBanner(true);
    try {
      const uploadData = new FormData();
      uploadData.append('file', files[0]);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: uploadData,
      });
      const data = await res.json();

      if (res.ok && data.success && data.url) {
        setJobFormData((prev) => ({ ...prev, bannerImage: data.url }));
        showToast('success', 'Job position image banner uploaded successfully!');
      } else {
        const base64 = await readFileAsDataUrl(files[0]);
        setJobFormData((prev) => ({ ...prev, bannerImage: base64 }));
        showToast('success', 'Job position banner processed successfully!');
      }
    } catch {
      try {
        const base64 = await readFileAsDataUrl(files[0]);
        setJobFormData((prev) => ({ ...prev, bannerImage: base64 }));
        showToast('success', 'Job position banner processed successfully!');
      } catch {
        showToast('error', 'Failed to upload job banner image');
      }
    } finally {
      setIsUploadingJobBanner(false);
      if (jobBannerFileInputRef.current) jobBannerFileInputRef.current.value = '';
    }
  };

  // Direct banner upload from job card in list
  const handleDirectCardBannerUpload = async (job: JobItem, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingJobId(job.id);
    try {
      let finalBannerUrl = '';
      const uploadData = new FormData();
      uploadData.append('file', files[0]);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: uploadData,
      });
      const data = await res.json();

      if (res.ok && data.success && data.url) {
        finalBannerUrl = data.url;
      } else {
        finalBannerUrl = await readFileAsDataUrl(files[0]);
      }

      // Save updated banner to backend
      const updateRes = await fetch('/api/careers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...job, bannerImage: finalBannerUrl }),
      });
      const updateData = await updateRes.json();

      if (updateRes.ok && updateData.success) {
        showToast('success', `Banner updated for ${job.title}!`);
        fetchCareersData();
      } else {
        showToast('error', updateData.error || 'Failed to update job banner');
      }
    } catch {
      showToast('error', 'Failed to upload job banner');
    } finally {
      setUploadingJobId(null);
      if (cardBannerFileInputRef.current[job.id]) {
        cardBannerFileInputRef.current[job.id]!.value = '';
      }
    }
  };

  // Save Page Settings
  const handleSavePageSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    try {
      const res = await fetch('/api/careers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'pageSettings', pageSettings: settingsForm }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast('success', 'Careers page banner & content updated!');
        fetchCareersData();
      } else {
        showToast('error', data.error || 'Failed to update settings');
      }
    } catch {
      showToast('error', 'Server error while saving settings');
    } finally {
      setIsSavingSettings(false);
    }
  };

  // General requirement add/remove
  const handleAddGeneralReq = () => {
    if (newGeneralReq.trim()) {
      setSettingsForm((prev) => ({
        ...prev,
        generalRequirements: [...(prev.generalRequirements || []), newGeneralReq.trim()],
      }));
      setNewGeneralReq('');
    }
  };

  const handleRemoveGeneralReq = (index: number) => {
    setSettingsForm((prev) => ({
      ...prev,
      generalRequirements: (prev.generalRequirements || []).filter((_, i) => i !== index),
    }));
  };

  // Open Create Job Modal
  const handleOpenCreateJob = () => {
    setJobModalMode('create');
    setJobFormData({
      id: `job-${Date.now()}`,
      title: '',
      department: 'Sales & Business Development',
      location: 'Cebu City, Philippines',
      type: 'Full-Time',
      status: 'Open',
      experience: 'Entry Level / Fresh Graduates Welcome',
      preference: 'Preferably female and resident of Cebu City',
      description: '',
      bannerImage: '/images/hero-career.webp',
      requirements: [
        'Excellent communication and interpersonal skills',
        'Responsible and organized',
        'Willing to learn and grow',
        'Team-oriented and hardworking',
        'Preferably female and resident of Cebu City'
      ],
      responsibilities: [
        'Engage with potential clients and coordinate solar requirements'
      ],
      tags: ['Full-Time', 'Cebu City']
    });
    setIsJobModalOpen(true);
  };

  // Open Edit Job Modal
  const handleOpenEditJob = (job: JobItem) => {
    setJobModalMode('edit');
    setJobFormData({
      ...job,
      bannerImage: job.bannerImage || job.image || '',
      requirements: job.requirements || [],
      responsibilities: job.responsibilities || [],
      tags: job.tags || [],
    });
    setIsJobModalOpen(true);
  };

  // Save Job Position
  const handleSaveJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobFormData.title.trim()) {
      showToast('error', 'Position title is required.');
      return;
    }

    setIsSavingJob(true);
    try {
      const method = jobModalMode === 'create' ? 'POST' : 'PUT';
      const res = await fetch('/api/careers', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jobFormData),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast('success', `Position ${jobModalMode === 'create' ? 'created' : 'updated'} successfully!`);
        setIsJobModalOpen(false);
        fetchCareersData();
      } else {
        showToast('error', data.error || 'Failed to save position');
      }
    } catch {
      showToast('error', 'Server error while saving position');
    } finally {
      setIsSavingJob(false);
    }
  };

  // Delete Job Position
  const handleDeleteJob = async (id: string) => {
    try {
      const res = await fetch(`/api/careers?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast('success', 'Job position deleted');
        setDeleteConfirmJobId(null);
        fetchCareersData();
      } else {
        showToast('error', data.error || 'Failed to delete position');
      }
    } catch {
      showToast('error', 'Server error while deleting position');
    }
  };

  // Toggle Job Status
  const handleToggleJobStatus = async (job: JobItem) => {
    const nextStatus = job.status === 'Open' ? 'Closed' : 'Open';
    try {
      const res = await fetch('/api/careers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...job, status: nextStatus }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast('success', `Status updated to ${nextStatus}`);
        fetchCareersData();
      }
    } catch {
      showToast('error', 'Failed to toggle status');
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl w-full mx-auto">
      {/* ---------------------------------------------------------------------- */}
      {/* SECTION HEADER & SUB-TABS                                              */}
      {/* ---------------------------------------------------------------------- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-[#ffc000]" />
            <span>Careers & Recruitment Management</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage banner images, hiring requirements, and live job positions on{' '}
            <code className="text-[#ffc000]">/careers</code>.
          </p>
        </div>

        {/* Sub-tab Switchers */}
        <div className="flex items-center gap-2 bg-[#061021] p-1 rounded-2xl border border-white/10">
          <button
            onClick={() => setActiveSubTab('positions')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'positions'
                ? 'bg-gradient-to-r from-[#0b7337] to-[#0e9447] text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Job Positions</span>
            <span className="px-1.5 py-0.2 bg-white/20 rounded-full text-[10px] font-black">
              {(careersData.jobs || []).length}
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('page_settings')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'page_settings'
                ? 'bg-gradient-to-r from-[#0b7337] to-[#0e9447] text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Banner & Page Content</span>
          </button>
        </div>
      </div>

      {/* ====================================================================== */}
      {/* TAB 1: JOB POSITIONS LIST & CRUD                                       */}
      {/* ====================================================================== */}
      {activeSubTab === 'positions' && (
        <div className="space-y-6">
          {/* Action and Search Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1 max-w-lg">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search positions by title, department, or keyword..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-[#0b7337] transition-colors"
                />
              </div>

              {departments.length > 2 && (
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="px-3 py-2.5 rounded-xl bg-[#061021] border border-white/10 text-white text-xs focus:outline-none focus:border-[#0b7337]"
                >
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={fetchCareersData}
                disabled={isLoading}
                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors flex items-center gap-1.5 text-xs font-bold cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-[#ffc000]' : ''}`} />
                <span>Sync</span>
              </button>

              <button
                onClick={handleOpenCreateJob}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#0b7337] via-[#0e9447] to-[#0b7337] text-white text-xs font-bold shadow-lg shadow-emerald-950/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer border border-emerald-400/30"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Position</span>
              </button>
            </div>
          </div>

          {/* Job Positions Grid */}
          {filteredJobs.length === 0 ? (
            <div className="text-center py-16 bg-[#091833] rounded-3xl border border-white/10 space-y-3">
              <Briefcase className="w-10 h-10 text-slate-500 mx-auto" />
              <div className="text-sm font-bold text-white">No job positions found</div>
              <p className="text-xs text-slate-400">Click &quot;Add New Position&quot; to publish your first hiring opening.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredJobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-[#091833] rounded-3xl border border-white/10 shadow-xl overflow-hidden flex flex-col justify-between hover:border-white/30 transition-all group"
                >
                  {/* Job Image Banner Header */}
                  <div className="relative h-48 w-full bg-slate-950 border-b border-white/10 overflow-hidden flex items-center justify-center p-2">
                    {job.bannerImage || job.image ? (
                      <div className="relative w-full h-full">
                        <Image
                          src={job.bannerImage || job.image || ''}
                          alt={job.title}
                          fill
                          className="object-contain group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-[#061021] to-[#091833] text-slate-500 space-y-1">
                        <ImageIcon className="w-8 h-8 text-slate-600" />
                        <span className="text-[11px] text-slate-400 font-medium">No Banner Image</span>
                      </div>
                    )}

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#091833]/80 via-transparent to-transparent pointer-events-none"></div>

                    {/* Department Tag & Status Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10">
                      <span className="text-[10px] font-black uppercase tracking-wider text-white bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                        {job.department}
                      </span>
                      <button
                        onClick={() => handleToggleJobStatus(job)}
                        className={`px-3 py-1 rounded-full text-[11px] font-bold border backdrop-blur-md transition-colors cursor-pointer ${
                          job.status === 'Open'
                            ? 'bg-emerald-500/80 text-white border-emerald-400 shadow-sm'
                            : 'bg-slate-800/80 text-slate-300 border-slate-600 hover:bg-slate-700'
                        }`}
                        title="Click to toggle Open/Closed status"
                      >
                        {job.status === 'Open' ? '● Open (Hiring)' : '○ Closed'}
                      </button>
                    </div>

                    {/* Quick Banner Upload Button Overlay */}
                    <div className="absolute bottom-3 right-3 z-10">
                      <input
                        ref={(el) => {
                          cardBannerFileInputRef.current[job.id] = el;
                        }}
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleDirectCardBannerUpload(job, e)}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => cardBannerFileInputRef.current[job.id]?.click()}
                        disabled={uploadingJobId === job.id}
                        className="px-2.5 py-1 rounded-xl bg-black/70 hover:bg-black/90 text-white text-[11px] font-bold border border-white/20 backdrop-blur-md transition-all flex items-center gap-1.5 cursor-pointer shadow-md disabled:opacity-50"
                        title="Upload/Replace Banner Image"
                      >
                        {uploadingJobId === job.id ? (
                          <>
                            <RefreshCw className="w-3 h-3 animate-spin text-[#ffc000]" />
                            <span>Uploading...</span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-3 h-3 text-[#ffc000]" />
                            <span>{job.bannerImage || job.image ? 'Change Banner' : 'Upload Banner'}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div>
                        <h3 className="text-xl font-black text-white">{job.title}</h3>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300">
                        <span className="flex items-center gap-1 bg-white/5 px-2.5 py-1 rounded-lg border border-white/5">
                          <MapPin className="w-3 h-3 text-[#e51a24]" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1 bg-white/5 px-2.5 py-1 rounded-lg border border-white/5">
                          <Clock className="w-3 h-3 text-[#0b7337]" />
                          {job.type}
                        </span>
                        {job.experience && (
                          <span className="flex items-center gap-1 bg-white/5 px-2.5 py-1 rounded-lg border border-white/5">
                            <Briefcase className="w-3 h-3 text-indigo-400" />
                            {job.experience}
                          </span>
                        )}
                      </div>

                      {job.preference && (
                        <div className="p-2 rounded-xl bg-[#ffc000]/10 border border-[#ffc000]/20 text-[#ffc000] text-[11px] font-medium flex items-center gap-2">
                          <Sparkles className="w-3 h-3 flex-shrink-0" />
                          <span>{job.preference}</span>
                        </div>
                      )}

                      <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">{job.description}</p>
                    </div>

                    <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
                      <div className="text-[11px] text-slate-400 font-mono">ID: {job.id}</div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenEditJob(job)}
                          className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-bold"
                          title="Edit position"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => setDeleteConfirmJobId(job.id)}
                          className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                          title="Delete position"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ====================================================================== */}
      {/* TAB 2: BANNER IMAGE & PAGE CONTENT SETTINGS                            */}
      {/* ====================================================================== */}
      {activeSubTab === 'page_settings' && (
        <form onSubmit={handleSavePageSettings} className="space-y-6">
          {/* Top Banner Image Upload Card */}
          <div className="bg-[#091833] rounded-3xl p-6 border border-white/10 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-[#ffc000]" />
                  <span>Careers Hero Banner Image</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Upload or change the hero banner background image displayed on the top of the Careers page.
                </p>
              </div>
              <input
                ref={bannerFileInputRef}
                type="file"
                accept="image/*"
                onChange={handleBannerUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => bannerFileInputRef.current?.click()}
                disabled={isUploadingBanner}
                className="px-4 py-2 rounded-xl bg-[#0b7337] hover:bg-[#0e9447] text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
              >
                {isUploadingBanner ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Banner Image</span>
                  </>
                )}
              </button>
            </div>

            {/* Banner Preview & URL */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="relative h-44 rounded-2xl overflow-hidden bg-black/40 border border-white/10 md:col-span-1">
                {settingsForm.bannerImage ? (
                  <Image
                    src={settingsForm.bannerImage}
                    alt="Careers Banner Preview"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 space-y-1">
                    <ImageIcon className="w-8 h-8" />
                    <span className="text-[11px]">No Banner Selected</span>
                  </div>
                )}
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-bold text-white border border-white/20">
                  Live Preview
                </div>
              </div>

              <div className="md:col-span-2 space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Banner Image URL or Path
                  </label>
                  <input
                    type="text"
                    value={settingsForm.bannerImage || ''}
                    onChange={(e) => setSettingsForm((prev) => ({ ...prev, bannerImage: e.target.value }))}
                    placeholder="/images/service-commercial.webp or uploaded URL"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#0b7337]"
                  />
                </div>
                <div className="text-[11px] text-slate-400">
                  Recommended size: 1920x800px (landscape JPG or WebP). The system automatically optimizes and overlays the brand gradient.
                </div>
              </div>
            </div>
          </div>

          {/* Hiring Flyer / Poster Upload Card */}
          <div className="bg-[#091833] rounded-3xl p-6 border border-white/10 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#e51a24]" />
                  <span>Hiring Flyer / Poster Graphic</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Upload the official recruitment flyer / poster graphic (like the &quot;WE ARE HIRING&quot; poster).
                </p>
              </div>
              <input
                ref={posterFileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePosterUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => posterFileInputRef.current?.click()}
                disabled={isUploadingPoster}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border border-white/20 disabled:opacity-50"
              >
                {isUploadingPoster ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Poster</span>
                  </>
                )}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="relative h-44 rounded-2xl overflow-hidden bg-black/40 border border-white/10 md:col-span-1">
                {settingsForm.posterImage ? (
                  <Image
                    src={settingsForm.posterImage}
                    alt="Hiring Poster Preview"
                    fill
                    className="object-contain p-2"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 space-y-1">
                    <FileText className="w-8 h-8" />
                    <span className="text-[11px]">Optional Flyer Image</span>
                  </div>
                )}
              </div>

              <div className="md:col-span-2 space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Poster Image URL or Path
                  </label>
                  <input
                    type="text"
                    value={settingsForm.posterImage || ''}
                    onChange={(e) => setSettingsForm((prev) => ({ ...prev, posterImage: e.target.value }))}
                    placeholder="/images/hiring-poster.jpg or uploaded URL"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#0b7337]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Banner Copy & Page Typography Card */}
          <div className="bg-[#091833] rounded-3xl p-6 border border-white/10 shadow-xl space-y-6">
            <h3 className="text-base font-black text-white border-b border-white/10 pb-3">
              Hero Text & Recruitment Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Top Badge Text
                </label>
                <input
                  type="text"
                  value={settingsForm.badge || ''}
                  onChange={(e) => setSettingsForm((prev) => ({ ...prev, badge: e.target.value }))}
                  placeholder="WE ARE HIRING!"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#0b7337]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Application Target Email
                </label>
                <input
                  type="email"
                  value={settingsForm.applicationEmail || ''}
                  onChange={(e) => setSettingsForm((prev) => ({ ...prev, applicationEmail: e.target.value }))}
                  placeholder="Info@ggautomation.tech"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#0b7337]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Hero Headline Title
                </label>
                <input
                  type="text"
                  value={settingsForm.title || ''}
                  onChange={(e) => setSettingsForm((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="Join Our Growing Team & Build Your Career in Clean Energy"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#0b7337]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Hero Subtitle Copy
                </label>
                <textarea
                  rows={2}
                  value={settingsForm.subtitle || ''}
                  onChange={(e) => setSettingsForm((prev) => ({ ...prev, subtitle: e.target.value }))}
                  placeholder="Looking for a start of your career opportunity? We're expanding our team..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#0b7337]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Culture Headline Message
                </label>
                <input
                  type="text"
                  value={settingsForm.headline || ''}
                  onChange={(e) => setSettingsForm((prev) => ({ ...prev, headline: e.target.value }))}
                  placeholder="Be part of our team in helping build a cleaner, brighter, and more sustainable future..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#0b7337]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Application Instructions Note
                </label>
                <textarea
                  rows={2}
                  value={settingsForm.applicationInstructions || ''}
                  onChange={(e) => setSettingsForm((prev) => ({ ...prev, applicationInstructions: e.target.value }))}
                  placeholder="For interested applicants: Send your updated resume to Info@ggautomation.tech..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#0b7337]"
                />
              </div>
            </div>

            {/* General Requirements List Builder */}
            <div className="space-y-3 pt-4 border-t border-white/10">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                General Candidate Qualifications (&quot;What We Look For&quot;)
              </label>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newGeneralReq}
                  onChange={(e) => setNewGeneralReq(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddGeneralReq();
                    }
                  }}
                  placeholder="e.g. Excellent communication skills, Willing to learn..."
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#0b7337]"
                />
                <button
                  type="button"
                  onClick={handleAddGeneralReq}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Add
                </button>
              </div>

              <div className="space-y-2 pt-2">
                {(settingsForm.generalRequirements || []).map((req, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-200"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#0b7337]" />
                      <span>{req}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveGeneralReq(idx)}
                      className="text-slate-400 hover:text-red-400 p-1 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSavingSettings}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#0b7337] via-[#0e9447] to-[#0b7337] text-white text-sm font-bold shadow-xl shadow-emerald-950/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer border border-emerald-400/30 disabled:opacity-50"
            >
              {isSavingSettings ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Saving Settings...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Save Careers Page Settings</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* ====================================================================== */}
      {/* MODAL: CREATE / EDIT JOB POSITION                                      */}
      {/* ====================================================================== */}
      {isJobModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in">
          <div className="bg-[#091833] text-white rounded-3xl border border-white/20 shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden">
            <div className="px-6 py-4 bg-[#061021] border-b border-white/10 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#0b7337] flex items-center justify-center text-white">
                  <Briefcase className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-black text-white">
                    {jobModalMode === 'create' ? 'Add New Job Position' : 'Edit Job Position'}
                  </h2>
                  <div className="text-[11px] text-slate-400">
                    Publish open career positions to the live website
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsJobModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-red-500 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveJob} className="flex-1 overflow-y-auto p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Position Title <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={jobFormData.title}
                    onChange={(e) => setJobFormData((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g. Sales Representative, Administrative Staff"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#0b7337]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Department / Category
                  </label>
                  <input
                    type="text"
                    value={jobFormData.department}
                    onChange={(e) => setJobFormData((prev) => ({ ...prev, department: e.target.value }))}
                    placeholder="e.g. Sales & Business Development, Operations & Admin"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#0b7337]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Hiring Status
                  </label>
                  <select
                    value={jobFormData.status}
                    onChange={(e) =>
                      setJobFormData((prev) => ({ ...prev, status: e.target.value as 'Open' | 'Closed' }))
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#061021] border border-white/10 text-white text-xs focus:outline-none focus:border-[#0b7337]"
                  >
                    <option value="Open">Open (Actively Hiring)</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Location
                  </label>
                  <input
                    type="text"
                    value={jobFormData.location}
                    onChange={(e) => setJobFormData((prev) => ({ ...prev, location: e.target.value }))}
                    placeholder="Cebu City, Philippines"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#0b7337]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Employment Type
                  </label>
                  <input
                    type="text"
                    value={jobFormData.type}
                    onChange={(e) => setJobFormData((prev) => ({ ...prev, type: e.target.value }))}
                    placeholder="Full-Time, Part-Time, Internship"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#0b7337]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Experience Level
                  </label>
                  <input
                    type="text"
                    value={jobFormData.experience}
                    onChange={(e) => setJobFormData((prev) => ({ ...prev, experience: e.target.value }))}
                    placeholder="Entry Level / Fresh Graduates Welcome"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#0b7337]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Special Preference / Note
                  </label>
                  <input
                    type="text"
                    value={jobFormData.preference || ''}
                    onChange={(e) => setJobFormData((prev) => ({ ...prev, preference: e.target.value }))}
                    placeholder="Preferably female and resident of Cebu City"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#0b7337]"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Role Description
                  </label>
                  <textarea
                    rows={3}
                    value={jobFormData.description}
                    onChange={(e) => setJobFormData((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe the primary objectives and scope of this position..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#0b7337]"
                  />
                </div>
              </div>

              {/* Position Image Banner / Flyer Graphic Upload */}
              <div className="p-4 rounded-2xl bg-[#061021] border border-white/10 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                  <div>
                    <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5 text-[#ffc000]" />
                      <span>Position Image Banner / Flyer Graphic</span>
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Upload an image banner or flyer to display on this career listing card.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      ref={jobBannerFileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleJobBannerUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => jobBannerFileInputRef.current?.click()}
                      disabled={isUploadingJobBanner}
                      className="px-3 py-1.5 rounded-xl bg-[#0b7337] hover:bg-[#0e9447] text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md disabled:opacity-50"
                    >
                      {isUploadingJobBanner ? (
                        <>
                          <RefreshCw className="w-3 h-3 animate-spin" />
                          <span>Uploading...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-3 h-3" />
                          <span>Upload Banner</span>
                        </>
                      )}
                    </button>
                    {jobFormData.bannerImage && (
                      <button
                        type="button"
                        onClick={() => setJobFormData((prev) => ({ ...prev, bannerImage: '' }))}
                        className="px-2.5 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold transition-colors cursor-pointer"
                        title="Remove banner image"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                  <div className="relative h-32 rounded-xl overflow-hidden bg-black/40 border border-white/10 sm:col-span-1">
                    {jobFormData.bannerImage ? (
                      <Image
                        src={jobFormData.bannerImage}
                        alt="Position Banner Preview"
                        fill
                        className="object-contain"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 space-y-1">
                        <ImageIcon className="w-6 h-6 text-slate-600" />
                        <span className="text-[10px]">No Banner Uploaded</span>
                      </div>
                    )}
                    <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[9px] font-bold text-white border border-white/20">
                      Card Preview
                    </div>
                  </div>

                  <div className="sm:col-span-2 space-y-2">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                        Image Banner URL or Path
                      </label>
                      <input
                        type="text"
                        value={jobFormData.bannerImage || ''}
                        onChange={(e) => setJobFormData((prev) => ({ ...prev, bannerImage: e.target.value }))}
                        placeholder="/images/hero-career.webp or uploaded URL"
                        className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#0b7337]"
                      />
                    </div>
                    <div className="text-[10px] text-slate-400 leading-tight">
                      Recommended: 1200×600px landscape JPG or WebP. Displayed prominently on the Careers list and position details.
                    </div>
                  </div>
                </div>
              </div>

              {/* Requirements list */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Requirements & Qualifications
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newRequirement}
                    onChange={(e) => setNewRequirement(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (newRequirement.trim()) {
                          setJobFormData((prev) => ({
                            ...prev,
                            requirements: [...prev.requirements, newRequirement.trim()],
                          }));
                          setNewRequirement('');
                        }
                      }
                    }}
                    placeholder="Add a requirement..."
                    className="flex-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newRequirement.trim()) {
                        setJobFormData((prev) => ({
                          ...prev,
                          requirements: [...prev.requirements, newRequirement.trim()],
                        }));
                        setNewRequirement('');
                      }
                    }}
                    className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold cursor-pointer"
                  >
                    Add
                  </button>
                </div>
                <div className="space-y-1.5">
                  {(jobFormData.requirements || []).map((req, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 rounded-lg bg-white/5 text-xs text-slate-200"
                    >
                      <span>• {req}</span>
                      <button
                        type="button"
                        onClick={() =>
                          setJobFormData((prev) => ({
                            ...prev,
                            requirements: prev.requirements.filter((_, i) => i !== idx),
                          }))
                        }
                        className="text-slate-400 hover:text-red-400 p-0.5 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Responsibilities list */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Key Responsibilities
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newResponsibility}
                    onChange={(e) => setNewResponsibility(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (newResponsibility.trim()) {
                          setJobFormData((prev) => ({
                            ...prev,
                            responsibilities: [...prev.responsibilities, newResponsibility.trim()],
                          }));
                          setNewResponsibility('');
                        }
                      }
                    }}
                    placeholder="Add a responsibility..."
                    className="flex-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newResponsibility.trim()) {
                        setJobFormData((prev) => ({
                          ...prev,
                          responsibilities: [...prev.responsibilities, newResponsibility.trim()],
                        }));
                        setNewResponsibility('');
                      }
                    }}
                    className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold cursor-pointer"
                  >
                    Add
                  </button>
                </div>
                <div className="space-y-1.5">
                  {(jobFormData.responsibilities || []).map((resp, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 rounded-lg bg-white/5 text-xs text-slate-200"
                    >
                      <span>• {resp}</span>
                      <button
                        type="button"
                        onClick={() =>
                          setJobFormData((prev) => ({
                            ...prev,
                            responsibilities: prev.responsibilities.filter((_, i) => i !== idx),
                          }))
                        }
                        className="text-slate-400 hover:text-red-400 p-0.5 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </form>

            <div className="px-6 py-4 bg-[#061021] border-t border-white/10 flex items-center justify-between flex-shrink-0">
              <button
                type="button"
                onClick={() => setIsJobModalOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 hover:text-white text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSaveJob}
                disabled={isSavingJob}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#0b7337] via-[#0e9447] to-[#0b7337] text-white text-xs font-bold shadow-lg shadow-emerald-950/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer border border-emerald-400/30 disabled:opacity-50"
              >
                {isSavingJob ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{jobModalMode === 'create' ? 'Create Position' : 'Save Changes'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================== */}
      {/* DELETE CONFIRMATION DIALOG                                             */}
      {/* ====================================================================== */}
      {deleteConfirmJobId && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#091833] text-white rounded-3xl border border-red-500/30 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1.5">
              <h3 className="text-base font-black text-white">Delete Job Position?</h3>
              <p className="text-xs text-slate-300">
                Are you sure you want to remove this position? It will no longer appear on the live Careers page.
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmJobId(null)}
                className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 hover:text-white text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteJob(deleteConfirmJobId)}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-lg shadow-red-950/40 cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
