import React, { useState } from 'react';
import { 
  ServerStats 
} from '../types/cpanel';
import { 
  HardDrive, 
  Cpu, 
  Activity, 
  Mail, 
  Globe, 
  Database, 
  FileStack, 
  Gauge, 
  ExternalLink,
  Info,
  Server,
  X
} from 'lucide-react';

interface StatsPanelProps {
  stats: ServerStats;
  isOpen: boolean;
  onClose: () => void;
  onNavigateToMetrics: () => void;
}

export const StatsPanel: React.FC<StatsPanelProps> = ({
  stats,
  isOpen,
  onClose,
  onNavigateToMetrics
}) => {
  const [activeTab, setActiveTab] = useState<'info' | 'stats'>('stats');
  const [showServerDetailsModal, setShowServerDetailsModal] = useState(false);

  if (!isOpen) return null;

  // Percentage calculations
  const diskPercent = Math.min(100, Math.round((stats.diskUsedGb / stats.diskTotalGb) * 100));
  const bandwidthPercent = Math.min(100, Math.round((stats.bandwidthUsedGb / stats.bandwidthTotalGb) * 100));
  const memoryPercent = Math.min(100, Math.round((stats.memoryUsedMb / stats.memoryTotalMb) * 100));
  const inodePercent = Math.min(100, Math.round((stats.inodesUsed / stats.inodesMax) * 100));

  const getMeterColor = (pct: number) => {
    if (pct > 85) return 'bg-rose-500';
    if (pct > 65) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  return (
    <aside className="w-80 h-[calc(100vh-3.5rem)] sticky top-14 bg-white dark:bg-[#0f172a] border-l border-slate-200 dark:border-slate-800 flex flex-col z-20 shadow-sm overflow-hidden select-none">
      {/* Top Header / Switcher */}
      <div className="p-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/60">
        <div className="flex items-center gap-1 bg-slate-200 dark:bg-slate-800 p-0.5 rounded-lg text-xs">
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-3 py-1 font-medium rounded-md transition-colors ${
              activeTab === 'stats'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Statistics
          </button>
          <button
            onClick={() => setActiveTab('info')}
            className={`px-3 py-1 font-medium rounded-md transition-colors ${
              activeTab === 'info'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            General Info
          </button>
        </div>

        <button
          onClick={onClose}
          className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800"
          title="Close panel"
          aria-label="Close panel"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {activeTab === 'stats' ? (
          <>
            {/* Statistics Section */}
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
                Resource Usage
              </span>
              <button 
                onClick={onNavigateToMetrics}
                className="text-[#ff6c2c] hover:underline text-[11px] font-medium"
              >
                View Full Metrics
              </button>
            </div>

            {/* Disk Usage Gauge */}
            <div className="space-y-1.5 p-2.5 rounded-md bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                <span className="flex items-center gap-1.5 font-medium">
                  <HardDrive className="w-3.5 h-3.5 text-slate-400" />
                  Disk Usage
                </span>
                <span className="font-mono tabular-nums text-slate-500 dark:text-slate-400">
                  {stats.diskUsedGb.toFixed(2)} GB / {stats.diskTotalGb.toFixed(0)} GB
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 rounded-full ${getMeterColor(diskPercent)}`}
                  style={{ width: `${diskPercent}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>{diskPercent}% utilized</span>
                <span>{(stats.diskTotalGb - stats.diskUsedGb).toFixed(2)} GB free</span>
              </div>
            </div>

            {/* Bandwidth Usage */}
            <div className="space-y-1.5 p-2.5 rounded-md bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                <span className="flex items-center gap-1.5 font-medium">
                  <Activity className="w-3.5 h-3.5 text-slate-400" />
                  Monthly Bandwidth
                </span>
                <span className="font-mono tabular-nums text-slate-500 dark:text-slate-400">
                  {stats.bandwidthUsedGb.toFixed(1)} GB / {stats.bandwidthTotalGb} GB
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 rounded-full ${getMeterColor(bandwidthPercent)}`}
                  style={{ width: `${bandwidthPercent}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>{bandwidthPercent}% of quota</span>
                <span>{(stats.bandwidthTotalGb - stats.bandwidthUsedGb).toFixed(1)} GB remaining</span>
              </div>
            </div>

            {/* Inodes Usage */}
            <div className="space-y-1.5 p-2.5 rounded-md bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                <span className="flex items-center gap-1.5 font-medium">
                  <FileStack className="w-3.5 h-3.5 text-slate-400" />
                  File Usage (Inodes)
                </span>
                <span className="font-mono tabular-nums text-slate-500 dark:text-slate-400">
                  {stats.inodesUsed.toLocaleString()} / {stats.inodesMax.toLocaleString()}
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 rounded-full ${getMeterColor(inodePercent)}`}
                  style={{ width: `${inodePercent}%` }}
                />
              </div>
            </div>

            {/* Physical Memory */}
            <div className="space-y-1.5 p-2.5 rounded-md bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                <span className="flex items-center gap-1.5 font-medium">
                  <Cpu className="w-3.5 h-3.5 text-slate-400" />
                  Physical Memory
                </span>
                <span className="font-mono tabular-nums text-slate-500 dark:text-slate-400">
                  {(stats.memoryUsedMb / 1024).toFixed(2)} GB / {(stats.memoryTotalMb / 1024).toFixed(0)} GB
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 rounded-full ${getMeterColor(memoryPercent)}`}
                  style={{ width: `${memoryPercent}%` }}
                />
              </div>
            </div>

            {/* CPU & Processes Key-Values */}
            <div className="border-t border-slate-200 dark:border-slate-800 pt-3 space-y-2">
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                <span className="text-slate-500 dark:text-slate-400">CPU Usage</span>
                <span className="font-mono font-medium text-slate-800 dark:text-slate-200 tabular-nums">
                  {stats.cpuPercent}% / 100%
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                <span className="text-slate-500 dark:text-slate-400">MySQL Disk Usage</span>
                <span className="font-mono font-medium text-slate-800 dark:text-slate-200 tabular-nums">
                  {stats.mysqlDiskUsedMb} MB
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                <span className="text-slate-500 dark:text-slate-400">Email Accounts</span>
                <span className="font-mono font-medium text-slate-800 dark:text-slate-200 tabular-nums">
                  {stats.emailAccountsCount} / {stats.emailAccountsMax}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                <span className="text-slate-500 dark:text-slate-400">Subdomains</span>
                <span className="font-mono font-medium text-slate-800 dark:text-slate-200 tabular-nums">
                  {stats.subdomainsCount} / {stats.subdomainsMax}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                <span className="text-slate-500 dark:text-slate-400">Addon Domains</span>
                <span className="font-mono font-medium text-slate-800 dark:text-slate-200 tabular-nums">
                  {stats.addonDomainsCount} / {stats.addonDomainsMax}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                <span className="text-slate-500 dark:text-slate-400">Entry Processes</span>
                <span className="font-mono font-medium text-slate-800 dark:text-slate-200 tabular-nums">
                  {stats.entryProcessesUsed} / {stats.entryProcessesMax}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500 dark:text-slate-400">I/O Usage</span>
                <span className="font-mono font-medium text-slate-800 dark:text-slate-200 tabular-nums">
                  {stats.ioUsageKbps} KB/s / {stats.ioLimitKbps} KB/s
                </span>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* General Information Section */}
            <div className="space-y-3">
              <span className="font-semibold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] block">
                Server Specifications
              </span>

              <div className="space-y-2.5">
                <div>
                  <span className="text-slate-400 block text-[11px]">Current User</span>
                  <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">{stats.currentUser}</span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[11px]">Primary Domain</span>
                  <a 
                    href={`https://${stats.primaryDomain}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="font-mono text-[#ff6c2c] hover:underline flex items-center gap-1 font-medium"
                  >
                    <span>{stats.primaryDomain}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div>
                  <span className="text-slate-400 block text-[11px]">Shared IP Address</span>
                  <span className="font-mono text-slate-800 dark:text-slate-200">{stats.sharedIp}</span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[11px]">Home Directory</span>
                  <span className="font-mono text-slate-800 dark:text-slate-200 text-[11px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                    {stats.homeDir}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[11px]">Last Login</span>
                  <span className="text-slate-600 dark:text-slate-400 text-[11px]">{stats.lastLogin}</span>
                </div>

                <div className="border-t border-slate-200 dark:border-slate-800 pt-2 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">cPanel Version</span>
                    <span className="font-mono text-slate-800 dark:text-slate-200">{stats.cpanelVersion}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Apache Version</span>
                    <span className="font-mono text-slate-800 dark:text-slate-200">{stats.apacheVersion}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">PHP Version</span>
                    <span className="font-mono text-slate-800 dark:text-slate-200">{stats.phpVersion}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">MySQL Version</span>
                    <span className="font-mono text-slate-800 dark:text-slate-200">{stats.mysqlVersion}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Architecture</span>
                    <span className="font-mono text-slate-800 dark:text-slate-200">{stats.architecture}</span>
                  </div>
                </div>

                <button
                  onClick={() => setShowServerDetailsModal(true)}
                  className="w-full mt-3 py-1.5 px-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded text-center font-medium transition-colors"
                >
                  Server Information Details
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Server Details Modal */}
      {showServerDetailsModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 rounded-lg max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="px-4 py-3 bg-slate-800 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-[#ff6c2c]" />
                <h3 className="text-sm font-semibold">Server Information</h3>
              </div>
              <button 
                onClick={() => setShowServerDetailsModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 space-y-3 text-xs max-h-[70vh] overflow-y-auto">
              <table className="w-full border-collapse">
                <tbody>
                  <tr className="border-b border-slate-100 dark:border-slate-800">
                    <td className="py-2 text-slate-500 font-medium">Server Name</td>
                    <td className="py-2 font-mono text-right">{stats.serverName}</td>
                  </tr>
                  <tr className="border-b border-slate-100 dark:border-slate-800">
                    <td className="py-2 text-slate-500 font-medium">Operating System</td>
                    <td className="py-2 font-mono text-right">{stats.os}</td>
                  </tr>
                  <tr className="border-b border-slate-100 dark:border-slate-800">
                    <td className="py-2 text-slate-500 font-medium">cPanel Version</td>
                    <td className="py-2 font-mono text-right">{stats.cpanelVersion}</td>
                  </tr>
                  <tr className="border-b border-slate-100 dark:border-slate-800">
                    <td className="py-2 text-slate-500 font-medium">Apache Version</td>
                    <td className="py-2 font-mono text-right">{stats.apacheVersion}</td>
                  </tr>
                  <tr className="border-b border-slate-100 dark:border-slate-800">
                    <td className="py-2 text-slate-500 font-medium">PHP Version</td>
                    <td className="py-2 font-mono text-right">{stats.phpVersion}</td>
                  </tr>
                  <tr className="border-b border-slate-100 dark:border-slate-800">
                    <td className="py-2 text-slate-500 font-medium">MySQL Version</td>
                    <td className="py-2 font-mono text-right">{stats.mysqlVersion}</td>
                  </tr>
                  <tr className="border-b border-slate-100 dark:border-slate-800">
                    <td className="py-2 text-slate-500 font-medium">Architecture</td>
                    <td className="py-2 font-mono text-right">{stats.architecture}</td>
                  </tr>
                  <tr className="border-b border-slate-100 dark:border-slate-800">
                    <td className="py-2 text-slate-500 font-medium">Path to Sendmail</td>
                    <td className="py-2 font-mono text-right">{stats.sendmailPath}</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-slate-500 font-medium">Path to Perl</td>
                    <td className="py-2 font-mono text-right">{stats.perlPath}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 text-right">
              <button
                onClick={() => setShowServerDetailsModal(false)}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
