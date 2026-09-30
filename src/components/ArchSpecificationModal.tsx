import React, { useState } from 'react';
import {
  X,
  FileCode,
  Layers,
  Server,
  Database,
  Shield,
  Smartphone,
  CheckCircle,
  Copy,
  Terminal,
} from 'lucide-react';

interface ArchSpecificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchSpecificationModal: React.FC<ArchSpecificationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeSection, setActiveSection] = useState<'A' | 'B' | 'E' | 'F' | 'G' | 'J' | 'O'>('A');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-sm">
                Master Product &amp; System Architecture (Sections A — O)
              </h3>
              <p className="text-xs text-slate-400">
                Production-grade mobile engineering blueprint &amp; specifications.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex items-center gap-1.5 p-3 bg-slate-950 border-b border-slate-800 overflow-x-auto text-xs">
          {[
            { id: 'A', label: 'A. Product Vision & Architecture' },
            { id: 'B', label: 'B. System Diagram & Flow' },
            { id: 'E', label: 'E. Backend Services' },
            { id: 'F', label: 'F. PostgreSQL Tables' },
            { id: 'G', label: 'G. AI Agent Hierarchy' },
            { id: 'J', label: 'J. Android & Play Store' },
            { id: 'O', label: 'O. MVP Acceptance' },
          ].map((sec) => (
            <button
              key={sec.id}
              onClick={() => setActiveSection(sec.id as any)}
              className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-colors ${
                activeSection === sec.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
              }`}
            >
              {sec.label}
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs text-slate-300 leading-relaxed font-sans">
          {activeSection === 'A' && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-slate-100">
                A. Product Architecture: Universal AI Action Layer
              </h4>
              <p>
                SnapAction AI converts any passive mobile screenshot into immediate real-world actions. Instead of acting as dumb storage or purely conversational text, it functions as an autonomous multimodal action engine.
              </p>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="font-bold text-cyan-300 block">Core Philosophy:</span>
                <p>• Screenshot is the universal raw input</p>
                <p>• Multimodal Vision is the comprehension layer</p>
                <p>• Contextual Extraction &amp; Intent Routing is the intelligence</p>
                <p>• Human-In-The-Loop Execution (Job apply, prompt code, email, calendar) is the product</p>
              </div>
            </div>
          )}

          {activeSection === 'B' && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-slate-100">
                B. System Architecture Diagram
              </h4>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-cyan-300 whitespace-pre leading-relaxed overflow-x-auto">
{`[Android 15 User / Share Sheet] ─── ACTION_SEND ───► [SnapAction Mobile Client]
                                                              │
                                                        Image Base64
                                                              ▼
                                                   [TLS Authenticated API]
                                                   /api/v1/screenshots/analyze
                                                              │
                    ┌─────────────────────────────────────────┴─────────────────────────────────────────┐
                    ▼                                                                                   ▼
         [Security Agent: PII/OTP Scan]                                                      [Vision Agent: Gemini 2.5]
                    │                                                                                   │
                    └─────────────────────────────┬─────────────────────────────────────────────────────┘
                                                  ▼
                                     [Content Classification]
                                                  │
                 ┌───────────────┬────────────────┼───────────────┬────────────────┐
                 ▼               ▼                ▼               ▼                ▼
           [Job Vacancy]   [UI / Dashboard]  [Chat Message] [Event Poster]  [Store Receipt]
                 │               │                │               │                │
          [Career Match]  [Prompt Engine]   [Tone Drafter]  [Google Cal]      [CSV Export]
          - Match %       - Cursor/Claude   - Pro/Friendly  - .ICS file       - Line items
          - Tailored CV   - Flutter Code    - Email draft   - Google Maps     - Merchant/Tax
          - Cover Letter  - Design spec
                 │
                 ▼
     [Human-In-The-Loop Review]
                 │
                 ▼
   [Execute Intent / Native Client]`}
              </div>
            </div>
          )}

          {activeSection === 'E' && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-slate-100">
                E. Backend Services Architecture
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="font-bold text-cyan-300 block mb-1">1. Ingestion &amp; Vision</span>
                  <p>Handles base64 compression, MIME resolution, and Gemini 2.5 Flash multimodal inspection.</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="font-bold text-cyan-300 block mb-1">2. Career &amp; Job Matcher</span>
                  <p>Extracts 15+ job vacancy fields, performs vector &amp; heuristic skill gap analysis against user CV profile.</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="font-bold text-cyan-300 block mb-1">3. Prompt Deconstruction</span>
                  <p>Deconstructs layout hierarchy, typography, colors, and creates ready-to-run prompts for coding agents.</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="font-bold text-cyan-300 block mb-1">4. Storage &amp; Memory</span>
                  <p>Indexed memory storage with natural language semantic search and full user-directed purge control.</p>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'F' && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-slate-100">
                F. Database Tables Schema (PostgreSQL / Supabase)
              </h4>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-300 space-y-1 overflow-x-auto">
                <p className="text-cyan-400 font-bold">// 1. users &amp; profiles</p>
                <p>users (id UUID PRIMARY KEY, email TEXT UNIQUE, created_at TIMESTAMPTZ);</p>
                <p>career_profiles (id UUID, user_id UUID REFERENCES users, full_name TEXT, title TEXT, skills TEXT[], cv_url TEXT);</p>
                <p className="text-cyan-400 font-bold pt-2">// 2. screenshots &amp; analysis</p>
                <p>screenshots (id UUID, user_id UUID, storage_path TEXT, is_ephemeral BOOLEAN, created_at TIMESTAMPTZ);</p>
                <p>screenshot_analysis (id UUID, screenshot_id UUID, content_type TEXT, confidence NUMERIC, summary TEXT, entities JSONB);</p>
                <p className="text-cyan-400 font-bold pt-2">// 3. jobs &amp; applications</p>
                <p>job_vacancies (id UUID, title TEXT, company TEXT, location TEXT, salary TEXT, deadline TIMESTAMPTZ, email TEXT);</p>
                <p>job_applications (id UUID, job_id UUID, match_score NUMERIC, tailored_cv TEXT, cover_letter TEXT, sent_at TIMESTAMPTZ);</p>
                <p className="text-cyan-400 font-bold pt-2">// 4. billing &amp; usage</p>
                <p>subscriptions (id UUID, user_id UUID, tier TEXT, play_billing_token TEXT, quota_limit INT, current_used INT);</p>
              </div>
            </div>
          )}

          {activeSection === 'G' && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-slate-100">
                G. Autonomous AI Agent Hierarchy
              </h4>
              <ul className="space-y-2">
                <li className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="font-bold text-blue-400">1. Vision Agent:</span> Performs OCR, visual feature mapping, typography analysis, and bounding-box reasoning.
                </li>
                <li className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="font-bold text-rose-400">2. Security Agent:</span> Scans screenshot for credit cards, passwords, and OTP verification codes; flags warnings and prompts ephemeral storage.
                </li>
                <li className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="font-bold text-emerald-400">3. Career Agent:</span> Compares extracted requirements with user CV, produces match score, drafts tailored bullet points and human-reviewed application emails.
                </li>
                <li className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="font-bold text-purple-400">4. Prompt Agent:</span> Deconstructs UI into high-precision technical prompts for Cursor, Claude, Replit, and Gemini.
                </li>
                <li className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="font-bold text-amber-400">5. Communication Agent:</span> Generates multi-tone replies (Professional, Friendly, Firm, Concise) with instant intent launch.
                </li>
              </ul>
            </div>
          )}

          {activeSection === 'J' && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-slate-100">
                J. Android &amp; Google Play Store Requirements
              </h4>
              <div className="space-y-2">
                <p>• <span className="font-semibold text-slate-200">ACTION_SEND Intent Filter:</span> Registered in AndroidManifest.xml for <code className="text-cyan-300 font-mono">image/*</code> MIME types with cold/warm start support.</p>
                <p>• <span className="font-semibold text-slate-200">Permission Minimization:</span> Zero call log, SMS, or background location access. Uses system intents (Intent.ACTION_DIAL, Intent.ACTION_SENDTO, Intent.ACTION_VIEW).</p>
                <p>• <span className="font-semibold text-slate-200">Play Billing 7.0+:</span> Real subscription product IDs with recurring monthly quotas and entitlement verification.</p>
                <p>• <span className="font-semibold text-slate-200">Google Play Data Safety:</span> Complete transparency on data collected, transit encryption (TLS 1.3), ephemeral processing, and full user account deletion capability.</p>
              </div>
            </div>
          )}

          {activeSection === 'O' && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-slate-100">
                O. Complete MVP Acceptance Criteria Checklist
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  '1. Ingest screenshot via Share Sheet, Upload, Camera, or Clipboard',
                  '2. Real-time Gemini 2.5 Flash server-side AI Vision analysis',
                  '3. Sensitive data scan & ephemeral privacy toggle',
                  '4. Screenshot -> Ask conversational multimodal Q&A',
                  '5. Screenshot -> Prompt generator for Claude / Cursor / Gemini',
                  '6. Screenshot -> Job Vacancy detection & extraction',
                  '7. Career Profile & CV match score with skill gap breakdown',
                  '8. Tailored CV bullets & Cover Letter generation',
                  '9. Strict Human-In-The-Loop email review before sending',
                  '10. Multi-tone communication reply generator',
                  '11. Event extraction with Google Calendar & .ICS download',
                  '12. Itemized receipt extraction with CSV export',
                  '13. Contact vCard (.vcf) exporter & intent dialer',
                  '14. Searchable Screenshot Memory with natural language filters',
                  '15. Google Play Billing tier architecture & Quota tracker',
                  '16. Complete account & history deletion compliance',
                ].map((item, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-slate-200">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold"
          >
            Close Blueprint
          </button>
        </div>
      </div>
    </div>
  );
};
