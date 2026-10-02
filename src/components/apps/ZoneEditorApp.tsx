import React, { useState } from 'react';
import { DnsRecord } from '../../types/cpanel';
import { 
  Network, 
  PlusCircle, 
  Trash2, 
  Edit3, 
  Search, 
  Check, 
  X, 
  Globe, 
  ArrowRightLeft,
  Server
} from 'lucide-react';

interface ZoneEditorAppProps {
  records: DnsRecord[];
  onUpdateRecords: (records: DnsRecord[]) => void;
  onClose: () => void;
}

export const ZoneEditorApp: React.FC<ZoneEditorAppProps> = ({
  records,
  onUpdateRecords,
  onClose
}) => {
  const [filterType, setFilterType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState<DnsRecord | null>(null);

  // Form fields
  const [recordName, setRecordName] = useState('example-corp.com.');
  const [recordType, setRecordType] = useState<'A' | 'AAAA' | 'CNAME' | 'MX' | 'TXT' | 'SRV'>('A');
  const [recordTtl, setRecordTtl] = useState('14400');
  const [recordValue, setRecordValue] = useState('');
  const [recordPriority, setRecordPriority] = useState('10');

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const filteredRecords = records.filter(r => {
    const matchesType = filterType === 'ALL' || r.type === filterType;
    const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          r.record.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const handleOpenAdd = (type: 'A' | 'CNAME' | 'MX' = 'A') => {
    setEditingRecord(null);
    setRecordType(type);
    setRecordName(type === 'A' ? 'subdomain.example-corp.com.' : 'example-corp.com.');
    setRecordValue(type === 'A' ? '198.51.100.42' : type === 'CNAME' ? 'example-corp.com.' : 'mail.example-corp.com.');
    setShowAddModal(true);
  };

  const handleOpenEdit = (rec: DnsRecord) => {
    setEditingRecord(rec);
    setRecordName(rec.name);
    setRecordType(rec.type);
    setRecordTtl(String(rec.ttl));
    setRecordValue(rec.record);
    if (rec.priority) setRecordPriority(String(rec.priority));
    setShowAddModal(true);
  };

  const handleSaveRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recordName || !recordValue) return;

    if (editingRecord) {
      const updated = records.map(r => 
        r.id === editingRecord.id 
          ? {
              ...r,
              name: recordName.endsWith('.') ? recordName : `${recordName}.`,
              type: recordType,
              ttl: parseInt(recordTtl, 10) || 14400,
              record: recordValue,
              priority: recordType === 'MX' ? parseInt(recordPriority, 10) : undefined
            }
          : r
      );
      onUpdateRecords(updated);
      showToast(`Updated DNS record for ${recordName}`);
    } else {
      const newRec: DnsRecord = {
        id: `dns_${Date.now()}`,
        name: recordName.endsWith('.') ? recordName : `${recordName}.`,
        type: recordType,
        ttl: parseInt(recordTtl, 10) || 14400,
        record: recordValue,
        priority: recordType === 'MX' ? parseInt(recordPriority, 10) : undefined
      };
      onUpdateRecords([...records, newRec]);
      showToast(`Added ${recordType} record for ${recordName}`);
    }

    setShowAddModal(false);
  };

  const handleDeleteRecord = (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove DNS record for '${name}'?`)) {
      onUpdateRecords(records.filter(r => r.id !== id));
      showToast(`DNS record removed.`);
    }
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
          <Network className="w-4 h-4 text-[#ff6c2c]" />
          <h2 className="text-sm font-semibold">Zone Editor (DNS)</h2>
          <span className="text-[11px] text-slate-400 font-mono">Zone: example-corp.com</span>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-700">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Quick Add Bar & Filter Controls */}
      <div className="p-3 bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => handleOpenAdd('A')}
            className="px-2.5 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 rounded font-medium text-slate-700 dark:text-slate-200"
          >
            + A Record
          </button>
          <button
            onClick={() => handleOpenAdd('CNAME')}
            className="px-2.5 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 rounded font-medium text-slate-700 dark:text-slate-200"
          >
            + CNAME Record
          </button>
          <button
            onClick={() => handleOpenAdd('MX')}
            className="px-2.5 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 rounded font-medium text-slate-700 dark:text-slate-200"
          >
            + MX Record
          </button>
        </div>

        {/* Search */}
        <div className="relative w-48">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search records..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-xs focus:outline-none focus:border-[#ff6c2c]"
          />
        </div>
      </div>

      {/* Record Type Filter Tabs */}
      <div className="px-4 py-2 bg-slate-100/70 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center gap-1 overflow-x-auto text-xs">
        {['ALL', 'A', 'AAAA', 'CNAME', 'MX', 'TXT'].map(t => (
          <button
            key={t}
            onClick={() => setFilterType(t)}
            className={`px-3 py-1 rounded font-mono font-medium transition-colors ${
              filterType === t 
                ? 'bg-slate-800 text-white dark:bg-slate-700' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            {t}
          </button>
        ))}
        <span className="ml-auto text-[11px] text-slate-500 font-mono">
          Showing {filteredRecords.length} records
        </span>
      </div>

      {/* DNS Records Table */}
      <div className="flex-1 overflow-y-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-[11px] font-semibold text-slate-600 dark:text-slate-300 uppercase sticky top-0">
            <tr>
              <th className="py-2.5 px-4">Name</th>
              <th className="py-2.5 px-3 font-mono text-center">TTL</th>
              <th className="py-2.5 px-3 font-mono text-center">Class</th>
              <th className="py-2.5 px-3 font-mono text-center">Type</th>
              <th className="py-2.5 px-4 font-mono">Record Data</th>
              <th className="py-2.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-xs">
            {filteredRecords.map(rec => (
              <tr key={rec.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                <td className="py-3 px-4 font-medium text-slate-800 dark:text-slate-200">
                  {rec.name}
                </td>
                <td className="py-3 px-3 text-center text-slate-500 tabular-nums">
                  {rec.ttl}
                </td>
                <td className="py-3 px-3 text-center text-slate-400">
                  IN
                </td>
                <td className="py-3 px-3 text-center">
                  <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                    rec.type === 'A' ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' :
                    rec.type === 'CNAME' ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300' :
                    rec.type === 'MX' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                    'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'
                  }`}>
                    {rec.type}
                  </span>
                </td>
                <td className="py-3 px-4 text-slate-700 dark:text-slate-300 max-w-md truncate">
                  {rec.priority ? `(Priority: ${rec.priority}) ` : ''}{rec.record}
                </td>
                <td className="py-3 px-4 text-right font-sans">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => handleOpenEdit(rec)}
                      className="p-1.5 text-slate-400 hover:text-blue-500 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Edit Record"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteRecord(rec.id, rec.name)}
                      className="p-1.5 text-slate-400 hover:text-rose-500 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Delete Record"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add / Edit DNS Record Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <form onSubmit={handleSaveRecord} className="bg-white dark:bg-slate-900 rounded-lg max-w-md w-full border border-slate-200 dark:border-slate-800 p-5 space-y-4 shadow-xl text-xs">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                {editingRecord ? 'Edit DNS Record' : 'Add DNS Record'}
              </h3>
              <button type="button" onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-slate-500 font-medium mb-1">Name</label>
              <input
                type="text"
                required
                value={recordName}
                onChange={(e) => setRecordName(e.target.value)}
                className="w-full px-3 py-1.5 font-mono rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-500 font-medium mb-1">TTL (Seconds)</label>
                <input
                  type="number"
                  required
                  value={recordTtl}
                  onChange={(e) => setRecordTtl(e.target.value)}
                  className="w-full px-3 py-1.5 font-mono rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-medium mb-1">Type</label>
                <select
                  value={recordType}
                  onChange={(e) => setRecordType(e.target.value as any)}
                  className="w-full px-3 py-1.5 font-mono rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                >
                  <option value="A">A</option>
                  <option value="AAAA">AAAA</option>
                  <option value="CNAME">CNAME</option>
                  <option value="MX">MX</option>
                  <option value="TXT">TXT</option>
                </select>
              </div>
            </div>

            {recordType === 'MX' && (
              <div>
                <label className="block text-slate-500 font-medium mb-1">Priority</label>
                <input
                  type="number"
                  value={recordPriority}
                  onChange={(e) => setRecordPriority(e.target.value)}
                  className="w-full px-3 py-1.5 font-mono rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                />
              </div>
            )}

            <div>
              <label className="block text-slate-500 font-medium mb-1">Record Value</label>
              <textarea
                rows={3}
                required
                value={recordValue}
                onChange={(e) => setRecordValue(e.target.value)}
                placeholder={recordType === 'A' ? '198.51.100.42' : 'Destination host or value'}
                className="w-full p-2.5 font-mono rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs resize-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-3 py-1.5 bg-slate-200 dark:bg-slate-800 rounded font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-[#ff6c2c] hover:bg-[#e85b1c] text-white rounded font-medium shadow-xs"
              >
                Save Record
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
