'use client';

import { useCRM } from '../../components/SharedStateContext';

export default function ReportsDashboard() {
  const { employees, content } = useCRM();

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">System Auditing & Productivity Ledger</h2>
        <p className="text-sm text-slate-500">Cross-referencing production output metrics against client feedback loops.</p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {employees.map((emp) => {
          const personalPool = content.filter(c => c.assignedEmployeeId === emp.id);
          const postedItems = personalPool.filter(c => c.status === 'Posted' || c.status === 'Scheduled');
          const operationalScore = personalPool.length > 0 
            ? Math.round((postedItems.length / personalPool.length) * 100) 
            : 100;

          // Track aggregate client review vectors
          const itemsWithReviews = personalPool.filter(c => c.customerReviewRating !== undefined);
          const averageReview = itemsWithReviews.length > 0
            ? (itemsWithReviews.reduce((acc, curr) => acc + (curr.customerReviewRating || 0), 0) / itemsWithReviews.length).toFixed(1)
            : 'No reviews logged';

          return (
            <div key={emp.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-4 border-b border-slate-100 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 text-white font-bold text-sm flex items-center justify-center">
                    {emp.avatar}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{emp.name}</h3>
                    <p className="text-xs text-slate-400">{emp.department} Strategy Unit</p>
                  </div>
                </div>
                <div className="flex gap-6 text-left">
                  <div className="bg-slate-50 px-4 py-2 rounded-lg border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Compliance</span>
                    <span className="text-lg font-bold text-slate-800">{operationalScore}%</span>
                  </div>
                  <div className="bg-slate-50 px-4 py-2 rounded-lg border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Client Score</span>
                    <span className="text-lg font-bold text-blue-600">{averageReview} {typeof averageReview === 'number' || !isNaN(Number(averageReview)) ? '★' : ''}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Active Production Audit Trail</h4>
                {personalPool.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No assigned assets currently in queue.</p>
                ) : (
                  <div className="space-y-2.5">
                    {personalPool.map(item => (
                      <div key={item.id} className="flex justify-between items-center p-3 rounded-lg bg-slate-50 text-xs border border-slate-200/60">
                        <div className="space-y-0.5 max-w-md">
                          <p className="font-semibold text-slate-800">{item.taskName}</p>
                          <p className="text-slate-400 font-mono text-[11px]">Due Dispatch Window: {item.scheduledDate}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-medium text-slate-500">Format: {item.contentType}</span>
                          <span className={`px-2 py-0.5 font-bold rounded text-[10px] uppercase ${
                            item.status === 'Posted' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-blue-50 text-blue-700 border border-blue-100'
                          }`}>
                            {item.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
