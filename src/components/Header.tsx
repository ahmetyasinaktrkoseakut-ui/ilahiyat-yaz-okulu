import { LogIn, LogOut, GraduationCap, Info } from 'lucide-react';

interface HeaderProps {
  user: {
    displayName: string | null;
    email: string | null;
    photoURL: string | null;
  } | null;
  onLogin: () => void;
  onLogout: () => void;
  isDemo: boolean;
}

export function Header({ user, onLogin, onLogout, isDemo }: HeaderProps) {
  return (
    <header id="header-container" className="bg-white border-b border-slate-200 sticky top-0 z-50 shrink-0 shadow-xs flex flex-col">
      {/* Top Announcement Banner (Visible on all devices) */}
      <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-indigo-700 text-white px-3 sm:px-4 py-2 text-center w-full shadow-sm relative z-50 border-b border-indigo-500/50">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 sm:gap-3">
          <span className="relative hidden sm:flex h-2.5 w-2.5 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-300 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-200"></span>
          </span>
          <p className="text-[11px] sm:text-xs font-medium tracking-wide leading-tight">
            Bu sistem <strong className="font-black bg-white/20 px-1.5 py-0.5 rounded shadow-sm mx-0.5 text-white">AHMET YASİN AKTÜRK</strong> tarafından İlahiyat öğrencilerinin hizmetine sunulmuştur.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full h-16 px-4 sm:px-6 flex items-center justify-between">
        
        {/* Logo & Branding */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-indigo-600/10 hover:scale-105 transition-transform duration-200 shrink-0">
            <GraduationCap size={22} className="stroke-[2.2]" />
          </div>
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-base sm:text-lg font-extrabold tracking-tight text-slate-900 leading-tight">İlahiyat Yaz Okulu</h1>
              <p className="text-[9px] sm:text-[10px] text-slate-500 font-semibold tracking-wide uppercase">Bilgi Paylaşım & Takip Platformu</p>
            </div>
          </div>
        </div>

        {/* User Actions */}
        <div className="flex items-center gap-3">
          {isDemo && (
            <span className="hidden sm:flex shrink-0 bg-indigo-50 text-indigo-700 text-[10px] font-bold border border-indigo-100 px-2.5 py-1 rounded-full items-center gap-1.5 animate-pulse">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
              </span>
              Demo Modu
            </span>
          )}
          
          {user ? (
            <div className="flex items-center gap-2 bg-slate-50 p-1 pr-3 rounded-full border border-slate-200 hover:bg-slate-100 transition-colors animate-fadeIn">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'User'}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-slate-200 shrink-0"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  {user.displayName?.charAt(0) || 'U'}
                </div>
              )}
              <div className="hidden sm:block text-left leading-tight">
                <div className="text-xs font-bold text-slate-800 tracking-tight line-clamp-1">{user.displayName}</div>
                <div className="text-[9px] text-slate-500 font-mono tracking-tighter line-clamp-1">{user.email}</div>
              </div>
              <button
                id="google-logout-btn"
                onClick={onLogout}
                className="p-1 sm:p-1.5 hover:bg-slate-200/80 text-slate-400 hover:text-red-500 rounded-full transition-colors cursor-pointer ml-0 sm:ml-1"
                title="Güvenli Çıkış Yap"
              >
                <LogOut size={14} className="sm:w-4 sm:h-4" />
              </button>
            </div>
          ) : (
            <button
              id="google-login-btn"
              onClick={onLogin}
              className="flex items-center gap-1.5 sm:gap-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 hover:border-slate-400 font-bold text-[10px] sm:text-xs px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl transition-all shadow-xs cursor-pointer active:scale-95 duration-100"
            >
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span>Giriş Yap</span>
            </button>
          )}
        </div>

      </div>

      {/* Info stripe for view mode */}
      {!user && (
        <div className="bg-amber-50/80 border-t border-amber-200/50 py-1.5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-1.5 text-[9px] sm:text-[10px] text-amber-900 leading-normal">
            <Info size={12} className="text-amber-600 shrink-0" />
            <p className="font-semibold">
              <strong>İnceleme Modu:</strong> Veri giriş yetkisi ve ders güncelleme özellikleri için <strong>Giriş Yap</strong> butonunu kullanabilirsiniz.
            </p>
          </div>
        </div>
      )}
    </header>
  );
}

