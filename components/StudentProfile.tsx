import { useState, useEffect } from 'react';
import { translations, Language } from './LanguageDict';
import { Submission, UserSession } from '../types';
import { 
  User, CheckCircle2, Award, Flame, ShieldAlert,
  Calendar, FileCode, Search, TrendingUp, Info
} from 'lucide-react';

interface StudentProfileProps {
  lang: Language;
  theme: 'dark' | 'light';
  session: UserSession | null;
}

export default function StudentProfile({
  lang,
  theme,
  session
}: StudentProfileProps) {
  const t = translations[lang];

  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [search, setSearch] = useState('');

  // Fetch submissions from LocalStorage
  useEffect(() => {
    const local = localStorage.getItem('detector-submissions');
    if (local) {
      // Filter out only current student's scans if possible or show overall for demonstration
      const all: Submission[] = JSON.parse(local);
      const studentName = session?.username || "Alisher Qodirov";
      setSubmissions(all.filter(s => s.studentName.toLowerCase().includes(studentName.toLowerCase()) || s.studentName === "Anonymous Student"));
    } else {
      // Fallback
      const initialMock: Submission[] = [
        {
          id: "rep-school-1",
          title: "Calculus Limits Homework",
          studentName: "Alisher Qodirov",
          studentId: "stu-2022",
          classId: "Intro to Computer Science CS101",
          fileName: "limits_exercise.py",
          timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
          aiScore: 92,
          status: 'flagged'
        },
        {
          id: "rep-school-5",
          title: "Intro To Logic Circuits",
          studentName: "Alisher Qodirov",
          studentId: "stu-2022",
          classId: "Intro to Computer Science CS101",
          fileName: "circuits.txt",
          timestamp: new Date(Date.now() - 3600000 * 72).toISOString(),
          aiScore: 8,
          status: 'passed'
        }
      ];
      setSubmissions(initialMock);
    }
  }, [session]);

  const filtered = submissions.filter(s => s.title.toLowerCase().includes(search.toLowerCase()) || s.fileName.toLowerCase().includes(search.toLowerCase()));

  // Calculations
  const scanCount = submissions.length;
  const avgIntegrity = scanCount > 0 
    ? Math.round(submissions.reduce((acc, cur) => acc + (100 - cur.aiScore), 0) / scanCount)
    : 100;

  const styleConsistency = scanCount > 0 ? 82 : 0;
  const rank = avgIntegrity > 80 ? 'Class Honor Member' : avgIntegrity > 50 ? 'Compliant Submitter' : 'Audit Pipeline';

  return (
    <div className="space-y-6 animate-fade-in text-left">
      
      {/* Page Title */}
      <div className="pb-4 border-b border-white/5">
        <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400">{t.studentPortal}</span>
        <h2 className={`text-xl font-display font-black tracking-wider uppercase ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>{t.studentHeader}</h2>
      </div>

      {/* Profile Overview Banner */}
      <div className={`p-6 rounded-2xl ${
        theme === 'dark' ? 'glass-panel-dark' : 'glass-panel-light'
      } border ${theme === 'dark' ? 'border-cyan-500/10' : 'border-gray-200'} relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6`}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/[0.02] rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 border border-cyan-400/20 text-black flex items-center justify-center font-display font-black text-lg shadow-lg shadow-cyan-500/15">
            {session?.username?.substring(0, 2).toUpperCase() || "AQ"}
          </div>
          <div>
            <h3 className={`text-base font-display font-black uppercase tracking-wider ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>{session?.username || "Alisher Qodirov"}</h3>
            <p className="text-xs text-gray-400 font-mono">Academic ID Code: <span className="text-cyan-400 font-semibold">{session?.id || "stu-2022"}</span></p>
            <div className="flex items-center gap-1.5 mt-2">
              <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-md border border-cyan-500/20 bg-cyan-500/5 text-cyan-400 font-bold`}>
                {rank}
              </span>
            </div>
          </div>
        </div>

        {/* Mini stats cards cluster */}
        <div className="grid grid-cols-3 gap-4 font-mono text-center">
          <div className="px-4 py-2 bg-black/40 border border-white/5 rounded-xl space-y-0.5 min-w-[100px]">
            <span className="text-[9px] text-gray-500 tracking-wider uppercase block">Audited</span>
            <span className="text-sm font-black text-white block">{scanCount} Files</span>
          </div>
          <div className="px-4 py-2 bg-black/40 border border-white/5 rounded-xl space-y-0.5 min-w-[100px]">
            <span className="text-[9px] text-gray-500 tracking-wider uppercase block">Integrity</span>
            <span className="text-sm font-black text-green-400 block">{avgIntegrity}%</span>
          </div>
          <div className="px-4 py-2 bg-black/40 border border-white/5 rounded-xl space-y-0.5 min-w-[100px]">
            <span className="text-[9px] text-gray-500 tracking-wider uppercase block">Streak</span>
            <span className="text-sm font-black text-orange-400 block flex items-center justify-center gap-0.5">
              <Flame className="w-3.5 h-3.5 fill-orange-500" />
              <span>5 Days</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main split dashboard segments */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Submissions Ledger Log */}
        <div className={`lg:col-span-2 p-6 rounded-2xl ${
          theme === 'dark' ? 'glass-panel-dark' : 'glass-panel-light'
        } border ${theme === 'dark' ? 'border-cyan-500/10' : 'border-gray-200'} space-y-4`}>
          <div className="flex justify-between items-center pb-3 border-b border-white/5">
            <h3 className={`text-xs font-mono uppercase tracking-widest font-extrabold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>My Audited Submissions</h3>
            <span className="text-[10px] font-mono text-gray-500">History Log</span>
          </div>

          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-cyan-500/60">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by file or title..."
              className={`w-full pl-9 pr-4 py-2 border text-xs font-mono rounded-xl focus:outline-none focus:border-cyan-400 ${
                theme === 'dark' 
                  ? 'border-white/5 bg-black/40 text-white placeholder-gray-600' 
                  : 'border-gray-200 text-gray-950 placeholder-gray-400 bg-gray-50'
              }`}
              id="student-search"
            />
          </div>

          <div className="space-y-2 max-h-72 overflow-y-auto pr-2">
            {filtered.length === 0 ? (
              <div className="py-8 text-center text-xs font-mono text-gray-500 uppercase">
                No audited files in repository registry.
              </div>
            ) : (
              filtered.map((item) => (
                <div 
                  key={item.id}
                  className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                    theme === 'dark' ? 'bg-black/60 border-white/5 hover:bg-cyan-500/[0.02]' : 'bg-gray-50 border-gray-100 hover:bg-cyan-50/50'
                  }`}
                >
                  <div className="space-y-0.5 overflow-hidden">
                    <div className="flex items-center gap-2">
                      <FileCode className="w-3.5 h-3.5 text-cyan-400" />
                      <span className={`text-xs font-semibold truncate ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{item.fileName}</span>
                    </div>
                    <span className="block text-[11px] font-mono text-gray-400 truncate">{item.title}</span>
                    <span className="block text-[9px] text-gray-500 font-mono uppercase">{new Date(item.timestamp).toLocaleString()}</span>
                  </div>

                  <div className="text-right font-mono">
                    <span className={`block text-xs font-bold ${
                      item.aiScore > 70 ? 'text-red-400' : 'text-green-400'
                    }`}>{item.aiScore > 70 ? 'AI Detected' : 'Organic Human'}</span>
                    <span className="text-[10px] text-gray-500">{(100 - item.aiScore)}% Integrity</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Smart Analytics Indexes */}
        <div className={`p-6 rounded-2xl ${
          theme === 'dark' ? 'glass-panel-dark' : 'glass-panel-light'
        } border ${theme === 'dark' ? 'border-cyan-500/10' : 'border-gray-200'} space-y-6`}>
          
          <div>
            <h3 className={`text-xs font-mono uppercase tracking-widest font-extrabold flex items-center gap-1.5 mb-4 ${
              theme === 'dark' ? 'text-cyan-400' : 'text-cyan-700'
            }`}>
              <TrendingUp className="w-4.5 h-4.5" />
              Linguistic Footprint
            </h3>

            {/* Custom SVG Radar/Polygon or beautiful charts */}
            <div className="relative h-40 flex items-center justify-center p-3 rounded-xl bg-black/40 border border-white/5">
              {/* Graphic container */}
              <svg className="w-full h-full" viewBox="0 0 200 120">
                <line x1="20" y1="100" x2="180" y2="100" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                <line x1="20" y1="60" x2="180" y2="60" stroke="rgba(255,255,255,0.02)" strokeWidth="1" strokeDasharray="3" />
                <line x1="20" y1="20" x2="180" y2="20" stroke="rgba(255,255,255,0.02)" strokeWidth="1" strokeDasharray="3" />
                
                {/* SVG Polyline Chart representing integrity scores */}
                <polyline
                  fill="none"
                  stroke="#22d3ee"
                  strokeWidth="2.5"
                  points="20,80 50,40 90,85 130,25 180,95"
                  className="drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]"
                />
                
                {/* Pulsing focal nodes */}
                <circle cx="20" cy="80" r="3" fill="#22d3ee" />
                <circle cx="50" cy="40" r="3" fill="#22d3ee" />
                <circle cx="90" cy="85" r="3" fill="#22d3ee" />
                <circle cx="130" cy="25" r="3" fill="#22d3ee" />
                <circle cx="180" cy="95" r="3" fill="#22d3ee" />
              </svg>
              <div className="absolute top-2 left-2 text-[9px] font-mono uppercase text-gray-500">Historical Scan Averages</div>
            </div>
          </div>

          {/* Submittable Streaks Info Box */}
          <div className={`p-4 rounded-xl border ${
            theme === 'dark' ? 'bg-cyan-950/20 border-cyan-500/10 text-cyan-400' : 'bg-cyan-50 border-cyan-200 text-cyan-800'
          } text-[11px] font-mono leading-relaxed space-y-1.5`}>
            <div className="flex items-center gap-1.5 font-bold uppercase">
              <Flame className="w-4 h-4 text-orange-400 fill-orange-500" />
              <span>Streak Milestone Active!</span>
            </div>
            <p>You have committed 5 consecutive homework submissions classified entirely as "Organic Human Style". Excellent job maintaining academic honors!</p>
          </div>

        </div>

      </div>

    </div>
  );
}
