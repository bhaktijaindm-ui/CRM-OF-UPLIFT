'use client';

import { useCRM } from '../../components/SharedStateContext';

export default function ClientsDashboard() {
  const { clients, content } = useCRM();

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Client Strategic Assets Portfolio</h2>
        <p className="text-sm text-slate-500">Corporate profiles, integration parameters, and package tracking.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {clients.map((client) => {
          const clientContent = content.filter(c => c.clientId === client.id);

          return (
            <div key={client.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between">
              <div className="p-6 border-b border-slate-100 bg-slate-50/40 flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{client.companyName}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Primary Liaison: {client.contactPerson}</p>
                </div>
                <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                  {client.status}
                </span>
              </div>

              <div className="p-6 space-y-4 flex-1 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">Contact Topology</span>
                    <p className="text-slate-700 font-medium mt-1">{client.email}</p>
                    <p className="text-xs text-slate-500">{client.phone}</p>
                  </div>
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">Operational Vector</span>
                    <p className="text-slate-700 font-medium mt-1 truncate">{client.address}</p>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-900 text-slate-100 rounded-lg font-mono text-xs space-y-1.5 border border-slate-800">
                  <span className="text-[10px] text-blue-400 uppercase tracking-wider block font-sans font-bold">Secure Access Environment</span>
                  <div className="truncate text-slate-300">{client.accessCredentialsDetails}</div>
                </div>

                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">Assigned Service Tier</span>
                  <p className="text-slate-800 font-medium mt-0.5">{client.packageDetails}</p>
                </div>
              </div>

              <div className="p-4 border-t border-slate-100 bg-slate-50/50 px-6 flex justify-between items-center text-xs text-slate-500">
                <span>Active Production Footprint: <strong>{clientContent.length} Deliverables</strong></span>
                <span className="font-semibold text-blue-600">
                  Pipeline: {clientContent.filter(c => c.status !== 'Posted').length} pending
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
