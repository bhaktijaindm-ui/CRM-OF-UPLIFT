'use client';

import React, { useState } from 'react';
import { useCRM } from '../../components/SharedStateContext';

interface PixelTracker {
  id: string;
  name: string;
  pixelId: string;
  status: 'Active' | 'Warning' | 'Critical';
  lastEvent: string;
  connectionNotes: string;
  platform: 'Meta' | 'Google' | 'LinkedIn';
}

interface AdCampaign {
  id: string;
  name: string;
  platform: 'Meta Ads' | 'Google Ads' | 'LinkedIn Ads';
  clientId: string;
  cost: number;
  clicks: number;
  roas: number;
  status: 'Active' | 'Paused' | 'Error';
  dailyBudget: number;
  targetGeo: string;
}

interface DiagnosticIssue {
  id: string;
  title: string;
  description: string;
  severity: 'Critical' | 'Warning';
  source: string;
  targetId: string; // ID of the Pixel or Campaign causing it
  targetType: 'pixel' | 'campaign';
  canAutoFix: boolean;
}

interface AutomatedReport {
  id: string;
  name: string;
  frequency: 'Daily' | 'Weekly' | 'Monthly';
  format: 'PDF' | 'CSV';
  emails: string;
  campaigns: string[];
  metrics: string[];
  lastGenerated: string;
}

