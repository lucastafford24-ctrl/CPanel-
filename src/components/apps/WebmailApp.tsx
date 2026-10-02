import React, { useState } from 'react';
import { EmailAccount } from '../../types/cpanel';
import { 
  Inbox, 
  Send, 
  FileText, 
  Trash2, 
  AlertOctagon, 
  Mail, 
  Reply, 
  CornerUpRight, 
  X, 
  Check, 
  Search, 
  Paperclip,
  ArrowLeft,
  RefreshCw,
  Edit
} from 'lucide-react';

interface WebmailAppProps {
  currentEmail: EmailAccount | null;
  onClose: () => void;
}

interface Message {
  id: string;
  from: string;
  to: string;
  subject: string;
  date: string;
  snippet: string;
  body: string;
  unread: boolean;
  folder: 'inbox' | 'sent' | 'drafts' | 'trash';
}

export const WebmailApp: React.FC<WebmailAppProps> = ({
  currentEmail,
  onClose
}) => {
  const activeAddress = currentEmail ? currentEmail.address : 'admin@example-corp.com';

  const [activeFolder, setActiveFolder] = useState<'inbox' | 'sent' | 'drafts' | 'trash'>('inbox');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      from: 'cPanel AutoSSL <noreply@vps-cpanel-us-east.net>',
      to: activeAddress,
      subject: 'SUCCESS: AutoSSL certificate renewed for example-corp.com',
      date: 'Today, 09:12 AM',
      snippet: 'The Let\'s Encrypt AutoSSL provider successfully installed certificates...',
      body: `Hello,\n\nThe system successfully renewed SSL certificates for:\n- example-corp.com\n- mail.example-corp.com\n- staging.example-corp.com\n\nExpiry Date: Jan 02, 2027\nKey Size: RSA 2048-bit\nProvider: Let's Encrypt Authority\n\nNo administrator action is required.\n\n--\ncPanel Automated Service`,
      unread: false,
      folder: 'inbox'
    },
    {
      id: 'm2',
      from: 'WordPress Toolkit <security@example-corp.com>',
      to: activeAddress,
      subject: 'WordPress 6.6.2 Maintenance Completed',
      date: 'Yesterday, 14:40',
      snippet: 'Automated background security patches were successfully applied...',
      body: `Notice from WordPress Toolkit:\n\nAll plugins on https://example-corp.com are up to date.\nDatabase tables were optimized and cached files purged.\n\nStatus: Healthy\nPHP runtime: 8.2.14`,
      unread: true,
      folder: 'inbox'
    },
    {
      id: 'm3',
      from: 'Billing Team <invoices@cloudprovider.com>',
      to: activeAddress,
      subject: 'Monthly Hosting Invoice #INV-2026-9921',
      date: 'Sep 30, 2026',
      snippet: 'Your invoice for Dedicated VPS & cPanel Premier License is available...',
      body: `Dear Customer,\n\nYour monthly statement for invoice #INV-2026-9921 has been processed.\nTotal: $49.00 USD\nPayment Method: Visa ending in 4022\n\nThank you for choosing our managed hosting solutions!`,
      unread: false,
      folder: 'inbox'
    }
  ]);

  const [selectedMessageId, setSelectedMessageId] = useState<string>(messages[0]?.id || 'm1');
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [composeTo, setComposeTo] = useState('');
  const [composeSubject, setComposeSubject] = useState('');
  const [composeBody, setComposeBody] = useState('');

  const folderMessages = messages.filter(m => m.folder === activeFolder);
  const activeMessage = messages.find(m => m.id === selectedMessageId);

  const handleSelectMessage = (msg: Message) => {
    setSelectedMessageId(msg.id);
    if (msg.unread) {
      setMessages(messages.map(m => m.id === msg.id ? { ...m, unread: false } : m));
    }
  };

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    const newMsg: Message = {
      id: `sent_${Date.now()}`,
      from: activeAddress,
      to: composeTo,
      subject: composeSubject || '(No Subject)',
      date: 'Just now',
      snippet: composeBody.slice(0, 50),
      body: composeBody,
      unread: false,
      folder: 'sent'
    };
    setMessages([newMsg, ...messages]);
    setShowComposeModal(false);
    setComposeTo('');
    setComposeSubject('');
    setComposeBody('');
    alert(`Email successfully dispatched via local sendmail MTA!`);
  };

  const handleDeleteMessage = (id: string) => {
    setMessages(messages.filter(m => m.id !== id));
    const remaining = messages.filter(m => m.id !== id && m.folder === activeFolder);
    if (remaining.length > 0) setSelectedMessageId(remaining[0].id);
  };

  return (
    <div className="bg-white dark:bg-[#0f172a] rounded-lg border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col h-[82vh] overflow-hidden">
      {/* Webmail Top Bar */}
      <div className="px-4 py-2.5 bg-[#1b3a57] text-white flex items-center justify-between border-b border-slate-700">
        <div className="flex items-center gap-3">
          <button 
            onClick={onClose} 
            className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white px-2 py-1 rounded bg-slate-800/80"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to cPanel</span>
          </button>
          <div className="h-4 w-px bg-slate-600" />
          <div className="flex items-center gap-1.5 font-bold tracking-tight text-sm">
            <span className="text-[#ff6c2c]">Roundcube</span>
            <span className="text-slate-300 font-normal text-xs">Webmail</span>
          </div>
          <span className="text-xs text-slate-400 font-mono">({activeAddress})</span>
        </div>

        <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-700">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Folders Sidebar */}
        <div className="w-48 border-r border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 p-3 flex flex-col justify-between text-xs">
          <div className="space-y-3">
            <button
              onClick={() => setShowComposeModal(true)}
              className="w-full py-2 px-3 bg-[#ff6c2c] hover:bg-[#e85b1c] text-white font-semibold rounded-md flex items-center justify-center gap-2 shadow-xs transition-colors"
            >
              <Edit className="w-3.5 h-3.5" />
              <span>Compose</span>
            </button>

            <nav className="space-y-1">
              <button
                onClick={() => setActiveFolder('inbox')}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded text-left font-medium ${
                  activeFolder === 'inbox' ? 'bg-slate-200 dark:bg-slate-800 text-[#ff6c2c]' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Inbox className="w-3.5 h-3.5 text-blue-500" />
                  <span>Inbox</span>
                </div>
                <span className="text-[11px] font-mono font-bold text-slate-500">
                  {messages.filter(m => m.folder === 'inbox' && m.unread).length || ''}
                </span>
              </button>

              <button
                onClick={() => setActiveFolder('sent')}
                className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded text-left font-medium ${
                  activeFolder === 'sent' ? 'bg-slate-200 dark:bg-slate-800 text-[#ff6c2c]' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <Send className="w-3.5 h-3.5 text-emerald-500" />
                <span>Sent</span>
              </button>

              <button
                onClick={() => setActiveFolder('drafts')}
                className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded text-left font-medium ${
                  activeFolder === 'drafts' ? 'bg-slate-200 dark:bg-slate-800 text-[#ff6c2c]' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-amber-500" />
                <span>Drafts</span>
              </button>

              <button
                onClick={() => setActiveFolder('trash')}
                className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded text-left font-medium ${
                  activeFolder === 'trash' ? 'bg-slate-200 dark:bg-slate-800 text-[#ff6c2c]' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                <span>Trash</span>
              </button>
            </nav>
          </div>

          <div className="p-2 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-400">
            <span>Disk quota: 420 MB / 2048 MB</span>
          </div>
        </div>

        {/* Message List */}
        <div className="w-72 border-r border-slate-200 dark:border-slate-800 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
          {folderMessages.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              Folder is empty
            </div>
          ) : (
            folderMessages.map(msg => (
              <div
                key={msg.id}
                onClick={() => handleSelectMessage(msg)}
                className={`p-3 cursor-pointer transition-colors ${
                  msg.id === selectedMessageId
                    ? 'bg-blue-50 dark:bg-blue-950/40 border-l-2 border-[#ff6c2c]'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className={`truncate font-medium ${msg.unread ? 'font-bold text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-300'}`}>
                    {msg.from.split('<')[0]}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono whitespace-nowrap ml-1">
                    {msg.date.split(',')[0]}
                  </span>
                </div>
                <h4 className={`text-xs truncate ${msg.unread ? 'font-semibold text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                  {msg.subject}
                </h4>
                <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                  {msg.snippet}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Message Reading Pane */}
        <div className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-[#0f172a]">
          {activeMessage ? (
            <>
              {/* Message Header */}
              <div className="p-4 border-b border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex items-start justify-between">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {activeMessage.subject}
                  </h3>
                  <button
                    onClick={() => handleDeleteMessage(activeMessage.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-500 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
                    title="Delete message"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-xs text-slate-500 space-y-0.5">
                  <div><strong>From:</strong> {activeMessage.from}</div>
                  <div><strong>To:</strong> {activeMessage.to}</div>
                  <div><strong>Date:</strong> {activeMessage.date}</div>
                </div>
              </div>

              {/* Message Body */}
              <div className="flex-1 p-5 overflow-y-auto whitespace-pre-wrap font-sans text-xs text-slate-800 dark:text-slate-200 leading-relaxed">
                {activeMessage.body}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-xs text-slate-400">
              Select a message to view its content
            </div>
          )}
        </div>
      </div>

      {/* Compose Modal */}
      {showComposeModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <form onSubmit={handleSendEmail} className="bg-white dark:bg-slate-900 rounded-lg max-w-lg w-full border border-slate-200 dark:border-slate-800 p-5 space-y-3 shadow-2xl text-xs">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Compose New Message</h3>
              <button type="button" onClick={() => setShowComposeModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-slate-500 font-medium mb-1">To:</label>
              <input
                type="email"
                required
                placeholder="recipient@example.com"
                value={composeTo}
                onChange={(e) => setComposeTo(e.target.value)}
                className="w-full px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-medium mb-1">Subject:</label>
              <input
                type="text"
                placeholder="Message Subject"
                value={composeSubject}
                onChange={(e) => setComposeSubject(e.target.value)}
                className="w-full px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-medium mb-1">Body:</label>
              <textarea
                rows={6}
                value={composeBody}
                onChange={(e) => setComposeBody(e.target.value)}
                placeholder="Write your email here..."
                className="w-full p-3 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs resize-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button type="button" onClick={() => setShowComposeModal(false)} className="px-3 py-1.5 bg-slate-200 dark:bg-slate-800 rounded font-medium">
                Cancel
              </button>
              <button type="submit" className="px-4 py-1.5 bg-[#ff6c2c] hover:bg-[#e85b1c] text-white rounded font-medium flex items-center gap-1.5">
                <Send className="w-3.5 h-3.5" />
                <span>Send Email</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
