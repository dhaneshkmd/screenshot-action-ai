import React, { useState } from 'react';
import {
  ArrowLeft,
  Sparkles,
  ShieldAlert,
  ShieldCheck,
  CheckCircle,
  HelpCircle,
  Code,
  Briefcase,
  MessageSquare,
  Share2,
  Calendar,
  Receipt,
  User,
  Copy,
  Check,
  Eye,
  EyeOff,
  Bookmark,
  Share,
  Download,
  Smartphone,
  SplitSquareVertical,
  Layers,
  Send,
  Zap,
  Tag,
  ShoppingBag,
  Plane,
  GraduationCap,
  Terminal,
  ExternalLink,
} from 'lucide-react';
import { ScreenshotAnalysis, CareerProfile, DispatchedIntentPayload } from '../types';
import { ActionRouter } from '../services/actionRouter';
import { parseNaturalCommand } from '../services/api';
import { AndroidChooserModal } from './AndroidChooserModal';
import { ScreenshotDiffModal } from './ScreenshotDiffModal';
import { SmartCollectionsModal } from './SmartCollectionsModal';
import { AskModule } from './modules/AskModule';
import { PromptModule } from './modules/PromptModule';
import { JobCareerModule } from './modules/JobCareerModule';
import { CommunicationModule } from './modules/CommunicationModule';
import { ContentModule } from './modules/ContentModule';
import { EventCalendarModule } from './modules/EventCalendarModule';
import { ExpenseModule } from './modules/ExpenseModule';
import { ContactModule } from './modules/ContactModule';
import { AgentWorkflowModule } from './modules/AgentWorkflowModule';
import { CodeStudioModule } from './modules/CodeStudioModule';
import { StudyDocumentModule } from './modules/StudyDocumentModule';
import { ShoppingTravelModule } from './modules/ShoppingTravelModule';

interface AnalysisResultViewProps {
  analysis: ScreenshotAnalysis;
  careerProfile: CareerProfile;
  onOpenCareerProfile: () => void;
  onBackToHome: () => void;
  onSaveToMemory: () => void;
  isSavedInMemory: boolean;
  history?: ScreenshotAnalysis[];
  onSelectHistoryItem?: (item: ScreenshotAnalysis) => void;
}

