const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/\{\/\* MOBILE TABS HEADER \*\/\}\s*<div className="md:hidden flex bg-\[\#111\] border-b border-\[\#222\] p-2 gap-2">[\s\S]*?<\/div>/, '');

const aiPanelStart = code.lastIndexOf('        {/* AI Assistant Panel */}');
const aiPanelCode = code.substring(aiPanelStart);

let newEnd = `
        {/* AI Assistant Panel */}
        <div className="border-t border-[#333] p-5 bg-[#141414]">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold flex items-center gap-2 text-sm text-white"><Zap size={16} className="text-indigo-400 fill-indigo-400/20" /> AI Suggestions</h3>
            <button 
              onClick={getAIAdvice} 
              disabled={loadingAi}
              className="bg-[#1a1a1a] hover:bg-[#222] border border-[#333] text-white text-xs px-3 py-1.5 rounded-md transition-colors disabled:opacity-50"
            >
              {loadingAi ? 'Analyzing...' : 'Review Code'}
            </button>
          </div>
          <div className="text-xs text-gray-300 h-32 overflow-y-auto p-3 bg-[#222]/50 border border-indigo-500/20 rounded-lg text-indigo-300 custom-scrollbar prose prose-invert prose-p:leading-tight prose-sm max-w-none">
            {aiSuggestion ? (
               <ReactMarkdown>{aiSuggestion}</ReactMarkdown>
            ) : (
               <span className="text-gray-500">Click 'Review Code' to get best-practice suggestions for your current module configuration from Gemini AI.</span>
            )}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

export default App;
`;

code = code.substring(0, aiPanelStart) + newEnd;

fs.writeFileSync('src/App.tsx', code);
console.log("Fixed end of file");
