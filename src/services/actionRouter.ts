import { ScreenshotAnalysis, DispatchedIntentPayload, AppCategory } from '../types';
import {
  DetectedEntityType,
  AndroidIntentSpec,
  EntityContext,
  ActionProvider,
  RoutedActionPlan,
} from './actionRouterTypes';
import { AppConnectivityRegistry } from './appConnectivityRegistry';

// -------------------------------------------------------------
// 1. ACTION PROVIDERS REGISTRY
// -------------------------------------------------------------

export const ACTION_PROVIDERS: Record<string, ActionProvider> = {
  // GMAIL
  gmail: {
    id: 'gmail',
    name: 'Gmail',
    category: 'email',
    androidPackage: 'com.google.android.gm',
    intentAction: 'android.intent.action.SENDTO',
    dataScheme: 'mailto:',
    iconEmoji: '✉️',
    brandColor: '#EA4335',
    buildIntent: (ctx: EntityContext): AndroidIntentSpec => {
      const encTo = encodeURIComponent(ctx.recipientEmail || '');
      const encSub = encodeURIComponent(ctx.title ? `Application: ${ctx.title}` : 'Inquiry');
      const encBody = encodeURIComponent(ctx.summary || '');
      return {
        action: 'android.intent.action.SENDTO',
        dataUri: `mailto:${ctx.recipientEmail || ''}?subject=${encSub}&body=${encBody}`,
        package: 'com.google.android.gm',
        extras: {
          'android.intent.extra.EMAIL': [ctx.recipientEmail || ''],
          'android.intent.extra.SUBJECT': ctx.title ? `Application: ${ctx.title}` : 'Inquiry',
          'android.intent.extra.TEXT': ctx.summary || '',
        },
        deepLinkUri: `googlegmail:///co?to=${encTo}&subject=${encSub}&body=${encBody}`,
        webFallbackUri: `https://mail.google.com/mail/?view=cm&fs=1&to=${encTo}&su=${encSub}&body=${encBody}`,
      };
    },
  },

  // OUTLOOK
  outlook: {
    id: 'outlook',
    name: 'Microsoft Outlook',
    category: 'email',
    androidPackage: 'com.microsoft.office.outlook',
    intentAction: 'android.intent.action.SENDTO',
    dataScheme: 'mailto:',
    iconEmoji: '📧',
    brandColor: '#0078D4',
    buildIntent: (ctx: EntityContext): AndroidIntentSpec => {
      const encTo = encodeURIComponent(ctx.recipientEmail || '');
      const encSub = encodeURIComponent(ctx.title || 'Inquiry');
      const encBody = encodeURIComponent(ctx.summary || '');
      return {
        action: 'android.intent.action.SENDTO',
        dataUri: `mailto:${ctx.recipientEmail || ''}?subject=${encSub}&body=${encBody}`,
        package: 'com.microsoft.office.outlook',
        extras: {
          'android.intent.extra.EMAIL': [ctx.recipientEmail || ''],
          'android.intent.extra.SUBJECT': ctx.title || 'Inquiry',
          'android.intent.extra.TEXT': ctx.summary || '',
        },
        deepLinkUri: `ms-outlook://compose?to=${encTo}&subject=${encSub}&body=${encBody}`,
        webFallbackUri: `https://outlook.live.com/mail/0/deeplink/compose?to=${encTo}&subject=${encSub}&body=${encBody}`,
      };
    },
  },

  // GOOGLE MAPS
  google_maps: {
    id: 'google_maps',
    name: 'Google Maps',
    category: 'navigation',
    androidPackage: 'com.google.android.apps.maps',
    intentAction: 'android.intent.action.VIEW',
    dataScheme: 'geo:',
    iconEmoji: '📍',
    brandColor: '#34A853',
    buildIntent: (ctx: EntityContext): AndroidIntentSpec => {
      const q = encodeURIComponent(ctx.address || 'San Francisco, CA');
      return {
        action: 'android.intent.action.VIEW',
        dataUri: `geo:0,0?q=${q}`,
        package: 'com.google.android.apps.maps',
        extras: {
          'android.intent.extra.REFERRER_NAME': 'SnapActionAI',
        },
        deepLinkUri: `google.navigation:q=${q}`,
        webFallbackUri: `https://www.google.com/maps/search/?api=1&query=${q}`,
      };
    },
  },

  // WAZE
  waze: {
    id: 'waze',
    name: 'Waze',
    category: 'navigation',
    androidPackage: 'com.waze',
    intentAction: 'android.intent.action.VIEW',
    dataScheme: 'waze:',
    iconEmoji: '🚙',
    brandColor: '#33CCFF',
    buildIntent: (ctx: EntityContext): AndroidIntentSpec => {
      const q = encodeURIComponent(ctx.address || '');
      return {
        action: 'android.intent.action.VIEW',
        dataUri: `waze://?q=${q}&navigate=yes`,
        package: 'com.waze',
        extras: { query: ctx.address || '' },
        deepLinkUri: `waze://?q=${q}&navigate=yes`,
        webFallbackUri: `https://waze.com/ul?q=${q}`,
      };
    },
  },

  // ANDROID PHONE DIALER
  android_dialer: {
    id: 'android_dialer',
    name: 'Android Phone Dialer',
    category: 'dialer_sms',
    androidPackage: 'com.google.android.dialer',
    intentAction: 'android.intent.action.DIAL',
    dataScheme: 'tel:',
    iconEmoji: '📞',
    brandColor: '#10B981',
    buildIntent: (ctx: EntityContext): AndroidIntentSpec => {
      const clean = ctx.cleanPhone || ctx.phoneNumber?.replace(/[^0-9+]/g, '') || '';
      return {
        action: 'android.intent.action.DIAL',
        dataUri: `tel:${clean}`,
        package: 'com.google.android.dialer',
        extras: {},
        deepLinkUri: `tel:${clean}`,
        webFallbackUri: `tel:${clean}`,
      };
    },
  },

  // WHATSAPP
  whatsapp: {
    id: 'whatsapp',
    name: 'WhatsApp Messenger',
    category: 'messaging',
    androidPackage: 'com.whatsapp',
    intentAction: 'android.intent.action.SEND',
    dataScheme: 'whatsapp:',
    iconEmoji: '💬',
    brandColor: '#25D366',
    buildIntent: (ctx: EntityContext): AndroidIntentSpec => {
      const clean = (ctx.cleanPhone || ctx.phoneNumber || '').replace(/[^0-9]/g, '');
      const msg = encodeURIComponent(`Hello! Connecting regarding: ${ctx.title || ctx.summary}`);
      return {
        action: 'android.intent.action.SEND',
        dataUri: `whatsapp://send?phone=${clean}&text=${msg}`,
        package: 'com.whatsapp',
        extras: {
          'android.intent.extra.TEXT': `Hello! Regarding: ${ctx.title || ctx.summary}`,
        },
        deepLinkUri: `whatsapp://send?phone=${clean}&text=${msg}`,
        webFallbackUri: `https://wa.me/${clean}?text=${msg}`,
      };
    },
  },

  // TELEGRAM
  telegram: {
    id: 'telegram',
    name: 'Telegram',
    category: 'messaging',
    androidPackage: 'org.telegram.messenger',
    intentAction: 'android.intent.action.SEND',
    dataScheme: 'tg:',
    iconEmoji: '✈️',
    brandColor: '#229ED9',
    buildIntent: (ctx: EntityContext): AndroidIntentSpec => {
      const msg = encodeURIComponent(ctx.summary || ctx.title || '');
      return {
        action: 'android.intent.action.SEND',
        dataUri: `tg://msg?text=${msg}`,
        package: 'org.telegram.messenger',
        extras: { 'android.intent.extra.TEXT': ctx.summary || '' },
        deepLinkUri: `tg://msg?text=${msg}`,
        webFallbackUri: `https://t.me/share/url?url=${msg}`,
      };
    },
  },

  // GOOGLE CALENDAR
  google_calendar: {
    id: 'google_calendar',
    name: 'Google Calendar',
    category: 'calendar',
    androidPackage: 'com.google.android.calendar',
    intentAction: 'android.intent.action.INSERT',
    dataScheme: 'content://com.android.calendar/events',
    iconEmoji: '📅',
    brandColor: '#4285F4',
    buildIntent: (ctx: EntityContext): AndroidIntentSpec => {
      const encTitle = encodeURIComponent(ctx.title || 'Event');
      const encLoc = encodeURIComponent(ctx.venue || ctx.address || '');
      const encDesc = encodeURIComponent(ctx.summary || '');
      return {
        action: 'android.intent.action.INSERT',
        dataUri: 'content://com.android.calendar/events',
        package: 'com.google.android.calendar',
        extras: {
          title: ctx.title || 'Event',
          eventLocation: ctx.venue || ctx.address || '',
          description: ctx.summary || '',
        },
        deepLinkUri: `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encTitle}&location=${encLoc}&details=${encDesc}`,
        webFallbackUri: `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encTitle}&location=${encLoc}&details=${encDesc}`,
      };
    },
  },

  // LINKEDIN
  linkedin: {
    id: 'linkedin',
    name: 'LinkedIn',
    category: 'social',
    androidPackage: 'com.linkedin.android',
    intentAction: 'android.intent.action.SEND',
    dataScheme: 'linkedin:',
    iconEmoji: '💼',
    brandColor: '#0A66C2',
    buildIntent: (ctx: EntityContext): AndroidIntentSpec => {
      const text = encodeURIComponent(ctx.socialCopy || `${ctx.title}: ${ctx.summary}`);
      return {
        action: 'android.intent.action.SEND',
        dataUri: `linkedin://shareArticle?mini=true&text=${text}`,
        package: 'com.linkedin.android',
        extras: { 'android.intent.extra.TEXT': ctx.socialCopy || ctx.summary },
        deepLinkUri: `linkedin://shareArticle?mini=true&text=${text}`,
        webFallbackUri: `https://www.linkedin.com/feed/?shareActive=true&text=${text}`,
      };
    },
  },

  // X / TWITTER
  x_twitter: {
    id: 'x_twitter',
    name: 'X (Twitter)',
    category: 'social',
    androidPackage: 'com.twitter.android',
    intentAction: 'android.intent.action.SEND',
    dataScheme: 'twitter:',
    iconEmoji: '𝕏',
    brandColor: '#000000',
    buildIntent: (ctx: EntityContext): AndroidIntentSpec => {
      const text = encodeURIComponent(ctx.socialCopy || `${ctx.title}: ${ctx.summary}`);
      return {
        action: 'android.intent.action.SEND',
        dataUri: `twitter://post?message=${text}`,
        package: 'com.twitter.android',
        extras: { 'android.intent.extra.TEXT': ctx.socialCopy || ctx.summary },
        deepLinkUri: `twitter://post?message=${text}`,
        webFallbackUri: `https://twitter.com/intent/tweet?text=${text}`,
      };
    },
  },

  // GOOGLE KEEP
  google_keep: {
    id: 'google_keep',
    name: 'Google Keep',
    category: 'note_task',
    androidPackage: 'com.google.android.keep',
    intentAction: 'android.intent.action.SEND',
    dataScheme: 'https:',
    iconEmoji: '📝',
    brandColor: '#FBBC04',
    buildIntent: (ctx: EntityContext): AndroidIntentSpec => {
      const text = `${ctx.title}\n\n${ctx.summary}`;
      return {
        action: 'android.intent.action.SEND',
        dataUri: 'https://keep.google.com/',
        package: 'com.google.android.keep',
        extras: {
          'android.intent.extra.SUBJECT': ctx.title,
          'android.intent.extra.TEXT': text,
        },
        deepLinkUri: 'com.google.android.keep://',
        webFallbackUri: 'https://keep.google.com/',
      };
    },
  },

  // NOTION
  notion: {
    id: 'notion',
    name: 'Notion Workspace',
    category: 'note_task',
    androidPackage: 'notion.id',
    intentAction: 'android.intent.action.VIEW',
    dataScheme: 'notion:',
    iconEmoji: '📓',
    brandColor: '#191919',
    buildIntent: (ctx: EntityContext): AndroidIntentSpec => {
      return {
        action: 'android.intent.action.VIEW',
        dataUri: 'notion://',
        package: 'notion.id',
        extras: { title: ctx.title, text: ctx.summary },
        deepLinkUri: 'notion://',
        webFallbackUri: 'https://www.notion.so/',
      };
    },
  },
};

