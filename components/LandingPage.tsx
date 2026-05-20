import { translations, Language } from './LanguageDict';
import { ShieldCheck, Play, ArrowRight, Brain, AlertOctagon, Code, ClipboardList, HelpCircle } from 'lucide-react';

interface LandingPageProps {
  lang: Language;
  theme: 'dark' | 'light';
  onGetStarted: () => void;
}

export default function LandingPage({
  lang,
  theme,
  onGetStarted
}: LandingPageProps) {
  const t = translations[lang];

  return (
    <div className="space-y-16 py-8 animate-fade-in relative">
      
      {/* Background cyber glowing ambient blur */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-gradient-to-tr from-cyan-500/10 to-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Hero terminal card */}
      <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
        
        {/* Glow Tagline Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-cyan-500/20 bg-cyan-500/5 glow-cyan">
          <Brain className="w-4 h-4 text-cyan-400" />
          <span className="text-[10px] font-mono tracking-widest uppercase font-black text-cyan-400">
            {t.tagline}
          </span>
        </div>

        <h1 className={`text-4xl sm:text-6xl font-display font-black tracking-tight leading-none uppercase ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          Forensic Anti-AI <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-cyan-400 via-teal-400 to-blue-500 bg-clip-text text-transparent glow-text-cyan">
            Homework Audit
          </span>
        </h1>

        <p className={`text-sm sm:text-base max-w-2xl mx-auto leading-relaxed font-mono uppercase opacity-80 ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`}>
          {t.description}
        </p>

        {/* Launch controls */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={onGetStarted}
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-display font-black uppercase text-xs tracking-widest rounded-xl hover:scale-105 transition-all shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 cursor-pointer"
            id="landing-btn-scan-launch"
          >
            <Play className="w-4 h-4 fill-black" />
            <span>{t.getStarted}</span>
          </button>
        </div>

      </div>

      {/* Bento Grid Showcase */}
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1 */}
          <div className={`p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-1 ${
            theme === 'dark' 
              ? 'glass-panel-dark border-white/5 hover:border-cyan-500/20 shadow-lg hover:shadow-cyan-500/5' 
              : 'glass-panel-light border-gray-200 hover:border-cyan-500 shadow-md hover:shadow-md'
          }`}>
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-4">
              <Code className="w-5 h-5" />
            </div>
            <h3 className={`text-sm font-display font-black uppercase tracking-wider mb-2 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>Code Entropy Scan</h3>
            <p className={`text-xs font-mono leading-relaxed uppercase opacity-75 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Inspects formatting structures, uncharacteristic comment spacing, and textbook-exact coding styles typical of ChatGPT and Claude.
            </p>
          </div>

          {/* Card 2 */}
          <div className={`p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-1 ${
            theme === 'dark' 
              ? 'glass-panel-dark border-white/5 hover:border-cyan-500/20 shadow-lg hover:shadow-cyan-500/5' 
              : 'glass-panel-light border-gray-200 hover:border-cyan-500 shadow-md hover:shadow-md'
          }`}>
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-4">
              <AlertOctagon className="w-5 h-5" />
            </div>
            <h3 className={`text-sm font-display font-black uppercase tracking-wider mb-2 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>Highlight Violations</h3>
            <p className={`text-xs font-mono leading-relaxed uppercase opacity-75 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Pinpoint precise lines in multiple code classes, with targeted explanations highlighting exactly why each sequence was flagged.
            </p>
          </div>

          {/* Card 3 */}
          <div className={`p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-1 ${
            theme === 'dark' 
              ? 'glass-panel-dark border-white/5 hover:border-cyan-500/20 shadow-lg hover:shadow-cyan-500/5' 
              : 'glass-panel-light border-gray-200 hover:border-cyan-500 shadow-md hover:shadow-md'
          }`}>
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-4">
              <ClipboardList className="w-5 h-5" />
            </div>
            <h3 className={`text-sm font-display font-black uppercase tracking-wider mb-2 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>Faculty Command Center</h3>
            <p className={`text-xs font-mono leading-relaxed uppercase opacity-75 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Monitor class scores, adjust sensitivity thresholds, look at student histories, and download comprehensive forensics logs.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}
