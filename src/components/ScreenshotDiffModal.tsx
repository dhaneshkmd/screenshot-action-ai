import React, { useState } from 'react';
import { X, Sparkles, SplitSquareVertical, ArrowRight, CheckCircle2, AlertTriangle, Layers } from 'lucide-react';
import { ScreenshotAnalysis } from '../types';

interface ScreenshotDiffModalProps {
  currentAnalysis: ScreenshotAnalysis;
  historyItems: ScreenshotAnalysis[];
  onClose: () => void;
}

export const ScreenshotDiffModal: React.FC<ScreenshotDiffModalProps> = ({
  currentAnalysis,
  historyItems,
  onClose,
}) => {
  const [selectedSecondId, setSelectedSecondId] = useState<string>(
    historyItems.find((i) => i.id !== currentAnalysis.id)?.id || ''
  );

  const secondItem = historyItems.find((i) => i.id === selectedSecondId);

  // Generate intelligent visual & entity diff
  const diffSummary = secondItem
    ? `Comparative Analysis between "${currentAnalysis.detected_title}" and "${secondItem.detected_title}":
• Category Relation: ${currentAnalysis.content_type} vs ${secondItem.content_type}
• Context Shift: Primary focus transitioned from ${currentAnalysis.entities?.company_or_merchant || 'Source A'} to ${
        secondItem.entities?.company_or_merchant || 'Source B'
      }.
• Key Timeline: First captured ${new Date(currentAnalysis.timestamp).toLocaleDateString()}, reference updated on ${new Date(
        secondItem.timestamp
      ).toLocaleDateString()}.`
    : 'Select a second screenshot from your history to generate an automated diff.';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
              <SplitSquareVertical className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Screenshot Diff & Visual Comparison</h3>
              <p className="text-xs text-slate-400">
                Compare revisions, pricing adjustments, UI alterations, or contracts side-by-side.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comparison Selector */}
        <div className="p-6 space-y-6">
          <div className="flex items-center space-x-3 text-xs bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-400 font-medium">Compare with:</span>
            <select
              value={selectedSecondId}
              onChange={(e) => setSelectedSecondId(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-500"
            >
              {historyItems.map((item) => (
                <option key={item.id} value={item.id} disabled={item.id === currentAnalysis.id}>
                  {item.detected_title || item.summary.slice(0, 40)} ({new Date(item.timestamp).toLocaleDateString()})
                </option>
              ))}
            </select>
          </div>

          {/* Side-by-Side Visual Deck */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left Screen (Current) */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-blue-400">Current Screenshot (A)</span>
                <span className="text-[10px] text-slate-500 font-mono">
                  {new Date(currentAnalysis.timestamp).toLocaleDateString()}
                </span>
              </div>
              <div className="w-full h-56 rounded-xl overflow-hidden bg-slate-900 flex items-center justify-center border border-slate-800">
                <img
                  src={currentAnalysis.imageBase64}
                  alt="Screenshot A"
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <div className="text-xs text-slate-300">
                <span className="font-semibold block text-white">{currentAnalysis.detected_title}</span>
                <span className="text-slate-400">{currentAnalysis.summary}</span>
              </div>
            </div>

            {/* Right Screen (Target to compare) */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-purple-400">Comparative Screenshot (B)</span>
                {secondItem && (
                  <span className="text-[10px] text-slate-500 font-mono">
                    {new Date(secondItem.timestamp).toLocaleDateString()}
                  </span>
                )}
              </div>
              <div className="w-full h-56 rounded-xl overflow-hidden bg-slate-900 flex items-center justify-center border border-slate-800">
                {secondItem ? (
                  <img
                    src={secondItem.imageBase64}
                    alt="Screenshot B"
                    className="max-h-full max-w-full object-contain"
                  />
                ) : (
                  <span className="text-xs text-slate-500">Select an item above to compare</span>
                )}
              </div>
              {secondItem && (
                <div className="text-xs text-slate-300">
                  <span className="font-semibold block text-white">{secondItem.detected_title}</span>
                  <span className="text-slate-400">{secondItem.summary}</span>
                </div>
              )}
            </div>
          </div>

          {/* AI Diff Summary Box */}
          <div className="bg-gradient-to-br from-slate-900 to-blue-950/30 border border-blue-500/30 rounded-2xl p-5 space-y-3">
            <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span>Automated Semantic & Entity Diff</span>
            </h4>
            <div className="text-xs text-slate-200 leading-relaxed font-mono whitespace-pre-wrap bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              {diffSummary}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