// -------------------------------------------------------------
// 2. ACTION ROUTER LOGIC LAYER
// -------------------------------------------------------------

export class ActionRouter {
  /**
   * Categorizes the detected entity from the structured output of `analyzeScreenshot`
   * and maps it to specific Android Intents, Deep Links, and suggested Action Providers.
   */
  static categorizeDetectedEntity(analysis: ScreenshotAnalysis): {
    entityType: DetectedEntityType;
    entityLabel: string;
    confidence: number;
    context: EntityContext;
  } {
    const e = analysis.entities;
    const cat = analysis.content_type;

    // A. JOB POSTING
    if (cat === 'job_vacancy' || Boolean(e.job_title) || (Boolean(e.emails?.length) && Boolean(e.company_or_merchant))) {
      return {
        entityType: 'job_posting',
        entityLabel: 'Job Vacancy & Recruitment Notice',
        confidence: analysis.confidence || 0.92,
        context: {
          entityType: 'job_posting',
          title: e.job_title || analysis.detected_title || 'Open Position',
          summary: analysis.summary,
          recipientEmail: e.emails?.[0] || 'recruitment@apexenergy-uae.com',
          rawEntities: e,
        },
      };
    }

    // B. PHYSICAL ADDRESS / VENUE
    if (e.location_or_venue || cat === 'location_place') {
      return {
        entityType: 'physical_address',
        entityLabel: 'Physical Location / Address',
        confidence: 0.95,
        context: {
          entityType: 'physical_address',
          title: analysis.detected_title || 'Detected Place',
          summary: analysis.summary,
          address: e.location_or_venue,
          rawEntities: e,
        },
      };
    }

    // C. PHONE NUMBER / CONTACT
    if (e.phones?.length || cat === 'contact_card') {
      const phone = e.phones?.[0] || '+1 (415) 890-4321';
      return {
        entityType: 'phone_number',
        entityLabel: 'Contact Details & Phone Number',
        confidence: 0.96,
        context: {
          entityType: 'phone_number',
          title: e.sender_or_speaker || analysis.detected_title || 'Contact',
          summary: analysis.summary,
          phoneNumber: phone,
          cleanPhone: phone.replace(/[^0-9+]/g, ''),
          recipientEmail: e.emails?.[0],
          rawEntities: e,
        },
      };
    }

    // D. EVENT SCHEDULE
    if (e.dates_or_deadlines || cat === 'event_poster') {
      return {
        entityType: 'event_schedule',
        entityLabel: 'Event, Webinar or Appointment',
        confidence: 0.94,
        context: {
          entityType: 'event_schedule',
          title: analysis.detected_title || 'Calendar Event',
          summary: analysis.summary,
          eventDates: e.dates_or_deadlines,
          venue: e.location_or_venue,
          rawEntities: e,
        },
      };
    }

    // E. FINANCIAL RECEIPT
    if (cat === 'receipt_invoice' || Boolean(e.line_items?.length) || (Boolean(e.prices_or_salary) && Boolean(e.company_or_merchant))) {
      return {
        entityType: 'financial_receipt',
        entityLabel: 'Store Receipt & Expense Invoice',
        confidence: 0.93,
        context: {
          entityType: 'financial_receipt',
          title: e.company_or_merchant || analysis.detected_title || 'Store Receipt',
          summary: analysis.summary,
          merchantName: e.company_or_merchant,
          totalAmount: e.prices_or_salary,
          rawEntities: e,
        },
      };
    }

    // F. TECHNICAL ERROR OR CODE
    if (cat === 'code_error') {
      return {
        entityType: 'code_or_technical',
        entityLabel: 'Terminal Error & Source Code Bug',
        confidence: 0.91,
        context: {
          entityType: 'code_or_technical',
          title: analysis.detected_title || 'Error Stack Trace',
          summary: analysis.summary,
          codeSnippet: analysis.ocr_text,
          rawEntities: e,
        },
      };
    }

    // G. SOCIAL MEDIA
    if (cat === 'chat_message' || cat === 'ui_design') {
      return {
        entityType: 'social_or_media',
        entityLabel: 'Conversational Message or Social Media',
        confidence: 0.89,
        context: {
          entityType: 'social_or_media',
          title: analysis.detected_title || 'Social / Chat Post',
          summary: analysis.summary,
          socialCopy: `${analysis.detected_title || 'Insight'}:\n${analysis.summary}`,
          rawEntities: e,
        },
      };
    }

    // H. GENERAL NOTE
    return {
      entityType: 'document_memo',
      entityLabel: 'General Document or Memo',
      confidence: 0.85,
      context: {
        entityType: 'document_memo',
        title: analysis.detected_title || 'Saved Note',
        summary: analysis.summary,
        rawEntities: e,
      },
    };
  }

