import React, { useState, useEffect } from 'react';
import { 
  ActiveApp, 
  FileItem, 
  EmailAccount, 
  DnsRecord, 
  DatabaseRecord, 
  CronJob, 
  WordPressSite, 
  VisitorLog, 
  SystemNotification,
  ServerStats
} from './types/cpanel';
import { 
  CATEGORIES, 
  CPANEL_TOOLS, 
  INITIAL_STATS, 
  INITIAL_FILES, 
  INITIAL_EMAILS, 
  INITIAL_DNS_RECORDS, 
  INITIAL_DATABASES, 
  INITIAL_WP_SITES, 
  INITIAL_CRON_JOBS, 
  INITIAL_LOGS, 
  INITIAL_NOTIFICATIONS 
} from './data/cpanelData';

import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { StatsPanel } from './components/StatsPanel';
import { Dashboard } from './components/Dashboard';

import { FileManagerApp } from './components/apps/FileManagerApp';
import { PhpMyAdminApp } from './components/apps/PhpMyAdminApp';
import { MySqlDatabasesApp } from './components/apps/MySqlDatabasesApp';
import { EmailAccountsApp } from './components/apps/EmailAccountsApp';
import { WebmailApp } from './components/apps/WebmailApp';
import { ZoneEditorApp } from './components/apps/ZoneEditorApp';
import { TerminalApp } from './components/apps/TerminalApp';
import { WordPressToolkitApp } from './components/apps/WordPressToolkitApp';
import { MetricsApp } from './components/apps/MetricsApp';
import { SslTlsApp } from './components/apps/SslTlsApp';
import { CronJobsApp } from './components/apps/CronJobsApp';
import { PhpSelectorApp } from './components/apps/PhpSelectorApp';

import { NotificationDrawer } from './components/NotificationDrawer';
import { PasswordModal } from './components/PasswordModal';

