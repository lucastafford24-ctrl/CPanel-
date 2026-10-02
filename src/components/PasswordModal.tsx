import React, { useState } from 'react';
import { Key, X, Check, Shield } from 'lucide-react';

interface PasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: string;
}

export const PasswordModal: React.FC<PasswordModalProps> = ({
  isOpen,
  onClose,
  currentUser
}) => {
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [entropyScore, setEntropyScore] = useState(0);

  if (!isOpen) return null;

  const handlePasswordChange = (val: string) => {
    setNewPass(val);
    let score = 0;
    if (val.length >= 8) score += 25;
    if (val.length >= 12) score += 25;
    if (/[A-Z]/.test(val) && /[a-z]/.test(val)) score += 25;
    if (/[0-9]/.test(val) && /[^A-Za-z0-9]/.test(val)) score += 25;
    setEntropyScore(score);
  };

  const generateStrong = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%^&*()_+';
    let res = '';
    for (let i = 0; i < 18; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewPass(res);
    setConfirmPass(res);
    setEntropyScore(100);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass !== confirmPass) {
      alert('New password and confirm password do not match.');
      return;
    }
    alert('cPanel login password updated successfully! Please re-authenticate on next login.');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-lg max-w-md w-full border border-slate-200 dark:border-slate-800 p-5 space-y-4 shadow-2xl text-xs">
        <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-[#ff6c2c]" />
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Password & Security: {currentUser}
            </h3>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div>
          <label className="block text-slate-500 font-medium mb-1">Old Password</label>
          <input
            type="password"
            required
            value={oldPass}
            onChange={(e) => setOldPass(e.target.value)}
            className="w-full px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-slate-500 font-medium">New Password</label>
            <button
              type="button"
              onClick={generateStrong}
              className="text-[#ff6c2c] hover:underline text-[11px]"
            >
              Password Generator
            </button>
          </div>
          <input
            type="text"
            required
            value={newPass}
            onChange={(e) => handlePasswordChange(e.target.value)}
            className="w-full px-3 py-1.5 font-mono rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
          />
        </div>

        {/* Strength meter */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px] text-slate-500">
            <span>Password Strength:</span>
            <span className="font-mono font-bold">{entropyScore}/100</span>
          </div>
          <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all ${
                entropyScore >= 75 ? 'bg-emerald-500' : entropyScore >= 50 ? 'bg-amber-500' : 'bg-rose-500'
              }`}
              style={{ width: `${entropyScore}%` }}
            />
          </div>
        </div>

        <div>
          <label className="block text-slate-500 font-medium mb-1">Confirm New Password</label>
          <input
            type="text"
            required
            value={confirmPass}
            onChange={(e) => setConfirmPass(e.target.value)}
            className="w-full px-3 py-1.5 font-mono rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
          />
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 bg-slate-200 dark:bg-slate-800 rounded font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-1.5 bg-[#ff6c2c] hover:bg-[#e85b1c] text-white rounded font-medium shadow-xs"
          >
            Change Password
          </button>
        </div>
      </form>
    </div>
  );
};
