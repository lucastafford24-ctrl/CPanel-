import React, { useState } from 'react';
import { 
  ShieldCheck, 
  RefreshCw, 
  Lock, 
  Key, 
  Check, 
  X, 
  Calendar, 
  AlertCircle,
  ExternalLink 
} from 'lucide-react';

interface SslTlsAppProps {
  onClose: () => void;
}

export const SslTlsApp: React.FC<SslTlsAppProps> = ({ onClose }) => {
  const [isRunningAutoSSL, setIsRunningAutoSSL] = useState(false);
  const [autoSslLog, setAutoSslLog] = useState<string | null>(null);
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [domains, setDomains] = useState([
    { name: 'example-corp.com', status: 'valid', expires: '2027-01-02', issuer: "Let's Encrypt", autoSsl: true },
    { name: 'www.example-corp.com', status: 'valid', expires: '2027-01-02', issuer: "Let's Encrypt", autoSsl: true },
    { name: 'mail.example-corp.com', status: 'valid', expires: '2027-01-02', issuer: "Let's Encrypt", autoSsl: true },
    { name: 'staging.example-corp.com', status: 'valid', expires: '2027-01-02', issuer: "Let's Encrypt", autoSsl: true },
    { name: 'api.example-corp.com', status: 'valid', expires: '2027-01-02', issuer: "Let's Encrypt", autoSsl: true },
  ]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleRunAutoSSL = () => {
    setIsRunningAutoSSL(true);
    setAutoSslLog('Initializing cPanel AutoSSL check for 5 domains...');

    setTimeout(() => {
      setAutoSslLog(prev => `${prev}\nChecking DNS DCV (Domain Control Validation) records... OK.`);
    }, 600);

    setTimeout(() => {
      setAutoSslLog(prev => `${prev}\nContacting Let's Encrypt ACME v2 API server... Done.`);
    }, 1200);

    setTimeout(() => {
      setIsRunningAutoSSL(false);
      setAutoSslLog(prev => `${prev}\nSUCCESS: AutoSSL run completed at ${new Date().toLocaleTimeString()}. All certificates valid.`);
      showToast('AutoSSL completed successfully. All domains secured.');
    }, 1800);
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
          <ShieldCheck className="w-4 h-4 text-[#ff6c2c]" />
          <h2 className="text-sm font-semibold">SSL/TLS Status & AutoSSL</h2>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-700">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Top Banner & AutoSSL trigger */}
      <div className="p-4 bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div>
          <h3 className="font-bold text-slate-800 dark:text-white">
            AutoSSL Provider: cPanel (powered by Let's Encrypt™)
          </h3>
          <p className="text-slate-500 text-[11px] mt-0.5">
            AutoSSL automatically installs and renews free DV SSL certificates for your Apache and Dovecot mail services.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowInstallModal(true)}
            className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-slate-700 dark:text-slate-200 hover:bg-slate-50 font-medium"
          >
            Install Custom Certificate
          </button>
          <button
            onClick={handleRunAutoSSL}
            disabled={isRunningAutoSSL}
            className="px-4 py-1.5 bg-[#ff6c2c] hover:bg-[#e85b1c] text-white rounded font-medium shadow-xs transition-colors flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRunningAutoSSL ? 'animate-spin' : ''}`} />
            <span>{isRunningAutoSSL ? 'Running AutoSSL...' : 'Run AutoSSL'}</span>
          </button>
        </div>
      </div>

      {/* AutoSSL execution output if active */}
      {autoSslLog && (
        <div className="p-3 bg-slate-900 text-emerald-400 font-mono text-[11px] border-b border-slate-800 whitespace-pre-wrap">
          {autoSslLog}
        </div>
      )}

      {/* Domain SSL status table */}
      <div className="flex-1 overflow-y-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 uppercase text-[11px] font-semibold text-slate-600 dark:text-slate-300 sticky top-0">
            <tr>
              <th className="py-2.5 px-4">Domain</th>
              <th className="py-2.5 px-3 text-center">Status</th>
              <th className="py-2.5 px-4 font-mono">Certificate Issuer</th>
              <th className="py-2.5 px-4 font-mono">Expiration Date</th>
              <th className="py-2.5 px-3 text-center">AutoSSL</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-xs">
            {domains.map(dom => (
              <tr key={dom.name} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                <td className="py-3 px-4 flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span className="font-semibold text-slate-900 dark:text-white">{dom.name}</span>
                </td>
                <td className="py-3 px-3 text-center">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    AutoSSL Valid
                  </span>
                </td>
                <td className="py-3 px-4 text-slate-700 dark:text-slate-300 font-sans">
                  {dom.issuer}
                </td>
                <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                  {dom.expires} (Expires in 92 days)
                </td>
                <td className="py-3 px-3 text-center">
                  <input
                    type="checkbox"
                    checked={dom.autoSsl}
                    onChange={() => {
                      setDomains(domains.map(d => d.name === dom.name ? { ...d, autoSsl: !d.autoSsl } : d));
                      showToast(`Updated AutoSSL toggle for ${dom.name}`);
                    }}
                    className="accent-[#ff6c2c]"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Install Custom Certificate Modal */}
      {showInstallModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 rounded-lg max-w-lg w-full border border-slate-200 dark:border-slate-800 p-5 space-y-4 shadow-xl text-xs">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Install an SSL Website</h3>
              <button onClick={() => setShowInstallModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-slate-500 font-medium mb-1">Domain</label>
              <select className="w-full px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs">
                <option>example-corp.com</option>
                <option>staging.example-corp.com</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-500 font-medium mb-1">Certificate (CRT)</label>
              <textarea
                rows={3}
                placeholder="-----BEGIN CERTIFICATE----- ... -----END CERTIFICATE-----"
                className="w-full p-2 font-mono text-[10px] rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 resize-none"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-medium mb-1">Private Key (KEY)</label>
              <textarea
                rows={3}
                placeholder="-----BEGIN RSA PRIVATE KEY----- ... -----END RSA PRIVATE KEY-----"
                className="w-full p-2 font-mono text-[10px] rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 resize-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setShowInstallModal(false)}
                className="px-3 py-1.5 bg-slate-200 dark:bg-slate-800 rounded font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowInstallModal(false);
                  showToast('Custom SSL certificate installed successfully.');
                }}
                className="px-4 py-1.5 bg-[#ff6c2c] hover:bg-[#e85b1c] text-white rounded font-medium shadow-xs"
              >
                Install Certificate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
