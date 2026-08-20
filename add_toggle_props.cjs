const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const anchor = "{['toggle'].includes(selectedElement.type) && (";
const injection = `              {['toggle'].includes(selectedElement.type) && (
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
              
              {['toggle'].includes(selectedElement.type) && (`

code = code.replace(anchor, injection);
fs.writeFileSync('src/App.tsx', code);
console.log("Added toggle props");
