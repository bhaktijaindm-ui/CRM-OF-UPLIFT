'use client';

import { useCRM } from '../components/SharedStateContext';

export default function EmployeeDashboard() {
  const { employees, content } = useCRM();

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Employee Operations Engine</h2>
        <p className="text-sm text-slate-500">Live operational velocity and task compliance vectors.</p>
      </div>

      {/* KPI Blocks */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {['Marketing', 'Technology', 'Sales'].map((dept) => {
          const count = employees.filter(e => e.department === dept).length;
          const items = content.filter(c => employees.find(e => e.id === c.assignedEmployeeId)?.department === dept);
          const pending = items.filter(i => i.status !== 'Posted').length;

          return (
            <div key={dept} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{dept} Division</span>
                <div className="text-3xl font-bold text-slate-900 mt-2">{count} Active Fulfillers</div>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>In-Flight Content: <strong>{items.length}</strong></span>
                <span className="text-blue-600">Uncompleted: {pending}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Master Employee Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 bg-slate-50/50">
          <h3 className="font-semibold text-slate-900">Personnel Efficiency Ledger</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <th className="p-4 pl-6">Resource</th>
                <th className="p-4">Department</th>
                <th className="p-4">Assigned Tasks Count</th>
                <th className="p-4">Completion Progress (Monthly Goal)</th>
                <th className="p-4 pr-6 text-right">System Operational Load</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {employees.map((emp) => {
                const assigned = content.filter(c => c.assignedEmployeeId === emp.id);
                const completedCount = assigned.filter(c => c.status === 'Posted' || c.status === 'Scheduled').length;
                const progressPct = Math.min(100, Math.round((completedCount / emp.goals.monthlyTarget) * 100));

                return (
                  <tr key={emp.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-4 pl-6 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
                        {emp.avatar}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900">{emp.name}</div>
                        <div className="text-xs text-slate-400">{emp.email}</div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        emp.department === 'Marketing' ? 'bg-purple-50 text-purple-700 border border-purple-100' :
                        emp.department === 'Technology' ? 'bg-cyan-50 text-cyan-700 border border-cyan-100' :
                        'bg-amber-50 text-amber-700 border border-amber-100'
                      }`}>
                        {emp.department}
                      </span>
                    </td>
                    <td className="p-4 font-medium text-slate-700">{assigned.length} Managed Items</td>
                    <td className="p-4">
                      <div className="w-full space-y-1.5">
                        <div className="flex justify-between text-xs font-medium text-slate-500">
                          <span>{completedCount} / {emp.goals.monthlyTarget} Target Units</span>
                          <span>{progressPct}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div className="bg-blue-600 h-2 rounded-full transition-all duration-500" style={{ width: `${progressPct}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <span className={`text-xs font-semibold px-2 py-1 rounded ${
                        assigned.length > 2 ? 'bg-rose-50 text-rose-700 border border-rose-100' : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                      }`}>
                        {assigned.length > 2 ? 'High Velocity' : 'Optimal Capacity'}
                      </span>
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
