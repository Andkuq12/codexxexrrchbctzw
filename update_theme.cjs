const fs = require('fs');

// We have the original App.tsx colors because the first script failed.
let code = fs.readFileSync('src/App.tsx', 'utf8');

// --- COLORS REPLACEMENT ---
// VIOLET -> BLUE
code = code.replace(/violet-500/g, 'blue-500');
code = code.replace(/violet-600/g, 'blue-600');
code = code.replace(/violet-400/g, 'blue-400');
code = code.replace(/violet-300/g, 'blue-300');
code = code.replace(/violet-900\/10/g, 'blue-500/10');
code = code.replace(/violet-900\/50/g, 'blue-900/20');
code = code.replace(/violet-500\/10/g, 'blue-500/10');
code = code.replace(/violet-500\/20/g, 'blue-500/20');
code = code.replace(/violet-500\/30/g, 'blue-500/30');
code = code.replace(/violet-600\/20/g, 'blue-600/20');

// ZINC -> GRAY
code = code.replace(/text-zinc-100/g, 'text-gray-100');
code = code.replace(/text-zinc-200/g, 'text-gray-200');
code = code.replace(/text-zinc-300/g, 'text-gray-300');
code = code.replace(/text-zinc-400/g, 'text-gray-400');
code = code.replace(/text-zinc-500/g, 'text-gray-500');
code = code.replace(/text-zinc-600/g, 'text-gray-600');
code = code.replace(/text-zinc-700/g, 'text-gray-700');
code = code.replace(/border-zinc-700/g, 'border-[#333]');
code = code.replace(/bg-zinc-800/g, 'bg-[#1a1a1a]');
code = code.replace(/bg-zinc-700/g, 'bg-[#222]');
code = code.replace(/bg-zinc-600/g, 'bg-[#333]'); // For toggles

// --- HEX COLORS (LAYOUT) ---
// Global container
code = code.replace(/bg-\[#18181b\] text-gray-100/g, 'bg-[#0a0a0a] text-gray-300'); // Note text-gray-100 to text-gray-300 on main wrapper

// Left & Right Sidebars
code = code.replace(/bg-\[#27272a\] border-r border-\[#3f3f46\]/g, 'bg-[#111] border-r border-[#222]');
code = code.replace(/bg-\[#27272a\] border-l border-\[#3f3f46\]/g, 'bg-[#111] border-l border-[#222]');

// Middle area background
code = code.replace(/bg-\[#1e1e2e\] relative h-full/g, 'bg-[#141414] relative h-full');

// Mobile Tabs Header
code = code.replace(/bg-\[#1e1e2e\] border-b border-\[#3f3f46\] p-2/g, 'bg-[#111] border-b border-[#222] p-2');
code = code.replace(/bg-\[#27272a\] text-gray-400/g, 'bg-[#1a1a1a] text-gray-400'); // inactive tabs

// Headers in Sidebars
code = code.replace(/bg-\[#1e1e2e\]/g, 'bg-[#111]');

// Header in Middle Canvas
code = code.replace(/bg-\[#27272a\] shadow-sm z-10/g, 'bg-[#111] shadow-sm z-10');

// Module preview wrapper
code = code.replace(/bg-\[#27272a\] rounded-2xl shadow-2xl border border-\[#3f3f46\]/g, 'bg-[#1a1a1a] rounded-2xl shadow-2xl border border-[#333]');

// Module preview specific parts
code = code.replace(/border-\[#3f3f46\]/g, 'border-[#333]');
code = code.replace(/border-\[#3f3f46\]\/30/g, 'border-[#333]/30');
code = code.replace(/bg-\[#18181b\] border border-\[#333\]/g, 'bg-[#1a1a1a] border border-[#333]'); // Inputs
code = code.replace(/bg-\[#18181b\]/g, 'bg-[#141414]'); // Leftover generic backgrounds
code = code.replace(/bg-\[#1a1a1a\]/g, 'bg-[#1a1a1a]'); 
code = code.replace(/hover:bg-\[#3f3f46\]\/30/g, 'hover:bg-[#222]');

// AI Section (indigo)
code = code.replace(/text-amber-400 fill-amber-400\/20/g, 'text-indigo-400 fill-indigo-400/20');
code = code.replace(/bg-\[#111\] p-3 rounded-lg border border-\[#333\]/g, 'bg-[#222]/50 border border-indigo-500/20 rounded-lg text-indigo-300'); 
// wait, AI section was bg-[#1e1e2e] which changed to bg-[#111]. Let's replace the whole block in AI if needed

// Fix shadow of properties panel
code = code.replace(/shadow-\[-4px_0_15px_-3px_rgba\(0,0,0,0\.1\)\]/g, 'shadow-2xl');

fs.writeFileSync('src/App.tsx', code);
