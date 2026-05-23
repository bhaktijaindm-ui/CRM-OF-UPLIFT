'use client';

import React, { useState } from 'react';
import { useCRM } from '../../components/SharedStateContext';

interface ClientCustomSections {
  brandGuidelines: string;
  targetAudience: string;
  reviewSchedule: string;
  brandColors: string;
}

interface ClientExtended {
  id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  packageDetails: string;
  status: string;
  website: string;
  passwordAccess: string;
  postsCount: number;
  reelsCount: number;
  carouselsCount: number;
  services: string[];
  customSections: ClientCustomSections;
  dynamicValues: Record<string, string>; // Store custom column values dynamically
}

export default function ClientsDatabaseDashboard() {
  const { clients: crmClients } = useCRM();

  // 1. Role / Access Control Simulator State
  const [currentUserEmail, setCurrentUserEmail] = useState<string>('bhaktijaindm@gmail.com');
  const isAdmin = currentUserEmail === 'bhaktijaindm@gmail.com';

  // 2. Client Database Local State (supports manual edit, upload, and new entries)
  const [clientsList, setClientsList] = useState<ClientExtended[]>([
    {
      id: 'cli-1',
      companyName: 'Apex Analytics Corp',
      contactPerson: 'Rajesh Kumar',
      email: 'ops@apex.io',
      phone: '+91 98765 43210',
      address: 'Vijay Nagar, Indore',
      packageDetails: 'Premium Enterprise SEO & Video Suite',
      status: 'Active Pipeline',
      website: 'https://apexanalytics.io',
      passwordAccess: 'WPAdmin: apex_seoadm | PW: $881k_ApxVault2026 | SFTP Port: 2289',
      postsCount: 24,
      reelsCount: 8,
      carouselsCount: 15,
      services: ['SEO Optimization', 'Video Suite', 'Social Graphics'],
      customSections: {
        brandGuidelines: 'High-contrast tech graphics, professional authoritative tone, dark mode priority.',
        targetAudience: 'Enterprise DevOps teams, CTOs, and Senior IT Executives.',
        reviewSchedule: 'Every Tuesday at 10:00 AM IST via Zoom.',
        brandColors: 'Primary Blue (#2563EB), Accent Teal (#0D9488)'
      },
      dynamicValues: {}
    },
    {
      id: 'cli-2',
      companyName: 'Nova Health Tech',
      contactPerson: 'Priyanka Choithram',
      email: 'dr.priyanka@novahealth.in',
      phone: '+91 91110 22233',
      address: 'Palasia Cross, Indore',
      packageDetails: 'SXO & Bi-Weekly Motion Graphics',
      status: 'Retainer',
      website: 'https://novahealth.in',
      passwordAccess: 'WP-Admin: dr_priyanka | PW: NovaHlt#2026_SecureNode | AWS S3: nova-bucket-prod',
      postsCount: 18,
      reelsCount: 12,
      carouselsCount: 6,
      services: ['SXO Services', 'Motion Graphics', 'Interactive Reels'],
      customSections: {
        brandGuidelines: 'Warm friendly color tones, clear clinical accessibility rules, minimal white space.',
        targetAudience: 'Healthcare practitioners, health-conscious consumers, wellness bloggers.',
        reviewSchedule: 'Alternate Fridays at 4:30 PM IST.',
        brandColors: 'Primary Emerald (#059669), Secondary White (#FFFFFF)'
      },
      dynamicValues: {}
    }
  ]);

  // 3. Dynamic Custom Columns State
  const [customColumns, setCustomColumns] = useState<string[]>([]);
  const [newColumnName, setNewColumnName] = useState('');

  // 4. Modal Editing & Creation States
  const [editingClient, setEditingClient] = useState<ClientExtended | null>(null);
  const [editingSectionsClient, setEditingSectionsClient] = useState<ClientExtended | null>(null);
  const [showAddClientModal, setShowAddClientModal] = useState(false);

  // 5. New Client Form State
  const [newClientName, setNewClientName] = useState('');
  const [newClientLiaison, setNewClientLiaison] = useState('');
  const [newClientEmail, setNewClientEmail] = useState('');
  const [newClientPhone, setNewClientPhone] = useState('');
  const [newClientWebsite, setNewClientWebsite] = useState('');
  const [newClientPassword, setNewClientPassword] = useState('');
  const [newClientAddress, setNewClientAddress] = useState('');
  const [newClientPackage, setNewClientPackage] = useState('');
  const [newClientStatus, setNewClientStatus] = useState('Active Pipeline');
  const [newClientServices, setNewClientServices] = useState('');

  // Notifications State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Add Dynamic Column Handler
  const handleAddColumn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newColumnName.trim()) return;

    const formattedCol = newColumnName.trim();
    if (customColumns.includes(formattedCol)) {
      triggerToast(`Column "${formattedCol}" already exists!`);
      return;
    }

    setCustomColumns(prev => [...prev, formattedCol]);
    setNewColumnName('');
    triggerToast(`Added custom column "${formattedCol}" successfully.`);
  };

  // Edit Dynamic Value Handler
  const handleUpdateDynamicVal = (clientId: string, colName: string, val: string) => {
    setClientsList(prev =>
      prev.map(c =>
        c.id === clientId
          ? { ...c, dynamicValues: { ...c.dynamicValues, [colName]: val } }
          : c
      )
    );
  };

  // Create Client Handler
  const handleCreateClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName || !newClientEmail) {
      triggerToast('Please provide a Client Company Name and Contact Email');
      return;
    }

    const servicesArr = newClientServices
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    const newClient: ClientExtended = {
      id: `cli-${Date.now()}`,
      companyName: newClientName,
      contactPerson: newClientLiaison || 'Not Assigned',
      email: newClientEmail,
      phone: newClientPhone || 'N/A',
      address: newClientAddress || 'N/A',
      packageDetails: newClientPackage || 'Standard Audit Tier',
      status: newClientStatus,
      website: newClientWebsite || 'https://',
      passwordAccess: newClientPassword || 'No credentials uploaded yet',
      postsCount: 0,
      reelsCount: 0,
      carouselsCount: 0,
      services: servicesArr.length > 0 ? servicesArr : ['SEO Standard Audit'],
      customSections: {
        brandGuidelines: 'Click edit guidelines to update.',
        targetAudience: 'Not configured.',
        reviewSchedule: 'Not configured.',
        brandColors: 'Not configured.'
      },
      dynamicValues: {}
    };

    setClientsList(prev => [...prev, newClient]);
    setShowAddClientModal(false);

    // Reset Form
    setNewClientName('');
    setNewClientLiaison('');
    setNewClientEmail('');
    setNewClientPhone('');
    setNewClientWebsite('');
    setNewClientPassword('');
    setNewClientAddress('');
    setNewClientPackage('');
    setNewClientServices('');

    triggerToast(`Client ${newClient.companyName} registered manually!`);
  };

  // Save General Client Updates
  const handleSaveClientEdits = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClient) return;

    setClientsList(prev =>
      prev.map(c => (c.id === editingClient.id ? editingClient : c))
    );
    setEditingClient(null);
    triggerToast(`Successfully updated details for ${editingClient.companyName}`);
  };

  // Save Custom Sections Updates
  const handleSaveSections = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSectionsClient) return;

    setClientsList(prev =>
      prev.map(c =>
        c.id === editingSectionsClient.id
          ? { ...c, customSections: editingSectionsClient.customSections }
          : c
      )
    );
    setEditingSectionsClient(null);
    triggerToast(`Manually modified sections saved for ${editingSectionsClient.companyName}`);
  };

  return (
    <div className="space-y-8 relative">
      {/* Toast Banner */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 px-6 py-4 rounded-xl shadow-xl bg-slate-900 border border-slate-700 text-white font-semibold flex items-center gap-2 animate-slide-in">
          <span>✓</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Role / Access Control Simulator Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-lg border border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold text-lg">
            🔒
          </div>
          <div>
            <h2 className="text-base font-bold tracking-tight">Security Envelope Controller</h2>
            <p className="text-xs text-slate-400">Restricted client database views. Test access control logic by switching roles.</p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-slate-800 border border-slate-700 rounded-xl p-2.5">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1.5">User Identity:</span>
          <select
            value={currentUserEmail}
            onChange={(e) => setCurrentUserEmail(e.target.value)}
            className="bg-slate-950 text-white border border-slate-700 rounded-lg py-1 px-3 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
          >
            <option value="bhaktijaindm@gmail.com">bhaktijaindm@gmail.com (ADMIN)</option>
            <option value="guest@firm.com">guest@firm.com (Viewer - Staff)</option>
          </select>
        </div>
      </div>

      {/* Access Denied Shield */}
      {!isAdmin ? (
        <div className="bg-white/80 backdrop-blur border border-red-200 rounded-2xl p-16 shadow-xl flex flex-col items-center justify-center text-center space-y-4 max-w-4xl mx-auto">
          <div className="w-20 h-20 rounded-full bg-red-50 text-red-500 border border-red-200 flex items-center justify-center text-4xl shadow-inner shadow-red-500/5 animate-pulse">
            ✕
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Access Control Breach Prevented</h3>
            <p className="text-slate-500 font-mono text-xs">Security Protocol: Admin Authorization Token Missing</p>
          </div>
          <p className="text-sm text-slate-500 max-w-md leading-relaxed">
            The client credentials database contains critical passwords, server tokens, and strategic assets. 
            Only accounts matching administrator credentials (**`bhaktijaindm@gmail.com`**) are permitted to access this sector.
          </p>
          <div className="pt-4">
            <button
              onClick={() => setCurrentUserEmail('bhaktijaindm@gmail.com')}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-lg shadow-slate-900/10"
            >
              Simulate Admin Log In
            </button>
          </div>
        </div>
      ) : (
        /* Unlocked Database Dashboard Content */
        <div className="space-y-8 animate-fade-in">
          
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">Client Strategic Assets Portfolio</h2>
              <p className="text-sm text-slate-500">Corporate credential parameters, social post counts, and dynamic ledger customization.</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowAddClientModal(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-md shadow-blue-500/10"
              >
                + Register Client Record
              </button>
            </div>
          </div>

          {/* Dynamic Columns Manager */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-sm">
            <form onSubmit={handleAddColumn} className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="space-y-0.5 text-center sm:text-left">
                <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Dynamic Column Builder</h4>
                <p className="text-xs text-slate-400">Append custom text fields to the database table instantly.</p>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <input
                  type="text"
                  required
                  placeholder="e.g. Lead Score, Budget Value"
                  value={newColumnName}
                  onChange={(e) => setNewColumnName(e.target.value)}
                  className="flex-1 sm:w-60 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition"
                >
                  Create Column
                </button>
              </div>
            </form>
          </div>

          {/* Master Client Database Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-200 bg-slate-50/50">
              <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wide">Personnel Access & Deliverables Ledger</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/70 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    <th className="p-4 pl-6 min-w-[200px]">Client Details</th>
                    <th className="p-4 min-w-[200px]">Secure Password Access</th>
                    <th className="p-4 min-w-[150px]">Social Deliverables</th>
                    <th className="p-4 min-w-[180px]">Services Taken</th>
                    {/* Render User Created Columns */}
                    {customColumns.map((col) => (
                      <th key={col} className="p-4 min-w-[150px] bg-blue-50/50 text-blue-800 font-bold border-l border-blue-100">
                        {col} (Custom)
                      </th>
                    ))}
                    <th className="p-4 pr-6 text-right min-w-[180px]">Administration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {clientsList.map((client) => (
                    <tr key={client.id} className="hover:bg-slate-50/60 transition-colors align-top">
                      
                      {/* Column 1: Client Details */}
                      <td className="p-4 pl-6 space-y-1">
                        <div>
                          <span className="font-bold text-slate-900 block text-base">{client.companyName}</span>
                          <span className="text-xs text-slate-400">Liaison: {client.contactPerson}</span>
                        </div>
                        <div className="text-xs space-y-0.5 text-slate-500">
                          <p>✉ {client.email}</p>
                          <p>☎ {client.phone}</p>
                          <p>
                            🌐{' '}
                            <a
                              href={client.website}
                              target="_blank"
                              rel="noreferrer"
                              className="text-blue-600 hover:underline font-semibold"
                            >
                              {client.website.replace('https://', '')}
                            </a>
                          </p>
                        </div>
                      </td>

                      {/* Column 2: Password Access */}
                      <td className="p-4">
                        <div className="bg-slate-950 text-slate-100 p-3 rounded-lg font-mono text-[11px] leading-relaxed border border-slate-800 max-w-sm whitespace-pre-wrap select-all">
                          <span className="text-[9px] text-blue-400 font-sans font-bold uppercase tracking-wider block mb-1">
                            Secure Credentials Vault
                          </span>
                          {client.passwordAccess}
                        </div>
                      </td>

                      {/* Column 3: Social Deliverables */}
                      <td className="p-4 space-y-1 text-xs">
                        <div className="flex justify-between border-b border-slate-100 pb-0.5">
                          <span className="text-slate-400">Posts:</span>
                          <span className="font-bold text-slate-800">{client.postsCount}</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-100 pb-0.5">
                          <span className="text-slate-400">Reels:</span>
                          <span className="font-bold text-slate-800">{client.reelsCount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Carousels:</span>
                          <span className="font-bold text-slate-800">{client.carouselsCount}</span>
                        </div>
                      </td>

                      {/* Column 4: Services Taken */}
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1.5 max-w-[180px]">
                          {client.services.map((svc, i) => (
                            <span
                              key={i}
                              className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-100"
                            >
                              {svc}
                            </span>
                          ))}
                        </div>
                        <p className="text-[11px] text-slate-400 mt-2 font-medium italic">{client.packageDetails}</p>
                      </td>

                      {/* Column 5: User Created Custom Columns */}
                      {customColumns.map((col) => (
                        <td key={col} className="p-4 border-l border-blue-100 bg-blue-50/10">
                          <input
                            type="text"
                            placeholder="Enter notes..."
                            value={client.dynamicValues[col] || ''}
                            onChange={(e) => handleUpdateDynamicVal(client.id, col, e.target.value)}
                            className="w-full border border-slate-200 focus:border-blue-400 rounded px-2.5 py-1.5 text-xs bg-white focus:outline-none"
                          />
                        </td>
                      ))}

                      {/* Column 6: Actions */}
                      <td className="p-4 pr-6 text-right space-y-2">
                        <div className="flex flex-col items-end gap-1.5">
                          <button
                            onClick={() => setEditingClient(client)}
                            className="text-xs font-bold text-blue-600 hover:underline"
                          >
                            Modify Settings
                          </button>
                          <button
                            onClick={() => setEditingSectionsClient(client)}
                            className="text-xs font-bold text-emerald-600 hover:underline"
                          >
                            Manage Brand Info ({Object.keys(client.customSections).length} sections)
                          </button>
                        </div>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Custom Brand Profiles View (Interactive 3-4 manually created sections display) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {clientsList.map((client) => (
              <div key={client.id} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                  <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider">
                    {client.companyName} Profile Summary
                  </h3>
                  <button
                    onClick={() => setEditingSectionsClient(client)}
                    className="text-xs font-semibold text-emerald-600 hover:text-emerald-800 transition"
                  >
                    Edit Info
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 space-y-1">
                    <span className="font-bold text-slate-400 uppercase tracking-widest text-[9px] block">
                      Brand Guidelines
                    </span>
                    <p className="text-slate-700 leading-relaxed">{client.customSections.brandGuidelines}</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 space-y-1">
                    <span className="font-bold text-slate-400 uppercase tracking-widest text-[9px] block">
                      Target Audience
                    </span>
                    <p className="text-slate-700 leading-relaxed">{client.customSections.targetAudience}</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 space-y-1">
                    <span className="font-bold text-slate-400 uppercase tracking-widest text-[9px] block">
                      Content Review Calendar
                    </span>
                    <p className="text-slate-700 leading-relaxed">{client.customSections.reviewSchedule}</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 space-y-1">
                    <span className="font-bold text-slate-400 uppercase tracking-widest text-[9px] block">
                      Palette & Colors
                    </span>
                    <p className="text-slate-700 leading-relaxed">{client.customSections.brandColors}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* MODAL: Modify Client Details */}
          {editingClient && (
            <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl overflow-hidden animate-zoom-in flex flex-col max-h-[90vh]">
                <div className="bg-slate-900 text-white p-6 flex justify-between items-center shrink-0">
                  <div>
                    <h3 className="font-bold text-lg">Modify Client Records</h3>
                    <p className="text-xs text-slate-400">Settings will dynamically update across all active dashboard panels.</p>
                  </div>
                  <button onClick={() => setEditingClient(null)} className="text-slate-400 hover:text-white transition font-bold">
                    ✕
                  </button>
                </div>
                <form onSubmit={handleSaveClientEdits} className="p-6 space-y-4 overflow-y-auto">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Company Name</label>
                      <input
                        type="text"
                        required
                        value={editingClient.companyName}
                        onChange={(e) => setEditingClient({ ...editingClient, companyName: e.target.value })}
                        className="w-full border border-slate-200 rounded-lg p-2.5 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Primary Liaison</label>
                      <input
                        type="text"
                        required
                        value={editingClient.contactPerson}
                        onChange={(e) => setEditingClient({ ...editingClient, contactPerson: e.target.value })}
                        className="w-full border border-slate-200 rounded-lg p-2.5 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Email Address</label>
                      <input
                        type="email"
                        required
                        value={editingClient.email}
                        onChange={(e) => setEditingClient({ ...editingClient, email: e.target.value })}
                        className="w-full border border-slate-200 rounded-lg p-2.5 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Phone Number</label>
                      <input
                        type="text"
                        required
                        value={editingClient.phone}
                        onChange={(e) => setEditingClient({ ...editingClient, phone: e.target.value })}
                        className="w-full border border-slate-200 rounded-lg p-2.5 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Website URL</label>
                      <input
                        type="text"
                        required
                        value={editingClient.website}
                        onChange={(e) => setEditingClient({ ...editingClient, website: e.target.value })}
                        className="w-full border border-slate-200 rounded-lg p-2.5 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Secure Credentials Vault</label>
                    <textarea
                      required
                      rows={3}
                      value={editingClient.passwordAccess}
                      onChange={(e) => setEditingClient({ ...editingClient, passwordAccess: e.target.value })}
                      className="w-full border border-slate-200 rounded-lg p-2.5 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Posts Scheduled</label>
                      <input
                        type="number"
                        required
                        value={editingClient.postsCount}
                        onChange={(e) => setEditingClient({ ...editingClient, postsCount: Number(e.target.value) })}
                        className="w-full border border-slate-200 rounded-lg p-2.5 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Reels Scheduled</label>
                      <input
                        type="number"
                        required
                        value={editingClient.reelsCount}
                        onChange={(e) => setEditingClient({ ...editingClient, reelsCount: Number(e.target.value) })}
                        className="w-full border border-slate-200 rounded-lg p-2.5 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Carousels Scheduled</label>
                      <input
                        type="number"
                        required
                        value={editingClient.carouselsCount}
                        onChange={(e) => setEditingClient({ ...editingClient, carouselsCount: Number(e.target.value) })}
                        className="w-full border border-slate-200 rounded-lg p-2.5 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Services Taken (Comma Separated)</label>
                      <input
                        type="text"
                        required
                        value={editingClient.services.join(', ')}
                        onChange={(e) => setEditingClient({ ...editingClient, services: e.target.value.split(',').map(s => s.trim()) })}
                        className="w-full border border-slate-200 rounded-lg p-2.5 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Package Details Tag</label>
                      <input
                        type="text"
                        required
                        value={editingClient.packageDetails}
                        onChange={(e) => setEditingClient({ ...editingClient, packageDetails: e.target.value })}
                        className="w-full border border-slate-200 rounded-lg p-2.5 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setEditingClient(null)}
                      className="px-4 py-2 border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 rounded-lg text-xs font-bold uppercase tracking-wider transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition shadow-md"
                    >
                      Save Client Data
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* MODAL: Modify Custom Sections (Manually created brand details) */}
          {editingSectionsClient && (
            <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-xl overflow-hidden animate-zoom-in flex flex-col max-h-[90vh]">
                <div className="bg-slate-900 text-white p-6 flex justify-between items-center shrink-0">
                  <div>
                    <h3 className="font-bold text-lg">Modify Custom Brand Guidelines</h3>
                    <p className="text-xs text-slate-400">Configure manually created sections to adapt brand assets.</p>
                  </div>
                  <button onClick={() => setEditingSectionsClient(null)} className="text-slate-400 hover:text-white transition font-bold">
                    ✕
                  </button>
                </div>
                <form onSubmit={handleSaveSections} className="p-6 space-y-4 overflow-y-auto">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Section 1: Brand Guidelines</label>
                    <textarea
                      required
                      rows={2}
                      value={editingSectionsClient.customSections.brandGuidelines}
                      onChange={(e) =>
                        setEditingSectionsClient({
                          ...editingSectionsClient,
                          customSections: { ...editingSectionsClient.customSections, brandGuidelines: e.target.value }
                        })
                      }
                      className="w-full border border-slate-200 rounded-lg p-2.5 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Section 2: Target Audience Matrix</label>
                    <textarea
                      required
                      rows={2}
                      value={editingSectionsClient.customSections.targetAudience}
                      onChange={(e) =>
                        setEditingSectionsClient({
                          ...editingSectionsClient,
                          customSections: { ...editingSectionsClient.customSections, targetAudience: e.target.value }
                        })
                      }
                      className="w-full border border-slate-200 rounded-lg p-2.5 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Section 3: Content Review Calendar</label>
                    <textarea
                      required
                      rows={2}
                      value={editingSectionsClient.customSections.reviewSchedule}
                      onChange={(e) =>
                        setEditingSectionsClient({
                          ...editingSectionsClient,
                          customSections: { ...editingSectionsClient.customSections, reviewSchedule: e.target.value }
                        })
                      }
                      className="w-full border border-slate-200 rounded-lg p-2.5 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Section 4: Color Palette Codes</label>
                    <textarea
                      required
                      rows={2}
                      value={editingSectionsClient.customSections.brandColors}
                      onChange={(e) =>
                        setEditingSectionsClient({
                          ...editingSectionsClient,
                          customSections: { ...editingSectionsClient.customSections, brandColors: e.target.value }
                        })
                      }
                      className="w-full border border-slate-200 rounded-lg p-2.5 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setEditingSectionsClient(null)}
                      className="px-4 py-2 border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 rounded-lg text-xs font-bold uppercase tracking-wider transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition shadow-md"
                    >
                      Save Section Text
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* MODAL: Register New Client (Manual Upload) */}
          {showAddClientModal && (
            <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl overflow-hidden animate-zoom-in flex flex-col max-h-[90vh]">
                <div className="bg-slate-900 text-white p-6 flex justify-between items-center shrink-0">
                  <div>
                    <h3 className="font-bold text-lg">Register New Client Account</h3>
                    <p className="text-xs text-slate-400">Establish corporate credentials and services package details.</p>
                  </div>
                  <button onClick={() => setShowAddClientModal(false)} className="text-slate-400 hover:text-white transition font-bold">
                    ✕
                  </button>
                </div>
                <form onSubmit={handleCreateClient} className="p-6 space-y-4 overflow-y-auto">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Company Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Apex Analytics Corp"
                        value={newClientName}
                        onChange={(e) => setNewClientName(e.target.value)}
                        className="w-full border border-slate-200 rounded-lg p-2.5 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Primary Liaison Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Rajesh Kumar"
                        value={newClientLiaison}
                        onChange={(e) => setNewClientLiaison(e.target.value)}
                        className="w-full border border-slate-200 rounded-lg p-2.5 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Email Address</label>
                      <input
                        type="email"
                        required
                        placeholder="ops@clientdomain.com"
                        value={newClientEmail}
                        onChange={(e) => setNewClientEmail(e.target.value)}
                        className="w-full border border-slate-200 rounded-lg p-2.5 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Phone Number</label>
                      <input
                        type="text"
                        placeholder="+91 99887 76655"
                        value={newClientPhone}
                        onChange={(e) => setNewClientPhone(e.target.value)}
                        className="w-full border border-slate-200 rounded-lg p-2.5 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Website URL</label>
                      <input
                        type="text"
                        placeholder="https://domain.com"
                        value={newClientWebsite}
                        onChange={(e) => setNewClientWebsite(e.target.value)}
                        className="w-full border border-slate-200 rounded-lg p-2.5 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Credentials Vault Details</label>
                      <input
                        type="text"
                        placeholder="WP-Admin URL: ... | PW: ..."
                        value={newClientPassword}
                        onChange={(e) => setNewClientPassword(e.target.value)}
                        className="w-full border border-slate-200 rounded-lg p-2.5 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">HQ Address location</label>
                      <input
                        type="text"
                        placeholder="Indore, MP"
                        value={newClientAddress}
                        onChange={(e) => setNewClientAddress(e.target.value)}
                        className="w-full border border-slate-200 rounded-lg p-2.5 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Services list (comma separated)</label>
                      <input
                        type="text"
                        placeholder="SEO, Graphics, Video Suite"
                        value={newClientServices}
                        onChange={(e) => setNewClientServices(e.target.value)}
                        className="w-full border border-slate-200 rounded-lg p-2.5 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Assigned Service Tier Package</label>
                      <input
                        type="text"
                        placeholder="Premium Enterprise SEO Suite"
                        value={newClientPackage}
                        onChange={(e) => setNewClientPackage(e.target.value)}
                        className="w-full border border-slate-200 rounded-lg p-2.5 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setShowAddClientModal(false)}
                      className="px-4 py-2 border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 rounded-lg text-xs font-bold uppercase tracking-wider transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition shadow-md"
                    >
                      Add Client Record
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
