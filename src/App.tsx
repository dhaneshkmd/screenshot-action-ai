import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroUpload } from './components/HeroUpload';
import { AnalysisResultView } from './components/AnalysisResultView';
import { AndroidFrame } from './components/AndroidFrame';
import { AndroidShareSheetModal } from './components/AndroidShareSheetModal';
import { CareerProfileModal } from './components/CareerProfileModal';
import { HistoryMemoryView } from './components/HistoryMemoryView';
import { SubscriptionModal } from './components/SubscriptionModal';
import { PrivacyComplianceModal } from './components/PrivacyComplianceModal';
import { ArchSpecificationModal } from './components/ArchSpecificationModal';
import { ConnectedAppsSettingsModal } from './components/ConnectedAppsSettingsModal';
import {
  ScreenshotAnalysis,
  CareerProfile,
  SubscriptionInfo,
  SampleScreenshot,
  SubscriptionTierType,
} from './types';
import { analyzeScreenshot, checkServerHealth } from './services/api';
import { Sparkles, Loader2, ShieldCheck, Zap } from 'lucide-react';

// Default Career Profile pre-loaded for instant Job Matching demo
const INITIAL_CAREER_PROFILE: CareerProfile = {
  fullName: 'Marcus Vance',
  title: 'Lead HSE & Safety Operations Manager',
  email: 'marcus.vance@safetylead.com',
  phone: '+971 50 123 4567',
  location: 'Dubai, UAE',
  linkedin: 'linkedin.com/in/marcus-vance-hse',
  summary:
    'Dedicated Health, Safety & Environmental Operations Lead with 9+ years directing high-hazard industrial, plant, and infrastructure operations. Proven record of zero-fatality leadership, regulatory audits, and enterprise-wide ISO 45001 compliance.',
  experienceYears: 9,
  skills: [
    'NEBOSH International Diploma',
    'ISO 45001',
    'ISO 14001',
    'HAZOP & Risk Assessment',
    'Root Cause Analysis',
    'Emergency Response Planning',
    'Incident Investigation',
    'Safety Auditing & Compliance',
    'Behavioral Safety Coaching',
    'Permit to Work (PTW) Systems',
  ],
  education: 'B.Sc. Occupational Safety & Health Engineering',
  certifications: [
    'NEBOSH International Diploma in OSH',
    'CSP (Certified Safety Professional)',
    'Lead Auditor ISO 45001',
  ],
  preferredRoles: [
    'HSE Lead Manager',
    'VP of Safety & Environment',
    'Director of Operational Risk',
  ],
  cvFileName: 'Marcus_Vance_HSE_Lead_CV_2026.pdf',
  cvRawText: `MARCUS VANCE, CSP, NEBOSH Dip.
Lead HSE & Operational Safety Manager
Dubai, UAE • marcus.vance@safetylead.com • +971 50 123 4567

EXECUTIVE SUMMARY
Certified Safety Professional with 9 years of offshore and onshore industrial safety leadership. Spearheaded HSE transformations reducing Lost Time Injury Frequency (LTIF) by 84% across a workforce of 1,800+.

CORE COMPETENCIES
- NEBOSH International Diploma & CSP Certified
- ISO 45001, ISO 14001, OHSAS 18001 Audit Leadership
- HAZOP Studies, Quantitative Risk Assessment, Root Cause Analysis
- Cross-functional incident investigation & statutory reporting
- Fluency in English, conversational Arabic

SELECTED ACHIEVEMENTS
- Apex Infrastructure (2021-Present): Directed safety management system across 4 multi-billion dollar EPC construction projects.
- Horizon Energy (2017-2021): Led HSE operations for offshore gas treatment plants with 3.2 million man-hours without LTI.`,
};

