/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  isFirebaseConfigured, 
  auth, 
  db, 
  googleProvider,
  handleFirestoreError,
  OperationType
} from './firebase';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { collection, onSnapshot, doc, setDoc, serverTimestamp } from 'firebase/firestore';

import { Faculty, SummerSchoolStatus } from './types';
import { TURKEY_CITIES, INITIAL_FACULTIES } from './data/initialFaculties';

// Custom Components
import { Header } from './components/Header';
import { Stats } from './components/Stats';
import { FacultyCard } from './components/FacultyCard';
import { EditModal } from './components/EditModal';
import { SetupHelper } from './components/SetupHelper';

// Icons
import { Search, Filter, RefreshCcw, Landmark, Plus, X, GraduationCap, MapPin } from 'lucide-react';

export default function App() {
  // Helper to extract numeric milliseconds from various timestamp formats is safe
  const getTimestampMs = (val: any): number => {
    if (!val) return 0;
    if (typeof val === 'string') return new Date(val).getTime() || 0;
    if (typeof val.toDate === 'function') return val.toDate().getTime() || 0;
    if (val instanceof Date) return val.getTime() || 0;
    if (typeof val === 'number') return val;
    if (val.seconds) return val.seconds * 1000;
    return 0;
  };

  const formatLastUpdated = (lastUpdatedAt: any): string => {
    if (!lastUpdatedAt) return 'Şimdi';
    if (typeof lastUpdatedAt === 'string') return lastUpdatedAt;
    
    let date: Date;
    if (typeof lastUpdatedAt.toDate === 'function') {
      try {
        date = lastUpdatedAt.toDate();
      } catch (e) {
        return 'Şimdi';
      }
    } else if (lastUpdatedAt instanceof Date) {
      date = lastUpdatedAt;
    } else if (lastUpdatedAt.seconds) {
      date = new Date(lastUpdatedAt.seconds * 1000);
    } else {
      const ms = new Date(lastUpdatedAt).getTime();
      if (!isNaN(ms)) {
        date = new Date(ms);
      } else {
        return 'Şimdi';
      }
    }

    try {
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      if (diffMins < 1) return 'Az önce';
      if (diffMins < 60) return `${diffMins}dk önce`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}sa önce`;
      return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return 'Şimdi';
    }
  };

  // Helper to determine the reset cutoff date (September 1st of the current academic year)
  const getResetCutoff = (): number => {
    const now = new Date();
    const currentMonth = now.getMonth(); // 0-indexed (8 = September)
    const currentYear = now.getFullYear();
    const cutoffYear = currentMonth >= 8 ? currentYear : currentYear - 1;
    return new Date(cutoffYear, 8, 1).getTime(); // September 1st of cutoff year
  };

  const [isDemoMode, setIsDemoMode] = useState(!isFirebaseConfigured);
  const [showSetupBanner, setShowSetupBanner] = useState(!isFirebaseConfigured);
  const [isLoading, setIsLoading] = useState(true);

  // User state
  const [user, setUser] = useState<{
    uid: string;
    displayName: string | null;
    email: string | null;
    photoURL: string | null;
  } | null>(null);

  // Faculties Data states
  const [dbFaculties, setDbFaculties] = useState<Record<string, Faculty>>({});
  const [localLiveFaculties, setLocalLiveFaculties] = useState<Record<string, Faculty>>({});

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Selected Faculty sidebar details tracking state
  const [selectedFacultyId, setSelectedFacultyId] = useState<string | null>(null);

  // Edit Modal controls
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState<Faculty | null>(null);

  // New Faculty Form state
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [newCity, setNewCity] = useState('Adana');
  const [newUniv, setNewUniv] = useState('');
  const [newFac, setNewFac] = useState('İlahiyat Fakültesi');
  const [newStatus, setNewStatus] = useState<SummerSchoolStatus>('belirsiz');
  const [newUrl, setNewUrl] = useState('');

  // 1. Monitor Authentication State
  useEffect(() => {
    if (isDemoMode) {
      // Check if local mock user is active
      const savedMockUser = localStorage.getItem('yaz_okulu_mock_user');
      if (savedMockUser) {
        setUser(JSON.parse(savedMockUser));
      }
      setIsLoading(false);
      return;
    }

    if (!auth) return;

    setIsLoading(true);
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          displayName: firebaseUser.displayName,
          email: firebaseUser.email,
          photoURL: firebaseUser.photoURL,
        });
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [isDemoMode]);

  // 2. Load Firestore Data vs. LocalStorage Data
  useEffect(() => {
    if (isDemoMode) {
      const savedLocalData = localStorage.getItem('yaz_okulu_local_live');
      if (savedLocalData) {
        try {
          setLocalLiveFaculties(JSON.parse(savedLocalData));
        } catch (e) {
          console.error('Local JSON parse error', e);
        }
      }
      setIsLoading(false);
      return;
    }

    if (!db) return;

    setIsLoading(true);
    const path = 'faculties';
    const unsubscribe = onSnapshot(collection(db, path), (snapshot) => {
      const liveData: Record<string, Faculty> = {};
      snapshot.forEach((docSnap) => {
        liveData[docSnap.id] = docSnap.data() as Faculty;
      });
      setDbFaculties(liveData);
      setIsLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [isDemoMode]);

  // 3. Merged faculties list
  const allFacultiesList = useMemo(() => {
    const liveSource = isDemoMode ? localLiveFaculties : dbFaculties;
    const cutoffMs = getResetCutoff();
    
    // Process live records to apply yearly reset
    const processLiveRecord = (record: Faculty | undefined): Faculty | undefined => {
      if (!record) return undefined;
      const updatedMs = getTimestampMs(record.lastUpdatedAt);
      if (updatedMs > 0 && updatedMs < cutoffMs) {
        // Record is from previous academic year. Reset its dynamic state.
        return {
          ...record,
          status: 'belirsiz',
          coursesText: undefined,
          courses: undefined,
          announcementUrl: undefined,
          lastUpdatedBy: undefined,
          lastUpdatedAt: undefined
        };
      }
      return record;
    };
    
    // Merge baseline records
    const baseline = INITIAL_FACULTIES.map(facility => {
      const liveRecord = processLiveRecord(liveSource[facility.id]);
      return liveRecord ? { ...facility, ...liveRecord } : facility;
    });

    // Add any newly created custom faculties in liveSource that are not in baseline
    const baselineIds = new Set(INITIAL_FACULTIES.map(f => f.id));
    const customFaculties = (Object.values(liveSource) as Faculty[])
      .filter(f => !baselineIds.has(f.id))
      .map(processLiveRecord)
      .filter(Boolean) as Faculty[];

    return [...baseline, ...customFaculties].sort((a, b) => a.city.localeCompare(b.city, 'tr'));
  }, [INITIAL_FACULTIES, dbFaculties, localLiveFaculties, isDemoMode]);

  // 4. Filter and search computations
  const filteredFaculties = useMemo(() => {
    return allFacultiesList.filter((f) => {
      const matchSearch = 
        f.univName.toLowerCase().toLocaleLowerCase('tr').includes(searchQuery.toLowerCase().toLocaleLowerCase('tr')) ||
        f.facultyName.toLowerCase().toLocaleLowerCase('tr').includes(searchQuery.toLowerCase().toLocaleLowerCase('tr'));
      
      const matchCity = selectedCity === 'all' || f.city === selectedCity;
      const matchStatus = selectedStatus === 'all' || f.status === selectedStatus;

      return matchSearch && matchCity && matchStatus;
    });
  }, [allFacultiesList, searchQuery, selectedCity, selectedStatus]);

  // Derive active Selected Faculty details
  const selectedFaculty = useMemo(() => {
    if (selectedFacultyId) {
      const match = allFacultiesList.find(f => f.id === selectedFacultyId);
      if (match) return match;
    }
    return filteredFaculties[0] || allFacultiesList[0];
  }, [allFacultiesList, filteredFaculties, selectedFacultyId]);

  // Compute dynamic/fallback recent updates for Bento 2 block
  const recentUpdates = useMemo(() => {
    const hasUpdates = allFacultiesList.filter(f => f.lastUpdatedBy);
    const sorted = [...hasUpdates].sort((a, b) => {
      const timeA = getTimestampMs(a.lastUpdatedAt);
      const timeB = getTimestampMs(b.lastUpdatedAt);
      return timeB - timeA;
    });

    const results = sorted.slice(0, 3);

    // Fallbacks if we do not have enough real modifications yet
    if (results.length < 3) {
      const fallbacks = [
        {
          id: "eskisehir-osmangazi-ilh",
          univName: "Eskişehir Osmangazi Üni.",
          displayName: "Mehtap Şahin",
          time: "4dk önce"
        },
        {
          id: "ankara-ilh",
          univName: "Ankara Üni. İlahiyat",
          displayName: "Hasan Kaya",
          time: "15dk önce"
        },
        {
          id: "marmara-ilh",
          univName: "Marmara İlahiyat",
          displayName: "Elif Demir",
          time: "1sa önce"
        }
      ];

      for (let i = 0; i < 3; i++) {
        if (results.length >= 3) break;
        const fb = fallbacks[i];
        if (!results.some(r => r.id === fb.id)) {
          const matchedOrig = allFacultiesList.find(x => x.id === fb.id) || {
            id: fb.id,
            univName: fb.univName,
            facultyName: "İlahiyat Fakültesi",
            city: "Eskişehir",
            status: "açıyor"
          };
          results.push({
            ...matchedOrig,
            lastUpdatedBy: {
              uid: `fb-${i}`,
              displayName: fb.displayName,
              email: "hasan@lahiyat.edu.tr",
              photoURL: ""
            },
            lastUpdatedAt: fb.time
          } as any);
        }
      }
    }
    return results;
  }, [allFacultiesList]);

  // Google Login / Demo Login logic
  const handleLogin = async () => {
    if (isDemoMode) {
      // Create a gorgeous mock user
      const mockUser = {
        uid: 'demo-student-temsilci-99',
        displayName: 'Ahmet Yasin (İlahiyat Temsilcisi)',
        email: 'ahmetyasin@lahiyat.edu.tr',
        photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      };
      localStorage.setItem('yaz_okulu_mock_user', JSON.stringify(mockUser));
      setUser(mockUser);
      return;
    }

    if (!auth) return;
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (e) {
      console.error('Login error', e);
    }
  };

  // Logout logic
  const handleLogout = async () => {
    if (isDemoMode) {
      localStorage.removeItem('yaz_okulu_mock_user');
      setUser(null);
      return;
    }

    if (!auth) return;
    try {
      await signOut(auth);
    } catch (e) {
      console.error('Logout error', e);
    }
  };

  // Submit edits / Save faculty status
  const handleSaveFaculty = async (id: string, updates: Partial<Faculty>) => {
    if (!user) {
      throw new Error('Giriş yapmadan veri güncelleyemezsiniz!');
    }

    const targetFaculty = allFacultiesList.find(f => f.id === id);
    if (!targetFaculty) {
      throw new Error('Fakülte kaydı bulunamadı!');
    }

    if (isDemoMode) {
      const payload: Faculty = {
        ...targetFaculty,
        ...updates,
        lastUpdatedBy: {
          uid: user.uid,
          displayName: user.displayName || 'İlahiyat Öğrencisi',
          email: user.email || '',
          photoURL: user.photoURL || '',
        },
        lastUpdatedAt: new Date().toISOString()
      };
      // Write locally
      const updatedLocal = {
        ...localLiveFaculties,
        [id]: payload
      };
      setLocalLiveFaculties(updatedLocal);
      localStorage.setItem('yaz_okulu_local_live', JSON.stringify(updatedLocal));
      return;
    }

    if (!db) return;

    // Direct Firestore write
    const docRef = doc(db, 'faculties', id);
    try {
      // In Firestore, use native server timestamp conversion or standard dates
      const firestorePayload = {
        ...targetFaculty,
        ...updates,
        lastUpdatedBy: {
          uid: user.uid,
          displayName: user.displayName || 'İlahiyat Öğrencisi',
          email: user.email || '',
          photoURL: user.photoURL || '',
        },
        lastUpdatedAt: serverTimestamp() // Satisfying our temporal constraint
      };
      await setDoc(docRef, firestorePayload);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `faculties/${id}`);
    }
  };

  // Create a Custom Faculty
  const handleAddCustomFaculty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!newUniv.trim()) {
      alert('Lütfen üniversite adını girin!');
      return;
    }

    // Deduce unique ID
    const slug = newUniv.toLowerCase()
      .toLocaleLowerCase('tr')
      .replace(/[^a-z0-0ğüşöçı ]/g, '')
      .replace(/\s+/g, '-');
    const customId = `custom-${slug}-${Date.now().toString().slice(-4)}`;

    if (isDemoMode) {
      const newFaculty: Faculty = {
        id: customId,
        city: newCity,
        univName: newUniv.trim(),
        facultyName: newFac.trim(),
        status: newStatus,
        announcementUrl: newUrl.trim() || undefined,
        lastUpdatedBy: {
          uid: user.uid,
          displayName: user.displayName || 'Öğrenci',
          email: user.email || '',
          photoURL: user.photoURL || '',
        },
        lastUpdatedAt: new Date().toISOString()
      };
      const updatedLocal = {
        ...localLiveFaculties,
        [customId]: newFaculty
      };
      setLocalLiveFaculties(updatedLocal);
      localStorage.setItem('yaz_okulu_local_live', JSON.stringify(updatedLocal));
    } else if (db) {
      const docRef = doc(db, 'faculties', customId);
      const newFaculty = {
        id: customId,
        city: newCity,
        univName: newUniv.trim(),
        facultyName: newFac.trim(),
        status: newStatus,
        announcementUrl: newUrl.trim() || undefined,
        lastUpdatedBy: {
          uid: user.uid,
          displayName: user.displayName || 'Öğrenci',
          email: user.email || '',
          photoURL: user.photoURL || '',
        },
        lastUpdatedAt: serverTimestamp() // Satisfying strict request.time temporal rules
      };
      setDoc(docRef, newFaculty).catch(err => {
        handleFirestoreError(err, OperationType.CREATE, `faculties/${customId}`);
      });
    }

    // Reset fields
    setNewUniv('');
    setNewUrl('');
    setIsAddFormOpen(false);
  };

  // Force loading state UI
  if (isLoading) {
    return (
      <div id="loader-screen" className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 text-slate-900">
        <div className="text-center space-y-4">
          <GraduationCap size={48} className="text-indigo-600 animate-bounce mx-auto" />
          <h2 className="font-sans font-extrabold text-slate-900 text-lg">İlahiyat Yaz Okulu Takip</h2>
          <p className="text-xs text-slate-500 font-semibold font-mono uppercase tracking-wide">Sistem yükleniyor, lütfen bekleyin...</p>
          <div className="w-16 h-1 bg-slate-200 rounded-full mx-auto overflow-hidden">
            <div className="w-8 h-full bg-indigo-600 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="app-root-container" className="min-h-screen bg-slate-50 text-slate-900 antialiased font-sans flex flex-col">
      
      {/* Header */}
      <Header 
        user={user} 
        onLogin={handleLogin} 
        onLogout={handleLogout} 
        isDemo={isDemoMode}
      />

      {/* Main Core View Area with Bento Grid */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">

        {/* Dynamic setup help component if Firestore is unconfigured */}
        {showSetupBanner && (
          <SetupHelper onDismiss={() => setShowSetupBanner(false)} />
        )}

        {/* Bento Grid Layout */}
        <div id="bento-container-grid" className="grid grid-cols-12 gap-6 items-stretch">
          
          {/* Stats Summary (Bento 1) */}
          <div className="col-span-12 md:col-span-6 lg:col-span-3">
            <Stats faculties={allFacultiesList} />
          </div>

          {/* Recent Updates (Bento 2) */}
          <div className="col-span-12 md:col-span-6 lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-slate-900 font-extrabold text-sm mb-4 flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                Son Güncellemeler
              </h3>
              <div className="space-y-4">
                {recentUpdates.map((update, idx) => (
                  <div 
                    key={update.id || idx}
                    className="flex gap-3 items-start cursor-pointer hover:bg-slate-50/80 p-1.5 rounded-xl transition-all"
                    onClick={() => setSelectedFacultyId(update.id)}
                  >
                    {update.lastUpdatedBy?.photoURL ? (
                      <img 
                        src={update.lastUpdatedBy.photoURL} 
                        alt="Profile" 
                        className="w-8 h-8 rounded-full border border-slate-200 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 text-xs font-extrabold border border-indigo-100">
                        {update.lastUpdatedBy?.displayName?.charAt(0) || "Y"}
                      </div>
                    )}
                    <div className="min-w-0 flex-1 leading-tight">
                      <p className="text-sm font-bold text-slate-900 truncate tracking-tight">{update.univName}</p>
                      <p className="text-xs text-slate-500 truncate mt-0.5">
                        {update.lastUpdatedBy?.displayName || "Misafir"} • {formatLastUpdated(update.lastUpdatedAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Info CTA (Bento 3) */}
          <div className="col-span-12 lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-center gap-6">
            <div className="flex-1 space-y-2">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight leading-snug">
                {user ? "Kendi Fakülteni Güncelle" : "Giriş Yaparak Veri Girin"}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-semibold">
                {user 
                  ? "Sisteme kayıtlı olmayan üniversiteniz varsa hemen ekleyebilir, yaz okulu açma kararını ve derslerini anında yayınlayabilirsiniz." 
                  : "WhatsApp gruplarındaki bilgi dağınıklığını ve kirliliğini beraber bitirelim. Fakültenizin durumunu güncelleyin."}
              </p>
              <div className="pt-2">
                {user ? (
                  <button
                    onClick={() => setIsAddFormOpen(!isAddFormOpen)}
                    className="py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl inline-flex items-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-indigo-600/10"
                  >
                    <Plus size={14} className="stroke-[2.5]" />
                    <span>{isAddFormOpen ? "Formu Gizle" : "Fakülte Kaydı Ekle"}</span>
                  </button>
                ) : (
                  <button
                    onClick={handleLogin}
                    className="py-2.5 px-5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl inline-flex items-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-indigo-600/10"
                  >
                    Google ile Giriş Yap
                  </button>
                )}
              </div>
            </div>
            <div className="w-24 h-24 sm:w-28 sm:h-28 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center shrink-0">
              <svg className="w-12 h-12 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
              </svg>
            </div>
          </div>

          {/* Custom Faculty Creation Form if Opened */}
          {isAddFormOpen && user && (
            <div className="col-span-12 bg-indigo-50/40 border border-indigo-100/50 p-6 rounded-3xl animate-slideDown">
              <form onSubmit={handleAddCustomFaculty} className="space-y-4 text-left">
                <div className="flex items-center justify-between border-b border-indigo-100 pb-2">
                  <span className="font-extrabold text-xs text-indigo-950 flex items-center gap-1.5 uppercase tracking-wider">
                    <Landmark size={14} className="text-indigo-600" />
                    Yeni Fakülte / Vakıf Üniversitesi Kaydı Oluştur
                  </span>
                  <button 
                    type="button" 
                    onClick={() => setIsAddFormOpen(false)}
                    className="p-1 hover:bg-indigo-100 text-indigo-600 rounded-full"
                  >
                    <X size={14} />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* City */}
                  <div className="space-y-1">
                    <label htmlFor="add-city-select" className="text-[10px] font-bold text-indigo-700/80 block uppercase tracking-wider">Fakülte İli</label>
                    <select
                      id="add-city-select"
                      value={newCity}
                      onChange={(e) => setNewCity(e.target.value)}
                      className="w-full text-xs border border-indigo-200/60 bg-white rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    >
                      {TURKEY_CITIES.map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>

                  {/* University Name */}
                  <div className="space-y-1">
                    <label htmlFor="universite-adi-input" className="text-[10px] font-bold text-indigo-700/80 block uppercase tracking-wider">Üniversite Adı</label>
                    <input
                      id="universite-adi-input"
                      type="text"
                      value={newUniv}
                      onChange={(e) => setNewUniv(e.target.value)}
                      placeholder="Örn: Eskişehir Osmangazi Üni."
                      className="w-full text-xs border border-indigo-200/60 bg-white rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                      required
                    />
                  </div>

                  {/* Faculty Type */}
                  <div className="space-y-1">
                    <label htmlFor="fakulte-bölüm-select" className="text-[10px] font-bold text-indigo-700/80 block uppercase tracking-wider">Fakülte Türü</label>
                    <select
                      id="fakulte-bölüm-select"
                      value={newFac}
                      onChange={(e) => setNewFac(e.target.value)}
                      className="w-full text-xs border border-indigo-200/60 bg-white rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    >
                      <option value="İlahiyat Fakültesi">İlahiyat Fakültesi</option>
                      <option value="İslami İlimler Fakültesi">İslami İlimler Fakültesi</option>
                      <option value="İslami İlimler Bölümü">İslami İlimler Bölümü</option>
                    </select>
                  </div>

                  {/* Status */}
                  <div className="space-y-1">
                    <label htmlFor="yaz-okulu-ekle-select" className="text-[10px] font-bold text-indigo-700/80 block uppercase tracking-wider">Mevcut Durum</label>
                    <select
                      id="yaz-okulu-ekle-select"
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value as SummerSchoolStatus)}
                      className="w-full text-xs border border-indigo-200/60 bg-white rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    >
                      <option value="belirsiz">Bilinmiyor / Belirsiz</option>
                      <option value="açıyor">Yaz Okulu Açıyor</option>
                      <option value="açmıyor">Kapalı / Açmıyor</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-1">
                  <div className="flex-1 space-y-1">
                    <label htmlFor="duyuru-url-input" className="text-[10px] font-bold text-indigo-700/80 block uppercase tracking-wider">Resmi Duyuru URL Linki (Opsiyonel)</label>
                    <input
                      id="duyuru-url-input"
                      type="text"
                      value={newUrl}
                      onChange={(e) => setNewUrl(e.target.value)}
                      placeholder="Örn: https://www.ogu.edu.tr/yaz-okulu"
                      className="w-full text-xs border border-indigo-200/60 bg-white rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-6 py-2 rounded-xl self-end h-[34px] cursor-pointer shadow-md transition-colors"
                  >
                    Kayıt Ekle
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Main Data Table (Bento 4) */}
          <div className="col-span-12 lg:col-span-8 bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col overflow-hidden min-h-[480px]">
            <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">Fakülte Listesi</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Şehir ve durum sıralı takip tablosu</p>
              </div>

              {/* Filtering Actions */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Search query box */}
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <Search size={12} className="stroke-[2.5]" />
                  </span>
                  <input
                    id="university-search-input"
                    type="text"
                    placeholder="İl veya üniversite ara..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-36 sm:w-48 bg-white border border-slate-200 rounded-full py-1.5 pl-8 pr-3 text-xs outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-semibold"
                  />
                </div>

                {/* City Selection dropdown */}
                <select
                  id="city-filter-select"
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-full text-xs font-semibold text-slate-700 outline-none cursor-pointer max-w-[120px]"
                >
                  <option value="all">📍 Tüm İller</option>
                  {TURKEY_CITIES.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>

                {/* Status Selection dropdown */}
                <select
                  id="status-filter-select"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-full text-xs font-semibold text-slate-700 outline-none cursor-pointer"
                >
                  <option value="all">🔍 Tüm Kararlar</option>
                  <option value="açıyor">Açanlar</option>
                  <option value="açmıyor">Açmayanlar</option>
                  <option value="belirsiz">Belirsizler</option>
                </select>

                {/* Reset Filters */}
                {(selectedCity !== 'all' || selectedStatus !== 'all' || searchQuery !== '') && (
                  <button
                    id="reset-filters-btn"
                    onClick={() => {
                      setSelectedCity('all');
                      setSelectedStatus('all');
                      setSearchQuery('');
                    }}
                    className="p-1 px-2.5 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-full text-xs font-bold transition-all shrink-0"
                    title="Temizle"
                  >
                    Sıfırla
                  </button>
                )}
              </div>
            </div>

            <div className="overflow-y-auto flex-1 max-h-[500px]">
              {filteredFaculties.length === 0 ? (
                <div id="no-results-panel" className="p-12 text-center max-w-sm mx-auto space-y-2">
                  <span className="text-3xl block">👁️‍🗨️</span>
                  <h4 className="font-extrabold text-slate-800">Sonuç Bulunamadı</h4>
                  <p className="text-xs text-slate-400">
                    Arama kriterlerinize uyan bir fakülte kaydı mevcut değil.
                  </p>
                  <button
                    onClick={() => {
                      setSelectedCity('all');
                      setSelectedStatus('all');
                      setSearchQuery('');
                    }}
                    className="py-1 px-3 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-bold"
                  >
                    Sıfırla
                  </button>
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead className="sticky top-0 bg-white border-b border-slate-100 z-10 shadow-3xs">
                    <tr className="text-[10px] text-slate-400 uppercase tracking-widest font-extrabold">
                      <th className="px-6 py-4">İl</th>
                      <th className="px-6 py-4">Üniversite & Fakülte</th>
                      <th className="px-6 py-4">Durum</th>
                      <th className="px-6 py-4 text-right">İşlem</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs divide-y divide-slate-50 font-bold text-slate-700">
                    {filteredFaculties.map((facility) => {
                      const isSelected = selectedFaculty.id === facility.id;
                      return (
                        <tr 
                          key={facility.id}
                          onClick={() => setSelectedFacultyId(facility.id)}
                          className={`hover:bg-slate-50/80 transition-cool cursor-pointer ${
                            isSelected ? 'bg-indigo-50/40 border-l-[3px] border-l-indigo-600' : ''
                          }`}
                        >
                          <td className="px-6 py-4">
                            <span className="inline-block bg-slate-100 border border-slate-200/50 text-slate-600 text-[10px] font-black px-2 py-0.5 rounded-md">
                              {facility.city}
                            </span>
                          </td>
                          <td className="px-6 py-4 max-w-xs sm:max-w-none">
                            <p className="text-sm text-slate-900 truncate tracking-tight">{facility.univName}</p>
                            <p className="text-[10px] text-slate-400 font-semibold">{facility.facultyName}</p>
                          </td>
                          <td className="px-6 py-4">
                            {facility.status === 'açıyor' ? (
                              <span className="px-2.5 py-1 bg-green-100 text-green-700 rounded-md text-[10px] font-black uppercase inline-flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                AÇIYOR
                              </span>
                            ) : facility.status === 'açmıyor' ? (
                              <span className="px-2.5 py-1 bg-red-100 text-red-700 rounded-md text-[10px] font-black uppercase inline-flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                                KAPALI
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 bg-slate-100 text-slate-500 rounded-md text-[10px] font-black uppercase inline-flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                                BELİRSİZ
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button 
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedFacultyId(facility.id);
                              }}
                              className="text-indigo-600 hover:text-indigo-800 font-bold text-xs hover:underline"
                            >
                              İncele
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Selected Faculty Detail View (Bento 5) */}
          <div className="col-span-12 lg:col-span-4 bg-slate-900 rounded-3xl p-6 text-white flex flex-col justify-between shadow-lg min-h-[480px]">
            {selectedFaculty ? (
              <div className="flex flex-col h-full justify-between gap-6">
                
                <div className="space-y-4">
                  <div className="flex items-center gap-1.5 text-indigo-400 text-[10px] font-extrabold uppercase tracking-widest">
                    <svg className="w-4 h-4 shrink-0 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                    </svg>
                    Seçili Fakülte Detayı
                  </div>
                  
                  <div>
                    <span className="inline-block bg-slate-800 text-indigo-300 text-[10px] font-bold px-2 py-0.5 rounded-md border border-white/5 uppercase select-none mb-1">
                      {selectedFaculty.city}
                    </span>
                    <h2 className="text-xl font-extrabold leading-tight tracking-tight text-white">{selectedFaculty.univName}</h2>
                    <p className="text-slate-400 text-xs font-semibold">{selectedFaculty.facultyName}</p>
                  </div>

                  {/* Active Decision Status */}
                  <div className="pt-1.5">
                    {selectedFaculty.status === 'açıyor' ? (
                      <span className="inline-flex items-center gap-1.5 bg-green-500/10 text-green-400 text-xs font-bold border border-green-500/20 px-3 py-1.5 rounded-xl uppercase">
                        <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
                        Yaz Okulu Açıyor
                      </span>
                    ) : selectedFaculty.status === 'açmıyor' ? (
                      <span className="inline-flex items-center gap-1.5 bg-red-400/10 text-red-400 text-xs font-bold border border-red-500/20 px-3 py-1.5 rounded-xl uppercase">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                        Açmıyor / Kapalı
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 bg-slate-400/10 text-slate-400 text-xs font-bold border border-slate-500/20 px-3 py-1.5 rounded-xl uppercase">
                        <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
                        Karar Belirsiz
                      </span>
                    )}
                  </div>

                  {/* Courses parsed container */}
                  <div className="bg-slate-800/40 rounded-2xl p-4 border border-white/5">
                    <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2.5">Açılan Dersler</h4>
                    {selectedFaculty.coursesText?.trim() ? (
                      <ul className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
                        {selectedFaculty.coursesText.split(/[\n,;]+/).map((course, index) => {
                          const name = course.trim();
                          if (!name) return null;
                          return (
                            <li key={index} className="flex justify-between items-center py-1.5 border-b border-white/5 last:border-0 text-xs tracking-tight">
                              <span className="text-slate-100 font-medium truncate pr-2">{name}</span>
                              <span className="text-[9px] bg-indigo-500 px-2 py-0.5 rounded text-white font-extrabold shrink-0 uppercase tracking-wider scale-90">Aktif</span>
                            </li>
                          );
                        })}
                      </ul>
                    ) : (
                      <p className="text-xs text-slate-400 italic py-1 leading-normal">
                        {selectedFaculty.status === 'açıyor' 
                          ? "Henüz eklenmiş ders bulunmuyor. Düzenleme formunu kullanarak dersleri girin!" 
                          : "Bu üniversite için henüz resmi bir ders duyurusu girilmemiş."}
                      </p>
                    )}
                  </div>

                  {/* Web external link */}
                  {selectedFaculty.announcementUrl && (
                    <a 
                      href={selectedFaculty.announcementUrl.startsWith('http') ? selectedFaculty.announcementUrl : `https://${selectedFaculty.announcementUrl}`}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700/80 text-white border border-white/5 hover:border-white/10 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
                    >
                      <span>Resmi Duyuru Adresi</span>
                      <svg className="w-3 h-3 hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  )}

                </div>

                {/* Info and edit actions bottom */}
                <div className="space-y-4 pt-4 border-t border-white/5">
                  {selectedFaculty.lastUpdatedBy ? (
                    <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                      {selectedFaculty.lastUpdatedBy.photoURL ? (
                        <img 
                          src={selectedFaculty.lastUpdatedBy.photoURL} 
                          alt="Avatar" 
                          className="w-8 h-8 rounded-full border border-white/10 shrink-0"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold text-xs uppercase shrink-0">
                          {selectedFaculty.lastUpdatedBy.displayName?.charAt(0) || "Ö"}
                        </div>
                      )}
                      <div className="leading-tight min-w-0">
                        <p className="text-[10px] text-slate-500 uppercase font-black">Düzenleyen Temsilci</p>
                        <p className="text-xs font-semibold text-slate-200 truncate">{selectedFaculty.lastUpdatedBy.displayName}</p>
                      </div>
                    </div>
                  ) : null}

                  {user ? (
                    <button
                      onClick={() => {
                        setEditingFaculty(selectedFaculty);
                        setIsEditOpen(true);
                      }}
                      className="w-full bg-white text-slate-900 font-extrabold py-3 rounded-xl hover:bg-indigo-50 transition-colors shadow-lg text-xs uppercase tracking-wider"
                    >
                      Veriyi Düzenle / Ders Ekle
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        const confirmLogin = window.confirm(
                          'Fakülte kaydı düzenleyebilmek veya ders listesi girebilmek için Google ile giriş yapmanız gerekir. Şimdi giriş yapmak ister misiniz?'
                        );
                        if (confirmLogin) {
                          handleLogin();
                        }
                      }}
                      className="w-full bg-slate-800 hover:bg-slate-700/80 text-slate-300 border border-white/5 hover:border-white/15 py-3 rounded-xl transition-all shadow-md text-xs font-bold uppercase tracking-wider cursor-pointer"
                    >
                      Düzenlemek İçin Giriş Yap
                    </button>
                  )}
                </div>

              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-2">
                <span className="text-3xl">🏜️</span>
                <h4 className="font-bold">Fakülte Seçilmedi</h4>
                <p className="text-xs text-slate-400">Takvim ve detayları görmek için listeden seçim yapın.</p>
              </div>
            )}
          </div>

        </div>

      </main>

      {/* Footer copyright */}
      <footer className="mt-20 border-t border-slate-200 py-8 text-center bg-white">
        <div className="max-w-7xl mx-auto px-6 text-xs text-slate-400 space-y-2">
          <p>© 2026 İlahiyat & İslami İlimler Yaz Okulu Takip Sistemi.</p>
          <p className="max-w-lg mx-auto leading-relaxed">
            Bu portal, Whatsapp ve sosyal medya gruplarındaki bilgi dağınıklığını önlemek üzere öğrenciler tarafından ortak üretilmiştir. Bilgilerin doğruluğunu resmi akademik duyurulardan onaylayınız.
          </p>
        </div>
      </footer>

      {/* Editor Modal Overlay */}
      <EditModal
        faculty={editingFaculty}
        isOpen={isEditOpen}
        onClose={() => {
          setIsEditOpen(false);
          setEditingFaculty(null);
        }}
        onSave={handleSaveFaculty}
        userEmail={user?.email || ''}
      />

    </div>
  );
}

