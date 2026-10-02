import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Bell, 
  User, 
  ChevronDown, 
  LayoutGrid, 
  Moon, 
  Sun, 
  LogOut, 
  Key, 
  Sliders, 
  PanelRightOpen, 
  PanelRightClose,
  Shield,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  Home
} from 'lucide-react';
import { ActiveApp, SystemNotification } from '../types/cpanel';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  activeApp: ActiveApp;
  onNavigate: (app: ActiveApp) => void;
  isStatsOpen: boolean;
  onToggleStats: () => void;
  notifications: SystemNotification[];
  onOpenNotifications: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  currentUser: string;
  serverName: string;
  onOpenPasswordModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  activeApp,
  onNavigate,
  isStatsOpen,
  onToggleStats,
  notifications,
  onOpenNotifications,
  isDarkMode,
  onToggleDarkMode,
  currentUser,
  serverName,
  onOpenPasswordModal
}) => {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [quickLaunchOpen, setQuickLaunchOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const quickLaunchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Keyboard shortcut Ctrl+K or / to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
      if (quickLaunchRef.current && !quickLaunchRef.current.contains(e.target as Node)) {
        setQuickLaunchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getAppName = (app: ActiveApp) => {
    switch (app) {
      case 'file-manager': return 'File Manager';
      case 'phpmyadmin': return 'phpMyAdmin';
      case 'mysql': return 'MySQL Databases';
      case 'email-accounts': return 'Email Accounts';
      case 'zone-editor': return 'Zone Editor (DNS)';
      case 'terminal': return 'SSH Terminal';
      case 'wordpress': return 'WordPress Toolkit';
      case 'metrics': return 'Metrics & Logs';
      case 'ssl-tls': return 'SSL / TLS Status';
      case 'cron-jobs': return 'Cron Jobs';
      case 'php-selector': return 'MultiPHP Manager';
      case 'webmail': return 'Webmail';
      default: return 'Tools';
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#1e293b] text-white border-b border-slate-700 shadow-md">
      <div className="flex items-center justify-between px-3 md:px-5 h-14">
        {/* Left: Brand & Breadcrumb */}
        <div className="flex items-center gap-3 md:gap-5 min-w-0">
          <button 
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-2 group text-left transition-opacity hover:opacity-95"
            title="cPanel Home"
          >
            {/* Iconic cPanel Logotype */}
            <div className="flex items-center">
              <span className="text-[#ff6c2c] font-black text-2xl tracking-tighter drop-shadow-sm font-sans">
                cPanel
              </span>
              <span className="hidden sm:inline-block ml-2 px-1.5 py-0.5 text-[10px] uppercase font-mono font-semibold bg-slate-800 text-slate-300 rounded border border-slate-700">
                v120.0
              </span>
            </div>
          </button>

          {/* Breadcrumb if inside an app */}
          {activeApp !== 'dashboard' && (
            <div className="hidden sm:flex items-center text-xs text-slate-300 gap-1.5 overflow-hidden">
              <ChevronRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <button 
                onClick={() => onNavigate('dashboard')}
                className="hover:text-white flex items-center gap-1 transition-colors"
              >
                <Home className="w-3 h-3" />
                <span>Tools</span>
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span className="font-semibold text-[#ff8b52] truncate">
                {getAppName(activeApp)}
              </span>
            </div>
          )}
        </div>

        {/* Center: Search input */}
        <div className="flex-1 max-w-md mx-3 lg:mx-8">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search tools (e.g. file, mysql, email, cron)..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-slate-800/90 text-sm text-slate-100 placeholder:text-slate-400 pl-9 pr-14 py-1.5 rounded-md border border-slate-700 focus:outline-none focus:border-[#ff6c2c] focus:ring-1 focus:ring-[#ff6c2c] transition-all"
            />
            {searchQuery ? (
              <button 
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-200 px-1 py-0.5 rounded bg-slate-700/60"
              >
                Clear
              </button>
            ) : (
              <span className="hidden sm:inline-block absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-mono bg-slate-700/70 px-1.5 py-0.5 rounded border border-slate-600">
                ⌘K
              </span>
            )}
          </div>
        </div>

        {/* Right Zone: Controls & User Profile */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Quick Apps Matrix */}
          <div className="relative" ref={quickLaunchRef}>
            <button
              onClick={() => setQuickLaunchOpen(!quickLaunchOpen)}
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
              title="Quick Applications"
              aria-label="Quick Applications"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>

            {quickLaunchOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-slate-800 rounded-lg shadow-xl border border-slate-700 p-2 z-50 animate-in fade-in zoom-in-95">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2 py-1 mb-1 border-b border-slate-700">
                  Quick Access
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <button 
                    onClick={() => { onNavigate('file-manager'); setQuickLaunchOpen(false); }}
                    className="flex flex-col items-center p-2 rounded hover:bg-slate-700 text-xs text-slate-200 transition-colors"
                  >
                    <span className="text-[#ff6c2c] mb-1">📁</span>
                    <span>Files</span>
                  </button>
                  <button 
                    onClick={() => { onNavigate('phpmyadmin'); setQuickLaunchOpen(false); }}
                    className="flex flex-col items-center p-2 rounded hover:bg-slate-700 text-xs text-slate-200 transition-colors"
                  >
                    <span className="text-amber-400 mb-1">🗄️</span>
                    <span>phpMyAdmin</span>
                  </button>
                  <button 
                    onClick={() => { onNavigate('email-accounts'); setQuickLaunchOpen(false); }}
                    className="flex flex-col items-center p-2 rounded hover:bg-slate-700 text-xs text-slate-200 transition-colors"
                  >
                    <span className="text-blue-400 mb-1">✉️</span>
                    <span>Email</span>
                  </button>
                  <button 
                    onClick={() => { onNavigate('terminal'); setQuickLaunchOpen(false); }}
                    className="flex flex-col items-center p-2 rounded hover:bg-slate-700 text-xs text-slate-200 transition-colors"
                  >
                    <span className="text-emerald-400 mb-1">💻</span>
                    <span>Terminal</span>
                  </button>
                  <button 
                    onClick={() => { onNavigate('zone-editor'); setQuickLaunchOpen(false); }}
                    className="flex flex-col items-center p-2 rounded hover:bg-slate-700 text-xs text-slate-200 transition-colors"
                  >
                    <span className="text-purple-400 mb-1">🌐</span>
                    <span>DNS Zone</span>
                  </button>
                  <button 
                    onClick={() => { onNavigate('wordpress'); setQuickLaunchOpen(false); }}
                    className="flex flex-col items-center p-2 rounded hover:bg-slate-700 text-xs text-slate-200 transition-colors"
                  >
                    <span className="text-sky-400 mb-1">📦</span>
                    <span>WordPress</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Notifications Bell */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
            title="System Notices"
            aria-label="System Notices"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#ff6c2c] ring-2 ring-[#1e293b]" />
            )}
          </button>

          {/* Dark / Light Mode Switch */}
          <button
            onClick={onToggleDarkMode}
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle Theme"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* User Profile Dropdown */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-2 pl-2 pr-1.5 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-800 rounded-md border border-slate-700 transition-colors"
            >
              <div className="w-6 h-6 rounded-full bg-[#ff6c2c] text-white flex items-center justify-center font-bold text-xs uppercase shadow-sm">
                {currentUser.charAt(0)}
              </div>
              <span className="hidden sm:inline font-mono text-[13px]">{currentUser}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {userDropdownOpen && (
              <div className="absolute right-0 mt-2 w-60 bg-slate-800 rounded-lg shadow-xl border border-slate-700 py-1.5 z-50 text-slate-200">
                <div className="px-3 py-2 border-b border-slate-700">
                  <p className="text-xs font-semibold text-white">{currentUser}</p>
                  <p className="text-[11px] text-slate-400 font-mono truncate">{serverName}</p>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      onOpenPasswordModal();
                      setUserDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs hover:bg-slate-700 text-left transition-colors"
                  >
                    <Key className="w-3.5 h-3.5 text-amber-400" />
                    <span>Password & Security</span>
                  </button>
                  <button
                    onClick={() => {
                      onNavigate('php-selector');
                      setUserDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs hover:bg-slate-700 text-left transition-colors"
                  >
                    <Sliders className="w-3.5 h-3.5 text-sky-400" />
                    <span>PHP Configurations</span>
                  </button>
                  <button
                    onClick={() => {
                      onNavigate('ssl-tls');
                      setUserDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs hover:bg-slate-700 text-left transition-colors"
                  >
                    <Shield className="w-3.5 h-3.5 text-emerald-400" />
                    <span>SSL/TLS Status</span>
                  </button>
                </div>

                <div className="border-t border-slate-700 pt-1">
                  <button
                    onClick={() => {
                      alert('Simulated cPanel session reset. Session is locked to demo mode.');
                      setUserDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-rose-400 hover:bg-slate-700 text-left transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Toggle Right Stats Sidebar Button */}
          <button
            onClick={onToggleStats}
            className={`p-2 rounded-md transition-colors ${
              isStatsOpen ? 'text-[#ff6c2c] bg-slate-800' : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
            title={isStatsOpen ? "Hide Server Stats Panel" : "Show Server Stats Panel"}
            aria-label="Toggle Server Stats"
          >
            {isStatsOpen ? <PanelRightClose className="w-4 h-4" /> : <PanelRightOpen className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
