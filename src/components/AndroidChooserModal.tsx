import React, { useState } from 'react';
import {
  X,
  Share2,
  ExternalLink,
  Check,
  ShieldCheck,
  Smartphone,
  ChevronRight,
  Info,
  Lock,
} from 'lucide-react';
import { DispatchedIntentPayload, AppConnection } from '../types';
import { AppConnectivityRegistry } from '../services/appConnectivityRegistry';

interface AndroidChooserModalProps {
  isOpen: boolean;
  onClose: () => void;
  intentPayload: DispatchedIntentPayload | null;
  onIntentDispatched?: (appName: string) => void;
}

export const AndroidChooserModal: React.FC<AndroidChooserModalProps> = ({
  isOpen,
  onClose,
  intentPayload,
  onIntentDispatched,
}) => {
  const [selectedAppId, setSelectedAppId] = useState<string>('');
  const [executionMessage, setExecutionMessage] = useState<string | null>(null);

  if (!isOpen || !intentPayload) return null;

  // Determine selected app (default or first compatible)
  const defaultApp =
    intentPayload.compatibleApps.find((a) => a.isDefault) || intentPayload.compatibleApps[0];
  const activeAppId = selectedAppId || defaultApp?.id || '';

  const handleLaunch = (alwaysSetDefault: boolean = false) => {
    if (!activeAppId) return;

    if (alwaysSetDefault) {
      AppConnectivityRegistry.setDefaultApp(intentPayload.category, activeAppId);
    }

    const result = intentPayload.executeAction(activeAppId);
    setExecutionMessage(result.notes);

    const appObj = intentPayload.compatibleApps.find((a) => a.id === activeAppId);
    if (onIntentDispatched && appObj) {
      onIntentDispatched(appObj.name);
    }

    setTimeout(() => {
      setExecutionMessage(null);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in slide-in-from-bottom duration-200">
        {/* Android Sheet Handle */}
        <div className="pt-3 pb-2 px-6 flex flex-col items-center border-b border-slate-800">
          <div className="w-12 h-1.5 rounded-full bg-slate-700 mb-2" />
          <div className="w-full flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-indigo-400" />
              <h3 className="font-bold text-slate-100 text-sm">
                Android Intent Resolver &amp; Chooser
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="w-full text-xs text-slate-400 mt-1">
            Choose an application to perform this action.
          </p>
        </div>

        {/* Intent Info & Security Clearance */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200">
                {intentPayload.actionTitle}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono uppercase">
                {intentPayload.category}
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {intentPayload.actionSubtitle}
            </p>

            {/* Field Previews */}
            <div className="pt-2 border-t border-slate-800/80 space-y-1 text-[11px]">
              {intentPayload.dataPreview.map((item, idx) => (
                <div key={idx} className="flex justify-between text-slate-300 py-0.5">
                  <span className="text-slate-500">{item.label}:</span>
                  <span className="font-medium text-slate-200 truncate max-w-[280px]">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Privacy & Human In The Loop Notice */}
          <div className="p-2.5 rounded-xl bg-emerald-950/20 border border-emerald-900/40 flex items-center gap-2 text-xs text-emerald-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              Explicit user confirmation required. No automated external execution.
            </span>
          </div>

          {/* Compatible Apps Grid */}
          <div>
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2">
              Select Compatible App ({intentPayload.compatibleApps.length} Available)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {intentPayload.compatibleApps.map((app) => {
                const isSelected = app.id === activeAppId;
                return (
                  <button
                    key={app.id}
                    onClick={() => setSelectedAppId(app.id)}
                    className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-600/20 border-indigo-500 ring-1 ring-indigo-500'
                        : 'bg-slate-950/60 border-slate-800 hover:bg-slate-900 text-slate-300'
                    }`}
                  >
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-bold text-white text-xs shadow-md"
                      style={{ backgroundColor: app.color }}
                    >
                      {app.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-xs text-slate-100 truncate">
                          {app.name}
                        </span>
                        {app.isDefault && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 font-mono">
                            Default
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 line-clamp-1 block">
                        {app.description}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Actions: "Just Once" vs "Always" (Standard Android Chooser UX) */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2.5">
          {executionMessage ? (
            <div className="w-full text-center text-xs text-emerald-400 font-bold flex items-center justify-center gap-1.5 py-2">
              <Check className="w-4 h-4" />
              <span>{executionMessage}</span>
            </div>
          ) : (
            <>
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-slate-200"
              >
                Cancel
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => handleLaunch(false)}
                  className="flex-1 sm:flex-initial py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold text-xs border border-slate-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Just Once</span>
                </button>

                <button
                  onClick={() => handleLaunch(true)}
                  className="flex-1 sm:flex-initial py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Always</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
