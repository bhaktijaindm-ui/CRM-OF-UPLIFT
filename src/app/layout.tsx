import './globals.css'; // Standard tailwind setup
import { CRMProvider } from '../components/SharedStateContext';
import Sidebar from '../components/Sidebar';

export const metadata = {
  title: 'Uplift - Enterprise Hub',
  description: 'Automated CRM Workspace',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 antialiased font-sans">
        <CRMProvider>
          <div className="flex flex-col lg:flex-row min-h-screen overflow-hidden">
            {/* Left Nav Architecture */}
            <Sidebar />

            {/* Main Application Container */}
            <main className="flex-1 flex flex-col min-w-0 bg-slate-50 overflow-hidden">
              <header className="h-16 border-b border-slate-200 bg-white px-4 sm:px-8 flex items-center justify-between shadow-sm shrink-0">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-200">
                    System Active: 2026 Fleet
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs sm:text-sm text-slate-600">
                  <span className="hidden sm:inline">Indore, MP</span>
                  <div className="hidden sm:block h-4 w-px bg-slate-200" />
                  <span className="font-medium text-slate-900">May 2026</span>
                </div>
              </header>
              <div className="flex-1 overflow-y-auto p-4 sm:p-8">
                {children}
              </div>
            </main>
          </div>
        </CRMProvider>
      </body>
    </html>
  );
}
