import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import { AlertCircle, AlertTriangle, Clock, Filter, Activity } from 'lucide-react';
import API_URL from '../config';

const AlertsHistory = () => {
  const [filter, setFilter] = useState('all');
  const [alerts, setAlerts] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlertsData = async () => {
      try {
        const response = await fetch(`${API_URL}/alerts`);
        const data = await response.json();
        setAlerts(data.alerts || []);
        setHistory(data.history || []);
      } catch (error) {
        console.error("Failed to fetch alerts from backend:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAlertsData();
  }, []);

  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'all') return true;
    return alert.severity === filter;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
          Alerts & Maintenance History
        </h1>
        
        <div className="flex items-center space-x-3 bg-navy/40 px-3 py-1.5 rounded-lg border border-glass-border backdrop-blur-sm">
          <Filter size={16} className="text-slate-400" />
          <select 
            className="bg-transparent text-sm text-slate-300 focus:outline-none cursor-pointer"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all" className="bg-navy text-white">All Severities</option>
            <option value="critical" className="bg-navy text-white">Critical Only</option>
            <option value="warning" className="bg-navy text-white">Warning Only</option>
          </select>
        </div>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto max-h-[600px]">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 z-10">
              <tr className="bg-navy-light/95 border-b border-glass-border backdrop-blur-md">
                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-slate-400 uppercase">Alert ID</th>
                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-slate-400 uppercase">Machine</th>
                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-slate-400 uppercase">Issue Description</th>
                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-slate-400 uppercase flex items-center gap-2"><Clock size={14}/> Timeline</th>
                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-slate-400 uppercase">Severity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-glass-border/50">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-sm text-slate-500">
                    Loading telemetry models...
                  </td>
                </tr>
              ) : filteredAlerts.length > 0 ? (
                filteredAlerts.map((alert) => (
                  <tr 
                    key={alert.id} 
                    className="hover:bg-white/[0.02] transition-colors duration-200 group"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{alert.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white flex items-center gap-2">
                       <Activity size={14} className="text-electric-blue opacity-0 group-hover:opacity-100 transition-opacity" />
                       {alert.machineId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{alert.issue}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">{alert.timestamp}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${
                        alert.severity === 'critical' 
                          ? 'bg-red-500/10 text-red-400 border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.2)]' 
                          : 'bg-orange-500/10 text-orange-400 border-orange-500/20 shadow-[0_0_10px_rgba(249,115,22,0.2)]'
                      }`}>
                        {alert.severity === 'critical' ? (
                          <AlertCircle size={14} className="mr-1.5" />
                        ) : (
                          <AlertTriangle size={14} className="mr-1.5" />
                        )}
                        {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-sm text-slate-500">
                    No alerts found for the selected filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
      
      {/* Visual Timeline element simulation */}
      <div className="mt-8">
         <h3 className="text-lg font-semibold text-white mb-4">Latest Dataset Telemetry Records</h3>
         <div className="relative border-l border-glass-border ml-3 space-y-6">
            {loading ? (
               <p className="text-sm text-slate-500 pl-6">Loading...</p>
            ) : (
               history.map((event, i) => (
                 <div key={i} className="relative pl-6">
                   <span className={`absolute left-[-5px] top-1.5 h-2.5 w-2.5 rounded-full ${
                     event.status === 'critical' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]' 
                     : 'bg-electric-blue shadow-[0_0_8px_rgba(0,210,255,0.8)]'
                   }`}></span>
                   <p className="text-sm font-medium text-white">{event.message}</p>
                   <p className="text-xs text-slate-400 mt-1">{event.time}</p>
                 </div>
               ))
            )}
         </div>
      </div>
    </div>
  );
};

export default AlertsHistory;
