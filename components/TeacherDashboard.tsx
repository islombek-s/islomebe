import { useState, useEffect } from 'react';
import { translations, Language } from './LanguageDict';
import { Submission, TeacherPreferences, UserSession } from '../types';
import { 
  Landmark, AlertOctagon, AlertTriangle, ShieldCheck, 
  Search, Sliders, Save, Check, RefreshCw, BarChart
} from 'lucide-react';

interface TeacherDashboardProps {
  lang: Language;
  theme: 'dark' | 'light';
  session: UserSession | null;
}

export default function TeacherDashboard({
  lang,
  theme,
  session
}: TeacherDashboardProps) {
  const t = translations[lang];

  // Prefs
  const [prefs, setPrefs] = useState<TeacherPreferences>({
    flagThreshold: 70,
    warningThreshold: 35,
    autoReport: true,
    activeLanguage: lang
  });

  const [search, setSearch] = useState('');
  const [selectedClass, setSelectedClass] = useState('All');
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [saved, setSaved] = useState(false);

  // Load submissions from LocalStorage + seed with fallback mock data
  useEffect(() => {
    const local = localStorage.getItem('detector-submissions');
    if (local) {
      setSubmissions(JSON.parse(local));
    } else {
      // Seed initial high-fidelity mock records
      const initialMock: Submission[] = [
        {
          id: "rep-school-1",
          title: "Calculus Limits Homework",
          studentName: "Alisher Qodirov",
          studentId: "stu-2022",
          classId: "Intro to Computer Science CS101",
          fileName: "limits_exercise.py",
          timestamp: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 hours ago
          aiScore: 92,
          status: 'flagged'
        },
        {
          id: "rep-school-2",
          title: "Database Relational Models",
          studentName: "Malika Ismoilova",
          studentId: "stu-4045",
          classId: "Advanced Web Apps Architecture CS404",
          fileName: "SchemaDefinitions.sql",
          timestamp: new Date(Date.now() - 3600000 * 5).toISOString(), // 5 hours ago
          aiScore: 18,
          status: 'passed'
        },
        {
          id: "rep-school-3",
          title: "React Auth Hooks",
          studentName: "Jasur Nematov",
          studentId: "stu-7071",
          classId: "Advanced Web Apps Architecture CS404",
          fileName: "useAuth.tsx",
          timestamp: new Date(Date.now() - 3600000 * 12).toISOString(), // 12 hours ago
          aiScore: 54,
          status: 'warning'
        },
        {
          id: "rep-school-4",
          title: "Binary Tree Inversion",
          studentName: "Zilola Toirova",
          studentId: "stu-0012",
          classId: "Intro to Computer Science CS101",
          fileName: "inverter.py",
          timestamp: new Date(Date.now() - 3600000 * 24).toISOString(), // 24 hours ago
          aiScore: 84,
          status: 'flagged'
        }
      ];
      localStorage.setItem('detector-submissions', JSON.stringify(initialMock));
      setSubmissions(initialMock);
    }
  }, []);

  const handleSavePrefs = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  // Calculations
  const totalScans = submissions.length;
  const avgAiScore = totalScans > 0 
    ? Math.round(submissions.reduce((acc, cur) => acc + cur.aiScore, 0) / totalScans)
    : 0;

  const flaggedCount = submissions.filter(s => s.aiScore >= prefs.flagThreshold).length;
  const warningCount = submissions.filter(s => s.aiScore >= prefs.warningThreshold && s.aiScore < prefs.flagThreshold).length;

  // Filter lists
  const filtered = submissions.filter(s => {
    const matchesSearch = s.studentName.toLowerCase().includes(search.toLowerCase()) || 
                          s.title.toLowerCase().includes(search.toLowerCase());
    const matchesClass = selectedClass === 'All' || s.classId === selectedClass;
    return matchesSearch && matchesClass;
  });

  const getStatusBadge = (score: number) => {
    if (score >= prefs.flagThreshold) {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full border border-red-500/20 bg-red-500/5 text-red-400">
          <AlertOctagon className="w-3 h-3" />
          <span>Severe AI suspect</span>
        </span>
      );
    }
    if (score >= prefs.warningThreshold) {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full border border-amber-500/20 bg-amber-500/5 text-amber-400">
          <AlertTriangle className="w-3 h-3" />
          <span>Suspicious</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full border border-green-500/20 bg-green-500/5 text-green-400">
        <ShieldCheck className="w-3 h-3" />
        <span>Authentic Human</span>
      </span>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Page Title */}
      <div className="pb-4 border-b border-white/5">
        <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400">{t.teacherPortal}</span>
        <h2 className={`text-xl font-display font-black tracking-wider uppercase ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>{t.dashboardHeader}</h2>
      </div>

      {/* Aggregate Stats bento cluster */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        
        {/* Metric 1 */}
        <div className={`p-5 rounded-2xl ${
          theme === 'dark' ? 'glass-panel-dark' : 'glass-panel-light'
        } border ${theme === 'dark' ? 'border-cyan-500/10' : 'border-gray-200'} flex items-center justify-between`}>
          <div className="space-y-1">
            <span className="block text-[10px] font-mono uppercase tracking-wider text-gray-500">{t.statsTotalScans}</span>
            <span className={`text-3xl font-display font-black leading-none ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>{totalScans}</span>
          </div>
          <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-xl border border-cyan-500/20">
            <RefreshCw className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 2 */}
        <div className={`p-5 rounded-2xl ${
          theme === 'dark' ? 'glass-panel-dark' : 'glass-panel-light'
        } border ${theme === 'dark' ? 'border-cyan-500/10' : 'border-gray-200'} flex items-center justify-between`}>
          <div className="space-y-1">
            <span className="block text-[10px] font-mono uppercase tracking-wider text-gray-500">{t.statsAvgScore}</span>
            <span className={`text-3xl font-display font-black leading-none ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>{avgAiScore}%</span>
          </div>
          <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-xl border border-cyan-500/20">
            <BarChart className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 3 */}
        <div className={`p-5 rounded-2xl ${
          theme === 'dark' ? 'glass-panel-dark' : 'glass-panel-light'
        } border ${theme === 'dark' ? 'border-cyan-500/10' : 'border-gray-200'} flex items-center justify-between`}>
          <div className="space-y-1">
            <span className="block text-[10px] font-mono uppercase tracking-wider text-gray-500">{t.statsFlagged}</span>
            <span className={`text-3xl font-display font-black leading-none text-red-400`}>{flaggedCount}</span>
          </div>
          <div className="p-3 bg-red-500/10 text-red-400 rounded-xl border border-red-500/20">
            <AlertOctagon className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 4 */}
        <div className={`p-5 rounded-2xl ${
          theme === 'dark' ? 'glass-panel-dark' : 'glass-panel-light'
        } border ${theme === 'dark' ? 'border-cyan-500/10' : 'border-gray-200'} flex items-center justify-between`}>
          <div className="space-y-1">
            <span className="block text-[10px] font-mono uppercase tracking-wider text-gray-500">{t.statsWarning}</span>
            <span className={`text-3xl font-display font-black leading-none text-amber-400`}>{warningCount}</span>
          </div>
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* Main Core split grid content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left list submissions table */}
        <div className={`lg:col-span-2 p-6 rounded-2xl ${
          theme === 'dark' ? 'glass-panel-dark' : 'glass-panel-light'
        } border ${theme === 'dark' ? 'border-cyan-500/10' : 'border-gray-200'} flex flex-col justify-between`}>
          
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-4 border-b border-white/5">
              <h3 className={`text-xs font-mono uppercase tracking-widest font-extrabold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>{t.scansHistory}</h3>

              {/* Course Selector filter */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-gray-500 uppercase">Course:</span>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className={`px-3 py-1.5 border text-xs font-mono rounded-xl focus:outline-none focus:border-cyan-400 ${
                    theme === 'dark' 
                      ? 'border-white/5 bg-black text-white' 
                      : 'border-gray-200 text-gray-950 bg-gray-50'
                  }`}
                  id="dash-filter-course"
                >
                  <option value="All">All Courses</option>
                  <option value="Intro to Computer Science CS101">Intro to CS101</option>
                  <option value="Advanced Web Apps Architecture CS404">Advanced CS404</option>
                </select>
              </div>
            </div>

            {/* Interactive Search */}
            <div className="relative mb-4">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-cyan-500/60">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t.filterStudent}
                className={`w-full pl-9 pr-4 py-2 border text-xs font-mono rounded-xl transition-colors focus:outline-none focus:border-cyan-400 ${
                  theme === 'dark' 
                    ? 'border-white/5 bg-black/40 text-white placeholder-gray-600' 
                    : 'border-gray-200 text-gray-950 placeholder-gray-400 bg-gray-50'
                }`}
                id="dash-input-search"
              />
            </div>

            {/* List */}
            <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
              {filtered.length === 0 ? (
                <div className="py-8 text-center text-xs font-mono text-gray-500 uppercase">
                  No matching submissions recorded in academic terminals.
                </div>
              ) : (
                filtered.map((sub) => (
                  <div 
                    key={sub.id} 
                    className={`p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                      theme === 'dark' ? 'bg-black/40 border-white/5 hover:bg-cyan-500/[0.02]' : 'bg-gray-50 border-gray-100 hover:bg-cyan-50/45'
                    }`}
                  >
                    <div className="space-y-1 overflow-hidden">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{sub.studentName}</span>
                        <span className="text-[9px] font-mono text-cyan-400 uppercase bg-cyan-950/20 px-1.5 py-0.5 rounded border border-cyan-500/15">{sub.fileName}</span>
                      </div>
                      <span className="block text-[11px] font-mono font-medium text-gray-400 hover:text-white truncate">{sub.title}</span>
                      <span className="block text-[9px] font-mono text-gray-500 uppercase">{new Date(sub.timestamp).toLocaleString()}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className={`block text-sm font-display font-black ${
                          sub.aiScore >= prefs.flagThreshold ? 'text-red-400' : sub.aiScore >= prefs.warningThreshold ? 'text-amber-400' : 'text-green-400'
                        }`}>{sub.aiScore}% AI</span>
                        <div className="mt-0.5">{getStatusBadge(sub.aiScore)}</div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>

        </div>

        {/* Right Preferences Threshold Panel */}
        <div className={`p-6 rounded-2xl ${
          theme === 'dark' ? 'glass-panel-dark' : 'glass-panel-light'
        } border ${theme === 'dark' ? 'border-cyan-500/10' : 'border-gray-200'} relative overflow-hidden`}>
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/[0.03] rounded-full blur-2xl" />

          <h3 className={`text-xs font-mono uppercase tracking-widest font-extrabold mb-4 flex items-center gap-1.5 ${
            theme === 'dark' ? 'text-cyan-400' : 'text-cyan-700'
          }`}>
            <Sliders className="w-4.5 h-4.5" />
            {t.thresholdSetting}
          </h3>

          <form onSubmit={handleSavePrefs} className="space-y-6">
            
            {/* Slider 1 */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono text-red-400 font-bold uppercase">
                <span>{t.flagThreshold}</span>
                <span>{prefs.flagThreshold}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="95"
                step="5"
                value={prefs.flagThreshold}
                onChange={(e) => setPrefs(prev => ({ ...prev, flagThreshold: parseInt(e.target.value) }))}
                className="w-full accent-red-500 cursor-pointer"
                id="prefs-range-flag"
              />
              <p className="text-[10px] text-gray-500 font-mono text-right">Triggers overall Severe violation colors</p>
            </div>

            {/* Slider 2 */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono text-amber-400 font-bold uppercase">
                <span>{t.warningThreshold}</span>
                <span>{prefs.warningThreshold}%</span>
              </div>
              <input
                type="range"
                min="20"
                max="50"
                step="5"
                value={prefs.warningThreshold}
                onChange={(e) => setPrefs(prev => ({ ...prev, warningThreshold: parseInt(e.target.value) }))}
                className="w-full accent-amber-500 cursor-pointer"
                id="prefs-range-warning"
              />
              <p className="text-[10px] text-gray-500 font-mono text-right">Triggers yellow moderate suspect highlights</p>
            </div>

            {/* Toggle options */}
            <div className="pt-4 border-t border-white/5 space-y-3">
              <label className="flex items-center gap-2 text-xs font-mono text-gray-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={prefs.autoReport}
                  onChange={(e) => setPrefs(prev => ({ ...prev, autoReport: e.target.checked }))}
                  className="rounded border-white/10 bg-black/60 text-cyan-500 focus:ring-cyan-400/20"
                  id="prefs-check-autoreport"
                />
                <span className="uppercase select-none">Deploy instant autograde reports</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-display font-semibold transition-all rounded-xl shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 uppercase tracking-widest text-xs cursor-pointer"
              id="prefs-btn-save"
            >
              {saved ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Calibrated Done</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{t.saveSettings}</span>
                </>
              )}
            </button>
          </form>

        </div>

      </div>

    </div>
  );
}
