export type ScreenshotContentType =
  | 'job_vacancy'
  | 'job_advertisement'
  | 'ui_design'
  | 'chat_message'
  | 'event_poster'
  | 'event_calendar'
  | 'receipt_invoice'
  | 'banking_payment'
  | 'contact_card'
  | 'location_place'
  | 'restaurant_food'
  | 'map_location'
  | 'product_listing'
  | 'product_shopping'
  | 'travel_itinerary'
  | 'code_error'
  | 'document_note'
  | 'article_news'
  | 'study_education'
  | 'contract_legal'
  | 'social_media'
  | 'general'
  | 'other';

export interface ExtractedEntities {
  job_title?: string;
  company_or_merchant?: string;
  location_or_venue?: string;
  dates_or_deadlines?: string;
  emails?: string[];
  phones?: string[];
  urls?: string[];
  prices_or_salary?: string;
  currency?: string;
  tax_or_vat?: string;
  key_skills_or_tags?: string[];
  line_items?: Array<{ name: string; amount: string }>;
  sender_or_speaker?: string;
  code_language_or_framework?: string;
  brand?: string;
  model_or_product_name?: string;
  specifications?: string[];
  flight_number?: string;
  booking_reference?: string;
  departure_location?: string;
  arrival_location?: string;
  hotel_or_stay_name?: string;
  attendees_or_speakers?: string[];
  address?: string;
  qr_code_data?: string;
  detected_language?: string;
  contract_parties?: string[];
}

export interface RecommendedAction {
  id: string;
  label: string;
  description?: string;
  category?: string;
  priority: number;
  icon?: string;
  action_type?: string;
  badge?: string;
}

export interface ConfidenceScores {
  category_confidence: number;
  text_confidence: number;
  intent_confidence: number;
  overall: number;
  is_uncertain?: boolean;
}

export interface ScreenshotAnalysis {
  id: string;
  timestamp: string;
  imageBase64: string;
  content_type: ScreenshotContentType;
  confidence: number;
  confidence_scores?: ConfidenceScores;
  summary: string;
  detected_title?: string;
  detected_language?: string;
  ocr_text?: string;
  sensitive_data_detected: boolean;
  sensitive_data_warning?: string;
  entities: ExtractedEntities;
  user_intent?: string;
  recommended_actions: RecommendedAction[];
  suggested_questions?: string[];
  tags: string[];
  processedOnceOnly?: boolean;
  collection_id?: string;
  is_favourite?: boolean;
  visual_redaction_applied?: boolean;
}

export interface AgentWorkflowStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  outputPreview?: string;
  actionData?: any;
}

export interface AgentWorkflow {
  id: string;
  agentType: 'job' | 'travel' | 'finance' | 'content' | 'coding' | 'study' | 'shopping' | 'research';
  title: string;
  icon: string;
  description: string;
  steps: AgentWorkflowStep[];
  isCompleted?: boolean;
}

export interface StudyQuizItem {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface StudyFlashcard {
  front: string;
  back: string;
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
  preferredLanguage?: string;
  defaultCurrency?: string;
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
  twitter_thread?: string[];
  instagram_caption?: string;
  youtube_script?: string;
  hashtags?: string[];
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
  creditsRemaining: number;
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

export interface SmartCollection {
  id: string;
  name: string;
  icon: string;
  description: string;
  categoryFilter?: string;
  count?: number;
}
