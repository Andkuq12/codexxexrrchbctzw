const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const anchor = "                      )}\n                      )}\n      </>\n    );\n  };";
if (code.includes(anchor)) {
    const correctParen = `                      )}
                      {el.type === 'tile_select' && (
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
      </>
    );
  };`;
    code = code.replace(anchor, correctParen);
    fs.writeFileSync('src/App.tsx', code);
    console.log("Fixed via exact string");
} else {
    // try regex
    const re = /\s*\)\}\n\s*\)\}\n\s*<\/>\n\s*\);\n\s*\};/;
    if (re.test(code)) {
        const correctParen = `                      )}
                      {el.type === 'tile_select' && (
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
      </>
    );
  };`;
        code = code.replace(re, correctParen);
        fs.writeFileSync('src/App.tsx', code);
        console.log("Fixed via regex");
    } else {
        console.log("NOT FOUND!");
    }
}
