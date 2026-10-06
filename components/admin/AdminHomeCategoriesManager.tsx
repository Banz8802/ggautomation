'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Layers,
  Upload,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Edit3,
  Trash2,
  Plus,
  X,
  ExternalLink,
  Camera,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Home,
  Building2,
  Factory,
  GraduationCap,
  Eye,
  Sliders,
  Check,
  ArrowRight,
  Info,
  Minus,
  CheckSquare,
  Square,
  Search,
  FolderPlus
} from 'lucide-react';
import { HomeCategoryItem, ProjectPhotoSelection, initialHomeCategories } from '@/data/homeCategoriesData';
import { projects as initialProjects, parseRawProjects, ProjectItem, ProjectRawInput } from '@/data/projectsData';

export default function AdminHomeCategoriesManager() {
  const [categories, setCategories] = useState<HomeCategoryItem[]>(initialHomeCategories);
  const [projectsList, setProjectsList] = useState<ProjectItem[]>(initialProjects);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingCatId, setUploadingCatId] = useState<string | null>(null);

  // Modal State
  const [selectedCategory, setSelectedCategory] = useState<HomeCategoryItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeModalTab, setActiveModalTab] = useState<'images' | 'content' | 'preview'>('images');
  const [categoryFormData, setCategoryFormData] = useState<HomeCategoryItem>(initialHomeCategories[0]);
  const [searchProjectQuery, setSearchProjectQuery] = useState('');
  const [isAddingOtherProject, setIsAddingOtherProject] = useState(false);

  // Toast State
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const directFileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  const modalFileInputRef = useRef<HTMLInputElement | null>(null);

  const showToast = (type: 'success' | 'error', text: string) => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Fetch Categories and Projects on mount
  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/home-categories');
      const data = await res.json();
      if (data.success && Array.isArray(data.categories) && data.categories.length > 0) {
        setCategories(data.categories);
      }
    } catch {
      showToast('error', 'Could not load home categories');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects');
      const data = await res.json();
      if (data.success && Array.isArray(data.projects)) {
        const parsed = parseRawProjects(data.projects as ProjectRawInput[]);
        if (parsed.length > 0) {
          setProjectsList(parsed);
        }
      }
    } catch {}
  };

  useEffect(() => {
    fetchCategories();
    fetchProjects();
  }, []);

  // Helper to read file as base64 for fallback
  const readFileAsDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Get project images available for this category
  const getCategoryProjects = (categoryName: HomeCategoryItem['category']) => {
    return projectsList.filter((p) => p.category === categoryName);
  };

  // Compute active images for a category based on its mode and project selections
  const getActiveImagesForCategory = (cat: HomeCategoryItem): string[] => {
    // 1. Projects mode
    if (
      cat.mode === 'projects' ||
      (cat.projectSelections && cat.projectSelections.length > 0 && cat.mode !== 'auto' && cat.mode !== 'custom')
    ) {
      const imgs: string[] = [];
      const enabledSelections = (cat.projectSelections || []).filter((s) => s.enabled !== false);

      enabledSelections.forEach((sel) => {
        const proj = projectsList.find(
          (p) => p.id === sel.projectId || p.title.toLowerCase() === sel.projectTitle.toLowerCase()
        );
        if (proj && proj.images && proj.images.length > 0) {
          if (sel.selectedImages && sel.selectedImages.length > 0) {
            sel.selectedImages.forEach((img) => {
              if (img && !imgs.includes(img)) imgs.push(img);
            });
          } else {
            const count = Math.max(1, sel.photoCount || 1);
            proj.images.slice(0, count).forEach((img) => {
              if (img && !imgs.includes(img)) imgs.push(img);
            });
          }
        }
      });

      if (imgs.length > 0) return imgs;
    }

    // 2. Custom Uploaded Reel mode
    if (cat.mode === 'custom' && cat.customImages && cat.customImages.length > 0) {
      return cat.customImages;
    }

    // 3. Auto mode: 1st photo of every project in category
    const catProjects = getCategoryProjects(cat.category);
    const autoImgs: string[] = [];
    catProjects.forEach((p) => {
      if (p.images && p.images.length > 0 && p.images[0]) {
        if (!autoImgs.includes(p.images[0])) {
          autoImgs.push(p.images[0]);
        }
      }
    });

    if (autoImgs.length > 0) return autoImgs;
    if (cat.customImages && cat.customImages.length > 0) return cat.customImages;
    return [cat.defaultImage || '/images/placeholder.webp'];
  };

  // Direct Card Image Upload Handler
  const handleDirectImageUpload = async (cat: HomeCategoryItem, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingCatId(cat.id);
    try {
      const uploadData = new FormData();
      for (let i = 0; i < files.length; i++) {
        uploadData.append('files', files[i]);
      }

      let newUrls: string[] = [];
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: uploadData,
      });
      const data = await res.json();
      if (res.ok && data.success && Array.isArray(data.urls) && data.urls.length > 0) {
        newUrls = data.urls;
      } else {
        newUrls = await Promise.all(Array.from(files).map(readFileAsDataUrl));
      }

      if (newUrls.length > 0) {
        const updatedCat: HomeCategoryItem = {
          ...cat,
          mode: 'custom',
          customImages: [...(cat.customImages || []), ...newUrls],
        };

        const updatedCategories = categories.map((c) => (c.id === cat.id ? updatedCat : c));
        setCategories(updatedCategories);

        await fetch('/api/home-categories', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedCat),
        });

        showToast('success', `${newUrls.length} image(s) uploaded to ${cat.title} category!`);
      }
    } catch {
      showToast('error', 'Failed to upload image');
    } finally {
      setUploadingCatId(null);
      if (directFileInputRefs.current[cat.id]) {
        directFileInputRefs.current[cat.id]!.value = '';
      }
    }
  };

  // Open Edit Modal & Populate Project Selections
  const handleOpenEdit = (cat: HomeCategoryItem) => {
    setSelectedCategory(cat);

    const catProjects = getCategoryProjects(cat.category);
    const existingSelections = cat.projectSelections || [];

    // Ensure all category projects have an entry in projectSelections
    const initializedSelections: ProjectPhotoSelection[] = catProjects.map((p) => {
      const existing = existingSelections.find(
        (s) => s.projectId === p.id || s.projectTitle.toLowerCase() === p.title.toLowerCase()
      );
      if (existing) return existing;
      return {
        projectId: p.id,
        projectTitle: p.title,
        photoCount: 1,
        selectedImages: p.images && p.images.length > 0 ? [p.images[0]] : [],
        enabled: true,
      };
    });

    // Also include any other projects previously added by the user
    existingSelections.forEach((s) => {
      if (!initializedSelections.some((m) => m.projectId === s.projectId)) {
        initializedSelections.push(s);
      }
    });

    setCategoryFormData({
      ...cat,
      projectSelections: initializedSelections,
      customImages: cat.customImages || [],
    });
    setActiveModalTab('images');
    setIsModalOpen(true);
    setSearchProjectQuery('');
    setIsAddingOtherProject(false);
  };

  // Save Modal Form
  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      // Synchronize customImages with active carousel images for maximum compatibility
      const activeImgs = getActiveImagesForCategory(categoryFormData);
      const dataToSave: HomeCategoryItem = {
        ...categoryFormData,
        customImages: activeImgs.length > 0 ? activeImgs : categoryFormData.customImages,
      };

      const res = await fetch('/api/home-categories', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSave),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast('success', `Saved ${categoryFormData.title} configuration!`);
        setIsModalOpen(false);
        fetchCategories();
      } else {
        showToast('error', data.error || 'Failed to save category');
      }
    } catch {
      showToast('error', 'Server error while saving category');
    } finally {
      setIsSaving(false);
    }
  };

  // Modal Image Upload
  const handleModalImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsSaving(true);
    try {
      const uploadData = new FormData();
      for (let i = 0; i < files.length; i++) {
        uploadData.append('files', files[i]);
      }

      let newUrls: string[] = [];
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: uploadData,
      });
      const data = await res.json();
      if (res.ok && data.success && Array.isArray(data.urls) && data.urls.length > 0) {
        newUrls = data.urls;
      } else {
        newUrls = await Promise.all(Array.from(files).map(readFileAsDataUrl));
      }

      if (newUrls.length > 0) {
        setCategoryFormData((prev) => ({
          ...prev,
          mode: 'custom',
          customImages: [...(prev.customImages || []), ...newUrls],
        }));
        showToast('success', `${newUrls.length} photo(s) added!`);
      }
    } catch {
      showToast('error', 'Upload error');
    } finally {
      setIsSaving(false);
      if (modalFileInputRef.current) modalFileInputRef.current.value = '';
    }
  };

  // Remove single image from custom list
  const handleRemoveCustomImage = (imgUrl: string) => {
    setCategoryFormData((prev) => ({
      ...prev,
      customImages: prev.customImages.filter((img) => img !== imgUrl),
    }));
  };

  // Toggle project inclusion in category carousel
  const handleToggleProjectEnabled = (projectId: string) => {
    setCategoryFormData((prev) => {
      const selections = [...(prev.projectSelections || [])];
      const index = selections.findIndex((s) => s.projectId === projectId);
      if (index >= 0) {
        selections[index] = {
          ...selections[index],
          enabled: !selections[index].enabled,
        };
      }
      return {
        ...prev,
        mode: 'projects',
        projectSelections: selections,
      };
    });
  };

  // Change project photo count (e.g. 1 photo, 2 photos, 3 photos)
  const handleSetProjectPhotoCount = (projectId: string, count: number) => {
    const proj = projectsList.find((p) => p.id === projectId);
    const maxPhotos = proj?.images?.length || 1;
    const cleanCount = Math.max(1, Math.min(maxPhotos, count));

    setCategoryFormData((prev) => {
      const selections = [...(prev.projectSelections || [])];
      const index = selections.findIndex((s) => s.projectId === projectId);
      if (index >= 0 && proj) {
        const slicedImages = (proj.images || []).slice(0, cleanCount);
        selections[index] = {
          ...selections[index],
          photoCount: cleanCount,
          selectedImages: slicedImages,
          enabled: true,
        };
      }
      return {
        ...prev,
        mode: 'projects',
        projectSelections: selections,
      };
    });
  };

  // Toggle specific image for a project
  const handleToggleProjectSpecificImage = (projectId: string, imgUrl: string) => {
    const proj = projectsList.find((p) => p.id === projectId);
    if (!proj) return;

    setCategoryFormData((prev) => {
      const selections = [...(prev.projectSelections || [])];
      const index = selections.findIndex((s) => s.projectId === projectId);
      if (index >= 0) {
        const currentSel = selections[index];
        let currentImgs = currentSel.selectedImages || (proj.images ? proj.images.slice(0, currentSel.photoCount || 1) : []);
        const exists = currentImgs.includes(imgUrl);

        let nextImgs: string[] = [];
        if (exists) {
          nextImgs = currentImgs.filter((img) => img !== imgUrl);
        } else {
          nextImgs = [...currentImgs, imgUrl];
        }

        selections[index] = {
          ...currentSel,
          photoCount: Math.max(1, nextImgs.length),
          selectedImages: nextImgs,
          enabled: nextImgs.length > 0,
        };
      }
      return {
        ...prev,
        mode: 'projects',
        projectSelections: selections,
      };
    });
  };

  // Add project from another category
  const handleAddOtherProject = (proj: ProjectItem) => {
    setCategoryFormData((prev) => {
      const selections = [...(prev.projectSelections || [])];
      if (!selections.some((s) => s.projectId === proj.id)) {
        selections.push({
          projectId: proj.id,
          projectTitle: proj.title,
          photoCount: 1,
          selectedImages: proj.images && proj.images.length > 0 ? [proj.images[0]] : [],
          enabled: true,
        });
      }
      return {
        ...prev,
        mode: 'projects',
        projectSelections: selections,
      };
    });
    setIsAddingOtherProject(false);
    showToast('success', `Added "${proj.title}" to selection!`);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Residential':
        return <Home className="w-5 h-5 text-[#0b7337]" />;
      case 'Commercial':
        return <Building2 className="w-5 h-5 text-[#e51a24]" />;
      case 'Industrial':
        return <Factory className="w-5 h-5 text-[#ffc000]" />;
      case 'School':
        return <GraduationCap className="w-5 h-5 text-indigo-400" />;
      default:
        return <Layers className="w-5 h-5 text-emerald-400" />;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed top-6 right-6 z-[100] px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-xs font-bold transition-all border animate-fade-in ${
            toastMessage.type === 'success'
              ? 'bg-emerald-950/95 text-emerald-200 border-emerald-500/40 shadow-emerald-900/30'
              : 'bg-red-950/95 text-red-200 border-red-500/40 shadow-red-900/30'
          }`}
        >
          {toastMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-400" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#091833] via-[#061021] to-[#091833] rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#0b7337]/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ffc000]/10 border border-[#ffc000]/20 text-[#ffc000] text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Homepage Solar Services & Sectors</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Home Project Categories Manager
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Customize sector cards displayed on the homepage. Select which projects to feature and control how many photos from each project to rotate in the carousel (e.g. UCLM = 1 photo, Sacred Heart = 2 photos).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={fetchCategories}
              disabled={isLoading}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Reload Data</span>
            </button>
            <Link
              href="/#services"
              target="_blank"
              className="px-4 py-2.5 rounded-xl bg-[#0b7337] hover:bg-[#0e9447] text-white text-xs font-bold transition-all flex items-center gap-2 shadow-md hover:scale-105 cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Homepage Live</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 4 Category Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {categories.map((cat) => {
          const activeImages = getActiveImagesForCategory(cat);
          const catProjects = getCategoryProjects(cat.category);
          const enabledSelections = (cat.projectSelections || []).filter((s) => s.enabled !== false);

          return (
            <div
              key={cat.id}
              className="bg-[#091833] rounded-3xl border border-white/10 shadow-xl overflow-hidden flex flex-col justify-between hover:border-white/20 transition-all group"
            >
              {/* Card Image Banner Carousel Preview */}
              <div className="relative h-48 w-full bg-slate-950 border-b border-white/10 overflow-hidden group/img">
                <Image
                  src={activeImages[0] || cat.defaultImage || '/images/placeholder.webp'}
                  alt={cat.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#091833] via-transparent to-transparent pointer-events-none"></div>

                {/* Top Badge */}
                <div className="absolute top-3 left-3 z-10">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#091833] bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20 shadow-md">
                    {cat.badge}
                  </span>
                </div>

                {/* Mode & Image Count Pill */}
                <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full border backdrop-blur-md flex items-center gap-1 ${
                      cat.mode === 'projects'
                        ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                        : cat.mode === 'auto'
                        ? 'bg-blue-950/80 text-blue-300 border-blue-500/40'
                        : 'bg-indigo-950/80 text-indigo-300 border-indigo-500/40'
                    }`}
                  >
                    <Camera className="w-2.5 h-2.5" />
                    <span>
                      {activeImages.length}{' '}
                      {cat.mode === 'projects'
                        ? `${enabledSelections.length} Projs (${activeImages.length} Photos)`
                        : cat.mode === 'auto'
                        ? 'Auto 1st Photos'
                        : 'Custom Reel'}
                    </span>
                  </span>
                </div>

                {/* Quick 1-Click Upload Overlay */}
                <div className="absolute bottom-3 right-3 z-10">
                  <input
                    ref={(el) => {
                      directFileInputRefs.current[cat.id] = el;
                    }}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleDirectImageUpload(cat, e)}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => directFileInputRefs.current[cat.id]?.click()}
                    disabled={uploadingCatId === cat.id}
                    className="px-2.5 py-1 rounded-xl bg-black/75 hover:bg-black text-white text-[11px] font-bold border border-white/20 backdrop-blur-md transition-all flex items-center gap-1.5 cursor-pointer shadow-md disabled:opacity-50"
                    title="Upload more photos to this category reel"
                  >
                    {uploadingCatId === cat.id ? (
                      <>
                        <RefreshCw className="w-3 h-3 animate-spin text-[#ffc000]" />
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-3 h-3 text-[#ffc000]" />
                        <span>+ Add Image</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(cat.category)}
                      <h3 className="text-xl font-black text-white">{cat.title}</h3>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/5 text-slate-400 border border-white/5">
                      {catProjects.length} Portfolio Projects
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 space-y-1">
                    <div className="text-xs font-bold text-[#ffc000]">{cat.headline}</div>
                    <p className="text-[11px] text-slate-300 line-clamp-3 leading-relaxed">
                      {cat.description}
                    </p>
                  </div>

                  {/* Mode Info Pill */}
                  <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="truncate">
                      Mode:{' '}
                      <strong className="text-slate-200">
                        {cat.mode === 'projects'
                          ? `Custom Selection: ${enabledSelections.length} projects (${activeImages.length} photos)`
                          : cat.mode === 'auto'
                          ? `Auto-looping 1st photo of ${catProjects.length} projects`
                          : `Looping ${cat.customImages?.length || 0} custom images`}
                      </strong>
                    </span>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
                  <Link
                    href={cat.link}
                    target="_blank"
                    className="text-[11px] font-bold text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                  >
                    <span>View Link</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>

                  <button
                    onClick={() => handleOpenEdit(cat)}
                    className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-[#0b7337] text-white transition-all flex items-center gap-1.5 text-xs font-bold cursor-pointer shadow-md"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>Configure Card</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ====================================================================== */}
      {/* MODAL: CATEGORY CONFIGURATION & PROJECT PHOTO SELECTION MANAGER        */}
      {/* ====================================================================== */}
      {isModalOpen && selectedCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-fade-in">
          <div className="bg-[#091833] rounded-3xl w-full max-w-4xl max-h-[92vh] overflow-y-auto border border-white/10 text-white shadow-2xl flex flex-col justify-between">
            {/* Modal Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center">
                  {getCategoryIcon(categoryFormData.category)}
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-white">
                    Configure {categoryFormData.title} Category
                  </h3>
                  <p className="text-xs text-slate-400">
                    Select which projects to add and customize the photo count per project for the homepage slideshow.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Navigation Tabs */}
            <div className="px-6 pt-4 border-b border-white/10 flex items-center gap-2 bg-[#061021]">
              <button
                type="button"
                onClick={() => setActiveModalTab('images')}
                className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-2 ${
                  activeModalTab === 'images'
                    ? 'border-[#ffc000] text-[#ffc000] bg-white/5'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <Camera className="w-4 h-4" />
                <span>
                  Projects & Photo Selection ({getActiveImagesForCategory(categoryFormData).length} Photos)
                </span>
              </button>
              <button
                type="button"
                onClick={() => setActiveModalTab('content')}
                className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-2 ${
                  activeModalTab === 'content'
                    ? 'border-[#ffc000] text-[#ffc000] bg-white/5'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <Edit3 className="w-4 h-4" />
                <span>Card Content & Copy</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveModalTab('preview')}
                className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-2 ${
                  activeModalTab === 'preview'
                    ? 'border-[#ffc000] text-[#ffc000] bg-white/5'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <Eye className="w-4 h-4" />
                <span>Card Live Preview</span>
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveModal} className="p-6 space-y-6 flex-1">
              {/* -------------------------------------------------------------- */}
              {/* TAB 1: PROJECTS & PHOTO SELECTIONS CONTROL                     */}
              {/* -------------------------------------------------------------- */}
              {activeModalTab === 'images' && (
                <div className="space-y-6">
                  {/* Mode Selector */}
                  <div className="p-4 rounded-2xl bg-[#061021] border border-white/10 space-y-3">
                    <label className="block text-xs font-bold text-white uppercase tracking-wider">
                      Slideshow Source Mode
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {/* Mode 1: Custom Projects & Photo Counts */}
                      <button
                        type="button"
                        onClick={() => setCategoryFormData((prev) => ({ ...prev, mode: 'projects' }))}
                        className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                          categoryFormData.mode === 'projects'
                            ? 'bg-[#0b7337]/25 border-emerald-400 text-white shadow-md ring-1 ring-emerald-500/50'
                            : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-black text-white">Custom Projects & Photo Counts</span>
                          {categoryFormData.mode === 'projects' && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          )}
                        </div>
                        <p className="text-[11px] text-slate-300">
                          Pick specific projects and specify exact photos to include (e.g. UCLM = 1, Sacred Heart = 2).
                        </p>
                      </button>

                      {/* Mode 2: Auto Mode */}
                      <button
                        type="button"
                        onClick={() => setCategoryFormData((prev) => ({ ...prev, mode: 'auto' }))}
                        className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                          categoryFormData.mode === 'auto'
                            ? 'bg-blue-950/40 border-blue-400 text-white shadow-md ring-1 ring-blue-500/50'
                            : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-black text-white">Auto: 1st Project Photos</span>
                          {categoryFormData.mode === 'auto' && (
                            <CheckCircle2 className="w-4 h-4 text-blue-400" />
                          )}
                        </div>
                        <p className="text-[11px] text-slate-300">
                          Automatically loops the 1st photo of every project under {categoryFormData.category}.
                        </p>
                      </button>

                      {/* Mode 3: Custom Uploaded Reel */}
                      <button
                        type="button"
                        onClick={() => setCategoryFormData((prev) => ({ ...prev, mode: 'custom' }))}
                        className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                          categoryFormData.mode === 'custom'
                            ? 'bg-indigo-950/40 border-indigo-400 text-white shadow-md ring-1 ring-indigo-500/50'
                            : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-black text-white">Custom Uploaded Reel</span>
                          {categoryFormData.mode === 'custom' && (
                            <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                          )}
                        </div>
                        <p className="text-[11px] text-slate-300">
                          Only display custom photos directly uploaded or pasted into the list below.
                        </p>
                      </button>
                    </div>
                  </div>

                  {/* ACTIVE SUMMARY BREAKDOWN BANNER */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-emerald-950/40 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-emerald-400 uppercase tracking-wider">
                          Active Slideshow Configuration:
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-black text-xs">
                          {getActiveImagesForCategory(categoryFormData).length} Total Photos
                        </span>
                      </div>
                      <div className="text-xs text-slate-300 flex flex-wrap items-center gap-x-3 gap-y-1">
                        {categoryFormData.mode === 'projects' &&
                          (categoryFormData.projectSelections || [])
                            .filter((s) => s.enabled !== false)
                            .map((s, idx) => (
                              <span key={idx} className="inline-flex items-center gap-1 font-semibold text-white">
                                <Check className="w-3 h-3 text-emerald-400" />
                                <span>
                                  {s.projectTitle.split('-')[0].trim()}:{' '}
                                  <strong className="text-[#ffc000]">
                                    {s.selectedImages && s.selectedImages.length > 0
                                      ? s.selectedImages.length
                                      : s.photoCount}{' '}
                                    photo{((s.selectedImages?.length || s.photoCount) > 1 ? 's' : '')}
                                  </strong>
                                </span>
                              </span>
                            ))}
                        {categoryFormData.mode === 'auto' && (
                          <span className="text-slate-300">
                            Auto-looping 1st photo of {getCategoryProjects(categoryFormData.category).length} projects
                          </span>
                        )}
                        {categoryFormData.mode === 'custom' && (
                          <span className="text-slate-300">
                            Custom Upload Reel: {categoryFormData.customImages?.length || 0} images
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setActiveModalTab('preview')}
                      className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer self-start sm:self-center"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#ffc000]" />
                      <span>Preview Slideshow</span>
                    </button>
                  </div>

                  {/* PROJECT-BY-PROJECT SELECTION LIST */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <h4 className="text-sm font-black text-white flex items-center gap-2">
                          <Layers className="w-4 h-4 text-[#ffc000]" />
                          <span>Projects & Photo Count Customizer</span>
                        </h4>
                        <p className="text-xs text-slate-400">
                          Toggle which projects to include and adjust how many photos from each project to rotate in the homepage card.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setIsAddingOtherProject(!isAddingOtherProject)}
                        className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer border border-white/10"
                      >
                        <FolderPlus className="w-3.5 h-3.5 text-emerald-400" />
                        <span>+ Add Project from Other Categories</span>
                      </button>
                    </div>

                    {/* Popout Selector for Projects from Other Categories */}
                    {isAddingOtherProject && (
                      <div className="p-4 rounded-2xl bg-[#061021] border border-emerald-500/40 space-y-3 animate-fade-in">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-white uppercase tracking-wider">
                            Select Any Project to Feature in this Category Card:
                          </span>
                          <button
                            type="button"
                            onClick={() => setIsAddingOtherProject(false)}
                            className="text-slate-400 hover:text-white"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="relative">
                          <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                          <input
                            type="text"
                            value={searchProjectQuery}
                            onChange={(e) => setSearchProjectQuery(e.target.value)}
                            placeholder="Search projects by name, client, or category..."
                            className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                          />
                        </div>

                        <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
                          {projectsList
                            .filter((p) =>
                              p.title.toLowerCase().includes(searchProjectQuery.toLowerCase()) ||
                              p.client.toLowerCase().includes(searchProjectQuery.toLowerCase()) ||
                              p.category.toLowerCase().includes(searchProjectQuery.toLowerCase())
                            )
                            .map((p) => {
                              const alreadyAdded = (categoryFormData.projectSelections || []).some(
                                (s) => s.projectId === p.id
                              );
                              return (
                                <div
                                  key={p.id}
                                  className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all text-xs"
                                >
                                  <div className="min-w-0 pr-2">
                                    <div className="font-bold text-white truncate">{p.title}</div>
                                    <div className="text-[10px] text-slate-400 flex items-center gap-2">
                                      <span className="px-1.5 py-0.2 rounded bg-white/10 text-slate-300">
                                        {p.category}
                                      </span>
                                      <span>{p.images?.length || 0} Photos</span>
                                    </div>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => handleAddOtherProject(p)}
                                    disabled={alreadyAdded}
                                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                      alreadyAdded
                                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40 opacity-70 cursor-default'
                                        : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md'
                                    }`}
                                  >
                                    {alreadyAdded ? 'Added' : '+ Add'}
                                  </button>
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    )}

                    {/* PROJECT CARDS LIST */}
                    <div className="space-y-4">
                      {(categoryFormData.projectSelections || []).map((sel) => {
                        const proj = projectsList.find(
                          (p) => p.id === sel.projectId || p.title.toLowerCase() === sel.projectTitle.toLowerCase()
                        );
                        if (!proj) return null;

                        const totalProjectPhotos = proj.images?.length || 1;
                        const isEnabled = sel.enabled !== false;
                        const selectedImgs =
                          sel.selectedImages && sel.selectedImages.length > 0
                            ? sel.selectedImages
                            : proj.images
                            ? proj.images.slice(0, sel.photoCount || 1)
                            : [];

                        return (
                          <div
                            key={sel.projectId}
                            className={`p-4 rounded-2xl border transition-all ${
                              isEnabled
                                ? 'bg-[#061021] border-white/15 shadow-lg'
                                : 'bg-white/[0.02] border-white/5 opacity-60'
                            }`}
                          >
                            {/* Project Header & Controls */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
                              {/* Left Checkbox & Title */}
                              <div
                                onClick={() => handleToggleProjectEnabled(sel.projectId)}
                                className="flex items-start gap-3 cursor-pointer group/title min-w-0"
                              >
                                <div className="pt-0.5 shrink-0">
                                  {isEnabled ? (
                                    <CheckSquare className="w-5 h-5 text-emerald-400" />
                                  ) : (
                                    <Square className="w-5 h-5 text-slate-500 group-hover/title:text-white" />
                                  )}
                                </div>
                                <div className="min-w-0">
                                  <div className="text-sm font-black text-white group-hover/title:text-[#ffc000] transition-colors truncate">
                                    {proj.title}
                                  </div>
                                  <div className="text-xs text-slate-400 flex items-center gap-2">
                                    <span>{proj.location || 'Commissioned Installation'}</span>
                                    {proj.capacity && (
                                      <span className="text-[#ffc000] font-semibold">• {proj.capacity}</span>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Right Photo Count Stepper & Presets */}
                              {isEnabled && (
                                <div className="flex flex-wrap items-center gap-2 shrink-0 self-end sm:self-center">
                                  <span className="text-xs text-slate-300 font-semibold">Photos to use:</span>

                                  {/* Stepper */}
                                  <div className="flex items-center bg-white/10 rounded-xl p-0.5 border border-white/10">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleSetProjectPhotoCount(sel.projectId, (sel.photoCount || 1) - 1)
                                      }
                                      disabled={(sel.photoCount || 1) <= 1}
                                      className="p-1.5 rounded-lg hover:bg-white/20 text-slate-300 hover:text-white disabled:opacity-30 cursor-pointer"
                                      title="Decrease photo count"
                                    >
                                      <Minus className="w-3.5 h-3.5" />
                                    </button>
                                    <span className="px-2.5 text-xs font-black text-[#ffc000]">
                                      {selectedImgs.length}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleSetProjectPhotoCount(sel.projectId, (sel.photoCount || 1) + 1)
                                      }
                                      disabled={(sel.photoCount || 1) >= totalProjectPhotos}
                                      className="p-1.5 rounded-lg hover:bg-white/20 text-slate-300 hover:text-white disabled:opacity-30 cursor-pointer"
                                      title="Increase photo count"
                                    >
                                      <Plus className="w-3.5 h-3.5" />
                                    </button>
                                  </div>

                                  {/* Quick Presets */}
                                  <div className="flex items-center gap-1">
                                    <button
                                      type="button"
                                      onClick={() => handleSetProjectPhotoCount(sel.projectId, 1)}
                                      className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                                        selectedImgs.length === 1
                                          ? 'bg-emerald-600 text-white'
                                          : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                                      }`}
                                    >
                                      1 Photo
                                    </button>
                                    {totalProjectPhotos >= 2 && (
                                      <button
                                        type="button"
                                        onClick={() => handleSetProjectPhotoCount(sel.projectId, 2)}
                                        className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                                          selectedImgs.length === 2
                                            ? 'bg-emerald-600 text-white'
                                            : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                                        }`}
                                      >
                                        2 Photos
                                      </button>
                                    )}
                                    {totalProjectPhotos >= 3 && (
                                      <button
                                        type="button"
                                        onClick={() => handleSetProjectPhotoCount(sel.projectId, 3)}
                                        className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                                          selectedImgs.length === 3
                                            ? 'bg-emerald-600 text-white'
                                            : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                                        }`}
                                      >
                                        3 Photos
                                      </button>
                                    )}
                                    {totalProjectPhotos > 1 && (
                                      <button
                                        type="button"
                                        onClick={() => handleSetProjectPhotoCount(sel.projectId, totalProjectPhotos)}
                                        className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                                          selectedImgs.length === totalProjectPhotos
                                            ? 'bg-emerald-600 text-white'
                                            : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                                        }`}
                                      >
                                        All ({totalProjectPhotos})
                                      </button>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Thumbnails Strip */}
                            {isEnabled && proj.images && proj.images.length > 0 && (
                              <div className="pt-3">
                                <div className="text-[11px] text-slate-400 mb-2 flex items-center justify-between">
                                  <span>Click individual photos below to customize exact selection:</span>
                                  <span className="font-bold text-slate-300">
                                    {selectedImgs.length} of {proj.images.length} photos active
                                  </span>
                                </div>
                                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                                  {proj.images.map((imgUrl, imgIdx) => {
                                    const isPhotoSelected = selectedImgs.includes(imgUrl);
                                    const selectIndex = selectedImgs.indexOf(imgUrl);

                                    return (
                                      <div
                                        key={imgIdx}
                                        onClick={() =>
                                          handleToggleProjectSpecificImage(sel.projectId, imgUrl)
                                        }
                                        className={`relative h-20 rounded-xl overflow-hidden border transition-all cursor-pointer group/thumb ${
                                          isPhotoSelected
                                            ? 'border-emerald-400 ring-2 ring-emerald-500/60 shadow-lg'
                                            : 'border-white/10 opacity-50 hover:opacity-90'
                                        }`}
                                      >
                                        <Image src={imgUrl} alt="" fill className="object-cover" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                                        <div className="absolute top-1 left-1">
                                          <span className="px-1.5 py-0.5 rounded bg-black/70 text-[9px] font-bold text-white">
                                            #{imgIdx + 1}
                                          </span>
                                        </div>

                                        <div className="absolute top-1 right-1">
                                          {isPhotoSelected ? (
                                            <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-[10px] shadow-md">
                                              ✓
                                            </div>
                                          ) : (
                                            <div className="w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover/thumb:opacity-100">
                                              <Plus className="w-3 h-3" />
                                            </div>
                                          )}
                                        </div>

                                        {isPhotoSelected && (
                                          <div className="absolute bottom-1 left-1 right-1 text-center">
                                            <span className="px-1.5 py-0.2 rounded bg-emerald-950/90 text-emerald-300 text-[8px] font-black border border-emerald-500/40">
                                              Slide #{selectIndex + 1}
                                            </span>
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* CUSTOM UPLOADED REEL (Shown when in custom mode or as additional images) */}
                  <div className="p-4 rounded-2xl bg-[#061021] border border-white/10 space-y-4">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <div>
                        <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                          <Upload className="w-3.5 h-3.5 text-[#ffc000]" />
                          <span>Upload Standalone Custom Photos</span>
                        </h4>
                        <p className="text-[11px] text-slate-400">
                          Upload high-resolution solar project photos directly for this category.
                        </p>
                      </div>
                      <div>
                        <input
                          ref={modalFileInputRef}
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleModalImageUpload}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => modalFileInputRef.current?.click()}
                          disabled={isSaving}
                          className="px-3.5 py-1.5 rounded-xl bg-[#0b7337] hover:bg-[#0e9447] text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md disabled:opacity-50"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload Photos</span>
                        </button>
                      </div>
                    </div>

                    {categoryFormData.customImages && categoryFormData.customImages.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {categoryFormData.customImages.map((img, idx) => (
                          <div
                            key={idx}
                            className="relative h-28 rounded-xl overflow-hidden bg-black/40 border border-white/10 group/thumb"
                          >
                            <Image src={img} alt="" fill className="object-cover" />
                            <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/70 text-[9px] font-bold text-white">
                              #{idx + 1}
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveCustomImage(img)}
                              className="absolute top-1.5 right-1.5 p-1 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-all opacity-0 group-hover/thumb:opacity-100 cursor-pointer shadow-md"
                              title="Delete photo"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-5 bg-white/5 rounded-xl border border-dashed border-white/10 space-y-1">
                        <Camera className="w-5 h-5 text-slate-500 mx-auto" />
                        <div className="text-xs text-slate-400">No standalone uploaded photos</div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* -------------------------------------------------------------- */}
              {/* TAB 2: CARD CONTENT & COPY                                     */}
              {/* -------------------------------------------------------------- */}
              {activeModalTab === 'content' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        Card Title
                      </label>
                      <input
                        type="text"
                        value={categoryFormData.title}
                        onChange={(e) => setCategoryFormData((prev) => ({ ...prev, title: e.target.value }))}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#0b7337]"
                        placeholder="e.g. Commercial"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        Top Badge Text
                      </label>
                      <input
                        type="text"
                        value={categoryFormData.badge}
                        onChange={(e) => setCategoryFormData((prev) => ({ ...prev, badge: e.target.value }))}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#0b7337]"
                        placeholder="e.g. Business Solar"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Card Headline
                    </label>
                    <input
                      type="text"
                      value={categoryFormData.headline}
                      onChange={(e) => setCategoryFormData((prev) => ({ ...prev, headline: e.target.value }))}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#0b7337]"
                      placeholder="e.g. Power your business, lower your overhead."
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Card Description
                    </label>
                    <textarea
                      rows={4}
                      value={categoryFormData.description}
                      onChange={(e) => setCategoryFormData((prev) => ({ ...prev, description: e.target.value }))}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#0b7337] leading-relaxed"
                      placeholder="Describe the solar offerings for this sector..."
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Action Button Link
                    </label>
                    <input
                      type="text"
                      value={categoryFormData.link}
                      onChange={(e) => setCategoryFormData((prev) => ({ ...prev, link: e.target.value }))}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#0b7337]"
                      placeholder="/projects?category=Commercial"
                    />
                  </div>
                </div>
              )}

              {/* -------------------------------------------------------------- */}
              {/* TAB 3: LIVE PREVIEW                                            */}
              {/* -------------------------------------------------------------- */}
              {activeModalTab === 'preview' && (
                <div className="flex justify-center p-4 bg-slate-950 rounded-2xl border border-white/10">
                  <div className="w-full max-w-sm bg-white rounded-3xl p-5 border border-slate-200 text-slate-900 shadow-2xl space-y-4">
                    <div className="relative h-48 w-full rounded-2xl overflow-hidden bg-slate-900">
                      <Image
                        src={
                          getActiveImagesForCategory(categoryFormData)[0] ||
                          categoryFormData.defaultImage ||
                          '/images/placeholder.webp'
                        }
                        alt=""
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-3 left-3 bg-white/95 text-[#091833] text-[10px] font-black px-2.5 py-1 rounded-full uppercase">
                        {categoryFormData.badge}
                      </div>
                      <div className="absolute top-3 right-3 bg-black/60 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                        {getActiveImagesForCategory(categoryFormData).length} Photos in Reel
                      </div>
                    </div>

                    <h3 className="text-2xl font-black text-[#091833]">{categoryFormData.title}</h3>

                    <div className="space-y-1.5">
                      <h4 className="text-sm font-bold text-slate-900">{categoryFormData.headline}</h4>
                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-4">
                        {categoryFormData.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-100">
                      <div className="w-full py-2.5 rounded-xl text-xs font-bold bg-[#e51a24] text-white flex items-center justify-center gap-2">
                        <span>Learn more</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Modal Footer Actions */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#0b7337] via-[#0e9447] to-[#0b7337] text-white text-xs font-bold shadow-lg shadow-emerald-950/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving Changes...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Save Configuration</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
