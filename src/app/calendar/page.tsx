'use client';

import { useCRM } from '../../components/SharedStateContext';

export default function CalendarDashboard() {
  const { content, clients } = useCRM();

  // Look-forward calendar window around early May 2026 targets
  const structuralDays = ['2026-05-24', '2026-05-25', '2026-05-26', '2026-05-27', '2026-05-28', '2026-05-29'];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Synchronized Media Dispatch Calendar</h2>
        <p className="text-sm text-slate-500">Automated scheduling engine. Changes in pipeline sync here automatically.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {structuralDays.map((dateString) => {
          const itemsOnThisDay = content.filter(c => c.scheduledDate === dateString);
          const dateInstance = new Date(dateString);
          const dayLabel = dateInstance.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });

          return (
            <div key={dateString} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col min-h-[220px]">
              <div className="pb-3 border-b border-slate-100 flex justify-between items-center">
                <span className="font-bold text-slate-800 text-sm">{dayLabel}</span>
                <span className="text-[10px] font-mono tracking-wider bg-slate-100 px-2 py-0.5 rounded text-slate-500">
                  {dateString}
                </span>
              </div>

              <div className="mt-4 flex-1 space-y-3 overflow-y-auto">
                {itemsOnThisDay.length === 0 ? (
                  <div className="text-xs text-slate-400 italic pt-8 text-center">No campaigns slotted for deployment.</div>
                ) : (
                  itemsOnThisDay.map(item => {
                    const client = clients.find(c => c.id === item.clientId);
                    return (
                      <div key={item.id} className="p-3 rounded-lg border border-blue-100 bg-gradient-to-br from-blue-50/50 to-white space-y-1">
                        <div className="flex justify-between items-start gap-2">
                          <span className="font-semibold text-slate-900 text-xs line-clamp-1">{item.taskName}</span>
                          <span className={`text-[9px] uppercase font-extrabold px-1.5 py-0.5 rounded shrink-0 ${
                            item.status === 'Posted' ? 'bg-emerald-100 text-emerald-800' :
                            item.status === 'Scheduled' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {item.status}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 font-medium">Account: {client?.companyName}</div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
