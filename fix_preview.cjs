const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
    "{el.list_child && el.list_child.length > 0 && el.default && (",
    "{el.expandable && el.list_child && el.list_child.length > 0 && (el.default || el.always_expand) && ("
);

code = code.replace(
    '<div className="bg-[#111] border border-[#333] rounded-xl p-2 space-y-1 mt-3 shadow-inner relative">',
    '<div className={`space-y-1 mt-3 relative ${el.background ? "bg-[#111] border border-[#333] rounded-xl p-2 shadow-inner" : "p-1"}`}>'
);

fs.writeFileSync('src/App.tsx', code);
console.log("Updated toggle preview");
