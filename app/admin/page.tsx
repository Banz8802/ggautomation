'use client';

import React, { useState, useEffect, useMemo, useRef, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  User,
  Eye,
  EyeOff,
  LogOut,
  FolderPlus,
  Edit3,
  Trash2,
  Copy,
  ExternalLink,
  Search,
  Layers,
  Zap,
  Building2,
  MapPin,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Upload,
  X,
  Plus,
  RefreshCw,
  LayoutGrid,
  List,
  Sparkles,
  ShieldCheck,
  Globe,
  Mail,
  ChevronRight,
  TrendingUp,
  Info,
  GraduationCap,
  BookOpen,
  Waves,
  Play,
  Factory,
  Newspaper,
  Phone,
  Lock
} from 'lucide-react';

/* -------------------------------------------------------------------------- */
/* Type Definitions                                                           */
/* -------------------------------------------------------------------------- */
interface ProjectRecord {
  id: string;
  title: string;
  category: 'Residential' | 'Commercial' | 'School' | 'Industrial';
  location: string;
  capacity: string;
  client: string;
  folder?: string;
  images: string; // Comma-separated or array
  systemType: string;
  completionDate: string;
  annualYield?: string;
  co2Offset?: string;
  description?: string;
  highlights?: string[];
  tags?: string[];
}

interface TrainingRecord {
  id: string;
  title: string;
  category: string;
  badge: string;
  date: string;
  location: string;
  organizer: string;
  videoUrl?: string;
  image: string;
  gallery?: string;
  description: string;
  topics: string[];
  targetAudience?: string;
  registrationUrl?: string;
  tags: string[];
}

interface NewsRecord {
  id: string;
  title: string;
  category: string;
  date: string;
  formattedDate: string;
  authorOrHost: string;
  location: string;
  image: string;
  summary: string;
  fullContent: string[];
  highlights: string[];
  contactInfo?: {
    phone?: string;
    email?: string;
    facebookUrl?: string;
  };
  tags: string[];
}

export default function AdminPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#091833] flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <RefreshCw className="w-8 h-8 text-[#ffc000] animate-spin" />
            <span className="text-white text-sm font-semibold tracking-wider">Loading Admin Dashboard...</span>
          </div>
        </div>
      }
    >
      <AdminDashboardContent />
    </Suspense>
  );
}

