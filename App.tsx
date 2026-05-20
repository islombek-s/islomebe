import { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import LandingPage from './components/LandingPage';
import UploadZone from './components/UploadZone';
import ResultsDisplay from './components/ResultsDisplay';
import TeacherDashboard from './components/TeacherDashboard';
import StudentProfile from './components/StudentProfile';
import AuthModal from './components/AuthModal';
import { UserSession, AnalysisReport } from './types';
import { Language, translations } from './components/LanguageDict';
import { Activity, ShieldCheck, HeartPulse } from 'lucide-react';

export default function App() {
  const [lang, setLang] = useState<Language>('en');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [currentTab, setCurrentTab] = useState<string>('landing');
  
  // Auth & Session
  const [session, setSession] = useState<UserSession | null>(null);
  const [authOpen, setAuthOpen] = useState(false);

  // Active Report
  const [activeReport, setActiveReport] = useState<AnalysisReport | null>(null);

  // Sync token on boot
  useEffect(() => {
    const userJson = localStorage.getItem('detector-user');
    if (userJson) {
      setSession(JSON.parse(userJson));
    }
  }, []);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleLogout = () => {
    localStorage.removeItem('detector-token');
    localStorage.removeItem('detector-user');
    setSession(null);
    setCurrentTab('landing');
  };

  const handleAnalysisStart = () => {
    setActiveReport(null);
  };

  const handleAnalysisSuccess = (report: AnalysisReport) => {
    setActiveReport(report);
    setCurrentTab('results');
  };

  const handleAnalysisFail = (err: string) => {
    alert("Detector scan failed: " + err);
  };

  return (
    <div className={`min-h-screen flex flex-col transition-all duration-300 ${
      theme === 'dark' 
        ? 'bg-[#020408] text-[#f1f5f9]' 
        : 'bg-[#f8fafc] text-[#0f172a]'
    }`}>
      
      {/* Glow ambient beacons */}
      {theme === 'dark' && (
        <>
          <div className="fixed top-[-20%] left-[-10%] w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none z-0" />
          <div className="fixed bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none z-0" />
        </>
      )}

      {/* Cyber navigation */}
      <Navigation
        lang={lang}
        setLang={setLang}
        theme={theme}
        toggleTheme={toggleTheme}
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          setCurrentTab(tab);
          // If viewing scanner and setting a new report, clear so scanner shows uploader
          if (tab === 'scanner') {
            setActiveReport(null);
          }
        }}
        session={session}
        onLogout={handleLogout}
        onOpenAuth={() => setAuthOpen(true)}
      />

      {/* Main viewport frame */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
        {currentTab === 'landing' && (
          <LandingPage
            lang={lang}
            theme={theme}
            onGetStarted={() => setCurrentTab('scanner')}
          />
        )}

        {currentTab === 'scanner' && !activeReport && (
          <div className="space-y-6 max-w-5xl mx-auto">
            {/* Header info */}
            <div className="pb-4 border-b border-white/5 text-left">
              <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400">Quantum Skaner Terminali</span>
              <h2 className={`text-xl font-display font-black tracking-wider uppercase ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>{translations[lang].getStarted}</h2>
            </div>

            <UploadZone
              lang={lang}
              theme={theme}
              session={session}
              onAnalysisStart={handleAnalysisStart}
              onAnalysisSuccess={handleAnalysisSuccess}
              onAnalysisFail={handleAnalysisFail}
            />
          </div>
        )}

        {currentTab === 'results' && activeReport && (
          <ResultsDisplay
            lang={lang}
            theme={theme}
            report={activeReport}
            onClose={() => {
              setActiveReport(null);
              setCurrentTab('scanner');
            }}
          />
        )}

        {/* Fallback layout if user attempts to view results without active report */}
        {currentTab === 'results' && !activeReport && (
          <div className="py-24 text-center max-w-md mx-auto space-y-4">
            <ShieldCheck className="w-12 h-12 text-cyan-500 mx-auto select-none" />
            <h3 className="font-display uppercase tracking-wider font-bold text-sm">No Active Compliance Report</h3>
            <p className="text-xs font-mono text-gray-400">Scan code documents or ZIP projects inside the scanner console to populate diagnostics reports.</p>
            <button 
              onClick={() => setCurrentTab('scanner')}
              className="px-4 py-2 bg-cyan-500 text-black text-xs font-mono font-bold rounded-xl uppercase tracking-wider"
              id="empty-results-fallback-btn"
            >
              Go to Scanner
            </button>
          </div>
        )}

        {currentTab === 'teacher' && (
          <TeacherDashboard
            lang={lang}
            theme={theme}
            session={session}
          />
        )}

        {currentTab === 'student' && (
          <StudentProfile
            lang={lang}
            theme={theme}
            session={session}
          />
        )}
      </main>

      {/* Cyber Status margins footer bar */}
      <footer className={`py-6 border-t font-mono text-[10px] transition-colors ${
        theme === 'dark' ? 'bg-black/40 border-cyan-500/5 text-gray-500' : 'bg-gray-50 border-gray-150 text-gray-600'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span className="uppercase tracking-wider">Linguistic Sentry Core Version v2.1.0-Active</span>
          </div>
          
          <div className="flex items-center gap-4 uppercase tracking-widest">
            <span>Security standard encryption grade AES-256</span>
            <span>Academic integrity node aligned</span>
          </div>
        </div>
      </footer>

      {/* Connection Gateway Authenticator Modal overlay */}
      {authOpen && (
        <AuthModal
          lang={lang}
          onSuccess={(newSession) => setSession(newSession)}
          onClose={() => setAuthOpen(false)}
        />
      )}

    </div>
  );
}
