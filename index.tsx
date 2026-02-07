import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  ShieldCheck, 
  Link as LinkIcon, 
  Key, 
  Copy, 
  Settings, 
  CheckCircle2, 
  AlertCircle, 
  Code2, 
  Loader2,
  Terminal,
  ExternalLink
} from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

// --- Types ---
type FirebaseConfig = {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
};

// --- Mock Service (Local Storage) ---
const mockSaveKey = (key: string) => {
  const existing = JSON.parse(localStorage.getItem('nexus_keys') || '[]');
  existing.push({ key, createdAt: Date.now() });
  localStorage.setItem('nexus_keys', JSON.stringify(existing));
  return Promise.resolve(true);
};

// --- Main App Component ---
function App() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [showConfig, setShowConfig] = useState(false);
  
  // Configuration State
  const [safelinkuApi, setSafelinkuApi] = useState('');
  const [targetScriptUrl, setTargetScriptUrl] = useState('https://raw.githubusercontent.com/username/repo/main/script.lua');
  const [fbConfigJson, setFbConfigJson] = useState('');
  const [configStatus, setConfigStatus] = useState<'none' | 'valid' | 'invalid'>('none');
  const [dbInstance, setDbInstance] = useState<any>(null);
  const [projectId, setProjectId] = useState<string>('YOUR_PROJECT_ID');

  // Load saved config on mount
  useEffect(() => {
    const savedFb = localStorage.getItem('nexus_fb_config');
    const savedSafe = localStorage.getItem('nexus_safelinku');
    const savedTarget = localStorage.getItem('nexus_target_script');
    
    if (savedFb) {
      setFbConfigJson(savedFb);
      try {
        const config = JSON.parse(savedFb);
        const app = initializeApp(config);
        const db = getFirestore(app);
        setDbInstance(db);
        setProjectId(config.projectId);
        setConfigStatus('valid');
      } catch (e) {
        console.error("Failed to init firebase from saved config", e);
      }
    }
    if (savedSafe) setSafelinkuApi(savedSafe);
    if (savedTarget) setTargetScriptUrl(savedTarget);
  }, []);

  const handleSaveConfig = () => {
    try {
      if (fbConfigJson.trim()) {
        const config = JSON.parse(fbConfigJson);
        const app = initializeApp(config);
        const db = getFirestore(app);
        setDbInstance(db);
        setProjectId(config.projectId);
        localStorage.setItem('nexus_fb_config', fbConfigJson);
        setConfigStatus('valid');
      }
      localStorage.setItem('nexus_safelinku', safelinkuApi);
      localStorage.setItem('nexus_target_script', targetScriptUrl);
      setShowConfig(false);
    } catch (e) {
      setConfigStatus('invalid');
      alert("Invalid JSON Configuration for Firebase");
    }
  };

  const generateRandomKey = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const segments = 4;
    const segmentLength = 4;
    let key = 'NEXUS';
    
    for (let i = 0; i < segments; i++) {
      key += '-';
      for (let j = 0; j < segmentLength; j++) {
        key += chars.charAt(Math.floor(Math.random() * chars.length));
      }
    }
    return key;
  };

  const handleStepAction = async () => {
    setLoading(true);

    // Simulate Short Link Check or API Call
    // In a real scenario, you would call the Safelinku API here to shorten a verification URL
    // and wait for the user to return with a token.
    
    setTimeout(() => {
      setLoading(false);
      setStep((prev) => Math.min(prev + 1, 5));
    }, 2000); // 2 seconds delay to simulate checking
  };

  const handleFinalGeneration = async () => {
    setLoading(true);
    const newKey = generateRandomKey();
    
    try {
      if (dbInstance) {
        await addDoc(collection(dbInstance, "keys"), {
          key: newKey,
          createdAt: serverTimestamp(),
          active: true,
          ip: "anonymous" // In a real app, you might capture IP for rate limiting
        });
      } else {
        await mockSaveKey(newKey);
      }
      
      setGeneratedKey(newKey);
      setStep(6); // Done
    } catch (error) {
      console.error("Error saving key:", error);
      alert("Failed to save key to database. Please check console.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  // --- Render Helpers ---

  const renderProgressBar = () => {
    const totalSteps = 5;
    return (
      <div className="flex gap-2 mb-8">
        {[...Array(totalSteps)].map((_, i) => (
          <div 
            key={i}
            className={`h-2 flex-1 rounded-full transition-all duration-500 ${
              i < step ? 'bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]' : 'bg-slate-800'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center bg-no-repeat bg-fixed">
      {/* Overlay */}
      <div className="min-h-screen bg-slate-950/90 backdrop-blur-sm flex flex-col">
        
        {/* Navbar */}
        <nav className="border-b border-white/10 glass-panel">
          <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/30">
                N
              </div>
              <span className="font-bold text-xl tracking-tight text-white">NEXUS <span className="text-indigo-400">KEY SYSTEM</span></span>
            </div>
            <button 
              onClick={() => setShowConfig(true)}
              className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 text-sm"
            >
              <Settings size={16} />
              <span>Config</span>
            </button>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 max-w-6xl mx-auto w-full p-4 grid md:grid-cols-2 gap-8 items-start pt-12">
          
          {/* Left Panel: Generator */}
          <div className="glass-panel p-8 rounded-2xl border-t border-indigo-500/20 shadow-2xl">
            <div className="mb-6">
              <h1 className="text-2xl font-bold mb-2">Generate Access Key</h1>
              <p className="text-slate-400 text-sm">Complete the verification steps below to generate a new key for your script.</p>
            </div>

            {renderProgressBar()}

            <div className="space-y-6">
              <div className="bg-slate-900/50 rounded-xl p-6 border border-white/5 flex flex-col items-center justify-center text-center min-h-[200px]">
                {step < 5 ? (
                  <>
                    <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4 text-indigo-400 relative">
                      {loading ? (
                         <Loader2 className="animate-spin" size={32} />
                      ) : (
                        <>
                          <LinkIcon size={28} />
                          <div className="absolute -top-1 -right-1 w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center text-xs font-bold text-white">
                            {step + 1}
                          </div>
                        </>
                      )}
                    </div>
                    <h3 className="text-lg font-medium text-white mb-2">
                      {loading ? 'Verifying...' : `Verification Step ${step + 1}`}
                    </h3>
                    <p className="text-slate-400 text-sm max-w-xs mb-6">
                      Click the button below to visit our sponsor link. After completing the captcha, you will be redirected back.
                    </p>
                    <button
                      onClick={handleStepAction}
                      disabled={loading}
                      className="group relative inline-flex items-center justify-center px-8 py-3 font-bold text-white transition-all duration-200 bg-indigo-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 hover:bg-indigo-500 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed w-full"
                    >
                      {loading ? 'Checking...' : 'Complete Link'}
                      {!loading && <ExternalLink size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />}
                    </button>
                  </>
                ) : generatedKey ? (
                  <div className="w-full">
                     <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mb-4 mx-auto">
                        <Key size={32} />
                     </div>
                     <h3 className="text-xl font-bold text-white mb-1">Key Generated!</h3>
                     <p className="text-slate-400 text-sm mb-6">Use this key in the script loader.</p>
                     
                     <div className="bg-slate-950 border border-indigo-500/30 rounded-lg p-4 flex items-center gap-3 mb-4 group cursor-pointer hover:border-indigo-500/60 transition-colors"
                        onClick={() => copyToClipboard(generatedKey)}
                     >
                        <code className="flex-1 font-mono text-indigo-300 text-lg tracking-wider text-center">
                          {generatedKey}
                        </code>
                        <Copy size={18} className="text-slate-500 group-hover:text-white transition-colors" />
                     </div>
                     
                     <button 
                      onClick={() => {
                        setStep(0);
                        setGeneratedKey(null);
                      }}
                      className="text-slate-500 text-sm hover:text-white transition-colors"
                     >
                       Generate Another Key
                     </button>
                  </div>
                ) : (
                  <>
                     <div className="w-16 h-16 bg-indigo-600 text-white rounded-full flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(79,70,229,0.4)] animate-pulse-slow">
                        <ShieldCheck size={32} />
                     </div>
                     <h3 className="text-xl font-bold text-white mb-2">Ready to Generate</h3>
                     <p className="text-slate-400 text-sm max-w-xs mb-6">
                       All verification steps completed successfully.
                     </p>
                     <button
                      onClick={handleFinalGeneration}
                      disabled={loading}
                      className="inline-flex items-center justify-center px-8 py-3 font-bold text-white transition-all duration-200 bg-green-600 rounded-lg hover:bg-green-500 active:scale-95 w-full shadow-[0_0_15px_rgba(22,163,74,0.4)]"
                    >
                      {loading ? <Loader2 className="animate-spin" /> : 'GET KEY NOW'}
                    </button>
                  </>
                )}
              </div>
            </div>
            
            <div className="mt-6 flex items-center gap-4 text-xs text-slate-500 justify-center">
              <span className="flex items-center gap-1"><CheckCircle2 size={12} className="text-green-500"/> Secure Connection</span>
              <span className="flex items-center gap-1"><CheckCircle2 size={12} className="text-green-500"/> Database Linked</span>
              <span className="flex items-center gap-1"><CheckCircle2 size={12} className="text-green-500"/> 24h Expiry</span>
            </div>
          </div>

          {/* Right Panel: Script Info */}
          <div className="space-y-6">
             <div className="glass-panel p-6 rounded-2xl">
                <div className="flex items-center gap-3 mb-4 text-indigo-300">
                  <Terminal size={20} />
                  <h2 className="font-bold text-lg text-white">Script Loader (Lua)</h2>
                </div>
                <p className="text-slate-400 text-sm mb-4">
                  Copy the script below into your executor. It verifies your key against the server.
                </p>
                
                <div className="relative group">
                   <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => copyToClipboard(getLuaScript(projectId, generatedKey || "YOUR_KEY_HERE", targetScriptUrl))}
                        className="bg-slate-700 hover:bg-slate-600 text-white p-2 rounded-md"
                      >
                        <Copy size={16} />
                      </button>
                   </div>
                   <pre className="bg-slate-950 p-4 rounded-lg border border-slate-800 text-xs font-mono text-slate-300 overflow-x-auto custom-scrollbar leading-relaxed">
                     {getLuaScript(projectId, generatedKey || "YOUR_KEY_HERE", targetScriptUrl)}
                   </pre>
                </div>
             </div>

             <div className="glass-panel p-6 rounded-2xl border-l-4 border-l-yellow-500">
               <h3 className="font-bold text-white mb-2 flex items-center gap-2">
                 <AlertCircle size={18} className="text-yellow-500" />
                 Status
               </h3>
               <div className="space-y-2 text-sm">
                 <div className="flex justify-between">
                   <span className="text-slate-400">System Status:</span>
                   <span className="text-green-400 font-mono">ONLINE</span>
                 </div>
                 <div className="flex justify-between">
                   <span className="text-slate-400">Database:</span>
                   <span className={dbInstance ? "text-green-400 font-mono" : "text-yellow-400 font-mono"}>
                     {dbInstance ? 'CONNECTED' : 'LOCAL SIMULATION'}
                   </span>
                 </div>
                 <div className="flex justify-between">
                   <span className="text-slate-400">Total Keys:</span>
                   <span className="text-indigo-400 font-mono">14,203</span>
                 </div>
               </div>
             </div>
          </div>

        </main>
      </div>

      {/* Configuration Modal */}
      {showConfig && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl p-6 shadow-2xl">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Settings className="text-indigo-400" /> System Configuration
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">
                  Target Script URL
                </label>
                <input 
                  type="text" 
                  value={targetScriptUrl}
                  onChange={(e) => setTargetScriptUrl(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500 text-sm font-mono"
                  placeholder="https://raw.githubusercontent.com/..."
                />
                <p className="text-xs text-slate-500 mt-1">
                  The raw script URL to load if the key is valid.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">
                  Safelinku API Token (Optional)
                </label>
                <input 
                  type="text" 
                  value={safelinkuApi}
                  onChange={(e) => setSafelinkuApi(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500 text-sm font-mono"
                  placeholder="Enter Safelinku API Token"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">
                  Firebase Config (JSON)
                </label>
                <textarea 
                  value={fbConfigJson}
                  onChange={(e) => setFbConfigJson(e.target.value)}
                  className="w-full h-32 bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500 text-xs font-mono"
                  placeholder='{"apiKey": "...", "authDomain": "...", "projectId": "..."}'
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button 
                onClick={() => setShowConfig(false)}
                className="px-4 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveConfig}
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- Lua Script Template (Growlauncher API) ---
const getLuaScript = (projectId: string, userKey: string, targetScript: string) => `local UserKey = "${userKey}"
local ProjectID = "${projectId}"
local TargetScript = "${targetScript}"

LogToConsole("Initializing Nexus Key System...")

-- 1. Fetch Key Database from Firestore
local url = "https://firestore.googleapis.com/v1/projects/"..ProjectID.."/databases/(default)/documents/keys"
local dbData, err = fetch(url)

if not dbData then
    LogToConsole("Network Error: " .. tostring(err))
    return
end

-- 2. Verify Key (Check if key exists in Firestore response)
-- Firestore structure: { "fields": { "key": { "stringValue": "..." } } }
local keyFound = string.find(dbData, '"stringValue": "' .. UserKey .. '"')

if keyFound then
    LogToConsole("Key Valid! Loading Script...")
    
    -- 3. Load Main Script
    local scriptContent, fetchErr = fetch(TargetScript)
    if not scriptContent then 
        LogToConsole("Script Load Error: " .. tostring(fetchErr))
        return 
    end
    
    local func, loadErr = load(scriptContent)
    if not func then 
        LogToConsole("Syntax Error: " .. tostring(loadErr))
        return 
    end
    
    -- Execute
    func()
    
else
    LogToConsole("Key Expired or Invalid")
end`;

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
