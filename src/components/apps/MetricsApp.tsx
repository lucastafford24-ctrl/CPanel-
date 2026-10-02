import React, { useState } from 'react';
import { VisitorLog, ServerStats } from '../../types/cpanel';
import { 
  Activity, 
  Users, 
  Gauge, 
  HardDrive, 
  Cpu, 
  X, 
  DownloadCloud, 
  RefreshCw,
  Search,
  Filter
} from 'lucide-react';

interface MetricsAppProps {
  stats: ServerStats;
  logs: VisitorLog[];
  onClose: () => void;
}

export const MetricsApp: React.FC<MetricsAppProps> = ({
  stats,
  logs,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'bandwidth' | 'visitors' | 'resource'>('bandwidth');
  const [logFilter, setLogFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredLogs = logs.filter(l => {
    const matchesQuery = l.ip.includes(logFilter) || l.url.toLowerCase().includes(logFilter.toLowerCase()) || l.userAgent.toLowerCase().includes(logFilter.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || String(l.status) === statusFilter;
    return matchesQuery && matchesStatus;
  });

  return (
    <div className="bg-white dark:bg-[#0f172a] rounded-lg border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col h-[82vh] overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 bg-slate-800 text-white flex items-center justify-between border-b border-slate-700">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-[#ff6c2c]" />
          <h2 className="text-sm font-semibold">Metrics, Logs & Resource Usage</h2>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-700">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Tabs */}
      <div className="px-4 py-2 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2 text-xs">
        <button
          onClick={() => setActiveTab('bandwidth')}
          className={`px-3 py-1.5 rounded font-medium transition-colors ${
            activeTab === 'bandwidth' ? 'bg-[#ff6c2c] text-white shadow-xs' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
          }`}
        >
          Bandwidth Analytics
        </button>
        <button
          onClick={() => setActiveTab('visitors')}
          className={`px-3 py-1.5 rounded font-medium transition-colors ${
            activeTab === 'visitors' ? 'bg-[#ff6c2c] text-white shadow-xs' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
          }`}
        >
          Latest Visitors Log
        </button>
        <button
          onClick={() => setActiveTab('resource')}
          className={`px-3 py-1.5 rounded font-medium transition-colors ${
            activeTab === 'resource' ? 'bg-[#ff6c2c] text-white shadow-xs' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
          }`}
        >
          CloudLinux Resource Monitors
        </button>
      </div>

      {/* Main Tab Content */}
      <div className="flex-1 overflow-y-auto p-5 text-xs">
        {activeTab === 'bandwidth' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Monthly Bandwidth Consumption
                </h3>
                <p className="text-xs text-slate-500">
                  Total bandwidth utilized this billing period: <strong>{stats.bandwidthUsedGb} GB</strong> of {stats.bandwidthTotalGb} GB quota.
                </p>
              </div>
              <span className="font-mono text-xs px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded border border-slate-200 dark:border-slate-700">
                Billing Cycle: Oct 1 - Oct 31, 2026
              </span>
            </div>

            {/* SVG Visual Chart */}
            <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-lg border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Traffic breakdown over past 7 days (GB/day)</span>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#ff6c2c]"></span> HTTP</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Mail (IMAP/SMTP)</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> FTP</span>
                </div>
              </div>

              {/* Bar Chart Simulation */}
              <div className="h-44 flex items-end justify-between gap-3 pt-4 border-b border-slate-200 dark:border-slate-700 px-2">
                {[
                  { day: 'Sep 26', http: 1.4, mail: 0.3, ftp: 0.1 },
                  { day: 'Sep 27', http: 1.8, mail: 0.4, ftp: 0.2 },
                  { day: 'Sep 28', http: 2.2, mail: 0.5, ftp: 0.1 },
                  { day: 'Sep 29', http: 1.9, mail: 0.3, ftp: 0.05 },
                  { day: 'Sep 30', http: 2.7, mail: 0.6, ftp: 0.3 },
                  { day: 'Oct 01', http: 2.1, mail: 0.4, ftp: 0.1 },
                  { day: 'Oct 02', http: 1.6, mail: 0.3, ftp: 0.1 },
                ].map(col => {
                  const total = col.http + col.mail + col.ftp;
                  const heightPct = Math.round((total / 4) * 100);

                  return (
                    <div key={col.day} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group">
                      <div className="text-[10px] font-mono text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                        {total.toFixed(1)}G
                      </div>
                      <div className="w-full max-w-[42px] bg-slate-200 dark:bg-slate-700 rounded-t-md overflow-hidden flex flex-col-reverse transition-all duration-300" style={{ height: `${heightPct}%` }}>
                        <div className="bg-[#ff6c2c]" style={{ height: `${(col.http / total) * 100}%` }} title={`HTTP: ${col.http} GB`} />
                        <div className="bg-blue-500" style={{ height: `${(col.mail / total) * 100}%` }} title={`Mail: ${col.mail} GB`} />
                        <div className="bg-emerald-500" style={{ height: `${(col.ftp / total) * 100}%` }} title={`FTP: ${col.ftp} GB`} />
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono mt-1">{col.day}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Protocol breakdown table */}
            <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 uppercase text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                  <tr>
                    <th className="py-2.5 px-4">Protocol</th>
                    <th className="py-2.5 px-4 font-mono text-right">Transfer (GB)</th>
                    <th className="py-2.5 px-4 font-mono text-right">% of Usage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-xs">
                  <tr>
                    <td className="py-2.5 px-4 font-sans font-medium text-slate-800 dark:text-slate-200">HTTP Web Traffic</td>
                    <td className="py-2.5 px-4 text-right tabular-nums">11.4 GB</td>
                    <td className="py-2.5 px-4 text-right tabular-nums text-emerald-600">80.2%</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 font-sans font-medium text-slate-800 dark:text-slate-200">Mail (IMAP / POP3 / SMTP)</td>
                    <td className="py-2.5 px-4 text-right tabular-nums">2.3 GB</td>
                    <td className="py-2.5 px-4 text-right tabular-nums text-blue-600">16.2%</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 font-sans font-medium text-slate-800 dark:text-slate-200">FTP File Transfers</td>
                    <td className="py-2.5 px-4 text-right tabular-nums">0.5 GB</td>
                    <td className="py-2.5 px-4 text-right tabular-nums text-amber-600">3.6%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'visitors' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Real-Time Apache Access Log (Latest Visitors)
                </h3>
                <p className="text-xs text-slate-500">
                  Showing HTTP requests logged on example-corp.com
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search IP, URL..."
                    value={logFilter}
                    onChange={(e) => setLogFilter(e.target.value)}
                    className="pl-8 pr-3 py-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-xs focus:outline-none"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-2 py-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-xs"
                >
                  <option value="ALL">All Status</option>
                  <option value="200">200 OK</option>
                  <option value="302">302 Redirect</option>
                  <option value="404">404 Not Found</option>
                </select>
              </div>
            </div>

            <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-x-auto shadow-2xs">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-[11px] uppercase font-semibold text-slate-500 sticky top-0">
                  <tr>
                    <th className="py-2 px-3 font-mono">IP Address</th>
                    <th className="py-2 px-3">Timestamp</th>
                    <th className="py-2 px-3 font-mono text-center">Method</th>
                    <th className="py-2 px-3 font-mono">URL Path</th>
                    <th className="py-2 px-3 font-mono text-center">Status</th>
                    <th className="py-2 px-3 font-mono text-right">Bytes</th>
                    <th className="py-2 px-3">User Agent</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-[11px]">
                  {filteredLogs.map(log => (
                    <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-2 px-3 font-bold text-slate-800 dark:text-slate-200">{log.ip}</td>
                      <td className="py-2 px-3 text-slate-500 whitespace-nowrap">{log.timestamp}</td>
                      <td className="py-2 px-3 text-center">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${log.method === 'GET' ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'}`}>
                          {log.method}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-[#ff6c2c] max-w-xs truncate">{log.url}</td>
                      <td className="py-2 px-3 text-center">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${log.status === 200 ? 'text-emerald-600' : log.status === 404 ? 'text-rose-600' : 'text-amber-600'}`}>
                          {log.status}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-right tabular-nums text-slate-500">{log.bytes}</td>
                      <td className="py-2 px-3 text-slate-400 max-w-xs truncate font-sans text-xs">{log.userAgent}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'resource' && (
          <div className="space-y-5">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                CloudLinux LVE Resource Usage
              </h3>
              <p className="text-xs text-slate-500">
                Your site has not exceeded any resource limits in the last 24 hours. Status: <strong>NORMAL</strong>
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 space-y-2">
                <span className="font-semibold text-slate-700 dark:text-slate-300 block">CPU Usage</span>
                <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                  {stats.cpuPercent}%
                </div>
                <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500" style={{ width: `${stats.cpuPercent}%` }} />
                </div>
                <span className="text-[10px] text-slate-400">Limit: 100% of 1 CPU Core</span>
              </div>

              <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 space-y-2">
                <span className="font-semibold text-slate-700 dark:text-slate-300 block">Physical Memory (RAM)</span>
                <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                  {(stats.memoryUsedMb / 1024).toFixed(2)} GB
                </div>
                <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500" style={{ width: `${(stats.memoryUsedMb / stats.memoryTotalMb) * 100}%` }} />
                </div>
                <span className="text-[10px] text-slate-400">Limit: {(stats.memoryTotalMb / 1024).toFixed(0)} GB</span>
              </div>

              <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 space-y-2">
                <span className="font-semibold text-slate-700 dark:text-slate-300 block">I/O Usage</span>
                <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                  {stats.ioUsageKbps} KB/s
                </div>
                <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500" style={{ width: `${(stats.ioUsageKbps / stats.ioLimitKbps) * 100}%` }} />
                </div>
                <span className="text-[10px] text-slate-400">Limit: {stats.ioLimitKbps} KB/s</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
