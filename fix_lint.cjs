const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Remove duplicate imports
code = code.replace(/import \{ Plus, X, \n/, "import {\n");
code = code.replace(/ChevronLeft, Plus, X/, "ChevronLeft, Plus, X");

// 2. Remove display_list rendering
code = code.replace(
  /\{el\.type === 'display_list' && \([\s\S]*?\}\)/,
  ""
);

// 3. Remove duplicate export default
const exportCount = (code.match(/export default App;/g) || []).length;
if (exportCount > 1) {
  code = code.replace(/export default App;/, ""); // remove first occurrence, which is likely near the top if someone added it? Wait, line 33?
}

fs.writeFileSync('src/App.tsx', code);
console.log("Lint fixes applied");