export const AnalysisResultView: React.FC<AnalysisResultViewProps> = ({
  analysis,
  careerProfile,
  onOpenCareerProfile,
  onBackToHome,
  onSaveToMemory,
  isSavedInMemory,
  history = [],
  onSelectHistoryItem,
}) => {
  // Determine default tab based on classified content type
  const getInitialTab = (): string => {
    switch (analysis.content_type) {
      case 'job_vacancy':
      case 'job_advertisement':
        return 'job';
      case 'ui_design':
        return 'prompt';
      case 'chat_message':
        return 'communication';
      case 'event_poster':
      case 'event_calendar':
        return 'event';
      case 'receipt_invoice':
      case 'banking_payment':
        return 'expense';
      case 'contact_card':
        return 'contact';
      case 'code_error':
        return 'code_studio';
      case 'travel_itinerary':
      case 'product_shopping':
      case 'product_listing':
        return 'shopping';
      case 'study_education':
      case 'document_note':
      case 'article_news':
        return 'study';
      default:
        return 'actions';
    }
  };

  const [activeTab, setActiveTab] = useState<string>(getInitialTab());
  const [showOcrText, setShowOcrText] = useState(false);
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [selectedIntentForChooser, setSelectedIntentForChooser] = useState<DispatchedIntentPayload | null>(null);

  // Redaction / Privacy visual filter
  const [isVisuallyRedacted, setIsVisuallyRedacted] = useState(analysis.sensitive_data_detected);

  // Modals for Diff and Collections
  const [showDiffModal, setShowDiffModal] = useState(false);
  const [showCollectionsModal, setShowCollectionsModal] = useState(false);

  // Natural Language Command input state
  const [naturalCommand, setNaturalCommand] = useState('');
  const [commandFeedback, setCommandFeedback] = useState<string | null>(null);

  const routedIntents = ActionRouter.routeActions(analysis);
  const entityCategorization = ActionRouter.categorizeDetectedEntity(analysis);
  const plannedActionPlans = ActionRouter.planRoutedActions(analysis);

  const handleCopySummary = () => {
    navigator.clipboard.writeText(analysis.summary);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  // Natural language command submit
  const handleExecuteCommand = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!naturalCommand.trim()) return;

    const result = parseNaturalCommand(naturalCommand, analysis);
    setCommandFeedback(result.message);
    setActiveTab(result.targetTab);
    setNaturalCommand('');
    setTimeout(() => setCommandFeedback(null), 4000);
  };

  // Human-friendly title and color for category
  const getCategoryMeta = (cat: string) => {
    switch (cat) {
      case 'job_vacancy':
      case 'job_advertisement':
        return { label: 'Job Vacancy', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' };
      case 'ui_design':
        return { label: 'UI / App Design', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' };
      case 'chat_message':
        return { label: 'Chat / Communication', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' };
      case 'event_poster':
      case 'event_calendar':
        return { label: 'Event & Conference', color: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' };
      case 'receipt_invoice':
      case 'banking_payment':
        return { label: 'Receipt & Expense', color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' };
      case 'contact_card':
        return { label: 'Contact & Business Card', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' };
      case 'code_error':
        return { label: 'Technical Bug / Code', color: 'bg-rose-500/20 text-rose-400 border-rose-500/30' };
      case 'travel_itinerary':
        return { label: 'Travel & Flight Booking', color: 'bg-sky-500/20 text-sky-400 border-sky-500/30' };
      case 'product_shopping':
      case 'product_listing':
        return { label: 'Product & Shopping', color: 'bg-teal-500/20 text-teal-400 border-teal-500/30' };
      case 'study_education':
      case 'document_note':
      case 'article_news':
        return { label: 'Document & Study Notes', color: 'bg-violet-500/20 text-violet-400 border-violet-500/30' };
      default:
        return { label: 'Screenshot Analyzed', color: 'bg-slate-700 text-slate-300 border-slate-600' };
    }
  };

  const catMeta = getCategoryMeta(analysis.content_type);

  // Dynamic Top 4 Contextual Actions
  const getTop4Actions = () => {
    switch (analysis.content_type) {
      case 'job_vacancy':
      case 'job_advertisement':
        return [
          { id: 'job-apply', label: 'Apply for Job', tab: 'job', icon: '💼', primary: true },
          { id: 'job-tailor', label: 'Tailor My CV', tab: 'job', icon: '📄' },
          { id: 'job-agent', label: 'Run Job Agent', tab: 'agent', icon: '⚡' },
          { id: 'job-email', label: 'Draft Email', tab: 'actions', icon: '✉️' },
        ];
      case 'travel_itinerary':
        return [
          { id: 'trv-cal', label: 'Add to Calendar', tab: 'event', icon: '📅', primary: true },
          { id: 'trv-agent', label: 'Travel Concierge Agent', tab: 'agent', icon: '✈️' },
          { id: 'trv-track', label: 'Flight Checklist', tab: 'shopping', icon: '📋' },
          { id: 'trv-maps', label: 'Open Airport in Maps', tab: 'contact', icon: '📍' },
        ];
      case 'ui_design':
        return [
          { id: 'ui-prompt', label: 'Generate React / Cursor Code', tab: 'prompt', icon: '🎨', primary: true },
          { id: 'ui-code', label: 'Refactor / Debug in Studio', tab: 'code_studio', icon: '💻' },
          { id: 'ui-agent', label: 'Run Design Agent', tab: 'agent', icon: '⚡' },
          { id: 'ui-ask', label: 'Deconstruct Components', tab: 'ask', icon: '🔍' },
        ];
      case 'code_error':
        return [
          { id: 'code-debug', label: 'Debug & Fix Error', tab: 'code_studio', icon: '🐛', primary: true },
          { id: 'code-test', label: 'Generate Unit Tests', tab: 'code_studio', icon: '🧪' },
          { id: 'code-agent', label: 'Run Coding Agent', tab: 'agent', icon: '⚡' },
          { id: 'code-copy', label: 'Copy Clean Code', tab: 'actions', icon: '📋' },
        ];
      case 'receipt_invoice':
      case 'banking_payment':
        return [
          { id: 'rc-csv', label: 'Export Line Items to CSV', tab: 'expense', icon: '🧾', primary: true },
          { id: 'rc-agent', label: 'Run Expense Agent', tab: 'agent', icon: '⚡' },
          { id: 'rc-remind', label: 'Set Payment Reminder', tab: 'event', icon: '⏰' },
          { id: 'rc-ask', label: 'Ask Tax & Audit AI', tab: 'ask', icon: '💡' },
        ];
      case 'study_education':
      case 'document_note':
      case 'article_news':
        return [
          { id: 'doc-trans', label: 'Bilingual Translation', tab: 'study', icon: '🌐', primary: true },
          { id: 'doc-flash', label: 'Study Flashcards & Quiz', tab: 'study', icon: '🎓' },
          { id: 'doc-agent', label: 'Run Research Agent', tab: 'agent', icon: '⚡' },
          { id: 'doc-md', label: 'Export to Markdown', tab: 'study', icon: '📥' },
        ];
      case 'product_shopping':
      case 'product_listing':
        return [
          { id: 'prod-comp', label: 'Compare Retail Prices', tab: 'shopping', icon: '🏷️', primary: true },
          { id: 'prod-watch', label: 'Track Price Drops', tab: 'shopping', icon: '📉' },
          { id: 'prod-agent', label: 'Run Shopping Agent', tab: 'agent', icon: '⚡' },
          { id: 'prod-ask', label: 'Find Alternatives', tab: 'ask', icon: '🔍' },
        ];
      case 'chat_message':
        return [
          { id: 'chat-reply', label: 'Draft Polite / Firm Reply', tab: 'communication', icon: '💬', primary: true },
          { id: 'chat-agent', label: 'Run Communication Agent', tab: 'agent', icon: '⚡' },
          { id: 'chat-contact', label: 'Save WhatsApp Contact', tab: 'contact', icon: '👤' },
          { id: 'chat-task', label: 'Extract Action Item', tab: 'event', icon: '✅' },
        ];
      default:
        return [
          { id: 'def-agent', label: 'Run Autonomous Agent', tab: 'agent', icon: '⚡', primary: true },
          { id: 'def-actions', label: 'Action Router', tab: 'actions', icon: '🚀' },
          { id: 'def-ask', label: 'Ask AI Any Question', tab: 'ask', icon: '💬' },
          { id: 'def-content', label: 'Turn Into Social Content', tab: 'content', icon: '📢' },
        ];
    }
  };

  const top4 = getTop4Actions();

  return (
    <div className="w-full max-w-6xl mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-6">
      {/* Top Bar Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={onBackToHome}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>New Screenshot</span>
        </button>

        <div className="flex flex-wrap items-center gap-2">
          {/* Screenshot Diff button */}
          {history.length > 1 && (
            <button
              onClick={() => setShowDiffModal(true)}
              className="flex items-center gap-1.5 text-xs font-medium text-slate-300 hover:text-white px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors"
              title="Compare with another screenshot"
            >
              <SplitSquareVertical className="w-3.5 h-3.5 text-purple-400" />
              <span>Diff / Compare</span>
            </button>
          )}

          {/* Smart Collections button */}
          <button
            onClick={() => setShowCollectionsModal(true)}
            className="flex items-center gap-1.5 text-xs font-medium text-slate-300 hover:text-white px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors"
          >
            <Layers className="w-3.5 h-3.5 text-blue-400" />
            <span>Collections</span>
          </button>

          {/* Save to memory */}
          {!analysis.processedOnceOnly ? (
            <button
              onClick={onSaveToMemory}
              disabled={isSavedInMemory}
              className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-xl border transition-colors ${
                isSavedInMemory
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>{isSavedInMemory ? 'Saved in Memory' : 'Save to Memory'}</span>
            </button>
          ) : (
            <div className="flex items-center gap-1.5 text-xs text-amber-400 bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-xl">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Process-Once Ephemeral</span>
            </div>
          )}

          {/* Privacy Redaction Toggle */}
          <button
            onClick={() => setIsVisuallyRedacted(!isVisuallyRedacted)}
            className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-xl border transition-colors ${
              isVisuallyRedacted
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            {isVisuallyRedacted ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{isVisuallyRedacted ? 'Redaction: Active' : 'Blur / Redact'}</span>
          </button>
        </div>
      </div>

      {/* Sensitive PII Detection Card (if applicable) */}
      {analysis.sensitive_data_detected && (
        <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/50 flex items-start gap-3 text-rose-200 text-xs animate-in fade-in">
          <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-rose-300">SECURITY AGENT WARNING: SENSITIVE PII DETECTED</span>
            <p className="text-rose-200/80 leading-relaxed">
              {analysis.sensitive_data_warning ||
                'Personal identifiable information (passcode, financial reference, or credentials) was spotted. Visual redaction is applied by default.'}
            </p>
          </div>
        </div>
      )}

      {/* DYNAMIC ACTION BOARD & COMMAND BAR */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900/90 to-blue-950/40 border border-blue-500/30 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-[10px] font-mono tracking-widest text-blue-400 uppercase font-bold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-blue-400" />
                <span>DYNAMIC AI ACTION BOARD</span>
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-[11px] text-emerald-400 font-semibold">
                Confidence: {Math.round(analysis.confidence * 100)}%
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              {analysis.detected_title || 'Screenshot Analyzed'}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <span className={`text-xs px-2.5 py-1 rounded-full border font-semibold ${catMeta.color}`}>
              {catMeta.label}
            </span>
            {analysis.detected_language && (
              <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                {analysis.detected_language}
              </span>
            )}
          </div>
        </div>

        {/* Top 4 Contextual Priority Action Chips */}
        <div className="space-y-2">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Top Priority Recommended Actions
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {top4.map((action) => (
              <button
                key={action.id}
                onClick={() => setActiveTab(action.tab)}
                className={`p-3 rounded-2xl border text-left transition-all hover:scale-[1.02] flex items-center space-x-3 shadow-md ${
                  action.primary
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-400/40 shadow-blue-600/25'
                    : 'bg-slate-950/70 hover:bg-slate-800/80 text-slate-200 border-slate-800 hover:border-slate-700'
                }`}
              >
                <span className="text-lg">{action.icon}</span>
                <div className="min-w-0">
                  <span className="text-xs font-bold block truncate">{action.label}</span>
                  <span className="text-[10px] opacity-75 block truncate">1-tap execute</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Natural Language Command Bar */}
        <form onSubmit={handleExecuteCommand} className="space-y-1 pt-1">
          <div className="relative flex items-center">
            <Zap className="w-4 h-4 absolute left-3.5 text-blue-400" />
            <input
              type="text"
              placeholder="Your screenshot is the command. Type what you want to do (e.g. 'Apply for this job', 'Add to calendar', 'Debug error')..."
              value={naturalCommand}
              onChange={(e) => setNaturalCommand(e.target.value)}
              className="w-full pl-10 pr-24 py-3 bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none transition-all shadow-inner"
            />
            <button
              type="submit"
              disabled={!naturalCommand.trim()}
              className="absolute right-2 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white text-xs font-bold flex items-center space-x-1.5 transition-all shadow-md shadow-blue-600/20"
            >
              <span>Execute</span>
              <Send className="w-3 h-3" />
            </button>
          </div>

          {commandFeedback && (
            <div className="text-[11px] text-blue-300 px-3 py-1 bg-blue-950/40 rounded-lg border border-blue-500/20 animate-in fade-in flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
              <span>{commandFeedback}</span>
            </div>
          )}
        </form>
      </div>

      {/* Main Grid: Left Screenshot View | Right Modular Studios */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Visual Capture & Entities */}
        <div className="lg:col-span-4 space-y-4">
          {/* Screenshot Display Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400 px-1">
              <span>Source Capture</span>
              {isVisuallyRedacted && (
                <span className="text-[10px] text-amber-400 font-mono bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  PII BLURRED
                </span>
              )}
            </div>

            <div className="w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 relative group flex items-center justify-center min-h-[240px] max-h-[480px]">
              <img
                src={analysis.imageBase64}
                alt="Captured Screenshot"
                className={`w-full max-h-[460px] object-contain transition-all duration-300 ${
                  isVisuallyRedacted ? 'filter blur-md select-none' : ''
                }`}
              />

              {isVisuallyRedacted && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center bg-slate-950/40 backdrop-blur-xs">
                  <ShieldCheck className="w-8 h-8 text-amber-400 mb-1" />
                  <span className="text-xs font-bold text-white">Visual Redaction Active</span>
                  <button
                    onClick={() => setIsVisuallyRedacted(false)}
                    className="mt-2 px-3 py-1 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-[11px] text-slate-300 border border-slate-700"
                  >
                    Click to Unblur
                  </button>
                </div>
              )}
            </div>

            {/* OCR Toggle */}
            <div className="flex items-center justify-between pt-1">
              <button
                onClick={() => setShowOcrText(!showOcrText)}
                className="text-xs text-blue-400 hover:text-blue-300 font-medium"
              >
                {showOcrText ? 'Hide Raw OCR Text' : 'View Extracted Text'}
              </button>
              <button
                onClick={handleCopySummary}
                className="text-xs text-slate-400 hover:text-white flex items-center space-x-1"
              >
                {copiedSummary ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSummary ? 'Copied' : 'Copy Summary'}</span>
              </button>
            </div>

            {showOcrText && (
              <div className="mt-2 p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-400 font-mono max-h-48 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                {analysis.ocr_text || analysis.summary}
              </div>
            )}
          </div>

          {/* Quick Extracted Entities Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-3 text-xs">
            <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">Structured Extracted Entities</h4>

            <div className="space-y-2">
              {analysis.entities?.company_or_merchant && (
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Organization:</span>
                  <span className="text-white font-medium text-right">{analysis.entities.company_or_merchant}</span>
                </div>
              )}
              {analysis.entities?.job_title && (
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Title / Role:</span>
                  <span className="text-white font-medium text-right">{analysis.entities.job_title}</span>
                </div>
              )}
              {analysis.entities?.location_or_venue && (
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Location:</span>
                  <span className="text-white font-medium text-right">{analysis.entities.location_or_venue}</span>
                </div>
              )}
              {analysis.entities?.prices_or_salary && (
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Price / Salary:</span>
                  <span className="text-emerald-400 font-bold text-right">{analysis.entities.prices_or_salary}</span>
                </div>
              )}
              {analysis.entities?.dates_or_deadlines && (
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Date / Deadline:</span>
                  <span className="text-amber-300 font-medium text-right">{analysis.entities.dates_or_deadlines}</span>
                </div>
              )}
              {analysis.entities?.emails?.length ? (
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Email:</span>
                  <span className="text-blue-400 font-mono text-right">{analysis.entities.emails[0]}</span>
                </div>
              ) : null}
              {analysis.entities?.phones?.length ? (
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Phone / WhatsApp:</span>
                  <span className="text-emerald-400 font-mono text-right">{analysis.entities.phones[0]}</span>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {/* Right Column: Modular Studio Tabs & Engines */}
        <div className="lg:col-span-8 space-y-4">
          {/* Navigation Action Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin border-b border-slate-800 text-xs">
            <button
              onClick={() => setActiveTab('actions')}
              className={`px-3 py-2 rounded-xl font-semibold transition-all whitespace-nowrap flex items-center space-x-1.5 ${
                activeTab === 'actions'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <span>🚀</span>
              <span>Action Router</span>
            </button>

            <button
              onClick={() => setActiveTab('agent')}
              className={`px-3 py-2 rounded-xl font-semibold transition-all whitespace-nowrap flex items-center space-x-1.5 ${
                activeTab === 'agent'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-300" />
              <span>AI Agent Runner</span>
            </button>

            <button
              onClick={() => setActiveTab('job')}
              className={`px-3 py-2 rounded-xl font-semibold transition-all whitespace-nowrap flex items-center space-x-1.5 ${
                activeTab === 'job'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Job & CV Match</span>
            </button>

            <button
              onClick={() => setActiveTab('prompt')}
              className={`px-3 py-2 rounded-xl font-semibold transition-all whitespace-nowrap flex items-center space-x-1.5 ${
                activeTab === 'prompt'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>Prompt Engine</span>
            </button>

            <button
              onClick={() => setActiveTab('code_studio')}
              className={`px-3 py-2 rounded-xl font-semibold transition-all whitespace-nowrap flex items-center space-x-1.5 ${
                activeTab === 'code_studio'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Code Studio</span>
            </button>

            <button
              onClick={() => setActiveTab('study')}
              className={`px-3 py-2 rounded-xl font-semibold transition-all whitespace-nowrap flex items-center space-x-1.5 ${
                activeTab === 'study'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Study & Translation</span>
            </button>

            <button
              onClick={() => setActiveTab('shopping')}
              className={`px-3 py-2 rounded-xl font-semibold transition-all whitespace-nowrap flex items-center space-x-1.5 ${
                activeTab === 'shopping'
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Plane className="w-3.5 h-3.5" />
              <span>Shopping & Travel</span>
            </button>

            <button
              onClick={() => setActiveTab('communication')}
              className={`px-3 py-2 rounded-xl font-semibold transition-all whitespace-nowrap flex items-center space-x-1.5 ${
                activeTab === 'communication'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Reply / Chat</span>
            </button>

            <button
              onClick={() => setActiveTab('event')}
              className={`px-3 py-2 rounded-xl font-semibold transition-all whitespace-nowrap flex items-center space-x-1.5 ${
                activeTab === 'event'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Calendar</span>
            </button>

            <button
              onClick={() => setActiveTab('expense')}
              className={`px-3 py-2 rounded-xl font-semibold transition-all whitespace-nowrap flex items-center space-x-1.5 ${
                activeTab === 'expense'
                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Receipt className="w-3.5 h-3.5" />
              <span>Expense</span>
            </button>

            <button
              onClick={() => setActiveTab('contact')}
              className={`px-3 py-2 rounded-xl font-semibold transition-all whitespace-nowrap flex items-center space-x-1.5 ${
                activeTab === 'contact'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Contact & Maps</span>
            </button>

            <button
              onClick={() => setActiveTab('content')}
              className={`px-3 py-2 rounded-xl font-semibold transition-all whitespace-nowrap flex items-center space-x-1.5 ${
                activeTab === 'content'
                  ? 'bg-pink-600 text-white shadow-md shadow-pink-600/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Content</span>
            </button>

            <button
              onClick={() => setActiveTab('ask')}
              className={`px-3 py-2 rounded-xl font-semibold transition-all whitespace-nowrap flex items-center space-x-1.5 ${
                activeTab === 'ask'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Ask AI</span>
            </button>
          </div>

          {/* ACTIVE STUDIO PANEL */}
          <div className="min-h-[460px]">
            {/* 1. Action Router (Default & Universal) */}
            {activeTab === 'actions' && (
              <div className="space-y-4">
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">Automated Intent Execution Deck</h4>
                      <p className="text-xs text-slate-400">
                        Direct 1-tap dispatch to connected Android &amp; web productivity applications.
                      </p>
                    </div>
                  </div>

                  {/* Planned Actions */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {plannedActionPlans.map((plan) => (
                      <div
                        key={plan.id}
                        className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3 flex flex-col justify-between"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-white flex items-center gap-1.5">
                              <span>{plan.primaryTargetApp.iconEmoji}</span>
                              <span>{plan.primaryTargetApp.name}</span>
                            </span>
                            <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded font-mono">
                              {plan.entityType.replace('_', ' ')}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 leading-relaxed">{plan.explanation}</p>
                        </div>

                        <div className="flex items-center gap-2 pt-2">
                          <button
                            onClick={() => plan.dispatch()}
                            className="flex-1 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/20 flex items-center justify-center space-x-1.5"
                          >
                            <span>Launch {plan.primaryTargetApp.name}</span>
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 2. Autonomous Multi-Step Agent Runner */}
            {activeTab === 'agent' && (
              <AgentWorkflowModule
                analysis={analysis}
                careerProfile={careerProfile}
                onOpenCareerProfile={onOpenCareerProfile}
                onSwitchTab={setActiveTab}
              />
            )}

            {/* 3. Job Career Module */}
            {activeTab === 'job' && (
              <JobCareerModule
                analysis={analysis}
                careerProfile={careerProfile}
                onOpenCareerProfile={onOpenCareerProfile}
              />
            )}

            {/* 4. Prompt Engine */}
            {activeTab === 'prompt' && (
              <PromptModule
                imageBase64={analysis.imageBase64}
                defaultContentType={analysis.content_type}
              />
            )}

            {/* 5. Code Studio */}
            {activeTab === 'code_studio' && <CodeStudioModule analysis={analysis} />}

            {/* 6. Study & Bilingual Translation */}
            {activeTab === 'study' && <StudyDocumentModule analysis={analysis} />}

            {/* 7. Shopping & Travel */}
            {activeTab === 'shopping' && <ShoppingTravelModule analysis={analysis} />}

            {/* 8. Communication Reply */}
            {activeTab === 'communication' && (
              <CommunicationModule chatContext={analysis.ocr_text || analysis.summary} />
            )}

            {/* 9. Calendar Event */}
            {activeTab === 'event' && (
              <EventCalendarModule
                entities={analysis.entities}
                detectedTitle={analysis.detected_title}
                summary={analysis.summary}
              />
            )}

            {/* 10. Expense Ledger */}
            {activeTab === 'expense' && (
              <ExpenseModule
                entities={analysis.entities}
                detectedTitle={analysis.detected_title}
              />
            )}

            {/* 11. Contact & Maps */}
            {activeTab === 'contact' && (
              <ContactModule
                entities={analysis.entities}
                detectedTitle={analysis.detected_title}
              />
            )}

            {/* 12. Social Content Creator */}
            {activeTab === 'content' && (
              <ContentModule
                screenshotSummary={analysis.summary}
                ocrText={analysis.ocr_text}
              />
            )}

            {/* 13. Conversational Ask AI */}
            {activeTab === 'ask' && (
              <AskModule
                imageBase64={analysis.imageBase64}
                suggestedQuestions={analysis.suggested_questions}
              />
            )}
          </div>
        </div>
      </div>

      {/* Android Chooser Modal */}
      {selectedIntentForChooser && (
        <AndroidChooserModal
          isOpen={Boolean(selectedIntentForChooser)}
          onClose={() => setSelectedIntentForChooser(null)}
          intentPayload={selectedIntentForChooser}
        />
      )}

      {/* Screenshot Diff Modal */}
      {showDiffModal && (
        <ScreenshotDiffModal
          currentAnalysis={analysis}
          historyItems={history}
          onClose={() => setShowDiffModal(false)}
        />
      )}

      {/* Smart Collections Modal */}
      {showCollectionsModal && (
        <SmartCollectionsModal
          history={history}
          onSelectScreenshot={(item) => {
            if (onSelectHistoryItem) onSelectHistoryItem(item);
          }}
          onClose={() => setShowCollectionsModal(false)}
        />
      )}
    </div>
  );
};
