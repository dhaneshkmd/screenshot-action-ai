import React, { useRef, useState } from 'react';
import {
  Upload,
  Share2,
  Camera,
  Clipboard,
  Shield,
  Sparkles,
  ArrowRight,
  Briefcase,
  Code,
  MessageSquare,
  Calendar,
  Receipt,
  CheckCircle,
  Zap,
  Plane,
  Tag,
  GraduationCap,
  Layers,
} from 'lucide-react';
import { SAMPLE_SCREENSHOTS } from '../data/sampleScreenshots';
import { SampleScreenshot } from '../types';
import { optimizeImageForUpload } from '../utils/imageCompressor';

interface HeroUploadProps {
  onSelectScreenshot: (imageDataUri: string, sample?: SampleScreenshot) => void;
  onOpenShareSheet: () => void;
  processOnceOnly: boolean;
  setProcessOnceOnly: (val: boolean) => void;
  isAnalyzing: boolean;
}

export const HeroUpload: React.FC<HeroUploadProps> = ({
  onSelectScreenshot,
  onOpenShareSheet,
  processOnceOnly,
  setProcessOnceOnly,
  isAnalyzing,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [pasteError, setPasteError] = useState<string | null>(null);
  const [activePresetFilter, setActivePresetFilter] = useState<string>('all');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPEG, WebP, or SVG).');
      return;
    }
    try {
      const optimizedUri = await optimizeImageForUpload(file);
      onSelectScreenshot(optimizedUri);
    } catch {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          onSelectScreenshot(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handlePaste = async () => {
    setPasteError(null);
    try {
      if (!navigator.clipboard?.read) {
        setPasteError('Clipboard image read not supported in this browser. Please use Upload.');
        return;
      }
      const items = await navigator.clipboard.read();
      for (const item of items) {
        const imageType = item.types.find((t) => t.startsWith('image/'));
        if (imageType) {
          const blob = await item.getType(imageType);
          const file = new File([blob], 'screenshot.png', { type: imageType });
          processFile(file);
          return;
        }
      }
      setPasteError('No screenshot image found on clipboard. Copy an image first!');
    } catch (err: any) {
      setPasteError('Clipboard permission denied or no image copied.');
    }
  };

  const filteredSamples = SAMPLE_SCREENSHOTS.filter((s) => {
    if (activePresetFilter === 'all') return true;
    if (activePresetFilter === 'job') return s.category === 'job_vacancy';
    if (activePresetFilter === 'travel') return s.category === 'travel_itinerary';
    if (activePresetFilter === 'code') return s.category === 'code_error' || s.category === 'ui_design';
    if (activePresetFilter === 'expense') return s.category === 'receipt_invoice';
    if (activePresetFilter === 'doc') return s.category === 'document_note';
    return true;
  });

  return (
    <div className="w-full flex-1 flex flex-col items-center justify-center px-4 py-8 sm:py-12 max-w-5xl mx-auto space-y-10">
      {/* Hero Badge & Typography */}
      <div className="text-center space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-semibold animate-in fade-in shadow-sm shadow-blue-500/10">
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span>UNIVERSAL MULTIMODAL ACTION ENGINE</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-center tracking-tight text-white leading-tight">
          Anything you screenshot <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-300 bg-clip-text text-transparent">
            becomes an action.
          </span>
        </h1>

        <p className="text-sm sm:text-base text-slate-300 font-medium max-w-2xl mx-auto leading-relaxed">
          Upload any screenshot. AI understands what it means, extracts structured entities, and helps you execute
          immediately without manual app switching.
        </p>

        <div className="flex items-center justify-center space-x-2 text-xs text-slate-400 font-mono">
          <Zap className="w-3.5 h-3.5 text-blue-400" />
          <span>"Your screenshot is the command. Stop collecting screenshots. Start acting on them."</span>
        </div>
      </div>

      {/* Main Upload / Drag Drop Zone */}
      <div className="w-full max-w-2xl">
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`relative rounded-3xl border-2 border-dashed p-6 sm:p-10 flex flex-col items-center justify-center text-center transition-all bg-gradient-to-b from-slate-900/90 to-slate-950/90 shadow-2xl backdrop-blur-md ${
            dragActive
              ? 'border-blue-500 bg-blue-950/20 scale-[1.01]'
              : 'border-slate-800 hover:border-slate-700'
          }`}
        >
          {/* Action Trigger Buttons */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/25 mb-4">
            <Upload className="w-8 h-8" />
          </div>

          <h3 className="text-base sm:text-lg font-bold text-white mb-1">
            Drop screenshot here, or choose an upload method
          </h3>
          <p className="text-xs text-slate-400 max-w-md mb-6">
            Supports camera photos, PNG, JPG, WebP, or SVG. Automatic client compression protects upload speed and
            data privacy.
          </p>

          {/* Action Buttons Row */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 w-full">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center space-x-2 shadow-lg shadow-blue-600/25 transition-all"
            >
              <Upload className="w-4 h-4" />
              <span>Browse Photos / Files</span>
            </button>

            <button
              onClick={() => cameraInputRef.current?.click()}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center space-x-2 border border-slate-700 transition-all"
            >
              <Camera className="w-4 h-4" />
              <span>Camera</span>
            </button>

            <button
              onClick={handlePaste}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center space-x-2 border border-slate-700 transition-all"
            >
              <Clipboard className="w-4 h-4" />
              <span>Paste Clipboard</span>
            </button>

            <button
              onClick={onOpenShareSheet}
              className="px-4 py-2.5 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/40 text-indigo-200 border border-indigo-500/40 text-xs font-semibold flex items-center space-x-2 transition-all"
            >
              <Share2 className="w-4 h-4" />
              <span>Share Sheet</span>
            </button>
          </div>

          {pasteError && (
            <div className="mt-3 text-xs text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/20">
              {pasteError}
            </div>
          )}

          {/* Hidden file inputs */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleFileChange}
          />

          {/* Privacy & Ephemeral Checkbox */}
          <div className="mt-6 pt-5 border-t border-slate-800/80 w-full flex items-center justify-center">
            <label className="flex items-center space-x-2.5 text-xs text-slate-400 cursor-pointer hover:text-slate-300">
              <input
                type="checkbox"
                checked={processOnceOnly}
                onChange={(e) => setProcessOnceOnly(e.target.checked)}
                className="rounded border-slate-700 text-blue-600 focus:ring-0"
              />
              <span className="flex items-center gap-1.5 font-medium">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span>Process Once (Ephemeral mode — never save to local storage or memory history)</span>
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Interactive Preset Examples Section */}
      <div className="w-full space-y-4 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span>Try Interactive Real-World Presets (No Registration Required)</span>
            </h4>
            <p className="text-xs text-slate-400">
              Click any screenshot below to experience universal action routing and multi-step agent reasoning.
            </p>
          </div>

          {/* Preset Category Filter Chips */}
          <div className="flex flex-wrap items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            {[
              { id: 'all', label: 'All (11)' },
              { id: 'job', label: '💼 Job' },
              { id: 'travel', label: '✈️ Travel' },
              { id: 'code', label: '💻 Code' },
              { id: 'expense', label: '🧾 Expense' },
              { id: 'doc', label: '📰 Document' },
            ].map((chip) => (
              <button
                key={chip.id}
                onClick={() => setActivePresetFilter(chip.id)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  activePresetFilter === chip.id
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>

        {/* Preset Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredSamples.map((sample) => (
            <div
              key={sample.id}
              onClick={() => onSelectScreenshot(sample.imageDataUri, sample)}
              className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-blue-500/60 transition-all hover:scale-[1.015] cursor-pointer flex flex-col justify-between group shadow-lg hover:shadow-blue-500/10 space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{sample.thumbnailSvg}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/30 uppercase font-semibold">
                    {sample.badge}
                  </span>
                </div>

                <div>
                  <h5 className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors">
                    {sample.title}
                  </h5>
                  <p className="text-[11px] text-slate-300 font-medium line-clamp-1">{sample.subtitle}</p>
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2">
                  {sample.description}
                </p>
              </div>

              <div className="flex items-center justify-between text-xs text-blue-400 font-semibold pt-2 border-t border-slate-800/80">
                <span>Analyze &amp; Act</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
