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
} from 'lucide-react';
import { ScreenshotAnalysis, CareerProfile, DispatchedIntentPayload } from '../types';
import { ActionRouter } from '../services/actionRouter';
import { AndroidChooserModal } from './AndroidChooserModal';
import { AskModule } from './modules/AskModule';
import { PromptModule } from './modules/PromptModule';
import { JobCareerModule } from './modules/JobCareerModule';
import { CommunicationModule } from './modules/CommunicationModule';
import { ContentModule } from './modules/ContentModule';
import { EventCalendarModule } from './modules/EventCalendarModule';
import { ExpenseModule } from './modules/ExpenseModule';
import { ContactModule } from './modules/ContactModule';

interface AnalysisResultViewProps {
  analysis: ScreenshotAnalysis;
  careerProfile: CareerProfile;
  onOpenCareerProfile: () => void;
  onBackToHome: () => void;
  onSaveToMemory: () => void;
  isSavedInMemory: boolean;
}

export const AnalysisResultView: React.FC<AnalysisResultViewProps> = ({
  analysis,
  careerProfile,
  onOpenCareerProfile,
  onBackToHome,
  onSaveToMemory,
  isSavedInMemory,
}) => {
  // Determine default tab based on classified content type
  const getInitialTab = (): string => {
    switch (analysis.content_type) {
      case 'job_vacancy':
        return 'job';
      case 'ui_design':
        return 'prompt';
      case 'chat_message':
        return 'communication';
      case 'event_poster':
        return 'event';
      case 'receipt_invoice':
        return 'expense';
      case 'contact_card':
        return 'contact';
      default:
        return 'actions';
    }
  };

  const [activeTab, setActiveTab] = useState<string>(getInitialTab());
  const [showOcrText, setShowOcrText] = useState(false);
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [selectedIntentForChooser, setSelectedIntentForChooser] = useState<DispatchedIntentPayload | null>(null);

  const routedIntents = ActionRouter.routeActions(analysis);
  const entityCategorization = ActionRouter.categorizeDetectedEntity(analysis);
  const plannedActionPlans = ActionRouter.planRoutedActions(analysis);

  const handleCopySummary = () => {
    navigator.clipboard.writeText(analysis.summary);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  // Human-friendly title and color for category
  const getCategoryMeta = (cat: string) => {
    switch (cat) {
      case 'job_vacancy':
        return { label: 'Job Vacancy', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' };
      case 'ui_design':
        return { label: 'UI / App Design', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' };
      case 'chat_message':
        return { label: 'Chat / Communication', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' };
      case 'event_poster':
        return { label: 'Event & Conference', color: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' };
      case 'receipt_invoice':
        return { label: 'Receipt & Expense', color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' };
      case 'contact_card':
        return { label: 'Contact & Business Card', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' };
      case 'code_error':
        return { label: 'Technical Bug / Code', color: 'bg-rose-500/20 text-rose-400 border-rose-500/30' };
      default:
        return { label: 'Screenshot Analyzed', color: 'bg-slate-700 text-slate-300 border-slate-600' };
    }
  };

  const catMeta = getCategoryMeta(analysis.content_type);

  return (
    <div className="w-full max-w-6xl mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-6">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={onBackToHome}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>New Screenshot</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Save to memory */}
          {!analysis.processedOnceOnly ? (
            <button
              onClick={onSaveToMemory}
              disabled={isSavedInMemory}
              className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl border transition-colors ${
                isSavedInMemory
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>{isSavedInMemory ? 'Saved in Memory' : 'Save to Memory'}</span>
            </button>
          ) : (
            <span className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-400">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>Process Once Only</span>
            </span>
          )}

          {/* Classification Badge */}
          <span
            className={`text-xs px-2.5 py-1 rounded-full border font-semibold ${catMeta.color}`}
          >
            {catMeta.label}
          </span>
        </div>
      </div>

      {/* Sensitive Data Alert (Security Agent) */}
      {analysis.sensitive_data_detected && (
        <div className="p-3.5 rounded-2xl bg-rose-950/40 border border-rose-800/80 flex items-start gap-3 text-rose-200">
          <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-rose-300 uppercase tracking-wide">
              Security Agent Warning: Sensitive PII Detected
            </h4>
            <p className="text-xs text-rose-200/90 leading-relaxed">
              {analysis.sensitive_data_warning ||
                'This screenshot appears to contain private OTP codes, credit cards, or account credentials. SnapAction recommends ephemeral "Process Once — Do Not Save" mode.'}
            </p>
          </div>
        </div>
      )}

      {/* Main Split Layout: Image on Left / Details & Modules on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Screenshot Preview & OCR (5 Cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-xl relative group">
            <img
              src={analysis.imageBase64}
              alt="Uploaded screenshot"
              className="w-full max-h-[500px] object-contain bg-slate-950/80 mx-auto"
            />
            {/* Overlay toggle OCR */}
            <div className="absolute bottom-2 right-2 flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-700/80 text-[11px] text-slate-300">
              <button
                onClick={() => setShowOcrText(!showOcrText)}
                className="flex items-center gap-1 hover:text-white"
              >
                {showOcrText ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{showOcrText ? 'Hide OCR' : 'Show OCR Text'}</span>
              </button>
            </div>
          </div>

          {/* OCR text display */}
          {showOcrText && analysis.ocr_text && (
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1">
              <span className="text-[10px] font-semibold uppercase text-slate-400 font-mono">
                Extracted OCR Raw Text:
              </span>
              <p className="text-slate-300 font-mono text-[11px] leading-relaxed max-h-40 overflow-y-auto whitespace-pre-wrap bg-slate-950 p-2 rounded border border-slate-800">
                {analysis.ocr_text}
              </p>
            </div>
          )}

          {/* Confidence and Intelligence Metrics */}
          <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span className="text-slate-300">Confidence Score:</span>
            </div>
            <span className="font-mono font-bold text-emerald-400">
              {Math.round(analysis.confidence * 100)}%
            </span>
          </div>
        </div>

        {/* Right Column: Intelligence & Action Workflows (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Executive Summary Card */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-md space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                <span>{analysis.detected_title || 'Screenshot Intelligence'}</span>
              </h3>
              <button
                onClick={handleCopySummary}
                className="text-[11px] text-slate-400 hover:text-slate-200 flex items-center gap-1"
              >
                {copiedSummary ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedSummary ? 'Copied' : 'Copy Summary'}</span>
              </button>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-normal">
              {analysis.summary}
            </p>

            {analysis.user_intent && (
              <div className="pt-2 border-t border-slate-800/80 flex items-center gap-2 text-xs">
                <span className="text-[10px] uppercase font-bold text-blue-400 font-mono">
                  Inferred Intent:
                </span>
                <span className="text-slate-300">{analysis.user_intent}</span>
              </div>
            )}
          </div>

          {/* Navigation Action Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin border-b border-slate-800 text-xs">
            <button
              onClick={() => setActiveTab('actions')}
              className={`px-3 py-2 rounded-xl font-semibold transition-all whitespace-nowrap ${
                activeTab === 'actions'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              Recommended Actions
            </button>

            <button
              onClick={() => setActiveTab('ask')}
              className={`px-3 py-2 rounded-xl font-semibold transition-all whitespace-nowrap ${
                activeTab === 'ask'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              Ask AI
            </button>

            <button
              onClick={() => setActiveTab('prompt')}
              className={`px-3 py-2 rounded-xl font-semibold transition-all whitespace-nowrap ${
                activeTab === 'prompt'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              Prompt Engine
            </button>

            <button
              onClick={() => setActiveTab('job')}
              className={`px-3 py-2 rounded-xl font-semibold transition-all whitespace-nowrap ${
                activeTab === 'job'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              Job &amp; CV Match
            </button>

            <button
              onClick={() => setActiveTab('communication')}
              className={`px-3 py-2 rounded-xl font-semibold transition-all whitespace-nowrap ${
                activeTab === 'communication'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              Reply / Chat
            </button>

            <button
              onClick={() => setActiveTab('content')}
              className={`px-3 py-2 rounded-xl font-semibold transition-all whitespace-nowrap ${
                activeTab === 'content'
                  ? 'bg-pink-600 text-white shadow-md shadow-pink-600/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              Create Content
            </button>

            <button
              onClick={() => setActiveTab('event')}
              className={`px-3 py-2 rounded-xl font-semibold transition-all whitespace-nowrap ${
                activeTab === 'event'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              Calendar &amp; Event
            </button>

            <button
              onClick={() => setActiveTab('expense')}
              className={`px-3 py-2 rounded-xl font-semibold transition-all whitespace-nowrap ${
                activeTab === 'expense'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              Receipt &amp; Expense
            </button>

            <button
              onClick={() => setActiveTab('contact')}
              className={`px-3 py-2 rounded-xl font-semibold transition-all whitespace-nowrap ${
                activeTab === 'contact'
                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              Contact
            </button>

            <button
              onClick={() => setActiveTab('app_router')}
              className={`px-3 py-2 rounded-xl font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'app_router'
                  ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-md shadow-indigo-600/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
              <span>App Router ({routedIntents.length})</span>
            </button>
          </div>

          {/* Active Tab Panel Content */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 sm:p-5">
            {activeTab === 'actions' && (
              <div className="space-y-4">
                {/* Universal App Router Highlights */}
                {routedIntents.length > 0 && (
                  <div className="p-3.5 rounded-2xl bg-gradient-to-r from-indigo-950/40 to-slate-900 border border-indigo-500/30 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Smartphone className="w-4 h-4 text-cyan-400" />
                        <h4 className="text-xs font-bold text-slate-100 uppercase tracking-wide">
                          Universal App Connectivity Router
                        </h4>
                      </div>
                      <span className="text-[10px] text-cyan-300 font-mono">
                        Android Chooser Ready
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {routedIntents.map((intent, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between gap-2"
                        >
                          <div>
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-xs text-slate-200">
                                {intent.actionTitle}
                              </span>
                              <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 uppercase font-mono">
                                {intent.category}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                              {intent.actionSubtitle}
                            </p>
                          </div>

                          <div className="flex items-center justify-between pt-1 border-t border-slate-900">
                            <div className="flex -space-x-1.5 overflow-hidden">
                              {intent.compatibleApps.slice(0, 3).map((app) => (
                                <div
                                  key={app.id}
                                  title={app.name}
                                  className="w-5 h-5 rounded-full ring-2 ring-slate-900 flex items-center justify-center text-[8px] font-bold text-white shadow-sm"
                                  style={{ backgroundColor: app.color }}
                                >
                                  {app.name[0]}
                                </div>
                              ))}
                            </div>

                            <button
                              onClick={() => setSelectedIntentForChooser(intent)}
                              className="text-[11px] px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <span>Choose App</span>
                              <Share className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                    AI Inferred Priority Action Items:
                  </h4>
                  <span className="text-[10px] text-slate-500">
                    Click any action to route to specialized agent
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {(analysis.recommended_actions || []).map((action, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        const id = action.id?.toLowerCase() || '';
                        if (id.includes('job') || id.includes('cv') || id.includes('apply')) {
                          setActiveTab('job');
                        } else if (id.includes('prompt') || id.includes('code') || id.includes('ui')) {
                          setActiveTab('prompt');
                        } else if (id.includes('reply') || id.includes('message') || id.includes('email')) {
                          setActiveTab('communication');
                        } else if (id.includes('calendar') || id.includes('event')) {
                          setActiveTab('event');
                        } else if (id.includes('expense') || id.includes('receipt')) {
                          setActiveTab('expense');
                        } else if (id.includes('contact') || id.includes('call')) {
                          setActiveTab('contact');
                        } else if (id.includes('create') || id.includes('post')) {
                          setActiveTab('content');
                        } else {
                          setActiveTab('ask');
                        }
                      }}
                      className="text-left p-3 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-blue-500/50 transition-all flex items-start gap-2.5 group cursor-pointer"
                    >
                      <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 text-xs font-bold">
                        #{action.priority || i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="font-semibold text-xs text-slate-200 group-hover:text-blue-300 transition-colors block">
                          {action.label}
                        </span>
                        {action.description && (
                          <span className="text-[11px] text-slate-400 block mt-0.5 line-clamp-1">
                            {action.description}
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>

                {/* Quick Entities overview */}
                <div className="pt-3 border-t border-slate-800 space-y-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 font-mono">
                    Extracted Structured Entities:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
                    {analysis.entities.company_or_merchant && (
                      <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                        <span className="text-slate-500 block text-[10px]">Entity / Org:</span>
                        <span className="text-slate-200 font-medium truncate block">
                          {analysis.entities.company_or_merchant}
                        </span>
                      </div>
                    )}
                    {analysis.entities.dates_or_deadlines && (
                      <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                        <span className="text-slate-500 block text-[10px]">Date / Deadline:</span>
                        <span className="text-amber-400 font-medium truncate block">
                          {analysis.entities.dates_or_deadlines}
                        </span>
                      </div>
                    )}
                    {analysis.entities.prices_or_salary && (
                      <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                        <span className="text-slate-500 block text-[10px]">Price / Salary:</span>
                        <span className="text-emerald-400 font-medium truncate block">
                          {analysis.entities.prices_or_salary}
                        </span>
                      </div>
                    )}
                    {analysis.entities.emails?.[0] && (
                      <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                        <span className="text-slate-500 block text-[10px]">Email:</span>
                        <span className="text-blue-400 font-medium truncate block">
                          {analysis.entities.emails[0]}
                        </span>
                      </div>
                    )}
                    {analysis.entities.phones?.[0] && (
                      <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                        <span className="text-slate-500 block text-[10px]">Phone:</span>
                        <span className="text-slate-200 font-medium truncate block">
                          {analysis.entities.phones[0]}
                        </span>
                      </div>
                    )}
                    {analysis.entities.location_or_venue && (
                      <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                        <span className="text-slate-500 block text-[10px]">Location:</span>
                        <span className="text-slate-200 font-medium truncate block">
                          {analysis.entities.location_or_venue}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'ask' && (
              <AskModule
                imageBase64={analysis.imageBase64}
                suggestedQuestions={analysis.suggested_questions}
              />
            )}

            {activeTab === 'prompt' && (
              <PromptModule
                imageBase64={analysis.imageBase64}
                defaultContentType={analysis.content_type}
              />
            )}

            {activeTab === 'job' && (
              <JobCareerModule
                analysis={analysis}
                careerProfile={careerProfile}
                onOpenCareerProfile={onOpenCareerProfile}
              />
            )}

            {activeTab === 'communication' && (
              <CommunicationModule
                chatContext={`${analysis.summary}\n${analysis.ocr_text || ''}`}
              />
            )}

            {activeTab === 'content' && (
              <ContentModule
                screenshotSummary={analysis.summary}
                ocrText={analysis.ocr_text}
              />
            )}

            {activeTab === 'event' && (
              <EventCalendarModule
                entities={analysis.entities}
                detectedTitle={analysis.detected_title}
                summary={analysis.summary}
              />
            )}

            {activeTab === 'expense' && (
              <ExpenseModule
                entities={analysis.entities}
                detectedTitle={analysis.detected_title}
              />
            )}

            {activeTab === 'contact' && (
              <ContactModule
                entities={analysis.entities}
                detectedTitle={analysis.detected_title}
              />
            )}

            {activeTab === 'app_router' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-5 h-5 text-cyan-400" />
                    <div>
                      <h4 className="font-bold text-sm text-slate-100">
                        Universal App Connectivity Layer
                      </h4>
                      <p className="text-xs text-slate-400">
                        Intents, Deep Links, and Chooser routing without invasive permissions.
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono">
                    {routedIntents.length} Intent Routes Detected
                  </span>
                </div>

                {/* Logic Layer: Entity Categorization & Target App Mapping */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950/40 border border-indigo-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                      Entity Categorization &amp; Action Provider Mapping
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                      {Math.round(entityCategorization.confidence * 100)}% Confidence
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                      <span className="text-slate-500 block text-[10px]">Detected Entity Type:</span>
                      <span className="font-bold text-cyan-300 text-sm block mt-0.5">
                        {entityCategorization.entityLabel}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono mt-1 block">
                        Identifier: {entityCategorization.entityType}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                      <span className="text-slate-500 block text-[10px]">Suggested Action Providers:</span>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {plannedActionPlans[0]?.primaryTargetApp && (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                            ★ Primary: {plannedActionPlans[0].primaryTargetApp.name}
                          </span>
                        )}
                        {plannedActionPlans[0]?.alternativeTargetApps.map((alt) => (
                          <span
                            key={alt.id}
                            className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700"
                          >
                            {alt.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Android Intent Specification Inspector */}
                  {plannedActionPlans[0] && (
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                        Android Intent Specification (Generated):
                      </span>
                      <div className="text-cyan-300 truncate">
                        <span className="text-slate-500">Action: </span>
                        {plannedActionPlans[0].intentSpec.action}
                      </div>
                      <div className="text-slate-300 truncate">
                        <span className="text-slate-500">Target Package: </span>
                        {plannedActionPlans[0].intentSpec.package || 'None (System Chooser)'}
                      </div>
                      <div className="text-slate-300 truncate">
                        <span className="text-slate-500">Data URI / Scheme: </span>
                        {plannedActionPlans[0].intentSpec.dataUri}
                      </div>
                      <div className="text-emerald-300 truncate">
                        <span className="text-slate-500">Deep Link: </span>
                        {plannedActionPlans[0].intentSpec.deepLinkUri}
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {routedIntents.map((intent, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                        <div>
                          <span className="font-bold text-xs text-slate-100">
                            {intent.actionTitle}
                          </span>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {intent.actionSubtitle}
                          </p>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono uppercase self-start sm:self-auto">
                          Category: {intent.category}
                        </span>
                      </div>

                      {/* Payload preview fields */}
                      <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80 space-y-1 text-xs">
                        {intent.dataPreview.map((f, i) => (
                          <div key={i} className="flex justify-between text-slate-300 py-0.5">
                            <span className="text-slate-500">{f.label}:</span>
                            <span className="font-medium text-slate-200 truncate max-w-[280px]">
                              {f.value}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Compatible apps buttons */}
                      <div className="pt-2 border-t border-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] text-slate-500 uppercase font-semibold">
                            Compatible:
                          </span>
                          {intent.compatibleApps.map((app) => (
                            <span
                              key={app.id}
                              className="text-[10px] px-2 py-0.5 rounded-lg border flex items-center gap-1"
                              style={{
                                borderColor: `${app.color}40`,
                                backgroundColor: `${app.color}15`,
                                color: '#F1F5F9',
                              }}
                            >
                              <span
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: app.color }}
                              />
                              <span>{app.name}</span>
                            </span>
                          ))}
                        </div>

                        <button
                          onClick={() => setSelectedIntentForChooser(intent)}
                          className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/20 transition-all cursor-pointer shrink-0"
                        >
                          <Share className="w-3.5 h-3.5" />
                          <span>Open in Android Chooser</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Android Chooser Modal */}
      <AndroidChooserModal
        isOpen={Boolean(selectedIntentForChooser)}
        onClose={() => setSelectedIntentForChooser(null)}
        intentPayload={selectedIntentForChooser}
      />
    </div>
  );
};