export default function CampaignsDashboard() {
  const { clients } = useCRM();

  // 1. Pixel Tracker States
  const [pixels, setPixels] = useState<PixelTracker[]>([
    { id: 'pix-1', name: 'Meta Pixel Tracker', pixelId: 'meta-10293847', status: 'Active', lastEvent: 'Purchase (2m ago)', connectionNotes: 'Connection stable. SSL Handshake verified.', platform: 'Meta' },
    { id: 'pix-2', name: 'Google Conversion Tag', pixelId: 'g-99238411', status: 'Warning', lastEvent: 'Page View (15m ago)', connectionNotes: 'Mismatched conversion label token on /thank-you.', platform: 'Google' },
    { id: 'pix-3', name: 'LinkedIn Insight Tag', pixelId: 'li-88220192', status: 'Critical', lastEvent: 'None recorded', connectionNotes: 'Tag missing from headers. Check script injection.', platform: 'LinkedIn' }
  ]);

  // 2. Ad Campaigns States
  const [campaigns, setCampaigns] = useState<AdCampaign[]>([
    { id: 'camp-1', name: 'E-Commerce Core Retargeting', platform: 'Meta Ads', clientId: 'cli-1', cost: 1450, clicks: 492, roas: 3.4, status: 'Active', dailyBudget: 150, targetGeo: 'India (Tier 1)' },
    { id: 'camp-2', name: 'Brand Search Intent Alpha', platform: 'Google Ads', clientId: 'cli-1', cost: 920, clicks: 215, roas: 1.8, status: 'Active', dailyBudget: 90, targetGeo: 'Global Tech Hubs' },
    { id: 'camp-3', name: 'B2B Enterprise Lead Gen v3', platform: 'LinkedIn Ads', clientId: 'cli-2', cost: 2800, clicks: 142, roas: 0.9, status: 'Error', dailyBudget: 250, targetGeo: 'US/EU Enterprise Decision Makers' }
  ]);

  // 3. Diagnostic Alert System
  const [diagnostics, setDiagnostics] = useState<DiagnosticIssue[]>([
    { id: 'diag-1', title: 'LinkedIn Tag Missing on Subpages', description: 'The LinkedIn Insight Tag script could not be detected in the head of your subdomain checkout sequences. Traffic is unmeasured.', severity: 'Critical', source: 'LinkedIn Insight Tag', targetId: 'pix-3', targetType: 'pixel', canAutoFix: true },
    { id: 'diag-2', title: 'Google Conversions Out of Range', description: 'Conversion tracking returns a discrepancy larger than 15% compared to actual checkout logs. Mismatched token key.', severity: 'Warning', source: 'Google Conversion Tag', targetId: 'pix-2', targetType: 'pixel', canAutoFix: true },
    { id: 'diag-3', title: 'Ad Campaign Underperforming ROAS', description: 'B2B Enterprise Lead Gen v3 has dropped to ROAS 0.9 (Target: 1.5). System paused bidding to save budget.', severity: 'Critical', source: 'LinkedIn Ads Campaign', targetId: 'camp-3', targetType: 'campaign', canAutoFix: false }
  ]);

  // 4. Automated Reports Ledger
  const [reports, setReports] = useState<AutomatedReport[]>([
    { id: 'rep-1', name: 'Weekly Client Acquisition Audit', frequency: 'Weekly', format: 'PDF', emails: 'ops@apex.io, bhaktijaindm@gmail.com', campaigns: ['E-Commerce Core Retargeting'], metrics: ['ROAS', 'Cost', 'Clicks'], lastGenerated: '2026-05-18 08:00 AM' },
    { id: 'rep-2', name: 'Monthly Financial Ads Statement', frequency: 'Monthly', format: 'CSV', emails: 'dr.priyanka@novahealth.in', campaigns: ['B2B Enterprise Lead Gen v3'], metrics: ['ROAS', 'Cost'], lastGenerated: '2026-05-01 09:00 AM' }
  ]);

  // Modals / Editing States
  const [editingCampaign, setEditingCampaign] = useState<AdCampaign | null>(null);
  const [editingPixel, setEditingPixel] = useState<PixelTracker | null>(null);
  
  // New Report Builder States
  const [newReportName, setNewReportName] = useState('');
  const [newReportFreq, setNewReportFreq] = useState<'Daily' | 'Weekly' | 'Monthly'>('Weekly');
  const [newReportFormat, setNewReportFormat] = useState<'PDF' | 'CSV'>('PDF');
  const [newReportEmails, setNewReportEmails] = useState('');
  const [newReportCamps, setNewReportCamps] = useState<string[]>([]);
  const [newReportMetrics, setNewReportMetrics] = useState<string[]>(['ROAS', 'Cost']);

  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Quick Diagnostic Fix Handler
  const handleQuickFix = (issueId: string) => {
    const issue = diagnostics.find(d => d.id === issueId);
    if (!issue) return;

    if (issue.targetType === 'pixel') {
      // Correct the pixel health status
      setPixels(prev => prev.map(p => p.id === issue.targetId ? { ...p, status: 'Active', connectionNotes: 'Connection re-established via auto-injected script patch.' } : p));
      showToast(`Automatically patched tracking script for ${issue.source}. Health restored!`, 'success');
    }

    // Remove the diagnostic item
    setDiagnostics(prev => prev.filter(d => d.id !== issueId));
  };

  // Save Campaign Edits
  const handleSaveCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCampaign) return;

    setCampaigns(prev => prev.map(c => c.id === editingCampaign.id ? editingCampaign : c));
    
    // Auto-resolve underperforming if ROAS is adjusted upwards or status reactivated
    if (editingCampaign.id === 'camp-3' && editingCampaign.status === 'Active') {
      setDiagnostics(prev => prev.filter(d => d.targetId !== 'camp-3'));
    }

    setEditingCampaign(null);
    showToast(`Campaign details updated for ${editingCampaign.name}`, 'success');
  };

  // Save Pixel Edits
  const handleSavePixel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPixel) return;

    setPixels(prev => prev.map(p => p.id === editingPixel.id ? editingPixel : p));
    
    // If the ID is modified, automatically validate and clear related warnings
    if (editingPixel.id === 'pix-2') {
      setDiagnostics(prev => prev.filter(d => d.targetId !== 'pix-2'));
      setPixels(prev => prev.map(p => p.id === 'pix-2' ? { ...p, status: 'Active', connectionNotes: 'Valid token registered. Verification complete.' } : p));
    } else if (editingPixel.id === 'pix-3') {
      setDiagnostics(prev => prev.filter(d => d.targetId !== 'pix-3'));
      setPixels(prev => prev.map(p => p.id === 'pix-3' ? { ...p, status: 'Active', connectionNotes: 'Header script verification successful.' } : p));
    }

    setEditingPixel(null);
    showToast(`Pixel configuration updated for ${editingPixel.name}`, 'success');
  };

  // Create Automated Report
  const handleCreateReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReportName || !newReportEmails) {
      showToast('Please fill out all report configurations', 'info');
      return;
    }

    const newReport: AutomatedReport = {
      id: `rep-${Date.now()}`,
      name: newReportName,
      frequency: newReportFreq,
      format: newReportFormat,
      emails: newReportEmails,
      campaigns: newReportCamps.length > 0 ? newReportCamps : ['All Campaigns'],
      metrics: newReportMetrics,
      lastGenerated: 'Pending first dispatch cycle'
    };

    setReports(prev => [...prev, newReport]);
    setNewReportName('');
    setNewReportEmails('');
    setNewReportCamps([]);
    showToast(`Automated report "${newReportName}" scheduled successfully!`, 'success');
  };

  // Trigger Immediate Report Run
  const handleRunReportNow = (reportName: string) => {
    showToast(`Compiling data and compiling report for ${reportName}...`, 'info');
    setTimeout(() => {
      // Simulate file download
      showToast(`Exported ${reportName}.csv successfully downloaded!`, 'success');
    }, 1500);
  };

  return (
    <div className="space-y-8 relative">
      {/* Toast Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-xl shadow-xl text-white font-semibold flex items-center gap-3 transition-all duration-300 animate-slide-in ${
          notification.type === 'success' ? 'bg-emerald-600 shadow-emerald-500/20' : 'bg-blue-600 shadow-blue-500/20'
        }`}>
          <span>{notification.type === 'success' ? '✓' : 'ℹ'}</span>
          <span>{notification.message}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-slate-900 to-slate-800 p-8 rounded-2xl shadow-xl border border-slate-700/50 text-white">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Marketing Operations Command</span>
          <h2 className="text-3xl font-extrabold tracking-tight mt-1 text-white">Ad Campaigns & Pixel Analytics</h2>
          <p className="text-sm text-slate-400 mt-1">Simulated real-time trackers for Meta Pixel, Google Conversion, and LinkedIn Insight Tags.</p>
        </div>
        <div className="bg-slate-800/80 backdrop-blur border border-slate-700/60 rounded-xl p-4 flex gap-6">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider">Campaign Cost</span>
            <span className="text-xl font-black text-white">$5,170</span>
          </div>
          <div className="w-px bg-slate-700" />
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider">Avg ROAS</span>
            <span className="text-xl font-black text-emerald-400">2.03x</span>
          </div>
          <div className="w-px bg-slate-700" />
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider">System Alerts</span>
            <span className={`text-xl font-black ${diagnostics.length > 0 ? 'text-rose-400 animate-pulse' : 'text-slate-400'}`}>
              {diagnostics.length} Active
            </span>
          </div>
        </div>
      </div>

      {/* Diagnostics / Action Alerts */}
      {diagnostics.length > 0 && (
        <div className="bg-gradient-to-br from-rose-50 to-red-50/60 border border-rose-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <span className="h-2 w-2 rounded-full bg-rose-600 animate-ping" />
            <h3 className="font-bold text-rose-900 text-sm tracking-wide uppercase">Operational Warnings Panel</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {diagnostics.map((diag) => (
              <div key={diag.id} className="bg-white border border-rose-100/80 rounded-xl p-4 flex justify-between items-start shadow-sm gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      diag.severity === 'Critical' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {diag.severity}
                    </span>
                    <span className="text-xs font-bold text-slate-400 font-mono">Source: {diag.source}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">{diag.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">{diag.description}</p>
                </div>
                {diag.canAutoFix && (
                  <button
                    onClick={() => handleQuickFix(diag.id)}
                    className="shrink-0 text-xs font-semibold px-3 py-1.5 bg-rose-600 text-white hover:bg-rose-700 rounded-lg transition shadow-sm shadow-rose-600/10"
                  >
                    Quick Fix
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2-Column Split: Pixels Tracker & Active Campaigns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Pixel Trackers Ledger */}
        <div className="lg:col-span-1 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wide">Tracking Tags & Pixels</h3>
            <span className="text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100 px-2.5 py-0.5 rounded-full">
              JS Snippets
            </span>
          </div>
          <div className="p-6 space-y-5 flex-1">
            {pixels.map((pix) => (
              <div key={pix.id} className="border border-slate-100 rounded-xl p-4 space-y-3 bg-slate-50/40 relative group hover:border-slate-300/80 transition-all">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{pix.name}</h4>
                    <span className="text-xs text-slate-400 font-mono">ID: {pix.pixelId}</span>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                    pix.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                    pix.status === 'Warning' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                    'bg-rose-50 text-rose-700 border border-rose-100'
                  }`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${
                      pix.status === 'Active' ? 'bg-emerald-600' :
                      pix.status === 'Warning' ? 'bg-amber-500' : 'bg-rose-600'
                    }`} />
                    {pix.status}
                  </span>
                </div>
                <div className="text-xs space-y-1">
                  <p className="text-slate-600"><strong className="text-slate-700">Last Catch:</strong> {pix.lastEvent}</p>
                  <p className="text-slate-500 italic text-[11px] leading-relaxed">{pix.connectionNotes}</p>
                </div>
                <div className="pt-2 border-t border-slate-100 flex justify-end">
                  <button 
                    onClick={() => setEditingPixel(pix)}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition"
                  >
                    Configure Tracker ID
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ad Campaigns List */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wide">Multi-Channel Ad Campaigns</h3>
            <span className="text-xs text-slate-400 font-medium">Auto-paused on failure rules active</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <th className="p-4 pl-6">Campaign Info</th>
                  <th className="p-4">Platform</th>
                  <th className="p-4">Client Link</th>
                  <th className="p-4">Budget / Geo</th>
                  <th className="p-4">Spend / ROAS</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {campaigns.map((camp) => {
                  const linkedClient = clients.find(c => c.id === camp.clientId);
                  return (
                    <tr key={camp.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="p-4 pl-6">
                        <div>
                          <div className="font-bold text-slate-900">{camp.name}</div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className={`h-1.5 w-1.5 rounded-full ${
                              camp.status === 'Active' ? 'bg-emerald-500' :
                              camp.status === 'Paused' ? 'bg-amber-500' : 'bg-red-500'
                            }`} />
                            <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">{camp.status}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${
                          camp.platform === 'Meta Ads' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                          camp.platform === 'Google Ads' ? 'bg-teal-50 text-teal-700 border border-teal-100' :
                          'bg-indigo-50 text-indigo-700 border border-indigo-100'
                        }`}>
                          {camp.platform}
                        </span>
                      </td>
                      <td className="p-4 text-xs font-medium text-slate-600">
                        {linkedClient ? linkedClient.companyName : 'External Direct'}
                      </td>
                      <td className="p-4 text-xs">
                        <div className="font-semibold text-slate-800">${camp.dailyBudget}/day</div>
                        <div className="text-slate-400 text-[11px]">{camp.targetGeo}</div>
                      </td>
                      <td className="p-4 text-xs">
                        <div className="text-slate-500">Spend: <strong className="text-slate-700">${camp.cost}</strong></div>
                        <div className="flex items-center gap-1 mt-0.5">
                          <span className="text-[10px] text-slate-400 font-bold uppercase">ROAS:</span>
                          <span className={`font-bold ${camp.roas >= 1.5 ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {camp.roas}x
                          </span>
                        </div>
                      </td>
                      <td className="p-4 pr-6 text-right">
                        <button
                          onClick={() => setEditingCampaign(camp)}
                          className="text-xs font-bold text-blue-600 hover:text-blue-800 transition"
                        >
                          Modify Settings
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Automated Report Builder Hub */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 bg-slate-50/50">
          <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wide">Automated Reporting Engine</h3>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
          
          {/* Creator Form */}
          <div className="lg:col-span-1 p-6 space-y-6">
            <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Configure Dispatch Rule</h4>
            <form onSubmit={handleCreateReport} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Report Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Meta ROI Weekly Sync"
                  value={newReportName}
                  onChange={(e) => setNewReportName(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Frequency</label>
                  <select
                    value={newReportFreq}
                    onChange={(e) => setNewReportFreq(e.target.value as any)}
                    className="w-full border border-slate-200 rounded-lg p-2.5 text-sm bg-white"
                  >
                    <option value="Daily">Daily</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Format</label>
                  <select
                    value={newReportFormat}
                    onChange={(e) => setNewReportFormat(e.target.value as any)}
                    className="w-full border border-slate-200 rounded-lg p-2.5 text-sm bg-white"
                  >
                    <option value="PDF">PDF Report</option>
                    <option value="CSV">CSV Raw Data</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Recipient Emails</label>
                <input
                  type="text"
                  required
                  placeholder="name@domain.com, lead@site.org"
                  value={newReportEmails}
                  onChange={(e) => setNewReportEmails(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Included Channels</label>
                <div className="grid grid-cols-3 gap-2 mt-1">
                  {['Meta Ads', 'Google Ads', 'LinkedIn Ads'].map((channel) => (
                    <label key={channel} className="flex items-center gap-1.5 text-xs text-slate-600 font-medium cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newReportCamps.includes(channel)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewReportCamps(prev => [...prev, channel]);
                          } else {
                            setNewReportCamps(prev => prev.filter(c => c !== channel));
                          }
                        }}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      {channel.split(' ')[0]}
                    </label>
                  ))}
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition shadow-md shadow-slate-950/10"
              >
                Schedule & Automate Report
              </button>
            </form>
          </div>

          {/* Active Schedules Ledger */}
          <div className="lg:col-span-2 p-6 flex flex-col">
            <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-4">Active Scheduling System</h4>
            <div className="flex-1 space-y-3">
              {reports.map((rep) => (
                <div key={rep.id} className="border border-slate-100 rounded-xl p-4 bg-slate-50/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-slate-200 transition">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-800">{rep.name}</span>
                      <span className="text-[10px] bg-slate-200/80 text-slate-700 px-2 py-0.5 rounded font-bold uppercase">
                        {rep.frequency}
                      </span>
                      <span className="text-[10px] bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded font-bold">
                        {rep.format}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-mono truncate max-w-md">Destinations: {rep.emails}</p>
                    <p className="text-[11px] text-slate-500"><strong className="text-slate-600">Sync Channels:</strong> {rep.campaigns.join(', ')}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2 self-stretch md:self-auto justify-end border-t border-slate-100 pt-3 md:border-t-0 md:pt-0">
                    <span className="text-[10px] text-slate-400 font-mono">Last Run: {rep.lastGenerated}</span>
                    <button
                      onClick={() => handleRunReportNow(rep.name)}
                      className="text-xs font-semibold px-3 py-1.5 border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 rounded-lg shadow-sm transition"
                    >
                      Export & Download Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* MODAL: Modify Ad Campaign Settings */}
      {editingCampaign && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden animate-zoom-in">
            <div className="bg-slate-900 text-white p-6 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg">Modify Campaign Parameters</h3>
                <p className="text-xs text-slate-400">Settings will dynamically sync throughout the reporting system.</p>
              </div>
              <button 
                onClick={() => setEditingCampaign(null)}
                className="text-slate-400 hover:text-white transition font-bold"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSaveCampaign} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Campaign Name</label>
                <input
                  type="text"
                  required
                  value={editingCampaign.name}
                  onChange={(e) => setEditingCampaign({ ...editingCampaign, name: e.target.value })}
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Daily Budget ($)</label>
                  <input
                    type="number"
                    required
                    value={editingCampaign.dailyBudget}
                    onChange={(e) => setEditingCampaign({ ...editingCampaign, dailyBudget: Number(e.target.value) })}
                    className="w-full border border-slate-200 rounded-lg p-2.5 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Target Geography</label>
                  <input
                    type="text"
                    required
                    value={editingCampaign.targetGeo}
                    onChange={(e) => setEditingCampaign({ ...editingCampaign, targetGeo: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg p-2.5 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">ROAS Target Value</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={editingCampaign.roas}
                    onChange={(e) => setEditingCampaign({ ...editingCampaign, roas: Number(e.target.value) })}
                    className="w-full border border-slate-200 rounded-lg p-2.5 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Campaign Status</label>
                  <select
                    value={editingCampaign.status}
                    onChange={(e) => setEditingCampaign({ ...editingCampaign, status: e.target.value as any })}
                    className="w-full border border-slate-200 rounded-lg p-2.5 text-sm bg-white"
                  >
                    <option value="Active">Active</option>
                    <option value="Paused">Paused</option>
                    <option value="Error">Error</option>
                  </select>
                </div>
              </div>
              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingCampaign(null)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 rounded-lg text-xs font-bold uppercase tracking-wider transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition shadow-md"
                >
                  Save Sync Details
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Configure Pixel Tracker */}
      {editingPixel && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden animate-zoom-in">
            <div className="bg-slate-900 text-white p-6 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg">Modify JS Tracking Tags</h3>
                <p className="text-xs text-slate-400">Specify unique validation tokens or platform script parameters.</p>
              </div>
              <button 
                onClick={() => setEditingPixel(null)}
                className="text-slate-400 hover:text-white transition font-bold"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSavePixel} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Tracker Integration Name</label>
                <input
                  type="text"
                  required
                  value={editingPixel.name}
                  disabled
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-sm bg-slate-100 text-slate-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Pixel/Container ID</label>
                <input
                  type="text"
                  required
                  value={editingPixel.pixelId}
                  onChange={(e) => setEditingPixel({ ...editingPixel, pixelId: e.target.value })}
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Health Override Status</label>
                <select
                  value={editingPixel.status}
                  onChange={(e) => setEditingPixel({ ...editingPixel, status: e.target.value as any })}
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-sm bg-white"
                >
                  <option value="Active">Active</option>
                  <option value="Warning">Warning</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingPixel(null)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 rounded-lg text-xs font-bold uppercase tracking-wider transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition shadow-md"
                >
                  Register Tracker ID
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
