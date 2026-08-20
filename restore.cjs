const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const missingChunk = `                      )}
      </>
    );
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#0a0a0a] text-gray-300 font-sans overflow-hidden">
      
      {/* LEFT SIDEBAR: Palette */}
      <div className={\`
        fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity \${mobileTab === 'elements' ? 'opacity-100' : 'opacity-0 pointer-events-none'} md:opacity-100 md:relative md:flex md:w-64 md:bg-[#111] md:pointer-events-auto md:border-r md:border-[#222] shrink-0 shadow-lg
      \`} onClick={(e) => { if (e.target === e.currentTarget) setMobileTab('canvas') }}>
        <div className={\`
          absolute bottom-0 left-0 right-0 bg-[#141414] rounded-t-2xl shadow-2xl transform transition-transform duration-300 max-h-[85vh] flex flex-col
          \${mobileTab === 'elements' ? 'translate-y-0' : 'translate-y-full'} 
          md:translate-y-0 md:static md:h-full md:rounded-none md:bg-[#111] w-full
        \`}>
          <div className="p-4 border-b border-[#333] flex justify-between items-center bg-[#111]">
            <h2 className="font-bold flex items-center gap-2 tracking-tight"><Grid3x3 size={18} className="text-blue-500"/> Elements</h2>
            <button className="md:hidden p-1 text-gray-400" onClick={() => setMobileTab('canvas')}><X size={20}/></button>
          </div>
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
        </div>
      </div>

      {/* MIDDLE: Canvas / Preview */}
      <div className="flex-1 flex flex-col bg-[#141414] relative h-full w-full">
        {/* MOBILE FABs */}
        <div className="fixed bottom-6 right-6 md:hidden flex flex-col gap-3 z-50">
           <button onClick={() => setMobileTab('properties')} className="w-12 h-12 bg-[#1a1b26] border border-[#3a3b50] rounded-full flex items-center justify-center text-white shadow-lg shadow-black/50 hover:bg-[#2a2b3d] transition-colors relative">
              <Settings2 size={20} />
           </button>
        </div>

        {/* Top Bar */}
        <div className="h-14 border-b border-[#222] bg-[#111] flex items-center justify-between px-4 shrink-0">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-900/50"><Settings2 size={16}/></div>
             <div>
               <h1 className="font-bold text-white leading-tight">{config.sub_name}</h1>
               <div className="text-[10px] text-gray-500 font-mono">Module Editor</div>
             </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 bg-[#1a1a1a] hover:bg-[#222] border border-[#333] px-3 py-1.5 rounded-lg text-sm font-medium transition-colors" onClick={() => {
              const code = generateLuaCode(config);
              console.log(code);
              alert("Lua code printed to console! Check DevTools.");
            }}>
              <Download size={16}/> <span className="hidden sm:inline">Export Lua</span>
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
                    className={\`relative rounded-xl p-3 transition-all cursor-pointer border \${selectedId === el.id ? 'border-blue-500 bg-blue-500/10' : 'border-transparent hover:bg-[#1a1a1a]'}\`}
                  >
                    {/* Render Content */}
                    {renderPreviewElement(el)}
                    
                    {/* Controls Overlay */}
                    {selectedId === el.id && (
                      <div className="absolute right-2 top-2 flex items-center bg-[#111] rounded-lg border border-[#333] shadow-xl overflow-hidden">
                        <button onClick={(e) => { e.stopPropagation(); moveElement(el.id, -1); }} disabled={i === 0} className="p-1.5 hover:bg-[#222] text-gray-400 hover:text-white disabled:opacity-30"><MoveUp size={14}/></button>
                        <button onClick={(e) => { e.stopPropagation(); moveElement(el.id, 1); }} disabled={i === currentMenu.length - 1} className="p-1.5 hover:bg-[#222] text-gray-400 hover:text-white disabled:opacity-30 border-l border-[#333]"><MoveDown size={14}/></button>
                        <button onClick={(e) => { e.stopPropagation(); deleteElement(el.id); }} className="p-1.5 hover:bg-red-500/20 text-red-400 hover:text-red-300 border-l border-[#333]"><Trash2 size={14}/></button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDEBAR: Properties & AI */}
      <div className={\`
        fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity \${mobileTab === 'properties' ? 'opacity-100' : 'opacity-0 pointer-events-none'} md:opacity-100 md:relative md:flex md:w-80 md:bg-[#111] md:pointer-events-auto md:border-l md:border-[#222] shrink-0 shadow-2xl
      \`} onClick={(e) => { if (e.target === e.currentTarget) setMobileTab('canvas') }}>
        <div className={\`
          absolute bottom-0 left-0 right-0 bg-[#141414] rounded-t-2xl shadow-2xl transform transition-transform duration-300 max-h-[85vh] flex flex-col
          \${mobileTab === 'properties' ? 'translate-y-0' : 'translate-y-full'} 
          md:translate-y-0 md:static md:h-full md:rounded-none md:bg-[#111] w-full
        \`}>
        
        {/* Properties Header */}
        <div className="p-4 border-b border-[#333] flex justify-between items-center bg-[#111]">
          <h2 className="font-bold flex items-center gap-2 tracking-tight"><Settings2 size={18} className="text-blue-500"/> Properties</h2>
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
`;

const tileSelectBlock = "                      {el.type === 'tile_select' && (\n                        <div className=\"py-2\">\n                          <div className=\"font-bold text-white text-sm tracking-wide mb-3\">{el.text}</div>\n                          <div className=\"overflow-auto w-full custom-scrollbar pb-2\">\n                            <div className=\"grid gap-1.5 w-fit bg-[#141414] p-2 rounded-xl inline-grid\" style={{ gridTemplateColumns: `repeat(${Math.min(el.count || 5, 50)}, minmax(0, 1fr))` }}>\n                              {Array.from({length: Math.pow(Math.min(el.count || 5, 50), 2)}).map((_, i) => (\n                                <div key={i} className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg cursor-pointer transition-colors ${i === Math.floor(Math.pow(Math.min(el.count || 5, 50), 2) / 2) ? 'bg-indigo-500' : 'bg-[#1a1b26] hover:bg-[#2a2b3d]'}`}></div>\n                              ))}\n                            </div>\n                          </div>\n                        </div>\n                      )}";

const brokenPropStart = '                  className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg p-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-shadow"\n                />\n              </div>\n              <div className="space-y-2">\n                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Module Icon</label>\n                <input \n                  type="text" \n                  value={config.icon} \n                  onChange={e => setConfig({...config, icon: e.target.value})}';

const startIndex = code.indexOf(tileSelectBlock);
const endIndex = code.indexOf(brokenPropStart);

if (startIndex !== -1 && endIndex !== -1) {
    const fixedCode = code.substring(0, startIndex) + missingChunk + '\n' + brokenPropStart + code.substring(endIndex + brokenPropStart.length);
    fs.writeFileSync('src/App.tsx', fixedCode);
    console.log("RESTORED!");
} else {
    console.log("Could not find boundaries.");
}
