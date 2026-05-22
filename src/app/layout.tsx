import './globals.css'; // Standard tailwind setup
import { CRMProvider } from '../components/SharedStateContext';
import Link from 'next/link';

export const metadata = {
  title: 'TalosOS - Enterprise Hub',
  description: 'Automated CRM Workspace',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 antialiased font-sans">
        <CRMProvider>
          <div className="flex min-h-screen overflow-hidden">
            {/* Left Nav Architecture */}
            <aside className="w-64 bg-slate-900 text-slate-200 flex flex-col border-r border-slate-800 shrink-0">
              <div className="p-6 border-b border-slate-800 flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-md shadow-blue-500/20">
                  T
                </div>
                <div>
                  <h1 className="font-bold tracking-tight text-white leading-none">TalosOS</h1>
                  <span className="text-[10px] text-slate-400 font-medium tracking-widest uppercase">Enterprise</span>
                </div>
              </div>
              
              <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
                <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium hover:bg-slate-800 hover:text-white transition-all group">
                  <span className="h-2 w-2 rounded-full bg-blue-500 group-hover:scale-125 transition-transform" />
                  Employee Matrix
                </Link>
                <Link href="/clients" className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium hover:bg-slate-800 hover:text-white transition-all group">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 group-hover:scale-125 transition-transform" />
                  Client Portfolio
                </Link>
                <Link href="/content" className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium hover:bg-slate-800 hover:text-white transition-all group">
                  <span className="h-2 w-2 rounded-full bg-sky-400 group-hover:scale-125 transition-transform" />
                  Content Pipeline
                </Link>
                <Link href="/calendar" className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium hover:bg-slate-800 hover:text-white transition-all group">
                  <span className="h-2 w-2 rounded-full bg-amber-500 group-hover:scale-125 transition-transform" />
                  Content Engine Calendar
                </Link>
                <Link href="/reports" className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium hover:bg-slate-800 hover:text-white transition-all group">
                  <span className="h-2 w-2 rounded-full bg-indigo-500 group-hover:scale-125 transition-transform" />
                  Operational Audits
                </Link>
              </nav>

              <div className="p-4 border-t border-slate-800 bg-slate-950/40 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center font-semibold text-xs text-white">BJ</div>
                <div className="overflow-hidden">
                  <p className="text-sm font-semibold text-white truncate">Bhakti Jain</p>
                  <p className="text-xs text-slate-400 truncate">SEO Director</p>
                </div>
              </div>
            </aside>

            {/* Main Application Container */}
            <main className="flex-1 flex flex-col min-w-0 bg-slate-50">
              <header className="h-16 border-b border-slate-200 bg-white px-8 flex items-center justify-between shadow-sm shrink-0">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-200">
                    System Active: 2026 Fleet
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-slate-600">
                  <span>Indore, MP</span>
                  <div className="h-4 w-px bg-slate-200" />
                  <span className="font-medium text-slate-900">May 2026</span>
                </div>
              </header>
              <div className="flex-1 overflow-y-auto p-8">
                {children}
              </div>
            </main>
          </div>
        </CRMProvider>
      </body>
    </html>
  );
}
