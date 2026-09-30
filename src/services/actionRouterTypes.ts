export type DetectedEntityType =
  | 'job_posting'
  | 'physical_address'
  | 'phone_number'
  | 'event_schedule'
  | 'financial_receipt'
  | 'social_or_media'
  | 'code_or_technical'
  | 'document_memo';

export interface AndroidIntentSpec {
  action: string;
  dataUri: string;
  mimeType?: string;
  package?: string;
  extras: Record<string, any>;
  deepLinkUri: string;
  webFallbackUri: string;
}

export interface EntityContext {
  entityType: DetectedEntityType;
  title: string;
  summary: string;
  recipientEmail?: string;
  phoneNumber?: string;
  cleanPhone?: string;
  address?: string;
  eventDates?: string;
  venue?: string;
  merchantName?: string;
  totalAmount?: string;
  codeSnippet?: string;
  socialCopy?: string;
  rawEntities: Record<string, any>;
}

export interface ActionProvider {
  id: string;
  name: string;
  category: string;
  androidPackage: string;
  intentAction: string;
  dataScheme: string;
  iconEmoji: string;
  brandColor: string;
  buildIntent: (context: EntityContext) => AndroidIntentSpec;
}

export interface RoutedActionPlan {
  id: string;
  entityType: DetectedEntityType;
  entityLabel: string;
  confidence: number;
  explanation: string;
  primaryTargetApp: ActionProvider;
  alternativeTargetApps: ActionProvider[];
  intentSpec: AndroidIntentSpec;
  dispatch: (selectedProvider?: ActionProvider) => {
    success: boolean;
    providerName: string;
    launchUri: string;
  };
}
