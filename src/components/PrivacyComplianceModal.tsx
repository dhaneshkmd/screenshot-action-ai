import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Lock,
  Trash2,
  Check,
  AlertTriangle,
  FileText,
  KeyRound,
  EyeOff,
} from 'lucide-react';

interface PrivacyComplianceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeleteAccount: () => void;
  processOnceOnly: boolean;
  setProcessOnceOnly: (val: boolean) => void;
}

export const PrivacyComplianceModal: React.FC<PrivacyComplianceModalProps> = ({
  isOpen,
  onClose,
  onDeleteAccount,
  processOnceOnly,
  setProcessOnceOnly,
}) => {
  const [retentionDays, setRetentionDays] = useState<'0' | '7' | '30' | 'forever'>('30');
  const [deleted, setDeleted] = useState(false);

  if (!isOpen) return null;

  const handleConfirmDelete = () => {
    if (
      confirm(
        'Warning: This will permanently delete your account, saved career profile, CV documents, and all screenshot history. This action is irreversible. Continue?'
      )
    ) {
      onDeleteAccount();
      setDeleted(true);
      setTimeout(() => {
        setDeleted(false);
        onClose();
      }, 1500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-sm">
                Privacy, Security &amp; Google Play Compliance
              </h3>
              <p className="text-xs text-slate-400">
                Permission minimization, data safety declaration, and account control.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-xs">
          {/* Ephemeral Privacy Toggle */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div className="space-y-1 pr-4">
              <div className="flex items-center gap-1.5 font-bold text-slate-200">
                <EyeOff className="w-4 h-4 text-emerald-400" />
                <span>Default to "Process Once — Do Not Save"</span>
              </div>
              <p className="text-slate-400">
                When enabled, screenshots are processed purely in ephemeral RAM and never persisted to database or memory history.
              </p>
            </div>
            <button
              onClick={() => setProcessOnceOnly(!processOnceOnly)}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                processOnceOnly ? 'bg-emerald-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform shadow-md absolute top-0.5 left-0.5 ${
                  processOnceOnly ? 'transform translate-x-5' : ''
                }`}
              />
            </button>
          </div>

          {/* Permission Minimization Principle */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <h4 className="font-bold text-slate-200 flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-blue-400" />
              <span>Permission Minimization (Google Play Guideline)</span>
            </h4>
            <p className="text-slate-300 leading-relaxed">
              SnapAction AI avoids requesting intrusive runtime permissions. We do NOT request:
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-slate-400 pt-1">
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>NO Call Log access</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>NO SMS History access</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>NO Background Location</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Uses native Android Intents</span>
              </li>
            </ul>
          </div>

          {/* Retention Rules */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <h4 className="font-bold text-slate-200">Screenshot History Retention Policy:</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: '0', label: '0 Days (Instant Wipe)' },
                { id: '7', label: '7 Days Auto-Purge' },
                { id: '30', label: '30 Days Auto-Purge' },
                { id: 'forever', label: 'Keep Until Manual Delete' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setRetentionDays(opt.id as any)}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    retentionDays === opt.id
                      ? 'bg-blue-600/20 border-blue-500 text-blue-300 font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Delete Account (Mandatory Play Store requirement) */}
          <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-900/40 space-y-2">
            <h4 className="font-bold text-rose-300 flex items-center gap-1.5">
              <Trash2 className="w-4 h-4 text-rose-400" />
              <span>Google Play Data Deletion &amp; Account Wipe</span>
            </h4>
            <p className="text-slate-400">
              In accordance with Google Play Store User Data policy, you can completely erase your account and all associated tokens, profile data, CVs, and screenshot logs at any time.
            </p>
            <div className="pt-2">
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{deleted ? 'Account Deleted' : 'Delete Account & All Data'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold"
          >
            Close Settings
          </button>
        </div>
      </div>
    </div>
  );
};
