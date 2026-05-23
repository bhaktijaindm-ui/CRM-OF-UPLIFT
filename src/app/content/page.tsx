'use client';

import React, { useState } from 'react';
import { useCRM } from '../../components/SharedStateContext';

interface AttachmentItem {
  id: string;
  name: string;
  type: 'Link' | 'Document' | 'Image' | 'Video' | 'Text';
  url: string;
}

interface ApprovalAssetItem {
  type: 'Video' | 'Graphic' | 'PDF';
  title: string;
  url: string;
  pdfPages?: string[]; // Array of strings simulating document pages
}

interface ContentItemExtended {
  id: string;
  clientName: string;
  format: 'Carousel Post' | 'Reel' | 'Video' | 'Other';
  details: string;
  caption: string;
  postDate: string; // YYYY-MM-DD
  status: 'Not Started' | 'In Progress' | 'Pending Approval' | 'Scheduled' | 'Posted' | 'Completed';
  attachments: AttachmentItem[];
  approvalAsset: ApprovalAssetItem | null;
  dynamicValues: Record<string, string>; // Stores custom column values
}

export default function ContentPipelineTable() {
  const { clients } = useCRM();

  // 1. Role Selector State
  const [currentUserEmail, setCurrentUserEmail] = useState<string>('bhaktijaindm@gmail.com');
  const isAdmin = currentUserEmail === 'bhaktijaindm@gmail.com';

  // 2. Content items list state with media objects pre-seeded
  const [contentList, setContentList] = useState<ContentItemExtended[]>([
    {
      id: 'item-1',
      clientName: 'Apex Analytics Corp',
      format: 'Video',
      details: 'Q2 Performance Breakdown Video',
      caption: 'Scaling SEO architectures in 2026. Here is the blueprint.',
      postDate: '2026-05-25',
      status: 'In Progress',
      attachments: [
        { id: 'att-1', name: 'SEO Script Draft v2', type: 'Document', url: 'https://docs.google.com/document/d/ref-1' },
        { id: 'att-2', name: 'Thumbnail Wireframe', type: 'Image', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80' }
      ],
      approvalAsset: {
        type: 'Video',
        title: 'Q2 SEO Breakdown Final.mp4',
        url: 'https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large.mp4'
      },
      dynamicValues: {}
    },
    {
      id: 'item-2',
      clientName: 'Nova Health Tech',
      format: 'Carousel Post',
      details: 'SaaS UX High-Contrast System Graphics',
      caption: 'Why dark layouts retain 40% more engineering focus.',
      postDate: '2026-05-26',
      status: 'Pending Approval',
      attachments: [
        { id: 'att-3', name: 'UX Audit Notes', type: 'Text', url: 'Focus groups prefer deep slate (#0f172a) over black (#000000) by 40%.' },
        { id: 'att-4', name: 'Figma Assets Node', type: 'Link', url: 'https://figma.com/design/assets-801' }
      ],
      approvalAsset: {
        type: 'Graphic',
        title: 'SaaS Dark Mode UI Cover.png',
        url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80'
      },
      dynamicValues: {}
    },
    {
      id: 'item-3',
      clientName: 'Apex Analytics Corp',
      format: 'Other',
      details: 'AI Optimization Trends Deck',
      caption: 'Moving beyond legacy anchors into contextual answer generation.',
      postDate: '2026-05-28',
      status: 'Scheduled',
      attachments: [
        { id: 'att-5', name: 'AI Research Deck Link', type: 'Link', url: 'https://slides.google.com/deck-902' }
      ],
      approvalAsset: {
        type: 'PDF',
        title: 'AI Answer Generation Guide.pdf',
        url: 'MOCK_PDF_RESOURCES',
        pdfPages: [
          'PAGE 1: CONTEXTUAL ANSWER GENERATION\n\nTraditional search indexes are moving to LLM-guided context maps. Website tags must adapt to semantic crawling agents.',
          'PAGE 2: OPTIMIZATION KEYMETRICS\n\n- Organic Click share: +15%\n- Semantic match rank: #2 average\n- Average Answer citation length: 45 words',
          'PAGE 3: CONTEXT STRUCTURE\n\nStructure all markup in JSON-LD. Priority items:\n1. MainEntityOfPage\n2. Author Trustworthiness rating\n3. Publisher verification tokens'
        ]
      },
      dynamicValues: {}
    }
  ]);

  // 3. Dynamic Custom Columns State
  const [customColumns, setCustomColumns] = useState<string[]>([]);
  const [newColName, setNewColName] = useState('');

  // 4. Inline popover adder controllers
  const [addingAttachmentId, setAddingAttachmentId] = useState<string | null>(null);
  const [newAttName, setNewAttName] = useState('');
  const [newAttType, setNewAttType] = useState<AttachmentItem['type']>('Link');
  const [newAttUrl, setNewAttUrl] = useState('');

  const [addingApprovalId, setAddingApprovalId] = useState<string | null>(null);
  const [newAppType, setNewAppType] = useState<ApprovalAssetItem['type']>('Graphic');
  const [newAppTitle, setNewAppTitle] = useState('');
  const [selectedMockPreset, setSelectedMockPreset] = useState<string>('nature-video');

  // 5. Lightbox Preview Modal State
  const [previewingAsset, setPreviewingAsset] = useState<{ item: ContentItemExtended; asset: ApprovalAssetItem } | null>(null);
  const [pdfPageIdx, setPdfPageIdx] = useState(0);

  // Toast Notification state
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
      status: 'Not Started',
      attachments: [],
      approvalAsset: null,
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

  // Update cell field directly
  const handleUpdateCell = (id: string, field: keyof ContentItemExtended, value: any) => {
    setContentList(prev =>
      prev.map(item => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  // Update dynamic custom column value
  const handleUpdateCustomVal = (id: string, colName: string, value: string) => {
    setContentList(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, dynamicValues: { ...item.dynamicValues, [colName]: value } }
          : item
      )
    );
  };

  // Add Attachment Handler (Admins can do it; Staff blocked)
  const handleAddAttachment = (id: string) => {
    if (!isAdmin) {
      triggerToast('Permission Denied: Only administrators can upload/add attachments.');
      return;
    }
    if (!newAttName.trim() || !newAttUrl.trim()) {
      triggerToast('Please provide an asset title and resource URL.');
      return;
    }

    const newAtt: AttachmentItem = {
      id: `att-${Date.now()}`,
      name: newAttName.trim(),
      type: newAttType,
      url: newAttUrl.trim()
    };

    setContentList(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, attachments: [...item.attachments, newAtt] }
          : item
      )
    );

    // Reset inputs
    setAddingAttachmentId(null);
    setNewAttName('');
    setNewAttUrl('');
    triggerToast(`Added attachment "${newAtt.name}"`);
  };

  // Remove Attachment Handler
  const handleRemoveAttachment = (itemId: string, attId: string) => {
    if (!isAdmin) {
      triggerToast('Permission Denied: Only administrators can modify attachments.');
      return;
    }
    setContentList(prev =>
      prev.map(item =>
        item.id === itemId
          ? { ...item, attachments: item.attachments.filter(a => a.id !== attId) }
          : item
      )
    );
    triggerToast('Attachment removed.');
  };

  // Add Approval Asset Handler (Admin Only)
  const handleAddApprovalAsset = (id: string) => {
    if (!isAdmin) {
      triggerToast('Permission Denied: Only administrators can specify approval assets.');
      return;
    }
    if (!newAppTitle.trim()) {
      triggerToast('Please provide a title for the approval item.');
      return;
    }

    let url = '';
    let pages: string[] | undefined = undefined;

    if (newAppType === 'Video') {
      url = 'https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large.mp4';
    } else if (newAppType === 'Graphic') {
      url = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80';
    } else if (newAppType === 'PDF') {
      url = 'MOCK_PDF_FILE';
      pages = [
        'PAGE 1: BRAND CAMPAIGN ASSETS OVERVIEW\n\nGraphic layouts focus on deep brand identity integration. Target dispatches scheduled for Q2.',
        'PAGE 2: PLATFORM DISTRIBUTION\n\n- Meta Ads: 3 Reels + 2 Carousels\n- Google Ads: 1 Search campaign\n- LinkedIn Ads: 2 InMails',
        'PAGE 3: COMPLIANCE SPECS\n\nAll media assets must adhere to local MP state advertising standards. Final clearance requested.'
      ];
    }

    const newApproval: ApprovalAssetItem = {
      type: newAppType,
      title: newAppTitle.trim(),
      url,
      pdfPages: pages
    };

    setContentList(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, approvalAsset: newApproval }
          : item
      )
    );

    setAddingApprovalId(null);
    setNewAppTitle('');
    triggerToast(`Registered approval item: ${newApproval.title}`);
  };

  // Remove Approval Asset Handler
  const handleRemoveApprovalAsset = (itemId: string) => {
    if (!isAdmin) {
      triggerToast('Permission Denied: Only administrators can clear deliverables.');
      return;
    }
    setContentList(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, approvalAsset: null } : item
      )
    );
    triggerToast('Approval asset cleared.');
  };

  // Direct Modal Approval Workflow Action
  const handleApproveWorkflow = (status: ContentItemExtended['status']) => {
    if (!previewingAsset) return;
    handleUpdateCell(previewingAsset.item.id, 'status', status);
    setPreviewingAsset(null);
    triggerToast(`Item workflow status updated to: ${status}`);
  };

  return (
    <div className="space-y-8 relative">
      {/* Toast banner */}
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
            <h2 className="text-base font-bold tracking-tight">Social Media Content Access Console</h2>
            <p className="text-xs text-slate-400">All roles edit cells. Only Admins can create rows, add columns, and load assets.</p>
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
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Social Media Content Grid</h2>
          <p className="text-sm text-slate-500">Edit table values directly. Double-click or select options to modify campaign assets.</p>
        </div>
        <div className="flex items-center gap-2">
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
            <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Social Media Column Builder</h4>
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
          <table className="w-full text-left border-collapse table-fixed min-w-[1550px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <th className="p-3 pl-6 w-[140px] sticky left-0 bg-slate-50 z-20 border-r border-slate-200 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">Task Code</th>
                <th className="p-3 w-[160px]">Client Name</th>
                <th className="p-3 w-[140px]">Hosting / Format</th>
                <th className="p-3 w-[200px]">Content details</th>
                <th className="p-3 w-[200px]">Caption</th>
                <th className="p-3 w-[130px]">Post Date</th>
                <th className="p-3 w-[220px]">Asset Attachments</th>
                <th className="p-3 w-[200px]">Approval Item</th>
                <th className="p-3 w-[160px]">Social Media Status</th>
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
                  <tr key={item.id} className="group hover:bg-slate-50/40 transition-colors">
                    
                    {/* Cell 1: Auto generated Task Code */}
                    <td className="p-3 pl-6 sticky left-0 bg-white group-hover:bg-slate-50 z-10 border-r border-slate-200 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
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

                    {/* Cell 7: Asset Attachments (all-in-one link/doc/image/video/text) */}
                    <td className="p-2 relative">
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap gap-1">
                          {item.attachments.map((att) => (
                            <span 
                              key={att.id} 
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-bold border border-slate-200 shadow-sm"
                              title={`${att.type}: ${att.url}`}
                            >
                              <span>
                                {att.type === 'Link' ? '🔗' :
                                 att.type === 'Document' ? '📄' :
                                 att.type === 'Image' ? '🖼' :
                                 att.type === 'Video' ? '🎥' : '✍'}
                              </span>
                              <span className="max-w-[70px] truncate">{att.name}</span>
                              {isAdmin && (
                                <button 
                                  onClick={() => handleRemoveAttachment(item.id, att.id)}
                                  className="text-[9px] text-slate-400 hover:text-rose-600 font-bold ml-1"
                                >
                                  ✕
                                </button>
                              )}
                            </span>
                          ))}
                        </div>
                        {isAdmin ? (
                          <button
                            onClick={() => setAddingAttachmentId(addingAttachmentId === item.id ? null : item.id)}
                            className="text-[10px] font-extrabold text-blue-600 hover:text-blue-800 flex items-center gap-0.5"
                          >
                            + Add Asset
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-medium italic">🔒 Admin only</span>
                        )}

                        {/* Inline popover helper to configure attachment */}
                        {addingAttachmentId === item.id && (
                          <div className="absolute left-0 bottom-full mb-1 z-30 bg-white border border-slate-200 rounded-xl p-3 shadow-xl w-[220px] space-y-2">
                            <h5 className="font-bold text-[11px] text-slate-800">Add Attachments Rule</h5>
                            <input
                              type="text"
                              placeholder="Asset Title (e.g. Brief v2)"
                              value={newAttName}
                              onChange={(e) => setNewAttName(e.target.value)}
                              className="w-full border border-slate-200 rounded px-2 py-1 text-[10px] focus:outline-none"
                            />
                            <div className="grid grid-cols-2 gap-1.5">
                              <select
                                value={newAttType}
                                onChange={(e) => setNewAttType(e.target.value as any)}
                                className="w-full border border-slate-200 rounded px-1.5 py-1 text-[10px] bg-white cursor-pointer"
                              >
                                <option value="Link">🔗 Link</option>
                                <option value="Document">📄 Doc</option>
                                <option value="Image">🖼 Image</option>
                                <option value="Video">🎥 Video</option>
                                <option value="Text">✍ Text</option>
                              </select>
                              <button
                                type="button"
                                onClick={() => handleAddAttachment(item.id)}
                                className="bg-slate-900 text-white font-bold rounded text-[9px] hover:bg-slate-800"
                              >
                                Add
                              </button>
                            </div>
                            <input
                              type="text"
                              placeholder="URL Link or Text details"
                              value={newAttUrl}
                              onChange={(e) => setNewAttUrl(e.target.value)}
                              className="w-full border border-slate-200 rounded px-2 py-1 text-[10px] focus:outline-none font-mono"
                            />
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Cell 8: Approval Item (Graphic/Video/PDF Player review) */}
                    <td className="p-2 relative">
                      {item.approvalAsset ? (
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setPreviewingAsset({ item, asset: item.approvalAsset! })}
                            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold shadow-sm border transition text-left shrink-0 ${
                              item.approvalAsset.type === 'Video' ? 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100' :
                              item.approvalAsset.type === 'Graphic' ? 'bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-100' :
                              'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                            }`}
                          >
                            <span>
                              {item.approvalAsset.type === 'Video' ? '🎥' :
                               item.approvalAsset.type === 'Graphic' ? '🖼' : '📄'}
                            </span>
                            <span className="max-w-[80px] truncate" title={item.approvalAsset.title}>
                              {item.approvalAsset.title}
                            </span>
                          </button>
                          {isAdmin && (
                            <button
                              onClick={() => handleRemoveApprovalAsset(item.id)}
                              className="text-[11px] text-slate-400 hover:text-rose-600 font-bold px-1"
                              title="Clear asset"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      ) : (
                        <div>
                          {isAdmin ? (
                            <button
                              onClick={() => setAddingApprovalId(addingApprovalId === item.id ? null : item.id)}
                              className="text-[10px] font-extrabold text-indigo-600 hover:text-indigo-800"
                            >
                              + Set Approval Item
                            </button>
                          ) : (
                            <span className="text-[10px] text-slate-400 font-medium italic">🔒 Admin only</span>
                          )}

                          {/* Popover to select mock approval preset */}
                          {addingApprovalId === item.id && (
                            <div className="absolute left-0 bottom-full mb-1 z-30 bg-white border border-slate-200 rounded-xl p-3 shadow-xl w-[220px] space-y-2">
                              <h5 className="font-bold text-[11px] text-slate-800">Set Approval Deliverable</h5>
                              <input
                                type="text"
                                placeholder="Asset Name (e.g. Promo Cut)"
                                value={newAppTitle}
                                onChange={(e) => setNewAppTitle(e.target.value)}
                                className="w-full border border-slate-200 rounded px-2 py-1 text-[10px] focus:outline-none"
                              />
                              <div className="grid grid-cols-2 gap-1.5">
                                <select
                                  value={newAppType}
                                  onChange={(e) => setNewAppType(e.target.value as any)}
                                  className="w-full border border-slate-200 rounded px-1.5 py-1 text-[10px] bg-white cursor-pointer"
                                >
                                  <option value="Graphic">🖼 Graphic</option>
                                  <option value="Video">🎥 Video</option>
                                  <option value="PDF">📄 PDF</option>
                                </select>
                                <button
                                  type="button"
                                  onClick={() => handleAddApprovalAsset(item.id)}
                                  className="bg-indigo-600 text-white font-bold rounded text-[9px] hover:bg-indigo-700"
                                >
                                  Load File
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </td>

                    {/* Cell 9: Status dropdown */}
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
                          className="w-full border border-slate-200 focus:border-blue-400 rounded px-2.5 py-1.5 text-xs focus:outline-none bg-white"
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

      {/* LIGHTBOX PREVIEW MODAL: Media Player for Videos, Lightbox for Images, Page Reader for PDFs */}
      {previewingAsset && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-3xl overflow-hidden animate-zoom-in flex flex-col">
            
            {/* Modal Header */}
            <div className="bg-slate-900 text-white p-5 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-3">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono uppercase ${
                  previewingAsset.asset.type === 'Video' ? 'bg-indigo-600 text-white' :
                  previewingAsset.asset.type === 'Graphic' ? 'bg-teal-600 text-white' :
                  'bg-rose-600 text-white'
                }`}>
                  {previewingAsset.asset.type} Deliverable
                </span>
                <h3 className="font-extrabold text-sm md:text-base tracking-tight">{previewingAsset.asset.title}</h3>
              </div>
              <button 
                onClick={() => {
                  setPreviewingAsset(null);
                  setPdfPageIdx(0);
                }} 
                className="text-slate-400 hover:text-white transition font-bold"
              >
                ✕ Close
              </button>
            </div>

            {/* Modal Media Body (Plays loops, displays graphics, pages documents) */}
            <div className="p-6 bg-slate-950 flex-1 flex items-center justify-center min-h-[350px] max-h-[550px] overflow-y-auto">
              
              {/* Type A: Interactive HTML5 Video Stream */}
              {previewingAsset.asset.type === 'Video' && (
                <div className="w-full max-w-2xl text-center space-y-4">
                  <video 
                    src={previewingAsset.asset.url} 
                    controls 
                    autoPlay 
                    loop 
                    className="w-full max-h-[380px] rounded-lg shadow-xl shadow-slate-900/50 border border-slate-800"
                  />
                  <p className="text-xs text-slate-400 font-mono italic">Playing direct MP4 asset loop</p>
                </div>
              )}

              {/* Type B: High-res Graphic Lightbox */}
              {previewingAsset.asset.type === 'Graphic' && (
                <div className="w-full max-w-2xl text-center space-y-4">
                  <img 
                    src={previewingAsset.asset.url} 
                    alt={previewingAsset.asset.title} 
                    className="max-h-[380px] mx-auto rounded-lg shadow-xl object-contain border border-slate-800"
                  />
                  <p className="text-xs text-slate-400 font-mono italic">Reviewing high-contrast design artwork</p>
                </div>
              )}

              {/* Type C: Simulated Multi-Page PDF Document Slideshow */}
              {previewingAsset.asset.type === 'PDF' && previewingAsset.asset.pdfPages && (
                <div className="w-full max-w-xl bg-white border border-slate-200 rounded-xl p-8 shadow-2xl min-h-[250px] flex flex-col justify-between text-slate-800 space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                      <span className="text-[10px] text-rose-600 font-bold uppercase tracking-widest font-mono">
                        Document Specification
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono font-bold">
                        Slide {pdfPageIdx + 1} of {previewingAsset.asset.pdfPages.length}
                      </span>
                    </div>
                    {/* Simulated PDF text content */}
                    <div className="text-xs md:text-sm font-medium leading-relaxed font-mono whitespace-pre-wrap text-slate-700 min-h-[120px]">
                      {previewingAsset.asset.pdfPages[pdfPageIdx]}
                    </div>
                  </div>
                  {/* PDF Navigation Buttons */}
                  <div className="flex justify-between items-center border-t border-slate-100 pt-4 shrink-0">
                    <button
                      type="button"
                      disabled={pdfPageIdx === 0}
                      onClick={() => setPdfPageIdx(prev => Math.max(0, prev - 1))}
                      className="px-3 py-1.5 text-[11px] font-bold border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg"
                    >
                      ◀ Previous Slide
                    </button>
                    <button
                      type="button"
                      disabled={pdfPageIdx === previewingAsset.asset.pdfPages.length - 1}
                      onClick={() => setPdfPageIdx(prev => Math.min(previewingAsset.asset.pdfPages!.length - 1, prev + 1))}
                      className="px-3 py-1.5 text-[11px] font-bold border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg"
                    >
                      Next Slide ▶
                    </button>
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer (Direct approval workflow connection) */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 px-6 flex flex-col sm:flex-row justify-between items-center gap-4 shrink-0">
              <div className="text-center sm:text-left">
                <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider">
                  Client Approval Decision
                </span>
                <span className="text-xs text-slate-600 font-medium">
                  Reviewing deliverable for client account: <strong>{previewingAsset.item.clientName}</strong>
                </span>
              </div>
              <div className="flex gap-2.5">
                <button
                  onClick={() => handleApproveWorkflow('In Progress')}
                  className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-xl text-xs font-bold uppercase tracking-wider transition"
                >
                  Reject & Re-Edit
                </button>
                <button
                  onClick={() => handleApproveWorkflow('Scheduled')}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-md shadow-indigo-600/10"
                >
                  Approve & Schedule
                </button>
                <button
                  onClick={() => handleApproveWorkflow('Completed')}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-md shadow-emerald-600/10"
                >
                  Approve & Complete
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
