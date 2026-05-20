import { useState } from 'react';
import { translations, Language } from './LanguageDict';
import { AnalysisReport } from '../types';
import Markdown from 'react-markdown';
import { 
  ShieldCheck, AlertTriangle, Lightbulb, RefreshCw, 
  FileCode, CheckCircle2, ChevronRight, Copy, Download,
  ExternalLink, BarChart3, HelpCircle
} from 'lucide-react';

interface ResultsDisplayProps {
  lang: Language;
  theme: 'dark' | 'light';
  report: AnalysisReport;
  onClose: () => void;
}

export default function ResultsDisplay({
  lang,
  theme,
  report,
  onClose
}: ResultsDisplayProps) {
  const t = translations[lang];
  const [copied, setCopied] = useState(false);

  const getSeverityColor = (score: number) => {
    if (score > 70) return 'text-red-400 border-red-500/20 bg-red-500/5';
    if (score > 35) return 'text-amber-400 border-amber-500/20 bg-amber-500/5';
    return 'text-green-400 border-green-500/20 bg-green-500/5';
  };

  const getMeterStroke = (score: number) => {
    if (score > 70) return '#f87171'; // red-400
    if (score > 35) return '#fbbf24'; // amber-400
    return '#4ade80'; // green-400
  };

  const handleCopyReport = () => {
    navigator.clipboard.writeText(JSON.stringify(report, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header and command line bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400">{t.resultsTitle}</span>
          <h2 className={`text-xl font-display font-black tracking-wider uppercase ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>{report.title}</h2>
          <p className="text-xs text-gray-500 font-mono uppercase mt-1">Submitted by {report.studentName} for course {report.classId}</p>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyReport}
            className={`px-3 py-2 text-xs font-mono rounded-xl border flex items-center gap-1.5 transition-all cursor-pointer ${
              theme === 'dark' 
                ? 'border-white/5 bg-white/5 text-gray-300 hover:bg-white/10' 
                : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'
            }`}
            id="btn-copy-report"
          >
            <Copy className="w-4 h-4" />
            <span>{copied ? 'Copied Codex!' : 'Copy Code Payload'}</span>
          </button>

          <button
            onClick={() => alert("PDF Forensic Report downloaded successfully (Simulated).")}
            className="px-3 py-2 text-xs font-mono text-black bg-cyan-400 hover:bg-cyan-300 rounded-xl flex items-center gap-1.5 transition-all glow-cyan cursor-pointer"
            id="btn-download-pdf"
          >
            <Download className="w-4 h-4" />
            <span>Download Report</span>
          </button>

          <button
            onClick={onClose}
            className={`px-3 py-2 text-xs font-mono rounded-xl border flex items-center gap-1.5 transition-all cursor-pointer ${
              theme === 'dark' 
                ? 'border-red-500/20 bg-red-500/5 text-red-400 hover:bg-red-500/10' 
                : 'border-red-200 bg-red-50 text-red-600 hover:bg-red-100'
            }`}
            id="btn-close-results"
          >
            <RefreshCw className="w-4 h-4 animate-spin-slow" />
            <span>{t.closeScanner}</span>
          </button>
        </div>
      </div>

      {/* Main Forensic Stats Block */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Metric gauge meter display */}
        <div className={`col-span-1 p-6 rounded-2xl flex flex-col items-center justify-center text-center ${
          theme === 'dark' ? 'glass-panel-dark' : 'glass-panel-light'
        } border ${theme === 'dark' ? 'border-cyan-500/10' : 'border-gray-200'} relative overflow-hidden h-[300px]`}>
          <div className={`absolute inset-0 bg-gradient-to-b ${
            report.aiScore > 70 
              ? 'from-red-500/[0.06]' 
              : report.aiScore > 35 
                ? 'from-amber-500/[0.06]' 
                : 'from-green-500/[0.06]'
          } to-transparent pointer-events-none`} />
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/[0.03] rounded-full blur-2xl" />
          
          <h3 className={`text-[10px] font-mono uppercase tracking-widest mb-4 font-extrabold relative z-10 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          }`}>{t.aiProbability}</h3>

          <div className="relative w-36 h-36 flex items-center justify-center z-10">
            {/* SVG circle meter with glowing shadow */}
            <svg className="w-full h-full -rotate-90">
              <circle
                cx="72"
                cy="72"
                r="58"
                className={`${theme === 'dark' ? 'stroke-slate-900' : 'stroke-slate-200'} fill-none`}
                strokeWidth="10"
              />
              <circle
                cx="72"
                cy="72"
                r="58"
                className="fill-none transition-all duration-1000"
                strokeWidth="10"
                strokeDasharray={364.4}
                strokeDashoffset={364.4 - (364.4 * report.aiScore) / 100}
                stroke={getMeterStroke(report.aiScore)}
                strokeLinecap="round"
                style={{
                  filter: `drop-shadow(0 0 6px ${getMeterStroke(report.aiScore)}80)`
                }}
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className={`text-4xl font-display font-black tracking-tight ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>{report.aiScore}%</span>
              <span className={`text-[9px] uppercase tracking-widest font-mono font-bold mt-1 px-2.5 py-0.5 rounded-full border ${getSeverityColor(report.aiScore)}`}>
                {report.aiScore > 70 ? 'AI Flagged' : report.aiScore > 35 ? 'Warning' : 'Organic'}
              </span>
            </div>
          </div>

          <div className="mt-4 text-xs font-mono text-gray-500 relative z-10">
            Detected Language: <span className="text-cyan-400 font-bold">{report.language}</span>
          </div>
        </div>

        {/* Breakdown bar chart scores */}
        <div className={`col-span-1 md:col-span-2 p-6 rounded-2xl flex flex-col justify-between ${
          theme === 'dark' ? 'glass-panel-dark' : 'glass-panel-light'
        } border ${theme === 'dark' ? 'border-cyan-500/10' : 'border-gray-200'} relative h-[300px]`}>
          
          <div>
            <h3 className={`text-[10px] font-mono uppercase tracking-widest mb-4 font-extrabold flex items-center gap-1.5 ${
              theme === 'dark' ? 'text-cyan-400' : 'text-cyan-700'
            }`}>
              <BarChart3 className="w-4 h-4" />
              Forensic Metadata Scorecard
            </h3>

            <div className="space-y-3">
              {Object.entries(report.metrics).map(([key, val]) => (
                <div key={key} className="space-y-1">
                  <div className="flex justify-between text-[11px] font-mono uppercase text-gray-400">
                    <span>{key.replace(/([A-Z])/g, ' $1')}</span>
                    <span className="text-cyan-400 font-bold">{val}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-black/40 border border-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-cyan-400 rounded-full" 
                      style={{ width: `${val}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 pt-3 border-t border-white/5 text-[11px] font-mono text-gray-500">
            <span>Scan Accuracy Index:</span>
            <span className="text-white font-bold uppercase">{report.confidenceLevel} scanner node</span>
          </div>
        </div>

        {/* Score indicator panel */}
        <div className={`col-span-1 p-6 rounded-2xl flex flex-col items-center justify-center text-center ${
          theme === 'dark' ? 'glass-panel-dark' : 'glass-panel-light'
        } border ${theme === 'dark' ? 'border-cyan-500/10' : 'border-gray-200'} h-[300px]`}>
          <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 mb-4 animate-pulse">
            <ShieldCheck className="w-8 h-8" />
          </div>

          <h3 className={`text-[10px] font-mono uppercase tracking-widest mb-1.5 font-extrabold ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          }`}>{t.humanPercentage}</h3>
          
          <span className={`text-4xl font-display font-black text-green-400`}>
            {report.humanScore}%
          </span>
          
          <p className="text-[10px] text-gray-500 font-mono leading-relaxed max-w-[160px] mx-auto mt-4 uppercase">
            Quantifies the style alignment with organic human writing patterns.
          </p>
        </div>

      </div>

      {/* Style comparisons and AI Reasons */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-2">
        
        {/* Overall explanations */}
        <div className={`p-6 rounded-2xl ${
          theme === 'dark' ? 'glass-panel-dark' : 'glass-panel-light'
        } border ${theme === 'dark' ? 'border-cyan-500/10' : 'border-gray-200'} space-y-4`}>
          <h3 className={`text-[11px] font-mono uppercase tracking-widest font-extrabold flex items-center gap-1.5 ${
            theme === 'dark' ? 'text-cyan-400' : 'text-cyan-700'
          }`}>
            <Lightbulb className="w-4.5 h-4.5" />
            {t.explanation}
          </h3>

          <div className={`prose text-xs leading-relaxed max-h-[350px] overflow-y-auto pr-3 ${
            theme === 'dark' ? 'text-gray-300 prose-invert' : 'text-gray-700'
          }`}>
            <div className="markdown-body font-mono">
              <Markdown>{report.overallExplanation}</Markdown>
            </div>
          </div>
        </div>

        {/* Student vs AI contrasts */}
        <div className={`p-6 rounded-2xl ${
          theme === 'dark' ? 'glass-panel-dark' : 'glass-panel-light'
        } border ${theme === 'dark' ? 'border-cyan-500/10' : 'border-gray-200'} space-y-4`}>
          <h3 className={`text-[11px] font-mono uppercase tracking-widest font-extrabold flex items-center gap-1.5 ${
            theme === 'dark' ? 'text-cyan-400' : 'text-cyan-700'
          }`}>
            <AlertTriangle className="w-4.5 h-4.5" />
            {t.comparisons}
          </h3>

          <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2">
            {report.comparisons.map((item, idx) => (
              <div 
                key={idx}
                className={`p-3.5 rounded-xl border ${
                  theme === 'dark' ? 'bg-black/40 border-white/5' : 'bg-gray-50 border-gray-100'
                } space-y-2`}
              >
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{item.feature}</span>
                  <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-md ${
                    item.verdict === 'Typical AI' 
                      ? 'text-red-400 bg-red-500/5 border border-red-500/15'
                      : item.verdict === 'Suspicious'
                      ? 'text-amber-400 bg-amber-500/5 border border-amber-500/15'
                      : 'text-green-400 bg-green-500/5 border border-green-500/15'
                  }`}>{item.verdict}</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-1.5 border-t border-white/5 text-[11px] font-mono">
                  <div className="space-y-0.5">
                    <span className="text-gray-500 block text-[9px] uppercase tracking-wider">Observed:</span>
                    <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>{item.observedPattern}</span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-gray-500 block text-[9px] uppercase tracking-wider">Typical Bot Pattern:</span>
                    <span className={theme === 'dark' ? 'text-cyan-300/80' : 'text-cyan-800'}>{item.aiTypicalPattern}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Code terminal highlighted suspicious lines */}
      <div className={`p-6 rounded-2xl ${
        theme === 'dark' ? 'glass-panel-dark' : 'glass-panel-light'
      } border ${theme === 'dark' ? 'border-cyan-500/10' : 'border-gray-200'} space-y-4`}>
        <div className="flex items-center justify-between pb-3 border-b border-white/5">
          <h3 className={`text-[11px] font-mono uppercase tracking-widest font-extrabold flex items-center gap-1.5 ${
            theme === 'dark' ? 'text-cyan-400' : 'text-cyan-700'
          }`}>
            <FileCode className="w-4.5 h-4.5" />
            {t.suspiciousLines}
          </h3>
          <span className="text-xs font-mono text-gray-500">Source: {report.fileName}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* List of flag coordinates */}
          <div className="col-span-1 space-y-2 max-h-64 overflow-y-auto pr-2">
            {report.suspiciousLines.map((line, idx) => (
              <div 
                key={idx}
                className={`p-3 rounded-lg border text-xs font-mono space-y-1.5 ${
                  theme === 'dark' ? 'bg-black/60 border-white/5' : 'bg-gray-50 border-gray-100'
                }`}
              >
                <div className="flex justify-between text-[11px] uppercase tracking-widest text-cyan-400 font-bold">
                  <span>Line {line.lineNumber} Flag</span>
                  <span className="text-red-400">{line.score}% Suspect</span>
                </div>
                <p className="text-[11px] leading-relaxed text-gray-400">{line.reason}</p>
              </div>
            ))}
          </div>

          {/* Glowing Code Terminal Mockup */}
          <div className="col-span-2 rounded-xl bg-slate-950 border border-white/5 p-4 font-mono text-xs overflow-x-auto relative min-h-[160px]">
            <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/60 px-2 py-0.5 rounded text-[9px] uppercase text-cyan-500">
              <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping" />
              <span>Diagnostic Console</span>
            </div>

            <div className="space-y-1">
              {report.suspiciousLines.map((line, idx) => (
                <div key={idx} className="flex items-start gap-4 p-1 rounded bg-red-500/5 border border-red-500/15">
                  <span className="text-red-400 font-bold select-none">{line.lineNumber.toString().padStart(2, '0')}</span>
                  <div className="flex-1">
                    <code className="text-red-300 block overflow-x-auto bg-slate-900 p-1.5 rounded">{line.snippet}</code>
                    <span className="text-[10px] text-gray-500 block mt-1">↳ Exception: {line.reason}</span>
                  </div>
                </div>
              ))}
              
              <div className="text-[11px] text-gray-600 italic select-none pl-8 mt-4">
                // System analyzed all lines. Remaining blocks are standard compliance.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actionable recommendations banner */}
      <div className={`p-6 rounded-2xl ${
        theme === 'dark' ? 'bg-cyan-950/20 border-cyan-500/15' : 'bg-cyan-50 border-cyan-200'
      } border flex items-start gap-4`}>
        <div className="p-2 bg-cyan-500/20 border border-cyan-500/30 rounded-xl text-cyan-400">
          <ChevronRight className="w-5 h-5" />
        </div>
        <div className="space-y-2">
          <h4 className={`text-sm font-display font-medium uppercase tracking-wider ${
            theme === 'dark' ? 'text-white' : 'text-cyan-800'
          }`}>{t.recommendations}</h4>
          
          <ul className={`text-xs font-mono space-y-1.5 list-disc pl-4 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}>
            {report.recommendations.map((rec, idx) => (
              <li key={idx}>
                {rec}
              </li>
            ))}
          </ul>
        </div>
      </div>

    </div>
  );
}
