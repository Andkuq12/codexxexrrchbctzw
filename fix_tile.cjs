const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// I will remove the broken tile_select completely and inject the correct one.
const brokenStart = code.indexOf("{el.type === 'tile_select' && (");
const nextElementStart = code.indexOf("{el.type === 'display_list' && (", brokenStart);

if (brokenStart > -1 && nextElementStart > -1) {
  const correctTileSelect = `{el.type === 'tile_select' && (
                        <div className="py-2">
                          <div className="font-bold text-white text-sm tracking-wide mb-3">{el.text}</div>
                          <div className="overflow-auto w-full custom-scrollbar pb-2">
                            <div className="grid gap-1.5 w-fit bg-[#141414] p-2 rounded-xl inline-grid" style={{ gridTemplateColumns: \`repeat(\${Math.min(el.count || 5, 50)}, minmax(0, 1fr))\` }}>
                              {Array.from({length: Math.pow(Math.min(el.count || 5, 50), 2)}).map((_, i) => (
                                <div key={i} className={\`w-8 h-8 sm:w-10 sm:h-10 rounded-lg cursor-pointer transition-colors \${i === Math.floor(Math.pow(Math.min(el.count || 5, 50), 2) / 2) ? 'bg-indigo-500' : 'bg-[#1a1b26] hover:bg-[#2a2b3d]'}\`}></div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                      
                      `;

  code = code.substring(0, brokenStart) + correctTileSelect + code.substring(nextElementStart);
  fs.writeFileSync('src/App.tsx', code);
  console.log("Fixed tile_select");
} else {
  console.log("Could not find blocks");
}

