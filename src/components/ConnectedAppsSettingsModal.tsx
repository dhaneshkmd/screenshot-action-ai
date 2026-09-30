import React, { useState } from 'react';
import {
  X,
  Layers,
  Smartphone,
  Check,
  ShieldCheck,
  RotateCcw,
  ExternalLink,
  Settings,
} from 'lucide-react';
import { AppConnection, AppCategory } from '../types';
import { AppConnectivityRegistry } from '../services/appConnectivityRegistry';

interface ConnectedAppsSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ConnectedAppsSettingsModal: React.FC<ConnectedAppsSettingsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [apps, setApps] = useState<AppConnection[]>(() =>
    AppConnectivityRegistry.getConnectedApps()
  );
  const [selectedCategory, setSelectedCategory] = useState<AppCategory | 'all'>('all');

  if (!isOpen) return null;

  const categories: { id: AppCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'All Apps' },
    { id: 'email', label: 'Email' },
    { id: 'navigation', label: 'Navigation' },
    { id: 'messaging', label: 'Messaging' },
    { id: 'calendar', label: 'Calendar' },
    { id: 'social', label: 'Social' },
    { id: 'note_task', label: 'Notes & Tasks' },
    { id: 'cloud_storage', label: 'Cloud Storage' },
    { id: 'dialer_sms', label: 'Phone & SMS' },
    { id: 'shopping_travel', label: 'Shopping & Travel' },
  ];

  const handleToggleInstalled = (appId: string) => {
    AppConnectivityRegistry.toggleAppInstalled(appId);
    setApps(AppConnectivityRegistry.getConnectedApps());
  };

  const handleSetDefault = (category: AppCategory, appId: string) => {
    AppConnectivityRegistry.setDefaultApp(category, appId);
    setApps(AppConnectivityRegistry.getConnectedApps());
  };

  const handleReset = () => {
    if (confirm('Reset all connected app defaults?')) {
      AppConnectivityRegistry.resetToDefaults();
      setApps(AppConnectivityRegistry.getConnectedApps());
    }
  };

  const filteredApps = apps.filter(
    (app) => selectedCategory === 'all' || app.category === selectedCategory
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-sm">
                Universal App Connectivity Layer
              </h3>
              <p className="text-xs text-slate-400">
                Manage default apps, intents, and deep link integrations.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="text-xs text-slate-400 hover:text-slate-200 px-2.5 py-1 rounded-lg border border-slate-800 hover:bg-slate-800 flex items-center gap-1 transition-colors"
              title="Reset to default settings"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Security & Intent Architecture Notice */}
        <div className="p-3.5 bg-slate-950 border-b border-slate-800/80 flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              Direct Intents &amp; App Links: Zero broad permissions or accessibility hooks required.
            </span>
          </div>
          <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800/40">
            {apps.filter((a) => a.installed).length} Connected
          </span>
        </div>

        {/* Category Pills Filter */}
        <div className="p-3 bg-slate-950/60 border-b border-slate-800 flex items-center gap-1.5 overflow-x-auto text-xs">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Apps List */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-2.5 flex-1">
          {filteredApps.map((app) => (
            <div
              key={app.id}
              className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-bold text-white text-xs shadow-md"
                  style={{ backgroundColor: app.color }}
                >
                  {app.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-100">{app.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 uppercase font-mono">
                      {app.category.replace('_', ' ')}
                    </span>
                    {app.isDefault && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                    {app.description}
                  </p>
                  <span className="text-[10px] font-mono text-slate-500 block mt-0.5">
                    Scheme: {app.packageScheme}
                  </span>
                </div>
              </div>

              {/* Controls: Default & Enable */}
              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                {!app.isDefault && app.installed && (
                  <button
                    onClick={() => handleSetDefault(app.category, app.id)}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-slate-900 hover:bg-slate-800 text-indigo-300 border border-indigo-900/60 transition-colors"
                  >
                    Set as Default
                  </button>
                )}

                <button
                  onClick={() => handleToggleInstalled(app.id)}
                  className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                    app.installed
                      ? 'bg-slate-800 text-emerald-400 border border-slate-700'
                      : 'bg-slate-900 text-slate-500 border border-slate-800 line-through'
                  }`}
                >
                  {app.installed ? 'Enabled' : 'Disabled'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
