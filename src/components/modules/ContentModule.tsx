import React, { useState } from 'react';
import {
  Share2,
  Copy,
  Check,
  Sparkles,
  Linkedin,
  Twitter,
  Instagram,
  Youtube,
  FileText,
  Video,
} from 'lucide-react';
import { generateContent } from '../../services/api';
import { ContentResult } from '../../types';

interface ContentModuleProps {
  screenshotSummary: string;
  ocrText?: string;
}

export const ContentModule: React.FC<ContentModuleProps> = ({
  screenshotSummary,
  ocrText = '',
}) => {
  const [platform, setPlatform] = useState('LinkedIn Post');
  const [tone, setTone] = useState('Professional & Insightful');
  const [goal, setGoal] = useState('Drive engagement & thought leadership');
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState<ContentResult | null>(null);
  const [copied, setCopied] = useState(false);

  const platforms = [
    'LinkedIn Post',
    'X (Twitter) Thread',
    'Instagram Carousel & Caption',
    'YouTube Shorts / Reel Script',
    'Blog Article Outline',
    'Company Newsletter Feature',
  ];

  const tones = [
    'Professional & Insightful',
    'Viral / High Engagement',
    'Educational & Step-by-Step',
    'Inspirational & Visionary',
    'Technical Breakdown',
  ];

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await generateContent(screenshotSummary, ocrText, platform, tone, goal);
      setContent(res);
    } catch (err: any) {
      alert('Content generation error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!content) return;
    const fullText = `${content.headline}\n\n${content.main_post}\n\n${content.call_to_action}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Share2 className="w-5 h-5 text-pink-400" />
          <h3 className="font-bold text-slate-100 text-sm">
            Screenshot → Create Content &amp; Social Posts
          </h3>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 font-mono">
          Transformative Repurposing
        </span>
      </div>

      <p className="text-xs text-slate-400 leading-relaxed">
        Transforms ideas, dashboards, receipts, or announcements into high-engagement social media posts, reel scripts, and articles without verbatim copying.
      </p>

      {/* Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div>
          <label className="font-semibold text-slate-300 block mb-1">Target Format:</label>
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:ring-1 focus:ring-pink-500"
          >
            {platforms.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="font-semibold text-slate-300 block mb-1">Tone of Voice:</label>
          <select
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:ring-1 focus:ring-pink-500"
          >
            {tones.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        onClick={handleGenerate}
        disabled={loading}
        className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-pink-600/25 transition-all cursor-pointer"
      >
        {loading ? (
          <>
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Generating {platform}...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            <span>Generate Transformed Content</span>
          </>
        )}
      </button>

      {content && (
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-[11px] font-bold text-pink-400 font-mono">
              {platform} Ready-to-Publish
            </span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 text-[11px] text-slate-300 hover:text-white px-2.5 py-1 rounded bg-slate-800 border border-slate-700"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copied Post' : 'Copy'}</span>
            </button>
          </div>

          <div className="space-y-2 text-xs">
            <h4 className="font-bold text-slate-100 text-sm">{content.headline}</h4>
            <div className="p-3.5 rounded-lg bg-slate-950 text-slate-200 whitespace-pre-wrap font-sans leading-relaxed border border-slate-800/80">
              {content.main_post}
            </div>

            {content.call_to_action && (
              <p className="text-slate-400 font-medium">
                🎯 <span className="text-slate-200">{content.call_to_action}</span>
              </p>
            )}

            {content.alternative_hooks?.length && (
              <div className="pt-2 border-t border-slate-800 text-[11px]">
                <span className="text-slate-500 font-semibold block mb-1">
                  Alternative Hooks:
                </span>
                <ul className="text-slate-400 space-y-1 list-disc list-inside">
                  {content.alternative_hooks.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
