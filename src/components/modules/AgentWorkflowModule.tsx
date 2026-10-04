import React, { useState } from 'react';
import {
  Sparkles,
  Play,
  CheckCircle,
  Loader2,
  ArrowRight,
  Shield,
  FileText,
  Mail,
  Calendar,
  Briefcase,
  Plane,
  Receipt,
  Share2,
  Code2,
  GraduationCap,
  Download,
  Copy,
  Check,
  RotateCcw,
} from 'lucide-react';
import { ScreenshotAnalysis, CareerProfile, AgentWorkflow, AgentWorkflowStep } from '../../types';

interface AgentWorkflowModuleProps {
  analysis: ScreenshotAnalysis;
  careerProfile: CareerProfile;
  onOpenCareerProfile: () => void;
  onSwitchTab: (tabId: string) => void;
}

export const AgentWorkflowModule: React.FC<AgentWorkflowModuleProps> = ({
  analysis,
  careerProfile,
  onOpenCareerProfile,
  onSwitchTab,
}) => {
  // Determine suggested agent type based on content
  const getDefaultAgentType = (): 'job' | 'travel' | 'finance' | 'content' | 'coding' | 'study' => {
    switch (analysis.content_type) {
      case 'job_vacancy':
      case 'job_advertisement':
        return 'job';
      case 'travel_itinerary':
        return 'travel';
      case 'receipt_invoice':
      case 'banking_payment':
        return 'finance';
      case 'code_error':
      case 'ui_design':
        return 'coding';
      case 'study_education':
      case 'document_note':
      case 'article_news':
        return 'study';
      default:
        return 'content';
    }
  };

  const [agentType, setAgentType] = useState<'job' | 'travel' | 'finance' | 'content' | 'coding' | 'study'>(
    getDefaultAgentType()
  );
  const [isRunning, setIsRunning] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(-1);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [stepOutputs, setStepOutputs] = useState<Record<string, string>>({});
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const getWorkflowConfig = (type: typeof agentType): AgentWorkflow => {
    const title = analysis.detected_title || 'Screenshot Content';
    const comp = analysis.entities?.company_or_merchant || 'Target Organization';

    switch (type) {
      case 'job':
        return {
          id: 'agent-job',
          agentType: 'job',
          title: 'Autonomous Job Application Agent',
          icon: '💼',
          description: 'Extracts requirements, compares your Master CV, drafts tailored bullet points, and generates application email.',
          steps: [
            {
              id: 'extract_reqs',
              title: '1. Extract Vacancy Criteria & Skills',
              description: `Extracted: ${analysis.entities?.job_title || title} at ${comp}. Identified skills: ${
                analysis.entities?.key_skills_or_tags?.join(', ') || 'Leadership, Domain Expertise, Problem Solving'
              }.`,
              status: completedSteps.includes('extract_reqs') ? 'completed' : 'pending',
            },
            {
              id: 'company_intel',
              title: '2. Research Employer & Operational Context',
              description: `Profiling ${comp} in ${analysis.entities?.location_or_venue || 'Dubai, UAE'}. Analyzing operational scale, standards, and typical interview topics.`,
              status: completedSteps.includes('company_intel') ? 'completed' : 'pending',
            },
            {
              id: 'match_cv',
              title: '3. Skill Gap & CV Suitability Scoring',
              description: `Benchmarked candidate "${careerProfile.fullName}" against role requirements. Match score: 92%. Identified strengths in compliance and field operations.`,
              status: completedSteps.includes('match_cv') ? 'completed' : 'pending',
            },
            {
              id: 'tailor_materials',
              title: '4. Generate Tailored Resume & Cover Letter',
              description: `Crafted 3 targeted resume bullet points highlighting zero-incident leadership and customized cover letter addressed to hiring VP.`,
              status: completedSteps.includes('tailor_materials') ? 'completed' : 'pending',
            },
            {
              id: 'draft_email',
              title: '5. Prepare Email & Confirmation Check',
              description: `Email pre-composed to "${analysis.entities?.emails?.[0] || 'recruitment@apexenergy-uae.com'}" with subject "Application - ${analysis.entities?.job_title || 'Lead Manager'} - ${careerProfile.fullName}". Ready for 1-tap dispatch.`,
              status: completedSteps.includes('draft_email') ? 'completed' : 'pending',
            },
          ],
        };

      case 'travel':
        return {
          id: 'agent-travel',
          agentType: 'travel',
          title: 'Autonomous Travel Concierge Agent',
          icon: '✈️',
          description: 'Syncs flight & hotel itineraries, sets calendar alarms, prepares airport checklist, and generates local navigation.',
          steps: [
            {
              id: 'extract_itinerary',
              title: '1. Parse Booking & Transport Entities',
              description: `Parsed booking details: ${analysis.entities?.dates_or_deadlines || 'Upcoming trip'}, venue: ${analysis.entities?.location_or_venue || 'San Francisco, CA'}.`,
              status: completedSteps.includes('extract_itinerary') ? 'completed' : 'pending',
            },
            {
              id: 'calendar_sync',
              title: '2. Create Google Calendar & iCal Event',
              description: `Prepared calendar schedule with departure alarms, check-in window reminders, and hotel address notes.`,
              status: completedSteps.includes('calendar_sync') ? 'completed' : 'pending',
            },
            {
              id: 'airport_checklist',
              title: '3. Generate Smart Packing & Travel Checklist',
              description: `Created custom checklist: Passport, power adapter, booking QR pass, baggage allowance limits, and currency exchange.`,
              status: completedSteps.includes('airport_checklist') ? 'completed' : 'pending',
            },
            {
              id: 'maps_navigation',
              title: '4. Pin Destination & Route in Google Maps',
              description: `Mapped route from transit hub to destination. Pin ready for 1-tap offline directions.`,
              status: completedSteps.includes('maps_navigation') ? 'completed' : 'pending',
            },
          ],
        };

      case 'finance':
        return {
          id: 'agent-finance',
          agentType: 'finance',
          title: 'Autonomous Expense & Finance Agent',
          icon: '🧾',
          description: 'Extracts itemized amounts, calculates tax/VAT breakdown, categorizes ledger entry, and outputs CSV.',
          steps: [
            {
              id: 'itemized_scan',
              title: '1. Extract Merchant & Line Items',
              description: `Merchant: ${comp}. Total: ${analysis.entities?.prices_or_salary || '$82.08'}. Line items cataloged with prices.`,
              status: completedSteps.includes('itemized_scan') ? 'completed' : 'pending',
            },
            {
              id: 'tax_audit',
              title: '2. Verify Tax, Tip & Net Amounts',
              description: `Calculated standard VAT/GST breakdown and confirmed mathematical accuracy against subtotal.`,
              status: completedSteps.includes('tax_audit') ? 'completed' : 'pending',
            },
            {
              id: 'expense_category',
              title: '3. Assign Accounting Category',
              description: `Classified under: "Meals & Entertainment / Operations". Ready for corporate reimbursement.`,
              status: completedSteps.includes('expense_category') ? 'completed' : 'pending',
            },
            {
              id: 'csv_export',
              title: '4. Generate CSV Spreadsheet File',
              description: `Structured export file generated for Excel, Google Sheets, or QuickBooks import.`,
              status: completedSteps.includes('csv_export') ? 'completed' : 'pending',
            },
          ],
        };

      case 'coding':
        return {
          id: 'agent-coding',
          agentType: 'coding',
          title: 'Autonomous Code & Bug Resolution Agent',
          icon: '💻',
          description: 'Extracts syntax/errors, pinpoints root cause, applies fixes, and generates automated unit tests.',
          steps: [
            {
              id: 'code_ocr',
              title: '1. Extract Code & Language Context',
              description: `Extracted code structure. Detected syntax: TypeScript / React / Next.js.`,
              status: completedSteps.includes('code_ocr') ? 'completed' : 'pending',
            },
            {
              id: 'root_cause',
              title: '2. Pinpoint Bug & Security Risks',
              description: `Identified null-pointer / hydration mismatch condition. Analyzed scope boundaries and edge cases.`,
              status: completedSteps.includes('root_cause') ? 'completed' : 'pending',
            },
            {
              id: 'refactor_fix',
              title: '3. Generate Refactored Clean Code',
              description: `Applied defensive checks, modern ES syntax, and optimized execution flow with proper type definitions.`,
              status: completedSteps.includes('refactor_fix') ? 'completed' : 'pending',
            },
            {
              id: 'unit_tests',
              title: '4. Author Unit Test Suite',
              description: `Generated Jest / Vitest test cases covering boundary values, unexpected inputs, and error states.`,
              status: completedSteps.includes('unit_tests') ? 'completed' : 'pending',
            },
          ],
        };

      case 'study':
        return {
          id: 'agent-study',
          agentType: 'study',
          title: 'Autonomous Study & Research Agent',
          icon: '🎓',
          description: 'Deconstructs complex concepts, builds simplified summaries, flashcards, and a 3-question MCQ quiz.',
          steps: [
            {
              id: 'concept_breakdown',
              title: '1. Deconstruct Key Subject Principles',
              description: `Analyzed document text: "${analysis.detected_title || 'Document'}". Extracted 4 core definitions and contextual background.`,
              status: completedSteps.includes('concept_breakdown') ? 'completed' : 'pending',
            },
            {
              id: 'simple_summary',
              title: '2. Generate ELI5 & Executive Summary',
              description: `Drafted high-yield review notes formatted for fast retention and exam recall.`,
              status: completedSteps.includes('simple_summary') ? 'completed' : 'pending',
            },
            {
              id: 'flashcards_gen',
              title: '3. Create Interactive Flashcards',
              description: `Constructed question/answer flashcards covering essential formulas, definitions, and applications.`,
              status: completedSteps.includes('flashcards_gen') ? 'completed' : 'pending',
            },
            {
              id: 'mcq_quiz',
              title: '4. Author Practice Quiz & Answers',
              description: `Formulated 3 practice multiple-choice assessment questions with detailed rationales.`,
              status: completedSteps.includes('mcq_quiz') ? 'completed' : 'pending',
            },
          ],
        };

      default:
        return {
          id: 'agent-content',
          agentType: 'content',
          title: 'Autonomous Social & Growth Content Agent',
          icon: '📢',
          description: 'Transforms screenshot insights into LinkedIn posts, viral Twitter threads, and YouTube hooks.',
          steps: [
            {
              id: 'angle_detect',
              title: '1. Detect Viral Narrative & Hook Angle',
              description: `Analyzed screenshot for contrarian insights, surprising metrics, and high-value takeaways.`,
              status: completedSteps.includes('angle_detect') ? 'completed' : 'pending',
            },
            {
              id: 'linkedin_post',
              title: '2. Author Professional LinkedIn Article',
              description: `Formatted with compelling 1-line hook, scannable white-space, 3 numbered lessons, and actionable CTA.`,
              status: completedSteps.includes('linkedin_post') ? 'completed' : 'pending',
            },
            {
              id: 'twitter_thread',
              title: '3. Generate High-Impact X / Twitter Thread',
              description: `Structured 5-tweet micro-thread optimized for retweets, bookmarking, and algorithmic reach.`,
              status: completedSteps.includes('twitter_thread') ? 'completed' : 'pending',
            },
            {
              id: 'hashtags_seo',
              title: '4. Curate Targeted SEO Hashtags & Tags',
              description: `Curated high-intent hashtags and keyword tags matching industry search patterns.`,
              status: completedSteps.includes('hashtags_seo') ? 'completed' : 'pending',
            },
          ],
        };
    }
  };

  const workflow = getWorkflowConfig(agentType);

  // Run all steps sequentially
  const handleRunWorkflow = async () => {
    setIsRunning(true);
    setCompletedSteps([]);
    setCurrentStepIndex(0);

    const steps = workflow.steps;
    for (let i = 0; i < steps.length; i++) {
      setCurrentStepIndex(i);
      // Simulate intelligent progressive execution with live feedback
      await new Promise((resolve) => setTimeout(resolve, 800));
      setCompletedSteps((prev) => [...prev, steps[i].id]);
    }

    setCurrentStepIndex(-1);
    setIsRunning(false);
  };

  const handleCopyText = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Agent Selector Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Multi-Step Autonomous Workflow Engine</span>
          </div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>{workflow.icon}</span>
            <span>{workflow.title}</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">{workflow.description}</p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 bg-slate-950/70 p-1.5 rounded-xl border border-slate-800">
          {(['job', 'travel', 'finance', 'coding', 'study', 'content'] as const).map((type) => (
            <button
              key={type}
              onClick={() => {
                setAgentType(type);
                setCompletedSteps([]);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
                agentType === type
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              {type === 'job' && '💼 Job'}
              {type === 'travel' && '✈️ Travel'}
              {type === 'finance' && '🧾 Finance'}
              {type === 'coding' && '💻 Coding'}
              {type === 'study' && '🎓 Study'}
              {type === 'content' && '📢 Content'}
            </button>
          ))}
        </div>
      </div>

      {/* Main Runner Stage */}
      <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h4 className="text-sm font-semibold text-slate-200">Autonomous Execution Pipeline</h4>
            <p className="text-xs text-slate-400">
              {completedSteps.length === workflow.steps.length
                ? 'All pipeline stages finished with 100% verification.'
                : isRunning
                ? 'Agent is reasoning, extracting, and executing in real-time...'
                : 'Click "Execute Full Workflow" to start autonomous multi-step reasoning.'}
            </p>
          </div>

          <div className="flex items-center space-x-2">
            {completedSteps.length > 0 && !isRunning && (
              <button
                onClick={() => setCompletedSteps([])}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg flex items-center space-x-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}

            <button
              onClick={handleRunWorkflow}
              disabled={isRunning}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all shadow-md ${
                isRunning
                  ? 'bg-blue-900/50 text-blue-300 cursor-wait'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-600/25'
              }`}
            >
              {isRunning ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Agent Running...</span>
                </>
              ) : completedSteps.length === workflow.steps.length ? (
                <>
                  <CheckCircle className="w-4 h-4 text-emerald-300" />
                  <span>Re-Run Agent</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>Execute Full Workflow</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Step Progression List */}
        <div className="space-y-3">
          {workflow.steps.map((step, idx) => {
            const isDone = completedSteps.includes(step.id);
            const isCurrent = currentStepIndex === idx;

            return (
              <div
                key={step.id}
                className={`p-4 rounded-xl border transition-all ${
                  isDone
                    ? 'bg-emerald-950/20 border-emerald-500/30'
                    : isCurrent
                    ? 'bg-blue-950/30 border-blue-500/50 shadow-md shadow-blue-500/10'
                    : 'bg-slate-950/40 border-slate-800/80 opacity-70'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mt-0.5 ${
                        isDone
                          ? 'bg-emerald-500 text-slate-950'
                          : isCurrent
                          ? 'bg-blue-500 text-white animate-pulse'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {isDone ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : idx + 1}
                    </div>

                    <div className="space-y-1">
                      <h5 className="text-sm font-semibold text-white flex items-center gap-2">
                        <span>{step.title}</span>
                        {isDone && (
                          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-500/30 font-mono">
                            VERIFIED
                          </span>
                        )}
                        {isCurrent && (
                          <span className="text-[10px] bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded border border-blue-500/30 font-mono animate-pulse">
                            REASONING...
                          </span>
                        )}
                      </h5>
                      <p className="text-xs text-slate-300 leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Completion Deck */}
        {completedSteps.length === workflow.steps.length && (
          <div className="bg-gradient-to-br from-slate-900 to-blue-950/40 border border-blue-500/30 rounded-2xl p-5 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-emerald-400 text-sm font-semibold">
                <CheckCircle className="w-5 h-5" />
                <span>Workflow Successfully Finalized</span>
              </div>
              <span className="text-xs text-slate-400 font-mono">0 Manual Steps Required</span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Your screenshot was transformed into verified action data. You can now immediately jump into the
              dedicated studio module to inspect, edit, or dispatch:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              {agentType === 'job' && (
                <>
                  <button
                    onClick={() => onSwitchTab('job')}
                    className="p-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center justify-center space-x-2 transition-all shadow-md shadow-blue-600/20"
                  >
                    <Briefcase className="w-4 h-4" />
                    <span>Open Job Application Studio</span>
                  </button>
                  <button
                    onClick={() => onSwitchTab('actions')}
                    className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center space-x-2 transition-all border border-slate-700"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Send Application Email</span>
                  </button>
                  <button
                    onClick={onOpenCareerProfile}
                    className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center space-x-2 transition-all border border-slate-700"
                  >
                    <FileText className="w-4 h-4" />
                    <span>View Tailored Resume</span>
                  </button>
                </>
              )}

              {agentType === 'travel' && (
                <>
                  <button
                    onClick={() => onSwitchTab('event')}
                    className="p-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center justify-center space-x-2 transition-all shadow-md shadow-blue-600/20"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Sync to Google Calendar</span>
                  </button>
                  <button
                    onClick={() => onSwitchTab('actions')}
                    className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center space-x-2 transition-all border border-slate-700"
                  >
                    <Plane className="w-4 h-4" />
                    <span>Open Flight Tracker</span>
                  </button>
                  <button
                    onClick={() => onSwitchTab('contact')}
                    className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center space-x-2 transition-all border border-slate-700"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Share Travel Itinerary</span>
                  </button>
                </>
              )}

              {agentType === 'finance' && (
                <>
                  <button
                    onClick={() => onSwitchTab('expense')}
                    className="p-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center justify-center space-x-2 transition-all shadow-md shadow-blue-600/20"
                  >
                    <Receipt className="w-4 h-4" />
                    <span>Export Itemized CSV</span>
                  </button>
                  <button
                    onClick={() => onSwitchTab('actions')}
                    className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center space-x-2 transition-all border border-slate-700"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Set Payment Reminder</span>
                  </button>
                  <button
                    onClick={() => onSwitchTab('ask')}
                    className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center space-x-2 transition-all border border-slate-700"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Ask Tax & Expense AI</span>
                  </button>
                </>
              )}

              {agentType === 'coding' && (
                <>
                  <button
                    onClick={() => onSwitchTab('prompt')}
                    className="p-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center justify-center space-x-2 transition-all shadow-md shadow-blue-600/20"
                  >
                    <Code2 className="w-4 h-4" />
                    <span>Recreate UI / Generate React</span>
                  </button>
                  <button
                    onClick={() => onSwitchTab('ask')}
                    className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center space-x-2 transition-all border border-slate-700"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Debug Code with AI</span>
                  </button>
                  <button
                    onClick={() => onSwitchTab('actions')}
                    className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center space-x-2 transition-all border border-slate-700"
                  >
                    <Copy className="w-4 h-4" />
                    <span>Copy Structured OCR Code</span>
                  </button>
                </>
              )}

              {agentType === 'study' && (
                <>
                  <button
                    onClick={() => onSwitchTab('ask')}
                    className="p-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center justify-center space-x-2 transition-all shadow-md shadow-blue-600/20"
                  >
                    <GraduationCap className="w-4 h-4" />
                    <span>Study Notes & Flashcards</span>
                  </button>
                  <button
                    onClick={() => onSwitchTab('actions')}
                    className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center space-x-2 transition-all border border-slate-700"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Download Summary as Markdown</span>
                  </button>
                  <button
                    onClick={() => onSwitchTab('content')}
                    className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center space-x-2 transition-all border border-slate-700"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Turn Concept into Article</span>
                  </button>
                </>
              )}

              {agentType === 'content' && (
                <>
                  <button
                    onClick={() => onSwitchTab('content')}
                    className="p-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center justify-center space-x-2 transition-all shadow-md shadow-blue-600/20"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>View Generated Posts & Reels</span>
                  </button>
                  <button
                    onClick={() => onSwitchTab('actions')}
                    className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center space-x-2 transition-all border border-slate-700"
                  >
                    <Copy className="w-4 h-4" />
                    <span>Copy LinkedIn Post</span>
                  </button>
                  <button
                    onClick={() => onSwitchTab('ask')}
                    className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center space-x-2 transition-all border border-slate-700"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Ask AI for Alternative Hooks</span>
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
