import React, { useState } from 'react';
import {
  MessageSquare,
  Copy,
  Check,
  Send,
  Sparkles,
  Mail,
  ThumbsUp,
  Briefcase,
  Zap,
  Scale,
} from 'lucide-react';
import { generateCommunicationReply } from '../../services/api';
import { CommunicationReplyResult } from '../../types';

interface CommunicationModuleProps {
  chatContext: string;
}

export const CommunicationModule: React.FC<CommunicationModuleProps> = ({
  chatContext,
}) => {
  const [instructions, setInstructions] = useState('');
  const [loading, setLoading] = useState(false);
  const [replyData, setReplyData] = useState<CommunicationReplyResult | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleGenerateReplies = async () => {
    setLoading(true);
    try {
      const res = await generateCommunicationReply(chatContext, instructions);
      setReplyData(res);
    } catch (err: any) {
      alert('Failed to generate replies: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-amber-400" />
          <h3 className="font-bold text-slate-100 text-sm">
            Screenshot → Communication &amp; Smart Replies
          </h3>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono">
          WhatsApp • SMS • Email
        </span>
      </div>

      <p className="text-xs text-slate-400 leading-relaxed">
        Extracts sender intent and drafts 4 tailored reply variations across different tones.
      </p>

      {/* Optional custom tone / prompt */}
      <div className="flex gap-2">
        <input
          type="text"
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          placeholder="e.g. Say I am available Friday, decline politely, ask for 20% discount..."
          className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
        />
        <button
          onClick={handleGenerateReplies}
          disabled={loading}
          className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-amber-600/20 transition-colors cursor-pointer"
        >
          {loading ? (
            <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Sparkles className="w-3.5 h-3.5" />
          )}
          <span>Generate 4 Tones</span>
        </button>
      </div>

      {replyData && (
        <div className="space-y-3">
          {replyData.key_takeaway && (
            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold text-amber-400 font-mono">
                Key Takeaway:
              </span>
              <span>{replyData.key_takeaway}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* 1. Professional */}
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-1.5">
                  <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-blue-400" />
                    Professional &amp; Business
                  </span>
                  <button
                    onClick={() => copyToClipboard(replyData.professional, 'pro')}
                    className="text-[11px] text-slate-400 hover:text-slate-200 flex items-center gap-1"
                  >
                    {copiedKey === 'pro' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'pro' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  {replyData.professional}
                </p>
              </div>
            </div>

            {/* 2. Friendly */}
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-1.5">
                  <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <ThumbsUp className="w-3.5 h-3.5 text-emerald-400" />
                    Friendly &amp; Warm
                  </span>
                  <button
                    onClick={() => copyToClipboard(replyData.friendly, 'friendly')}
                    className="text-[11px] text-slate-400 hover:text-slate-200 flex items-center gap-1"
                  >
                    {copiedKey === 'friendly' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'friendly' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  {replyData.friendly}
                </p>
              </div>
            </div>

            {/* 3. Concise */}
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-1.5">
                  <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    Concise &amp; Direct
                  </span>
                  <button
                    onClick={() => copyToClipboard(replyData.concise, 'concise')}
                    className="text-[11px] text-slate-400 hover:text-slate-200 flex items-center gap-1"
                  >
                    {copiedKey === 'concise' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'concise' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  {replyData.concise}
                </p>
              </div>
            </div>

            {/* 4. Firm / Negotiate */}
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-1.5">
                  <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <Scale className="w-3.5 h-3.5 text-purple-400" />
                    Firm / Polite Boundary
                  </span>
                  <button
                    onClick={() => copyToClipboard(replyData.firm_or_negotiate, 'firm')}
                    className="text-[11px] text-slate-400 hover:text-slate-200 flex items-center gap-1"
                  >
                    {copiedKey === 'firm' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'firm' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  {replyData.firm_or_negotiate}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
