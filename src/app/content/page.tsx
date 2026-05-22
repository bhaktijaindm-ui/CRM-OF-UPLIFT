'use client';

import { useCRM } from '../../components/SharedStateContext';
import { ContentStatus } from '../../lib/schema';

export default function ContentDashboard() {
  const { content, clients, employees, updateContentItem } = useCRM();

  const handleStatusShift = (id: string, nextStatus: ContentStatus) => {
    const asset = content.find(c => c.id === id);
    if (asset) {
      updateContentItem({ ...asset, status: nextStatus });
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Omni-Channel Production Grid</h2>
        <p className="text-sm text-slate-500">Direct state architecture control panel for active content pipelines.</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
          <h3 className="font-semibold text-slate-900">Content Processing Queue</h3>
          <span className="text-xs text-slate-500">Changes here trigger instant recalculations across modules.</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <th className="p-4 pl-6">Campaign Strategy Task</th>
                <th className="p-4">Target Account</th>
                <th className="p-4">Owner</th>
                <th className="p-4">Media</th>
                <th className="p-4">Deployment Vector</th>
                <th className="p-4">Work State Automation</th>
                <th className="p-4 pr-6">External Attachments</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {content.map((item) => {
                const linkedClient = clients.find(c => c.id === item.clientId);
                const assignedStaff = employees.find(e => e.id === item.assignedEmployeeId);

                return (
                  <tr key={item.id} className="hover:bg-slate-50/40 transition-colors">
                    <td className="p-4 pl-6">
                      <div className="font-semibold text-slate-900 max-w-xs truncate">{item.taskName}</div>
                      <div className="text-xs text-slate-400 mt-0.5 line-clamp-1 italic">"{item.caption}"</div>
                    </td>
                    <td className="p-4 font-medium text-slate-700">{linkedClient?.companyName || 'Unknown Corp'}</td>
                    <td className="p-4 text-slate-600 font-medium">{assignedStaff?.name || 'Unassigned'}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        item.contentType === 'Video' ? 'bg-indigo-50 text-indigo-700' :
                        item.contentType === 'Graphics' ? 'bg-teal-50 text-teal-700' : 'bg-pink-50 text-pink-700'
                      }`}>
                        {item.contentType}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-xs text-slate-500">{item.scheduledDate}</td>
                    <td className="p-4">
                      <select
                        value={item.status}
                        onChange={(e) => handleStatusShift(item.id, e.target.value as ContentStatus)}
                        className="text-xs font-semibold bg-white border border-slate-200 rounded px-2.5 py-1.5 shadow-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Briefing">Briefing</option>
                        <option value="Editing">Editing</option>
                        <option value="Client Review">Client Review</option>
                        <option value="Scheduled">Scheduled</option>
                        <option value="Posted">Posted</option>
                      </select>
                    </td>
                    <td className="p-4 pr-6">
                      <a
                        href={item.referenceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-blue-600 font-medium hover:underline flex items-center gap-1"
                      >
                        Asset Node ↗
                      </a>
                    </td>
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
