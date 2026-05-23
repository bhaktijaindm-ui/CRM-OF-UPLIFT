'use client';

import React, { useState } from 'react';
import { useCRM } from '../../components/SharedStateContext';

interface ContentItemExtended {
  id: string;
  clientName: string;
  format: 'Carousel Post' | 'Reel' | 'Video' | 'Other';
  details: string;
  caption: string;
  postDate: string; // YYYY-MM-DD
  referenceUrl: string;
  status: 'Not Started' | 'In Progress' | 'Pending Approval' | 'Scheduled' | 'Posted' | 'Completed';
  dynamicValues: Record<string, string>; // Stores custom column values
}

export default function ContentPipelineTable() {
  const { clients } = useCRM();

  // 1. Role Selector State
  const [currentUserEmail, setCurrentUserEmail] = useState<string>('bhaktijaindm@gmail.com');
  const isAdmin = currentUserEmail === 'bhaktijaindm@gmail.com';

  // 2. Local State for Content Items (supports direct cell editing and new rows)
  const [contentList, setContentList] = useState<ContentItemExtended[]>([
    {
      id: 'item-1',
      clientName: 'Apex Analytics Corp',
      format: 'Video',
      details: 'Q2 Performance Breakdown Video',
      caption: 'Scaling SEO architectures in 2026. Here is the blueprint.',
      postDate: '2026-05-25',
      referenceUrl: 'https://vimeo.com/ref/992',
      status: 'In Progress',
      dynamicValues: {}
    },
    {
      id: 'item-2',
      clientName: 'Nova Health Tech',
      format: 'Carousel Post',
      details: 'SaaS UX High-Contrast System Graphics',
      caption: 'Why dark layouts retain 40% more engineering focus.',
      postDate: '2026-05-26',
      referenceUrl: 'https://behance.net/ref/801',
      status: 'Pending Approval',
      dynamicValues: {}
    },
    {
      id: 'item-3',
      clientName: 'Apex Analytics Corp',
      format: 'Other',
      details: 'AI Optimization Trends Deck',
      caption: 'Moving beyond legacy anchors into contextual answer generation.',
      postDate: '2026-05-28',
      referenceUrl: 'https://figma.com/ref/404',
      status: 'Scheduled',
      dynamicValues: {}
    }
  ]);

  // 3. Dynamic Custom Columns State
  const [customColumns, setCustomColumns] = useState<string[]>([]);
  const [newColName, setNewColName] = useState('');

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Helper to generate initials from client name
  const getClientInitials = (name: string): string => {
    if (!name) return 'GEN';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 3);
  };

  // Auto Task Code Generator: TSK-YYYYMMDD-[CLIENT-INITIALS]-[INDEX]
  const generateTaskCode = (item: ContentItemExtended, index: number): string => {
    const datePart = item.postDate ? item.postDate.replace(/-/g, '') : '20260523';
    const clientPart = getClientInitials(item.clientName);
    return `TSK-${datePart}-${clientPart}-${index + 1}`;
  };

  // Add Dynamic Column Handler (Admin Only)
  const handleAddColumn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) {
      triggerToast('Permission Denied: Only administrators can add columns.');
      return;
    }
    if (!newColName.trim()) return;

    const col = newColName.trim();
    if (customColumns.includes(col)) {
      triggerToast(`Column "${col}" already exists.`);
      return;
    }

    setCustomColumns(prev => [...prev, col]);
    setNewColName('');
    triggerToast(`Custom column "${col}" added successfully!`);
  };

  // Add Blank Content Row Handler (Admin Only)
  const handleAddRow = () => {
    if (!isAdmin) {
      triggerToast('Permission Denied: Only administrators can create new rows.');
      return;
    }

    const defaultClient = clients.length > 0 ? clients[0].companyName : 'Apex Analytics Corp';
    const newRow: ContentItemExtended = {
      id: `item-${Date.now()}`,
      clientName: defaultClient,
      format: 'Other',
      details: 'Enter content brief details...',
      caption: 'Enter caption text...',
      postDate: '2026-05-24',
      referenceUrl: 'https://',
      status: 'Not Started',
      dynamicValues: {}
    };

    setContentList(prev => [...prev, newRow]);
    triggerToast('Blank content row created.');
  };

  // Delete Row Handler (Admin Only)
  const handleDeleteRow = (id: string) => {
    if (!isAdmin) {
      triggerToast('Permission Denied: Only administrators can delete records.');
      return;
    }

    setContentList(prev => prev.filter(item => item.id !== id));
    triggerToast('Content row deleted.');
  };

  // Update cell field directly in local state
  const handleUpdateCell = (id: string, field: keyof ContentItemExtended, value: any) => {
    setContentList(prev =>
      prev.map(item => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  // Update dynamic custom column value directly
  const handleUpdateCustomVal = (id: string, colName: string, value: string) => {
    setContentList(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, dynamicValues: { ...item.dynamicValues, [colName]: value } }
          : item
      )
    );
  };

  return (
    <div className="space-y-8 relative">
      {/* Toast Notification banner */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 px-6 py-4 rounded-xl shadow-xl bg-slate-900 border border-slate-700 text-white font-semibold flex items-center gap-2 animate-slide-in">
          <span>✓</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Security Switcher header */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-lg border border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold text-lg">
            🔑
          </div>
          <div>
            <h2 className="text-base font-bold tracking-tight">Content Pipeline Access Console</h2>
            <p className="text-xs text-slate-400">All users can edit cells. Only Administrators can add rows or columns.</p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-slate-800 border border-slate-700 rounded-xl p-2.5">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1.5">Browsing Role:</span>
          <select
            value={currentUserEmail}
            onChange={(e) => setCurrentUserEmail(e.target.value)}
            className="bg-slate-950 text-white border border-slate-700 rounded-lg py-1 px-3 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
          >
            <option value="bhaktijaindm@gmail.com">bhaktijaindm@gmail.com (ADMIN - Full Access)</option>
            <option value="guest@firm.com">guest@firm.com (Staff - Edit Cells Only)</option>
          </select>
        </div>
      </div>

      {/* Header Info */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Direct Content Pipeline</h2>
          <p className="text-sm text-slate-500">Edit table values directly. Double-click or select options to modify campaign assets.</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Add Row Button (Disabled/Active based on Admin role) */}
          <button
            onClick={handleAddRow}
            disabled={!isAdmin}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-md ${
              isAdmin
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/10 cursor-pointer'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300/40 shadow-none'
            }`}
          >
            {isAdmin ? '+ Add Content Row' : '🔒 Add Row (Admin Only)'}
          </button>
        </div>
      </div>

      {/* Column Builder (Active/Disabled based on Admin role) */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-sm">
        <form onSubmit={handleAddColumn} className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="space-y-0.5 text-center sm:text-left">
            <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Pipeline Column Builder</h4>
            <p className="text-xs text-slate-400">
              {isAdmin 
                ? 'Append custom criteria columns to track extra details on the fly.'
                : '🔒 Column adding is locked for Staff roles.'}
            </p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <input
              type="text"
              required
              disabled={!isAdmin}
              placeholder="e.g. Graphic Designer, Platform Link"
              value={newColName}
              onChange={(e) => setNewColName(e.target.value)}
              className={`flex-1 sm:w-60 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                !isAdmin ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-white'
              }`}
            />
            <button
              type="submit"
              disabled={!isAdmin}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition ${
                isAdmin
                  ? 'bg-slate-900 hover:bg-slate-800 text-white'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              Add Column
            </button>
          </div>
        </form>
      </div>

      {/* Database Sheet Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse table-fixed min-w-[1200px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <th className="p-3 pl-6 w-[160px]">Task Code</th>
                <th className="p-3 w-[180px]">Client Name</th>
                <th className="p-3 w-[150px]">Hosting / Format</th>
                <th className="p-3 w-[220px]">Content details</th>
                <th className="p-3 w-[220px]">Caption</th>
                <th className="p-3 w-[140px]">Post Date</th>
                <th className="p-3 w-[180px]">Reference Link</th>
                <th className="p-3 w-[160px]">Pipeline Status</th>
                {/* Custom Columns Headers */}
                {customColumns.map((col) => (
                  <th key={col} className="p-3 w-[160px] bg-blue-50/50 text-blue-800 font-bold border-l border-blue-100">
                    {col}
                  </th>
                ))}
                {isAdmin && <th className="p-3 pr-6 text-right w-[80px]">Delete</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {contentList.map((item, idx) => {
                const autoCode = generateTaskCode(item, idx);
                return (
                  <tr key={item.id} className="hover:bg-slate-50/40 transition-colors">
                    
                    {/* Cell 1: Auto generated Task Code */}
                    <td className="p-3 pl-6">
                      <span className="inline-block px-2.5 py-1 bg-slate-100 text-slate-700 font-mono text-[11px] font-bold rounded-lg border border-slate-200/60 shadow-sm">
                        {autoCode}
                      </span>
                    </td>

                    {/* Cell 2: Client Name select */}
                    <td className="p-2">
                      <select
                        value={item.clientName}
                        onChange={(e) => handleUpdateCell(item.id, 'clientName', e.target.value)}
                        className="w-full bg-white border border-slate-200 hover:border-slate-300 rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                      >
                        {clients.map(c => (
                          <option key={c.id} value={c.companyName}>
                            {c.companyName}
                          </option>
                        ))}
                        {/* Fallback support in case custom clients exist */}
                        {!clients.some(c => c.companyName === item.clientName) && (
                          <option value={item.clientName}>{item.clientName}</option>
                        )}
                      </select>
                    </td>

                    {/* Cell 3: Hosting / Format select */}
                    <td className="p-2">
                      <select
                        value={item.format}
                        onChange={(e) => handleUpdateCell(item.id, 'format', e.target.value)}
                        className="w-full bg-white border border-slate-200 hover:border-slate-300 rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer font-medium"
                      >
                        <option value="Carousel Post">Carousel Post</option>
                        <option value="Reel">Reel</option>
                        <option value="Video">Video</option>
                        <option value="Other">Other Type</option>
                      </select>
                    </td>

                    {/* Cell 4: Content details text */}
                    <td className="p-2">
                      <input
                        type="text"
                        value={item.details}
                        onChange={(e) => handleUpdateCell(item.id, 'details', e.target.value)}
                        className="w-full border border-slate-200 focus:border-blue-400 rounded px-2.5 py-1.5 text-xs focus:outline-none bg-slate-50/20 focus:bg-white"
                      />
                    </td>

                    {/* Cell 5: Caption text */}
                    <td className="p-2">
                      <input
                        type="text"
                        value={item.caption}
                        onChange={(e) => handleUpdateCell(item.id, 'caption', e.target.value)}
                        className="w-full border border-slate-200 focus:border-blue-400 rounded px-2.5 py-1.5 text-xs focus:outline-none bg-slate-50/20 focus:bg-white"
                      />
                    </td>

                    {/* Cell 6: Post Date selector */}
                    <td className="p-2">
                      <input
                        type="date"
                        value={item.postDate}
                        onChange={(e) => handleUpdateCell(item.id, 'postDate', e.target.value)}
                        className="w-full border border-slate-200 focus:border-blue-400 rounded px-2 py-1.5 text-xs focus:outline-none bg-white cursor-pointer font-mono"
                      />
                    </td>

                    {/* Cell 7: Reference URL */}
                    <td className="p-2">
                      <input
                        type="text"
                        value={item.referenceUrl}
                        onChange={(e) => handleUpdateCell(item.id, 'referenceUrl', e.target.value)}
                        className="w-full border border-slate-200 focus:border-blue-400 rounded px-2.5 py-1.5 text-xs focus:outline-none bg-slate-50/20 focus:bg-white font-mono"
                      />
                    </td>

                    {/* Cell 8: Status dropdown */}
                    <td className="p-2">
                      <select
                        value={item.status}
                        onChange={(e) => handleUpdateCell(item.id, 'status', e.target.value)}
                        className={`w-full border hover:border-slate-300 rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer font-bold ${
                          item.status === 'Posted' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                          item.status === 'Scheduled' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                          item.status === 'Pending Approval' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                          item.status === 'In Progress' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                          item.status === 'Completed' ? 'bg-teal-50 text-teal-700 border-teal-200' :
                          'bg-slate-50 text-slate-600 border-slate-200'
                        }`}
                      >
                        <option value="Not Started">Not Started</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Pending Approval">Pending Approval</option>
                        <option value="Scheduled">Scheduled</option>
                        <option value="Posted">Posted</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </td>

                    {/* Dynamic Custom Column inputs */}
                    {customColumns.map((col) => (
                      <td key={col} className="p-2 border-l border-blue-100 bg-blue-50/10">
                        <input
                          type="text"
                          placeholder="Notes..."
                          value={item.dynamicValues[col] || ''}
                          onChange={(e) => handleUpdateCustomVal(item.id, col, e.target.value)}
                          className="w-full border border-slate-200 focus:border-blue-400 rounded px-2 py-1.5 text-xs focus:outline-none bg-white"
                        />
                      </td>
                    ))}

                    {/* Delete Action (Admin Only) */}
                    {isAdmin && (
                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleDeleteRow(item.id)}
                          className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg transition"
                          title="Delete content item"
                        >
                          🗑
                        </button>
                      </td>
                    )}

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
