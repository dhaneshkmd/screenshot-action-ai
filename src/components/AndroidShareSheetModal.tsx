import React, { useState } from 'react';
import {
  X,
  Share2,
  Sparkles,
  MessageCircle,
  Mail,
  HardDrive,
  Copy,
  Bluetooth,
  Send,
  Upload,
} from 'lucide-react';
import { SAMPLE_SCREENSHOTS } from '../data/sampleScreenshots';
import { SampleScreenshot } from '../types';

interface AndroidShareSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectScreenshot: (imageDataUri: string, sample?: SampleScreenshot) => void;
  onCustomFileUpload: (file: File) => void;
}

export const AndroidShareSheetModal: React.FC<AndroidShareSheetModalProps> = ({
  isOpen,
  onClose,
  onSelectScreenshot,
  onCustomFileUpload,
}) => {
  const [selectedSampleId, setSelectedSampleId] = useState<string>(SAMPLE_SCREENSHOTS[0].id);

  if (!isOpen) return null;

  const currentSample =
    SAMPLE_SCREENSHOTS.find((s) => s.id === selectedSampleId) || SAMPLE_SCREENSHOTS[0];

  const handleShareIntoApp = () => {
    onSelectScreenshot(currentSample.imageDataUri, currentSample);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in slide-in-from-bottom duration-200">
        {/* Handle / Header */}
        <div className="pt-3 pb-2 px-6 flex flex-col items-center border-b border-slate-800">
          <div className="w-12 h-1.5 rounded-full bg-slate-700 mb-3" />
          <div className="w-full flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Share2 className="w-4 h-4 text-indigo-400" />
              <h3 className="font-bold text-slate-100 text-sm">
                Android 15 System Share Sheet
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
            Simulating intent: <code className="text-indigo-300 font-mono">android.intent.action.SEND (image/*)</code>
          </p>
        </div>

        {/* Content body */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* Step 1: Select Screenshot to Share */}
          <div>
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2">
              1. Choose Screenshot to Share
            </label>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
              {SAMPLE_SCREENSHOTS.map((sample) => (
                <button
                  key={sample.id}
                  onClick={() => setSelectedSampleId(sample.id)}
                  className={`text-left p-2.5 rounded-xl border transition-all text-xs flex flex-col gap-1 ${
                    selectedSampleId === sample.id
                      ? 'bg-indigo-600/20 border-indigo-500 text-indigo-100 ring-1 ring-indigo-500'
                      : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg">{sample.thumbnailSvg}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-700/80 text-slate-300">
                      {sample.badge}
                    </span>
                  </div>
                  <span className="font-semibold truncate">{sample.title}</span>
                  <span className="text-[11px] text-slate-400 truncate">{sample.subtitle}</span>
                </button>
              ))}
            </div>

            {/* Or custom file input */}
            <div className="mt-2 flex items-center justify-between bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400">Or share your own screenshot:</span>
              <label className="cursor-pointer flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/30">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Image</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      onCustomFileUpload(file);
                      onClose();
                    }
                  }}
                />
              </label>
            </div>
          </div>

          {/* Screenshot Preview */}
          <div className="bg-slate-950 rounded-2xl p-3 border border-slate-800 flex items-center gap-3">
            <div className="w-16 h-16 rounded-lg overflow-hidden border border-slate-700 shrink-0 bg-slate-900 flex items-center justify-center">
              <img
                src={currentSample.imageDataUri}
                alt="Selected preview"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-200 truncate">
                {currentSample.title}
              </p>
              <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">
                {currentSample.description}
              </p>
              <span className="inline-block mt-1 text-[10px] font-mono text-cyan-400">
                MIME: image/png (ready to broadcast)
              </span>
            </div>
          </div>

          {/* Step 2: System Share Target Apps */}
          <div>
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2">
              2. Select Target Application in Share Sheet
            </label>
            <div className="grid grid-cols-4 gap-2.5 text-center">
              {/* SnapAction AI (Highlighted App) */}
              <button
                onClick={handleShareIntoApp}
                className="p-3 rounded-2xl bg-gradient-to-b from-indigo-600 to-blue-700 text-white flex flex-col items-center gap-1.5 shadow-lg shadow-blue-500/25 ring-2 ring-indigo-400 hover:scale-105 transition-transform"
              >
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-[11px] font-bold leading-tight">
                  SnapAction AI
                </span>
                <span className="text-[9px] text-indigo-200 uppercase font-mono">
                  Recommended
                </span>
              </button>

              {/* Other standard Android apps (mocked for realistic simulation) */}
              <button
                disabled
                className="p-3 rounded-2xl bg-slate-800/40 text-slate-500 flex flex-col items-center gap-1.5 opacity-60 cursor-not-allowed border border-slate-800"
              >
                <div className="w-10 h-10 rounded-full bg-slate-700/60 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-medium leading-tight">Messages</span>
                <span className="text-[9px] text-slate-600">SMS</span>
              </button>

              <button
                disabled
                className="p-3 rounded-2xl bg-slate-800/40 text-slate-500 flex flex-col items-center gap-1.5 opacity-60 cursor-not-allowed border border-slate-800"
              >
                <div className="w-10 h-10 rounded-full bg-slate-700/60 flex items-center justify-center">
                  <Mail className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-medium leading-tight">Gmail</span>
                <span className="text-[9px] text-slate-600">Email</span>
              </button>

              <button
                disabled
                className="p-3 rounded-2xl bg-slate-800/40 text-slate-500 flex flex-col items-center gap-1.5 opacity-60 cursor-not-allowed border border-slate-800"
              >
                <div className="w-10 h-10 rounded-full bg-slate-700/60 flex items-center justify-center">
                  <HardDrive className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-medium leading-tight">Drive</span>
                <span className="text-[9px] text-slate-600">Cloud</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Trigger */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-700 text-xs font-semibold text-slate-300 hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            onClick={handleShareIntoApp}
            className="flex-1 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            <span>Launch SnapAction Analysis Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};
