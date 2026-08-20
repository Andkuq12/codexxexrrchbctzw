const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Remove expandable_toggle from PALETTE
code = code.replace(
  /\s*\{ type: 'expandable_toggle', label: 'Expandable Toggle'[\s\S]*?\},/,
  ''
);

// 2. Remove expandable_toggle UI rendering
code = code.replace(
  /\{\/\* --- PREVIEW RENDERING BY TYPE --- \*\/\}/,
  '{/* --- PREVIEW RENDERING BY TYPE --- */}' // Just a safe anchor
);
code = code.replace(
  /\s*\{el\.type === 'expandable_toggle' && \([\s\S]*?\}\)\s*\}/,
  ''
);

// 3. Update toggle rendering
code = code.replace(
  /\{el\.type === 'toggle' && \([\s\S]*?\{el\.expandable && el\.list_child[\s\S]*?<\/div>\s*\)\}\s*<\/div>\s*\)\}/,
  `{el.type === 'toggle' && (
                        <div className="py-2">
                          <div className="flex justify-between items-center cursor-pointer mb-2" onClick={(e) => { e.stopPropagation(); updateElement(el.id, { default: !el.default }); setSelectedId(el.id); }}>
                            <span className="text-sm font-bold text-white">{el.text}</span>
                            <div className={\`w-11 h-6 rounded-full relative transition-colors \${el.default ? 'bg-indigo-500' : 'bg-[#333]'}\`}>
                              <div className={\`absolute top-1 w-4 h-4 rounded-full bg-white transition-all \${el.default ? 'right-1' : 'left-1'}\`}></div>
                            </div>
                          </div>
                          {el.list_child && el.list_child.length > 0 && el.default && (
                            <div className="bg-[#111] border border-[#333] rounded-xl p-2 space-y-1 mt-3 shadow-inner relative">
                               {el.list_child.map(child => (
                                  <div 
                                    key={child.id} 
                                    onClick={(e) => { e.stopPropagation(); setSelectedId(child.id); }}
                                    className={\`relative rounded-xl p-3 transition-all cursor-pointer border \${selectedId === child.id ? 'border-blue-500 bg-blue-500/10' : 'border-transparent hover:bg-[#222]'}\`}
                                  >
                                    {renderPreviewElement(child)}
                                  </div>
                               ))}
                            </div>
                          )}
                        </div>
                      )}`
);

// 4. Update insertIntoMenu
code = code.replace(
  /const insertIntoMenu = \(menu: ModuleElement\[\]\): ModuleElement\[\] => \{[\s\S]*?^\s*\};\n/m,
  `const insertIntoMenu = (menu: ModuleElement[]): ModuleElement[] => {
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
`
);

// 5. Update getCurrentMenu
code = code.replace(
  /const getCurrentMenu = \(menu: ModuleElement\[\], id: string \| null\): ModuleElement\[\] => \{[\s\S]*?return \[\];\n  \};\n/m,
  `const getCurrentMenu = (menu: ModuleElement[], id: string | null): ModuleElement[] | null => {
    if (!id) return menu;
    for (const el of menu) {
      if (el.id === id) {
        return el.type === 'toggle' ? (el.list_child || []) : (el.menu || []);
      }
      if (el.menu) {
        const found = getCurrentMenu(el.menu, id);
        if (found) return found;
      }
      if (el.list_child) {
        const found = getCurrentMenu(el.list_child, id);
        if (found) return found;
      }
    }
    return null;
  };
`
);

code = code.replace(
  /const currentMenu = getCurrentMenu\(config\.menu, activeMenuId\);/,
  `const currentMenu = getCurrentMenu(config.menu, activeMenuId) || [];`
);

// 6. Remove expandable_toggle from includes
code = code.replace(
  /'toggle', 'expandable_toggle', 'toggle_button'/g,
  "'toggle', 'toggle_button'"
);
code = code.replace(
  /\{\['expandable_toggle'\]\.includes\(selectedElement\.type\) && \([\s\S]*?\}\)/,
  ''
);

// 7. Add Edit Children button for toggle
code = code.replace(
  /\{selectedElement\.icon !== undefined && \(/,
  `{['toggle'].includes(selectedElement.type) && (
                  <div className="mt-4 mb-4">
                    <button onClick={() => setActiveMenuId(selectedElement.id)} className="w-full bg-[#2a2b3d] hover:bg-[#3a3b50] text-white font-bold py-2 rounded-lg text-sm transition-colors flex items-center justify-center gap-2 border border-[#3a3b50]">
                       <FolderOpen size={16} /> Edit Nested Items
                    </button>
                  </div>
                )}
                {selectedElement.icon !== undefined && (`
);

fs.writeFileSync('src/App.tsx', code);
console.log("App.tsx patched");
