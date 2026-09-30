import React, { useState } from 'react';
import {
  History,
  Search,
  Trash2,
  Calendar,
  Tag,
  ArrowRight,
  Filter,
  X,
  Sparkles,
  Bookmark,
} from 'lucide-react';
import { ScreenshotAnalysis } from '../types';

interface HistoryMemoryViewProps {
  isOpen: boolean;
  onClose: () => void;
  history: ScreenshotAnalysis[];
  onSelectHistoryItem: (item: ScreenshotAnalysis) => void;
  onDeleteHistoryItem: (id: string) => void;
  onClearAllHistory: () => void;
}

export const HistoryMemoryView: React.FC<HistoryMemoryViewProps> = ({
  isOpen,
  onClose,
  history,
  onSelectHistoryItem,
  onDeleteHistoryItem,
  onClearAllHistory,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  if (!isOpen) return null;

  const categories = [
    { id: 'all', label: 'All Screenshots' },
    { id: 'job_vacancy', label: 'Jobs & Vacancies' },
    { id: 'ui_design', label: 'UI & App Designs' },
    { id: 'chat_message', label: 'Chats & Messages' },
    { id: 'event_poster', label: 'Events & Meetups' },
    { id: 'receipt_invoice', label: 'Expenses & Receipts' },
    { id: 'contact_card', label: 'Contacts' },
  ];

  // Natural language & entity filter
  const filteredHistory = history.filter((item) => {
    const matchesCat = selectedCategory === 'all' || item.content_type === selectedCategory;
    if (!matchesCat) return false;

    if (!searchQuery.trim()) return true;

    const q = searchQuery.toLowerCase();
    const matchSummary = item.summary.toLowerCase().includes(q);
    const matchTitle = (item.detected_title || '').toLowerCase().includes(q);
    const matchOcr = (item.ocr_text || '').toLowerCase().includes(q);
    const matchCompany = (item.entities.company_or_merchant || '').toLowerCase().includes(q);
    const matchLocation = (item.entities.location_or_venue || '').toLowerCase().includes(q);
    const matchTags = (item.tags || []).some((t) => t.toLowerCase().includes(q));
    const matchSkills = (item.entities.key_skills_or_tags || []).some((s) => s.toLowerCase().includes(q));

    return (
      matchSummary ||
      matchTitle ||
      matchOcr ||
      matchCompany ||
      matchLocation ||
      matchTags ||
      matchSkills
    );
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-sm">
                AI Screenshot Memory &amp; Semantic Search
              </h3>
              <p className="text-xs text-slate-400">
                Search naturally across OCR text, summaries, skills, and entities.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to delete all saved screenshot memory?')) {
                    onClearAllHistory();
                  }
                }}
                className="text-xs text-rose-400 hover:text-rose-300 px-2.5 py-1 rounded-lg border border-rose-900/60 hover:bg-rose-950/40 transition-colors flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Clear All</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 rounded-full text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-4 border-b border-slate-800/80 space-y-3 bg-slate-950/60">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder='Search e.g. "Dubai", "NEBOSH", "receipt", "Blue Bottle", "Python"...'
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results List */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3 flex-1">
          {filteredHistory.length === 0 ? (
            <div className="text-center py-12 space-y-2">
              <History className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-xs text-slate-400 font-medium">
                No screenshots found in memory.
              </p>
              <p className="text-[11px] text-slate-500">
                Analyze any screenshot and tap "Save to Memory" to build your searchable history.
              </p>
            </div>
          ) : (
            filteredHistory.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 group"
              >
                <div
                  onClick={() => {
                    onSelectHistoryItem(item);
                    onClose();
                  }}
                  className="flex items-start gap-3 flex-1 min-w-0 cursor-pointer"
                >
                  <div className="w-16 h-16 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden shrink-0">
                    <img
                      src={item.imageBase64}
                      alt="Thumbnail"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-slate-200 truncate">
                        {item.detected_title || item.summary.slice(0, 40)}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 uppercase font-mono">
                        {item.content_type.replace('_', ' ')}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 line-clamp-1">{item.summary}</p>

                    <div className="flex items-center gap-3 mt-2 text-[10px] text-slate-500">
                      <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                      {item.entities.company_or_merchant && (
                        <span>• {item.entities.company_or_merchant}</span>
                      )}
                      {item.entities.prices_or_salary && (
                        <span className="text-emerald-400 font-mono">
                          • {item.entities.prices_or_salary}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                  <button
                    onClick={() => {
                      onSelectHistoryItem(item);
                      onClose();
                    }}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs flex items-center gap-1 transition-colors"
                    title="Open actions"
                  >
                    <span>View Actions</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onDeleteHistoryItem(item.id)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 transition-colors"
                    title="Delete screenshot from history"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
