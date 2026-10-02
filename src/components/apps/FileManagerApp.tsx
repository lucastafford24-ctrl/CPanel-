import React, { useState } from 'react';
import { FileItem } from '../../types/cpanel';
import { 
  Folder, 
  FileText, 
  FolderPlus, 
  FilePlus, 
  Upload, 
  Download, 
  Trash2, 
  Edit3, 
  Key, 
  RefreshCw, 
  ArrowUp, 
  Home, 
  Search, 
  X, 
  Check,
  ChevronRight,
  HardDrive,
  FileCode,
  Eye
} from 'lucide-react';

interface FileManagerAppProps {
  files: FileItem[];
  onUpdateFiles: (newFiles: FileItem[]) => void;
  onClose: () => void;
}

export const FileManagerApp: React.FC<FileManagerAppProps> = ({
  files,
  onUpdateFiles,
  onClose
}) => {
  const [currentPath, setCurrentPath] = useState<string>('/home/demouser/public_html');
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [searchFilter, setSearchFilter] = useState('');
  
  // Modals state
  const [showEditorModal, setShowEditorModal] = useState(false);
  const [editingFile, setEditingFile] = useState<FileItem | null>(null);
  const [editorContent, setEditorContent] = useState('');
  
  const [showChmodModal, setShowChmodModal] = useState(false);
  const [chmodTarget, setChmodTarget] = useState<FileItem | null>(null);
  const [userPerm, setUserPerm] = useState({ r: true, w: true, x: false });
  const [groupPerm, setGroupPerm] = useState({ r: true, w: false, x: false });
  const [worldPerm, setWorldPerm] = useState({ r: true, w: false, x: false });

  const [showNewFileDialog, setShowNewFileDialog] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [newFileType, setNewFileType] = useState<'file' | 'folder'>('file');

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Filter current directory items
  const currentItems = files.filter(f => {
    const isSamePath = f.path === currentPath;
    if (!isSamePath) return false;
    if (!searchFilter) return true;
    return f.name.toLowerCase().includes(searchFilter.toLowerCase());
  });

  const selectedItem = files.find(f => f.id === selectedFileId);

  // Path navigation handlers
  const handleNavigateUp = () => {
    if (currentPath === '/home/demouser') return;
    const parts = currentPath.split('/').filter(Boolean);
    parts.pop();
    setCurrentPath('/' + parts.join('/'));
    setSelectedFileId(null);
  };

  const handleOpenFolder = (folderName: string) => {
    const newPath = currentPath.endsWith('/') 
      ? `${currentPath}${folderName}` 
      : `${currentPath}/${folderName}`;
    setCurrentPath(newPath);
    setSelectedFileId(null);
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  // Actions
  const handleEditClick = (item?: FileItem) => {
    const target = item || selectedItem;
    if (!target || target.type === 'directory') return;
    setEditingFile(target);
    setEditorContent(target.content || `/* ${target.name} */\n// Empty file`);
    setShowEditorModal(true);
  };

  const handleSaveEditor = () => {
    if (!editingFile) return;
    const updated = files.map(f => 
      f.id === editingFile.id 
        ? { ...f, content: editorContent, size: editorContent.length, modified: new Date().toISOString().replace('T', ' ').slice(0, 19) }
        : f
    );
    onUpdateFiles(updated);
    setShowEditorModal(false);
    showToast(`Saved changes to ${editingFile.name} successfully.`);
  };

  const handleChmodClick = (item?: FileItem) => {
    const target = item || selectedItem;
    if (!target) return;
    setChmodTarget(target);
    const p = target.permissions || '0644';
    // parse 0755
    const u = parseInt(p[1] || '6', 10);
    const g = parseInt(p[2] || '4', 10);
    const w = parseInt(p[3] || '4', 10);
    setUserPerm({ r: Boolean(u & 4), w: Boolean(u & 2), x: Boolean(u & 1) });
    setGroupPerm({ r: Boolean(g & 4), w: Boolean(g & 2), x: Boolean(g & 1) });
    setWorldPerm({ r: Boolean(w & 4), w: Boolean(w & 2), x: Boolean(w & 1) });
    setShowChmodModal(true);
  };

  const handleSaveChmod = () => {
    if (!chmodTarget) return;
    const u = (userPerm.r ? 4 : 0) + (userPerm.w ? 2 : 0) + (userPerm.x ? 1 : 0);
    const g = (groupPerm.r ? 4 : 0) + (groupPerm.w ? 2 : 0) + (groupPerm.x ? 1 : 0);
    const w = (worldPerm.r ? 4 : 0) + (worldPerm.w ? 2 : 0) + (worldPerm.x ? 1 : 0);
    const newPerm = `0${u}${g}${w}`;

    const updated = files.map(f => 
      f.id === chmodTarget.id ? { ...f, permissions: newPerm } : f
    );
    onUpdateFiles(updated);
    setShowChmodModal(false);
    showToast(`Permissions updated to ${newPerm} for ${chmodTarget.name}`);
  };

  const handleDelete = () => {
    if (!selectedItem) return;
    if (confirm(`Are you sure you want to remove '${selectedItem.name}'?`)) {
      onUpdateFiles(files.filter(f => f.id !== selectedItem.id));
      setSelectedFileId(null);
      showToast(`Removed ${selectedItem.name}`);
    }
  };

  const handleCreateNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName.trim()) return;

    const newItem: FileItem = {
      id: `file_${Date.now()}`,
      name: newFileName.trim(),
      path: currentPath,
      type: newFileType === 'folder' ? 'directory' : 'file',
      size: newFileType === 'folder' ? 4096 : 0,
      modified: new Date().toISOString().replace('T', ' ').slice(0, 19),
      permissions: newFileType === 'folder' ? '0755' : '0644',
      extension: newFileType === 'file' ? newFileName.split('.').pop() || 'txt' : undefined,
      content: newFileType === 'file' ? `/* Created in cPanel File Manager */\n` : undefined
    };

    onUpdateFiles([...files, newItem]);
    setShowNewFileDialog(false);
    setNewFileName('');
    showToast(`Created new ${newFileType}: ${newItem.name}`);
  };

  const handleUploadSimulate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;
    const file = fileList[0];

    setUploadProgress(10);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (!prev || prev >= 100) {
          clearInterval(interval);
          // Add uploaded file
          const uploadedFile: FileItem = {
            id: `up_${Date.now()}`,
            name: file.name,
            path: currentPath,
            type: 'file',
            size: file.size || 12400,
            modified: new Date().toISOString().replace('T', ' ').slice(0, 19),
            permissions: '0644',
            extension: file.name.split('.').pop() || 'txt',
            content: `// Uploaded file content: ${file.name}`
          };
          onUpdateFiles([...files, uploadedFile]);
          setTimeout(() => {
            setShowUploadModal(false);
            setUploadProgress(null);
            showToast(`Uploaded ${file.name} successfully.`);
          }, 400);
          return 100;
        }
        return prev + 30;
      });
    }, 250);
  };

  return (
    <div className="bg-white dark:bg-[#0f172a] rounded-lg border border-slate-200 dark:border-slate-800 shadow-lg flex flex-col h-[82vh] overflow-hidden">
      {/* Toast alert */}
      {toastMessage && (
        <div className="absolute top-20 right-6 z-50 bg-slate-900 text-white px-4 py-2 rounded-md shadow-xl border border-slate-700 text-xs flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* App Header */}
      <div className="px-4 py-3 bg-slate-800 text-white flex items-center justify-between border-b border-slate-700">
        <div className="flex items-center gap-2">
          <HardDrive className="w-4 h-4 text-[#ff6c2c]" />
          <h2 className="text-sm font-semibold">File Manager</h2>
          <span className="text-[11px] text-slate-400">({currentPath})</span>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-700 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Top Action Toolbar */}
      <div className="p-2 bg-slate-100 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center gap-1.5 text-xs">
        <button
          onClick={() => { setNewFileType('file'); setShowNewFileDialog(true); }}
          className="px-2.5 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition-colors font-medium"
        >
          <FilePlus className="w-3.5 h-3.5 text-emerald-600" />
          <span>+ File</span>
        </button>

        <button
          onClick={() => { setNewFileType('folder'); setShowNewFileDialog(true); }}
          className="px-2.5 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition-colors font-medium"
        >
          <FolderPlus className="w-3.5 h-3.5 text-amber-500" />
          <span>+ Folder</span>
        </button>

        <div className="h-4 w-px bg-slate-300 dark:bg-slate-700 mx-1" />

        <button
          onClick={() => setShowUploadModal(true)}
          className="px-2.5 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition-colors font-medium"
        >
          <Upload className="w-3.5 h-3.5 text-blue-500" />
          <span>Upload</span>
        </button>

        <button
          disabled={!selectedItem || selectedItem.type === 'directory'}
          onClick={() => handleEditClick()}
          className="px-2.5 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition-colors font-medium disabled:opacity-40"
        >
          <Edit3 className="w-3.5 h-3.5 text-sky-500" />
          <span>Edit</span>
        </button>

        <button
          disabled={!selectedItem}
          onClick={() => handleChmodClick()}
          className="px-2.5 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition-colors font-medium disabled:opacity-40"
        >
          <Key className="w-3.5 h-3.5 text-purple-500" />
          <span>Permissions</span>
        </button>

        <button
          disabled={!selectedItem}
          onClick={handleDelete}
          className="px-2.5 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded text-rose-600 dark:text-rose-400 flex items-center gap-1.5 transition-colors font-medium disabled:opacity-40"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Delete</span>
        </button>
      </div>

      {/* Path Breadcrumbs Bar & Search */}
      <div className="px-3 py-2 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1.5 min-w-0 flex-1">
          <button
            onClick={() => setCurrentPath('/home/demouser')}
            className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
            title="Home Directory"
          >
            <Home className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleNavigateUp}
            disabled={currentPath === '/home/demouser'}
            className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-30"
            title="Up One Level"
          >
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
          
          <div className="flex items-center gap-1 font-mono text-xs text-slate-600 dark:text-slate-300 px-2 py-1 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 flex-1 truncate">
            {currentPath}
          </div>
        </div>

        <div className="relative w-44">
          <Search className="w-3 h-3 text-slate-400 absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Filter files..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full bg-white dark:bg-slate-800 text-xs pl-7 pr-2 py-1 rounded border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-[#ff6c2c]"
          />
        </div>
      </div>

      {/* Main Split: Directory Tree + File Table */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Tree */}
        <div className="w-52 border-r border-slate-200 dark:border-slate-800 p-2 overflow-y-auto bg-slate-50/40 dark:bg-slate-900/20 text-xs">
          <div className="font-semibold text-[11px] uppercase tracking-wider text-slate-400 mb-2 px-1">
            Directory Tree
          </div>
          <div className="space-y-0.5">
            <button
              onClick={() => setCurrentPath('/home/demouser')}
              className={`w-full flex items-center gap-1.5 px-2 py-1 rounded text-left ${
                currentPath === '/home/demouser' ? 'bg-[#ff6c2c] text-white font-medium' : 'hover:bg-slate-200/60 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <Folder className="w-3.5 h-3.5 shrink-0 text-amber-400" />
              <span className="truncate">/home/demouser</span>
            </button>

            <button
              onClick={() => setCurrentPath('/home/demouser/public_html')}
              className={`w-full flex items-center gap-1.5 px-2 py-1 pl-4 rounded text-left ${
                currentPath === '/home/demouser/public_html' ? 'bg-[#ff6c2c] text-white font-medium' : 'hover:bg-slate-200/60 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <Folder className="w-3.5 h-3.5 shrink-0 text-amber-500" />
              <span className="truncate">public_html</span>
            </button>

            <button
              onClick={() => setCurrentPath('/home/demouser/mail')}
              className={`w-full flex items-center gap-1.5 px-2 py-1 pl-4 rounded text-left ${
                currentPath === '/home/demouser/mail' ? 'bg-[#ff6c2c] text-white font-medium' : 'hover:bg-slate-200/60 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <Folder className="w-3.5 h-3.5 shrink-0 text-amber-500" />
              <span className="truncate">mail</span>
            </button>

            <button
              onClick={() => setCurrentPath('/home/demouser/ssl')}
              className={`w-full flex items-center gap-1.5 px-2 py-1 pl-4 rounded text-left ${
                currentPath === '/home/demouser/ssl' ? 'bg-[#ff6c2c] text-white font-medium' : 'hover:bg-slate-200/60 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <Folder className="w-3.5 h-3.5 shrink-0 text-amber-500" />
              <span className="truncate">ssl</span>
            </button>

            <button
              onClick={() => setCurrentPath('/home/demouser/etc')}
              className={`w-full flex items-center gap-1.5 px-2 py-1 pl-4 rounded text-left ${
                currentPath === '/home/demouser/etc' ? 'bg-[#ff6c2c] text-white font-medium' : 'hover:bg-slate-200/60 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <Folder className="w-3.5 h-3.5 shrink-0 text-amber-500" />
              <span className="truncate">etc</span>
            </button>

            <button
              onClick={() => setCurrentPath('/home/demouser/tmp')}
              className={`w-full flex items-center gap-1.5 px-2 py-1 pl-4 rounded text-left ${
                currentPath === '/home/demouser/tmp' ? 'bg-[#ff6c2c] text-white font-medium' : 'hover:bg-slate-200/60 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <Folder className="w-3.5 h-3.5 shrink-0 text-amber-500" />
              <span className="truncate">tmp</span>
            </button>
          </div>
        </div>

        {/* Right Table */}
        <div className="flex-1 overflow-y-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 text-[11px] uppercase font-semibold text-slate-500 dark:text-slate-400">
              <tr>
                <th className="py-2 px-3">Name</th>
                <th className="py-2 px-3 text-right">Size</th>
                <th className="py-2 px-3">Last Modified</th>
                <th className="py-2 px-3 font-mono text-center">Perms</th>
                <th className="py-2 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 font-sans">
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    This directory is empty or no files matched the filter.
                  </td>
                </tr>
              ) : (
                currentItems.map(item => {
                  const isSelected = item.id === selectedFileId;
                  const isDir = item.type === 'directory';

                  return (
                    <tr
                      key={item.id}
                      onClick={() => setSelectedFileId(item.id)}
                      onDoubleClick={() => {
                        if (isDir) handleOpenFolder(item.name);
                        else handleEditClick(item);
                      }}
                      className={`cursor-pointer transition-colors ${
                        isSelected 
                          ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-100' 
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <td className="py-2 px-3 flex items-center gap-2">
                        {isDir ? (
                          <Folder className="w-4 h-4 text-amber-500 shrink-0" />
                        ) : (
                          <FileCode className="w-4 h-4 text-sky-500 shrink-0" />
                        )}
                        <span className="font-medium">{item.name}</span>
                      </td>
                      <td className="py-2 px-3 font-mono tabular-nums text-right text-slate-500 dark:text-slate-400">
                        {isDir ? '4 KB' : formatBytes(item.size)}
                      </td>
                      <td className="py-2 px-3 font-mono text-slate-500 dark:text-slate-400 text-[11px]">
                        {item.modified}
                      </td>
                      <td className="py-2 px-3 font-mono text-center text-[11px] text-slate-600 dark:text-slate-300">
                        {item.permissions}
                      </td>
                      <td className="py-2 px-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {!isDir && (
                            <button
                              onClick={(e) => { e.stopPropagation(); handleEditClick(item); }}
                              className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-500 hover:text-slate-900"
                              title="Edit Code"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            onClick={(e) => { e.stopPropagation(); handleChmodClick(item); }}
                            className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-500 hover:text-slate-900"
                            title="Change Permissions"
                          >
                            <Key className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Status Bar */}
      <div className="px-3 py-1.5 bg-slate-100 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
        <span>{currentItems.length} items in current view</span>
        {selectedItem && (
          <span className="font-mono">
            Selected: {selectedItem.name} ({formatBytes(selectedItem.size)})
          </span>
        )}
      </div>

      {/* Code Editor Modal */}
      {showEditorModal && editingFile && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-slate-900 rounded-lg max-w-4xl w-full h-[80vh] flex flex-col border border-slate-700 shadow-2xl overflow-hidden">
            <div className="px-4 py-2.5 bg-slate-800 text-white flex items-center justify-between border-b border-slate-700">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-[#ff6c2c]" />
                <span className="text-xs font-semibold">Editing: {editingFile.name}</span>
                <span className="text-[10px] bg-slate-700 px-1.5 py-0.5 rounded font-mono text-slate-300">
                  {editingFile.path}
                </span>
              </div>
              <button 
                onClick={() => setShowEditorModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 p-2 bg-slate-950 font-mono text-xs text-slate-200 overflow-hidden flex flex-col">
              <div className="px-2 py-1 text-[11px] text-slate-400 border-b border-slate-800 flex justify-between">
                <span>UTF-8 · Line count: {editorContent.split('\n').length}</span>
                <span className="text-emerald-400">cPanel Code Editor v120</span>
              </div>
              <textarea
                value={editorContent}
                onChange={(e) => setEditorContent(e.target.value)}
                className="flex-1 w-full bg-transparent text-emerald-300 p-2 font-mono text-xs resize-none focus:outline-none leading-relaxed"
                spellCheck={false}
              />
            </div>

            <div className="px-4 py-2.5 bg-slate-800 border-t border-slate-700 flex justify-end gap-2 text-xs">
              <button
                onClick={() => setShowEditorModal(false)}
                className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEditor}
                className="px-4 py-1.5 bg-[#ff6c2c] hover:bg-[#e85b1c] text-white font-medium rounded transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Permissions Chmod Modal */}
      {showChmodModal && chmodTarget && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 rounded-lg max-w-sm w-full border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden p-4 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Change Permissions</h3>
              <button onClick={() => setShowChmodModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Set file permissions for <strong>{chmodTarget.name}</strong>:
            </p>

            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="p-2 border border-slate-200 dark:border-slate-800 rounded space-y-1">
                <span className="font-semibold block text-slate-700 dark:text-slate-300">User</span>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="checkbox" checked={userPerm.r} onChange={e => setUserPerm({ ...userPerm, r: e.target.checked })} />
                  <span>Read</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="checkbox" checked={userPerm.w} onChange={e => setUserPerm({ ...userPerm, w: e.target.checked })} />
                  <span>Write</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="checkbox" checked={userPerm.x} onChange={e => setUserPerm({ ...userPerm, x: e.target.checked })} />
                  <span>Execute</span>
                </label>
              </div>

              <div className="p-2 border border-slate-200 dark:border-slate-800 rounded space-y-1">
                <span className="font-semibold block text-slate-700 dark:text-slate-300">Group</span>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="checkbox" checked={groupPerm.r} onChange={e => setGroupPerm({ ...groupPerm, r: e.target.checked })} />
                  <span>Read</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="checkbox" checked={groupPerm.w} onChange={e => setGroupPerm({ ...groupPerm, w: e.target.checked })} />
                  <span>Write</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="checkbox" checked={groupPerm.x} onChange={e => setGroupPerm({ ...groupPerm, x: e.target.checked })} />
                  <span>Execute</span>
                </label>
              </div>

              <div className="p-2 border border-slate-200 dark:border-slate-800 rounded space-y-1">
                <span className="font-semibold block text-slate-700 dark:text-slate-300">World</span>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="checkbox" checked={worldPerm.r} onChange={e => setWorldPerm({ ...worldPerm, r: e.target.checked })} />
                  <span>Read</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="checkbox" checked={worldPerm.w} onChange={e => setWorldPerm({ ...worldPerm, w: e.target.checked })} />
                  <span>Write</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="checkbox" checked={worldPerm.x} onChange={e => setWorldPerm({ ...worldPerm, x: e.target.checked })} />
                  <span>Execute</span>
                </label>
              </div>
            </div>

            <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded text-center font-mono text-xs">
              Resulting Permission: 0
              {(userPerm.r ? 4 : 0) + (userPerm.w ? 2 : 0) + (userPerm.x ? 1 : 0)}
              {(groupPerm.r ? 4 : 0) + (groupPerm.w ? 2 : 0) + (groupPerm.x ? 1 : 0)}
              {(worldPerm.r ? 4 : 0) + (worldPerm.w ? 2 : 0) + (worldPerm.x ? 1 : 0)}
            </div>

            <div className="flex justify-end gap-2 text-xs pt-2">
              <button onClick={() => setShowChmodModal(false)} className="px-3 py-1.5 bg-slate-200 dark:bg-slate-800 rounded">
                Cancel
              </button>
              <button onClick={handleSaveChmod} className="px-3 py-1.5 bg-[#ff6c2c] text-white rounded font-medium">
                Save Permissions
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New File / Folder Modal */}
      {showNewFileDialog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <form onSubmit={handleCreateNewItem} className="bg-white dark:bg-slate-900 rounded-lg max-w-sm w-full border border-slate-200 dark:border-slate-800 p-4 space-y-3 shadow-xl">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Create New {newFileType === 'file' ? 'File' : 'Folder'}
            </h3>
            <p className="text-xs text-slate-500">
              Path: <code className="font-mono">{currentPath}</code>
            </p>
            <input
              type="text"
              autoFocus
              placeholder={newFileType === 'file' ? 'e.g. script.js or config.json' : 'e.g. assets'}
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded focus:outline-none focus:border-[#ff6c2c]"
            />
            <div className="flex justify-end gap-2 text-xs pt-2">
              <button type="button" onClick={() => setShowNewFileDialog(false)} className="px-3 py-1.5 bg-slate-200 dark:bg-slate-800 rounded">
                Cancel
              </button>
              <button type="submit" className="px-3 py-1.5 bg-[#ff6c2c] text-white rounded font-medium">
                Create
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 rounded-lg max-w-md w-full border border-slate-200 dark:border-slate-800 p-5 space-y-4 shadow-xl">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Upload Files</h3>
              <button onClick={() => setShowUploadModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Uploading to: <code className="font-mono text-slate-700 dark:text-slate-300">{currentPath}</code>
            </p>

            <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-6 text-center hover:border-[#ff6c2c] transition-colors">
              <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                Select a file from your computer to upload to cPanel
              </p>
              <input
                type="file"
                onChange={handleUploadSimulate}
                className="mt-3 text-xs text-slate-500 file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:bg-[#ff6c2c] file:text-white file:cursor-pointer"
              />
            </div>

            {uploadProgress !== null && (
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-600 font-mono">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-[#ff6c2c] transition-all" style={{ width: `${uploadProgress}%` }} />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
