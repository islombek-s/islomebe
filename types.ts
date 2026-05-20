export interface ExtractedFile {
  name: string;
  content: string;
  size: number;
}

export type ScanStatus = 'idle' | 'scanning' | 'completed' | 'failed';

export interface ScanMetrics {
  repeatedPatterns: number; // 0-100
  commentPatterns: number; // 0-100
  namingConventions: number; // 0-100
  styleConsistency: number; // 0-100
  complexityScore: number; // 0-100
}

export interface SuspiciousLine {
  lineNumber: number;
  snippet: string;
  score: number; // 0-100
  reason: string;
}

export interface StyleComparison {
  feature: string;
  observedPattern: string;
  aiTypicalPattern: string;
  verdict: 'Typical AI' | 'Suspicious' | 'Likely Human';
}

export interface AnalysisReport {
  id: string;
  title: string;
  studentName: string;
  studentId: string;
  classId: string;
  fileName: string;
  fileSize: number;
  timestamp: string;
  aiScore: number; // 0-100 probability
  humanScore: number; // 100 - aiScore or calculated confidence
  confidenceLevel: 'High' | 'Medium' | 'Low';
  overallExplanation: string;
  language: string;
  metrics: ScanMetrics;
  suspiciousLines: SuspiciousLine[];
  comparisons: StyleComparison[];
  recommendations: string[];
}

export interface Submission {
  id: string;
  title: string;
  studentName: string;
  studentId: string;
  classId: string;
  fileName: string;
  timestamp: string;
  aiScore: number;
  status: 'passed' | 'warning' | 'flagged'; // based on thresholds (e.g., > 70% flagged, >35% warning, else passed)
}

export interface TeacherPreferences {
  flagThreshold: number; // e.g. 70
  warningThreshold: number; // e.g. 35
  autoReport: boolean;
  activeLanguage: 'en' | 'uz';
}

export interface UserSession {
  role: 'teacher' | 'student';
  username: string;
  email: string;
  id: string;
}
