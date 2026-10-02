import React from 'react';
import { SystemNotification } from '../types/cpanel';
import { 
  Bell, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  X, 
  CheckCheck 
} from 'lucide-react';

interface NotificationDrawerProps {
  notifications: SystemNotification[];
  isOpen: boolean;
  onClose: () => void;
  onMarkAllAsRead: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  notifications,
  isOpen,
  onClose,
  onMarkAllAsRead
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end animate-in fade-in">
      <div className="w-full max-w-sm bg-white dark:bg-slate-900 h-full shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col">
        {/* Drawer Header */}
        <div className="p-4 bg-slate-800 text-white flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#ff6c2c]" />
            <h3 className="text-sm font-semibold">cPanel Notifications</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Actions bar */}
        <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-500 font-medium">Recent server events</span>
          <button
            onClick={onMarkAllAsRead}
            className="text-[#ff6c2c] hover:underline flex items-center gap-1 font-medium"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Mark all read</span>
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 p-2 space-y-1">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No new notifications.
            </div>
          ) : (
            notifications.map(n => (
              <div 
                key={n.id} 
                className={`p-3 rounded-lg text-xs transition-colors ${
                  !n.read ? 'bg-orange-50/50 dark:bg-orange-950/20' : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  {n.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  ) : n.type === 'warning' ? (
                    <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  ) : (
                    <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-0.5">
                      <h4 className="font-semibold text-slate-800 dark:text-slate-100">{n.title}</h4>
                      <span className="text-[10px] text-slate-400">{n.time}</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                      {n.message}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
