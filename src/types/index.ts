export type ScreenshotContentType =
  | 'job_vacancy'
  | 'ui_design'
  | 'chat_message'
  | 'event_poster'
  | 'receipt_invoice'
  | 'contact_card'
  | 'location_place'
  | 'product_listing'
  | 'code_error'
  | 'document_note'
  | 'general';

export interface ExtractedEntities {
  job_title?: string;
  company_or_merchant?: string;
  location_or_venue?: string;
  dates_or_deadlines?: string;
  emails?: string[];
  phones?: string[];
  urls?: string[];
  prices_or_salary?: string;
  key_skills_or_tags?: string[];
  line_items?: Array<{ name: string; amount: string }>;
  sender_or_speaker?: string;
  code_language_or_framework?: string;
}

export interface RecommendedAction {
  id: string;
  label: string;
  description?: string;
  category?: string;
  priority: number;
  icon?: string;
}

export interface ScreenshotAnalysis {
  id: string;
  timestamp: string;
  imageBase64: string;
  content_type: ScreenshotContentType;
  confidence: number;
  summary: string;
  detected_title?: string;
  ocr_text?: string;
  sensitive_data_detected: boolean;
  sensitive_data_warning?: string;
  entities: ExtractedEntities;
  user_intent?: string;
  recommended_actions: RecommendedAction[];
  suggested_questions?: string[];
  tags: string[];
  processedOnceOnly?: boolean;
}

export interface CareerProfile {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  summary: string;
  experienceYears: number;
  skills: string[];
  education: string;
  certifications: string[];
  preferredRoles: string[];
  cvFileName?: string;
  cvRawText?: string;
}

export interface JobMatchResult {
  match_percentage: number;
  match_summary: string;
  matching_skills: string[];
  missing_skills: string[];
  strengths: string[];
  cv_improvement_recommendations: string[];
  interview_readiness_score: number;
}

export interface JobApplicationMaterials {
  tailored_cv_summary: string;
  tailored_bullet_points: string[];
  cover_letter: string;
  application_email: {
    recipient: string;
    subject: string;
    body: string;
    attachments_reminder: string[];
  };
  linkedin_outreach: string;
  interview_prep: Array<{ question: string; talking_point: string }> | string[];
}

export interface ContentResult {
  headline: string;
  main_post: string;
  hook: string;
  call_to_action: string;
  alternative_hooks?: string[];
}

export interface CommunicationReplyResult {
  professional: string;
  friendly: string;
  concise: string;
  firm_or_negotiate: string;
  key_takeaway?: string;
  detected_sender?: string;
}

export interface SampleScreenshot {
  id: string;
  title: string;
  subtitle: string;
  category: ScreenshotContentType;
  badge: string;
  thumbnailSvg: string;
  imageDataUri: string;
  description: string;
  prefillEntities?: ExtractedEntities;
}

export type SubscriptionTierType = 'free' | 'pro' | 'pro_plus';

export interface SubscriptionInfo {
  tier: SubscriptionTierType;
  monthlyQuota: number;
  usedThisMonth: number;
  features: string[];
}

// Universal App Connectivity Layer Types
export type AppCategory =
  | 'email'
  | 'messaging'
  | 'navigation'
  | 'calendar'
  | 'social'
  | 'note_task'
  | 'cloud_storage'
  | 'dialer_sms'
  | 'document_reader'
  | 'shopping_travel';

export interface AppConnection {
  id: string;
  name: string;
  category: AppCategory;
  icon: string;
  color: string;
  badge?: string;
  description: string;
  packageScheme: string;
  webFallbackUrl: string;
  installed: boolean;
  isDefault: boolean;
}

export interface DispatchedIntentPayload {
  category: AppCategory;
  actionTitle: string;
  actionSubtitle: string;
  compatibleApps: AppConnection[];
  dataPreview: {
    label: string;
    value: string;
  }[];
  rawPayload: Record<string, any>;
  executeAction: (appId: string) => { launchUrl: string; executedDirectly: boolean; notes: string };
}
