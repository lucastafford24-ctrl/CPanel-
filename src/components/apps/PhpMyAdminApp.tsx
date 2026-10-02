import React, { useState } from 'react';
import { 
  Database, 
  Table, 
  Play, 
  Code, 
  FileDown, 
  PlusCircle, 
  Server, 
  Search, 
  X, 
  Check, 
  ExternalLink,
  ChevronRight,
  RefreshCw,
  Edit2,
  Trash
} from 'lucide-react';

interface PhpMyAdminAppProps {
  onClose: () => void;
}

interface TableRecord {
  [key: string]: any;
}

export const PhpMyAdminApp: React.FC<PhpMyAdminAppProps> = ({ onClose }) => {
  const [selectedDb, setSelectedDb] = useState<string>('demouser_wp');
  const [selectedTable, setSelectedTable] = useState<string>('wp_options');
  const [activeTab, setActiveTab] = useState<'browse' | 'structure' | 'sql' | 'insert' | 'export'>('browse');
  const [sqlQuery, setSqlQuery] = useState<string>('SELECT * FROM `wp_options` WHERE `autoload` = "yes" LIMIT 10;');
  const [queryFeedback, setQueryFeedback] = useState<string | null>(null);

  // Mock table schemas
  const tablesMap: Record<string, string[]> = {
    demouser_wp: ['wp_options', 'wp_posts', 'wp_users', 'wp_comments', 'wp_terms'],
    demouser_shop: ['orders', 'products', 'customers', 'inventory'],
    demouser_analytics: ['page_views', 'sessions', 'conversions'],
  };

  // Mock table rows
  const [tableData, setTableData] = useState<Record<string, TableRecord[]>>({
    wp_options: [
      { option_id: 1, option_name: 'siteurl', option_value: 'https://example-corp.com', autoload: 'yes' },
      { option_id: 2, option_name: 'home', option_value: 'https://example-corp.com', autoload: 'yes' },
      { option_id: 3, option_name: 'blogname', option_value: 'Example Corp Official', autoload: 'yes' },
      { option_id: 4, option_name: 'admin_email', option_value: 'admin@example-corp.com', autoload: 'yes' },
      { option_id: 5, option_name: 'users_can_register', option_value: '0', autoload: 'yes' },
      { option_id: 6, option_name: 'active_plugins', option_value: 'a:4:{i:0;s:19:"akismet/akismet.php";...}', autoload: 'yes' },
      { option_id: 7, option_name: 'template', option_value: 'twentytwentyfour', autoload: 'yes' },
    ],
    wp_posts: [
      { ID: 1, post_author: 1, post_date: '2026-09-10 12:00:00', post_title: 'Welcome to Example Corp', post_status: 'publish', comment_count: 3 },
      { ID: 2, post_author: 1, post_date: '2026-09-18 15:30:00', post_title: 'Q3 Product Innovations', post_status: 'publish', comment_count: 0 },
      { ID: 3, post_author: 2, post_date: '2026-09-29 09:12:00', post_title: 'Customer Success Stories', post_status: 'draft', comment_count: 0 },
    ],
    wp_users: [
      { ID: 1, user_login: 'demoadmin', user_email: 'admin@example-corp.com', user_registered: '2026-01-10', display_name: 'System Administrator' },
      { ID: 2, user_login: 'editor_sarah', user_email: 'sarah@example-corp.com', user_registered: '2026-02-14', display_name: 'Sarah Jenkins' },
    ]
  });

  const currentRecords = tableData[selectedTable] || [
    { id: 101, name: 'Record Alpha', status: 'active', created_at: '2026-10-01' },
    { id: 102, name: 'Record Beta', status: 'pending', created_at: '2026-10-02' },
  ];

  const columns = currentRecords.length > 0 ? Object.keys(currentRecords[0]) : [];

  const handleExecuteSql = () => {
    setQueryFeedback('Showing rows 0 - 2 (3 total, Query took 0.0004 seconds)');
    setActiveTab('browse');
  };

  const handleExport = () => {
    const text = `-- phpMyAdmin SQL Dump\n-- version 5.2.1\n-- Host: localhost:3306\n-- Generation Time: Oct 02, 2026\n-- Server version: 8.0.35\n-- Database: \`${selectedDb}\`\n\nCREATE DATABASE IF NOT EXISTS \`${selectedDb}\`;\nUSE \`${selectedDb}\`;\n`;
    const blob = new Blob([text], { type: 'text/sql' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedDb}.sql`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white dark:bg-[#0f172a] rounded-lg border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col h-[82vh] overflow-hidden">
      {/* phpMyAdmin Top Masthead */}
      <div className="px-4 py-2.5 bg-[#4c5f70] text-white flex items-center justify-between border-b border-slate-600">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-bold tracking-tight">
            <span className="text-amber-300 text-base">phpMyAdmin</span>
            <span className="text-[10px] text-slate-300 font-mono">v5.2.1</span>
          </div>
          <span className="text-xs text-slate-300">|</span>
          <div className="flex items-center gap-1 text-xs text-slate-200 font-mono">
            <Server className="w-3.5 h-3.5 text-amber-300" />
            <span>Server: 127.0.0.1:3306</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="text-slate-300 hover:text-white p-1 rounded hover:bg-slate-600"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Breadcrumb Path & Tabs Bar */}
      <div className="bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-3 py-2 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
          <Server className="w-3.5 h-3.5 text-slate-500" />
          <span>localhost</span>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <Database className="w-3.5 h-3.5 text-[#ff6c2c]" />
          <span className="font-mono text-slate-900 dark:text-white">{selectedDb}</span>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <Table className="w-3.5 h-3.5 text-blue-500" />
          <span className="font-mono text-[#ff6c2c]">{selectedTable}</span>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1 bg-slate-200 dark:bg-slate-800 p-0.5 rounded-md">
          <button
            onClick={() => setActiveTab('browse')}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
              activeTab === 'browse' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Browse
          </button>
          <button
            onClick={() => setActiveTab('structure')}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
              activeTab === 'structure' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Structure
          </button>
          <button
            onClick={() => setActiveTab('sql')}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
              activeTab === 'sql' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            SQL
          </button>
          <button
            onClick={() => setActiveTab('export')}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
              activeTab === 'export' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Export
          </button>
        </div>
      </div>

      {/* Main Body: Left DB Tree + Right Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Tree Navigator */}
        <div className="w-56 border-r border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 p-2 overflow-y-auto text-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-1">
            Databases ({Object.keys(tablesMap).length})
          </div>
          <div className="space-y-2">
            {Object.keys(tablesMap).map(dbName => {
              const isCurrentDb = dbName === selectedDb;
              const tables = tablesMap[dbName] || [];

              return (
                <div key={dbName} className="space-y-1">
                  <button
                    onClick={() => {
                      setSelectedDb(dbName);
                      if (tables.length > 0) setSelectedTable(tables[0]);
                    }}
                    className={`w-full flex items-center gap-1.5 px-2 py-1 rounded text-left font-mono font-medium ${
                      isCurrentDb ? 'bg-slate-200 dark:bg-slate-800 text-[#ff6c2c]' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <Database className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span className="truncate">{dbName}</span>
                  </button>

                  {isCurrentDb && (
                    <div className="pl-4 space-y-0.5 border-l border-slate-200 dark:border-slate-800 ml-2">
                      {tables.map(tbl => (
                        <button
                          key={tbl}
                          onClick={() => setSelectedTable(tbl)}
                          className={`w-full flex items-center gap-1.5 px-2 py-0.5 rounded text-left font-mono text-[11px] ${
                            selectedTable === tbl ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 font-bold' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          <Table className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">{tbl}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Tab Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {queryFeedback && (
            <div className="mb-3 p-2.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded text-xs text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
              <span className="font-mono">{queryFeedback}</span>
              <button onClick={() => setQueryFeedback(null)} className="text-emerald-600 hover:text-emerald-900">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {activeTab === 'browse' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  Showing records in <strong>{selectedDb}.{selectedTable}</strong>
                </span>
                <span className="text-slate-400 font-mono">Total rows: {currentRecords.length}</span>
              </div>

              <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-x-auto shadow-2xs">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-semibold text-slate-600 dark:text-slate-300 uppercase">
                    <tr>
                      <th className="py-2 px-3 text-center w-16">Action</th>
                      {columns.map(col => (
                        <th key={col} className="py-2 px-3 font-mono">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-[11px]">
                    {currentRecords.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="py-2 px-3 text-center">
                          <div className="flex items-center justify-center gap-1 text-slate-400">
                            <button className="hover:text-blue-500" title="Edit row">
                              <Edit2 className="w-3 h-3" />
                            </button>
                            <button className="hover:text-rose-500" title="Delete row">
                              <Trash className="w-3 h-3" />
                            </button>
                          </div>
                        </td>
                        {columns.map(col => (
                          <td key={col} className="py-2 px-3 truncate max-w-xs text-slate-800 dark:text-slate-200">
                            {String(row[col])}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'structure' && (
            <div className="space-y-4">
              <h3 className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Table Structure: {selectedTable}
              </h3>
              <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 font-semibold text-slate-600 dark:text-slate-300">
                    <tr>
                      <th className="py-2 px-3">#</th>
                      <th className="py-2 px-3">Column</th>
                      <th className="py-2 px-3">Type</th>
                      <th className="py-2 px-3">Collation</th>
                      <th className="py-2 px-3">Null</th>
                      <th className="py-2 px-3">Key</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-xs">
                    {columns.map((col, idx) => (
                      <tr key={col}>
                        <td className="py-2 px-3 text-slate-400">{idx + 1}</td>
                        <td className="py-2 px-3 font-semibold text-blue-600 dark:text-blue-400">{col}</td>
                        <td className="py-2 px-3 text-slate-600 dark:text-slate-400">
                          {col.includes('id') || col.includes('ID') ? 'bigint(20) unsigned' : col.includes('date') ? 'datetime' : 'varchar(255)'}
                        </td>
                        <td className="py-2 px-3 text-slate-500">utf8mb4_unicode_ci</td>
                        <td className="py-2 px-3 text-slate-500">No</td>
                        <td className="py-2 px-3 font-bold text-amber-500">{idx === 0 ? 'PRI' : ''}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'sql' && (
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Run SQL query/queries on database <code>{selectedDb}</code>:
              </h3>
              <div className="border border-slate-300 dark:border-slate-700 rounded-lg overflow-hidden">
                <textarea
                  value={sqlQuery}
                  onChange={(e) => setSqlQuery(e.target.value)}
                  rows={6}
                  className="w-full p-3 bg-slate-900 text-emerald-400 font-mono text-xs focus:outline-none"
                  spellCheck={false}
                />
                <div className="p-2 bg-slate-800 border-t border-slate-700 flex justify-between items-center">
                  <span className="text-[11px] text-slate-400">Delimiter: ;</span>
                  <button
                    onClick={handleExecuteSql}
                    className="px-4 py-1.5 bg-[#ff6c2c] hover:bg-[#e85b1c] text-white rounded text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Go (Execute)</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'export' && (
            <div className="max-w-lg space-y-4 text-xs">
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                Exporting tables from "{selectedDb}" database
              </h3>
              <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-900/50 space-y-3">
                <div className="font-medium text-slate-700 dark:text-slate-300">Export Method:</div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="export-method" defaultChecked />
                  <span>Quick - display only the minimal options</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="export-method" />
                  <span>Custom - display all possible options</span>
                </label>

                <div className="pt-2 font-medium text-slate-700 dark:text-slate-300">Format:</div>
                <select className="px-3 py-1.5 border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 text-xs w-full">
                  <option>SQL</option>
                  <option>CSV</option>
                  <option>JSON</option>
                  <option>XML</option>
                </select>

                <button
                  onClick={handleExport}
                  className="mt-3 px-5 py-2 bg-[#ff6c2c] hover:bg-[#e85b1c] text-white rounded text-xs font-semibold flex items-center gap-2 shadow-xs"
                >
                  <FileDown className="w-4 h-4" />
                  <span>Export Database SQL</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
