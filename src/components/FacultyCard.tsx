import React, { useState } from 'react';
import { Faculty } from '../types';
import { 
  Building2, 
  MapPin, 
  ChevronDown, 
  ChevronUp, 
  ExternalLink, 
  Edit3, 
  User, 
  Calendar, 
  BookMarked,
  Sparkles,
  SearchCode
} from 'lucide-react';

interface FacultyCardProps {
  faculty: Faculty;
  onEdit: (faculty: Faculty) => void;
  canEdit: boolean;
  onPromptLogin: () => void;
}

export function FacultyCard({ faculty, onEdit, canEdit, onPromptLogin }: FacultyCardProps): React.ReactElement {
  const [isExpanded, setIsExpanded] = useState(false);

  // Status badges configuration
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'açıyor':
        return (
          <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-full border border-emerald-200 animate-pulse-slow">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Yaz Okulu Açıyor
          </span>
        );
      case 'açmıyor':
        return (
          <span className="inline-flex items-center gap-1.5 bg-rose-50 text-rose-700 text-xs font-bold px-3 py-1.5 rounded-full border border-rose-200">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            Açmıyor
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 bg-gray-50 text-gray-400 text-xs font-medium px-3 py-1.5 rounded-full border border-gray-200">
            <span className="w-2 h-2 rounded-full bg-gray-300"></span>
            Bilinmiyor / Açıklanmadı
          </span>
        );
    }
  };

  // Helper to parse raw coursesText or courses list into visual tags
  const getCoursesArray = () => {
    if (faculty.courses && faculty.courses.length > 0) {
      return faculty.courses.map(c => c.name);
    }
    if (faculty.coursesText && faculty.coursesText.trim().length > 0) {
      // Split by comma, semi-colon, or newlines, filter empty lines
      return faculty.coursesText
        .split(/[\n,;]+/)
        .map(c => c.trim())
        .filter(c => c.length > 0);
    }
    return [];
  };

  const courses = getCoursesArray();

  // Format date helper
  const formatDate = (dateValue: any) => {
    if (!dateValue) return '';
    try {
      // If it is a firestore timestamp with toDate()
      if (typeof dateValue.toDate === 'function') {
        return dateValue.toDate().toLocaleString('tr-TR');
      }
      return new Date(dateValue).toLocaleString('tr-TR');
    } catch {
      return String(dateValue);
    }
  };

  return (
    <div 
      id={`faculty-card-${faculty.id}`}
      className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden ${
        isExpanded 
          ? 'border-[#2E6B4B]/30 shadow-md ring-1 ring-[#2E6B4B]/10' 
          : 'border-gray-100 hover:border-gray-200/80 shadow-xs'
      }`}
    >
      <div className="p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          {/* Main info */}
          <div className="space-y-1.5 flex-1 select-none">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1 bg-[#F5EFE4] text-[#5C452D] text-[11px] font-bold px-2 py-0.5 rounded-md border border-[#E4D1B9]/40">
                <MapPin size={11} className="text-[#8E785F]" />
                {faculty.city}
              </span>
              {getStatusBadge(faculty.status)}
            </div>

            <h3 className="font-sans font-bold text-base sm:text-lg text-gray-900 tracking-tight leading-snug">
              {faculty.univName}
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 font-medium flex items-center gap-1.5">
              <Building2 size={13} className="text-gray-400" />
              {faculty.facultyName}
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              id={`toggle-details-${faculty.id}`}
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 hover:bg-gray-100 text-gray-500 rounded-lg transition-colors border border-gray-100 cursor-pointer flex items-center gap-1 text-xs font-semibold"
              title="Dersleri ve Detayları İncele"
            >
              <span>{isExpanded ? 'Detayları Kapat' : 'Dersleri Gör'}</span>
              {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
            
            {canEdit ? (
              <button
                id={`edit-faculty-${faculty.id}`}
                onClick={() => onEdit(faculty)}
                className="inline-flex items-center gap-1 py-2 px-3 bg-[#EAF5ED] text-[#2E6B4B] hover:bg-[#DDF0E2] font-semibold text-xs rounded-lg transition-colors border border-emerald-100 cursor-pointer"
              >
                <Edit3 size={13} />
                <span>Düzenle</span>
              </button>
            ) : (
              <button
                id={`login-to-edit-${faculty.id}`}
                onClick={onPromptLogin}
                className="inline-flex items-center gap-1 py-2 px-3 bg-gray-50 hover:bg-gray-100 text-gray-500 font-semibold text-xs rounded-lg transition-colors border border-gray-200 cursor-pointer"
                title="Güncellemek için giriş yapın"
              >
                <Edit3 size={13} />
                <span>Düzenle</span>
              </button>
            )}
          </div>

        </div>

        {/* Quick courses preview tags (not expanded) */}
        {!isExpanded && faculty.status === 'açıyor' && courses.length > 0 && (
          <div className="mt-3.5 pt-3 border-t border-gray-50 flex flex-wrap gap-1.5 items-center">
            <span className="text-[10px] font-bold text-gray-400 mr-1 uppercase tracking-wider">Açılan Dersler:</span>
            {courses.slice(0, 4).map((course, idx) => (
              <span key={idx} className="bg-[#EDF7F1] text-[#2E6B4B] text-[11px] font-semibold px-2 py-0.5 rounded-md max-w-[150px] truncate">
                {course}
              </span>
            ))}
            {courses.length > 4 && (
              <span 
                onClick={() => setIsExpanded(true)}
                className="text-[11px] font-bold text-[#2E6B4B] hover:underline cursor-pointer ml-1"
              >
                +{courses.length - 4} ders daha...
              </span>
            )}
          </div>
        )}
      </div>

      {/* Expanded Details Section */}
      {isExpanded && (
        <div id={`details-panel-${faculty.id}`} className="bg-gray-50/70 border-t border-gray-100 p-4 sm:p-5 space-y-4 animate-slideDown">
          
          {/* Announcement and courses layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Courses Column */}
            <div className="bg-white p-4 rounded-xl border border-gray-100/70 space-y-3 shadow-2xs">
              <div className="flex items-center justify-between border-b border-gray-50 pb-2">
                <span className="font-sans font-bold text-xs sm:text-sm text-gray-800 flex items-center gap-1.5">
                  <BookMarked size={14} className="text-[#2E6B4B]" />
                  Açılan Yaz Okulu Dersleri Listesi
                </span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{courses.length} Ders</span>
              </div>

              {faculty.status !== 'açıyor' ? (
                <p className="text-xs text-gray-400 italic py-2">
                  {faculty.status === 'açmıyor' 
                    ? 'Bu fakülte yaz okulu açmayacağını belirttiği için ders listesi bulunmuyor.' 
                    : 'Henüz duyuru yapılmadığı için ders listesi girilmemiş.'}
                </p>
              ) : courses.length === 0 ? (
                <div className="py-4 text-center space-y-1">
                  <p className="text-xs text-gray-400 italic">Henüz hiçbir ders eklenmemiş.</p>
                  {canEdit && (
                    <button
                      onClick={() => onEdit(faculty)}
                      className="text-xs text-[#2E6B4B] hover:underline font-semibold"
                    >
                      Ders eklemek için tıklayın
                    </button>
                  )}
                </div>
              ) : (
                <div className="flex flex-wrap gap-2 pt-1">
                  {courses.map((course, index) => (
                    <span 
                      key={index}
                      className="bg-[#EDF7F1] text-[#2E6B4B] text-xs font-semibold px-2.5 py-1 rounded-lg border border-emerald-100/40 shadow-3xs flex items-center gap-1 hover:brightness-95 transition-all"
                    >
                      <Sparkles size={11} className="brightness-90 opacity-80" />
                      {course}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Links and Metadata Column */}
            <div className="bg-white p-4 rounded-xl border border-gray-100/70 space-y-3 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="border-b border-gray-50 pb-2 mb-2">
                  <span className="font-sans font-bold text-xs sm:text-sm text-gray-800 flex items-center gap-1.5">
                    <SearchCode size={14} className="text-[#2E6B4B]" />
                    Resmi Duyuru & Belgeler
                  </span>
                </div>

                {faculty.announcementUrl ? (
                  <a
                    href={faculty.announcementUrl.startsWith('http') ? faculty.announcementUrl : `https://${faculty.announcementUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 font-bold bg-blue-50/50 hover:bg-blue-50 border border-blue-100 px-3 py-2 rounded-lg transition-colors w-full sm:w-auto mt-2"
                  >
                    <span>Resmi Duyuru Sayfasına Git</span>
                    <ExternalLink size={12} />
                  </a>
                ) : (
                  <p className="text-xs text-gray-400 italic py-1">
                    Bu üniversiteye ait resmi duyuru linki henüz yüklenmemiş.
                  </p>
                )}
              </div>

              {/* Edit log / Audit trail */}
              <div className="pt-3 border-t border-gray-100 space-y-2 mt-4">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Son Güncelleme İzleri</span>
                {faculty.lastUpdatedBy ? (
                  <div className="flex items-center gap-2 bg-gray-50/50 p-2 rounded-lg border border-gray-100">
                    {faculty.lastUpdatedBy.photoURL ? (
                      <img
                        src={faculty.lastUpdatedBy.photoURL}
                        alt={faculty.lastUpdatedBy.displayName || 'Editor'}
                        className="w-8 h-8 rounded-full border border-gray-200"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center">
                        <User size={14} />
                      </div>
                    )}
                    <div className="text-left leading-normal">
                      <div className="text-xs font-bold text-gray-700">{faculty.lastUpdatedBy.displayName}</div>
                      <div className="text-[10px] text-gray-400 flex items-center gap-1 flex-wrap">
                        <span>{faculty.lastUpdatedBy.email}</span>
                        {faculty.lastUpdatedAt && (
                          <>
                            <span className="text-gray-300">•</span>
                            <span className="flex items-center gap-0.5 font-mono">
                              <Calendar size={10} />
                              {formatDate(faculty.lastUpdatedAt)}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-[11px] text-gray-400 italic">
                    Bu fakülte verisi henüz güncellenmedi. İlk veriyi giren siz olun!
                  </p>
                )}
              </div>

            </div>

          </div>

        </div>
      )}
    </div>
  );
}
