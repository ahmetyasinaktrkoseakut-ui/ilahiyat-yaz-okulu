import { Faculty } from '../types';

interface StatsProps {
  faculties: Faculty[];
}

export function Stats({ faculties }: StatsProps) {
  const total = faculties.length;
  const opening = faculties.filter((f) => f.status === 'açıyor').length;
  const inactive = faculties.filter((f) => f.status === 'açmıyor').length;
  const undecided = faculties.filter((f) => f.status === 'belirsiz').length;

  return (
    <div id="stats-bento-1" className="bg-indigo-600 rounded-3xl p-6 text-white flex flex-col justify-between h-full shadow-lg shadow-indigo-600/10 min-h-[220px]">
      <div>
        <h3 id="stats-title" className="text-indigo-200 text-xs font-semibold uppercase tracking-wider mb-1">Genel Durum</h3>
        <p id="total-faculties-count" className="text-2xl font-black leading-tight tracking-tight">{total} Toplam Fakülte</p>
      </div>
      <div className="space-y-3 mt-4">
        <div className="flex justify-between items-end border-b border-indigo-500/50 pb-2">
          <span className="text-sm text-indigo-100 font-medium">Açanlar</span>
          <span className="text-xl font-black text-white">{opening}</span>
        </div>
        <div className="flex justify-between items-end border-b border-indigo-500/50 pb-2">
          <span className="text-sm text-indigo-100 font-medium">Kapalı</span>
          <span className="text-xl font-black text-white">{inactive}</span>
        </div>
        <div className="flex justify-between items-end">
          <span className="text-sm text-indigo-100 font-medium">Belirsiz</span>
          <span className="text-xl font-black text-white">{undecided}</span>
        </div>
      </div>
    </div>
  );
}