  /**
   * Generates a concrete RoutedActionPlan mapping detected entities
   * to specific Android Intent specifications and prioritized Action Providers.
   */
  static planRoutedActions(analysis: ScreenshotAnalysis): RoutedActionPlan[] {
    const { entityType, entityLabel, confidence, context } = this.categorizeDetectedEntity(analysis);
    const plans: RoutedActionPlan[] = [];

    switch (entityType) {
      case 'job_posting': {
        const primary = ACTION_PROVIDERS.gmail;
        const alts = [ACTION_PROVIDERS.outlook, ACTION_PROVIDERS.linkedin];
        const intentSpec = primary.buildIntent(context);

        plans.push({
          id: 'route_job_application',
          entityType,
          entityLabel,
          confidence,
          explanation: `Identified recruitment notice for "${context.title}". Suggesting email dispatch via Gmail or Outlook with candidate cover letter.`,
          primaryTargetApp: primary,
          alternativeTargetApps: alts,
          intentSpec,
          dispatch: (chosen = primary) => {
            const spec = chosen.buildIntent(context);
            window.open(spec.webFallbackUri, '_blank', 'noopener,noreferrer');
            return {
              success: true,
              providerName: chosen.name,
              launchUri: spec.webFallbackUri,
            };
          },
        });
        break;
      }

      case 'physical_address': {
        const primary = ACTION_PROVIDERS.google_maps;
        const alts = [ACTION_PROVIDERS.waze];
        const intentSpec = primary.buildIntent(context);

        plans.push({
          id: 'route_navigation',
          entityType,
          entityLabel,
          confidence,
          explanation: `Detected venue address "${context.address}". Mapping to Google Maps navigation with Waze alternative.`,
          primaryTargetApp: primary,
          alternativeTargetApps: alts,
          intentSpec,
          dispatch: (chosen = primary) => {
            const spec = chosen.buildIntent(context);
            window.open(spec.webFallbackUri, '_blank', 'noopener,noreferrer');
            return {
              success: true,
              providerName: chosen.name,
              launchUri: spec.webFallbackUri,
            };
          },
        });
        break;
      }

      case 'phone_number': {
        const primary = ACTION_PROVIDERS.android_dialer;
        const alts = [ACTION_PROVIDERS.whatsapp, ACTION_PROVIDERS.telegram];
        const intentSpec = primary.buildIntent(context);

        plans.push({
          id: 'route_phone_contact',
          entityType,
          entityLabel,
          confidence,
          explanation: `Extracted telephone number "${context.phoneNumber}". Suggested dialer action with WhatsApp message alternative.`,
          primaryTargetApp: primary,
          alternativeTargetApps: alts,
          intentSpec,
          dispatch: (chosen = primary) => {
            const spec = chosen.buildIntent(context);
            if (chosen.id === 'android_dialer') {
              window.location.href = spec.dataUri;
            } else {
              window.open(spec.webFallbackUri, '_blank', 'noopener,noreferrer');
            }
            return {
              success: true,
              providerName: chosen.name,
              launchUri: spec.webFallbackUri,
            };
          },
        });
        break;
      }

      case 'event_schedule': {
        const primary = ACTION_PROVIDERS.google_calendar;
        const alts = [ACTION_PROVIDERS.google_keep];
        const intentSpec = primary.buildIntent(context);

        plans.push({
          id: 'route_calendar_event',
          entityType,
          entityLabel,
          confidence,
          explanation: `Event recognized on "${context.eventDates}". Scheduling into Google Calendar with location and notes.`,
          primaryTargetApp: primary,
          alternativeTargetApps: alts,
          intentSpec,
          dispatch: (chosen = primary) => {
            const spec = chosen.buildIntent(context);
            window.open(spec.webFallbackUri, '_blank', 'noopener,noreferrer');
            return {
              success: true,
              providerName: chosen.name,
              launchUri: spec.webFallbackUri,
            };
          },
        });
        break;
      }

      default: {
        const primary = ACTION_PROVIDERS.google_keep;
        const alts = [ACTION_PROVIDERS.notion, ACTION_PROVIDERS.x_twitter];
        const intentSpec = primary.buildIntent(context);

        plans.push({
          id: 'route_general_memo',
          entityType,
          entityLabel,
          confidence,
          explanation: `Saving structured summary of "${context.title}" to Google Keep or Notion workspace.`,
          primaryTargetApp: primary,
          alternativeTargetApps: alts,
          intentSpec,
          dispatch: (chosen = primary) => {
            const spec = chosen.buildIntent(context);
            navigator.clipboard.writeText(`${context.title}\n\n${context.summary}`);
            window.open(spec.webFallbackUri, '_blank', 'noopener,noreferrer');
            return {
              success: true,
              providerName: chosen.name,
              launchUri: spec.webFallbackUri,
            };
          },
        });
        break;
      }
    }

    return plans;
  }

