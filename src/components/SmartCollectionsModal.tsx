import React, { useState } from 'react';
import { X, Folder, Layers, Search, Tag, Check, Sparkles, Filter } from 'lucide-react';
import { ScreenshotAnalysis, SmartCollection } from '../types';

interface SmartCollectionsModalProps {
  history: ScreenshotAnalysis[];
  onSelectScreenshot: (item: ScreenshotAnalysis) => void;
  onClose: () => void;
}

const DEFAULT_COLLECTIONS: SmartCollection[] = [
  { id: 'col-all', name: 'All Screenshots', icon: '📁', description: 'Complete capture repository' },
  { id: 'col-jobs', name: 'Job Search', icon: '💼', description: 'Vacancies, resumes & applications', categoryFilter: 'job_vacancy' },
  { id: 'col-travel', name: 'Travel & Trips', icon: '✈️', description: 'Flights, bookings & itineraries', categoryFilter: 'travel_itinerary' },
  { id: 'col-finance', name: 'Receipts & Expenses', icon: '🧾', description: 'Bills, invoices & reimbursements', categoryFilter: 'receipt_invoice' },
  { id: 'col-design', name: 'UI & App Designs', icon: '🎨', description: 'Dashboards, layouts & prompt inspirations', categoryFilter: 'ui_design' },
  { id: 'col-code', name: 'Code & Errors', icon: '💻', description: 'Stack traces, terminals & code snippets', categoryFilter: 'code_error' },
  { id: 'col-study', name: 'Study & Notes', icon: '🎓', description: 'Articles, books & flashcard materials', categoryFilter: 'document_note' },
  { id: 'col-chat', name: 'Conversations', icon: '💬', description: 'WhatsApp, SMS & team discussions', categoryFilter: 'chat_message' },
];

export const SmartCollectionsModal: React.FC<SmartCollectionsModalProps> = ({
  history,
  onSelectScreenshot,
  onClose,
}) => {
  const [selectedCol, setSelectedCol] = useState<string>('col-all');
  const [searchQuery, setSearchQuery] = useState('');

  const activeCol = DEFAULT_COLLECTIONS.find((c) => c.id === selectedCol) || DEFAULT_COLLECTIONS[0];

  const filteredItems = history.filter((item) => {
    // Category filter
    if (activeCol.categoryFilter && item.content_type !== activeCol.categoryFilter) {
      return false;
    }
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.detected_title?.toLowerCase().includes(q);
      const matchSummary = item.summary.toLowerCase().includes(q);
      const matchOcr = item.ocr_text?.toLowerCase().includes(q);
      return matchTitle || matchSummary || matchOcr;
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Smart Collections & Stacks</h3>
              <p className="text-xs text-slate-400">
                Automatically categorized groups powered by multimodal understanding.
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

        {/* Content Body */}
        <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
          {/* Left Sidebar: Collections list */}
          <div className="w-full md:w-64 border-r border-slate-800 p-4 space-y-1 overflow-y-auto bg-slate-950/50">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2 block">
              Auto-Collections
            </span>
            {DEFAULT_COLLECTIONS.map((col) => {
              const count =
                col.id === 'col-all'
                  ? history.length
                  : history.filter((i) => i.content_type === col.categoryFilter).length;

              return (
                <button
                  key={col.id}
                  onClick={() => setSelectedCol(col.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    selectedCol === col.id
                      ? 'bg-blue-600 text-white font-semibold shadow-sm'
                      : 'text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 truncate">
                    <span>{col.icon}</span>
                    <span className="truncate">{col.name}</span>
                  </div>
                  <span
                    className={`text-[11px] px-1.5 py-0.5 rounded-full ${
                      selectedCol === col.id ? 'bg-blue-700 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right Main Grid */}
          <div className="flex-1 flex flex-col min-h-0 p-6 space-y-4 overflow-y-auto">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search collection by keywords, entities, or dates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Results Grid */}
            {filteredItems.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-slate-400 space-y-2">
                <Folder className="w-10 h-10 stroke-1 text-slate-600" />
                <p className="text-xs">No screenshots found in this collection.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      onSelectScreenshot(item);
                      onClose();
                    }}
                    className="p-3 bg-slate-950/70 border border-slate-800 hover:border-blue-500/50 rounded-2xl cursor-pointer transition-all hover:scale-[1.01] flex space-x-3 group"
                  >
                    <div className="w-16 h-16 rounded-xl bg-slate-900 overflow-hidden flex-shrink-0 border border-slate-800 flex items-center justify-center">
                      <img src={item.imageBase64} alt="Thumb" className="w-full h-full object-cover" />
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <h5 className="text-xs font-bold text-white truncate group-hover:text-blue-400 transition-colors">
                          {item.detected_title || 'Untitled Screenshot'}
                        </h5>
                        <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">{item.summary}</p>
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono mt-1">
                        <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                        <span className="capitalize text-blue-400">{item.content_type.replace('_', ' ')}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
