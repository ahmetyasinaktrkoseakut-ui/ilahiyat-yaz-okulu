import { AlertCircle, CheckCircle, Database, Layout } from 'lucide-react';

interface SetupHelperProps {
  onDismiss: () => void;
}

export function SetupHelper({ onDismiss }: SetupHelperProps) {
  return (
    <div id="setup-helper-banner" className="bg-[#FAF6EC] border border-[#E4D1B9] text-[#5C452D] px-6 py-5 rounded-xl shadow-sm max-w-4xl mx-auto my-6 animate-fadeIn">
      <div className="flex flex-col md:flex-row gap-5 items-start">
        <div className="p-3 bg-[#EAE0CD] rounded-lg text-[#2E6B4B]">
          <Database size={24} />
        </div>
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-2">
            <span className="font-sans font-semibold text-lg text-[#2E5E44]">🛠️ Bulut Veritabanı ve Google Bağlantısı</span>
            <span className="bg-[#E2AF5E] text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded-full uppercase">Terminaller Boşta</span>
          </div>
          
          <p className="text-sm leading-relaxed">
            Bu uygulama, 81 ildeki ilahiyat fakültelerinin bilgilerini ortaklaşa güncellemek için <strong>Google Firestore</strong> veritabanını ve <strong>Google Authentication (Google Sign-In)</strong> tabanlı öğrenci doğrulamasını kullanacak şekilde tasarlanmıştır.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="bg-white/80 p-4 rounded-lg border border-[#EDE0CC] space-y-2">
              <span className="font-sans font-medium text-xs text-[#2E5E44] block">Nasıl Başlatılır?</span>
              <ol className="text-xs space-y-1.5 text-gray-600 list-decimal list-inside">
                <li>Sol kenardaki veya paneldeki <strong>Firebase Kurulum ekranına (UI)</strong> gidin.</li>
                <li>Terimleri onaylayıp <strong>"Set up Firestore Database"</strong> butonuna basın.</li>
                <li>Sistem otomatik olarak <code>firebase-applet-config.json</code> ayarlarını güncelleyecektir.</li>
              </ol>
            </div>

            <div className="bg-white/80 p-4 rounded-lg border border-[#EDE0CC] space-y-2">
              <span className="font-sans font-medium text-xs text-[#5C452D] block">Şu Anda Ne Olacak?</span>
              <p className="text-xs text-gray-600 leading-normal">
                Veritabanı bağlantısı tamamlanana kadar uygulama <strong>Yerel Demo Tanıtım ve Test Modu (localStorage)</strong> ile çalışacaktır. Google girişi simülasyonu sayesinde dilediğinizce düzenleme yapabilir, ders ekleyip durumları görebilirsiniz.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-3">
            <button
              id="start-demo-btn"
              onClick={onDismiss}
              className="px-4 py-2 bg-[#2E6B4B] hover:bg-[#224F37] text-[#FAF6EC] text-xs font-medium rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              Uygulamayı Dene (Yerel Depolama ile)
            </button>
            <a
              href="https://console.firebase.google.com"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 bg-white/60 hover:bg-white text-gray-700 text-xs font-medium rounded-lg border border-gray-300 transition-colors inline-flex items-center gap-1.5"
            >
              Firebase Konsolu <Layout size={12} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
