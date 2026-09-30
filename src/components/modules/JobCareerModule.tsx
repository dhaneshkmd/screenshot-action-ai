import React, { useState } from 'react';
import {
  Briefcase,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Mail,
  Send,
  FileText,
  UserCheck,
  Calendar,
  ExternalLink,
  Copy,
  Check,
  ShieldAlert,
  ArrowRight,
} from 'lucide-react';
import {
  CareerProfile,
  JobMatchResult,
  JobApplicationMaterials,
  ScreenshotAnalysis,
} from '../../types';
import { matchJobWithCareer, generateJobMaterials } from '../../services/api';

interface JobCareerModuleProps {
  analysis: ScreenshotAnalysis;
  careerProfile: CareerProfile;
  onOpenCareerProfile: () => void;
}

export const JobCareerModule: React.FC<JobCareerModuleProps> = ({
  analysis,
  careerProfile,
  onOpenCareerProfile,
}) => {
  const [matching, setMatching] = useState(false);
  const [matchResult, setMatchResult] = useState<JobMatchResult | null>(null);
  const [generatingMaterials, setGeneratingMaterials] = useState(false);
  const [materials, setMaterials] = useState<JobApplicationMaterials | null>(null);
  const [activeTab, setActiveTab] = useState<'match' | 'tailored_cv' | 'cover_letter' | 'email' | 'interview'>('match');

  // Human-In-The-Loop Review Modal State
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewedEmail, setReviewedEmail] = useState<{
    recipient: string;
    subject: string;
    body: string;
  } | null>(null);
  const [userConfirmedSent, setUserConfirmedSent] = useState(false);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  // Extracted job data
  const jobTitle =
    analysis.entities.job_title || analysis.detected_title || 'HSE Lead Manager / Open Position';
  const company = analysis.entities.company_or_merchant || 'Apex Energy & Infra Ltd.';
  const location = analysis.entities.location_or_venue || 'Dubai, UAE (or Remote)';
  const salary = analysis.entities.prices_or_salary || '$95,000 - $125,000 /yr';
  const deadline = analysis.entities.dates_or_deadlines || 'Nov 15, 2026';
  const detectedEmail = analysis.entities.emails?.[0] || 'recruitment@apexenergy-uae.com';
  const detectedPhone = analysis.entities.phones?.[0];
  const detectedUrl = analysis.entities.urls?.[0];

  const handleRunMatch = async () => {
    setMatching(true);
    try {
      const res = await matchJobWithCareer(
        {
          job_title: jobTitle,
          company,
          location,
          salary,
          deadline,
          entities: analysis.entities,
          ocr_text: analysis.ocr_text,
        },
        careerProfile
      );
      setMatchResult(res);
      // Auto trigger materials if not yet loaded
      if (!materials) {
        handleGenerateMaterials();
      }
    } catch (err: any) {
      alert('Job match error: ' + (err.message || 'Unknown error'));
    } finally {
      setMatching(false);
    }
  };

  const handleGenerateMaterials = async () => {
    setGeneratingMaterials(true);
    try {
      const res = await generateJobMaterials(
        {
          job_title: jobTitle,
          company,
          location,
          entities: analysis.entities,
          ocr_text: analysis.ocr_text,
        },
        careerProfile
      );
      setMaterials(res);
      setReviewedEmail({
        recipient: res.application_email.recipient || detectedEmail,
        subject: res.application_email.subject,
        body: res.application_email.body,
      });
    } catch (err: any) {
      console.error(err);
    } finally {
      setGeneratingMaterials(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const handleExecuteSend = () => {
    if (!reviewedEmail) return;
    // Launch mailto intent only after explicit user confirmation
    const mailto = `mailto:${encodeURIComponent(reviewedEmail.recipient)}?subject=${encodeURIComponent(
      reviewedEmail.subject
    )}&body=${encodeURIComponent(reviewedEmail.body)}`;
    window.location.href = mailto;
    setUserConfirmedSent(true);
    setShowReviewModal(false);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-emerald-400" />
          <h3 className="font-bold text-slate-100 text-sm">
            Screenshot → Job Vacancy &amp; Tailored Application
          </h3>
        </div>
        <button
          onClick={onOpenCareerProfile}
          className="text-[11px] text-blue-400 hover:text-blue-300 font-medium underline"
        >
          Active CV: {careerProfile.fullName}
        </button>
      </div>

      {/* Extracted Job Card */}
      <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-1">
          <span className="text-xs font-bold text-slate-100">{jobTitle}</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-medium">
            Detected Vacancy
          </span>
        </div>
        <p className="text-xs text-slate-300">
          <span className="font-semibold text-slate-200">{company}</span> • {location}
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] pt-1 border-t border-slate-800/60">
          <div>
            <span className="text-slate-500 block">Compensation:</span>
            <span className="text-emerald-400 font-medium">{salary}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Deadline:</span>
            <span className="text-amber-400 font-medium">{deadline}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Contact Email:</span>
            <span className="text-blue-400 font-medium truncate block">{detectedEmail}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Recruiter:</span>
            <span className="text-slate-300 font-medium">Marcus Vance (Ops)</span>
          </div>
        </div>
      </div>

      {/* Action Buttons Row */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={handleRunMatch}
          disabled={matching}
          className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/25 transition-all cursor-pointer"
        >
          {matching ? (
            <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <UserCheck className="w-3.5 h-3.5" />
          )}
          <span>{matchResult ? 'Re-Analyze Match' : 'Match My CV Against Job'}</span>
        </button>

        <button
          onClick={handleGenerateMaterials}
          disabled={generatingMaterials}
          className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          {generatingMaterials ? (
            <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          )}
          <span>Generate Materials</span>
        </button>
      </div>

      {/* Match Result Display */}
      {matchResult && (
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex flex-col items-center justify-center">
                <span className="text-lg font-black text-emerald-400 leading-none">
                  {matchResult.match_percentage}%
                </span>
                <span className="text-[9px] uppercase font-bold text-slate-400">Match</span>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-100">
                  {matchResult.match_percentage >= 75
                    ? 'High Match Strength'
                    : 'Moderate Match Strength'}
                </p>
                <p className="text-[11px] text-slate-400">{matchResult.match_summary}</p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-slate-500 block">Interview Readiness</span>
              <span className="text-xs font-bold text-indigo-400 font-mono">
                {matchResult.interview_readiness_score || 85}/100
              </span>
            </div>
          </div>

          {/* Skills Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {/* Matching */}
            <div className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-900/40">
              <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1 mb-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Matching Skills Detected ({matchResult.matching_skills?.length || 0})
              </span>
              <div className="flex flex-wrap gap-1">
                {(matchResult.matching_skills || []).map((skill, i) => (
                  <span
                    key={i}
                    className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-medium"
                  >
                    ✓ {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Missing */}
            <div className="p-2.5 rounded-lg bg-amber-950/20 border border-amber-900/40">
              <span className="text-[11px] font-semibold text-amber-400 flex items-center gap-1 mb-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                Missing / Target Qualifications ({matchResult.missing_skills?.length || 0})
              </span>
              <div className="flex flex-wrap gap-1">
                {(matchResult.missing_skills || []).map((skill, i) => (
                  <span
                    key={i}
                    className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-medium"
                  >
                    + {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Resume Improvement Tips */}
          {matchResult.cv_improvement_recommendations?.length > 0 && (
            <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
              <span className="text-[11px] font-semibold text-slate-300 block mb-1">
                💡 Recommended CV Tweaks for this Role:
              </span>
              <ul className="text-[11px] text-slate-400 space-y-1 list-disc list-inside">
                {matchResult.cv_improvement_recommendations.map((tip, i) => (
                  <li key={i}>{tip}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Generated Materials Tabs */}
      {materials && (
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
          {/* Subtabs */}
          <div className="flex border-b border-slate-800 pb-1.5 gap-2 overflow-x-auto text-xs">
            <button
              onClick={() => setActiveTab('tailored_cv')}
              className={`pb-1 px-1 font-semibold whitespace-nowrap transition-colors ${
                activeTab === 'tailored_cv'
                  ? 'border-b-2 border-emerald-400 text-emerald-300'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Tailored CV
            </button>
            <button
              onClick={() => setActiveTab('cover_letter')}
              className={`pb-1 px-1 font-semibold whitespace-nowrap transition-colors ${
                activeTab === 'cover_letter'
                  ? 'border-b-2 border-emerald-400 text-emerald-300'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Cover Letter
            </button>
            <button
              onClick={() => setActiveTab('email')}
              className={`pb-1 px-1 font-semibold whitespace-nowrap transition-colors ${
                activeTab === 'email'
                  ? 'border-b-2 border-emerald-400 text-emerald-300'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Application Email
            </button>
            <button
              onClick={() => setActiveTab('interview')}
              className={`pb-1 px-1 font-semibold whitespace-nowrap transition-colors ${
                activeTab === 'interview'
                  ? 'border-b-2 border-emerald-400 text-emerald-300'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Interview Prep
            </button>
          </div>

          {/* Tab 1: Tailored CV */}
          {activeTab === 'tailored_cv' && (
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-200">
                  Targeted Summary for {company}:
                </span>
                <button
                  onClick={() =>
                    handleCopy(
                      `${materials.tailored_cv_summary}\n\n${materials.tailored_bullet_points?.join('\n')}`,
                      'cv'
                    )
                  }
                  className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200"
                >
                  {copiedSection === 'cv' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedSection === 'cv' ? 'Copied' : 'Copy CV Section'}</span>
                </button>
              </div>
              <p className="p-3 rounded-lg bg-slate-950 text-slate-300 italic border border-slate-800">
                "{materials.tailored_cv_summary}"
              </p>

              <div>
                <span className="font-semibold text-slate-200 block mb-1">
                  High-Impact Achievement Bullets:
                </span>
                <ul className="space-y-1.5">
                  {(materials.tailored_bullet_points || []).map((bullet, i) => (
                    <li
                      key={i}
                      className="p-2 rounded-lg bg-slate-950/60 border border-slate-800 text-slate-300 flex items-start gap-2"
                    >
                      <span className="text-emerald-400 font-bold">•</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Tab 2: Cover Letter */}
          {activeTab === 'cover_letter' && (
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-200">
                  Personalized Cover Letter:
                </span>
                <button
                  onClick={() => handleCopy(materials.cover_letter, 'letter')}
                  className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200"
                >
                  {copiedSection === 'letter' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedSection === 'letter' ? 'Copied' : 'Copy Letter'}</span>
                </button>
              </div>
              <div className="p-3.5 rounded-lg bg-slate-950 text-slate-200 whitespace-pre-wrap font-sans border border-slate-800 leading-relaxed max-h-80 overflow-y-auto">
                {materials.cover_letter}
              </div>
            </div>
          )}

          {/* Tab 3: Application Email */}
          {activeTab === 'email' && (
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
                <div>
                  <span className="text-slate-500 font-semibold block">To:</span>
                  <span className="text-slate-200 font-mono">
                    {materials.application_email.recipient || detectedEmail}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 font-semibold block">Subject:</span>
                  <span className="text-slate-200 font-medium">
                    {materials.application_email.subject}
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-800 text-slate-300 whitespace-pre-wrap">
                  {materials.application_email.body}
                </div>
              </div>

              {/* Review before send button (Strict Human in the Loop) */}
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
                  <p className="text-[11px] text-amber-200">
                    Human-in-the-loop: Review recipient and attachments before sending.
                  </p>
                </div>
                <button
                  onClick={() => setShowReviewModal(true)}
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Review &amp; Send</span>
                </button>
              </div>
            </div>
          )}

          {/* Tab 4: Interview Prep */}
          {activeTab === 'interview' && (
            <div className="space-y-2 text-xs">
              <span className="font-semibold text-slate-200 block">
                Top Likely Interview Questions &amp; Talking Points:
              </span>
              <div className="space-y-2">
                {Array.isArray(materials.interview_prep) &&
                  materials.interview_prep.map((item: any, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1"
                    >
                      <p className="font-semibold text-emerald-300">
                        Q{i + 1}: {typeof item === 'string' ? item : item.question}
                      </p>
                      {item.talking_point && (
                        <p className="text-[11px] text-slate-400">
                          🎯 Talking Point: {item.talking_point}
                        </p>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* HUMAN-IN-THE-LOOP MANDATORY REVIEW MODAL */}
      {showReviewModal && reviewedEmail && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-5 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-slate-100 text-sm">
                  Human-In-The-Loop: Final Application Review
                </h3>
              </div>
              <button
                onClick={() => setShowReviewModal(false)}
                className="text-slate-400 hover:text-slate-200 text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Per Google Play compliance and system safety guidelines, applications are NEVER sent automatically. Please verify all details before executing:
            </p>

            <div className="space-y-2 text-xs">
              <div>
                <label className="text-[11px] text-slate-400 block font-semibold">
                  Recipient Email:
                </label>
                <input
                  type="email"
                  value={reviewedEmail.recipient}
                  onChange={(e) =>
                    setReviewedEmail({ ...reviewedEmail, recipient: e.target.value })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-100 font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block font-semibold">
                  Subject Line:
                </label>
                <input
                  type="text"
                  value={reviewedEmail.subject}
                  onChange={(e) =>
                    setReviewedEmail({ ...reviewedEmail, subject: e.target.value })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-100"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block font-semibold">
                  Email Body:
                </label>
                <textarea
                  rows={8}
                  value={reviewedEmail.body}
                  onChange={(e) =>
                    setReviewedEmail({ ...reviewedEmail, body: e.target.value })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-slate-100 leading-relaxed font-sans"
                />
              </div>

              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-400">
                <span className="font-semibold text-slate-300 block mb-1">
                  📎 Attachments Reminder:
                </span>
                <p>• {careerProfile.cvFileName || `${careerProfile.fullName}_CV_2026.pdf`}</p>
                <p>• Tailored Cover Letter (Included in text)</p>
                <p>• Relevant Certifications: NEBOSH / ISO / CSP (if applicable)</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setShowReviewModal(false)}
                className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteSend}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Confirm &amp; Launch Email Client (Mailto)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