  // -------------------------------------------------------------
  // 3. LEGACY ADAPTER (Seamless backward compatibility with UI)
  // -------------------------------------------------------------
  static routeActions(
    analysis: ScreenshotAnalysis,
    customPayloads?: {
      emailBody?: string;
      emailSubject?: string;
      customNote?: string;
      socialText?: string;
    }
  ): DispatchedIntentPayload[] {
    const payloads: DispatchedIntentPayload[] = [];
    const entities = analysis.entities;

    // EMAIL / JOB ROUTE
    const detectedEmail = entities.emails?.[0];
    if (detectedEmail || analysis.content_type === 'job_vacancy') {
      const recipient = detectedEmail || 'recruitment@apexenergy-uae.com';
      const subject =
        customPayloads?.emailSubject ||
        `Application - ${analysis.detected_title || entities.job_title || 'Position'} [SnapAction AI]`;
      const body =
        customPayloads?.emailBody ||
        `Dear Hiring Team,\n\nI am writing to express my interest in the ${
          analysis.detected_title || entities.job_title || 'open role'
        } at ${entities.company_or_merchant || 'your company'}.\n\nExtracted details from job announcement:\n${analysis.summary}\n\nPlease find my resume attached.\n\nBest regards,\nCandidate`;

      const compatibleApps = AppConnectivityRegistry.getAppsByCategory('email');

      payloads.push({
        category: 'email',
        actionTitle: 'Send Application / Inquiry Email',
        actionSubtitle: `Route via Gmail, Outlook, or Default Mail to ${recipient}`,
        compatibleApps,
        dataPreview: [
          { label: 'Recipient', value: recipient },
          { label: 'Subject', value: subject },
          { label: 'Body Length', value: `${body.length} characters` },
          { label: 'Target Apps', value: compatibleApps.map((a) => a.name).join(', ') },
        ],
        rawPayload: { recipient, subject, body },
        executeAction: (appId: string) => {
          let launchUrl = '';
          const encTo = encodeURIComponent(recipient);
          const encSub = encodeURIComponent(subject);
          const encBody = encodeURIComponent(body);

          if (appId === 'gmail') {
            launchUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encTo}&su=${encSub}&body=${encBody}`;
          } else if (appId === 'outlook') {
            launchUrl = `https://outlook.live.com/mail/0/deeplink/compose?to=${encTo}&subject=${encSub}&body=${encBody}`;
          } else {
            launchUrl = `mailto:${encTo}?subject=${encSub}&body=${encBody}`;
          }

          window.open(launchUrl, '_blank', 'noopener,noreferrer');
          return {
            launchUrl,
            executedDirectly: true,
            notes: `Launched ${appId} with recipient ${recipient}`,
          };
        },
      });
    }

