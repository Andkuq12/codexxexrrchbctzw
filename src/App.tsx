import { useState } from 'react';
import { ModuleConfig, ModuleElement, ElementType } from './types';
import { generateLuaCode } from './lib/codeGen';
import {
  Type, Minus, Settings2, HelpCircle, 
  Hash, AlignLeft, SlidersHorizontal, 
  ChevronDown, ChevronRight, ChevronLeft, Plus, X, Search, Grid3x3, List, 
  MousePointerClick, ToggleLeft, Power, 
  FolderOpen, Zap, LayoutDashboard,
  Trash2, MoveUp, MoveDown, Download, Pencil,
  Menu as MenuIcon, Palette, ArrowLeft
} from 'lucide-react';
import IconPicker from './components/IconPicker';
import MaterialIcon from './components/MaterialIcon';

const PALETTE: { type: ElementType; label: string; icon: React.ReactNode; defaultProps: Partial<ModuleElement> }[] = [
  { type: 'labelapp', label: 'App Label', icon: <Type size={18} />, defaultProps: { text: 'New App Label', icon: 'Info' } },
  { type: 'label', label: 'Label', icon: <Type size={18} />, defaultProps: { text: 'Status: Idle' } },
  { type: 'divider', label: 'Divider', icon: <Minus size={18} />, defaultProps: {} },
  { type: 'tooltip', label: 'Tooltip', icon: <HelpCircle size={18} />, defaultProps: { text: 'Tip', support_text: 'Tooltip description', icon: 'Info' } },
  { type: 'input_int', label: 'Number Input', icon: <Hash size={18} />, defaultProps: { text: 'Number', alias: 'num', default: 0, icon: 'Numbers' } },
  { type: 'input_string', label: 'Text Input', icon: <AlignLeft size={18} />, defaultProps: { text: 'Text', alias: 'str', default: '', icon: 'Edit' } },
  { type: 'slider', label: 'Slider', icon: <SlidersHorizontal size={18} />, defaultProps: { text: 'Slider', alias: 'slider', min: 0, max: 100, default: 50, icon: 'Timer' } },
  { type: 'dropdown', label: 'Dropdown', icon: <ChevronDown size={18} />, defaultProps: { text: 'Options', alias: 'drop', default: 0, value: '["A", "B"]', icon: 'SwapHoriz' } },
  { type: 'item_picker', label: 'Item Picker', icon: <Search size={18} />, defaultProps: { text: 'Select Item', alias: 'item', default: 'Dirt', item: 'Dirt', icon: 'Inventory2' } },
  { type: 'tile_select', label: 'Tile Select', icon: <Grid3x3 size={18} />, defaultProps: { text: 'Select Tiles', alias: 'tiles', count: 5 } },
  { type: 'simple_display', label: 'Simple Display', icon: <List size={18} />, defaultProps: { text: 'List', alias: 'list', default: '["Item 1"]', icon: 'List' } },
  { type: 'button', label: 'Button', icon: <MousePointerClick size={18} />, defaultProps: { text: 'Action', alias: 'btn', icon: 'PlayArrow' } },
  { type: 'toggle', label: 'Toggle', icon: <ToggleLeft size={18} />, defaultProps: { text: 'Enable', alias: 'tog', default: false, icon: 'ToggleOn' } },
  { type: 'toggle_button', label: 'Toggle Button', icon: <Power size={18} />, defaultProps: { text: 'Start', alias: 'tbtn', default: false, icon: 'PlayCircle' } },
  { type: 'dialog', label: 'Dialog', icon: <FolderOpen size={18} />, defaultProps: { text: 'Advanced Settings', menu: [], fill: true } },
];

