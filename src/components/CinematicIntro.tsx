'use client';

import React, { useEffect, useState, useRef } from 'react';

export default function CinematicIntro({ onComplete }: { onComplete: () => void }) {
  const [isFading, setIsFading] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handleSkip = () => {
    setIsFading(true);
    setTimeout(() => {
      onComplete();
    }, 800); // 800ms fade transition
  };

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.play().catch((error) => {
        console.log('Autoplay with audio blocked, falling back to muted...', error);
        video.muted = true;
        video.play().catch((err) => console.error('Video play failed:', err));
      });
    }
  }, []);

  return (
    <div
      className={`fixed inset-0 bg-black z-[9999] flex items-center justify-center transition-opacity duration-700 ease-out select-none ${
        isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <video
        ref={videoRef}
        src="/intro.mp4"
        className="max-w-full max-h-full object-contain"
        playsInline
        onEnded={handleSkip}
      />

      {/* Premium Glassmorphic Skip Button */}
      <button
        onClick={handleSkip}
        className="absolute top-8 right-8 z-[10000] px-5 py-2.5 rounded-full border border-white/20 bg-black/40 hover:bg-white/10 backdrop-blur-md text-white text-xs font-bold uppercase tracking-widest transition-all duration-300 hover:scale-105 hover:border-white/40 shadow-lg active:scale-95"
      >
        Skip Intro
      </button>
    </div>
  );
}