    // NAVIGATION ROUTE
    const detectedLocation = entities.location_or_venue;
    if (detectedLocation || analysis.content_type === 'event_poster' || analysis.content_type === 'location_place') {
      const address = detectedLocation || 'Moscone West Center, 747 Howard St, San Francisco, CA';
      const compatibleApps = AppConnectivityRegistry.getAppsByCategory('navigation');

      payloads.push({
        category: 'navigation',
        actionTitle: 'Navigate to Location',
        actionSubtitle: `Turn-by-turn routing via Google Maps or Waze`,
        compatibleApps,
        dataPreview: [
          { label: 'Destination', value: address },
          { label: 'Compatible Apps', value: compatibleApps.map((a) => a.name).join(', ') },
          { label: 'Intent Scheme', value: 'geo: / google.navigation / waze' },
        ],
        rawPayload: { address },
        executeAction: (appId: string) => {
          let launchUrl = '';
          const encQuery = encodeURIComponent(address);

          if (appId === 'waze') {
            launchUrl = `https://waze.com/ul?q=${encQuery}`;
          } else {
            launchUrl = `https://www.google.com/maps/search/?api=1&query=${encQuery}`;
          }

          window.open(launchUrl, '_blank', 'noopener,noreferrer');
          return {
            launchUrl,
            executedDirectly: true,
            notes: `Dispatched navigation intent to ${appId} for ${address}`,
          };
        },
      });
    }

