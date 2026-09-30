import React, { useState } from 'react';
import {
  Code,
  Copy,
  Check,
  Sparkles,
  Download,
  Share2,
  Terminal,
  Cpu,
  Layers,
} from 'lucide-react';
import { generateUiPrompt } from '../../services/api';

interface PromptModuleProps {
  imageBase64: string;
  defaultContentType?: string;
}

export const PromptModule: React.FC<PromptModuleProps> = ({
  imageBase64,
  defaultContentType,
}) => {
  const [targetTool, setTargetTool] = useState('Claude / Cursor');
  const [promptStyle, setPromptStyle] = useState('Flutter Mobile App');
  const [customNotes, setCustomNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const tools = [
    'Claude / Cursor',
    'Google Gemini / AI Studio',
    'ChatGPT / OpenAI',
    'Replit Agent',
    'Coding Agent (Autonomous)',
    'Midjourney / Nano Banana Image Prompt',
  ];

  const styles = [
    'Flutter Mobile App (Material 3, Riverpod)',
    'React + Tailwind CSS Responsive SPA',
    'Next.js 15 Full-Stack App',
    'Complete Technical Architecture Specification',
    'UI Design System & Tokens (Figma Spec)',
  ];

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await generateUiPrompt(imageBase64, targetTool, promptStyle, customNotes);
      setGeneratedPrompt(res.prompt);
    } catch (err: any) {
      setError(err.message || 'Failed to generate prompt');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (generatedPrompt) {
      navigator.clipboard.writeText(generatedPrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (!generatedPrompt) return;
    const blob = new Blob([generatedPrompt], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `snapaction-prompt-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Code className="w-5 h-5 text-purple-400" />
          <h3 className="font-bold text-slate-100 text-sm">
            Screenshot → Prompt Engine (Flagship)
          </h3>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono">
          Deconstructs UI &amp; Layout
        </span>
      </div>

      <p className="text-xs text-slate-400 leading-relaxed">
        Deconstructs typography, spacing, KPI cards, tables, charts, and colors into production-grade prompts for AI coding agents.
      </p>

      {/* Target Tool Selection */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-[11px] font-semibold text-slate-300 block mb-1">
            Target AI / Agent Tool:
          </label>
          <select
            value={targetTool}
            onChange={(e) => setTargetTool(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-purple-500"
          >
            {tools.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-[11px] font-semibold text-slate-300 block mb-1">
            Target Architecture / Framework:
          </label>
          <select
            value={promptStyle}
            onChange={(e) => setPromptStyle(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-purple-500"
          >
            {styles.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Custom instructions optional */}
      <div>
        <label className="text-[11px] font-semibold text-slate-300 block mb-1">
          Custom Requirements or Focus Areas (optional):
        </label>
        <input
          type="text"
          value={customNotes}
          onChange={(e) => setCustomNotes(e.target.value)}
          placeholder="e.g. Include dark mode toggle, offline sync, make mobile first..."
          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
        />
      </div>

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        disabled={loading}
        className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-600/25 transition-all cursor-pointer"
      >
        {loading ? (
          <>
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Deconstructing UI &amp; Generating Architecture Prompt...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4 text-purple-200" />
            <span>Generate High-Precision Prompt</span>
          </>
        )}
      </button>

      {error && (
        <div className="p-3 rounded-xl bg-red-950/40 border border-red-800/60 text-xs text-red-300">
          {error}
        </div>
      )}

      {/* Output prompt */}
      {generatedPrompt && (
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-purple-400" />
              <span className="text-[11px] font-semibold text-purple-300 font-mono">
                {targetTool} Master Prompt
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-[11px] text-slate-300 hover:text-white px-2.5 py-1 rounded bg-slate-800 border border-slate-700 transition-colors"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center gap-1 text-[11px] text-slate-300 hover:text-white px-2.5 py-1 rounded bg-slate-800 border border-slate-700 transition-colors"
                title="Download prompt as markdown"
              >
                <Download className="w-3 h-3" />
                <span>Save .md</span>
              </button>
            </div>
          </div>

          <div className="text-xs text-slate-200 leading-relaxed font-mono whitespace-pre-wrap bg-slate-950/80 p-3 rounded-lg border border-slate-800/80 max-h-96 overflow-y-auto">
            {generatedPrompt}
          </div>
        </div>
      )}
    </div>
  );
};
