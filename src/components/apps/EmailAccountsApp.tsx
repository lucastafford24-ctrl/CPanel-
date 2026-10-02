import React, { useState } from 'react';
import { EmailAccount } from '../../types/cpanel';
import { 
  Mail, 
  PlusCircle, 
  Trash2, 
  ExternalLink, 
  Sliders, 
  Smartphone, 
  Check, 
  X, 
  Key, 
  HardDrive,
  RefreshCw,
  Search,
  Inbox
} from 'lucide-react';

interface EmailAccountsAppProps {
  emails: EmailAccount[];
  onUpdateEmails: (emails: EmailAccount[]) => void;
  onOpenWebmail: (email: EmailAccount) => void;
  onClose: () => void;
}

export const EmailAccountsApp: React.FC<EmailAccountsAppProps> = ({
  emails,
  onUpdateEmails,
  onOpenWebmail,
  onClose
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newDomain, setNewDomain] = useState('example-corp.com');
  const [newPassword, setNewPassword] = useState('');
  const [newQuota, setNewQuota] = useState('1024');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Connect devices modal
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [selectedConnectEmail, setSelectedConnectEmail] = useState<EmailAccount | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleGeneratePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%^&*';
    let res = '';
    for (let i = 0; i < 14; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewPassword(res);
  };

  const handleCreateEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername.trim()) return;

    const fullAddress = `${newUsername.trim().toLowerCase()}@${newDomain}`;
    if (emails.some(m => m.address === fullAddress)) {
      alert(`The email address ${fullAddress} already exists.`);
      return;
    }

    const newAcc: EmailAccount = {
      id: `email_${Date.now()}`,
      address: fullAddress,
      domain: newDomain,
      usageMb: 0.1,
      quotaMb: parseInt(newQuota, 10) || 1024,
      created: new Date().toISOString().split('T')[0],
      hasAutoresponder: false
    };

    onUpdateEmails([...emails, newAcc]);
    setShowCreateModal(false);
    setNewUsername('');
    setNewPassword('');
    showToast(`Email account ${fullAddress} created successfully.`);
  };

  const handleDelete = (id: string, address: string) => {
    if (confirm(`Are you sure you want to delete ${address}? All messages will be permanently erased.`)) {
      onUpdateEmails(emails.filter(e => e.id !== id));
      showToast(`Deleted ${address}`);
    }
  };

  const filteredEmails = emails.filter(e => 
    e.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white dark:bg-[#0f172a] rounded-lg border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col h-[82vh] overflow-hidden">
      {/* Toast alert */}
      {toastMessage && (
        <div className="absolute top-20 right-6 z-50 bg-slate-900 text-white px-4 py-2 rounded-md shadow-xl border border-slate-700 text-xs flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="px-4 py-3 bg-slate-800 text-white flex items-center justify-between border-b border-slate-700">
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-[#ff6c2c]" />
          <h2 className="text-sm font-semibold">Email Accounts</h2>
          <span className="text-[11px] text-slate-400 font-mono">({emails.length} accounts configured)</span>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-700">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Action Toolbar */}
      <div className="p-3 bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search email accounts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-slate-800 dark:text-slate-200 focus:outline-none focus:border-[#ff6c2c]"
          />
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-[#ff6c2c] hover:bg-[#e85b1c] text-white rounded font-medium shadow-xs transition-colors flex items-center justify-center gap-1.5"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ Create Email Account</span>
        </button>
      </div>

      {/* Email Accounts Table */}
      <div className="flex-1 overflow-y-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-[11px] font-semibold text-slate-600 dark:text-slate-300 uppercase sticky top-0">
            <tr>
              <th className="py-2.5 px-4">Account</th>
              <th className="py-2.5 px-4">Usage / Quota</th>
              <th className="py-2.5 px-4 font-mono text-center">Autoresponder</th>
              <th className="py-2.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredEmails.map(acc => {
              const pct = acc.quotaMb > 0 ? Math.min(100, Math.round((acc.usageMb / acc.quotaMb) * 100)) : 10;
              return (
                <tr key={acc.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-blue-500 shrink-0" />
                      <div>
                        <span className="font-medium text-slate-900 dark:text-white font-mono">{acc.address}</span>
                        <div className="text-[10px] text-slate-400">Created: {acc.created}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 min-w-[200px]">
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] font-mono text-slate-500">
                        <span>{acc.usageMb.toFixed(1)} MB</span>
                        <span>{acc.quotaMb} MB ({pct}%)</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${pct > 80 ? 'bg-rose-500' : pct > 50 ? 'bg-amber-500' : 'bg-blue-500'}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${acc.hasAutoresponder ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300' : 'text-slate-400'}`}>
                      {acc.hasAutoresponder ? 'Enabled' : 'Disabled'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onOpenWebmail(acc)}
                        className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded font-medium transition-colors flex items-center gap-1"
                        title="Open Webmail (Roundcube)"
                      >
                        <Inbox className="w-3.5 h-3.5 text-[#ff6c2c]" />
                        <span>Check Webmail</span>
                      </button>

                      <button
                        onClick={() => { setSelectedConnectEmail(acc); setShowConnectModal(true); }}
                        className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Connect Devices (IMAP/SMTP Settings)"
                      >
                        <Smartphone className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDelete(acc.id, acc.address)}
                        className="p-1.5 text-slate-400 hover:text-rose-500 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Delete Email"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Create Account Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <form onSubmit={handleCreateEmail} className="bg-white dark:bg-slate-900 rounded-lg max-w-md w-full border border-slate-200 dark:border-slate-800 p-5 space-y-4 shadow-xl text-xs">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Create an Email Account</h3>
              <button type="button" onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-slate-500 font-medium mb-1">Email Username</label>
              <div className="flex items-center rounded-md border border-slate-300 dark:border-slate-700 overflow-hidden bg-white dark:bg-slate-800">
                <input
                  type="text"
                  required
                  placeholder="john.doe"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs bg-transparent focus:outline-none"
                />
                <span className="px-3 py-2 bg-slate-100 dark:bg-slate-700 text-slate-500 border-l border-slate-300 dark:border-slate-700">
                  @
                </span>
                <select
                  value={newDomain}
                  onChange={(e) => setNewDomain(e.target.value)}
                  className="px-2 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs focus:outline-none"
                >
                  <option value="example-corp.com">example-corp.com</option>
                  <option value="staging.example-corp.com">staging.example-corp.com</option>
                </select>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-slate-500 font-medium">Password</label>
                <button
                  type="button"
                  onClick={handleGeneratePassword}
                  className="text-[#ff6c2c] hover:underline text-[11px]"
                >
                  Generate Strong Password
                </button>
              </div>
              <input
                type="text"
                required
                placeholder="Enter password..."
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 font-mono rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:border-[#ff6c2c]"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-medium mb-1">Storage Space (Quota)</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={newQuota}
                  onChange={(e) => setNewQuota(e.target.value)}
                  className="w-32 px-3 py-2 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                />
                <span className="text-slate-500">MB</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-3 py-1.5 bg-slate-200 dark:bg-slate-800 rounded font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-[#ff6c2c] hover:bg-[#e85b1c] text-white rounded font-medium shadow-xs"
              >
                Create Account
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Connect Devices Modal */}
      {showConnectModal && selectedConnectEmail && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 rounded-lg max-w-lg w-full border border-slate-200 dark:border-slate-800 p-5 space-y-4 shadow-xl text-xs">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                Mail Client Configuration for {selectedConnectEmail.address}
              </h3>
              <button onClick={() => setShowConnectModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded text-blue-900 dark:text-blue-200">
              Use these secure SSL/TLS settings for iPhone, Android, Outlook, and Apple Mail.
            </div>

            <table className="w-full border-collapse">
              <tbody>
                <tr className="border-b border-slate-100 dark:border-slate-800">
                  <td className="py-2 text-slate-500 font-medium">Username</td>
                  <td className="py-2 font-mono text-right">{selectedConnectEmail.address}</td>
                </tr>
                <tr className="border-b border-slate-100 dark:border-slate-800">
                  <td className="py-2 text-slate-500 font-medium">Incoming Server (IMAP)</td>
                  <td className="py-2 font-mono text-right">mail.example-corp.com (Port 993, SSL)</td>
                </tr>
                <tr className="border-b border-slate-100 dark:border-slate-800">
                  <td className="py-2 text-slate-500 font-medium">Outgoing Server (SMTP)</td>
                  <td className="py-2 font-mono text-right">mail.example-corp.com (Port 465, SSL)</td>
                </tr>
                <tr>
                  <td className="py-2 text-slate-500 font-medium">Authentication</td>
                  <td className="py-2 font-mono text-right">Password (Same as login)</td>
                </tr>
              </tbody>
            </table>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowConnectModal(false)}
                className="px-4 py-1.5 bg-slate-800 text-white rounded font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