    // CALENDAR ROUTE
    const detectedDates = entities.dates_or_deadlines;
    if (detectedDates || analysis.content_type === 'event_poster') {
      const eventTitle = analysis.detected_title || 'AI Vision Congress 2026';
      const venue = entities.location_or_venue || 'San Francisco, CA';
      const eventSummary = analysis.summary;
      const compatibleApps = AppConnectivityRegistry.getAppsByCategory('calendar');

      payloads.push({
        category: 'calendar',
        actionTitle: 'Add to Calendar & Set Reminder',
        actionSubtitle: 'Schedule in Google Calendar, Outlook, or download .ICS',
        compatibleApps,
        dataPreview: [
          { label: 'Event Title', value: eventTitle },
          { label: 'Dates / Schedule', value: detectedDates || 'November 18-20, 2026' },
          { label: 'Location', value: venue },
        ],
        rawPayload: { eventTitle, detectedDates, venue, eventSummary },
        executeAction: (appId: string) => {
          let launchUrl = '';
          const encTitle = encodeURIComponent(eventTitle);
          const encVenue = encodeURIComponent(venue);
          const encDesc = encodeURIComponent(eventSummary);

          if (appId === 'google_calendar') {
            launchUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encTitle}&location=${encVenue}&details=${encDesc}`;
            window.open(launchUrl, '_blank', 'noopener,noreferrer');
          } else if (appId === 'outlook_calendar') {
            launchUrl = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encTitle}&location=${encVenue}&body=${encDesc}`;
            window.open(launchUrl, '_blank', 'noopener,noreferrer');
          } else {
            const icsContent = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//SnapAction AI//Mobile Applet//EN\nBEGIN:VEVENT\nSUMMARY:${eventTitle}\nLOCATION:${venue}\nDESCRIPTION:${eventSummary}\nEND:VEVENT\nEND:VCALENDAR`;
            const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
            launchUrl = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = launchUrl;
            a.download = `${eventTitle.replace(/\s+/g, '_')}.ics`;
            a.click();
          }

          return {
            launchUrl,
            executedDirectly: true,
            notes: `Calendar action scheduled via ${appId}`,
          };
        },
      });
    }

    // CONTACT ROUTE
    const detectedPhone = entities.phones?.[0];
    if (detectedPhone || analysis.content_type === 'contact_card') {
      const phoneNum = detectedPhone || '+1 (415) 890-4321';
      const cleanPhone = phoneNum.replace(/[^0-9+]/g, '');
      const compatibleApps = [
        ...AppConnectivityRegistry.getAppsByCategory('dialer_sms'),
        ...AppConnectivityRegistry.getAppsByCategory('messaging').filter(
          (a) => a.id === 'whatsapp' || a.id === 'telegram'
        ),
      ];

      payloads.push({
        category: 'dialer_sms',
        actionTitle: 'Contact Person or Business',
        actionSubtitle: 'Call via Android Dialer, send WhatsApp, or compose SMS',
        compatibleApps,
        dataPreview: [
          { label: 'Target Number', value: phoneNum },
          { label: 'Available Channels', value: 'Phone Call, WhatsApp, SMS Text, Telegram' },
        ],
        rawPayload: { phoneNum, cleanPhone },
        executeAction: (appId: string) => {
          let launchUrl = '';
          if (appId === 'android_dialer') {
            launchUrl = `tel:${cleanPhone}`;
            window.location.href = launchUrl;
          } else if (appId === 'whatsapp') {
            launchUrl = `https://wa.me/${cleanPhone.replace('+', '')}?text=${encodeURIComponent(
              `Hello! Connecting regarding: ${analysis.detected_title || analysis.summary}`
            )}`;
            window.open(launchUrl, '_blank', 'noopener,noreferrer');
          } else if (appId === 'telegram') {
            launchUrl = `https://t.me/share/url?url=${encodeURIComponent(
              `Hello from SnapAction AI: ${analysis.summary}`
            )}`;
            window.open(launchUrl, '_blank', 'noopener,noreferrer');
          } else {
            launchUrl = `sms:${cleanPhone}`;
            window.location.href = launchUrl;
          }

          return {
            launchUrl,
            executedDirectly: true,
            notes: `Dispatched contact intent to ${appId}`,
          };
        },
      });
    }

    // SOCIAL ROUTE
    const textToShare =
      customPayloads?.socialText ||
      `${analysis.detected_title || 'Interesting Insight'}:\n\n${analysis.summary}\n\n#AI #Technology #SnapAction`;
    const compatibleSocial = AppConnectivityRegistry.getAppsByCategory('social');

    payloads.push({
      category: 'social',
      actionTitle: 'Share to Social & Professional Networks',
      actionSubtitle: 'Publish directly to LinkedIn, X (Twitter), Threads, or Facebook',
      compatibleApps: compatibleSocial,
      dataPreview: [
        { label: 'Post Preview', value: textToShare.slice(0, 100) + '...' },
        { label: 'Supported Platforms', value: 'LinkedIn, X/Twitter, Threads, Facebook, Instagram' },
      ],
      rawPayload: { textToShare },
      executeAction: (appId: string) => {
        let launchUrl = '';
        const encText = encodeURIComponent(textToShare);
        navigator.clipboard.writeText(textToShare);

        if (appId === 'linkedin') {
          launchUrl = `https://www.linkedin.com/feed/?shareActive=true&text=${encText}`;
        } else if (appId === 'x_twitter') {
          launchUrl = `https://twitter.com/intent/tweet?text=${encText}`;
        } else if (appId === 'threads') {
          launchUrl = `https://threads.net/intent/post?text=${encText}`;
        } else if (appId === 'facebook') {
          launchUrl = `https://www.facebook.com/sharer/sharer.php?quote=${encText}&u=${encodeURIComponent(
            window.location.href
          )}`;
        } else {
          launchUrl = `https://www.instagram.com/`;
        }

        window.open(launchUrl, '_blank', 'noopener,noreferrer');
        return {
          launchUrl,
          executedDirectly: true,
          notes: `Copied text to clipboard and launched ${appId}`,
        };
      },
    });

    // NOTE & TASK APPS
    const compatibleNotes = AppConnectivityRegistry.getAppsByCategory('note_task');
    payloads.push({
      category: 'note_task',
      actionTitle: 'Save to Notes & Knowledge Base',
      actionSubtitle: 'Sync summary, OCR, and action items to Google Keep or Notion',
      compatibleApps: compatibleNotes,
      dataPreview: [
        { label: 'Title', value: analysis.detected_title || 'Screenshot Note' },
        { label: 'Note Summary', value: analysis.summary },
        { label: 'OCR Snippet', value: (analysis.ocr_text || '').slice(0, 80) + '...' },
      ],
      rawPayload: { summary: analysis.summary, ocr: analysis.ocr_text },
      executeAction: (appId: string) => {
        const fullNote = `# ${analysis.detected_title || 'Screenshot Note'}\n\n${
          analysis.summary
        }\n\n## Extracted OCR Text:\n${analysis.ocr_text || 'None'}\n\nTags: ${(
          analysis.tags || []
        ).join(', ')}`;

        navigator.clipboard.writeText(fullNote);

        let launchUrl = '';
        if (appId === 'google_keep') {
          launchUrl = 'https://keep.google.com/';
        } else if (appId === 'notion') {
          launchUrl = 'https://www.notion.so/';
        } else {
          launchUrl = 'https://www.onenote.com/';
        }

        window.open(launchUrl, '_blank', 'noopener,noreferrer');
        return {
          launchUrl,
          executedDirectly: true,
          notes: `Copied note to clipboard and opened ${appId}`,
        };
      },
    });

    return payloads;
  }
}
