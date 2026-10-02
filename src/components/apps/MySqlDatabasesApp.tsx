import React, { useState } from 'react';
import { DatabaseRecord } from '../../types/cpanel';
import { 
  Layers, 
  PlusCircle, 
  Trash2, 
  UserCheck, 
  Check, 
  X, 
  ShieldCheck, 
  Key, 
  RefreshCw 
} from 'lucide-react';

interface MySqlDatabasesAppProps {
  databases: DatabaseRecord[];
  onUpdateDatabases: (dbs: DatabaseRecord[]) => void;
  onClose: () => void;
}

export const MySqlDatabasesApp: React.FC<MySqlDatabasesAppProps> = ({
  databases,
  onUpdateDatabases,
  onClose
}) => {
  const [newDbSuffix, setNewDbSuffix] = useState('');
  const [newUserName, setNewUserName] = useState('');
  const [newUserPass, setNewUserPass] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Privileges modal
  const [showPrivilegesModal, setShowPrivilegesModal] = useState(false);
  const [privilegeUser, setPrivilegeUser] = useState('demouser_admin');
  const [privilegeDb, setPrivilegeDb] = useState(databases[0]?.name || 'demouser_wp');
  const [privileges, setPrivileges] = useState<Record<string, boolean>>({
    ALL: true,
    SELECT: true,
    INSERT: true,
    UPDATE: true,
    DELETE: true,
    CREATE: true,
    DROP: true,
    INDEX: true,
    ALTER: true,
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleCreateDatabase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDbSuffix.trim()) return;
    const dbName = `demouser_${newDbSuffix.trim().toLowerCase().replace(/[^a-z0-9_]/g, '')}`;
    
    if (databases.some(d => d.name === dbName)) {
      alert(`Database ${dbName} already exists.`);
      return;
    }

    const newDb: DatabaseRecord = {
      name: dbName,
      sizeMb: 0.1,
      users: ['demouser_admin'],
      tablesCount: 0
    };

    onUpdateDatabases([...databases, newDb]);
    setNewDbSuffix('');
    showToast(`Database '${dbName}' created successfully.`);
  };

  const handleDeleteDb = (name: string) => {
    if (confirm(`Are you certain you want to permanently delete '${name}'? This cannot be undone.`)) {
      onUpdateDatabases(databases.filter(d => d.name !== name));
      showToast(`Database '${name}' deleted.`);
    }
  };

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
    let res = '';
    for (let i = 0; i < 16; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewUserPass(res);
  };

  const handleTogglePrivilege = (key: string) => {
    if (key === 'ALL') {
      const target = !privileges.ALL;
      const updated: Record<string, boolean> = {};
      Object.keys(privileges).forEach(k => { updated[k] = target; });
      setPrivileges(updated);
    } else {
      const updated = { ...privileges, [key]: !privileges[key] };
      updated.ALL = Object.keys(updated).filter(k => k !== 'ALL').every(k => updated[k]);
      setPrivileges(updated);
    }
  };

  const handleSavePrivileges = () => {
    setShowPrivilegesModal(false);
    showToast(`Saved privileges for ${privilegeUser} on ${privilegeDb}`);
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
          <Layers className="w-4 h-4 text-[#ff6c2c]" />
          <h2 className="text-sm font-semibold">MySQL® Databases</h2>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-700">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-6 text-xs">
        {/* Create Database Section */}
        <section className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-lg border border-slate-200 dark:border-slate-800">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-1">
            Create New Database
          </h3>
          <p className="text-xs text-slate-500 mb-3">
            Database names are prefixed with your account username.
          </p>

          <form onSubmit={handleCreateDatabase} className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <div className="flex items-center rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden">
              <span className="px-3 py-2 bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 font-mono text-xs border-r border-slate-300 dark:border-slate-700">
                demouser_
              </span>
              <input
                type="text"
                placeholder="dbname"
                value={newDbSuffix}
                onChange={(e) => setNewDbSuffix(e.target.value)}
                className="px-3 py-2 text-xs bg-transparent text-slate-900 dark:text-white focus:outline-none w-48 font-mono"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-[#ff6c2c] hover:bg-[#e85b1c] text-white rounded font-medium shadow-xs transition-colors flex items-center gap-1.5"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Create Database</span>
            </button>
          </form>
        </section>

        {/* Current Databases List */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
              Current Databases ({databases.length})
            </h3>
            <span className="text-slate-400 font-mono text-[11px]">Server: localhost:3306</span>
          </div>

          <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden shadow-2xs">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-[11px] font-semibold text-slate-600 dark:text-slate-300 uppercase">
                <tr>
                  <th className="py-2.5 px-4">Database</th>
                  <th className="py-2.5 px-4 font-mono text-right">Size</th>
                  <th className="py-2.5 px-4">Privileged Users</th>
                  <th className="py-2.5 px-4 font-mono text-center">Tables</th>
                  <th className="py-2.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {databases.map(db => (
                  <tr key={db.name} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-mono font-medium text-[#ff6c2c]">
                      {db.name}
                    </td>
                    <td className="py-3 px-4 font-mono text-right text-slate-500 tabular-nums">
                      {db.sizeMb.toFixed(1)} MB
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1 font-mono text-[11px] text-slate-700 dark:text-slate-300">
                        {db.users.join(', ')}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-center tabular-nums text-slate-500">
                      {db.tablesCount}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleDeleteDb(db.name)}
                        className="p-1 text-slate-400 hover:text-rose-500 rounded transition-colors"
                        title="Delete Database"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Add User to Database / Privileges */}
        <section className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-lg border border-slate-200 dark:border-slate-800 space-y-3">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
            Add User to Database
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-500 text-[11px] mb-1 font-medium">User:</label>
              <select
                value={privilegeUser}
                onChange={(e) => setPrivilegeUser(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 font-mono text-xs"
              >
                <option value="demouser_admin">demouser_admin</option>
                <option value="demouser_shopusr">demouser_shopusr</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-500 text-[11px] mb-1 font-medium">Database:</label>
              <select
                value={privilegeDb}
                onChange={(e) => setPrivilegeDb(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 font-mono text-xs"
              >
                {databases.map(d => (
                  <option key={d.name} value={d.name}>{d.name}</option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={() => setShowPrivilegesModal(true)}
                className="w-full py-1.5 px-4 bg-slate-800 hover:bg-slate-700 text-white rounded font-medium transition-colors"
              >
                Manage Privileges...
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Privileges Modal */}
      {showPrivilegesModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 rounded-lg max-w-md w-full border border-slate-200 dark:border-slate-800 p-5 space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                MySQL Privileges Matrix
              </h3>
              <button onClick={() => setShowPrivilegesModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Granting user <strong className="font-mono text-slate-800 dark:text-slate-200">{privilegeUser}</strong> on database <strong className="font-mono text-slate-800 dark:text-slate-200">{privilegeDb}</strong>:
            </p>

            <div className="grid grid-cols-2 gap-2 text-xs border border-slate-200 dark:border-slate-800 p-3 rounded-lg">
              {Object.keys(privileges).map(priv => (
                <label key={priv} className="flex items-center gap-2 cursor-pointer font-mono">
                  <input
                    type="checkbox"
                    checked={privileges[priv]}
                    onChange={() => handleTogglePrivilege(priv)}
                    className="accent-[#ff6c2c]"
                  />
                  <span className={priv === 'ALL' ? 'font-bold text-[#ff6c2c]' : 'text-slate-700 dark:text-slate-300'}>
                    {priv}
                  </span>
                </label>
              ))}
            </div>

            <div className="flex justify-end gap-2 text-xs pt-2">
              <button
                onClick={() => setShowPrivilegesModal(false)}
                className="px-3 py-1.5 bg-slate-200 dark:bg-slate-800 rounded font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePrivileges}
                className="px-4 py-1.5 bg-[#ff6c2c] hover:bg-[#e85b1c] text-white rounded font-medium transition-colors"
              >
                Make Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
