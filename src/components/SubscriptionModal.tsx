import React, { useState } from 'react';
import {
  X,
  Zap,
  Check,
  Sparkles,
  ShieldCheck,
  CreditCard,
  ShoppingBag,
} from 'lucide-react';
import { SubscriptionInfo, SubscriptionTierType } from '../types';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscription: SubscriptionInfo;
  onUpgradeTier: (tier: SubscriptionTierType) => void;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose,
  subscription,
  onUpgradeTier,
}) => {
  const [selectedTier, setSelectedTier] = useState<SubscriptionTierType>(subscription.tier);
  const [simulatingGooglePlay, setSimulatingGooglePlay] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSimulatePurchase = (tier: SubscriptionTierType) => {
    setSelectedTier(tier);
    setSimulatingGooglePlay(true);
    setTimeout(() => {
      onUpgradeTier(tier);
      setSimulatingGooglePlay(false);
      setPurchaseSuccess(true);
      setTimeout(() => {
        setPurchaseSuccess(false);
        onClose();
      }, 1500);
    }, 1200);
  };

  const usagePercent = Math.min(
    100,
    Math.round((subscription.usedThisMonth / subscription.monthlyQuota) * 100)
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Zap className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-sm">
                Subscription &amp; Google Play Billing
              </h3>
              <p className="text-xs text-slate-400">
                Transparent monthly AI action metering &amp; in-app subscription tiers.
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

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          {/* Current Usage Meter */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300">
                Monthly AI Actions Quota ({subscription.tier.toUpperCase()})
              </span>
              <span className="font-mono text-slate-400">
                {subscription.usedThisMonth} / {subscription.monthlyQuota} used ({subscription.monthlyQuota - subscription.usedThisMonth} remaining)
              </span>
            </div>
            <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500"
                style={{ width: `${usagePercent}%` }}
              />
            </div>
          </div>

          {/* Pricing Tiers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Free Tier */}
            <div
              className={`p-4 rounded-2xl border flex flex-col justify-between transition-all ${
                subscription.tier === 'free'
                  ? 'bg-slate-850 border-slate-600 ring-1 ring-slate-500'
                  : 'bg-slate-900 border-slate-800'
              }`}
            >
              <div className="space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                  Starter Free
                </span>
                <div>
                  <span className="text-2xl font-black text-white">$0</span>
                  <span className="text-xs text-slate-400"> / month</span>
                </div>
                <p className="text-xs text-slate-400">
                  Ideal for casual users taking quick notes and basic OCR summaries.
                </p>

                <ul className="text-xs text-slate-300 space-y-1.5 pt-2 border-t border-slate-800">
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-blue-400" />
                    <span>15 AI screenshot actions / mo</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-blue-400" />
                    <span>Screenshot → Ask Q&amp;A</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-blue-400" />
                    <span>Standard resolution OCR</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4">
                {subscription.tier === 'free' ? (
                  <button
                    disabled
                    className="w-full py-2 rounded-xl bg-slate-800 text-slate-400 text-xs font-semibold cursor-default"
                  >
                    Current Plan
                  </button>
                ) : (
                  <button
                    onClick={() => handleSimulatePurchase('free')}
                    className="w-full py-2 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-semibold"
                  >
                    Downgrade
                  </button>
                )}
              </div>
            </div>

            {/* Pro Tier (Flagship) */}
            <div
              className={`p-4 rounded-2xl border flex flex-col justify-between relative transition-all ${
                subscription.tier === 'pro'
                  ? 'bg-gradient-to-b from-indigo-950/60 to-slate-900 border-indigo-500 ring-2 ring-indigo-500/50 shadow-xl'
                  : 'bg-slate-900 border-indigo-500/40 hover:border-indigo-500'
              }`}
            >
              <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 text-[10px] font-bold text-white uppercase tracking-wider">
                Most Popular
              </div>

              <div className="space-y-3 pt-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 font-mono">
                  Pro Power
                </span>
                <div>
                  <span className="text-2xl font-black text-white">$9.99</span>
                  <span className="text-xs text-slate-400"> / month</span>
                </div>
                <p className="text-xs text-slate-300">
                  Full access to Flagship Screenshot-to-Job CV matching, Prompts &amp; Memory.
                </p>

                <ul className="text-xs text-slate-200 space-y-1.5 pt-2 border-t border-slate-800">
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>300 AI actions / month</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Screenshot → Job &amp; Tailored CV</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Screenshot → Code/UI Prompts</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Unlimited Screenshot Memory</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4">
                {subscription.tier === 'pro' ? (
                  <button
                    disabled
                    className="w-full py-2 rounded-xl bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 text-xs font-semibold cursor-default"
                  >
                    Current Plan
                  </button>
                ) : (
                  <button
                    onClick={() => handleSimulatePurchase('pro')}
                    className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
                  >
                    Upgrade via Google Play
                  </button>
                )}
              </div>
            </div>

            {/* Pro+ Tier */}
            <div
              className={`p-4 rounded-2xl border flex flex-col justify-between transition-all ${
                subscription.tier === 'pro_plus'
                  ? 'bg-slate-850 border-purple-500 ring-1 ring-purple-500'
                  : 'bg-slate-900 border-slate-800'
              }`}
            >
              <div className="space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 font-mono">
                  Pro+ Unlimited
                </span>
                <div>
                  <span className="text-2xl font-black text-white">$24.99</span>
                  <span className="text-xs text-slate-400"> / month</span>
                </div>
                <p className="text-xs text-slate-400">
                  For power recruiters, developers &amp; executives with unlimited AI workflows.
                </p>

                <ul className="text-xs text-slate-300 space-y-1.5 pt-2 border-t border-slate-800">
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-purple-400" />
                    <span>Unlimited AI Actions</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-purple-400" />
                    <span>Priority Gemini Reasoning</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-purple-400" />
                    <span>Multi-Profile Career Switching</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4">
                {subscription.tier === 'pro_plus' ? (
                  <button
                    disabled
                    className="w-full py-2 rounded-xl bg-purple-600/30 text-purple-300 border border-purple-500/40 text-xs font-semibold cursor-default"
                  >
                    Current Plan
                  </button>
                ) : (
                  <button
                    onClick={() => handleSimulatePurchase('pro_plus')}
                    className="w-full py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all cursor-pointer"
                  >
                    Upgrade to Pro+
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span>Processed securely via Google Play In-App Billing (IAP)</span>
          {purchaseSuccess && (
            <span className="text-emerald-400 font-bold">✓ Subscribed successfully!</span>
          )}
        </div>
      </div>
    </div>
  );
};
