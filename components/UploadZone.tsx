import { useState, useRef, DragEvent } from 'react';
import { translations, Language } from './LanguageDict';
import { ExtractedFile, ScanStatus, AnalysisReport, UserSession } from '../types';
import JSZip from 'jszip';
import { 
  UploadCloud, FileText, AlertTriangle, HelpCircle, 
  Trash2, Play, Loader, FolderArchive, ArrowRight 
} from 'lucide-react';

interface UploadZoneProps {
  lang: Language;
  theme: 'dark' | 'light';
  session: UserSession | null;
  onAnalysisStart: () => void;
  onAnalysisSuccess: (report: AnalysisReport) => void;
  onAnalysisFail: (err: string) => void;
}

export default function UploadZone({
  lang,
  theme,
  session,
  onAnalysisStart,
  onAnalysisSuccess,
  onAnalysisFail
}: UploadZoneProps) {
  const t = translations[lang];

  const [dragActive, setDragActive] = useState(false);
  const [extractedFiles, setExtractedFiles] = useState<ExtractedFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  
  // Submission Meta
  const [title, setTitle] = useState('');
  const [studentName, setStudentName] = useState(session?.username || '');
  const [classId, setClassId] = useState('Intro to Computer Science CS101');
  const [customFileText, setCustomFileText] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Drag handlers
  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await processUploadedFiles(Array.from(e.dataTransfer.files));
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await processUploadedFiles(Array.from(e.target.files));
    }
  };

  // Process ZIP and individual files
  const processUploadedFiles = async (files: File[]) => {
    setLoading(true);
    setStatusMessage(t.checkingFiles);
    const newExtracted: ExtractedFile[] = [];

    try {
      for (const file of files) {
        const fileExtension = file.name.split('.').pop()?.toLowerCase();

        if (fileExtension === 'zip') {
          // Parse ZIP with JSZip
          const zip = new JSZip();
          const contents = await zip.loadAsync(file);
          
          for (const [relativePath, zipEntry] of Object.entries(contents.files)) {
            if (!zipEntry.dir) {
              const fileType = relativePath.split('.').pop()?.toLowerCase() || '';
              // Accept standard code or text files in ZIP
              if (['js', 'ts', 'tsx', 'py', 'java', 'html', 'css', 'txt', 'json', 'md'].includes(fileType)) {
                const text = await zipEntry.async('string');
                newExtracted.push({
                  name: relativePath,
                  content: text,
                  size: text.length // estimate size
                });
              }
            }
          }
        } else {
          // Individual text files
          const text = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => resolve(event.target?.result as string || '');
            reader.onerror = (err) => reject(err);
            reader.readAsText(file);
          });

          newExtracted.push({
            name: file.name,
            content: text,
            size: file.size
          });
        }
      }

      setExtractedFiles(prev => [...prev, ...newExtracted]);
    } catch (err: any) {
      console.error(err);
      alert("Failed to parse some uploaded files: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePasteAnalyze = () => {
    if (!customFileText.trim()) return;
    
    const fileTitle = title.trim() ? `${title.replace(/\s+/g, '_')}.txt` : `pasted_submission_${Date.now()}.txt`;
    const newFile: ExtractedFile = {
      name: fileTitle,
      content: customFileText,
      size: customFileText.length
    };
    
    setExtractedFiles([newFile]);
    setCustomFileText('');
  };

  const removeFile = (index: number) => {
    setExtractedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const clearAll = () => {
    setExtractedFiles([]);
  };

  // Run Backend AI analysis helper
  const triggerScan = async () => {
    if (extractedFiles.length === 0) return;
    
    onAnalysisStart();
    setLoading(true);
    setStatusMessage(t.scanning);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title: title || "Class Assignment Scan",
          studentName: studentName || "Unknown Student",
          classId: classId,
          files: extractedFiles
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Analyzing submission failed.");
      }

      // Add to local scanning submission history
      const localHistory = JSON.parse(localStorage.getItem('detector-submissions') || '[]');
      const newSubmission = {
        id: data.id,
        title: data.title,
        studentName: data.studentName,
        studentId: data.studentId,
        classId: data.classId,
        fileName: data.fileName,
        timestamp: data.timestamp,
        aiScore: data.aiScore,
        status: data.aiScore > 70 ? 'flagged' : data.aiScore > 35 ? 'warning' : 'passed'
      };
      
      localStorage.setItem('detector-submissions', JSON.stringify([newSubmission, ...localHistory]));

      onAnalysisSuccess(data);
    } catch (err: any) {
      onAnalysisFail(err.message || "Failed to contact analysis server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in`}>
        
        {/* Left config form panel */}
        <div className={`lg:col-span-1 p-6 rounded-2xl ${
          theme === 'dark' ? 'glass-panel-dark' : 'glass-panel-light'
        } border ${theme === 'dark' ? 'border-cyan-500/10' : 'border-gray-200'} relative overflow-hidden`}>
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/[0.02] rounded-full blur-2xl" />
          
          <h3 className={`text-sm font-display font-bold uppercase tracking-widest mb-4 flex items-center gap-2 ${
            theme === 'dark' ? 'text-cyan-400' : 'text-cyan-700'
          }`}>
            <HelpCircle className="w-4 h-4" />
            Vessel Metadata
          </h3>

          <div className="space-y-4">
            <div>
              <label className={`block text-[10px] font-mono uppercase tracking-wider mb-1.5 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>Assignment Title</label>
              <input
                type="text"
                placeholder="e.g., Binary Tree Search HW"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`w-full px-3 py-2 bg-black/40 border text-sm rounded-xl transition-colors focus:outline-none focus:border-cyan-400 ${
                  theme === 'dark' 
                    ? 'border-white/5 text-white placeholder-gray-600' 
                    : 'border-gray-200 text-gray-900 placeholder-gray-400 bg-gray-50'
                }`}
                id="meta-input-title"
              />
            </div>

            <div>
              <label className={`block text-[10px] font-mono uppercase tracking-wider mb-1.5 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>Student Name / ID</label>
              <input
                type="text"
                placeholder="e.g., Alisher Qodirov"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className={`w-full px-3 py-2 bg-black/40 border text-sm rounded-xl transition-colors focus:outline-none focus:border-cyan-400 ${
                  theme === 'dark' 
                    ? 'border-white/5 text-white placeholder-gray-600' 
                    : 'border-gray-200 text-gray-900 placeholder-gray-400 bg-gray-50'
                }`}
                id="meta-input-student"
              />
            </div>

            <div>
              <label className={`block text-[10px] font-mono uppercase tracking-wider mb-1.5 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>Academic Course Registry</label>
              <select
                value={classId}
                onChange={(e) => setClassId(e.target.value)}
                className={`w-full px-3 py-2 border text-sm rounded-xl focus:outline-none focus:border-cyan-400 ${
                  theme === 'dark' 
                    ? 'border-white/5 bg-black/60 text-white' 
                    : 'border-gray-200 text-gray-900 bg-gray-50'
                }`}
                id="meta-select-course"
              >
                <option value="Intro to Computer Science CS101">Intro to Computer Science CS101</option>
                <option value="Advanced Web Apps Architecture CS404">Advanced Web Apps Architecture CS404</option>
                <option value="Intro to Python CS200">Intro to Python CS200</option>
                <option value="AI & Machine Learning CS520">AI & Machine Learning CS520</option>
                <option value="Text Analytics NLP">Text Analytics NLP</option>
              </select>
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-white/5">
            <h4 className={`text-xs font-mono mb-2 uppercase tracking-wide flex items-center gap-1.5 ${
              theme === 'dark' ? 'text-cyan-500' : 'text-cyan-700'
            }`}>
              Or Paste Code Elements
            </h4>
            <textarea
              placeholder="Paste raw homework snippet, Python code, or essay contents..."
              value={customFileText}
              onChange={(e) => setCustomFileText(e.target.value)}
              className={`w-full h-28 px-3 py-2 bg-black/40 border text-xs font-mono rounded-xl focus:outline-none focus:border-cyan-400 resize-none ${
                theme === 'dark' 
                  ? 'border-white/5 text-white placeholder-gray-700' 
                  : 'border-gray-200 text-gray-950 placeholder-gray-400 bg-gray-50'
              }`}
              id="raw-paste-box"
            />
            <button
              onClick={handlePasteAnalyze}
              disabled={!customFileText.trim()}
              className={`w-full mt-2 py-2 text-[11px] font-mono font-bold uppercase rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                customFileText.trim()
                  ? 'bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                  : 'bg-white/5 border border-white/5 text-gray-600'
              }`}
              id="raw-paste-commit"
            >
              <span>Commit Paste Buffer</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Upload Terminal & Directory */}
        <div className="lg:col-span-2 space-y-4 flex flex-col justify-between">
          
          {extractedFiles.length === 0 ? (
            <div 
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={onButtonClick}
              className={`flex-1 py-12 px-6 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                dragActive 
                  ? 'border-cyan-400 bg-cyan-500/10 shadow-lg shadow-cyan-500/10'
                  : (theme === 'dark' ? 'border-white/10 bg-black/40 hover:border-cyan-500/30 hover:bg-cyan-500/[0.02]' : 'border-gray-300 bg-gray-50 hover:border-cyan-500 hover:bg-cyan-50')
              }`}
              id="drag-and-drop-container"
            >
              <input 
                ref={fileInputRef}
                type="file"
                multiple
                accept=".zip,.js,.jsx,.ts,.tsx,.py,.java,.css,.html,.txt,.md,.pdf,.docx"
                onChange={handleFileInput}
                className="hidden"
                id="file-element-uploader"
              />
              
              <div className="relative mb-4 flex items-center justify-center w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 glow-cyan">
                <UploadCloud className="w-8 h-8 select-none" />
              </div>

              <h3 className={`text-base font-display font-bold uppercase tracking-wider mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {t.uploadTitle}
              </h3>
              
              <p className={`text-xs max-w-sm mb-4 leading-relaxed ${
                theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
              }`}>
                {t.uploadPlaceholder}
              </p>

              <div className={`text-[10px] font-mono uppercase bg-slate-900/40 border border-slate-500/10 px-3 py-1 text-slate-400 rounded-lg`}>
                {t.supportedFormats}
              </div>
            </div>
          ) : (
            <div className={`flex-1 p-5 rounded-2xl ${
              theme === 'dark' ? 'glass-panel-dark' : 'glass-panel-light'
            } border ${theme === 'dark' ? 'border-cyan-500/10' : 'border-gray-200'} flex flex-col justify-between`}>
              
              <div>
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <FolderArchive className="w-5 h-5 text-cyan-400" />
                    <div>
                      <h4 className={`text-xs font-mono font-extrabold uppercase tracking-widest ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>Extracted Submission Registry</h4>
                      <p className="text-[10px] text-gray-500 font-mono">Found {extractedFiles.length} item(s) to verify</p>
                    </div>
                  </div>
                  <button
                    onClick={clearAll}
                    className="p-1.5 text-xs font-mono text-red-400 hover:text-red-300 transition-colors flex items-center gap-1.5 bg-red-500/5 hover:bg-red-500/10 rounded-lg cursor-pointer"
                    id="btn-clear-payload"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span className="sm:inline hidden">Purge Payload</span>
                  </button>
                </div>

                <div className="max-h-56 overflow-y-auto space-y-1.5 pr-2">
                  {extractedFiles.map((f, idx) => (
                    <div 
                      key={idx}
                      className={`flex items-center justify-between px-3 py-2 rounded-xl transition-all text-xs font-mono ${
                        theme === 'dark' ? 'bg-black/60 hover:bg-cyan-500/5 border border-white/5' : 'bg-gray-50 hover:bg-cyan-50 border border-gray-100'
                      }`}
                    >
                      <div className="flex items-center gap-2 overflow-hidden">
                        <FileText className="w-4 h-4 text-cyan-500/70 block-shrink-0" />
                        <span className={`font-semibold truncate ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>{f.name}</span>
                        <span className="text-[10px] text-gray-500">{(f.size / 1024).toFixed(1)} KB</span>
                      </div>
                      <button 
                        onClick={() => removeFile(idx)}
                        className="p-1 text-gray-500 hover:text-red-400 transition-colors cursor-pointer"
                        title="Delete File"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Board */}
              <div className="mt-8 pt-4 border-t border-white/5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
                  <span className={`text-[10px] font-mono uppercase tracking-wider ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>Payload verification ready</span>
                </div>
                
                <button
                  onClick={triggerScan}
                  className="px-6 py-3 bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-display font-bold uppercase text-[11px] tracking-widest rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 glow-cyan cursor-pointer"
                  id="btn-run-scanning"
                >
                  <Play className="w-3.5 h-3.5 fill-black" />
                  <span>{t.buttonScan}</span>
                </button>
              </div>

            </div>
          )}

          {/* Connected Notice */}
          <div className={`p-4 rounded-xl border ${
            theme === 'dark' 
              ? 'bg-cyan-950/20 border-cyan-500/10' 
              : 'bg-cyan-50 border-cyan-200'
          } text-[11px] font-mono leading-relaxed flex items-start gap-2.5`}>
            <AlertTriangle className="w-4 h-4 text-cyan-500 flex-shrink-0 mt-0.5" />
            <div className={theme === 'dark' ? 'text-cyan-400/80' : 'text-cyan-800'}>
              {t.notConnectedNote}
            </div>
          </div>

        </div>

      </div>

      {/* Persistent Full screen scan loading overlays */}
      {loading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 bg-black/95 backdrop-blur-lg">
          <div className="text-center max-w-sm space-y-6">
            <div className="relative inline-flex items-center justify-center">
              {/* Spinning ring */}
              <div className="w-24 h-24 rounded-full border-4 border-cyan-500/10 border-t-cyan-400 animate-spin" />
              {/* Core beacon */}
              <Loader className="absolute w-8 h-8 text-cyan-400 animate-pulse" />
            </div>

            <div className="space-y-2">
              <h3 className="text-white font-display font-medium uppercase tracking-widest text-sm">
                Linguistic Radar Scanning
              </h3>
              <p className="text-xs font-mono text-cyan-500/80 uppercase tracking-wider leading-relaxed animate-pulse">
                {statusMessage}
              </p>
            </div>

            <div className="w-full bg-slate-900 border border-cyan-500/15 h-2.5 rounded-full overflow-hidden relative">
              <div className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-cyan-400 to-blue-500 animate-[pulse_1.5s_infinite] w-3/4 rounded-full" />
            </div>

            <p className="text-[10px] text-gray-500 font-mono uppercase">
              Calculating Style Entropy & AI Confidence scores...
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