export default function App() {
  const [isMobileFrame, setIsMobileFrame] = useState(false);
  const [activeAnalysis, setActiveAnalysis] = useState<ScreenshotAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState<string>('');
  const [processOnceOnly, setProcessOnceOnly] = useState(false);

  // Modals
  const [showShareSheet, setShowShareSheet] = useState(false);
  const [showCareerProfile, setShowCareerProfile] = useState(false);
  const [showMemory, setShowMemory] = useState(false);
  const [showSubscription, setShowSubscription] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showArchSpec, setShowArchSpec] = useState(false);
  const [showConnectedApps, setShowConnectedApps] = useState(false);

  // Career profile state
  const [careerProfile, setCareerProfile] = useState<CareerProfile>(() => {
    const saved = localStorage.getItem('snapaction_career_profile');
    return saved ? JSON.parse(saved) : INITIAL_CAREER_PROFILE;
  });

  // History memory state
  const [history, setHistory] = useState<ScreenshotAnalysis[]>(() => {
    const saved = localStorage.getItem('snapaction_memory_history');
    return saved ? JSON.parse(saved) : [];
  });

  // Subscription state
  const [subscription, setSubscription] = useState<SubscriptionInfo>(() => {
    const saved = localStorage.getItem('snapaction_subscription');
    return saved
      ? JSON.parse(saved)
      : {
          tier: 'pro',
          monthlyQuota: 300,
          usedThisMonth: 12,
          features: [
            'Screenshot → Job & Tailored CV',
            'Advanced Code & UI Prompts',
            'Full Memory Search',
          ],
        };
  });

  // Server health check
  const [serverStatus, setServerStatus] = useState<{
    status: string;
    hasApiKey: boolean;
    model: string;
  }>({
    status: 'checking',
    hasApiKey: true,
    model: 'gemini-3.8-flash',
  });

  useEffect(() => {
    checkServerHealth().then(setServerStatus);
  }, []);

  // Save profile changes
  const handleSaveCareerProfile = (updated: CareerProfile) => {
    setCareerProfile(updated);
    localStorage.setItem('snapaction_career_profile', JSON.stringify(updated));
  };

  // Perform screenshot analysis workflow
  const handleSelectScreenshot = async (
    imageDataUri: string,
    sample?: SampleScreenshot
  ) => {
    setIsAnalyzing(true);
    setAnalysisStep('Uploading securely & compressing image...');

    try {
      setTimeout(() => {
        setAnalysisStep('Vision Agent: scanning sensitive PII & OCR...');
      }, 500);

      setTimeout(() => {
        setAnalysisStep('Classifying intent & extracting structured entities...');
      }, 1000);

      const result = await analyzeScreenshot(imageDataUri, {
        processOnce: processOnceOnly,
      });

      setActiveAnalysis(result);

      // Deduct quota
      setSubscription((prev) => {
        const next = { ...prev, usedThisMonth: prev.usedThisMonth + 1 };
        localStorage.setItem('snapaction_subscription', JSON.stringify(next));
        return next;
      });

      // If not ephemeral mode, save to memory history automatically or prompt
      if (!processOnceOnly) {
        setHistory((prev) => {
          const next = [result, ...prev.filter((i) => i.id !== result.id)];
          localStorage.setItem('snapaction_memory_history', JSON.stringify(next));
          return next;
        });
      }
    } catch (err: any) {
      alert('Analysis failed: ' + (err.message || 'Error communicating with server'));
    } finally {
      setIsAnalyzing(false);
      setAnalysisStep('');
    }
  };

  // Custom file upload handler from share modal or picker
  const handleCustomFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUri = e.target?.result as string;
      if (dataUri) {
        handleSelectScreenshot(dataUri);
      }
    };
    reader.readAsDataURL(file);
  };

  // Memory history actions
  const handleSaveToMemory = () => {
    if (!activeAnalysis) return;
    setHistory((prev) => {
      const next = [activeAnalysis, ...prev.filter((i) => i.id !== activeAnalysis.id)];
      localStorage.setItem('snapaction_memory_history', JSON.stringify(next));
      return next;
    });
  };

  const handleDeleteHistoryItem = (id: string) => {
    setHistory((prev) => {
      const next = prev.filter((i) => i.id !== id);
      localStorage.setItem('snapaction_memory_history', JSON.stringify(next));
      return next;
    });
  };

  const handleClearAllHistory = () => {
    setHistory([]);
    localStorage.removeItem('snapaction_memory_history');
  };

  // Subscription upgrade
  const handleUpgradeTier = (tier: SubscriptionTierType) => {
    const quotaMap = { free: 15, pro: 300, pro_plus: 9999 };
    const updated: SubscriptionInfo = {
      ...subscription,
      tier,
      monthlyQuota: quotaMap[tier],
    };
    setSubscription(updated);
    localStorage.setItem('snapaction_subscription', JSON.stringify(updated));
  };

  // Account Wipe (Google Play compliance)
  const handleDeleteAccount = () => {
    localStorage.clear();
    setHistory([]);
    setCareerProfile(INITIAL_CAREER_PROFILE);
    setActiveAnalysis(null);
  };

  const isSavedInMemory = activeAnalysis
    ? history.some((i) => i.id === activeAnalysis.id)
    : false;

  const mainAppContent = (
    <div className="w-full flex-1 flex flex-col min-h-0 bg-slate-950 text-slate-100 font-sans">
      <Header
        isMobileFrame={isMobileFrame}
        setIsMobileFrame={setIsMobileFrame}
        onOpenCareerProfile={() => setShowCareerProfile(true)}
        onOpenMemory={() => setShowMemory(true)}
        onOpenSubscription={() => setShowSubscription(true)}
        onOpenPrivacy={() => setShowPrivacy(true)}
        onOpenArchSpec={() => setShowArchSpec(true)}
        onOpenConnectedApps={() => setShowConnectedApps(true)}
        subscription={subscription}
        serverStatus={serverStatus}
        onResetToHome={() => setActiveAnalysis(null)}
      />

      <main className="flex-1 flex flex-col justify-start">
        {isAnalyzing ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4 min-h-[500px]">
            <div className="relative">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-indigo-600 via-blue-500 to-cyan-400 flex items-center justify-center shadow-xl shadow-blue-500/30 animate-pulse">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -inset-1 rounded-3xl bg-blue-500/20 blur-sm -z-10 animate-ping" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-100">
                SnapAction Autonomous AI Agent
              </h3>
              <p className="text-xs text-indigo-300 font-mono animate-pulse">
                {analysisStep || 'Analyzing visual structure & entities...'}
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900 px-3.5 py-1.5 rounded-full border border-slate-800">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-400" />
              <span>Model: Gemini 2.5 Flash Multimodal</span>
            </div>
          </div>
        ) : activeAnalysis ? (
          <AnalysisResultView
            analysis={activeAnalysis}
            careerProfile={careerProfile}
            onOpenCareerProfile={() => setShowCareerProfile(true)}
            onBackToHome={() => setActiveAnalysis(null)}
            onSaveToMemory={handleSaveToMemory}
            isSavedInMemory={isSavedInMemory}
          />
        ) : (
          <HeroUpload
            onSelectScreenshot={handleSelectScreenshot}
            onOpenShareSheet={() => setShowShareSheet(true)}
            processOnceOnly={processOnceOnly}
            setProcessOnceOnly={setProcessOnceOnly}
            isAnalyzing={isAnalyzing}
          />
        )}
      </main>

      {/* Modals */}
      <AndroidShareSheetModal
        isOpen={showShareSheet}
        onClose={() => setShowShareSheet(false)}
        onSelectScreenshot={handleSelectScreenshot}
        onCustomFileUpload={handleCustomFileUpload}
      />

      <CareerProfileModal
        isOpen={showCareerProfile}
        onClose={() => setShowCareerProfile(false)}
        profile={careerProfile}
        onSaveProfile={handleSaveCareerProfile}
      />

      <HistoryMemoryView
        isOpen={showMemory}
        onClose={() => setShowMemory(false)}
        history={history}
        onSelectHistoryItem={(item) => setActiveAnalysis(item)}
        onDeleteHistoryItem={handleDeleteHistoryItem}
        onClearAllHistory={handleClearAllHistory}
      />

      <SubscriptionModal
        isOpen={showSubscription}
        onClose={() => setShowSubscription(false)}
        subscription={subscription}
        onUpgradeTier={handleUpgradeTier}
      />

      <PrivacyComplianceModal
        isOpen={showPrivacy}
        onClose={() => setShowPrivacy(false)}
        onDeleteAccount={handleDeleteAccount}
        processOnceOnly={processOnceOnly}
        setProcessOnceOnly={setProcessOnceOnly}
      />

      <ArchSpecificationModal
        isOpen={showArchSpec}
        onClose={() => setShowArchSpec(false)}
      />

      <ConnectedAppsSettingsModal
        isOpen={showConnectedApps}
        onClose={() => setShowConnectedApps(false)}
      />
    </div>
  );

  return (
    <AndroidFrame
      enabled={isMobileFrame}
      onSimulateShare={() => setShowShareSheet(true)}
    >
      {mainAppContent}
    </AndroidFrame>
  );
}
