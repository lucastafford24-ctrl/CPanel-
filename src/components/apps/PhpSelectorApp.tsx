import React, { useState } from 'react';
import { 
  Sliders, 
  Cpu, 
  Check, 
  X, 
  RefreshCw, 
  FileCode, 
  Layers 
} from 'lucide-react';

interface PhpSelectorAppProps {
  currentPhpVersion: string;
  onUpdatePhpVersion: (ver: string) => void;
  onClose: () => void;
}

export const PhpSelectorApp: React.FC<PhpSelectorAppProps> = ({
  currentPhpVersion,
  onUpdatePhpVersion,
  onClose
}) => {
  const [selectedVer, setSelectedVer] = useState(currentPhpVersion);
  const [activeTab, setActiveTab] = useState<'selector' | 'extensions' | 'ini'>('selector');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [extensions, setExtensions] = useState<Record<string, boolean>>({
    opcache: true,
    mysqli: true,
    pdo_mysql: true,
    curl: true,
    mbstring: true,
    imagick: true,
    gd: true,
    zip: true,
    xml: true,
    intl: true,
    soap: false,
    bcmath: true,
    fileinfo: true,
    xdebug: false,
  });

  const [iniDirectives, setIniDirectives] = useState({
    memory_limit: '512M',
    upload_max_filesize: '64M',
    post_max_size: '64M',
    max_execution_time: '300',
    max_input_time: '60',
    display_errors: 'Off',
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleApplyVersion = () => {
    onUpdatePhpVersion(selectedVer);
    showToast(`Updated default PHP runtime to PHP ${selectedVer}`);
  };

  const handleToggleExtension = (name: string) => {
    setExtensions({ ...extensions, [name]: !extensions[name] });
    showToast(`Toggled extension: ${name}`);
  };

  const handleSaveIni = (e: React.FormEvent) => {
    e.preventDefault();
    showToast(`Saved MultiPHP php.ini directives successfully.`);
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
      <div className="px-4 py-3 bg-slate-800 text-white flex items-center justify-between border-b border-slate-700">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-[#ff6c2c]" />
          <h2 className="text-sm font-semibold">Select PHP Version & MultiPHP INI Editor</h2>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-700">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Tab Switcher */}
      <div className="px-4 py-2 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2 text-xs">
        <button
          onClick={() => setActiveTab('selector')}
          className={`px-3 py-1.5 rounded font-medium transition-colors ${
            activeTab === 'selector' ? 'bg-[#ff6c2c] text-white shadow-xs' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
          }`}
        >
          PHP Version Selector
        </button>
        <button
          onClick={() => setActiveTab('extensions')}
          className={`px-3 py-1.5 rounded font-medium transition-colors ${
            activeTab === 'extensions' ? 'bg-[#ff6c2c] text-white shadow-xs' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
          }`}
        >
          PHP Extensions
        </button>
        <button
          onClick={() => setActiveTab('ini')}
          className={`px-3 py-1.5 rounded font-medium transition-colors ${
            activeTab === 'ini' ? 'bg-[#ff6c2c] text-white shadow-xs' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
          }`}
        >
          php.ini Directives
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 text-xs">
        {activeTab === 'selector' && (
          <div className="max-w-xl space-y-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
              Select PHP Version for Domain: example-corp.com
            </h3>
            <p className="text-slate-500">
              Current PHP Version: <strong className="font-mono text-slate-800 dark:text-slate-200">{currentPhpVersion}</strong>
            </p>

            <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-lg border border-slate-200 dark:border-slate-800 space-y-3">
              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">
                  Choose PHP Version:
                </label>
                <select
                  value={selectedVer}
                  onChange={(e) => setSelectedVer(e.target.value)}
                  className="w-full px-3 py-2 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-xs"
                >
                  <option value="8.3.8">PHP 8.3 (ea-php83)</option>
                  <option value="8.2.14">PHP 8.2 (ea-php82) - Recommended</option>
                  <option value="8.1.27">PHP 8.1 (ea-php81)</option>
                  <option value="8.0.30">PHP 8.0 (ea-php80 - Legacy)</option>
                  <option value="7.4.33">PHP 7.4 (ea-php74 - End of Life)</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleApplyVersion}
                  className="px-4 py-2 bg-[#ff6c2c] hover:bg-[#e85b1c] text-white rounded font-medium shadow-xs"
                >
                  Set as Current Version
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'extensions' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                  PHP Extensions ({currentPhpVersion})
                </h3>
                <p className="text-slate-500 text-xs">
                  Click to enable or disable compiled PHP modules in real-time.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {Object.keys(extensions).map(ext => (
                <label
                  key={ext}
                  className={`p-3 rounded-lg border cursor-pointer flex items-center justify-between transition-colors ${
                    extensions[ext]
                      ? 'bg-orange-50/60 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800/60 text-slate-900 dark:text-white'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500'
                  }`}
                >
                  <span className="font-mono font-medium">{ext}</span>
                  <input
                    type="checkbox"
                    checked={extensions[ext]}
                    onChange={() => handleToggleExtension(ext)}
                    className="accent-[#ff6c2c]"
                  />
                </label>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'ini' && (
          <form onSubmit={handleSaveIni} className="max-w-lg space-y-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
              Basic MultiPHP INI Directives Editor
            </h3>

            <div className="space-y-3 p-4 bg-slate-50 dark:bg-slate-900/60 rounded-lg border border-slate-200 dark:border-slate-800">
              <div>
                <label className="block text-slate-500 font-medium mb-1 font-mono">memory_limit</label>
                <input
                  type="text"
                  value={iniDirectives.memory_limit}
                  onChange={(e) => setIniDirectives({ ...iniDirectives, memory_limit: e.target.value })}
                  className="w-full px-3 py-1.5 font-mono rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-medium mb-1 font-mono">upload_max_filesize</label>
                <input
                  type="text"
                  value={iniDirectives.upload_max_filesize}
                  onChange={(e) => setIniDirectives({ ...iniDirectives, upload_max_filesize: e.target.value })}
                  className="w-full px-3 py-1.5 font-mono rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-medium mb-1 font-mono">post_max_size</label>
                <input
                  type="text"
                  value={iniDirectives.post_max_size}
                  onChange={(e) => setIniDirectives({ ...iniDirectives, post_max_size: e.target.value })}
                  className="w-full px-3 py-1.5 font-mono rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-medium mb-1 font-mono">max_execution_time (seconds)</label>
                <input
                  type="text"
                  value={iniDirectives.max_execution_time}
                  onChange={(e) => setIniDirectives({ ...iniDirectives, max_execution_time: e.target.value })}
                  className="w-full px-3 py-1.5 font-mono rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#ff6c2c] hover:bg-[#e85b1c] text-white rounded font-medium shadow-xs"
                >
                  Apply INI Settings
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
