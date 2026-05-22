import React, { useState, useEffect } from 'react';
import { Faculty, SummerSchoolStatus } from '../types';
import { X, Save, AlertTriangle, Link, BookOpen, Clock, HelpCircle } from 'lucide-react';

interface EditModalProps {
  faculty: Faculty | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, updates: Partial<Faculty>) => Promise<void>;
  userEmail: string | null;
}

export function EditModal({ faculty, isOpen, onClose, onSave, userEmail }: EditModalProps) {
  const [status, setStatus] = useState<SummerSchoolStatus>('belirsiz');
  const [announcementUrl, setAnnouncementUrl] = useState('');
  const [coursesText, setCoursesText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Sync state with selected faculty when opened
  useEffect(() => {
    if (faculty) {
      setStatus(faculty.status);
      setAnnouncementUrl(faculty.announcementUrl || '');
      setCoursesText(faculty.coursesText || '');
      setErrorMsg('');
    }
  }, [faculty, isOpen]);

  if (!isOpen || !faculty) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      // Basic validations
      let cleanedUrl = announcementUrl.trim();
      if (cleanedUrl && !cleanedUrl.startsWith('http://') && !cleanedUrl.startsWith('https://')) {
        cleanedUrl = 'https://' + cleanedUrl;
      }

      await onSave(faculty.id, {
        status,
        announcementUrl: cleanedUrl,
        coursesText: coursesText.trim(),
      });
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Güncelleme hatası oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="edit-modal-overlay" className="fixed inset-0 z-100 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-gray-900/50 backdrop-blur-xs transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Content */}
      <div 
        id="edit-modal-content"
        className="bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100 max-w-lg w-full z-10 p-6 sm:p-8 relative animate-scaleUp text-left"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="space-y-1 mb-6">
          <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider block">Veri Girişi & Güncelleme</span>
          <h3 className="font-sans font-bold text-lg sm:text-xl text-gray-900 leading-snug">
            {faculty.univName}
          </h3>
          <p className="text-xs text-gray-500 font-medium">
            {faculty.facultyName} • {faculty.city}
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center gap-2">
            <AlertTriangle size={14} className="shrink-0" />
            <p>{errorMsg}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Status Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 block">Yaz Okulu Durumu</label>
            <div className="grid grid-cols-3 gap-2.5">
              {/* Option: Açıyor */}
              <button
                type="button"
                onClick={() => setStatus('açıyor')}
                className={`py-3 px-2 rounded-xl border text-xs font-bold transition-all text-center flex flex-col items-center gap-1.5 cursor-pointer ${
                  status === 'açıyor'
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-500/20'
                    : 'border-gray-200 bg-white text-gray-500 hover:bg-gray-50'
                }`}
              >
                <span className={`w-3 h-3 rounded-full ${status === 'açıyor' ? 'bg-emerald-500' : 'bg-gray-300'}`}></span>
                Açıyor
              </button>

              {/* Option: Açmıyor */}
              <button
                type="button"
                onClick={() => setStatus('açmıyor')}
                className={`py-3 px-2 rounded-xl border text-xs font-bold transition-all text-center flex flex-col items-center gap-1.5 cursor-pointer ${
                  status === 'açmıyor'
                    ? 'border-rose-500 bg-rose-50 text-rose-800 ring-2 ring-rose-500/20'
                    : 'border-gray-200 bg-white text-gray-500 hover:bg-gray-50'
                }`}
              >
                <span className={`w-3 h-3 rounded-full ${status === 'açmıyor' ? 'bg-rose-500' : 'bg-gray-300'}`}></span>
                Açmıyor
              </button>

              {/* Option: Belirsiz */}
              <button
                type="button"
                onClick={() => setStatus('belirsiz')}
                className={`py-3 px-2 rounded-xl border text-xs font-bold transition-all text-center flex flex-col items-center gap-1.5 cursor-pointer ${
                  status === 'belirsiz'
                    ? 'border-gray-400 bg-gray-50 text-gray-700 ring-2 ring-gray-400/20'
                    : 'border-gray-200 bg-white text-gray-500 hover:bg-gray-50'
                }`}
              >
                <span className="w-3 h-3 rounded-full bg-gray-300"></span>
                Belirsiz
              </button>
            </div>
          </div>

          {/* Announcement Link */}
          <div className="space-y-1.5">
            <label htmlFor="announcement-url-input" className="text-xs font-bold text-gray-700 flex items-center gap-1">
              <Link size={13} className="text-gray-400" />
              Resmi Duyuru Sayfası Linki
            </label>
            <input
              id="announcement-url-input"
              type="text"
              value={announcementUrl}
              onChange={(e) => setAnnouncementUrl(e.target.value)}
              placeholder="Örn: www.ogu.edu.tr/yaz-okulu-duyurusu"
              disabled={isSubmitting}
              className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2.5 focus:border-[#2E6B4B] focus:ring-1 focus:ring-[#2E6B4B] outline-none transition-all disabled:bg-gray-50"
            />
          </div>

          {/* List of Courses Textbox */}
          <div className="space-y-1.5">
            <label htmlFor="courses-textbox" className="text-xs font-bold text-gray-700 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <BookOpen size={13} className="text-gray-400" />
                Açılacak / Açılması Muhtemel Dersler
              </span>
              <span className="text-[10px] text-gray-400 font-medium">Virgülle veya satırla ayırın</span>
            </label>
            <textarea
              id="courses-textbox"
              value={coursesText}
              onChange={(e) => setCoursesText(e.target.value)}
              placeholder="Örn:&#10;Tefsir Tarihi I&#10;İslam Hukuk Usulü&#10;Arapça Hazırlık Muafiyet&#10;Hadis, Siyer"
              rows={4}
              disabled={isSubmitting || status !== 'açıyor'}
              className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2.5 focus:border-[#2E6B4B] focus:ring-1 focus:ring-[#2E6B4B] outline-none transition-all disabled:bg-gray-100 disabled:text-gray-400 resize-y"
            />
            {status !== 'açıyor' && (
              <span className="text-[10px] text-amber-600 block leading-tight">
                * Ders girmek için durumun <strong>"Açıyor"</strong> olarak işaretli olması gerekir.
              </span>
            )}
          </div>

          {/* Audit Logging Message */}
          <div className="p-3 bg-indigo-50/40 rounded-xl border border-indigo-100/50 flex items-start gap-2 text-[11px] text-indigo-950 leading-normal">
            <Clock size={16} className="shrink-0 text-indigo-600 mt-0.5" />
            <p>
              Veriler <strong>açık veri paylaşımı</strong> kapsamında kaydedilir. Bu güncellemeyi onayladığınızda Google hesabınız (<code>{userEmail}</code>) son düzenleyen olarak listelenecektir.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-2.5 pt-2 justify-end border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 text-xs font-bold text-gray-500 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-md shadow-indigo-600/10 active:scale-97 cursor-pointer disabled:opacity-55"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Kaydediliyor...</span>
                </>
              ) : (
                <>
                  <Save size={13} />
                  <span>Kararı Yayınla</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
