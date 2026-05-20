import { translations, Language } from './LanguageDict';
import { UserSession } from '../types';
import { 
  Terminal, ShieldCheck, Landmark, ListChecks, 
  User, LogOut, Moon, Sun, Globe, LogIn 
} from 'lucide-react';

interface NavigationProps {
  lang: Language;
  setLang: (l: Language) => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  session: UserSession | null;
  onLogout: () => void;
  onOpenAuth: () => void;
}

export default function Navigation({
  lang,
  setLang,
  theme,
  toggleTheme,
  currentTab,
  setCurrentTab,
  session,
  onLogout,
  onOpenAuth
}: NavigationProps) {
  const t = translations[lang];

  return (
    <nav className={`sticky top-0 z-40 border-b transition-all duration-300 ${
      theme === 'dark' 
        ? 'bg-[#020408]/65 border-white/5 backdrop-blur-xl'
        : 'bg-white/70 border-gray-200 backdrop-blur-xl'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand/Logo */}
          <button 
            onClick={() => setCurrentTab('landing')}
            className="flex items-center gap-2.5 group cursor-pointer"
            id="nav-logo-btn"
          >
            <div className="relative flex items-center justify-center w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg shadow-[0_0_15px_rgba(34,211,238,0.45)] group-hover:scale-105 transition-all">
              <ShieldCheck className="w-5 h-5 text-white" />
              <div className="absolute inset-0 rounded-lg bg-cyan-400/20 blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            
            <div className="flex flex-col text-left">
              <span className={`text-sm font-display font-black uppercase tracking-wider ${
                theme === 'dark' ? 'text-white' : 'text-gray-950'
              }`}>
                DETECTOR<span className="text-cyan-400">.AI</span>
              </span>
              <span className="text-[8px] font-mono uppercase tracking-widest text-cyan-500/80">
                Linguistic Forensic Core
              </span>
            </div>
          </button>

          {/* Nav Items */}
          <div className="hidden md:flex items-center gap-1">
            <button
              onClick={() => setCurrentTab('scanner')}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs uppercase font-mono tracking-wider rounded-xl transition-all cursor-pointer ${
                currentTab === 'scanner'
                  ? (theme === 'dark' ? 'bg-cyan-400/10 text-cyan-300 border border-cyan-500/20 shadow-[0_0_12px_rgba(34,211,238,0.1)]' : 'bg-cyan-50 text-cyan-700 border border-cyan-100')
                  : (theme === 'dark' ? 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-transparent')
              }`}
              id="nav-tab-scanner"
            >
              <Terminal className="w-4 h-4" />
              <span>{t.getStarted}</span>
            </button>

            {/* Teacher tab - show always but can promote auth */}
            <button
              onClick={() => setCurrentTab('teacher')}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs uppercase font-mono tracking-wider rounded-xl transition-all cursor-pointer ${
                currentTab === 'teacher'
                  ? (theme === 'dark' ? 'bg-cyan-400/10 text-cyan-300 border border-cyan-500/20 shadow-[0_0_12px_rgba(34,211,238,0.1)]' : 'bg-cyan-50 text-cyan-700 border border-cyan-100')
                  : (theme === 'dark' ? 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-transparent')
              }`}
              id="nav-tab-teacher"
            >
              <Landmark className="w-4 h-4" />
              <span>{t.teacherPortal}</span>
            </button>

            {/* Student tab */}
            <button
              onClick={() => setCurrentTab('student')}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs uppercase font-mono tracking-wider rounded-xl transition-all cursor-pointer ${
                currentTab === 'student'
                  ? (theme === 'dark' ? 'bg-cyan-400/10 text-cyan-300 border border-cyan-500/20 shadow-[0_0_12px_rgba(34,211,238,0.1)]' : 'bg-cyan-50 text-cyan-700 border border-cyan-100')
                  : (theme === 'dark' ? 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-transparent')
              }`}
              id="nav-tab-student"
            >
              <ListChecks className="w-4 h-4" />
              <span>{t.studentPortal}</span>
            </button>
          </div>

          {/* Toolbar Right */}
          <div className="flex items-center gap-2">
            
            {/* Engine Status Pulse Badge (only for desktop) */}
            <div className={`hidden lg:flex items-center gap-2 px-3 py-1.5 mr-2 rounded-full border ${
              theme === 'dark' 
                ? 'bg-slate-900/50 border-white/10 text-slate-400' 
                : 'bg-emerald-50 border-emerald-150 text-emerald-700'
            }`}>
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-medium uppercase tracking-widest font-mono">Analysis Engine: Online</span>
            </div>

            {/* English/Uzbek Toggle */}
            <button
              onClick={() => setLang(lang === 'en' ? 'uz' : 'en')}
              className={`p-2 rounded-xl border transition-all flex items-center gap-1.5 cursor-pointer ${
                theme === 'dark' 
                  ? 'border-white/5 bg-white/5 text-cyan-400 hover:bg-white/10' 
                  : 'border-gray-200 bg-gray-50 text-cyan-600 hover:bg-gray-100'
              }`}
              title={t.languageToggle}
              id="nav-btn-language"
            >
              <Globe className="w-4 h-4" />
              <span className="text-[10px] font-mono tracking-wide uppercase font-bold sm:inline hidden">
                {lang === 'en' ? 'UZ' : 'EN'}
              </span>
            </button>

            {/* Dark/Light mode Selector */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                theme === 'dark' 
                  ? 'border-white/5 bg-white/5 text-yellow-400 hover:bg-white/10' 
                  : 'border-gray-200 bg-gray-50 text-blue-600 hover:bg-gray-100'
              }`}
              title="Toggle Theme"
              id="nav-btn-theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Auth section */}
            <div className="h-6 w-[1px] bg-white/10 mx-1 sm:block hidden" />

            {session ? (
              <div className="flex items-center gap-2">
                <div className={`sm:flex hidden flex-col items-end ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  <span className="text-xs font-mono font-medium">{session.username}</span>
                  <span className="text-[9px] font-mono opacity-60 uppercase tracking-widest text-cyan-500">
                    {session.role}
                  </span>
                </div>
                <button
                  onClick={onLogout}
                  className={`p-2 rounded-xl border border-red-500/20 bg-red-500/5 text-red-400 hover:bg-red-500/10 transition-all cursor-pointer`}
                  title={t.signOut}
                  id="nav-btn-logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 text-xs uppercase font-mono tracking-widest font-bold bg-cyan-500 text-black hover:bg-cyan-400 rounded-xl transition-all cursor-pointer shadow-md shadow-cyan-500/10 active:scale-95"
                id="nav-btn-login"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span className="sm:inline hidden">{t.loginRegister}</span>
              </button>
            )}

          </div>

        </div>
      </div>
    </nav>
  );
}
