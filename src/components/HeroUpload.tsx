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
} from 'lucide-react';
import { SAMPLE_SCREENSHOTS } from '../data/sampleScreenshots';
import { SampleScreenshot } from '../types';

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPEG, WebP, or SVG).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        onSelectScreenshot(result);
      }
    };
    reader.readAsDataURL(file);
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

  return (
    <div className="w-full flex-1 flex flex-col items-center justify-center px-4 py-8 sm:py-12 max-w-4xl mx-auto">
      {/* Hero Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-medium mb-6 animate-in fade-in">
        <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
        <span>Universal Mobile AI Action Layer</span>
      </div>

      {/* Main Title */}
      <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-center tracking-tight text-white leading-tight">
        Screenshot Anything.
        <span className="block mt-1 sm:mt-2 bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-300 bg-clip-text text-transparent">
          Turn It Into Action.
        </span>
      </h1>

      {/* Subtext */}
      <p className="mt-4 text-sm sm:text-lg text-slate-300 text-center max-w-xl font-normal leading-relaxed">
        Turn screenshots into answers, prompts, tailored job applications, content, and real workflows.
      </p>

      {/* Primary Action Buttons */}
      <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full max-w-md">
        {/* Share Screenshot */}
        <button
          onClick={onOpenShareSheet}
          disabled={isAnalyzing}
          className="flex-1 py-3.5 px-5 rounded-2xl bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 ring-1 ring-white/20 flex items-center justify-center gap-2.5 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
        >
          <Share2 className="w-4 h-4" />
          <span>Android Share Sheet</span>
        </button>

        {/* Upload Screenshot */}
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isAnalyzing}
          className="flex-1 py-3.5 px-5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold text-sm border border-slate-700 hover:border-slate-600 flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-md"
        >
          <Upload className="w-4 h-4 text-blue-400" />
          <span>Upload Screenshot</span>
        </button>

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
      </div>

      {/* Secondary Input Methods: Camera & Clipboard */}
      <div className="mt-3 flex items-center gap-3 text-xs">
        <button
          onClick={() => cameraInputRef.current?.click()}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700/60 transition-colors"
        >
          <Camera className="w-3.5 h-3.5 text-cyan-400" />
          <span>Take Photo / Camera</span>
        </button>

        <button
          onClick={handlePaste}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700/60 transition-colors"
        >
          <Clipboard className="w-3.5 h-3.5 text-indigo-400" />
          <span>Paste Clipboard (Ctrl+V)</span>
        </button>
      </div>

      {pasteError && (
        <p className="mt-2 text-xs text-amber-400 font-medium">{pasteError}</p>
      )}

      {/* Drag & Drop Box */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`mt-6 w-full max-w-lg p-6 rounded-2xl border-2 border-dashed transition-all text-center cursor-pointer ${
          dragActive
            ? 'border-indigo-500 bg-indigo-500/10'
            : 'border-slate-800 hover:border-slate-700 bg-slate-900/40 hover:bg-slate-900/70'
        }`}
      >
        <p className="text-xs text-slate-400">
          Drop any screenshot file here, or tap to browse
        </p>
        <span className="text-[11px] text-slate-500 mt-1 block">
          PNG, JPEG, WebP, SVG • Automatically compressed for optimal OCR text recognition
        </span>
      </div>

      {/* Privacy Switch: "Process Once — Do Not Save" */}
      <div className="mt-6 flex items-center justify-between w-full max-w-md p-3 rounded-xl bg-slate-900/70 border border-slate-800">
        <div className="flex items-center gap-2 text-left">
          <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
          <div>
            <p className="text-xs font-semibold text-slate-200">
              Process Once — Do Not Save
            </p>
            <p className="text-[11px] text-slate-400">
              Ephemeral mode: analyzes in memory, zero server storage
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setProcessOnceOnly(!processOnceOnly)}
          className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
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

      {/* Quick Function Badges */}
      <div className="mt-8 w-full max-w-xl">
        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider text-center mb-3">
          Quick Workflows Built-In
        </p>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center text-xs">
          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col items-center gap-1 text-slate-300">
            <span className="text-blue-400 font-bold">Ask</span>
            <span className="text-[10px] text-slate-500">Q&amp;A &amp; OCR</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col items-center gap-1 text-slate-300">
            <span className="text-purple-400 font-bold">Prompt</span>
            <span className="text-[10px] text-slate-500">App &amp; Code</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col items-center gap-1 text-slate-300">
            <span className="text-emerald-400 font-bold">Apply</span>
            <span className="text-[10px] text-slate-500">Job &amp; CV Match</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col items-center gap-1 text-slate-300">
            <span className="text-amber-400 font-bold">Reply</span>
            <span className="text-[10px] text-slate-500">Chat &amp; Email</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col items-center gap-1 text-slate-300">
            <span className="text-pink-400 font-bold">Create</span>
            <span className="text-[10px] text-slate-500">Posts &amp; Scripts</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col items-center gap-1 text-slate-300">
            <span className="text-cyan-400 font-bold">Save</span>
            <span className="text-[10px] text-slate-500">Smart Memory</span>
          </div>
        </div>
      </div>

      {/* Interactive Sample Screenshot Carousel */}
      <div className="mt-10 w-full">
        <div className="flex items-center justify-between mb-3 px-1">
          <div>
            <h3 className="text-sm font-bold text-slate-200">
              Test Real-World Screenshot Scenarios
            </h3>
            <p className="text-xs text-slate-400">
              Click any sample to simulate sharing into SnapAction AI
            </p>
          </div>
          <span className="text-[11px] text-indigo-400 font-mono">
            {SAMPLE_SCREENSHOTS.length} Scenarios
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {SAMPLE_SCREENSHOTS.map((sample) => (
            <button
              key={sample.id}
              onClick={() => onSelectScreenshot(sample.imageDataUri, sample)}
              disabled={isAnalyzing}
              className="text-left p-3.5 rounded-2xl bg-slate-900/70 hover:bg-slate-850 border border-slate-800 hover:border-indigo-500/50 transition-all group flex flex-col justify-between cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-2xl">{sample.thumbnailSvg}</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-indigo-300 border border-slate-700">
                    {sample.badge}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-100 group-hover:text-indigo-300 transition-colors">
                  {sample.title}
                </h4>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                  {sample.subtitle}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-indigo-400 font-medium">
                <span>Analyze with Gemini</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