function AdminDashboardContent() {
  const searchParams = useSearchParams();
  const initialTab =
    (searchParams.get('tab') as 'projects' | 'trainings' | 'news' | 'overview' | 'inquiries') || 'projects';

  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Dashboard active tab
  const [activeMenu, setActiveMenu] = useState<'projects' | 'trainings' | 'news' | 'overview' | 'inquiries'>(initialTab);

  // Sync tab with URL if param changes
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (
      tabParam === 'trainings' ||
      tabParam === 'projects' ||
      tabParam === 'news' ||
      tabParam === 'overview' ||
      tabParam === 'inquiries'
    ) {
      setActiveMenu(tabParam);
    }
  }, [searchParams]);

  // Projects state
  const [projects, setProjects] = useState<ProjectRecord[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Trainings state
  const [trainings, setTrainings] = useState<TrainingRecord[]>([]);
  const [isLoadingTrainings, setIsLoadingTrainings] = useState(false);
  const [trainingViewMode, setTrainingViewMode] = useState<'table' | 'grid'>('table');
  const [trainingSearchQuery, setTrainingSearchQuery] = useState('');
  const [selectedTrainingCategory, setSelectedTrainingCategory] = useState<string>('All');

  // News & Updates state
  const [newsList, setNewsList] = useState<NewsRecord[]>([]);
  const [isLoadingNews, setIsLoadingNews] = useState(false);
  const [newsViewMode, setNewsViewMode] = useState<'table' | 'grid'>('table');
  const [newsSearchQuery, setNewsSearchQuery] = useState('');
  const [selectedNewsCategory, setSelectedNewsCategory] = useState<string>('All');

  // Project Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [activeTabInModal, setActiveTabInModal] = useState<'general' | 'specs' | 'media' | 'content' | 'preview'>('general');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Training Modal states
  const [isTrainingModalOpen, setIsTrainingModalOpen] = useState(false);
  const [trainingModalMode, setTrainingModalMode] = useState<'create' | 'edit'>('create');
  const [activeTrainingTabInModal, setActiveTrainingTabInModal] = useState<
    'general' | 'curriculum' | 'media' | 'links' | 'preview'
  >('general');
  const [deleteTrainingConfirmId, setDeleteTrainingConfirmId] = useState<string | null>(null);
  const [isSavingTraining, setIsSavingTraining] = useState(false);
  const [isUploadingTraining, setIsUploadingTraining] = useState(false);

  // News Modal states
  const [isNewsModalOpen, setIsNewsModalOpen] = useState(false);
  const [newsModalMode, setNewsModalMode] = useState<'create' | 'edit'>('create');
  const [activeNewsTabInModal, setActiveNewsTabInModal] = useState<
    'general' | 'body' | 'highlights' | 'media' | 'preview'
  >('general');
  const [deleteNewsConfirmId, setDeleteNewsConfirmId] = useState<string | null>(null);
  const [isSavingNews, setIsSavingNews] = useState(false);
  const [isUploadingNews, setIsUploadingNews] = useState(false);

  // Global Toast
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Project Form State
  const initialProjectFormState: ProjectRecord = {
    id: '',
    title: '',
    category: 'Commercial',
    location: '',
    capacity: '',
    client: '',
    folder: '',
    images: '',
    systemType: 'On-Grid Commercial Solar PV System',
    completionDate: 'Completed & Fully Operational',
    annualYield: '',
    co2Offset: '',
    description: '',
    highlights: ['Tier-1 High-Yield Monocrystalline Modules', 'Real-Time SCADA Cloud Telemetry Dashboard'],
    tags: ['Commercial', 'Solar PV'],
  };
  const [formData, setFormData] = useState<ProjectRecord>(initialProjectFormState);
  const [highlightInput, setHighlightInput] = useState('');
  const [tagInput, setTagInput] = useState('');
  const projectFileInputRef = useRef<HTMLInputElement>(null);

  // Training Form State
  const initialTrainingFormState: TrainingRecord = {
    id: '',
    title: '',
    category: 'Specialized Track',
    badge: 'Specialized Track',
    date: 'Scheduled Batches',
    location: 'Cebu / Laguna, Philippines',
    organizer: 'GG Automation Technical Academy',
    videoUrl: '',
    image: '/images/hero-floating-solar.jpg',
    gallery: '',
    description: '',
    topics: ['Water-surface pontoon assembly', 'Anchor cable tension calculations', 'Submersible IP68 electrical protection'],
    targetAudience: 'Engineers, Developers & Electricians',
    registrationUrl: '/contact',
    tags: ['Floating Solar', 'Training', 'Workshop'],
  };
  const [trainingFormData, setTrainingFormData] = useState<TrainingRecord>(initialTrainingFormState);
  const [trainingTopicInput, setTrainingTopicInput] = useState('');
  const [trainingTagInput, setTrainingTagInput] = useState('');
  const trainingFileInputRef = useRef<HTMLInputElement>(null);

  // News Form State
  const initialNewsFormState: NewsRecord = {
    id: '',
    title: '',
    category: 'Scholarship',
    date: new Date().toISOString().split('T')[0],
    formattedDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    authorOrHost: 'GG Automation Team',
    location: 'Cebu City, Philippines',
    image: '/images/news/tesda-scholarship.png',
    summary: '',
    fullContent: [''],
    highlights: ['Comprehensive Technical Program', 'Hands-on Solar Installation Modules'],
    contactInfo: {
      phone: '0922-8129374',
      email: 'ceaapi2024@gmail.com',
    },
    tags: ['Solar Energy', 'Clean Tech', 'Philippines'],
  };
  const [newsFormData, setNewsFormData] = useState<NewsRecord>(initialNewsFormState);
  const [newsHighlightInput, setNewsHighlightInput] = useState('');
  const [newsTagInput, setNewsTagInput] = useState('');
  const [newsParagraphInput, setNewsParagraphInput] = useState('');
  const newsFileInputRef = useRef<HTMLInputElement>(null);

  // Toast helper
  const showToast = (type: 'success' | 'error', text: string) => {
    setToastMessage({ type, text });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Check auth session on mount
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated) {
            setIsAuthenticated(true);
            return;
          }
        }
      } catch {
        // Not authenticated
      }
      setIsAuthenticated(false);
    }
    checkAuth();
  }, []);

  // Fetch projects when authenticated
  const fetchProjects = async () => {
    setIsLoadingProjects(true);
    try {
      const res = await fetch('/api/projects');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.projects)) {
          setProjects(data.projects);
        }
      }
    } catch {
      showToast('error', 'Failed to load projects from database');
    } finally {
      setIsLoadingProjects(false);
    }
  };

  // Fetch trainings when authenticated
  const fetchTrainings = async () => {
    setIsLoadingTrainings(true);
    try {
      const res = await fetch('/api/trainings');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.trainings)) {
          setTrainings(data.trainings);
        }
      }
    } catch {
      showToast('error', 'Failed to load trainings from database');
    } finally {
      setIsLoadingTrainings(false);
    }
  };

  // Fetch news when authenticated
  const fetchNews = async () => {
    setIsLoadingNews(true);
    try {
      const res = await fetch('/api/news');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.news)) {
          setNewsList(data.news);
        }
      }
    } catch {
      showToast('error', 'Failed to load news & updates from database');
    } finally {
      setIsLoadingNews(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchProjects();
      fetchTrainings();
      fetchNews();
    }
  }, [isAuthenticated]);

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsAuthenticated(true);
        showToast('success', 'Welcome back, Administrator!');
      } else {
        setLoginError(data.error || 'Invalid credentials. Please verify your username and password.');
      }
    } catch {
      setLoginError('Unable to connect to login server. Please try again.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // Ignore
    }
    setIsAuthenticated(false);
    setUsername('');
    setPassword('');
  };

  /* -------------------------------------------------------------------------- */
  /* Projects CRUD Handlers                                                     */
  /* -------------------------------------------------------------------------- */
  const handleOpenCreateProject = () => {
    setModalMode('create');
    setFormData({
      ...initialProjectFormState,
      id: `project-${Date.now()}`,
    });
    setActiveTabInModal('general');
    setIsModalOpen(true);
  };

  const handleOpenEditProject = (project: ProjectRecord) => {
    setModalMode('edit');
    setFormData({
      ...project,
      highlights: project.highlights || [],
      tags: project.tags || [],
    });
    setActiveTabInModal('general');
    setIsModalOpen(true);
  };

  const handleDuplicateProject = (project: ProjectRecord) => {
    setModalMode('create');
    setFormData({
      ...project,
      id: `${project.id}-copy-${Date.now()}`,
      title: `${project.title} (Copy)`,
      highlights: project.highlights || [],
      tags: project.tags || [],
    });
    setActiveTabInModal('general');
    setIsModalOpen(true);
    showToast('success', 'Project cloned. Make adjustments and click Save.');
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showToast('error', 'Project Title is required.');
      setActiveTabInModal('general');
      return;
    }

    setIsSaving(true);
    try {
      const method = modalMode === 'create' ? 'POST' : 'PUT';
      const res = await fetch('/api/projects', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast('success', `Project successfully ${modalMode === 'create' ? 'created' : 'updated'}!`);
        setIsModalOpen(false);
        fetchProjects();
      } else {
        showToast('error', data.error || 'Failed to save project');
      }
    } catch {
      showToast('error', 'Server error while saving project');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    try {
      const res = await fetch(`/api/projects?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast('success', 'Project removed from portfolio');
        setDeleteConfirmId(null);
        fetchProjects();
      } else {
        showToast('error', data.error || 'Failed to delete project');
      }
    } catch {
      showToast('error', 'Server error while deleting project');
    }
  };

  const readFileAsDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleProjectFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      const uploadData = new FormData();
      for (let i = 0; i < files.length; i++) {
        uploadData.append('files', files[i]);
      }

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: uploadData,
      });
      const data = await res.json();
      if (res.ok && data.success && Array.isArray(data.urls) && data.urls.length > 0) {
        const newImagesStr = data.urls.join(', ');
        setFormData((prev) => ({
          ...prev,
          images: prev.images ? `${prev.images}, ${newImagesStr}` : newImagesStr,
        }));
        showToast('success', `${data.urls.length} photo(s) uploaded successfully!`);
      } else {
        // Resilient client-side fallback
        const base64List = await Promise.all(Array.from(files).map(readFileAsDataUrl));
        const newImagesStr = base64List.join(', ');
        setFormData((prev) => ({
          ...prev,
          images: prev.images ? `${prev.images}, ${newImagesStr}` : newImagesStr,
        }));
        showToast('success', `${base64List.length} photo(s) processed successfully!`);
      }
    } catch {
      try {
        const base64List = await Promise.all(Array.from(files).map(readFileAsDataUrl));
        const newImagesStr = base64List.join(', ');
        setFormData((prev) => ({
          ...prev,
          images: prev.images ? `${prev.images}, ${newImagesStr}` : newImagesStr,
        }));
        showToast('success', `${base64List.length} photo(s) processed successfully!`);
      } catch {
        showToast('error', 'Image processing error');
      }
    } finally {
      setIsUploading(false);
      if (projectFileInputRef.current) projectFileInputRef.current.value = '';
    }
  };

  const handleAddHighlight = () => {
    if (highlightInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        highlights: [...(prev.highlights || []), highlightInput.trim()],
      }));
      setHighlightInput('');
    }
  };

  const handleRemoveHighlight = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      highlights: (prev.highlights || []).filter((_, i) => i !== index),
    }));
  };

  const handleAddTag = () => {
    if (tagInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()],
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      tags: (prev.tags || []).filter((_, i) => i !== index),
    }));
  };

  /* -------------------------------------------------------------------------- */
  /* Trainings CRUD Handlers                                                    */
  /* -------------------------------------------------------------------------- */
  const handleOpenCreateTraining = () => {
    setTrainingModalMode('create');
    setTrainingFormData({
      ...initialTrainingFormState,
      id: `training-${Date.now()}`,
    });
    setActiveTrainingTabInModal('general');
    setIsTrainingModalOpen(true);
  };

  const handleOpenEditTraining = (item: TrainingRecord) => {
    setTrainingModalMode('edit');
    setTrainingFormData({
      ...item,
      topics: item.topics || [],
      tags: item.tags || [],
    });
    setActiveTrainingTabInModal('general');
    setIsTrainingModalOpen(true);
  };

  const handleDuplicateTraining = (item: TrainingRecord) => {
    setTrainingModalMode('create');
    setTrainingFormData({
      ...item,
      id: `${item.id}-copy-${Date.now()}`,
      title: `${item.title} (Copy)`,
      topics: item.topics || [],
      tags: item.tags || [],
    });
    setActiveTrainingTabInModal('general');
    setIsTrainingModalOpen(true);
    showToast('success', 'Training program cloned. Make edits and save.');
  };

  const handleSaveTraining = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trainingFormData.title.trim()) {
      showToast('error', 'Training Title is required.');
      setActiveTrainingTabInModal('general');
      return;
    }

    setIsSavingTraining(true);
    try {
      const method = trainingModalMode === 'create' ? 'POST' : 'PUT';
      const res = await fetch('/api/trainings', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(trainingFormData),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast('success', `Training program successfully ${trainingModalMode === 'create' ? 'created' : 'updated'}!`);
        setIsTrainingModalOpen(false);
        fetchTrainings();
      } else {
        showToast('error', data.error || 'Failed to save training');
      }
    } catch {
      showToast('error', 'Server error while saving training');
    } finally {
      setIsSavingTraining(false);
    }
  };

  const handleDeleteTraining = async (id: string) => {
    try {
      const res = await fetch(`/api/trainings?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast('success', 'Training removed from database');
        setDeleteTrainingConfirmId(null);
        fetchTrainings();
      } else {
        showToast('error', data.error || 'Failed to delete training');
      }
    } catch {
      showToast('error', 'Server error while deleting training');
    }
  };

  const handleTrainingFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingTraining(true);
    try {
      const uploadData = new FormData();
      for (let i = 0; i < files.length; i++) {
        uploadData.append('files', files[i]);
      }

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: uploadData,
      });
      const data = await res.json();
      if (res.ok && data.success && Array.isArray(data.urls) && data.urls.length > 0) {
        const firstUrl = data.urls[0];
        const allUrlsStr = data.urls.join(', ');
        setTrainingFormData((prev) => ({
          ...prev,
          image: firstUrl,
          gallery: prev.gallery ? `${prev.gallery}, ${allUrlsStr}` : allUrlsStr,
        }));
        showToast('success', `${data.urls.length} photo(s) uploaded successfully!`);
      } else {
        const base64List = await Promise.all(Array.from(files).map(readFileAsDataUrl));
        const firstUrl = base64List[0];
        const allUrlsStr = base64List.join(', ');
        setTrainingFormData((prev) => ({
          ...prev,
          image: firstUrl,
          gallery: prev.gallery ? `${prev.gallery}, ${allUrlsStr}` : allUrlsStr,
        }));
        showToast('success', `${base64List.length} photo(s) processed successfully!`);
      }
    } catch {
      try {
        const base64List = await Promise.all(Array.from(files).map(readFileAsDataUrl));
        const firstUrl = base64List[0];
        const allUrlsStr = base64List.join(', ');
        setTrainingFormData((prev) => ({
          ...prev,
          image: firstUrl,
          gallery: prev.gallery ? `${prev.gallery}, ${allUrlsStr}` : allUrlsStr,
        }));
        showToast('success', `${base64List.length} photo(s) processed successfully!`);
      } catch {
        showToast('error', 'Image processing error');
      }
    } finally {
      setIsUploadingTraining(false);
      if (trainingFileInputRef.current) trainingFileInputRef.current.value = '';
    }
  };

  const handleAddTrainingTopic = () => {
    if (trainingTopicInput.trim()) {
      setTrainingFormData((prev) => ({
        ...prev,
        topics: [...(prev.topics || []), trainingTopicInput.trim()],
      }));
      setTrainingTopicInput('');
    }
  };

  const handleRemoveTrainingTopic = (index: number) => {
    setTrainingFormData((prev) => ({
      ...prev,
      topics: (prev.topics || []).filter((_, i) => i !== index),
    }));
  };

  const handleAddTrainingTag = () => {
    if (trainingTagInput.trim()) {
      setTrainingFormData((prev) => ({
        ...prev,
        tags: [...(prev.tags || []), trainingTagInput.trim()],
      }));
      setTrainingTagInput('');
    }
  };

  const handleRemoveTrainingTag = (index: number) => {
    setTrainingFormData((prev) => ({
      ...prev,
      tags: (prev.tags || []).filter((_, i) => i !== index),
    }));
  };

  /* -------------------------------------------------------------------------- */
  /* News & Updates CRUD Handlers                                               */
  /* -------------------------------------------------------------------------- */
  const handleOpenCreateNews = () => {
    setNewsModalMode('create');
    setNewsFormData({
      ...initialNewsFormState,
      id: `news-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      formattedDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    });
    setActiveNewsTabInModal('general');
    setIsNewsModalOpen(true);
  };

  const handleOpenEditNews = (item: NewsRecord) => {
    setNewsModalMode('edit');
    setNewsFormData({
      ...item,
      fullContent: item.fullContent || [],
      highlights: item.highlights || [],
      tags: item.tags || [],
    });
    setActiveNewsTabInModal('general');
    setIsNewsModalOpen(true);
  };

  const handleDuplicateNews = (item: NewsRecord) => {
    setNewsModalMode('create');
    setNewsFormData({
      ...item,
      id: `${item.id}-copy-${Date.now()}`,
      title: `${item.title} (Copy)`,
      fullContent: item.fullContent || [],
      highlights: item.highlights || [],
      tags: item.tags || [],
    });
    setActiveNewsTabInModal('general');
    setIsNewsModalOpen(true);
    showToast('success', 'Article cloned. Make adjustments and click Save.');
  };

  const handleSaveNews = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsFormData.title.trim()) {
      showToast('error', 'Article Title is required.');
      setActiveNewsTabInModal('general');
      return;
    }

    setIsSavingNews(true);
    try {
      const method = newsModalMode === 'create' ? 'POST' : 'PUT';
      const res = await fetch('/api/news', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newsFormData),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast('success', `News article successfully ${newsModalMode === 'create' ? 'published' : 'updated'}!`);
        setIsNewsModalOpen(false);
        fetchNews();
      } else {
        showToast('error', data.error || 'Failed to save article');
      }
    } catch {
      showToast('error', 'Server error while saving news');
    } finally {
      setIsSavingNews(false);
    }
  };

  const handleDeleteNews = async (id: string) => {
    try {
      const res = await fetch(`/api/news?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast('success', 'News article deleted');
        setDeleteNewsConfirmId(null);
        fetchNews();
      } else {
        showToast('error', data.error || 'Failed to delete article');
      }
    } catch {
      showToast('error', 'Server error while deleting article');
    }
  };

  const handleNewsFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingNews(true);
    try {
      const uploadData = new FormData();
      for (let i = 0; i < files.length; i++) {
        uploadData.append('files', files[i]);
      }

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: uploadData,
      });
      const data = await res.json();
      if (res.ok && data.success && Array.isArray(data.urls) && data.urls.length > 0) {
        setNewsFormData((prev) => ({
          ...prev,
          image: data.urls[0],
        }));
        showToast('success', 'Article cover photo uploaded successfully!');
      } else {
        const base64List = await Promise.all(Array.from(files).map(readFileAsDataUrl));
        setNewsFormData((prev) => ({
          ...prev,
          image: base64List[0],
        }));
        showToast('success', 'Article cover photo processed successfully!');
      }
    } catch {
      try {
        const base64List = await Promise.all(Array.from(files).map(readFileAsDataUrl));
        setNewsFormData((prev) => ({
          ...prev,
          image: base64List[0],
        }));
        showToast('success', 'Article cover photo processed successfully!');
      } catch {
        showToast('error', 'Image processing error');
      }
    } finally {
      setIsUploadingNews(false);
      if (newsFileInputRef.current) newsFileInputRef.current.value = '';
    }
  };

  const handleAddNewsParagraph = () => {
    if (newsParagraphInput.trim()) {
      setNewsFormData((prev) => ({
        ...prev,
        fullContent: [...(prev.fullContent || []), newsParagraphInput.trim()],
      }));
      setNewsParagraphInput('');
    }
  };

  const handleRemoveNewsParagraph = (index: number) => {
    setNewsFormData((prev) => ({
      ...prev,
      fullContent: (prev.fullContent || []).filter((_, i) => i !== index),
    }));
  };

  const handleAddNewsHighlight = () => {
    if (newsHighlightInput.trim()) {
      setNewsFormData((prev) => ({
        ...prev,
        highlights: [...(prev.highlights || []), newsHighlightInput.trim()],
      }));
      setNewsHighlightInput('');
    }
  };

  const handleRemoveNewsHighlight = (index: number) => {
    setNewsFormData((prev) => ({
      ...prev,
      highlights: (prev.highlights || []).filter((_, i) => i !== index),
    }));
  };

  const handleAddNewsTag = () => {
    if (newsTagInput.trim()) {
      setNewsFormData((prev) => ({
        ...prev,
        tags: [...(prev.tags || []), newsTagInput.trim()],
      }));
      setNewsTagInput('');
    }
  };

  const handleRemoveNewsTag = (index: number) => {
    setNewsFormData((prev) => ({
      ...prev,
      tags: (prev.tags || []).filter((_, i) => i !== index),
    }));
  };

  /* -------------------------------------------------------------------------- */
  /* Filtered Lists & Memo Computations                                         */
  /* -------------------------------------------------------------------------- */
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        q === '' ||
        p.title.toLowerCase().includes(q) ||
        p.client.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.capacity.toLowerCase().includes(q) ||
        p.systemType.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [projects, selectedCategory, searchQuery]);

  const filteredTrainings = useMemo(() => {
    return trainings.filter((t) => {
      const matchesCategory =
        selectedTrainingCategory === 'All' ||
        t.category.toLowerCase() === selectedTrainingCategory.toLowerCase() ||
        t.badge.toLowerCase() === selectedTrainingCategory.toLowerCase();

      const q = trainingSearchQuery.toLowerCase();
      const matchesSearch =
        q === '' ||
        t.title.toLowerCase().includes(q) ||
        t.location.toLowerCase().includes(q) ||
        t.organizer.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.topics.some((tp) => tp.toLowerCase().includes(q)) ||
        t.tags.some((tg) => tg.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [trainings, selectedTrainingCategory, trainingSearchQuery]);

  const filteredNews = useMemo(() => {
    return newsList.filter((n) => {
      const matchesCategory = selectedNewsCategory === 'All' || n.category === selectedNewsCategory;
      const q = newsSearchQuery.toLowerCase();
      const matchesSearch =
        q === '' ||
        n.title.toLowerCase().includes(q) ||
        n.location.toLowerCase().includes(q) ||
        n.authorOrHost.toLowerCase().includes(q) ||
        n.summary.toLowerCase().includes(q) ||
        n.tags.some((tg) => tg.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [newsList, selectedNewsCategory, newsSearchQuery]);

  // Project Image list parser for preview
  const parsedImageList = useMemo(() => {
    if (!formData.images) return [];
    return formData.images
      .split(',')
      .map((img) => img.trim())
      .filter((img) => img.length > 0)
      .map((img) => {
        if (img.startsWith('/') || img.startsWith('http://') || img.startsWith('https://')) return img;
        if (formData.folder) return `${formData.folder.replace(/\/+$/, '')}/${img}`;
        return `/images/projects/${img}`;
      });
  }, [formData.images, formData.folder]);

  // Helper to extract first project image
  const getFirstProjectImage = (p: ProjectRecord) => {
    if (!p.images) return '/images/placeholder.webp';
    const first = p.images.split(',')[0].trim();
    if (!first) return '/images/placeholder.webp';
    if (first.startsWith('/') || first.startsWith('http://') || first.startsWith('https://')) return first;
    if (p.folder) return `${p.folder.replace(/\/+$/, '')}/${first}`;
    return `/images/projects/${first}`;
  };

  // Metrics calculations
  const metrics = useMemo(() => {
    const total = projects.length;
    const commercial = projects.filter((p) => p.category === 'Commercial').length;
    const industrial = projects.filter((p) => p.category === 'Industrial').length;
    const schools = projects.filter((p) => p.category === 'School').length;
    const residential = projects.filter((p) => p.category === 'Residential').length;
    return { total, commercial, industrial, schools, residential };
  }, [projects]);

  const trainingMetrics = useMemo(() => {
    const total = trainings.length;
    const featured = trainings.filter(
      (t) => t.category.toLowerCase().includes('featured') || t.badge.toLowerCase().includes('live demo')
    ).length;
    const specialized = trainings.filter(
      (t) => t.category.toLowerCase().includes('specialized') || t.category.toLowerCase().includes('epc')
    ).length;
    const compliance = trainings.filter(
      (t) => t.category.toLowerCase().includes('safety') || t.category.toLowerCase().includes('regulatory')
    ).length;
    return { total, featured, specialized, compliance };
  }, [trainings]);

  const newsMetrics = useMemo(() => {
    const total = newsList.length;
    const scholarships = newsList.filter((n) => n.category === 'Scholarship').length;
    const globalTours = newsList.filter((n) => n.category === 'Global Tour').length;
    const exhibitions = newsList.filter((n) => n.category === 'Exhibition' || n.category === 'Technical Seminar').length;
    return { total, scholarships, globalTours, exhibitions };
  }, [newsList]);

  // Auth Loading Screen
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#091833] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="w-8 h-8 text-[#ffc000] animate-spin" />
          <span className="text-white text-sm font-semibold tracking-wider">Verifying Admin Session...</span>
        </div>
      </div>
    );
  }

  // ============================================================================
  // 1. LOGIN SCREEN
  // ============================================================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#061021] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden selection:bg-[#e51a24] selection:text-white">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 -left-40 w-96 h-96 bg-[#0b7337]/20 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 -right-40 w-96 h-96 bg-[#e51a24]/20 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.03] pointer-events-none"></div>

        <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
          <div className="flex justify-center mb-4">
            <div className="relative p-3 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">
              <Image
                src="/images/icon-logo.png"
                alt="GG Automation Logo"
                width={54}
                height={54}
                className="w-12 h-12 object-contain"
              />
            </div>
          </div>
          <h2 className="text-center text-2xl sm:text-3xl font-black text-white tracking-tight">
            GG Automation Hub
          </h2>
          <p className="mt-1 text-center text-xs sm:text-sm text-slate-400">
            Administrative Control Center & Content Management
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0">
          <div className="bg-[#091833]/90 backdrop-blur-2xl py-8 px-6 sm:px-10 rounded-3xl border border-white/10 shadow-2xl space-y-6">
            {loginError && (
              <div className="p-3.5 rounded-xl bg-red-950/80 border border-red-500/40 text-red-200 text-xs font-semibold flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Admin Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. admin"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#0b7337] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Admin Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-10 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#0b7337] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Pre-fill Helper */}
              <div className="flex items-center justify-between text-xs pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setUsername('admin');
                    setPassword('Qwe123automation!@#');
                  }}
                  className="text-[#ffc000] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Auto-fill Admin Credentials</span>
                </button>
                <span className="text-slate-400 text-[11px]">Protected Portal</span>
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#0b7337] via-[#0e9447] to-[#0b7337] hover:from-[#095e2d] hover:to-[#095e2d] text-white font-bold text-sm shadow-xl shadow-emerald-950/40 border border-emerald-400/30 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoggingIn ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Access Admin Dashboard</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-white/10 text-center">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Return to Public Website</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // 2. MAIN ADMIN CRM DASHBOARD
  // ============================================================================
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row selection:bg-[#e51a24] selection:text-white">
      {/* Toast Notification Banner */}
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

      {/* ---------------------------------------------------------------------- */}
      {/* LEFT SIDEBAR CRM MENU                                                  */}
      {/* ---------------------------------------------------------------------- */}
      <aside className="w-full md:w-64 lg:w-72 bg-[#091833] border-r border-white/10 flex flex-col justify-between flex-shrink-0">
        <div>
          {/* Brand Header */}
          <div className="p-6 border-b border-white/10 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-white/10 p-1.5 border border-white/20 flex items-center justify-center flex-shrink-0">
              <Image
                src="/images/icon-logo.png"
                alt="GG Automation"
                width={36}
                height={36}
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="text-sm font-black text-white flex items-center gap-2">
                <span>GG Admin CRM</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              </div>
              <div className="text-[11px] text-slate-400 font-medium">Control Center</div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            <div className="px-3 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Management
            </div>

            {/* Projects Menu Item */}
            <button
              onClick={() => setActiveMenu('projects')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                activeMenu === 'projects'
                  ? 'bg-gradient-to-r from-[#0b7337] to-[#0e9447] text-white shadow-lg shadow-emerald-950/30'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <Layers className="w-4 h-4" />
                <span>Projects Portfolio</span>
              </div>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                  activeMenu === 'projects' ? 'bg-white/20 text-white' : 'bg-white/10 text-slate-300'
                }`}
              >
                {projects.length}
              </span>
            </button>

            {/* Trainings & Seminars Menu Item */}
            <button
              onClick={() => setActiveMenu('trainings')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                activeMenu === 'trainings'
                  ? 'bg-gradient-to-r from-[#0b7337] to-[#0e9447] text-white shadow-lg shadow-emerald-950/30'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <GraduationCap className="w-4 h-4" />
                <span>Trainings & Seminars</span>
              </div>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                  activeMenu === 'trainings' ? 'bg-white/20 text-white' : 'bg-white/10 text-slate-300'
                }`}
              >
                {trainings.length}
              </span>
            </button>

            {/* News & Updates Menu Item */}
            <button
              onClick={() => setActiveMenu('news')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                activeMenu === 'news'
                  ? 'bg-gradient-to-r from-[#0b7337] to-[#0e9447] text-white shadow-lg shadow-emerald-950/30'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <Newspaper className="w-4 h-4" />
                <span>News & Updates</span>
              </div>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                  activeMenu === 'news' ? 'bg-white/20 text-white' : 'bg-white/10 text-slate-300'
                }`}
              >
                {newsList.length}
              </span>
            </button>

            {/* Overview / Analytics */}
            <button
              onClick={() => setActiveMenu('overview')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                activeMenu === 'overview'
                  ? 'bg-gradient-to-r from-[#0b7337] to-[#0e9447] text-white shadow-lg'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <TrendingUp className="w-4 h-4" />
                <span>Portfolio Metrics</span>
              </div>
            </button>

            {/* Inquiries & Form Routing */}
            <button
              onClick={() => setActiveMenu('inquiries')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                activeMenu === 'inquiries'
                  ? 'bg-gradient-to-r from-[#0b7337] to-[#0e9447] text-white shadow-lg'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4" />
                <span>Form Inquiries</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#e51a24] text-white font-bold">
                jr@
              </span>
            </button>
          </nav>

          {/* Quick Links Section */}
          <div className="p-4 pt-2 space-y-1.5 border-t border-white/5">
            <div className="px-3 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Public Live Pages
            </div>

            <Link
              href="/projects"
              target="_blank"
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-[#ffc000] hover:bg-white/5 transition-all"
            >
              <div className="flex items-center gap-2.5">
                <ExternalLink className="w-3.5 h-3.5" />
                <span>View /projects Live</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            </Link>

            <Link
              href="/trainings"
              target="_blank"
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-[#ffc000] hover:bg-white/5 transition-all"
            >
              <div className="flex items-center gap-2.5">
                <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />
                <span>View /trainings Live</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            </Link>

            <Link
              href="/news-updates"
              target="_blank"
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-[#ffc000] hover:bg-white/5 transition-all"
            >
              <div className="flex items-center gap-2.5">
                <Newspaper className="w-3.5 h-3.5 text-emerald-400" />
                <span>View /news-updates Live</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            </Link>

            <Link
              href="/"
              target="_blank"
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-[#ffc000] hover:bg-white/5 transition-all"
            >
              <div className="flex items-center gap-2.5">
                <Globe className="w-3.5 h-3.5" />
                <span>Main Website</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            </Link>
          </div>
        </div>

        {/* User Card & Logout */}
        <div className="p-4 border-t border-white/10 bg-[#061021]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#0b7337] to-[#ffc000] flex items-center justify-center text-white text-xs font-black shadow-md">
                A
              </div>
              <div>
                <div className="text-xs font-bold text-white leading-tight">Admin User</div>
                <div className="text-[10px] text-emerald-400 font-medium">Logged In</div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              title="Log out"
              className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ---------------------------------------------------------------------- */}
      {/* MAIN CRM CONTENT VIEW                                                  */}
      {/* ---------------------------------------------------------------------- */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-900 overflow-y-auto">
        {/* Top App Bar */}
        <header className="px-6 py-4 bg-[#091833]/80 backdrop-blur-xl border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 z-30">
          <div>
            <div className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
              <span>Admin Hub</span>
              <ChevronRight className="w-3 h-3" />
              <span className="text-[#ffc000]">
                {activeMenu === 'projects'
                  ? 'Projects Management'
                  : activeMenu === 'trainings'
                  ? 'Trainings & Seminars CRM'
                  : activeMenu === 'news'
                  ? 'News & Announcements CRM'
                  : activeMenu === 'overview'
                  ? 'Portfolio Metrics'
                  : 'Inquiry Routing'}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {activeMenu === 'projects'
                ? 'Solar Projects CRM'
                : activeMenu === 'trainings'
                ? 'Trainings & Seminars Management'
                : activeMenu === 'news'
                ? 'News & Updates Management'
                : activeMenu === 'overview'
                ? 'Portfolio Analytics'
                : 'Form Inquiries & Leads'}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {activeMenu === 'projects' && (
              <>
                <button
                  onClick={fetchProjects}
                  title="Refresh projects"
                  disabled={isLoadingProjects}
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-bold"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingProjects ? 'animate-spin text-[#ffc000]' : ''}`} />
                  <span className="hidden sm:inline">Sync</span>
                </button>

                <Link
                  href="/projects"
                  target="_blank"
                  className="px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors flex items-center gap-2 text-xs font-bold"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-[#ffc000]" />
                  <span className="hidden sm:inline">Live Page</span>
                </Link>

                <button
                  onClick={handleOpenCreateProject}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#0b7337] via-[#0e9447] to-[#0b7337] text-white text-xs font-bold shadow-lg shadow-emerald-950/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer border border-emerald-400/30"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Project</span>
                </button>
              </>
            )}

            {activeMenu === 'trainings' && (
              <>
                <button
                  onClick={fetchTrainings}
                  title="Refresh trainings"
                  disabled={isLoadingTrainings}
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-bold"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingTrainings ? 'animate-spin text-[#ffc000]' : ''}`} />
                  <span className="hidden sm:inline">Sync</span>
                </button>

                <Link
                  href="/trainings"
                  target="_blank"
                  className="px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors flex items-center gap-2 text-xs font-bold"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-[#ffc000]" />
                  <span className="hidden sm:inline">Live Page</span>
                </Link>

                <button
                  onClick={handleOpenCreateTraining}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#0b7337] via-[#0e9447] to-[#0b7337] text-white text-xs font-bold shadow-lg shadow-emerald-950/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer border border-emerald-400/30"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Training</span>
                </button>
              </>
            )}

            {activeMenu === 'news' && (
              <>
                <button
                  onClick={fetchNews}
                  title="Refresh news"
                  disabled={isLoadingNews}
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-bold"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingNews ? 'animate-spin text-[#ffc000]' : ''}`} />
                  <span className="hidden sm:inline">Sync</span>
                </button>

                <Link
                  href="/news-updates"
                  target="_blank"
                  className="px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors flex items-center gap-2 text-xs font-bold"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-[#ffc000]" />
                  <span className="hidden sm:inline">Live Page</span>
                </Link>

                <button
                  onClick={handleOpenCreateNews}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#0b7337] via-[#0e9447] to-[#0b7337] text-white text-xs font-bold shadow-lg shadow-emerald-950/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer border border-emerald-400/30"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add News Article</span>
                </button>
              </>
            )}
          </div>
        </header>

        {/* ==================================================================== */}
        {/* PROJECTS CRM TAB                                                     */}
        {/* ==================================================================== */}
        {activeMenu === 'projects' && (
          <div className="p-6 space-y-6 max-w-7xl w-full mx-auto">
            {/* KPI Metric Summary Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-[#091833] border border-white/10 shadow-lg flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xl font-black text-white">{metrics.total}</div>
                  <div className="text-[11px] text-slate-400 font-semibold">Total Projects</div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#091833] border border-white/10 shadow-lg flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xl font-black text-white">{metrics.commercial}</div>
                  <div className="text-[11px] text-slate-400 font-semibold">Commercial</div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#091833] border border-white/10 shadow-lg flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <Factory className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xl font-black text-white">{metrics.industrial}</div>
                  <div className="text-[11px] text-slate-400 font-semibold">Industrial & Floating</div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#091833] border border-white/10 shadow-lg flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xl font-black text-white">{metrics.schools + metrics.residential}</div>
                  <div className="text-[11px] text-slate-400 font-semibold">Schools & Residential</div>
                </div>
              </div>
            </div>

            {/* Filter, Search & View Switcher Bar */}
            <div className="p-4 rounded-2xl bg-[#091833] border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
              {/* Category Pills */}
              <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
                {['All', 'Commercial', 'School', 'Industrial', 'Residential'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-[#ffc000] text-slate-950 shadow-md'
                        : 'bg-white/5 text-slate-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Search & View Controls */}
              <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search projects, client, city..."
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#ffc000] transition-colors"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Grid / Table View Switcher */}
                <div className="flex items-center bg-white/5 p-1 rounded-xl border border-white/10">
                  <button
                    onClick={() => setViewMode('table')}
                    title="Table View"
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                      viewMode === 'table' ? 'bg-white/15 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('grid')}
                    title="Grid Card View"
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                      viewMode === 'grid' ? 'bg-white/15 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Projects Table View */}
            {viewMode === 'table' ? (
              <div className="bg-[#091833] rounded-2xl border border-white/10 overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#061021] text-slate-400 uppercase tracking-wider font-bold border-b border-white/10 text-[10px]">
                      <tr>
                        <th className="py-3.5 px-4">Project</th>
                        <th className="py-3.5 px-4">Category</th>
                        <th className="py-3.5 px-4">Capacity</th>
                        <th className="py-3.5 px-4">Location</th>
                        <th className="py-3.5 px-4">Client</th>
                        <th className="py-3.5 px-4 text-center">Images</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredProjects.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-12 text-center text-slate-400">
                            No projects match your current filter.
                          </td>
                        </tr>
                      ) : (
                        filteredProjects.map((p) => {
                          const imgUrl = getFirstProjectImage(p);
                          const imgCount = p.images ? p.images.split(',').length : 0;
                          return (
                            <tr key={p.id} className="hover:bg-white/5 transition-colors group">
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-3">
                                  <div className="relative w-12 h-12 rounded-xl bg-slate-800 overflow-hidden flex-shrink-0 border border-white/10">
                                    <Image src={imgUrl} alt={p.title} fill className="object-cover" sizes="48px" />
                                  </div>
                                  <div className="min-w-0 max-w-[280px]">
                                    <div className="font-bold text-white text-xs truncate group-hover:text-[#ffc000] transition-colors">
                                      {p.title}
                                    </div>
                                    <div className="text-[10px] text-slate-400 truncate">{p.systemType}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 px-4 whitespace-nowrap">
                                <span
                                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                    p.category === 'Commercial'
                                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                      : p.category === 'Industrial'
                                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                      : p.category === 'School'
                                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                  }`}
                                >
                                  {p.category}
                                </span>
                              </td>
                              <td className="py-3 px-4 whitespace-nowrap">
                                <div className="flex items-center gap-1 font-extrabold text-[#ffc000]">
                                  <Zap className="w-3.5 h-3.5 fill-current" />
                                  <span>{p.capacity}</span>
                                </div>
                              </td>
                              <td className="py-3 px-4 text-slate-300 whitespace-nowrap">
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3 text-slate-500 flex-shrink-0" />
                                  <span className="truncate max-w-[150px]">{p.location}</span>
                                </div>
                              </td>
                              <td className="py-3 px-4 text-slate-300 whitespace-nowrap">
                                <span className="truncate max-w-[150px] block">{p.client}</span>
                              </td>
                              <td className="py-3 px-4 text-center">
                                <span className="px-2 py-0.5 rounded-full bg-white/10 text-slate-300 text-[10px] font-bold">
                                  {imgCount} photo{imgCount !== 1 ? 's' : ''}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-right whitespace-nowrap">
                                <div className="inline-flex items-center gap-1.5">
                                  <button
                                    onClick={() => handleOpenEditProject(p)}
                                    title="Edit Project"
                                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition-colors cursor-pointer"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleDuplicateProject(p)}
                                    title="Clone / Duplicate"
                                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-slate-300 hover:text-[#ffc000] transition-colors cursor-pointer"
                                  >
                                    <Copy className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => setDeleteConfirmId(p.id)}
                                    title="Delete Project"
                                    className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-slate-300 hover:text-red-400 transition-colors cursor-pointer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              /* Projects Grid View */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((p) => {
                  const imgUrl = getFirstProjectImage(p);
                  return (
                    <div
                      key={p.id}
                      className="bg-[#091833] rounded-3xl overflow-hidden border border-white/10 hover:border-[#0b7337] transition-all flex flex-col justify-between group shadow-xl"
                    >
                      <div>
                        <div className="relative h-48 w-full bg-slate-800 overflow-hidden">
                          <Image
                            src={imgUrl}
                            alt={p.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            sizes="(max-width: 768px) 100vw, 33vw"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#091833] via-transparent to-transparent"></div>
                          <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                            <span className="px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-black border border-white/10">
                              {p.category}
                            </span>
                            <div className="px-2.5 py-1 rounded-full bg-[#e51a24] text-white text-[10px] font-black flex items-center gap-1 shadow-md">
                              <Zap className="w-3 h-3 fill-current text-[#ffc000]" />
                              <span>{p.capacity}</span>
                            </div>
                          </div>
                        </div>

                        <div className="p-5 space-y-3">
                          <h3 className="text-sm font-black text-white line-clamp-2 group-hover:text-[#ffc000] transition-colors">
                            {p.title}
                          </h3>
                          <div className="space-y-1.5 text-xs text-slate-300">
                            <div className="flex items-center gap-2">
                              <Building2 className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                              <span className="truncate">{p.client}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                              <span className="truncate">{p.location}</span>
                            </div>
                          </div>
                          {p.highlights && p.highlights.length > 0 && (
                            <div className="pt-2 border-t border-white/5 flex flex-wrap gap-1.5">
                              {p.highlights.slice(0, 2).map((h, i) => (
                                <span
                                  key={i}
                                  className="text-[10px] bg-white/5 border border-white/10 px-2 py-0.5 rounded-md text-slate-300 truncate max-w-[200px]"
                                >
                                  {h}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="px-5 py-3.5 bg-[#061021] border-t border-white/10 flex items-center justify-between">
                        <span className="text-[10px] text-slate-400 font-mono">{p.id}</span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleOpenEditProject(p)}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition-colors cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDuplicateProject(p)}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-slate-300 hover:text-[#ffc000] transition-colors cursor-pointer"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(p.id)}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-slate-300 hover:text-red-400 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ==================================================================== */}
        {/* TRAININGS & SEMINARS CRM TAB                                         */}
        {/* ==================================================================== */}
        {activeMenu === 'trainings' && (
          <div className="p-6 space-y-6 max-w-7xl w-full mx-auto">
            {/* Training KPI Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-[#091833] border border-white/10 shadow-lg flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xl font-black text-white">{trainingMetrics.total}</div>
                  <div className="text-[11px] text-slate-400 font-semibold">Total Programs</div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#091833] border border-white/10 shadow-lg flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-[#ffc000]">
                  <Waves className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xl font-black text-white">{trainingMetrics.featured}</div>
                  <div className="text-[11px] text-slate-400 font-semibold">Live Demos & Milestones</div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#091833] border border-white/10 shadow-lg flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xl font-black text-white">{trainingMetrics.specialized}</div>
                  <div className="text-[11px] text-slate-400 font-semibold">Specialized & EPC Tracks</div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#091833] border border-white/10 shadow-lg flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xl font-black text-white">{trainingMetrics.compliance}</div>
                  <div className="text-[11px] text-slate-400 font-semibold">Safety & Compliance</div>
                </div>
              </div>
            </div>

            {/* Filter, Search & View Switcher Bar */}
            <div className="p-4 rounded-2xl bg-[#091833] border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
                {[
                  'All',
                  'Featured Milestone',
                  'Specialized Track',
                  'EPC Core',
                  'Safety & Compliance',
                  'Regulatory & Utility',
                  'Hands-on Workshop',
                ].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedTrainingCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      selectedTrainingCategory === cat
                        ? 'bg-[#ffc000] text-slate-950 shadow-md'
                        : 'bg-white/5 text-slate-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={trainingSearchQuery}
                    onChange={(e) => setTrainingSearchQuery(e.target.value)}
                    placeholder="Search trainings, topics, venues..."
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#ffc000] transition-colors"
                  />
                  {trainingSearchQuery && (
                    <button
                      onClick={() => setTrainingSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="flex items-center bg-white/5 p-1 rounded-xl border border-white/10">
                  <button
                    onClick={() => setTrainingViewMode('table')}
                    title="Table View"
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                      trainingViewMode === 'table' ? 'bg-white/15 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setTrainingViewMode('grid')}
                    title="Grid Card View"
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                      trainingViewMode === 'grid' ? 'bg-white/15 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Trainings Table View */}
            {trainingViewMode === 'table' ? (
              <div className="bg-[#091833] rounded-2xl border border-white/10 overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#061021] text-slate-400 uppercase tracking-wider font-bold border-b border-white/10 text-[10px]">
                      <tr>
                        <th className="py-3.5 px-4">Training Program</th>
                        <th className="py-3.5 px-4">Category & Badge</th>
                        <th className="py-3.5 px-4">Schedule / Date</th>
                        <th className="py-3.5 px-4">Venue / Location</th>
                        <th className="py-3.5 px-4">Partner / Host</th>
                        <th className="py-3.5 px-4 text-center">Video / Media</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredTrainings.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-12 text-center text-slate-400">
                            No trainings match your current filter.
                          </td>
                        </tr>
                      ) : (
                        filteredTrainings.map((t) => (
                          <tr key={t.id} className="hover:bg-white/5 transition-colors group">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <div className="relative w-12 h-12 rounded-xl bg-slate-800 overflow-hidden flex-shrink-0 border border-white/10">
                                  <Image
                                    src={t.image || '/images/hero-floating-solar.jpg'}
                                    alt={t.title}
                                    fill
                                    className="object-cover"
                                    sizes="48px"
                                  />
                                </div>
                                <div className="min-w-0 max-w-[280px]">
                                  <div className="font-bold text-white text-xs truncate group-hover:text-[#ffc000] transition-colors">
                                    {t.title}
                                  </div>
                                  <div className="text-[10px] text-slate-400 truncate">{t.targetAudience}</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4 whitespace-nowrap">
                              <div className="flex flex-col gap-1">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 w-max">
                                  {t.badge}
                                </span>
                                <span className="text-[10px] text-slate-400">{t.category}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4 whitespace-nowrap">
                              <div className="flex items-center gap-1.5 text-slate-200">
                                <Calendar className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                                <span>{t.date}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-slate-300 whitespace-nowrap">
                              <div className="flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-[#e51a24] flex-shrink-0" />
                                <span className="truncate max-w-[150px]">{t.location}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-slate-300 whitespace-nowrap">
                              <span className="truncate max-w-[150px] block">{t.organizer}</span>
                            </td>
                            <td className="py-3 px-4 text-center">
                              {t.videoUrl ? (
                                <a
                                  href={t.videoUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-[11px] font-bold text-[#1877F2] hover:underline"
                                >
                                  <Play className="w-3 h-3 fill-current" />
                                  <span>Video</span>
                                </a>
                              ) : (
                                <span className="text-slate-500 text-[10px]">Photo Only</span>
                              )}
                            </td>
                            <td className="py-3 px-4 text-right whitespace-nowrap">
                              <div className="inline-flex items-center gap-1.5">
                                <button
                                  onClick={() => handleOpenEditTraining(t)}
                                  title="Edit Training"
                                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition-colors cursor-pointer"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDuplicateTraining(t)}
                                  title="Clone / Duplicate"
                                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-slate-300 hover:text-[#ffc000] transition-colors cursor-pointer"
                                >
                                  <Copy className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => setDeleteTrainingConfirmId(t.id)}
                                  title="Delete Training"
                                  className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-slate-300 hover:text-red-400 transition-colors cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              /* Trainings Grid View */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTrainings.map((t) => (
                  <div
                    key={t.id}
                    className="bg-[#091833] rounded-3xl overflow-hidden border border-white/10 hover:border-[#0b7337] transition-all flex flex-col justify-between group shadow-xl"
                  >
                    <div>
                      <div className="relative h-48 w-full bg-slate-800 overflow-hidden">
                        <Image
                          src={t.image || '/images/hero-floating-solar.jpg'}
                          alt={t.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#091833] via-transparent to-transparent"></div>
                        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                          <span className="px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-[#ffc000] text-[10px] font-black border border-white/10">
                            {t.badge}
                          </span>
                          <span className="px-2.5 py-1 rounded-full bg-cyan-600/90 text-white text-[10px] font-black">
                            {t.category}
                          </span>
                        </div>
                      </div>

                      <div className="p-5 space-y-3">
                        <h3 className="text-sm font-black text-white line-clamp-2 group-hover:text-[#ffc000] transition-colors">
                          {t.title}
                        </h3>
                        <div className="space-y-1.5 text-xs text-slate-300">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                            <span className="truncate">{t.date}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5 text-[#e51a24] flex-shrink-0" />
                            <span className="truncate">{t.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <GraduationCap className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                            <span className="truncate">{t.organizer}</span>
                          </div>
                        </div>
                        {t.topics && t.topics.length > 0 && (
                          <div className="pt-2 border-t border-white/5 space-y-1">
                            {t.topics.slice(0, 2).map((tp, idx) => (
                              <div key={idx} className="flex items-center gap-1.5 text-[11px] text-slate-300">
                                <CheckCircle2 className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                                <span className="truncate">{tp}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="px-5 py-3.5 bg-[#061021] border-t border-white/10 flex items-center justify-between">
                      <span className="text-[10px] text-slate-400 font-mono">{t.id}</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleOpenEditTraining(t)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition-colors cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDuplicateTraining(t)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-slate-300 hover:text-[#ffc000] transition-colors cursor-pointer"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteTrainingConfirmId(t.id)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-slate-300 hover:text-red-400 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ==================================================================== */}
        {/* NEWS & UPDATES CRM TAB                                               */}
        {/* ==================================================================== */}
        {activeMenu === 'news' && (
          <div className="p-6 space-y-6 max-w-7xl w-full mx-auto">
            {/* News KPI Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-[#091833] border border-white/10 shadow-lg flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Newspaper className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xl font-black text-white">{newsMetrics.total}</div>
                  <div className="text-[11px] text-slate-400 font-semibold">Total Articles</div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#091833] border border-white/10 shadow-lg flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xl font-black text-white">{newsMetrics.scholarships}</div>
                  <div className="text-[11px] text-slate-400 font-semibold">Scholarship Updates</div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#091833] border border-white/10 shadow-lg flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xl font-black text-white">{newsMetrics.globalTours}</div>
                  <div className="text-[11px] text-slate-400 font-semibold">Global R&D Tours</div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#091833] border border-white/10 shadow-lg flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xl font-black text-white">{newsMetrics.exhibitions}</div>
                  <div className="text-[11px] text-slate-400 font-semibold">Exhibitions & Seminars</div>
                </div>
              </div>
            </div>

            {/* Filter, Search & View Switcher Bar */}
            <div className="p-4 rounded-2xl bg-[#091833] border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
                {['All', 'Scholarship', 'Global Tour', 'Exhibition', 'Technical Seminar'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedNewsCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      selectedNewsCategory === cat
                        ? 'bg-[#ffc000] text-slate-950 shadow-md'
                        : 'bg-white/5 text-slate-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={newsSearchQuery}
                    onChange={(e) => setNewsSearchQuery(e.target.value)}
                    placeholder="Search news, topics, partners..."
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#ffc000] transition-colors"
                  />
                  {newsSearchQuery && (
                    <button
                      onClick={() => setNewsSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="flex items-center bg-white/5 p-1 rounded-xl border border-white/10">
                  <button
                    onClick={() => setNewsViewMode('table')}
                    title="Table View"
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                      newsViewMode === 'table' ? 'bg-white/15 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setNewsViewMode('grid')}
                    title="Grid Card View"
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                      newsViewMode === 'grid' ? 'bg-white/15 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* News Table View */}
            {newsViewMode === 'table' ? (
              <div className="bg-[#091833] rounded-2xl border border-white/10 overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#061021] text-slate-400 uppercase tracking-wider font-bold border-b border-white/10 text-[10px]">
                      <tr>
                        <th className="py-3.5 px-4">Article Title</th>
                        <th className="py-3.5 px-4">Category</th>
                        <th className="py-3.5 px-4">Date</th>
                        <th className="py-3.5 px-4">Venue / Location</th>
                        <th className="py-3.5 px-4">Author / Host</th>
                        <th className="py-3.5 px-4 text-center">Highlights</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredNews.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-12 text-center text-slate-400">
                            No news articles match your filter.
                          </td>
                        </tr>
                      ) : (
                        filteredNews.map((n) => (
                          <tr key={n.id} className="hover:bg-white/5 transition-colors group">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <div className="relative w-12 h-12 rounded-xl bg-slate-800 overflow-hidden flex-shrink-0 border border-white/10">
                                  <Image
                                    src={n.image || '/images/hero-solar-engineering.webp'}
                                    alt={n.title}
                                    fill
                                    className="object-cover"
                                    sizes="48px"
                                  />
                                </div>
                                <div className="min-w-0 max-w-[280px]">
                                  <div className="font-bold text-white text-xs truncate group-hover:text-[#ffc000] transition-colors">
                                    {n.title}
                                  </div>
                                  <div className="text-[10px] text-slate-400 truncate">{n.summary}</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4 whitespace-nowrap">
                              <span
                                className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                  n.category === 'Scholarship'
                                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                    : n.category === 'Global Tour'
                                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                                    : n.category === 'Exhibition'
                                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                }`}
                              >
                                {n.category}
                              </span>
                            </td>
                            <td className="py-3 px-4 whitespace-nowrap">
                              <div className="flex items-center gap-1.5 text-slate-200">
                                <Calendar className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                                <span>{n.formattedDate || n.date}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-slate-300 whitespace-nowrap">
                              <div className="flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-[#e51a24] flex-shrink-0" />
                                <span className="truncate max-w-[150px]">{n.location}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-slate-300 whitespace-nowrap">
                              <span className="truncate max-w-[150px] block">{n.authorOrHost}</span>
                            </td>
                            <td className="py-3 px-4 text-center">
                              <span className="px-2 py-0.5 rounded-full bg-white/10 text-slate-300 text-[10px] font-bold">
                                {(n.highlights || []).length} point{(n.highlights || []).length !== 1 ? 's' : ''}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right whitespace-nowrap">
                              <div className="inline-flex items-center gap-1.5">
                                <button
                                  onClick={() => handleOpenEditNews(n)}
                                  title="Edit Article"
                                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition-colors cursor-pointer"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDuplicateNews(n)}
                                  title="Clone / Duplicate"
                                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-slate-300 hover:text-[#ffc000] transition-colors cursor-pointer"
                                >
                                  <Copy className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => setDeleteNewsConfirmId(n.id)}
                                  title="Delete Article"
                                  className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-slate-300 hover:text-red-400 transition-colors cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              /* News Grid View */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredNews.map((n) => (
                  <div
                    key={n.id}
                    className="bg-[#091833] rounded-3xl overflow-hidden border border-white/10 hover:border-[#0b7337] transition-all flex flex-col justify-between group shadow-xl"
                  >
                    <div>
                      <div className="relative h-48 w-full bg-slate-800 overflow-hidden">
                        <Image
                          src={n.image || '/images/hero-solar-engineering.webp'}
                          alt={n.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#091833] via-transparent to-transparent"></div>
                        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                          <span className="px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-[#ffc000] text-[10px] font-black border border-white/10">
                            {n.category}
                          </span>
                          <span className="px-2.5 py-1 rounded-full bg-emerald-600/90 text-white text-[10px] font-black">
                            {n.formattedDate || n.date}
                          </span>
                        </div>
                      </div>

                      <div className="p-5 space-y-3">
                        <h3 className="text-sm font-black text-white line-clamp-2 group-hover:text-[#ffc000] transition-colors">
                          {n.title}
                        </h3>
                        <p className="text-xs text-slate-400 line-clamp-2">{n.summary}</p>
                        <div className="space-y-1.5 text-xs text-slate-300 pt-1 border-t border-white/5">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5 text-[#e51a24] flex-shrink-0" />
                            <span className="truncate">{n.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <User className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                            <span className="truncate">{n.authorOrHost}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="px-5 py-3.5 bg-[#061021] border-t border-white/10 flex items-center justify-between">
                      <span className="text-[10px] text-slate-400 font-mono">{n.id}</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleOpenEditNews(n)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition-colors cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDuplicateNews(n)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-slate-300 hover:text-[#ffc000] transition-colors cursor-pointer"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteNewsConfirmId(n.id)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-slate-300 hover:text-red-400 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ==================================================================== */}
        {/* OVERVIEW / METRICS TAB                                               */}
        {/* ==================================================================== */}
        {activeMenu === 'overview' && (
          <div className="p-6 space-y-6 max-w-5xl w-full mx-auto">
            <div className="p-6 rounded-3xl bg-[#091833] border border-white/10 space-y-6">
              <div>
                <h2 className="text-lg font-black text-white">Engineering Portfolio Summary</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Active stats and installation metrics synced across the GG Automation website.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-[#061021] border border-white/10">
                  <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Projects</div>
                  <div className="text-3xl font-black text-[#ffc000] mt-2">{metrics.total}</div>
                  <div className="text-[11px] text-emerald-400 mt-1">Across 4 Sectors</div>
                </div>

                <div className="p-5 rounded-2xl bg-[#061021] border border-white/10">
                  <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Commercial</div>
                  <div className="text-3xl font-black text-white mt-2">{metrics.commercial}</div>
                  <div className="text-[11px] text-slate-400 mt-1">Hypermarkets & Malls</div>
                </div>

                <div className="p-5 rounded-2xl bg-[#061021] border border-white/10">
                  <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Trainings</div>
                  <div className="text-3xl font-black text-cyan-400 mt-2">{trainings.length}</div>
                  <div className="text-[11px] text-slate-400 mt-1">Workshops & Demos</div>
                </div>

                <div className="p-5 rounded-2xl bg-[#061021] border border-white/10">
                  <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">News Updates</div>
                  <div className="text-3xl font-black text-emerald-400 mt-2">{newsList.length}</div>
                  <div className="text-[11px] text-slate-400 mt-1">Articles & Posts</div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3">
                <Info className="w-5 h-5 text-[#ffc000] flex-shrink-0 mt-0.5" />
                <div className="text-xs text-slate-300 space-y-1">
                  <span className="font-bold text-white">Direct Synchronization Note:</span>
                  <p>
                    All project, training, and news records added or edited in this CRM immediately update the public{' '}
                    <code className="text-[#ffc000] font-mono">/projects</code>,{' '}
                    <code className="text-cyan-400 font-mono">/trainings</code>, and{' '}
                    <code className="text-emerald-400 font-mono">/news-updates</code> pages.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* INQUIRIES & FORM ROUTING TAB                                         */}
        {/* ==================================================================== */}
        {activeMenu === 'inquiries' && (
          <div className="p-6 space-y-6 max-w-5xl w-full mx-auto">
            <div className="p-6 rounded-3xl bg-[#091833] border border-white/10 space-y-6">
              <div>
                <h2 className="text-lg font-black text-white">Lead Generation & Email Routing</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Status of form submissions and instant consultation lead dispatch.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#061021] border border-emerald-500/30 space-y-3">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-black uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Configured Target Mailbox</span>
                </div>
                <div className="text-2xl font-black text-white tracking-tight">jr@ggautomation.tech</div>
                <p className="text-xs text-slate-400">
                  All customer submissions from the Contact Page, Solar Quote Calculator, Training Requests, and Emergency Inquiries are dispatched directly to this email address.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ---------------------------------------------------------------------- */}
      {/* ADD / EDIT PROJECT MODAL DIALOG                                        */}
      {/* ---------------------------------------------------------------------- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in">
          <div className="bg-[#091833] text-white rounded-3xl border border-white/20 shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden">
            <div className="px-6 py-4 bg-[#061021] border-b border-white/10 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#0b7337] flex items-center justify-center text-white">
                  {modalMode === 'create' ? <FolderPlus className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-black text-white">
                    {modalMode === 'create' ? 'Add New Solar Project' : 'Edit Project Specifications'}
                  </h2>
                  <div className="text-[11px] text-slate-400">
                    Safe CRM editor — formatted automatically to prevent broken tags
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-red-500 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-6 py-2 bg-[#08152e] border-b border-white/10 flex items-center gap-2 overflow-x-auto flex-shrink-0 text-xs font-bold">
              {[
                { id: 'general', label: '1. Basic Info' },
                { id: 'specs', label: '2. Technical Specs' },
                { id: 'media', label: '3. Photos & Media' },
                { id: 'content', label: '4. Highlights & Tags' },
                { id: 'preview', label: '5. Live Preview' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTabInModal(tab.id as typeof activeTabInModal)}
                  className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                    activeTabInModal === tab.id
                      ? 'bg-[#0b7337] text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <form onSubmit={handleSaveProject} className="flex-1 overflow-y-auto p-6 space-y-6">
              {activeTabInModal === 'general' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Project Title <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Super Metro - Toledo City, Cebu"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white text-sm focus:outline-none focus:border-[#ffc000] transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        Category <span className="text-red-400">*</span>
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            category: e.target.value as ProjectRecord['category'],
                          })
                        }
                        className="w-full px-4 py-3 rounded-xl bg-[#091833] border border-white/15 text-white text-sm focus:outline-none focus:border-[#ffc000] transition-colors cursor-pointer"
                      >
                        <option value="Commercial">Commercial</option>
                        <option value="Industrial">Industrial</option>
                        <option value="School">School & University</option>
                        <option value="Residential">Residential</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        Client / Organization Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Metro Retail Stores Group Inc."
                        value={formData.client}
                        onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white text-sm focus:outline-none focus:border-[#ffc000] transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        Location / City
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Toledo City, Cebu"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white text-sm focus:outline-none focus:border-[#ffc000] transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        Unique Slug ID (Auto-generated if empty)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. super-metro-toledo"
                        value={formData.id}
                        onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white text-sm focus:outline-none focus:border-[#ffc000] transition-colors font-mono text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTabInModal === 'specs' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        System Solar Capacity <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 214 kWp or 100+ kWp"
                        value={formData.capacity}
                        onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white text-sm focus:outline-none focus:border-[#ffc000] transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        System Architecture Type
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. On-Grid Commercial Solar PV System"
                        value={formData.systemType}
                        onChange={(e) => setFormData({ ...formData, systemType: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white text-sm focus:outline-none focus:border-[#ffc000] transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        Annual Energy Yield
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 310,000+ kWh / Year"
                        value={formData.annualYield}
                        onChange={(e) => setFormData({ ...formData, annualYield: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white text-sm focus:outline-none focus:border-[#ffc000] transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        Estimated CO2 Offset
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 217 Tons / Year"
                        value={formData.co2Offset}
                        onChange={(e) => setFormData({ ...formData, co2Offset: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white text-sm focus:outline-none focus:border-[#ffc000] transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        Completion Status / Date
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Completed & Fully Operational"
                        value={formData.completionDate}
                        onChange={(e) => setFormData({ ...formData, completionDate: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white text-sm focus:outline-none focus:border-[#ffc000] transition-colors"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTabInModal === 'media' && (
                <div className="space-y-5">
                  <div className="p-6 rounded-2xl bg-white/5 border-2 border-dashed border-white/20 hover:border-[#ffc000] transition-colors text-center">
                    <input
                      type="file"
                      ref={projectFileInputRef}
                      multiple
                      accept="image/*"
                      onChange={handleProjectFileUpload}
                      className="hidden"
                      id="project-photo-upload"
                    />
                    <label
                      htmlFor="project-photo-upload"
                      className="cursor-pointer flex flex-col items-center justify-center space-y-2"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-[#ffc000]">
                        <Upload className="w-6 h-6" />
                      </div>
                      <div className="text-xs font-bold text-white">Click here to upload project photos directly</div>
                      <div className="text-[11px] text-slate-400">
                        Supports WebP, PNG, JPG — automatically saved to project uploads folder
                      </div>
                    </label>
                    {isUploading && (
                      <div className="mt-3 text-xs text-[#ffc000] font-bold flex items-center justify-center gap-2">
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Uploading files...</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        Image File Names or URLs (Comma-separated)
                      </label>
                      <textarea
                        rows={2}
                        placeholder="e.g. gc-img-01.webp, gc-img-02.webp OR /images/projects/uploads/sample.jpg"
                        value={formData.images}
                        onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white text-xs font-mono focus:outline-none focus:border-[#ffc000] transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        Base Project Folder (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. /images/projects/commercial/Super Metro - Toledo City, Cebu"
                        value={formData.folder || ''}
                        onChange={(e) => setFormData({ ...formData, folder: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white text-xs font-mono focus:outline-none focus:border-[#ffc000] transition-colors"
                      />
                    </div>
                  </div>

                  {parsedImageList.length > 0 && (
                    <div className="space-y-2 pt-2">
                      <div className="text-xs font-bold text-slate-300">
                        Current Attached Photos ({parsedImageList.length})
                      </div>
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                        {parsedImageList.map((url, idx) => (
                          <div
                            key={idx}
                            className="relative h-20 rounded-xl overflow-hidden bg-slate-800 border border-white/15 group"
                          >
                            <Image src={url} alt={`Photo ${idx + 1}`} fill className="object-cover" />
                            <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = parsedImageList.filter((_, i) => i !== idx).join(', ');
                                  setFormData({ ...formData, images: updated });
                                }}
                                className="p-1 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTabInModal === 'content' && (
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Full Project Description
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Comprehensive engineering overview..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-[#ffc000] transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Key Engineering Highlights
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="e.g. Net-Metering Distribution Utility Synchronized"
                        value={highlightInput}
                        onChange={(e) => setHighlightInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddHighlight();
                          }
                        }}
                        className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-[#ffc000]"
                      />
                      <button
                        type="button"
                        onClick={handleAddHighlight}
                        className="px-4 py-2.5 rounded-xl bg-[#0b7337] hover:bg-[#0e9447] text-white text-xs font-bold cursor-pointer transition-colors"
                      >
                        Add
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-1">
                      {(formData.highlights || []).map((h, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 text-white text-xs border border-white/10"
                        >
                          <span>{h}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveHighlight(idx)}
                            className="text-slate-400 hover:text-red-400 cursor-pointer"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-white/5">
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Search Tags & Keywords
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="e.g. Cebu, On-Grid, Super Metro"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddTag();
                          }
                        }}
                        className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-[#ffc000]"
                      />
                      <button
                        type="button"
                        onClick={handleAddTag}
                        className="px-4 py-2.5 rounded-xl bg-[#0b7337] hover:bg-[#0e9447] text-white text-xs font-bold cursor-pointer transition-colors"
                      >
                        Add Tag
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-1">
                      {(formData.tags || []).map((t, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#ffc000]/15 text-[#ffc000] text-xs font-bold border border-[#ffc000]/30"
                        >
                          <span>#{t}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(idx)}
                            className="text-slate-400 hover:text-red-400 cursor-pointer ml-1"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTabInModal === 'preview' && (
                <div className="space-y-4">
                  <div className="text-xs text-slate-400">
                    Live simulation of how this project card will appear on the public{' '}
                    <code className="text-[#ffc000]">/projects</code> portfolio:
                  </div>

                  <div className="max-w-md mx-auto bg-white text-slate-900 rounded-3xl overflow-hidden border border-slate-200 shadow-2xl flex flex-col justify-between">
                    <div>
                      <div className="relative h-60 w-full bg-slate-900">
                        <Image
                          src={parsedImageList[0] || '/images/placeholder.webp'}
                          alt={formData.title}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                          <span className="bg-white/95 text-[#091833] text-[11px] font-black px-3 py-1 rounded-full shadow-md">
                            {formData.category}
                          </span>
                          <div className="bg-[#e51a24] text-white text-xs font-black px-3 py-1 rounded-full shadow-lg flex items-center gap-1.5">
                            <Zap className="w-3.5 h-3.5 fill-current text-[#ffc000]" />
                            <span>{formData.capacity || 'Custom kWp'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-6 space-y-3">
                        <h3 className="text-base font-black text-[#091833]">{formData.title || 'Untitled Project'}</h3>
                        <div className="text-xs text-slate-600 flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[#0b7337]" />
                          <span>{formData.location || 'Philippines'}</span>
                        </div>
                        <p className="text-xs text-slate-600 line-clamp-2">
                          {formData.description || 'Turnkey engineered solar installation.'}
                        </p>
                      </div>
                    </div>

                    <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#0b7337]">
                      <span>View Gallery & Specs</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              )}
            </form>

            <div className="px-6 py-4 bg-[#061021] border-t border-white/10 flex items-center justify-between flex-shrink-0">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 hover:text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSaveProject}
                disabled={isSaving}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#0b7337] via-[#0e9447] to-[#0b7337] text-white text-xs font-bold shadow-lg shadow-emerald-950/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer border border-emerald-400/30 disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Saving Project...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{modalMode === 'create' ? 'Publish Project' : 'Save Changes'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------------------- */}
      {/* ADD / EDIT TRAINING MODAL DIALOG                                       */}
      {/* ---------------------------------------------------------------------- */}
      {isTrainingModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in">
          <div className="bg-[#091833] text-white rounded-3xl border border-white/20 shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden">
            <div className="px-6 py-4 bg-[#061021] border-b border-white/10 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-cyan-600 flex items-center justify-center text-white">
                  {trainingModalMode === 'create' ? <GraduationCap className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-black text-white">
                    {trainingModalMode === 'create' ? 'Add New Training / Workshop' : 'Edit Training Program'}
                  </h2>
                  <div className="text-[11px] text-slate-400">
                    Live updates to <code className="text-cyan-400">/trainings</code> technical syllabus and featured milestones
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsTrainingModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-red-500 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-6 py-2 bg-[#08152e] border-b border-white/10 flex items-center gap-2 overflow-x-auto flex-shrink-0 text-xs font-bold">
              {[
                { id: 'general', label: '1. Basic Info' },
                { id: 'curriculum', label: '2. Curriculum & Topics' },
                { id: 'media', label: '3. Photos & Video' },
                { id: 'links', label: '4. Registration & Tags' },
                { id: 'preview', label: '5. Live Preview' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTrainingTabInModal(tab.id as typeof activeTrainingTabInModal)}
                  className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                    activeTrainingTabInModal === tab.id
                      ? 'bg-cyan-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <form onSubmit={handleSaveTraining} className="flex-1 overflow-y-auto p-6 space-y-6">
              {activeTrainingTabInModal === 'general' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Training / Seminar Title <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Floating Solar PV Installation Techniques & Material Optimization"
                      value={trainingFormData.title}
                      onChange={(e) => setTrainingFormData({ ...trainingFormData, title: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white text-sm focus:outline-none focus:border-[#ffc000] transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        Category / Track <span className="text-red-400">*</span>
                      </label>
                      <select
                        value={trainingFormData.category}
                        onChange={(e) =>
                          setTrainingFormData({
                            ...trainingFormData,
                            category: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 rounded-xl bg-[#091833] border border-white/15 text-white text-sm focus:outline-none focus:border-[#ffc000] transition-colors cursor-pointer"
                      >
                        <option value="Featured Milestone">Featured Milestone</option>
                        <option value="Specialized Track">Specialized Track</option>
                        <option value="EPC Core">EPC Core</option>
                        <option value="Safety & Compliance">Safety & Compliance</option>
                        <option value="Regulatory & Utility">Regulatory & Utility</option>
                        <option value="Hands-on Workshop">Hands-on Workshop</option>
                        <option value="Other">Other Category</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        Display Badge Text
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Live Demo & Seminar or Specialized Track"
                        value={trainingFormData.badge}
                        onChange={(e) => setTrainingFormData({ ...trainingFormData, badge: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white text-sm focus:outline-none focus:border-[#ffc000] transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        Date / Batch Schedule
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. August 15, 2025 or Monthly Scheduled Batches"
                        value={trainingFormData.date}
                        onChange={(e) => setTrainingFormData({ ...trainingFormData, date: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white text-sm focus:outline-none focus:border-[#ffc000] transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        Venue / Location
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Chandava Lake Resort, Cavinti, Laguna"
                        value={trainingFormData.location}
                        onChange={(e) => setTrainingFormData({ ...trainingFormData, location: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white text-sm focus:outline-none focus:border-[#ffc000] transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        Organizer / Collaboration Partner
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Power Ai Philippines & GG Automation"
                        value={trainingFormData.organizer}
                        onChange={(e) => setTrainingFormData({ ...trainingFormData, organizer: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white text-sm focus:outline-none focus:border-[#ffc000] transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        Slug ID (Auto-generated if empty)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. floating-solar-cavinti-2025"
                        value={trainingFormData.id}
                        onChange={(e) => setTrainingFormData({ ...trainingFormData, id: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white text-sm focus:outline-none focus:border-[#ffc000] transition-colors font-mono text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTrainingTabInModal === 'curriculum' && (
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Training Overview & Description
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Comprehensive overview of learning objectives..."
                      value={trainingFormData.description}
                      onChange={(e) => setTrainingFormData({ ...trainingFormData, description: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-[#ffc000] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Target Audience / Eligibility
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Available for Corporate & Academic Groups"
                      value={trainingFormData.targetAudience || ''}
                      onChange={(e) => setTrainingFormData({ ...trainingFormData, targetAudience: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white text-sm focus:outline-none focus:border-[#ffc000] transition-colors"
                    />
                  </div>

                  <div className="space-y-2 pt-2 border-t border-white/5">
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Core Topics / Modules Covered
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="e.g. Water-surface pontoon assembly"
                        value={trainingTopicInput}
                        onChange={(e) => setTrainingTopicInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddTrainingTopic();
                          }
                        }}
                        className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-[#ffc000]"
                      />
                      <button
                        type="button"
                        onClick={handleAddTrainingTopic}
                        className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold cursor-pointer transition-colors"
                      >
                        Add Topic
                      </button>
                    </div>

                    <div className="space-y-1.5 pt-2">
                      {(trainingFormData.topics || []).map((t, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white"
                        >
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                            <span>{t}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveTrainingTopic(idx)}
                            className="text-slate-400 hover:text-red-400 p-1 cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTrainingTabInModal === 'media' && (
                <div className="space-y-5">
                  <div className="p-6 rounded-2xl bg-white/5 border-2 border-dashed border-white/20 hover:border-cyan-400 transition-colors text-center">
                    <input
                      type="file"
                      ref={trainingFileInputRef}
                      multiple
                      accept="image/*"
                      onChange={handleTrainingFileUpload}
                      className="hidden"
                      id="training-photo-upload"
                    />
                    <label
                      htmlFor="training-photo-upload"
                      className="cursor-pointer flex flex-col items-center justify-center space-y-2"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-cyan-400">
                        <Upload className="w-6 h-6" />
                      </div>
                      <div className="text-xs font-bold text-white">Click here to upload training photos</div>
                      <div className="text-[11px] text-slate-400">Supports WebP, PNG, JPG</div>
                    </label>
                    {isUploadingTraining && (
                      <div className="mt-3 text-xs text-cyan-400 font-bold flex items-center justify-center gap-2">
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Uploading files...</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        Cover Image Path or URL
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. /images/hero-floating-solar.jpg"
                        value={trainingFormData.image}
                        onChange={(e) => setTrainingFormData({ ...trainingFormData, image: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white text-xs font-mono focus:outline-none focus:border-cyan-400 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        Facebook / YouTube Video Watch URL (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. https://www.facebook.com/watch/?v=764063712674607"
                        value={trainingFormData.videoUrl || ''}
                        onChange={(e) => setTrainingFormData({ ...trainingFormData, videoUrl: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white text-xs font-mono focus:outline-none focus:border-[#1877F2] transition-colors"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTrainingTabInModal === 'links' && (
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Registration / Syllabus Link
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. /contact"
                      value={trainingFormData.registrationUrl || '/contact'}
                      onChange={(e) => setTrainingFormData({ ...trainingFormData, registrationUrl: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white text-xs font-mono focus:outline-none focus:border-cyan-400 transition-colors"
                    />
                  </div>

                  <div className="space-y-2 pt-2 border-t border-white/5">
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Search Tags & Keywords
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="e.g. Floating Solar, Cavinti"
                        value={trainingTagInput}
                        onChange={(e) => setTrainingTagInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddTrainingTag();
                          }
                        }}
                        className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-cyan-400"
                      />
                      <button
                        type="button"
                        onClick={handleAddTrainingTag}
                        className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold cursor-pointer transition-colors"
                      >
                        Add Tag
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-1">
                      {(trainingFormData.tags || []).map((t, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-500/15 text-cyan-300 text-xs font-bold border border-cyan-500/30"
                        >
                          <span>#{t}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveTrainingTag(idx)}
                            className="text-slate-400 hover:text-red-400 cursor-pointer ml-1"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTrainingTabInModal === 'preview' && (
                <div className="space-y-4">
                  <div className="text-xs text-slate-400">
                    Live simulation of how this workshop card will appear on the public{' '}
                    <code className="text-cyan-400">/trainings</code> catalog:
                  </div>

                  <div className="max-w-md mx-auto bg-slate-900 text-white rounded-3xl overflow-hidden border border-white/10 shadow-2xl p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-[#ffc000] bg-[#ffc000]/15 border border-[#ffc000]/30 px-3 py-1 rounded-full">
                        {trainingFormData.badge || 'Specialized Track'}
                      </span>
                      <span className="text-[11px] font-bold text-slate-300 bg-white/10 px-3 py-1 rounded-full border border-white/10">
                        {trainingFormData.category}
                      </span>
                    </div>

                    <h3 className="text-lg font-black text-white">
                      {trainingFormData.title || 'Untitled Training / Workshop'}
                    </h3>

                    <div className="flex flex-wrap gap-3 text-xs text-slate-300">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{trainingFormData.date || 'Scheduled Batches'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#e51a24]" />
                        <span>{trainingFormData.location || 'Philippines'}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 line-clamp-3">
                      {trainingFormData.description || 'Hands-on technical workshop.'}
                    </p>
                  </div>
                </div>
              )}
            </form>

            <div className="px-6 py-4 bg-[#061021] border-t border-white/10 flex items-center justify-between flex-shrink-0">
              <button
                type="button"
                onClick={() => setIsTrainingModalOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 hover:text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSaveTraining}
                disabled={isSavingTraining}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#0b7337] via-[#0e9447] to-[#0b7337] text-white text-xs font-bold shadow-lg shadow-emerald-950/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer border border-emerald-400/30 disabled:opacity-50"
              >
                {isSavingTraining ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Saving Training...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{trainingModalMode === 'create' ? 'Publish Training' : 'Save Changes'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------------------- */}
      {/* ADD / EDIT NEWS & UPDATES MODAL DIALOG                                 */}
      {/* ---------------------------------------------------------------------- */}
      {isNewsModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in">
          <div className="bg-[#091833] text-white rounded-3xl border border-white/20 shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden">
            <div className="px-6 py-4 bg-[#061021] border-b border-white/10 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white">
                  {newsModalMode === 'create' ? <Newspaper className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-black text-white">
                    {newsModalMode === 'create' ? 'Add New News Article / Announcement' : 'Edit News Article'}
                  </h2>
                  <div className="text-[11px] text-slate-400">
                    Live updates to <code className="text-emerald-400">/news-updates</code> and homepage hero section
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsNewsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-red-500 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-6 py-2 bg-[#08152e] border-b border-white/10 flex items-center gap-2 overflow-x-auto flex-shrink-0 text-xs font-bold">
              {[
                { id: 'general', label: '1. Article Info' },
                { id: 'body', label: '2. Summary & Content' },
                { id: 'highlights', label: '3. Highlights & Points' },
                { id: 'media', label: '4. Image & Contact' },
                { id: 'preview', label: '5. Live Preview' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveNewsTabInModal(tab.id as typeof activeNewsTabInModal)}
                  className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                    activeNewsTabInModal === tab.id
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <form onSubmit={handleSaveNews} className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* TAB 1: BASIC INFO */}
              {activeNewsTabInModal === 'general' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Article Headline / Title <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. FREE TESDA SCHOLARSHIP: Learn to Install Solar Energy Systems!"
                      value={newsFormData.title}
                      onChange={(e) => setNewsFormData({ ...newsFormData, title: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white text-sm focus:outline-none focus:border-[#ffc000] transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        Category <span className="text-red-400">*</span>
                      </label>
                      <select
                        value={newsFormData.category}
                        onChange={(e) => setNewsFormData({ ...newsFormData, category: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-[#091833] border border-white/15 text-white text-sm focus:outline-none focus:border-[#ffc000] transition-colors cursor-pointer"
                      >
                        <option value="Scholarship">Scholarship</option>
                        <option value="Global Tour">Global Tour</option>
                        <option value="Exhibition">Exhibition</option>
                        <option value="Technical Seminar">Technical Seminar</option>
                        <option value="Company Milestone">Company Milestone</option>
                        <option value="General Update">General Update</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        Author / Host Organization
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. CEAAPI & TESDA Region VII Cebu"
                        value={newsFormData.authorOrHost}
                        onChange={(e) => setNewsFormData({ ...newsFormData, authorOrHost: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white text-sm focus:outline-none focus:border-[#ffc000] transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        Date (YYYY-MM-DD)
                      </label>
                      <input
                        type="date"
                        value={newsFormData.date}
                        onChange={(e) => {
                          const val = e.target.value;
                          setNewsFormData({
                            ...newsFormData,
                            date: val,
                            formattedDate: val
                              ? new Date(val).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
                              : newsFormData.formattedDate,
                          });
                        }}
                        className="w-full px-4 py-3 rounded-xl bg-[#091833] border border-white/15 text-white text-sm focus:outline-none focus:border-[#ffc000] transition-colors cursor-pointer"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        Display Date String
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. September 4, 2026 or June 4-7, 2026"
                        value={newsFormData.formattedDate}
                        onChange={(e) => setNewsFormData({ ...newsFormData, formattedDate: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white text-sm focus:outline-none focus:border-[#ffc000] transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        Location / Venue
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. TESDA-Cebu Compound, Lahug"
                        value={newsFormData.location}
                        onChange={(e) => setNewsFormData({ ...newsFormData, location: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white text-sm focus:outline-none focus:border-[#ffc000] transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Slug ID (Auto-generated if empty)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. tesda-scholarship-solar-pv"
                      value={newsFormData.id}
                      onChange={(e) => setNewsFormData({ ...newsFormData, id: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white text-xs font-mono focus:outline-none focus:border-[#ffc000] transition-colors"
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: SUMMARY & FULL BODY */}
              {activeNewsTabInModal === 'body' && (
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Short Summary / Lead Abstract <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Concise overview featured on cards and hero slider..."
                      value={newsFormData.summary}
                      onChange={(e) => setNewsFormData({ ...newsFormData, summary: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-[#ffc000] transition-colors"
                    />
                  </div>

                  <div className="space-y-2 pt-2 border-t border-white/5">
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Article Paragraphs / Full Content
                    </label>
                    <div className="flex items-center gap-2">
                      <textarea
                        rows={2}
                        placeholder="Add a new paragraph..."
                        value={newsParagraphInput}
                        onChange={(e) => setNewsParagraphInput(e.target.value)}
                        className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-emerald-400"
                      />
                      <button
                        type="button"
                        onClick={handleAddNewsParagraph}
                        className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer transition-colors self-end"
                      >
                        Add Paragraph
                      </button>
                    </div>

                    <div className="space-y-2 pt-2">
                      {(newsFormData.fullContent || []).map((p, idx) => (
                        <div
                          key={idx}
                          className="flex items-start justify-between p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-200 gap-3"
                        >
                          <span className="flex-1 leading-relaxed">{p}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveNewsParagraph(idx)}
                            className="text-slate-400 hover:text-red-400 p-1 cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: HIGHLIGHTS & TAGS */}
              {activeNewsTabInModal === 'highlights' && (
                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Key Takeaway Bullet Points
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="e.g. Systems Testing, Commissioning & Maintenance Protocols"
                        value={newsHighlightInput}
                        onChange={(e) => setNewsHighlightInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddNewsHighlight();
                          }
                        }}
                        className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-emerald-400"
                      />
                      <button
                        type="button"
                        onClick={handleAddNewsHighlight}
                        className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer transition-colors"
                      >
                        Add
                      </button>
                    </div>

                    <div className="space-y-1.5 pt-2">
                      {(newsFormData.highlights || []).map((h, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white"
                        >
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                            <span>{h}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveNewsHighlight(idx)}
                            className="text-slate-400 hover:text-red-400 p-1 cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-white/5">
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Search Tags & Topics
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="e.g. Free Training, Solar Installation"
                        value={newsTagInput}
                        onChange={(e) => setNewsTagInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddNewsTag();
                          }
                        }}
                        className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-emerald-400"
                      />
                      <button
                        type="button"
                        onClick={handleAddNewsTag}
                        className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer transition-colors"
                      >
                        Add Tag
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-1">
                      {(newsFormData.tags || []).map((t, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-300 text-xs font-bold border border-emerald-500/30"
                        >
                          <span>#{t}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveNewsTag(idx)}
                            className="text-slate-400 hover:text-red-400 cursor-pointer ml-1"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: MEDIA & CONTACT */}
              {activeNewsTabInModal === 'media' && (
                <div className="space-y-5">
                  <div className="p-6 rounded-2xl bg-white/5 border-2 border-dashed border-white/20 hover:border-emerald-400 transition-colors text-center">
                    <input
                      type="file"
                      ref={newsFileInputRef}
                      accept="image/*"
                      onChange={handleNewsFileUpload}
                      className="hidden"
                      id="news-photo-upload"
                    />
                    <label
                      htmlFor="news-photo-upload"
                      className="cursor-pointer flex flex-col items-center justify-center space-y-2"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-emerald-400">
                        <Upload className="w-6 h-6" />
                      </div>
                      <div className="text-xs font-bold text-white">Click here to upload article cover image</div>
                      <div className="text-[11px] text-slate-400">Supports WebP, PNG, JPG</div>
                    </label>
                    {isUploadingNews && (
                      <div className="mt-3 text-xs text-emerald-400 font-bold flex items-center justify-center gap-2">
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Uploading file...</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Cover Image Path or URL
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. /images/news/tesda-scholarship.png"
                      value={newsFormData.image}
                      onChange={(e) => setNewsFormData({ ...newsFormData, image: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white text-xs font-mono focus:outline-none focus:border-emerald-400 transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/5">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        Inquiry Phone Number (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 0922-8129374"
                        value={newsFormData.contactInfo?.phone || ''}
                        onChange={(e) =>
                          setNewsFormData({
                            ...newsFormData,
                            contactInfo: { ...(newsFormData.contactInfo || {}), phone: e.target.value },
                          })
                        }
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white text-sm focus:outline-none focus:border-emerald-400 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        Inquiry Email Address (Optional)
                      </label>
                      <input
                        type="email"
                        placeholder="e.g. ceaapi2024@gmail.com"
                        value={newsFormData.contactInfo?.email || ''}
                        onChange={(e) =>
                          setNewsFormData({
                            ...newsFormData,
                            contactInfo: { ...(newsFormData.contactInfo || {}), email: e.target.value },
                          })
                        }
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white text-sm focus:outline-none focus:border-emerald-400 transition-colors"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: LIVE PREVIEW */}
              {activeNewsTabInModal === 'preview' && (
                <div className="space-y-4">
                  <div className="text-xs text-slate-400">
                    Live simulation of how this article card will appear on <code className="text-emerald-400">/news-updates</code>:
                  </div>

                  <div className="max-w-md mx-auto bg-slate-900 text-white rounded-3xl overflow-hidden border border-white/10 shadow-2xl p-6 space-y-4">
                    <div className="relative h-48 w-full rounded-2xl overflow-hidden bg-slate-950">
                      <Image
                        src={newsFormData.image || '/images/hero-solar-engineering.webp'}
                        alt={newsFormData.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="bg-slate-900/90 text-[#ffc000] text-[10px] font-black px-2.5 py-1 rounded-full border border-white/10">
                          {newsFormData.category}
                        </span>
                      </div>
                    </div>

                    <h3 className="text-base font-black text-white">{newsFormData.title || 'Untitled Article'}</h3>
                    <p className="text-xs text-slate-300 line-clamp-2">
                      {newsFormData.summary || 'Summary of clean energy development.'}
                    </p>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-white/10">
                      <span>{newsFormData.authorOrHost}</span>
                      <span>{newsFormData.formattedDate || newsFormData.date}</span>
                    </div>
                  </div>
                </div>
              )}
            </form>

            <div className="px-6 py-4 bg-[#061021] border-t border-white/10 flex items-center justify-between flex-shrink-0">
              <button
                type="button"
                onClick={() => setIsNewsModalOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 hover:text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSaveNews}
                disabled={isSavingNews}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#0b7337] via-[#0e9447] to-[#0b7337] text-white text-xs font-bold shadow-lg shadow-emerald-950/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer border border-emerald-400/30 disabled:opacity-50"
              >
                {isSavingNews ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Saving Article...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{newsModalMode === 'create' ? 'Publish Article' : 'Save Changes'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------------------- */}
      {/* DELETE DIALOGS                                                         */}
      {/* ---------------------------------------------------------------------- */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#091833] text-white rounded-3xl border border-red-500/30 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1.5">
              <h3 className="text-base font-black text-white">Delete Project?</h3>
              <p className="text-xs text-slate-300">
                Are you sure you want to remove this project? This will permanently delete it from the portfolio.
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 hover:text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteProject(deleteConfirmId)}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-lg shadow-red-950/40 transition-colors cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteTrainingConfirmId && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#091833] text-white rounded-3xl border border-red-500/30 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1.5">
              <h3 className="text-base font-black text-white">Delete Training Program?</h3>
              <p className="text-xs text-slate-300">
                Are you sure you want to remove this training program? It will be deleted from the database.
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setDeleteTrainingConfirmId(null)}
                className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 hover:text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteTraining(deleteTrainingConfirmId)}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-lg shadow-red-950/40 transition-colors cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteNewsConfirmId && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#091833] text-white rounded-3xl border border-red-500/30 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1.5">
              <h3 className="text-base font-black text-white">Delete News Article?</h3>
              <p className="text-xs text-slate-300">
                Are you sure you want to delete this news article? It will be removed from the public website.
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setDeleteNewsConfirmId(null)}
                className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 hover:text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteNews(deleteNewsConfirmId)}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-lg shadow-red-950/40 transition-colors cursor-pointer"
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