export default function App() {
  // Navigation & UI State
  const [activeApp, setActiveApp] = useState<ActiveApp>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [isStatsOpen, setIsStatsOpen] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  // Core Data State
  const [stats, setStats] = useState<ServerStats>(INITIAL_STATS);
  const [files, setFiles] = useState<FileItem[]>(INITIAL_FILES);
  const [emails, setEmails] = useState<EmailAccount[]>(INITIAL_EMAILS);
  const [selectedWebmailAccount, setSelectedWebmailAccount] = useState<EmailAccount | null>(null);
  const [dnsRecords, setDnsRecords] = useState<DnsRecord[]>(INITIAL_DNS_RECORDS);
  const [databases, setDatabases] = useState<DatabaseRecord[]>(INITIAL_DATABASES);
  const [wpSites, setWpSites] = useState<WordPressSite[]>(INITIAL_WP_SITES);
  const [cronJobs, setCronJobs] = useState<CronJob[]>(INITIAL_CRON_JOBS);
  const [logs] = useState<VisitorLog[]>(INITIAL_LOGS);
  const [notifications, setNotifications] = useState<SystemNotification[]>(INITIAL_NOTIFICATIONS);

  // Sync dark mode class
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Keep stats count in sync with modified datasets
  useEffect(() => {
    setStats(prev => ({
      ...prev,
      emailAccountsCount: emails.length,
      mysqlDiskUsedMb: databases.reduce((acc, curr) => acc + curr.sizeMb, 0),
    }));
  }, [emails, databases]);

  const handleNavigate = (app: ActiveApp) => {
    setActiveApp(app);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenWebmail = (email: EmailAccount) => {
    setSelectedWebmailAccount(email);
    setActiveApp('webmail');
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const handleUpdatePhpVersion = (newVer: string) => {
    setStats(prev => ({ ...prev, phpVersion: newVer }));
  };

  return (
    <div className={`min-h-screen bg-slate-100 dark:bg-[#090d16] text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors duration-150`}>
      {/* cPanel Top Header */}
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeApp={activeApp}
        onNavigate={handleNavigate}
        isStatsOpen={isStatsOpen}
        onToggleStats={() => setIsStatsOpen(!isStatsOpen)}
        notifications={notifications}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        currentUser={stats.currentUser}
        serverName={stats.serverName}
        onOpenPasswordModal={() => setIsPasswordModalOpen(true)}
      />

      {/* Main Layout Area: Left Nav + Center Work Area + Right Stats */}
      <div className="flex-1 flex max-w-[1920px] w-full mx-auto">
        {/* Left Jupiter Navigation Sidebar */}
        <Sidebar
          activeApp={activeApp}
          onNavigate={handleNavigate}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />

        {/* Center Application Viewport */}
        <main className="flex-1 p-3 sm:p-5 lg:p-6 overflow-y-auto max-w-full">
          {activeApp === 'dashboard' && (
            <Dashboard
              categories={CATEGORIES}
              tools={CPANEL_TOOLS}
              onOpenApp={handleNavigate}
              searchQuery={searchQuery}
              onClearSearch={() => setSearchQuery('')}
            />
          )}

          {activeApp === 'file-manager' && (
            <FileManagerApp
              files={files}
              onUpdateFiles={setFiles}
              onClose={() => handleNavigate('dashboard')}
            />
          )}

          {activeApp === 'phpmyadmin' && (
            <PhpMyAdminApp
              onClose={() => handleNavigate('dashboard')}
            />
          )}

          {activeApp === 'mysql' && (
            <MySqlDatabasesApp
              databases={databases}
              onUpdateDatabases={setDatabases}
              onClose={() => handleNavigate('dashboard')}
            />
          )}

          {activeApp === 'email-accounts' && (
            <EmailAccountsApp
              emails={emails}
              onUpdateEmails={setEmails}
              onOpenWebmail={handleOpenWebmail}
              onClose={() => handleNavigate('dashboard')}
            />
          )}

          {activeApp === 'webmail' && (
            <WebmailApp
              currentEmail={selectedWebmailAccount}
              onClose={() => handleNavigate('email-accounts')}
            />
          )}

          {activeApp === 'zone-editor' && (
            <ZoneEditorApp
              records={dnsRecords}
              onUpdateRecords={setDnsRecords}
              onClose={() => handleNavigate('dashboard')}
            />
          )}

          {activeApp === 'terminal' && (
            <TerminalApp
              onClose={() => handleNavigate('dashboard')}
            />
          )}

          {activeApp === 'wordpress' && (
            <WordPressToolkitApp
              sites={wpSites}
              onUpdateSites={setWpSites}
              onClose={() => handleNavigate('dashboard')}
            />
          )}

          {activeApp === 'metrics' && (
            <MetricsApp
              stats={stats}
              logs={logs}
              onClose={() => handleNavigate('dashboard')}
            />
          )}

          {activeApp === 'ssl-tls' && (
            <SslTlsApp
              onClose={() => handleNavigate('dashboard')}
            />
          )}

          {activeApp === 'cron-jobs' && (
            <CronJobsApp
              cronJobs={cronJobs}
              onUpdateCronJobs={setCronJobs}
              onClose={() => handleNavigate('dashboard')}
            />
          )}

          {activeApp === 'php-selector' && (
            <PhpSelectorApp
              currentPhpVersion={stats.phpVersion}
              onUpdatePhpVersion={handleUpdatePhpVersion}
              onClose={() => handleNavigate('dashboard')}
            />
          )}

          {/* cPanel Footer */}
          <footer className="mt-8 pt-4 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700 dark:text-slate-300">cPanel, Inc.</span>
              <span>·</span>
              <span>cPanel & WHM™ Version {stats.cpanelVersion}</span>
            </div>
            <div className="flex items-center gap-4 text-[11px]">
              <button onClick={() => handleNavigate('php-selector')} className="hover:underline">MultiPHP Manager</button>
              <button onClick={() => handleNavigate('ssl-tls')} className="hover:underline">SSL/TLS</button>
              <button onClick={() => handleNavigate('terminal')} className="hover:underline">Terminal</button>
              <button onClick={() => handleNavigate('file-manager')} className="hover:underline">File Manager</button>
            </div>
          </footer>
        </main>

        {/* Right Collapsible Statistics & Server Info Panel */}
        <StatsPanel
          stats={stats}
          isOpen={isStatsOpen}
          onClose={() => setIsStatsOpen(false)}
          onNavigateToMetrics={() => handleNavigate('metrics')}
        />
      </div>

      {/* Global Modals & Drawers */}
      <NotificationDrawer
        notifications={notifications}
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onMarkAllAsRead={handleMarkAllNotificationsRead}
      />

      <PasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        currentUser={stats.currentUser}
      />
    </div>
  );
}