function App() {
  const [config, setConfig] = useState<ModuleConfig>({
    sub_name: 'Module Example - All Types',
    icon: 'Extension',
    menu: [
        { id: '1', type: 'labelapp', icon: 'Info', text: 'CONTOH SEMUA TIPE ELEMEN' },
        { id: '2', type: 'label', text: 'Status: Idle', alias: 'status_label' },
        { id: '3', type: 'divider' },
        { id: '4', type: 'tooltip', icon: 'Info', text: 'Tip', support_text: 'Script ini menunjukkan cara memakai dan menangani semua tipe elemen module sekaligus.' },
        { id: '5', type: 'divider' },
        { id: '6', type: 'labelapp', icon: 'EditNote', text: 'ELEMEN INPUT' },
        { id: '7', type: 'input_int', text: 'Nilai Angka', alias: 'number_value', default: 100, icon: 'Numbers', placeholder: 'Masukkan angka' },
        { id: '8', type: 'input_string', text: 'Nilai Teks', alias: 'text_value', default: '', icon: 'Edit', placeholder: 'Masukkan teks' },
        { id: '9', type: 'slider', text: 'Delay Aksi (ms)', alias: 'delay_value', min: 100, max: 1000, default: 250, icon: 'Timer' },
        { id: '10', type: 'dropdown', text: 'Mode Operasi', alias: 'mode_index', default: 0, value: '["Mode A","Mode B","Mode C"]', icon: 'SwapHoriz' },
        { id: '11', type: 'item_picker', text: 'Pilih Item', alias: 'picked_item', default: 'Dirt', item: 'Dirt', icon: 'Inventory2' },
        { id: '12', type: 'divider' },
        { id: '13', type: 'labelapp', icon: 'TouchApp', text: 'ELEMEN AKSI' },
        { id: '14', type: 'button', text: 'Jalankan Aksi', alias: 'run_action', icon: 'PlayArrow' },
        { id: '15', type: 'toggle', text: 'Aktifkan Fitur X', alias: 'feature_enabled', default: true, icon: 'ToggleOn', expandable: true, always_expand: false, background: true, list_child: [
            { id: '15-1', type: 'slider', text: 'Nilai Minimum', alias: 'min_value', min: 0, max: 100, default: 10 },
            { id: '15-2', type: 'slider', text: 'Nilai Maksimum', alias: 'max_value', min: 0, max: 200, default: 80 }
        ] },
        { id: '16', type: 'toggle_button', text: 'Start / Stop', alias: 'toggle_start', default: false, icon: 'PlayCircle' },
        { id: '17', type: 'divider' },
        { id: '18', type: 'labelapp', icon: 'List', text: 'ELEMEN LIST & TILE' },
        { id: '19', type: 'simple_display', icon: 'List', text: 'Daftar Item', description: 'Klik salah satu item untuk menghapusnya', alias: 'item_list', default: '["Item A", "Item B", "Item C"]', setup: false },
        { id: '20', type: 'tile_select', text: 'Pilih Tile', alias: 'tile_picker', count: 5, default: "[]" },
        { id: '21', type: 'divider' },
        { id: '22', type: 'dialog', text: 'Pengaturan Lanjutan', support_text: 'Contoh elemen dialog (nested menu)', fill: true, menu: [
            { id: '22-1', type: 'labelapp', icon: 'Tune', text: 'Isi Dialog' },
            { id: '22-2', type: 'label', text: 'Elemen apa pun bisa ditaruh di sini, termasuk dialog lain.' }
        ] },
        { id: '23', type: 'divider' },
        { id: '24', type: 'labelapp', icon: 'Code', text: 'Contoh Script Selesai' }
    ]
  });

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [aiStatus, setAiStatus] = useState<string>('');
  const [aiError, setAiError] = useState<string>('');
  const [loadingAi, setLoadingAi] = useState<'redesign' | 'tidy' | null>(null);
  const [lastConfigBackup, setLastConfigBackup] = useState<ModuleConfig | null>(null);
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');

  const addElement = (element: typeof PALETTE[0]) => {
    const newElement: ModuleElement = {
      id: Math.random().toString(36).substr(2, 9),
      type: element.type,
      ...element.defaultProps,
      alias: element.defaultProps.alias ? `${element.defaultProps.alias}` : undefined,
    };
    
    setConfig(prev => {
      const insertIntoMenu = (menu: ModuleElement[]): ModuleElement[] => {
        return menu.map(el => {
          if (el.id === activeMenuId) {
            if (el.type === 'toggle') {
              return { ...el, list_child: [...(el.list_child || []), newElement] };
            }
            return { ...el, menu: [...(el.menu || []), newElement] };
          }
          let updated = { ...el };
          if (updated.menu) {
            updated.menu = insertIntoMenu(updated.menu);
          }
          if (updated.list_child) {
            updated.list_child = insertIntoMenu(updated.list_child);
          }
          return updated;
        });
      };
      if (activeMenuId) {
        return { ...prev, menu: insertIntoMenu(prev.menu) };
      }
      return { ...prev, menu: [...prev.menu, newElement] };
    });
    setSelectedId(newElement.id);
  };

  const removeElement = (id: string) => {
    setConfig(prev => {
      const removeInMenu = (menu: ModuleElement[]): ModuleElement[] => {
        return menu.filter(el => el.id !== id).map(el => {
          if (el.menu) {
            return { ...el, menu: removeInMenu(el.menu) };
          }
          return el;
        });
      };
      return { ...prev, menu: removeInMenu(prev.menu) };
    });
    if (selectedId === id) setSelectedId(null);
    if (activeMenuId === id) setActiveMenuId(null);
  };

  const moveElement = (id: string, direction: 'up' | 'down') => {
    setConfig(prev => {
      const moveInMenu = (menu: ModuleElement[]): ModuleElement[] => {
        const index = menu.findIndex(el => el.id === id);
        if (index >= 0) {
          if (direction === 'up' && index === 0) return menu;
          if (direction === 'down' && index === menu.length - 1) return menu;
          const newMenu = [...menu];
          const swapIndex = direction === 'up' ? index - 1 : index + 1;
          [newMenu[index], newMenu[swapIndex]] = [newMenu[swapIndex], newMenu[index]];
          return newMenu;
        }
        return menu.map(el => {
          if (el.menu) {
            return { ...el, menu: moveInMenu(el.menu) };
          }
          return el;
        });
      };
      return { ...prev, menu: moveInMenu(prev.menu) };
    });
  };

  const updateElement = (id: string, updates: Partial<ModuleElement>) => {
    setConfig(prev => {
      const updateInMenu = (menu: ModuleElement[]): ModuleElement[] => {
        return menu.map(el => {
          if (el.id === id) {
            return { ...el, ...updates };
          }
          if (el.menu) {
            return { ...el, menu: updateInMenu(el.menu) };
          }
          return el;
        });
      };
      return { ...prev, menu: updateInMenu(prev.menu) };
    });
  };

  const runAIModuleMaker = async (mode: 'redesign' | 'tidy') => {
    setLoadingAi(mode);
    setAiError('');
    setAiStatus('');
    try {
      const res = await fetch('/api/ai/module-maker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config, mode })
      });
      const data = await res.json();
      if (data.error) {
        setAiError(data.error);
      } else if (data.config) {
        // Re-assign fresh internal React ids so selection/list_child logic stays consistent.
        const withIds = (elements: any[]): ModuleElement[] =>
          (elements || []).map((el: any) => ({
            ...el,
            id: Math.random().toString(36).slice(2),
            menu: el.menu ? withIds(el.menu) : undefined,
            list_child: el.list_child ? withIds(el.list_child) : undefined,
          }));
        setLastConfigBackup(config);
        setConfig({
          sub_name: data.config.sub_name || config.sub_name,
          icon: data.config.icon || config.icon,
          menu: withIds(data.config.menu),
        });
        setSelectedId(null);
        setActiveMenuId(null);
        setAiStatus(mode === 'redesign' ? 'Module berhasil didesain ulang.' : 'Module berhasil dirapikan.');
      }
    } catch (e) {
      setAiError('Gagal menghubungi AI. Pastikan GEMINI_API_KEY sudah diatur.');
    }
    setLoadingAi(null);
  };

  const undoAIModuleMaker = () => {
    if (lastConfigBackup) {
      setConfig(lastConfigBackup);
      setLastConfigBackup(null);
      setAiStatus('Perubahan AI dibatalkan.');
    }
  };

  const downloadCode = () => {
    const code = generateLuaCode(config);
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'module.lua';
    a.click();
    URL.revokeObjectURL(url);
  };

  const findElement = (menu: ModuleElement[], id: string | null): ModuleElement | undefined => {
    if (!id) return undefined;
    for (const el of menu) {
      if (el.id === id) return el;
      if (el.menu) {
        const found = findElement(el.menu, id);
        if (found) return found;
      }
      if (el.list_child) {
        const found = findElement(el.list_child, id);
        if (found) return found;
      }
    }
    return undefined;
  };

  const selectedElement = findElement(config.menu, selectedId);

  const getCurrentMenu = (menu: ModuleElement[], id: string | null): ModuleElement[] => {
    if (!id) return menu;
    for (const el of menu) {
      if (el.id === id) return el.menu || [];
      if (el.menu) {
        const found = getCurrentMenu(el.menu, id);
        if (found !== el.menu) return found;
      }
    }
    return menu;
  };
  
  const currentMenu = getCurrentMenu(config.menu, activeMenuId) || [];

  const [mobileTab, setMobileTab] = useState<'elements' | 'canvas' | 'properties'>('canvas');

  
  const renderPreviewElement = (el: ModuleElement) => {
    return (
      <>
        
                      
                      {el.type === 'labelapp' && (
                         <div className="flex items-center gap-3 py-1">
                           <div className="bg-blue-600 p-2 rounded-lg text-white"><MaterialIcon name={el.icon} size={18}/></div>
                           <span className="font-bold uppercase tracking-wider text-sm text-white">{el.text}</span>
                         </div>
                      )}
                      
                      {el.type === 'label' && (
                        <div className="font-semibold text-sm text-white py-1">{el.text}</div>
                      )}
                      
                      {el.type === 'divider' && (
                        <div className="h-[2px] bg-[#6366f1] w-full my-3"></div>
                      )}
                      
                      {el.type === 'tooltip' && (
                        <div className="flex items-start gap-3 py-1">
                           <div className="bg-[#2a2b3d] p-2.5 rounded-xl text-gray-300 shrink-0"><MaterialIcon name={el.icon} size={20}/></div>
                           <div className="flex flex-col gap-0.5 min-w-0">
                             <div className="font-bold text-sm text-white">{el.text}</div>
                             <p className="text-xs text-gray-500">{el.support_text}</p>
                           </div>
                        </div>
                      )}
                      
                      {el.type === 'toggle' && (
                        <div className="py-2">
                          <div className="flex justify-between items-center cursor-pointer mb-2" onClick={(e) => { e.stopPropagation(); updateElement(el.id, { default: !el.default }); setSelectedId(el.id); }}>
                            <span className="text-sm font-bold text-white">{el.text}</span>
                            <div className={`w-11 h-6 rounded-full relative transition-colors ${el.default ? 'bg-indigo-500' : 'bg-[#333]'}`}>
                              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${el.default ? 'right-1' : 'left-1'}`}></div>
                            </div>
                          </div>
                          {el.expandable && el.list_child && el.list_child.length > 0 && (el.default || el.always_expand) && (
                            <div className={`space-y-1 mt-3 relative ${el.background ? "bg-[#111] border border-[#333] rounded-xl p-2 shadow-inner" : "p-1"}`}>
                               {el.list_child.map(child => (
                                  <div 
                                    key={child.id} 
                                    onClick={(e) => { e.stopPropagation(); setSelectedId(child.id); }}
                                    className={`relative rounded-xl p-3 transition-all cursor-pointer border ${selectedId === child.id ? 'border-blue-500 bg-blue-500/10' : 'border-transparent hover:bg-[#222]'}`}
                                  >
                                    {renderPreviewElement(child)}
                                  </div>
                               ))}
                            </div>
                          )}
                        </div>
                      )}
                      
                      {el.type === 'toggle_button' && (
                        <div className="py-2">
                          <button onClick={(e) => { e.stopPropagation(); updateElement(el.id, { default: !el.default }); setSelectedId(el.id); }} className={`w-full font-bold py-3 rounded-xl text-sm transition-colors border ${el.default ? 'bg-blue-600 text-white border-blue-500' : 'bg-[#1a1a1a] text-gray-400 border-[#333] hover:bg-[#222]'}`}>
                            {el.text}
                          </button>
                        </div>
                      )}

                      {el.type === 'dialog' && (
                        <div className="bg-[#1a1b26] rounded-2xl p-4 flex items-center gap-3 cursor-pointer border border-[#2a2b3d] hover:border-[#3a3b50] transition-colors" onClick={(e) => { e.stopPropagation(); setActiveMenuId(el.id); setSelectedId(el.id); }}>
                          <ChevronRight size={18} className="text-gray-300" />
                          <div>
                            <div className="font-bold text-white text-sm tracking-wide mb-0.5">{el.text}</div>
                            {el.support_text && <div className="text-xs text-gray-400">{el.support_text}</div>}
                          </div>
                        </div>
                      )}
                      
                      {el.type === 'button' && (
                        <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl text-sm mt-2 transition-colors">
                          {el.text}
                        </button>
                      )}
                      
                      {el.type === 'input_int' && (
                        <div className="space-y-2 py-1">
                          <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">{el.text}</span>
                          <div className="flex h-12">
                            <div className="bg-blue-600 w-12 rounded-l-xl flex items-center justify-center text-white"><MaterialIcon name={el.icon || 'numbers'} size={20}/></div>
                            <input disabled type="text" value={el.default} className="bg-[#1a1a1a] border border-[#333] border-l-0 rounded-r-xl w-full px-4 text-sm text-white focus:outline-none" />
                          </div>
                        </div>
                      )}
                      
                      {el.type === 'input_string' && (
                        <div className="space-y-2 py-1">
                          <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">{el.text}</span>
                          <div className="flex h-12">
                            <div className="bg-blue-600 w-12 rounded-l-xl flex items-center justify-center text-white"><MaterialIcon name={el.icon || 'text_fields'} size={20}/></div>
                            <input disabled type="text" placeholder={el.placeholder || "Enter text"} value={el.default} className="bg-[#1a1a1a] border border-[#333] border-l-0 rounded-r-xl w-full px-4 text-sm text-white focus:outline-none" />
                          </div>
                        </div>
                      )}

                      {el.type === 'slider' && (
                        <div className="space-y-2 py-1">
                           <span className="text-sm font-bold text-gray-300">{el.text}</span>
                           <div className="flex items-center gap-3">
                             <span className="text-xs text-gray-500">{el.min || 0}</span>
                             <div className="flex-1 h-2 bg-[#222] rounded-full relative">
                               <div className="absolute top-0 left-0 h-full bg-indigo-500 rounded-full" style={{width: '50%'}}></div>
                               <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-white rounded-full shadow"></div>
                             </div>
                             <span className="text-xs text-gray-500">{el.max || 100}</span>
                           </div>
                           <div className="text-xs text-indigo-400 mt-1">Current: {el.default || 0}</div>
                        </div>
                      )}

                      {el.type === 'dropdown' && (
                        <div className="space-y-2 py-1">
                          <span className="text-sm font-bold text-white tracking-wide">{el.text}</span>
                          <div className="bg-[#1a1b26] rounded-xl p-3 flex justify-between items-center text-sm text-white font-medium border border-[#2a2b3d]">
                            <span>{(() => {
                               try {
                                 const arr = JSON.parse(el.value || '[]');
                                 return arr[el.default as number || 0] || 'Select...';
                               } catch(e) { return 'Select...'; }
                            })()}</span>
                            <div className="w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-b-4 border-b-white"></div>
                          </div>
                          {selectedId === el.id && (
                            <div className="bg-[#1a1b26] rounded-xl p-2 border border-[#2a2b3d] mt-1 space-y-1">
                               {(() => {
                                  try {
                                    const arr = JSON.parse(el.value || '[]');
                                    return arr.map((opt: string, i: number) => (
                                      <div key={i} className={`p-2 rounded-lg text-sm font-medium ${i === (el.default as number || 0) ? 'text-indigo-400' : 'text-white'}`}>
                                        {opt}
                                      </div>
                                    ));
                                  } catch(e) { return null; }
                               })()}
                            </div>
                          )}
                        </div>
                      )}

                      {el.type === 'item_picker' && (
                        <div className="bg-[#1a1b26] rounded-2xl p-4 flex justify-between items-center my-2 border border-[#2a2b3d]">
                           <div>
                             <div className="font-bold text-white text-sm tracking-wide mb-1">{el.text}</div>
                             <div className="text-xs text-gray-400">{el.default || 'None'}</div>
                           </div>
                           <div className="bg-indigo-500 p-2.5 rounded-full text-white cursor-pointer hover:bg-indigo-400 transition-colors">
                             <Pencil size={16} />
                           </div>
                        </div>
                      )}
                      
                      {el.type === 'simple_display' && (
                        <div className="py-2">
                          <div className="font-bold text-white text-sm tracking-wide mb-1">{el.text}</div>
                          {el.description && <div className="text-xs text-gray-400 mb-4">{el.description}</div>}
                          <div className="space-y-4 pl-2">
                             {(() => {
                               try {
                                 const arr = JSON.parse(el.default as string || '[]');
                                 return arr.map((item: string, i: number) => (
                                   <div key={i} className="flex items-center gap-3 text-white text-sm font-medium cursor-pointer hover:text-indigo-300 transition-colors">
                                     <List size={18} className="text-gray-300" />
                                     {item}
                                   </div>
                                 ));
                               } catch(e) { return <div className="text-xs text-gray-500">No items</div>; }
                             })()}
                          </div>
                        </div>                      )}
                      {el.type === 'tile_select' && (
                        <div className="py-2">
                          <div className="font-bold text-white text-sm tracking-wide mb-3">{el.text}</div>
                          <div className="overflow-auto w-full custom-scrollbar pb-2">
                            <div className="grid gap-1.5 w-fit bg-[#141414] p-2 rounded-xl inline-grid" style={{ gridTemplateColumns: `repeat(${Math.min(el.count || 5, 50)}, minmax(0, 1fr))` }}>
                              {Array.from({length: Math.pow(Math.min(el.count || 5, 50), 2)}).map((_, i) => (
                                <div key={i} className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg cursor-pointer transition-colors ${i === Math.floor(Math.pow(Math.min(el.count || 5, 50), 2) / 2) ? 'bg-indigo-500' : 'bg-[#1a1b26] hover:bg-[#2a2b3d]'}`}></div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
      </>
    );
  };

  const [modulePanelOpen, setModulePanelOpen] = useState(true);
  const [railTab, setRailTab] = useState<'menu' | 'pref' | 'theme'>('menu');
  const [themeColors, setThemeColors] = useState<{ name: string; hex: string }[]>([
    { name: 'GrowLauncher Default Theme', hex: '766bff' },
    { name: 'Cute Theme', hex: 'ff1985' },
    { name: 'Ghost Theme', hex: '71ff19' },
    { name: 'Orange Theme', hex: 'fc7100' },
    { name: 'Night Theme', hex: 'ff3bfc' },
    { name: 'Rose Theme', hex: 'ff2239' },
    { name: 'Blue Rose Theme', hex: '766bff' },
  ]);
  const [activeThemeHex, setActiveThemeHex] = useState('766bff');
  const [newThemeName, setNewThemeName] = useState('');
  const [newThemeHex, setNewThemeHex] = useState('');

  const railTabs: { id: 'menu' | 'pref' | 'theme'; label: string; icon: React.ReactNode }[] = [
    { id: 'menu', label: 'Menu', icon: <MenuIcon size={18} /> },
    { id: 'pref', label: 'Pref', icon: <Grid3x3 size={18} /> },
    { id: 'theme', label: 'Theme', icon: <Palette size={18} /> },
  ];

  return (
    <div
      className="flex flex-col md:flex-row h-screen text-gray-300 font-sans overflow-hidden relative bg-[#0a0a0a] bg-cover bg-center"
      style={{ backgroundImage: "url('/background.png')" }}
    >
      <div className="absolute inset-0 bg-[#0a0a0a]/75 pointer-events-none" />

      {/* ICON RAIL: desktop/landscape only, mirrors BotHax-style app shell */}
      <div className="hidden md:flex md:flex-col md:items-center md:w-16 bg-black/90 backdrop-blur-sm border-r border-[#1c1c1c] shrink-0 py-4 gap-1 relative z-10">
        {railTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => { setRailTab(tab.id); setModulePanelOpen(true); }}
            title={tab.label}
            className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-colors ${railTab === tab.id && modulePanelOpen ? 'bg-[color:var(--color-blue-600)] text-white' : 'text-gray-500 hover:text-white hover:bg-[#1a1a1a]'}`}
          >
            {tab.icon}
          </button>
        ))}
        <div className="flex flex-col items-center gap-3 -mt-1">
          {railTabs.map(tab => (
            <span key={tab.id} className={`text-[10px] leading-none w-11 text-center ${railTab === tab.id && modulePanelOpen ? 'text-[color:var(--color-blue-400)] font-medium' : 'text-gray-600'}`}>{tab.label}</span>
          ))}
        </div>
        <div className="flex-1" />
        <button className="w-11 h-11 rounded-full flex items-center justify-center text-gray-500 hover:text-white hover:bg-[#1a1a1a] transition-colors">
          <FolderOpen size={18} />
        </button>
      </div>

      {/* SECOND COLUMN: content depends on rail tab (Menu / Pref / Theme) */}
      <div className={`
        fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity ${(mobileTab === 'elements' || mobileTab === 'properties') ? 'opacity-100' : 'opacity-0 pointer-events-none'} md:opacity-100 md:relative md:flex md:w-72 md:bg-black/80 md:backdrop-blur-sm md:pointer-events-auto md:border-r md:border-[#1c1c1c] shrink-0 shadow-lg
        ${modulePanelOpen ? '' : 'md:hidden'}
      `} onClick={(e) => { if (e.target === e.currentTarget) setMobileTab('canvas') }}>
        <div className={`
          absolute bottom-0 left-0 right-0 bg-[#141414] rounded-t-2xl shadow-2xl transform transition-transform duration-300 max-h-[85vh] flex flex-col
          ${(mobileTab === 'elements' || mobileTab === 'properties') ? 'translate-y-0' : 'translate-y-full'} 
          md:translate-y-0 md:static md:h-full md:rounded-none md:bg-transparent w-full
        `}>

          {/* MENU tab: module list + add-element palette */}
          {railTab === 'menu' && (
            <>
              <div className="p-4 border-b border-[#333] flex justify-between items-center bg-[#111]">
                <h2 className="font-bold flex items-center gap-2 tracking-tight"><MenuIcon size={18} className="text-blue-500"/> Module</h2>
                <button className="md:hidden p-1 text-gray-400" onClick={() => setMobileTab('canvas')}><X size={20}/></button>
              </div>
              <div className="p-3 space-y-2 border-b border-[#222]">
                <button className="w-full flex items-center gap-3 p-3 bg-[#1a1a1a] hover:bg-[#222] border border-[#333] rounded-xl transition-all text-left group opacity-70">
                  <div className="bg-[#141414] p-2 rounded-lg text-gray-400 border border-[#333]">
                    <Settings2 size={18} />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-gray-200">Lua Manager</div>
                    <div className="text-[10px] text-gray-500">Execute lua script</div>
                  </div>
                </button>
                <button className="w-full flex items-center gap-3 p-3 bg-blue-600 hover:bg-blue-500 border border-blue-500 rounded-xl transition-all text-left group">
                  <div className="bg-white/10 p-2 rounded-lg text-white">
                    <Grid3x3 size={18} />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-white">{config.sub_name}</div>
                    <div className="text-[10px] text-white/70">{config.icon || 'No description.'}</div>
                  </div>
                </button>
              </div>
              <div className="px-4 pt-3 pb-1 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Add Element</div>
              <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
                {PALETTE.map(el => (
                  <button 
                    key={el.type} 
                    onClick={() => addElement(el)}
                    className="w-full flex items-center gap-3 p-3 bg-[#1a1a1a] hover:bg-[#222] border border-[#333] rounded-xl transition-all hover:border-blue-500/50 text-left group"
                  >
                    <div className="bg-[#141414] p-2 rounded-lg text-gray-400 group-hover:text-blue-400 transition-colors border border-[#333] group-hover:border-blue-500/30">
                      {el.icon}
                    </div>
                    <div>
                      <div className="font-bold text-sm text-gray-200">{el.label}</div>
                      <div className="text-[10px] text-gray-500 uppercase tracking-wider">{el.type}</div>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}

          {/* PREF tab: per-element / module settings (Properties) */}
          {railTab === 'pref' && (
            <>
              <div className="p-4 border-b border-[#333] flex justify-between items-center bg-[#111]">
                <h2 className="font-bold flex items-center gap-2 tracking-tight"><Grid3x3 size={18} className="text-blue-500"/> Pref</h2>
                <button className="md:hidden p-1 text-gray-400" onClick={() => setMobileTab('canvas')}><X size={20}/></button>
              </div>
              <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar">
                {!selectedElement ? (
                  <div className="space-y-5">
                    <div className="text-sm text-gray-400 p-3 bg-[#141414] rounded-lg border border-[#333]">
                      Select an element on the canvas to edit its properties, or edit global settings below.
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Module Title</label>
                      <input 
                        type="text" 
                        value={config.sub_name} 
                        onChange={e => setConfig({...config, sub_name: e.target.value})}
                        className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg p-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-shadow"
                      />
                    </div>
                    <IconPicker
                      label="Module Icon"
                      value={config.icon}
                      onChange={val => setConfig({...config, icon: val})}
                    />
                  </div>
                ) : (
                  <div className="space-y-5 animate-in slide-in-from-right-4 duration-200">
                    <div className="flex items-center gap-2 pb-2 border-b border-[#333]">
                      <div className="bg-blue-500/20 text-blue-400 p-1.5 rounded-md">
                        <MaterialIcon name={selectedElement.icon} size={16} />
                      </div>
                      <span className="font-bold text-white uppercase text-sm tracking-wider">{selectedElement.type}</span>
                    </div>

                    {selectedElement.text !== undefined && (
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Text / Label</label>
                        <input 
                          type="text" 
                          value={selectedElement.text} 
                          onChange={e => updateElement(selectedElement.id, { text: e.target.value })}
                          className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg p-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-shadow"
                        />
                      </div>
                    )}

                    {selectedElement.support_text !== undefined && (
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Support Text</label>
                        <textarea 
                          value={selectedElement.support_text} 
                          onChange={e => updateElement(selectedElement.id, { support_text: e.target.value })}
                          className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg p-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-shadow resize-none h-20"
                        />
                      </div>
                    )}

                    {selectedElement.alias !== undefined && (
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Alias (Base Name)</label>
                        <input 
                          type="text" 
                          value={selectedElement.alias} 
                          onChange={e => updateElement(selectedElement.id, { alias: e.target.value })}
                          className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg p-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-shadow font-mono"
                        />
                        <p className="text-[11px] text-gray-500 leading-tight">Must be unique. A random ID will be appended automatically in Lua to prevent collisions.</p>
                      </div>
                    )}

                    {selectedElement.default !== undefined && (
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Default Value</label>
                        {typeof selectedElement.default === 'boolean' ? (
                          <div className="flex items-center gap-3 bg-[#1a1a1a] border border-[#333] p-2.5 rounded-lg">
                            <input 
                              type="checkbox"
                              checked={selectedElement.default}
                              onChange={e => updateElement(selectedElement.id, { default: e.target.checked })}
                              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 bg-[#1a1a1a] border-[#333]"
                            />
                            <span className="text-sm">Enabled by default</span>
                          </div>
                        ) : (
                          <input 
                            type={typeof selectedElement.default === 'number' ? 'number' : 'text'} 
                            value={selectedElement.default.toString()} 
                            onChange={e => {
                              const val = e.target.value;
                              const parsed = typeof selectedElement.default === 'number' ? Number(val) : val;
                              updateElement(selectedElement.id, { default: parsed });
                            }}
                            className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg p-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-shadow"
                          />
                        )}
                      </div>
                    )}

                    {selectedElement.value !== undefined && (
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Value (Options Array)</label>
                        <input 
                          type="text" 
                          value={selectedElement.value} 
                          onChange={e => updateElement(selectedElement.id, { value: e.target.value })}
                          className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg p-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-shadow font-mono"
                          placeholder='e.g. ["Option A", "Option B"]'
                        />
                        <p className="text-[11px] text-gray-500 leading-tight">For dropdowns/lists. Must be a valid JSON array format.</p>
                      </div>
                    )}

                    {selectedElement.type === 'slider' && (
                      <div className="flex gap-3">
                         <div className="space-y-2 flex-1">
                          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Min</label>
                          <input type="number" value={selectedElement.min || 0} onChange={e => updateElement(selectedElement.id, { min: Number(e.target.value) })} className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg p-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"/>
                        </div>
                        <div className="space-y-2 flex-1">
                          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Max</label>
                          <input type="number" value={selectedElement.max || 100} onChange={e => updateElement(selectedElement.id, { max: Number(e.target.value) })} className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg p-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"/>
                        </div>
                      </div>
                    )}

                    {['toggle'].includes(selectedElement.type) && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between bg-[#1a1a1a] border border-[#333] p-3 rounded-lg">
                          <div>
                            <div className="text-sm font-bold text-white">Expandable</div>
                            <div className="text-[11px] text-gray-500">Allow nested children list</div>
                          </div>
                          <input 
                            type="checkbox"
                            checked={!!selectedElement.expandable}
                            onChange={e => updateElement(selectedElement.id, { expandable: e.target.checked })}
                            className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 bg-[#141414] border-[#333]"
                          />
                        </div>
                        {selectedElement.expandable && (
                          <div className="flex items-center justify-between bg-[#1a1a1a] border border-[#333] p-3 rounded-lg">
                            <div>
                              <div className="text-sm font-bold text-white">Always Expand</div>
                              <div className="text-[11px] text-gray-500">Force children to always show</div>
                            </div>
                            <input 
                              type="checkbox"
                              checked={!!selectedElement.always_expand}
                              onChange={e => updateElement(selectedElement.id, { always_expand: e.target.checked })}
                              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 bg-[#141414] border-[#333]"
                            />
                          </div>
                        )}
                        <div className="flex items-center justify-between bg-[#1a1a1a] border border-[#333] p-3 rounded-lg">
                          <div>
                            <div className="text-sm font-bold text-white">Background</div>
                            <div className="text-[11px] text-gray-500">Render background for children</div>
                          </div>
                          <input 
                            type="checkbox"
                            checked={!!selectedElement.background}
                            onChange={e => updateElement(selectedElement.id, { background: e.target.checked })}
                            className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 bg-[#141414] border-[#333]"
                          />
                        </div>
                      </div>
                    )}

                    {['toggle'].includes(selectedElement.type) && (
                        <div className="mt-4 mb-4">
                          <button onClick={() => setActiveMenuId(selectedElement.id)} className="w-full bg-[#2a2b3d] hover:bg-[#3a3b50] text-white font-bold py-2 rounded-lg text-sm transition-colors flex items-center justify-center gap-2 border border-[#3a3b50]">
                             <FolderOpen size={16} /> Edit Nested Items
                          </button>
                        </div>
                      )}
                      {selectedElement.icon !== undefined && (
                      <IconPicker
                        label="Icon"
                        value={selectedElement.icon}
                        onChange={val => updateElement(selectedElement.id, { icon: val })}
                      />
                    )}
                  </div>
                )}
              </div>

              {/* AI Module Maker Panel */}
              <div className="border-t border-[#333] p-5 bg-[#141414] space-y-3">
                <h3 className="font-bold flex items-center gap-2 text-sm text-white"><Zap size={16} className="text-blue-400 fill-blue-400/20" /> AI Module Maker</h3>
                <p className="text-xs text-gray-500 leading-snug">AI akan membangun ulang tampilan module ini. Alias & tipe elemen yang sudah ada tetap dipertahankan supaya logic Lua kamu tidak rusak.</p>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => runAIModuleMaker('redesign')}
                    disabled={loadingAi !== null}
                    className="flex flex-col items-start gap-0.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 border border-blue-500 text-white text-left px-3 py-2.5 rounded-lg transition-colors"
                  >
                    <span className="text-xs font-bold">{loadingAi === 'redesign' ? 'Mendesain...' : 'Desain Ulang'}</span>
                    <span className="text-[10px] text-white/70 leading-tight">Bangun ulang tampilan lebih bagus</span>
                  </button>
                  <button
                    onClick={() => runAIModuleMaker('tidy')}
                    disabled={loadingAi !== null}
                    className="flex flex-col items-start gap-0.5 bg-[#1a1a1a] hover:bg-[#222] disabled:opacity-50 border border-[#333] text-white text-left px-3 py-2.5 rounded-lg transition-colors"
                  >
                    <span className="text-xs font-bold">{loadingAi === 'tidy' ? 'Merapikan...' : 'Rapikan Saja'}</span>
                    <span className="text-[10px] text-gray-400 leading-tight">Tata ulang & rapihkan sedikit</span>
                  </button>
                </div>

                {aiError && (
                  <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-2.5">{aiError}</div>
                )}
                {aiStatus && !aiError && (
                  <div className="flex items-center justify-between text-xs text-blue-300 bg-blue-500/10 border border-blue-500/20 rounded-lg p-2.5">
                    <span>{aiStatus}</span>
                    {lastConfigBackup && (
                      <button onClick={undoAIModuleMaker} className="underline hover:text-blue-200 shrink-0 ml-2">Undo</button>
                    )}
                  </div>
                )}
              </div>
            </>
          )}

          {/* THEME tab: web-wide custom theme, not module-related (this is NOT module config) */}
          {railTab === 'theme' && (
            <>
              <div className="p-4 border-b border-[#333] flex items-center gap-3 bg-[#111]">
                <button className="p-1 text-gray-400 hover:text-white" onClick={() => setRailTab('menu')}><ArrowLeft size={20}/></button>
                <h2 className="font-bold tracking-tight text-lg">Theme</h2>
              </div>
              <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar">
                <div>
                  <h3 className="text-2xl font-extrabold text-white leading-tight">Custom your<br/><span className="text-blue-500">Theme</span></h3>
                  <p className="text-sm text-gray-400 mt-2">Design user interface with your own hex color</p>
                </div>

                <div className="flex items-center gap-3 bg-[#1a1a1a] border border-[#333] rounded-xl p-3">
                  <div className="w-9 h-9 rounded-lg shrink-0 flex items-center justify-center" style={{ backgroundColor: `#${activeThemeHex}` }}>
                    <Palette size={16} className="text-white/80" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-bold" style={{ color: `#${activeThemeHex}` }}>Hello im PowerKuy</div>
                    <div className="text-xs text-gray-500 truncate">This is preview example... <span style={{ color: `#${activeThemeHex}` }}>{activeThemeHex}</span></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Theme name"
                    value={newThemeName}
                    onChange={e => setNewThemeName(e.target.value)}
                    className="w-full bg-transparent border border-[#3a3b50] rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Hex Color"
                      value={newThemeHex}
                      onChange={e => setNewThemeHex(e.target.value.replace('#', ''))}
                      className="flex-1 min-w-0 bg-transparent border border-[#3a3b50] rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors font-mono"
                      maxLength={8}
                    />
                    <button
                      onClick={() => {
                        const hex = newThemeHex.replace('#', '').trim();
                        const name = newThemeName.trim();
                        if (!hex || !name) return;
                        const clean = hex.length === 8 ? hex.slice(2) : hex;
                        setThemeColors(prev => [{ name, hex: clean }, ...prev]);
                        setActiveThemeHex(clean);
                        setNewThemeName('');
                        setNewThemeHex('');
                      }}
                      className="w-11 h-11 shrink-0 rounded-full bg-blue-500 hover:bg-blue-400 text-white flex items-center justify-center transition-colors shadow-lg shadow-blue-900/40"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-white mb-3">Saved color</h4>
                  <div className="space-y-4">
                    {themeColors.map((t, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveThemeHex(t.hex)}
                        className="w-full flex items-center gap-3 text-left group"
                      >
                        <div className="w-9 h-9 rounded-full bg-[#1a1a1a] border border-[#333] flex items-center justify-center shrink-0" style={{ color: `#${t.hex}` }}>
                          <Palette size={16} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className={`text-sm font-bold truncate ${t.hex === activeThemeHex ? '' : 'text-gray-200'}`} style={t.hex === activeThemeHex ? { color: `#${t.hex}` } : undefined}>{t.name}</div>
                          <div className="text-[11px] text-gray-500 font-mono">0x{t.hex.toUpperCase()}FF</div>
                        </div>
                        <List size={16} className="text-gray-600 shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* MIDDLE: Canvas / Preview */}
      <div className="flex-1 flex flex-col bg-[#141414]/90 relative h-full w-full">
        {/* MOBILE FABs */}
        <div className="fixed bottom-6 right-6 md:hidden flex flex-col gap-3 z-50">
           <button onClick={() => { setRailTab('menu'); setMobileTab('elements'); }} className="w-12 h-12 bg-[#1a1b26] border border-[#3a3b50] rounded-full flex items-center justify-center text-white shadow-lg shadow-black/50 hover:bg-[#2a2b3d] transition-colors relative">
              <Plus size={20} />
           </button>
           <button onClick={() => { setRailTab('pref'); setMobileTab('properties'); }} className="w-12 h-12 bg-[#1a1b26] border border-[#3a3b50] rounded-full flex items-center justify-center text-white shadow-lg shadow-black/50 hover:bg-[#2a2b3d] transition-colors relative">
              <Settings2 size={20} />
           </button>
        </div>

        {/* Top Bar */}
        <div className="h-14 border-b border-[#222] bg-[#111]/90 backdrop-blur-sm flex items-center justify-between px-4 shrink-0 gap-3 overflow-hidden">
          <div className="flex items-center gap-3 min-w-0 flex-1">
             <button onClick={() => { setRailTab('menu'); setModulePanelOpen(true); }} className="hidden md:flex w-8 h-8 rounded-lg bg-[#1a1a1a] hover:bg-[#222] border border-[#333] items-center justify-center text-gray-400 hover:text-white transition-colors shrink-0" title="Elements">
               <Grid3x3 size={16}/>
             </button>
             <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-900/50 shrink-0"><Settings2 size={16}/></div>
             <div className="min-w-0">
               <h1 className="font-bold text-white leading-tight truncate">{config.sub_name}</h1>
               <div className="text-[10px] text-gray-500 font-mono">Module Editor</div>
             </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button className="flex items-center gap-2 bg-[#1a1a1a] hover:bg-[#222] border border-[#333] px-3 py-1.5 rounded-lg text-sm font-medium transition-colors" onClick={() => {
              const code = generateLuaCode(config);
              console.log(code);
              alert("Lua code printed to console! Check DevTools.");
            }}>
              <Download size={16}/> <span className="hidden sm:inline">Export Lua</span>
            </button>
            <button onClick={() => setModulePanelOpen(o => !o)} className="hidden md:flex w-8 h-8 rounded-lg bg-[#1a1a1a] hover:bg-[#222] border border-[#333] items-center justify-center text-gray-400 hover:text-white transition-colors" title="Toggle module list">
              <List size={16}/>
            </button>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 custom-scrollbar bg-[radial-gradient(#222_1px,transparent_1px)] [background-size:20px_20px]" onClick={() => setSelectedId(null)}>
          <div className="max-w-md mx-auto min-h-[500px] bg-[#141414] border border-[#333] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            
            {/* Header / Banner */}
            <div className="bg-[#1a1a1a] border-b border-[#333] p-4 flex items-center gap-3">
               <div className="w-10 h-10 bg-[#222] rounded-xl flex items-center justify-center text-blue-400 border border-[#333]"><Settings2 size={20}/></div>
               <div>
                 <h2 className="font-bold text-white text-lg">{config.sub_name}</h2>
                 <p className="text-xs text-gray-500 uppercase tracking-wider">{config.icon}</p>
               </div>
            </div>

            {/* Menu Items */}
            <div className="flex-1 p-3 space-y-2">
              {activeMenuId && (
                  <button onClick={() => setActiveMenuId(null)} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white p-2 mb-2 w-full transition-colors font-medium bg-[#141414] rounded-lg border border-[#333]">
                     <ChevronLeft size={16}/> Back to Main Menu
                  </button>
              )}
              
              {currentMenu.length === 0 ? (
                <div className="h-40 flex flex-col items-center justify-center text-gray-500 border-2 border-dashed border-[#333] rounded-xl m-2">
                   <FolderOpen size={32} className="mb-2 opacity-50" />
                   <p className="text-sm">No items yet.</p>
                   <p className="text-xs opacity-60">Add elements from the left panel.</p>
                </div>
              ) : (
                currentMenu.map((el, i) => (
                  <div 
                    key={el.id} 
                    onClick={(e) => { e.stopPropagation(); setSelectedId(el.id); }}
                    className={`relative rounded-xl p-3 transition-all cursor-pointer border ${selectedId === el.id ? 'border-blue-500 bg-blue-500/10' : 'border-transparent hover:bg-[#1a1a1a]'}`}
                  >
                    {/* Render Content */}
                    {renderPreviewElement(el)}
                    
                    {/* Controls Overlay */}
                    {selectedId === el.id && (
                      <div className="absolute right-2 top-2 flex items-center bg-[#111] rounded-lg border border-[#333] shadow-xl overflow-hidden">
                        <button onClick={(e) => { e.stopPropagation(); moveElement(el.id, 'up'); }} disabled={i === 0} className="p-1.5 hover:bg-[#222] text-gray-400 hover:text-white disabled:opacity-30"><MoveUp size={14}/></button>
                        <button onClick={(e) => { e.stopPropagation(); moveElement(el.id, 'down'); }} disabled={i === currentMenu.length - 1} className="p-1.5 hover:bg-[#222] text-gray-400 hover:text-white disabled:opacity-30 border-l border-[#333]"><MoveDown size={14}/></button>
                        <button onClick={(e) => { e.stopPropagation(); removeElement(el.id); }} className="p-1.5 hover:bg-red-500/20 text-red-400 hover:text-red-300 border-l border-[#333]"><Trash2 size={14}/></button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default App;
