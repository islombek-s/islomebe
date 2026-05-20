import { useState } from 'react';
import { translations, Language } from './LanguageDict';
import { UserSession } from '../types';
import { Shield, Key, Mail, User, X, Loader2 } from 'lucide-react';

interface AuthModalProps {
  lang: Language;
  onSuccess: (session: UserSession) => void;
  onClose: () => void;
}

export default function AuthModal({ lang, onSuccess, onClose }: AuthModalProps) {
  const t = translations[lang];
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'teacher' | 'student'>('student');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';
      const body = isRegister 
        ? { username, email, password, role } 
        : { email, password };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      // Store in LocalStorage
      localStorage.setItem('detector-token', `simulated-jwt-${data.user.id}`);
      localStorage.setItem('detector-user', JSON.stringify(data.user));

      onSuccess(data.user);
      onClose();
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md p-6 overflow-hidden rounded-2xl glass-panel-dark glow-cyan animate-fade-in border border-cyan-500/20">
        {/* Glow corner */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          id="btn-close-auth-modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-6">
          <Shield className="w-6 h-6 text-cyan-400" />
          <h2 className="text-xl font-display font-bold text-white tracking-wide uppercase">
            {t.loginRegister}
          </h2>
        </div>

        {error && (
          <div className="p-3 mb-4 text-xs font-mono text-red-400 bg-red-950/40 border border-red-500/20 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-xs font-mono text-gray-400 uppercase mb-1.5">{t.username}</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-cyan-500/60">
                  <User className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g., professor_smith"
                  className="w-full pl-10 pr-4 py-2.5 bg-black/50 border border-cyan-500/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition-colors font-mono"
                  id="auth-input-username"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-mono text-gray-400 uppercase mb-1.5">{t.email}</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-cyan-500/60">
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="operator@academy.edu"
                className="w-full pl-10 pr-4 py-2.5 bg-black/50 border border-cyan-500/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition-colors font-mono"
                id="auth-input-email"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-gray-400 uppercase mb-1.5">{t.password}</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-cyan-500/60">
                <Key className="w-4 h-4" />
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-black/50 border border-cyan-500/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition-colors font-mono"
                id="auth-input-password"
              />
            </div>
          </div>

          {isRegister && (
            <div>
              <label className="block text-xs font-mono text-gray-400 uppercase mb-2">{t.roleTeacher} / {t.roleStudent}</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('student')}
                  className={`py-2 px-3 text-xs font-mono rounded-xl border transition-all uppercase ${
                    role === 'student'
                      ? 'border-cyan-400 bg-cyan-500/10 text-cyan-300'
                      : 'border-white/5 bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
                  id="auth-role-student"
                >
                  {t.roleStudent}
                </button>
                <button
                  type="button"
                  onClick={() => setRole('teacher')}
                  className={`py-2 px-3 text-xs font-mono rounded-xl border transition-all uppercase ${
                    role === 'teacher'
                      ? 'border-cyan-400 bg-cyan-500/10 text-cyan-300'
                      : 'border-white/5 bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
                  id="auth-role-teacher"
                >
                  {t.roleTeacher}
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-display font-semibold transition-all shadow-lg shadow-cyan-500/25 active:transform active:scale-[0.98] uppercase tracking-wider text-xs flex items-center justify-center gap-2 cursor-pointer"
            id="auth-btn-submit"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <span>{t.formSubmit}</span>
            )}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-white/5 text-center">
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="text-xs text-cyan-400 hover:underline font-mono"
            id="auth-btn-toggle-view"
          >
            {isRegister ? "Already registered? Connection Port here" : "Initialize new security identification node"}
          </button>
        </div>
      </div>
    </div>
  );
}
