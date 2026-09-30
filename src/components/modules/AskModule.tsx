import React, { useState } from 'react';
import {
  HelpCircle,
  Send,
  Sparkles,
  Copy,
  Check,
  Languages,
  FileText,
  Phone,
  Calendar,
} from 'lucide-react';
import { askScreenshotQuestion } from '../../services/api';

interface AskModuleProps {
  imageBase64: string;
  suggestedQuestions?: string[];
}

export const AskModule: React.FC<AskModuleProps> = ({
  imageBase64,
  suggestedQuestions = [],
}) => {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const defaultSuggestions = [
    'Explain this screenshot in simple terms',
    'Extract all contact info, emails, and phone numbers',
    'Summarize the key dates, deadlines, and action items',
    'Translate any visible text to English',
    'What should I do next with this?',
  ];

  const questionsToDisplay = suggestedQuestions.length > 0 ? suggestedQuestions : defaultSuggestions;

  const handleAsk = async (queryToAsk?: string) => {
    const q = queryToAsk || question;
    if (!q.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const result = await askScreenshotQuestion(imageBase64, q);
      setAnswer(result);
    } catch (err: any) {
      setError(err.message || 'Failed to get answer');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (answer) {
      navigator.clipboard.writeText(answer);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <HelpCircle className="w-5 h-5 text-blue-400" />
        <h3 className="font-bold text-slate-100 text-sm">
          Screenshot → Ask AI (Multimodal Q&amp;A)
        </h3>
      </div>
      <p className="text-xs text-slate-400">
        Ask anything about this screenshot. Gemini vision will inspect typography, charts, tables, and details.
      </p>

      {/* Suggested question chips */}
      <div className="flex flex-wrap gap-1.5">
        {questionsToDisplay.slice(0, 5).map((q, idx) => (
          <button
            key={idx}
            onClick={() => {
              setQuestion(q);
              handleAsk(q);
            }}
            className="text-left text-[11px] px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border border-slate-700/60 transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-3 h-3 text-blue-400 shrink-0" />
            <span>{q}</span>
          </button>
        ))}
      </div>

      {/* Input box */}
      <div className="flex gap-2">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
          placeholder="Ask a question about this screenshot..."
          className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <button
          onClick={() => handleAsk()}
          disabled={loading || !question.trim()}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-blue-600/30 transition-colors cursor-pointer"
        >
          {loading ? (
            <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Send className="w-3.5 h-3.5" />
          )}
          <span>Ask</span>
        </button>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-red-950/40 border border-red-800/60 text-xs text-red-300">
          {error}
        </div>
      )}

      {/* Answer box */}
      {answer && (
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 relative space-y-2">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-400 font-mono flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              AI Vision Explanation
            </span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200 px-2 py-1 rounded bg-slate-800 border border-slate-700 transition-colors"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <div className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap font-sans">
            {answer}
          </div>
        </div>
      )}
    </div>
  );
};
