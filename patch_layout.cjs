const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add Plus and X icons to imports
code = code.replace(/import \{ \n/g, "import { Plus, X, \n"); // Check if this regex works, better just replace 'import {'
if (code.includes("ChevronDown, ChevronRight, ChevronLeft, Search, Grid3x3, List,")) {
  code = code.replace("ChevronDown, ChevronRight, ChevronLeft", "ChevronDown, ChevronRight, ChevronLeft, Plus, X");
} else {
  code = code.replace(/import \{ /, "import { Plus, X, ");
}

// 2. Remove mobile nav
code = code.replace(/\{\/\* MOBILE NAV \*\/\}.*?<\/div>/s, "");

// 3. Middle Canvas
code = code.replace(
  /<div className=\{\`\$\{mobileTab === 'canvas' \? 'flex' : 'hidden'\} md:flex flex-1 flex-col bg-\[\#141414\] relative h-full\`\}>/,
  `<div className="flex-1 flex flex-col bg-[#141414] relative h-full w-full">
        {/* MOBILE FABs */}
        <div className="fixed bottom-6 right-6 md:hidden flex flex-col gap-3 z-50">
           <button onClick={() => setMobileTab('properties')} className="w-12 h-12 bg-[#1a1b26] border border-[#3a3b50] rounded-full flex items-center justify-center text-white shadow-lg shadow-black/50 hover:bg-[#2a2b3d] transition-colors relative">
              <Settings2 size={20} />
              {selectedId && <span className="absolute top-0 right-0 w-3 h-3 bg-blue-500 rounded-full border-2 border-[#1a1b26]"></span>}
           </button>
           <button onClick={() => setMobileTab('elements')} className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-500/20 hover:bg-blue-500 transition-colors">
              <Plus size={24} />
           </button>
        </div>`
);

// 4. Left Sidebar (Elements)
code = code.replace(
  /<div className=\{\`\$\{mobileTab === 'elements' \? 'flex' : 'hidden'\} md:flex w-full md:w-64 bg-\[\#111\] border-r border-\[\#222\] flex-col z-10 shrink-0 shadow-lg h-full\`\}>/,
  `<div className={\`
        fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity \${mobileTab === 'elements' ? 'opacity-100' : 'opacity-0 pointer-events-none'} md:opacity-100 md:relative md:flex md:w-64 md:bg-[#111] md:pointer-events-auto md:border-r md:border-[#222] shrink-0 shadow-lg
      \`} onClick={(e) => { if (e.target === e.currentTarget) setMobileTab('canvas') }}>
        <div className={\`
          absolute bottom-0 left-0 right-0 bg-[#141414] rounded-t-2xl shadow-2xl transform transition-transform duration-300 max-h-[80vh] flex flex-col
          \${mobileTab === 'elements' ? 'translate-y-0' : 'translate-y-full'} 
          md:translate-y-0 md:static md:h-full md:rounded-none md:bg-[#111] w-full
        \`}>`
);
// replace closing div of left sidebar
code = code.replace(
  /<\/div>\s*\{\/\* MIDDLE: Canvas \/ Preview \*\/\}/,
  `</div>\n      </div>\n\n      {/* MIDDLE: Canvas / Preview */}`
);

// Also need to add the close button to the left sidebar header
code = code.replace(
  /<div className="p-4 border-b border-\[\#333\] hidden md:flex items-center gap-2 bg-\[\#111\]">/,
  `<div className="p-4 border-b border-[#333] flex justify-between items-center bg-[#111] md:rounded-none rounded-t-2xl">
          <div className="flex items-center gap-2">`
);
code = code.replace(
  /<h1 className="font-bold text-lg tracking-tight">Elements<\/h1>\s*<\/div>/,
  `<h1 className="font-bold text-lg tracking-tight">Elements</h1>
          </div>
          <button className="md:hidden p-1 text-gray-400" onClick={() => setMobileTab('canvas')}><X size={20}/></button>
        </div>`
);


// 5. Right Sidebar (Properties)
code = code.replace(
  /<div className=\{\`\$\{mobileTab === 'properties' \? 'flex' : 'hidden'\} md:flex w-full md:w-80 bg-\[\#111\] border-l border-\[\#222\] flex-col shrink-0 shadow-2xl h-full\`\}>/,
  `<div className={\`
        fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity \${mobileTab === 'properties' ? 'opacity-100' : 'opacity-0 pointer-events-none'} md:opacity-100 md:relative md:flex md:w-80 md:bg-[#111] md:pointer-events-auto md:border-l md:border-[#222] shrink-0 shadow-2xl
      \`} onClick={(e) => { if (e.target === e.currentTarget) setMobileTab('canvas') }}>
        <div className={\`
          absolute bottom-0 left-0 right-0 bg-[#141414] rounded-t-2xl shadow-2xl transform transition-transform duration-300 max-h-[85vh] flex flex-col
          \${mobileTab === 'properties' ? 'translate-y-0' : 'translate-y-full'} 
          md:translate-y-0 md:static md:h-full md:rounded-none md:bg-[#111] w-full
        \`}>`
);
// replace closing div of right sidebar
code = code.replace(
  /<\/div>\s*<\/div>\s*<\/div>\s*$/s,
  `</div>\n      </div>\n    </div>\n  );\n}\n\nexport default App;`
);

// add close button to properties header
code = code.replace(
  /<h2 className="font-bold flex items-center gap-2 tracking-tight"><Settings2 size=\{18\} className="text-blue-500"\/> Properties<\/h2>\s*<\/div>/,
  `<h2 className="font-bold flex items-center gap-2 tracking-tight"><Settings2 size={18} className="text-blue-500"/> Properties</h2>
          <button className="md:hidden p-1 text-gray-400" onClick={() => setMobileTab('canvas')}><X size={20}/></button>
        </div>`
);


fs.writeFileSync('src/App.tsx', code);
console.log("Layout patched!");
