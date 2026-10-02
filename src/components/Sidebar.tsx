import React from 'react';
import { 
  LayoutDashboard, 
  Box, 
  FolderTree, 
  Database, 
  Layers, 
  Mail, 
  Network, 
  TerminalSquare, 
  Activity, 
  ShieldCheck, 
  Clock, 
  Sliders,
  ChevronLeft,
  ChevronRight,
  Server,
  Inbox
} from 'lucide-react';
import { ActiveApp } from '../types/cpanel';

interface SidebarProps {
  activeApp: ActiveApp;
  onNavigate: (app: ActiveApp) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeApp,
  onNavigate,
  isCollapsed,
  onToggleCollapse
}) => {
  const navItems = [
    { id: 'dashboard' as ActiveApp, label: 'Tools', icon: LayoutDashboard },
    { id: 'wordpress' as ActiveApp, label: 'WordPress Toolkit', icon: Box, highlight: true },
    { id: 'file-manager' as ActiveApp, label: 'File Manager', icon: FolderTree },
    { id: 'phpmyadmin' as ActiveApp, label: 'phpMyAdmin', icon: Database },
    { id: 'mysql' as ActiveApp, label: 'MySQL® Databases', icon: Layers },
    { id: 'email-accounts' as ActiveApp, label: 'Email Accounts', icon: Mail },
    { id: 'webmail' as ActiveApp, label: 'Webmail Client', icon: Inbox },
    { id: 'zone-editor' as ActiveApp, label: 'Zone Editor (DNS)', icon: Network },
    { id: 'terminal' as ActiveApp, label: 'Terminal (SSH)', icon: TerminalSquare },
    { id: 'metrics' as ActiveApp, label: 'Metrics & Bandwidth', icon: Activity },
    { id: 'ssl-tls' as ActiveApp, label: 'SSL/TLS Status', icon: ShieldCheck },
    { id: 'cron-jobs' as ActiveApp, label: 'Cron Jobs', icon: Clock },
    { id: 'php-selector' as ActiveApp, label: 'MultiPHP Manager', icon: Sliders },
  ];

  return (
    <aside 
      className={`h-[calc(100vh-3.5rem)] sticky top-14 bg-white dark:bg-[#0f172a] border-r border-slate-200 dark:border-slate-800 flex flex-col transition-all duration-200 z-30 select-none ${
        isCollapsed ? 'w-14' : 'w-60'
      }`}
    >
      {/* Sidebar Header / Category Label */}
      <div className="px-3 py-3 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
        {!isCollapsed ? (
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-[#ff6c2c]" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              cPanel Jupiter
            </span>
          </div>
        ) : (
          <Server className="w-5 h-5 text-[#ff6c2c] mx-auto" />
        )}
      </div>

      {/* Nav Link List */}
      <nav className="flex-1 overflow-y-auto py-2 px-2 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeApp === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              title={isCollapsed ? item.label : undefined}
              className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-md text-xs font-medium transition-all text-left group ${
                isActive
                  ? 'bg-[#ff6c2c] text-white shadow-sm font-semibold'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Icon 
                className={`w-4 h-4 shrink-0 transition-transform ${
                  isActive ? 'text-white' : item.highlight ? 'text-[#ff6c2c]' : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200'
                }`} 
              />
              {!isCollapsed && (
                <span className="truncate flex-1">
                  {item.label}
                </span>
              )}
              {!isCollapsed && item.highlight && !isActive && (
                <span className="text-[10px] bg-orange-100 dark:bg-orange-950/60 text-[#ff6c2c] px-1.5 py-0.5 rounded font-bold uppercase">
                  WP
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Collapse Toggle Footer */}
      <div className="p-2 border-t border-slate-100 dark:border-slate-800">
        <button
          onClick={onToggleCollapse}
          className="w-full flex items-center justify-center p-2 rounded-md text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <div className="flex items-center gap-2 text-xs font-medium">
              <ChevronLeft className="w-4 h-4" />
              <span>Collapse Sidebar</span>
            </div>
          )}
        </button>
      </div>
    </aside>
  );
};
