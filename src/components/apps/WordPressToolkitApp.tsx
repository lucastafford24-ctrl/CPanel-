import React, { useState } from 'react';
import { WordPressSite } from '../../types/cpanel';
import { 
  Box, 
  ExternalLink, 
  ShieldCheck, 
  RefreshCw, 
  Copy, 
  Power, 
  Check, 
  X, 
  PlusCircle, 
  Sliders, 
  HardDrive, 
  AlertCircle,
  FolderTree,
  Lock
} from 'lucide-react';

interface WordPressToolkitAppProps {
  sites: WordPressSite[];
  onUpdateSites: (sites: WordPressSite[]) => void;
  onClose: () => void;
}

export const WordPressToolkitApp: React.FC<WordPressToolkitAppProps> = ({
  sites,
  onUpdateSites,
  onClose
}) => {
  const [activeSiteId, setActiveSiteId] = useState<string>(sites[0]?.id || 'wp1');
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [newTitle, setNewTitle] = useState('New Project Blog');
  const [newSubdomain, setNewSubdomain] = useState('blog');
  const [adminUser, setAdminUser] = useState('admin');
  const [adminPass, setAdminPass] = useState('WP@Secret2026!');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Simulated WP Admin preview modal
  const [showAdminPreview, setShowAdminPreview] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const activeSite = sites.find(s => s.id === activeSiteId) || sites[0];

  const handleToggleMaintenance = (siteId: string) => {
    const updated = sites.map(s => 
      s.id === siteId ? { ...s, maintenanceMode: !s.maintenanceMode } : s
    );
    onUpdateSites(updated);
    showToast(`Maintenance mode toggled for ${activeSite.title}`);
  };

  const handleCheckUpdates = () => {
    setIsUpdating(true);
    setTimeout(() => {
      setIsUpdating(false);
      const updated = sites.map(s => 
        s.id === activeSiteId ? { ...s, pluginsUpdateAvailable: 0 } : s
      );
      onUpdateSites(updated);
      showToast('All WordPress core, themes, and plugins are now up to date!');
    }, 1200);
  };

  const handleInstallWordPress = (e: React.FormEvent) => {
    e.preventDefault();
    const newSite: WordPressSite = {
      id: `wp_${Date.now()}`,
      title: newTitle,
      url: `https://${newSubdomain}.example-corp.com`,
      path: `/home/demouser/${newSubdomain}`,
      version: '6.6.2',
      phpVersion: '8.2',
      sslActive: true,
      autoUpdate: true,
      maintenanceMode: false,
      adminEmail: 'admin@example-corp.com',
      pluginsCount: 6,
      pluginsUpdateAvailable: 0,
    };

    onUpdateSites([...sites, newSite]);
    setShowInstallModal(false);
    showToast(`Installed WordPress successfully at ${newSite.url}`);
  };

  return (
    <div className="bg-white dark:bg-[#0f172a] rounded-lg border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col h-[82vh] overflow-hidden">
      {/* Toast alert */}
      {toastMessage && (
        <div className="absolute top-20 right-6 z-50 bg-slate-900 text-white px-4 py-2 rounded-md shadow-xl border border-slate-700 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="px-4 py-3 bg-[#1e293b] text-white flex items-center justify-between border-b border-slate-700">
        <div className="flex items-center gap-2">
          <Box className="w-4 h-4 text-[#ff6c2c]" />
          <h2 className="text-sm font-semibold">WordPress Toolkit</h2>
          <span className="text-[11px] text-slate-400 font-mono">({sites.length} installations)</span>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-700">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Toolbar */}
      <div className="p-3 bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowInstallModal(true)}
            className="px-3 py-1.5 bg-[#ff6c2c] hover:bg-[#e85b1c] text-white rounded font-medium shadow-xs transition-colors flex items-center gap-1.5"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Install WordPress</span>
          </button>
          <button
            onClick={handleCheckUpdates}
            disabled={isUpdating}
            className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-slate-700 dark:text-slate-200 hover:bg-slate-50 font-medium flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isUpdating ? 'animate-spin text-[#ff6c2c]' : ''}`} />
            <span>{isUpdating ? 'Checking Updates...' : 'Check for Updates'}</span>
          </button>
        </div>

        <span className="text-[11px] text-slate-400">Automated Smart Security Active</span>
      </div>

      {/* Content: Sites List + Selected Details */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sites Left List */}
        <div className="w-64 border-r border-slate-200 dark:border-slate-800 p-2 overflow-y-auto bg-slate-50/50 dark:bg-slate-900/20 space-y-2 text-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1">
            Installations
          </div>
          {sites.map(s => {
            const isSelected = s.id === activeSiteId;
            return (
              <div
                key={s.id}
                onClick={() => setActiveSiteId(s.id)}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-white dark:bg-slate-800 border-[#ff6c2c] shadow-xs'
                    : 'bg-white/60 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-semibold text-slate-900 dark:text-white truncate">
                    {s.title}
                  </h4>
                  {s.sslActive && <Lock className="w-3 h-3 text-emerald-500 shrink-0" />}
                </div>
                <div className="text-[11px] font-mono text-slate-500 truncate">{s.url}</div>
                <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
                  <span>WP {s.version}</span>
                  <span>PHP {s.phpVersion}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Site Management Pane */}
        {activeSite && (
          <div className="flex-1 p-5 overflow-y-auto space-y-5 text-xs">
            {/* Top Site Hero Card */}
            <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-lg border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {activeSite.title}
                    </h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold">
                      ACTIVE
                    </span>
                  </div>
                  <a
                    href={activeSite.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-[#ff6c2c] hover:underline flex items-center gap-1 font-mono mt-0.5"
                  >
                    <span>{activeSite.url}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowAdminPreview(true)}
                    className="px-4 py-2 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white rounded font-medium shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <span>Log in to WP Admin</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Status Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <div>
                  <span className="text-slate-400 text-[11px] block">Installation Path</span>
                  <span className="font-mono text-slate-700 dark:text-slate-300 truncate block">
                    {activeSite.path}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">WordPress Version</span>
                  <span className="font-mono text-slate-700 dark:text-slate-300">{activeSite.version}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">PHP Runtime</span>
                  <span className="font-mono text-slate-700 dark:text-slate-300">{activeSite.phpVersion}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">SSL Status</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">Valid (Let's Encrypt)</span>
                </div>
              </div>
            </div>

            {/* Quick Controls Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Maintenance Mode Card */}
              <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-lg flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-slate-800 dark:text-slate-100">
                    Maintenance Mode
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Show maintenance splash screen to public visitors while making edits.
                  </p>
                </div>
                <button
                  onClick={() => handleToggleMaintenance(activeSite.id)}
                  className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                    activeSite.maintenanceMode ? 'bg-[#ff6c2c]' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      activeSite.maintenanceMode ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Automatic Core Updates */}
              <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-lg flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-slate-800 dark:text-slate-100">
                    Auto-Updates
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Automatically apply minor security updates and maintenance patches.
                  </p>
                </div>
                <span className="text-emerald-600 font-medium text-xs">Enabled</span>
              </div>
            </div>

            {/* Installed Plugins Table */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-slate-800 dark:text-slate-100">
                  Installed Plugins ({activeSite.pluginsCount})
                </h4>
                {activeSite.pluginsUpdateAvailable > 0 && (
                  <span className="text-[11px] text-amber-600 font-medium">
                    {activeSite.pluginsUpdateAvailable} updates available
                  </span>
                )}
              </div>

              <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-[11px] uppercase font-semibold text-slate-500">
                    <tr>
                      <th className="py-2 px-3">Plugin</th>
                      <th className="py-2 px-3">Version</th>
                      <th className="py-2 px-3 text-center">Status</th>
                      <th className="py-2 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {[
                      { name: 'Akismet Anti-Spam', ver: '5.3.3', active: true },
                      { name: 'Yoast SEO', ver: '23.4', active: true },
                      { name: 'WooCommerce', ver: '9.2.1', active: true },
                      { name: 'WPForms Lite', ver: '1.9.0.2', active: true },
                      { name: 'LiteSpeed Cache', ver: '6.4.1', active: true },
                    ].map(plg => (
                      <tr key={plg.name} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="py-2.5 px-3 font-medium text-slate-800 dark:text-slate-200">
                          {plg.name}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-slate-500">{plg.ver}</td>
                        <td className="py-2.5 px-3 text-center">
                          <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                            Active
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <button 
                            onClick={() => showToast(`Synchronized ${plg.name}`)}
                            className="text-[#ff6c2c] hover:underline text-[11px]"
                          >
                            Configure
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Install WordPress Modal */}
      {showInstallModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <form onSubmit={handleInstallWordPress} className="bg-white dark:bg-slate-900 rounded-lg max-w-md w-full border border-slate-200 dark:border-slate-800 p-5 space-y-4 shadow-xl text-xs">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Install WordPress</h3>
              <button type="button" onClick={() => setShowInstallModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-slate-500 font-medium mb-1">Website Title</label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-medium mb-1">Installation URL / Subdomain</label>
              <div className="flex items-center rounded border border-slate-300 dark:border-slate-700 overflow-hidden">
                <span className="px-2 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs">https://</span>
                <input
                  type="text"
                  required
                  value={newSubdomain}
                  onChange={(e) => setNewSubdomain(e.target.value)}
                  className="flex-1 px-2 py-1.5 text-xs bg-transparent focus:outline-none"
                />
                <span className="px-2 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs">.example-corp.com</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-500 font-medium mb-1">Admin Username</label>
                <input
                  type="text"
                  required
                  value={adminUser}
                  onChange={(e) => setAdminUser(e.target.value)}
                  className="w-full px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                />
              </div>
              <div>
                <label className="block text-slate-500 font-medium mb-1">Admin Password</label>
                <input
                  type="text"
                  required
                  value={adminPass}
                  onChange={(e) => setAdminPass(e.target.value)}
                  className="w-full px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowInstallModal(false)}
                className="px-3 py-1.5 bg-slate-200 dark:bg-slate-800 rounded font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-[#ff6c2c] hover:bg-[#e85b1c] text-white rounded font-medium shadow-xs"
              >
                Install Now
              </button>
            </div>
          </form>
        </div>
      )}

      {/* WP Admin Preview Window */}
      {showAdminPreview && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 rounded-lg max-w-3xl w-full border border-slate-700 p-5 shadow-2xl text-xs space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <Box className="w-4 h-4 text-sky-400" />
                <h3 className="text-sm font-semibold text-white">WordPress Admin Dashboard (SSO Active)</h3>
              </div>
              <button onClick={() => setShowAdminPreview(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 bg-slate-800/80 rounded border border-slate-700 space-y-3">
              <p className="text-slate-200">
                Logged into <strong>{activeSite.title}</strong> as <strong>{activeSite.adminEmail}</strong>.
              </p>
              <div className="p-3 bg-slate-950 rounded font-mono text-[11px] text-emerald-400">
                cPanel WordPress Toolkit SSO handshake: VALIDATED<br />
                User session key: wp_sec_auth_99f3bc1a82<br />
                Connected to database: demouser_wp on localhost:3306
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setShowAdminPreview(false)}
                className="px-4 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded font-medium"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
