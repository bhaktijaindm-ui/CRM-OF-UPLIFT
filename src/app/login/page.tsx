'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const { loginWithGoogle, loginWithCredentials, loginSimulated } = useAuth();
  const router = useRouter();

  // Credentials form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Status states
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [googleClientAvailable, setGoogleClientAvailable] = useState(false);
  const [showSimulatedModal, setShowSimulatedModal] = useState(false);

  // Simulated Google inputs
  const [simEmail, setSimEmail] = useState('upliftxdigi@gmail.com');
  const [simName, setSimName] = useState('Uplift Digital');

  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  useEffect(() => {
    if (clientId) {
      setGoogleClientAvailable(true);
    }
  }, [clientId]);

  // Handle standard credentials login
  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setIsPending(true);
    setError(null);
    try {
      const res = await loginWithCredentials(email, password);
      if (res.success) {
        router.push('/');
      } else {
        setError(res.error || 'Incorrect email or password.');
      }
    } catch (err) {
      setError('An connection error occurred. Please try again.');
    } finally {
      setIsPending(false);
    }
  };

  // Handle Google Auth Response
  const handleGoogleCredentialResponse = async (response: any) => {
    setIsPending(true);
    setError(null);
    try {
      const res = await loginWithGoogle(response.credential);
      if (res.success) {
        router.push('/');
      } else {
        setError(res.error || 'Google login was rejected.');
      }
    } catch (err) {
      setError('An error occurred during Google Sign-in.');
    } finally {
      setIsPending(false);
    }
  };

  // Render Google GIS button
  useEffect(() => {
    if (!googleClientAvailable) return;

    const initGoogleGsi = () => {
      if (typeof window !== 'undefined' && (window as any).google) {
        try {
          (window as any).google.accounts.id.initialize({
            client_id: clientId,
            callback: handleGoogleCredentialResponse,
            auto_select: false,
          });
          (window as any).google.accounts.id.renderButton(
            document.getElementById('google-signin-btn-inner'),
            {
              theme: 'filled_black',
              size: 'large',
              shape: 'pill',
              width: 320,
            }
          );
        } catch (err) {
          console.error('Failed to initialize Google Sign-in:', err);
        }
      }
    };

    initGoogleGsi();

    const interval = setInterval(() => {
      if ((window as any).google) {
        initGoogleGsi();
        clearInterval(interval);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [googleClientAvailable]);

  // Handle Simulated Google login
  const handleSimulatedGoogleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    setError(null);
    setShowSimulatedModal(false);
    try {
      const res = await loginSimulated(simEmail, simName);
      if (res.success) {
        router.push('/');
      } else {
        setError(res.error || 'Simulated Google login rejected.');
      }
    } catch (err) {
      setError('An error occurred during simulation.');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans flex flex-col justify-center items-center relative overflow-hidden p-4">
      {/* Background ambient radial glows */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-blue-500/5 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] rounded-full bg-indigo-500/5 blur-[130px] pointer-events-none" />

      {/* Main glassmorphic login card - App-like aspect ratio and size */}
      <div className="w-full max-w-[420px] bg-slate-900/40 backdrop-blur-2xl border border-white/5 rounded-3xl p-8 shadow-2xl relative z-10 space-y-6 animate-fade-in">
        
        {/* Branding Area */}
        <div className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center font-black text-2xl text-white shadow-xl shadow-blue-500/20">
            U
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">Welcome Back</h1>
            <p className="text-[11px] text-slate-400 font-medium tracking-wide uppercase mt-0.5">
              Uplift Operations Platform
            </p>
          </div>
        </div>

        {/* Error notification banner */}
        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-3 text-rose-400 text-xs font-semibold leading-relaxed flex items-start gap-2.5 animate-slide-in">
            <span className="text-sm">⚠️</span>
            <div>{error}</div>
          </div>
        )}

        {/* Standard Credentials Sign In Form */}
        <form onSubmit={handleCredentialsSubmit} className="space-y-4">
          <div className="space-y-3.5">
            
            {/* Email Input */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500 text-sm">
                  ✉
                </span>
                <input
                  type="email"
                  required
                  placeholder="name@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950/60 border border-white/5 hover:border-white/10 focus:border-blue-500/50 rounded-2xl py-3 pl-10 pr-4 text-xs font-medium focus:outline-none transition placeholder-slate-600 text-slate-100"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center pl-1 pr-1">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Password
                </label>
                <a href="#" onClick={(e) => { e.preventDefault(); alert("Please contact your administrator to reset passwords."); }} className="text-[10px] text-blue-500 hover:underline font-bold">
                  Forgot?
                </a>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500 text-sm">
                  🔒
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950/60 border border-white/5 hover:border-white/10 focus:border-blue-500/50 rounded-2xl py-3 pl-10 pr-10 text-xs font-medium focus:outline-none transition placeholder-slate-600 text-slate-100"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200 text-xs font-semibold focus:outline-none"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-bold uppercase tracking-wider transition shadow-lg shadow-blue-500/10 flex items-center justify-center gap-2 disabled:opacity-50 active:scale-98"
          >
            {isPending ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Separator / Break */}
        <div className="flex items-center gap-3 py-1">
          <div className="h-px bg-white/5 flex-1" />
          <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
            or continue with
          </span>
          <div className="h-px bg-white/5 flex-1" />
        </div>

        {/* Google OAuth Login Button */}
        <div className="flex justify-center">
          {googleClientAvailable ? (
            <div id="google-signin-btn-inner" className="w-full flex justify-center py-1" />
          ) : (
            /* Fallback Google simulation trigger */
            <button
              type="button"
              onClick={() => setShowSimulatedModal(true)}
              className="w-full py-3 px-4 bg-slate-950 border border-white/5 hover:border-white/10 hover:bg-slate-900 text-slate-200 rounded-2xl text-xs font-bold transition flex items-center justify-center gap-2 active:scale-98 shadow-md"
            >
              <svg className="w-4 h-4 mr-1.5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.69c-.29 1.5-.114 2.78-.97 3.69l3.07 2.38c1.8-1.66 2.84-4.11 2.84-7.92z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.97-1.08 7.96-2.91l-3.07-2.38c-.9.6-2.04.96-3.32.96-3.21 0-5.93-2.17-6.9-5.1H3.5v2.4C5.48 20.89 8.5 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.1 14.57c-.25-.75-.39-1.56-.39-2.4 0-.84.14-1.65.39-2.4V7.37H3.5C2.69 9 2.25 10.82 2.25 12.72c0 1.9.44 3.72 1.25 5.35l1.6-1.5c0 0 0 0 0 0z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.43-3.43C17.96 1.19 15.24 0 12 0 8.5 0 5.48 3.11 3.5 7.37l1.6 1.5c.97-2.93 3.69-5.12 6.9-5.12z"
                />
              </svg>
              Sign In with Google
            </button>
          )}
        </div>

        {/* Info hints / Help section */}
        <div className="text-center pt-3 border-t border-white/5 space-y-1.5">
          <p className="text-[10px] text-slate-500 font-medium">
            Authorized administrative access credentials required.
          </p>
          <div className="bg-slate-950/40 rounded-xl p-2.5 border border-white/5 text-[9px] text-slate-500 leading-relaxed text-left flex flex-col gap-0.5">
            <span className="font-bold text-slate-400 block">💡 Quick Login Hints:</span>
            <span>- Admins: `upliftxdigi@gmail.com` / `admin123`</span>
            <span>- Demo Admin: `sarah@example.com` / `admin123`</span>
          </div>
        </div>

      </div>

      {/* Simulated Google Sign-In Modal */}
      {showSimulatedModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 w-full max-w-[360px] space-y-5 shadow-2xl animate-zoom-in">
            <div className="flex justify-between items-center pb-2 border-b border-white/5">
              <div className="flex items-center gap-2">
                <span className="text-sm">⚙️</span>
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-200">Google Auth Simulator</h3>
              </div>
              <button
                onClick={() => setShowSimulatedModal(false)}
                className="text-slate-400 hover:text-white transition font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSimulatedGoogleSubmit} className="space-y-4">
              <div className="space-y-3">
                <div>
                  <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Select Gmail Account
                  </label>
                  <select
                    value={simEmail}
                    onChange={(e) => {
                      setSimEmail(e.target.value);
                      if (e.target.value === 'upliftxdigi@gmail.com') {
                        setSimName('Uplift Digital');
                      } else if (e.target.value === 'sehajmutreja@gmail.com') {
                        setSimName('Sehaj Mutreja');
                      } else {
                        setSimName('Guest Account');
                      }
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    <option value="upliftxdigi@gmail.com">upliftxdigi@gmail.com (ADMIN)</option>
                    <option value="sehajmutreja@gmail.com">sehajmutreja@gmail.com (ADMIN)</option>
                    <option value="stranger@gmail.com">stranger@gmail.com (REJECTED)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Account Name
                  </label>
                  <input
                    type="text"
                    required
                    value={simName}
                    onChange={(e) => setSimName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-lg shadow-blue-500/10 flex items-center justify-center"
              >
                Confirm Account Select
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
