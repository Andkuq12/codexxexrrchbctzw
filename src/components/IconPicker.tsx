import { useMemo, useState } from 'react';
import { X, Search } from 'lucide-react';
import MaterialIcon from './MaterialIcon';
import iconList from '../lib/materialIcons.json';

interface IconEntry {
  name: string;
  search: string;
}

const ICONS = iconList as IconEntry[];

interface IconPickerProps {
  value: string;
  onChange: (name: string) => void;
  label?: string;
}

/**
 * A text input showing the current icon name + a live preview glyph.
 * Clicking it (or the preview) opens a searchable grid of every Material
 * Symbols icon name (sourced from fonts.google.com/icons), so the person
 * never has to type an icon name blind.
 */
export default function IconPicker({ value, onChange, label = 'Icon' }: IconPickerProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ICONS.slice(0, 120);
    return ICONS.filter(i => i.search.includes(q) || i.name.toLowerCase().includes(q)).slice(0, 120);
  }, [query]);

  return (
    <div className="space-y-2 relative">
      {label && <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">{label}</label>}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full flex items-center gap-3 bg-[#1a1a1a] border border-[#333] rounded-lg p-2.5 text-left hover:border-blue-500/50 transition-colors"
      >
        <div className="w-8 h-8 rounded-md bg-[#141414] border border-[#333] flex items-center justify-center text-blue-400 shrink-0 overflow-hidden">
          <MaterialIcon name={value} size={18} />
        </div>
        <span className="text-sm text-white truncate flex-1">{value || 'Pilih icon...'}</span>
        <Search size={14} className="text-gray-500 shrink-0" />
      </button>

      {open && (
        <div className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setOpen(false)}>
          <div
            className="bg-[#141414] border border-[#333] rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] flex flex-col overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-4 border-b border-[#333] flex items-center gap-3 bg-[#111]">
              <div className="flex-1 flex items-center gap-2 bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-2">
                <Search size={16} className="text-gray-500 shrink-0" />
                <input
                  autoFocus
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Cari icon... (misal: play, delete, timer)"
                  className="flex-1 bg-transparent text-sm text-white placeholder-gray-500 focus:outline-none"
                />
              </div>
              <button onClick={() => setOpen(false)} className="p-1 text-gray-400 hover:text-white shrink-0"><X size={20}/></button>
            </div>
            <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
              {results.length === 0 ? (
                <div className="text-sm text-gray-500 text-center py-10">Tidak ada icon ditemukan.</div>
              ) : (
                <div className="grid grid-cols-4 gap-2">
                  {results.map(icon => (
                    <button
                      key={icon.name}
                      onClick={() => { onChange(icon.name); setOpen(false); setQuery(''); }}
                      title={icon.name}
                      className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl border transition-colors ${value === icon.name ? 'border-blue-500 bg-blue-500/10' : 'border-transparent hover:bg-[#222] hover:border-[#333]'}`}
                    >
                      <MaterialIcon name={icon.name} size={22} className="text-gray-200" />
                      <span className="text-[9px] text-gray-500 leading-tight text-center truncate w-full">{icon.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="p-2.5 border-t border-[#333] bg-[#111] text-center text-[10px] text-gray-500">
              Sumber icon: fonts.google.com/icons
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
