'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import CinematicIntro from './CinematicIntro';

export default function AuthShield({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [showIntro, setShowIntro] = useState(true);

  // Check if intro has already run in the current session
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const introPlayed = sessionStorage.getItem('crm_intro_played');
      if (introPlayed === 'true') {
        setShowIntro(false);
      }
    }
  }, []);

  const handleIntroComplete = () => {
    sessionStorage.setItem('crm_intro_played', 'true');
    setShowIntro(false);
  };

  useEffect(() => {
    // Only perform redirects if the cinematic intro is not active
    if (!showIntro && !loading) {
      if (!user && pathname !== '/login') {
        router.replace('/login');
      } else if (user && pathname === '/login') {
        router.replace('/');
      }
    }
  }, [user, loading, pathname, router, showIntro]);

  // If the cinematic intro is still active, play it
  if (showIntro) {
    return <CinematicIntro onComplete={handleIntroComplete} />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white font-sans">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-slate-800"></div>
            <div className="absolute inset-0 rounded-full border-4 border-t-blue-500 border-r-indigo-500 animate-spin"></div>
          </div>
          <p className="text-slate-400 text-xs font-bold tracking-widest uppercase animate-pulse">
            Establishing Secure Handshake...
          </p>
        </div>
      </div>
    );
  }

  if (!user && pathname !== '/login') {
    return null;
  }

  return <>{children}</>;
}

