'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function Sidebar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileOpen(prev => !prev);
  const closeMobileMenu = () => setIsMobileOpen(false);

  const navLinks = [
    { href: '/', label: 'Employee Matrix', colorClass: 'bg-blue-500' },
    { href: '/clients', label: 'Client Portfolio', colorClass: 'bg-emerald-500' },
    { href: '/content', label: 'Social Media Content', colorClass: 'bg-sky-400' },
    { href: '/calendar', label: 'Content Engine Calendar', colorClass: 'bg-amber-500' },
    { href: '/reports', label: 'Operational Audits', colorClass: 'bg-indigo-500' },
    { href: '/campaigns', label: 'Ad Campaigns & Pixels', colorClass: 'bg-rose-500' },
  ];

  return (
    <>
      {/* 1. Desktop Sidebar Navigation (Hidden on mobile/tablet) */}
      <aside className="hidden lg:flex w-64 bg-slate-900 text-slate-200 flex-col border-r border-slate-800 shrink-0">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-md shadow-blue-500/20">
            U
          </div>
          <div>
            <h1 className="font-bold tracking-tight text-white leading-none">Uplift</h1>
            <span className="text-[10px] text-slate-400 font-medium tracking-widest uppercase">Enterprise</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium hover:bg-slate-800 hover:text-white transition-all group"
            >
              <span className={`h-2 w-2 rounded-full ${link.colorClass} group-hover:scale-125 transition-transform`} />
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800 bg-slate-950/40 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center font-semibold text-xs text-white">BJ</div>
          <div className="overflow-hidden">
            <p className="text-sm font-semibold text-white truncate">Bhakti Jain</p>
            <p className="text-xs text-slate-400 truncate">SEO Director</p>
          </div>
        </div>
      </aside>

      {/* 2. Mobile Top Navigation Bar (Visible on mobile/tablet below 1024px) */}
      <header className="lg:hidden h-16 bg-slate-900 text-white px-6 flex items-center justify-between border-b border-slate-800 shrink-0 z-30">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-md shadow-blue-500/20">
            U
          </div>
          <div>
            <span className="font-bold tracking-tight text-white block text-sm leading-none">Uplift</span>
            <span className="text-[9px] text-slate-400 tracking-wider uppercase font-medium">Enterprise</span>
          </div>
        </div>
        <button
          onClick={toggleMobileMenu}
          className="p-2 -mr-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition focus:outline-none"
          aria-label="Toggle Navigation Menu"
        >
          <span className="text-2xl">☰</span>
        </button>
      </header>

      {/* 3. Slide-over Mobile Navigation Drawer (Visible when isMobileOpen is true) */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Backdrop Overlay */}
          <div 
            onClick={closeMobileMenu}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity" 
          />

          {/* Drawer Panel */}
          <div className="relative flex flex-col w-full max-w-xs bg-slate-900 text-slate-200 h-full shadow-2xl border-r border-slate-800 animate-slide-in-left">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-md">
                  U
                </div>
                <div>
                  <h1 className="font-bold tracking-tight text-white leading-none">Uplift</h1>
                  <span className="text-[10px] text-slate-400 font-medium tracking-widest uppercase">Enterprise</span>
                </div>
              </div>
              <button
                onClick={closeMobileMenu}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                ✕
              </button>
            </div>

            <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium hover:bg-slate-800 hover:text-white transition-all group"
                >
                  <span className={`h-2 w-2 rounded-full ${link.colorClass}`} />
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="p-4 border-t border-slate-800 bg-slate-950/40 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center font-semibold text-xs text-white">BJ</div>
              <div className="overflow-hidden">
                <p className="text-sm font-semibold text-white truncate">Bhakti Jain</p>
                <p className="text-xs text-slate-400 truncate">SEO Director</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
