import React from 'react';
import { Wifi, Signal, Battery, Share2 } from 'lucide-react';

interface AndroidFrameProps {
  children: React.ReactNode;
  enabled: boolean;
  onSimulateShare: () => void;
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({
  children,
  enabled,
  onSimulateShare,
}) => {
  if (!enabled) {
    return <div className="w-full min-h-screen bg-slate-950 text-slate-100">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-6 px-2 sm:px-4 flex flex-col items-center justify-start">
      {/* Device wrapper */}
      <div className="w-full max-w-[420px] rounded-[48px] bg-slate-900 border-[10px] border-slate-800 shadow-2xl shadow-indigo-950/50 ring-1 ring-slate-700/60 overflow-hidden flex flex-col relative aspect-[9/19.5] max-h-[920px]">
        {/* Status Bar */}
        <div className="h-10 bg-slate-950/90 text-slate-300 px-6 flex items-center justify-between text-xs font-semibold select-none border-b border-slate-800/40 z-20">
          <span>10:42 AM</span>
          {/* Camera notch punch-hole */}
          <div className="w-3.5 h-3.5 rounded-full bg-slate-950 ring-2 ring-slate-800/80 mx-auto" />
          <div className="flex items-center gap-1.5 text-slate-400">
            <Signal className="w-3 h-3 text-slate-300" />
            <Wifi className="w-3 h-3 text-slate-300" />
            <Battery className="w-3.5 h-3.5 text-emerald-400" />
          </div>
        </div>

        {/* Screen content area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-slate-700 bg-slate-950 text-slate-100 flex flex-col">
          {children}
        </div>

        {/* Bottom Android Gesture Pill & Quick Action Bar */}
        <div className="h-12 bg-slate-950/90 border-t border-slate-800/60 flex items-center justify-between px-6 z-20">
          <button
            onClick={onSimulateShare}
            className="flex items-center gap-1.5 text-[11px] text-indigo-400 font-medium hover:text-indigo-300 py-1 px-2.5 rounded-full bg-indigo-500/10 border border-indigo-500/20"
            title="Simulate incoming Android Share intent"
          >
            <Share2 className="w-3 h-3" />
            <span>Android Share</span>
          </button>

          {/* Android Home Navigation Bar Pill */}
          <div className="w-24 h-1.5 rounded-full bg-slate-600/80" />

          <span className="text-[10px] text-slate-500 font-mono">Pixel 9 Pro</span>
        </div>
      </div>
    </div>
  );
};
