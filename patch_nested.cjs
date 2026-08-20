const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Update toggle expandable container
code = code.replace(
  /<div className="pl-4 ml-1 border-l-2 border-indigo-500\/30 space-y-4 mt-4">/,
  `<div className="bg-[#111] border border-[#333] rounded-xl p-3 space-y-4 mt-3 shadow-inner">`
);

// Update expandable_toggle container
code = code.replace(
  /<div className="pl-4 ml-1 border-l-2 border-indigo-500\/30 space-y-2 mt-4 relative">/,
  `<div className="bg-[#111] border border-[#333] rounded-xl p-2 space-y-1 mt-3 shadow-inner relative">`
);

fs.writeFileSync('src/App.tsx', code);
console.log("Nested style patched!");
