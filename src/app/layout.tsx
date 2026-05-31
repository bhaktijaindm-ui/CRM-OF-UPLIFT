import './globals.css'; // Standard tailwind setup
import { CRMProvider } from '../components/SharedStateContext';
import { AuthProvider } from '../context/AuthContext';
import AuthShield from '../components/AuthShield';
import AppLayoutShell from '../components/AppLayoutShell';
import Script from 'next/script';

export const metadata = {
  title: 'Uplift - Enterprise Hub',
  description: 'Automated CRM Workspace',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 antialiased font-sans">
        <Script 
          src="https://accounts.google.com/gsi/client" 
          strategy="beforeInteractive" 
        />
        <AuthProvider>
          <AuthShield>
            <CRMProvider>
              <AppLayoutShell>
                {children}
              </AppLayoutShell>
            </CRMProvider>
          </AuthShield>
        </AuthProvider>
      </body>
    </html>
  );
}
