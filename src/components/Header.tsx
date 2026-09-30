import React from 'react';
import {
  Sparkles,
  Smartphone,
  Monitor,
  User,
  History,
  ShieldCheck,
  CreditCard,
  FileCode,
  Zap,
  Layers,
} from 'lucide-react';
import { SubscriptionInfo } from '../types';

interface HeaderProps {
  isMobileFrame: boolean;
  setIsMobileFrame: (val: boolean) => void;
  onOpenCareerProfile: () => void;
  onOpenMemory: () => void;
  onOpenSubscription: () => void;
  onOpenPrivacy: () => void;
  onOpenArchSpec: () => void;
  onOpenConnectedApps: () => void;
  subscription: SubscriptionInfo;
  serverStatus: { status: string; hasApiKey: boolean; model: string };
  onResetToHome: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isMobileFrame,
  setIsMobileFrame,
  onOpenCareerProfile,
  onOpenMemory,
  onOpenSubscription,
  onOpenPrivacy,
  onOpenArchSpec,
  onOpenConnectedApps,
  subscription,
  serverStatus,
  onResetToHome,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2">
        {/* Brand */}
        <button
          onClick={onResetToHome}
          className="flex items-center gap-2.5 text-left group hover:opacity-90 transition-opacity"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20 ring-1 ring-white/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                SnapAction
              </span>
              <span className="text-xs px-1.5 py-0.5 rounded font-mono font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                AI
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Screenshot Anything. Turn It Into Action.
            </p>
          </div>
        </button>

        {/* Center / Status */}
        <div className="hidden md:flex items-center gap-2 text-xs">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700/60 text-slate-300">
            <span
              className={`w-2 h-2 rounded-full ${
                serverStatus.hasApiKey ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
              }`}
            />
            <span>Gemini 2.5 Flash</span>
          </span>

          <button
            onClick={() => setIsMobileFrame(!isMobileFrame)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full border transition-all ${
              isMobileFrame
                ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 shadow-sm shadow-indigo-500/20'
                : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
            title="Toggle Android Mobile Viewport Simulator"
          >
            {isMobileFrame ? (
              <>
                <Smartphone className="w-3.5 h-3.5" />
                <span>Android Mode</span>
              </>
            ) : (
              <>
                <Monitor className="w-3.5 h-3.5" />
                <span>Desktop Mode</span>
              </>
            )}
          </button>
        </div>

        {/* Right Action buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Arch Spec button */}
          <button
            onClick={onOpenArchSpec}
            className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 hover:border-cyan-500/40 transition-colors"
            title="View Complete System Architecture & Specification (A to O)"
          >
            <FileCode className="w-3.5 h-3.5" />
            <span className="hidden lg:inline font-medium">Specs</span>
          </button>

          {/* Connected Apps button */}
          <button
            onClick={onOpenConnectedApps}
            className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-slate-700 hover:border-indigo-500/40 transition-colors"
            title="Manage Connected Apps & Default Handlers"
          >
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline font-medium">Apps</span>
          </button>

          {/* Career Profile button */}
          <button
            onClick={onOpenCareerProfile}
            className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600 transition-colors"
            title="Manage Career Profile & CV"
          >
            <User className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline font-medium">Career CV</span>
          </button>

          {/* Memory / History button */}
          <button
            onClick={onOpenMemory}
            className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600 transition-colors"
            title="Screenshot Memory & History"
          >
            <History className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline font-medium">Memory</span>
          </button>

          {/* Subscription Tier */}
          <button
            onClick={onOpenSubscription}
            className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600/30 to-purple-600/30 hover:from-indigo-600/40 hover:to-purple-600/40 border border-indigo-500/40 text-indigo-200 transition-colors"
            title="Subscription & Google Play Quotas"
          >
            <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300/30" />
            <span className="font-semibold uppercase tracking-wider">
              {subscription.tier}
            </span>
            <span className="text-[10px] text-slate-400 font-mono hidden md:inline">
              ({subscription.monthlyQuota - subscription.usedThisMonth} left)
            </span>
          </button>

          {/* Privacy & Settings */}
          <button
            onClick={onOpenPrivacy}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            title="Privacy, Data Retention & Play Store Safety"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </button>
        </div>
      </div>
    </header>
  );
};
