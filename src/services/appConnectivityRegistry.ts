import { AppConnection, AppCategory } from '../types';

export const DEFAULT_APP_CONNECTIONS: AppConnection[] = [
  // --- EMAIL APPS ---
  {
    id: 'gmail',
    name: 'Gmail',
    category: 'email',
    icon: 'mail',
    color: '#EA4335',
    badge: 'Popular',
    description: 'Compose emails, attach resumes, or prepare draft applications directly in Gmail.',
    packageScheme: 'googlegmail:///co',
    webFallbackUrl: 'https://mail.google.com/mail/?view=cm&fs=1',
    installed: true,
    isDefault: true,
  },
  {
    id: 'outlook',
    name: 'Microsoft Outlook',
    category: 'email',
    icon: 'mail',
    color: '#0078D4',
    description: 'Open in Outlook Mobile or Outlook Web with prefilled recipient and cover letter.',
    packageScheme: 'ms-outlook://compose',
    webFallbackUrl: 'https://outlook.live.com/mail/0/deeplink/compose',
    installed: true,
    isDefault: false,
  },
  {
    id: 'default_mail',
    name: 'Default Mail Client',
    category: 'email',
    icon: 'mail',
    color: '#64748B',
    description: 'System standard mailto intent dispatcher for Android.',
    packageScheme: 'mailto:',
    webFallbackUrl: 'mailto:',
    installed: true,
    isDefault: false,
  },

  // --- NAVIGATION APPS ---
  {
    id: 'google_maps',
    name: 'Google Maps',
    category: 'navigation',
    icon: 'map-pin',
    color: '#34A853',
    badge: 'Recommended',
    description: 'Turn-by-turn navigation, location reviews, and place details.',
    packageScheme: 'google.navigation:q=',
    webFallbackUrl: 'https://www.google.com/maps/search/?api=1&query=',
    installed: true,
    isDefault: true,
  },
  {
    id: 'waze',
    name: 'Waze',
    category: 'navigation',
    icon: 'navigation',
    color: '#33CCFF',
    description: 'Real-time crowdsourced traffic alerts and fastest navigation routing.',
    packageScheme: 'waze://?q=',
    webFallbackUrl: 'https://waze.com/ul?q=',
    installed: true,
    isDefault: false,
  },

  // --- MESSAGING & CHAT ---
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    category: 'messaging',
    icon: 'message-circle',
    color: '#25D366',
    badge: 'Universal',
    description: 'Send direct messages, smart replies, or forward extracted contacts.',
    packageScheme: 'whatsapp://send?text=',
    webFallbackUrl: 'https://wa.me/?text=',
    installed: true,
    isDefault: true,
  },
  {
    id: 'telegram',
    name: 'Telegram',
    category: 'messaging',
    icon: 'send',
    color: '#229ED9',
    description: 'Instant message dispatch to contacts, groups, or channels.',
    packageScheme: 'tg://msg?text=',
    webFallbackUrl: 'https://t.me/share/url?url=',
    installed: true,
    isDefault: false,
  },
  {
    id: 'slack',
    name: 'Slack',
    category: 'messaging',
    icon: 'hash',
    color: '#4A154B',
    description: 'Share code snippets, bugs, or dashboard KPIs directly to team channels.',
    packageScheme: 'slack://channel',
    webFallbackUrl: 'https://slack.com/app_redirect',
    installed: true,
    isDefault: false,
  },
  {
    id: 'teams',
    name: 'Microsoft Teams',
    category: 'messaging',
    icon: 'users',
    color: '#6264A7',
    description: 'Dispatch chat messages or meeting notes to enterprise Teams channels.',
    packageScheme: 'msteams://',
    webFallbackUrl: 'https://teams.microsoft.com/l/chat/0/0',
    installed: true,
    isDefault: false,
  },

  // --- CALENDAR & SCHEDULING ---
  {
    id: 'google_calendar',
    name: 'Google Calendar',
    category: 'calendar',
    icon: 'calendar',
    color: '#4285F4',
    badge: '1-Click Sync',
    description: 'Create events, add reminders, and set conference locations automatically.',
    packageScheme: 'content://com.android.calendar/time/',
    webFallbackUrl: 'https://calendar.google.com/calendar/render?action=TEMPLATE',
    installed: true,
    isDefault: true,
  },
  {
    id: 'outlook_calendar',
    name: 'Outlook Calendar',
    category: 'calendar',
    icon: 'calendar',
    color: '#0078D4',
    description: 'Schedule webinars and appointment deadlines into Microsoft 365 calendar.',
    packageScheme: 'ms-outlook://events',
    webFallbackUrl: 'https://outlook.live.com/calendar/0/deeplink/compose',
    installed: true,
    isDefault: false,
  },
  {
    id: 'ics_calendar',
    name: 'Device Calendar (.ICS file)',
    category: 'calendar',
    icon: 'download',
    color: '#6366F1',
    description: 'Universal iCalendar standard file importable into any phone calendar.',
    packageScheme: 'file://',
    webFallbackUrl: '',
    installed: true,
    isDefault: false,
  },

  // --- SOCIAL & PROFESSIONAL ---
  {
    id: 'linkedin',
    name: 'LinkedIn',
    category: 'social',
    icon: 'linkedin',
    color: '#0A66C2',
    badge: 'Career',
    description: 'Publish generated thought leadership posts or message job recruiters directly.',
    packageScheme: 'linkedin://shareArticle?mini=true',
    webFallbackUrl: 'https://www.linkedin.com/feed/?shareActive=true&text=',
    installed: true,
    isDefault: true,
  },
  {
    id: 'x_twitter',
    name: 'X (formerly Twitter)',
    category: 'social',
    icon: 'twitter',
    color: '#000000',
    description: 'Tweet high-impact hooks, AI breakdowns, or tech news threads.',
    packageScheme: 'twitter://post?message=',
    webFallbackUrl: 'https://twitter.com/intent/tweet?text=',
    installed: true,
    isDefault: false,
  },
  {
    id: 'threads',
    name: 'Threads by Instagram',
    category: 'social',
    icon: 'at-sign',
    color: '#101010',
    description: 'Post bite-sized commentary or visual summaries to your Threads feed.',
    packageScheme: 'barcelona://post?text=',
    webFallbackUrl: 'https://threads.net/intent/post?text=',
    installed: true,
    isDefault: false,
  },
  {
    id: 'instagram',
    name: 'Instagram',
    category: 'social',
    icon: 'instagram',
    color: '#E1306C',
    description: 'Copy generated carousel copy & hashtags, launch Instagram camera.',
    packageScheme: 'instagram://camera',
    webFallbackUrl: 'https://www.instagram.com/',
    installed: true,
    isDefault: false,
  },
  {
    id: 'facebook',
    name: 'Facebook',
    category: 'social',
    icon: 'facebook',
    color: '#1877F2',
    description: 'Share event updates, group announcements, or articles.',
    packageScheme: 'fb://publish',
    webFallbackUrl: 'https://www.facebook.com/sharer/sharer.php?quote=',
    installed: true,
    isDefault: false,
  },

  // --- NOTE & TASK APPS ---
  {
    id: 'google_keep',
    name: 'Google Keep',
    category: 'note_task',
    icon: 'check-square',
    color: '#FBBC04',
    badge: 'Fast',
    description: 'Instantly save quick notes, checklists, OCR text, and reminders.',
    packageScheme: 'com.google.android.keep://',
    webFallbackUrl: 'https://keep.google.com/',
    installed: true,
    isDefault: true,
  },
  {
    id: 'notion',
    name: 'Notion',
    category: 'note_task',
    icon: 'book-open',
    color: '#000000',
    description: 'Create organized workspace databases, study flashcards, or research docs.',
    packageScheme: 'notion://',
    webFallbackUrl: 'https://www.notion.so/',
    installed: true,
    isDefault: false,
  },
  {
    id: 'onenote',
    name: 'Microsoft OneNote',
    category: 'note_task',
    icon: 'file-text',
    color: '#7719AA',
    description: 'Sync extracted diagrams and meeting summaries to your notebook.',
    packageScheme: 'onenote://',
    webFallbackUrl: 'https://www.onenote.com/',
    installed: true,
    isDefault: false,
  },

  // --- CLOUD STORAGE ---
  {
    id: 'google_drive',
    name: 'Google Drive',
    category: 'cloud_storage',
    icon: 'hard-drive',
    color: '#0F9D58',
    description: 'Backup screenshots, tailored CV PDFs, and exported spreadsheets.',
    packageScheme: 'googledrive://',
    webFallbackUrl: 'https://drive.google.com/drive/my-drive',
    installed: true,
    isDefault: true,
  },
  {
    id: 'onedrive',
    name: 'Microsoft OneDrive',
    category: 'cloud_storage',
    icon: 'cloud',
    color: '#0078D4',
    description: 'Save documents and application packets to your Microsoft 365 cloud.',
    packageScheme: 'ms-onedrive://',
    webFallbackUrl: 'https://onedrive.live.com/',
    installed: true,
    isDefault: false,
  },
  {
    id: 'dropbox',
    name: 'Dropbox',
    category: 'cloud_storage',
    icon: 'box',
    color: '#0061FF',
    description: 'Upload exported expense reports and receipts to team folders.',
    packageScheme: 'dropbox://',
    webFallbackUrl: 'https://www.dropbox.com/home',
    installed: true,
    isDefault: false,
  },

  // --- PHONE & SMS (Native Intents) ---
  {
    id: 'android_dialer',
    name: 'Phone Dialer',
    category: 'dialer_sms',
    icon: 'phone',
    color: '#10B981',
    description: 'One-tap phone number dialing via native Android intent.',
    packageScheme: 'tel:',
    webFallbackUrl: 'tel:',
    installed: true,
    isDefault: true,
  },
  {
    id: 'android_sms',
    name: 'Messages (SMS)',
    category: 'dialer_sms',
    icon: 'message-square',
    color: '#3B82F6',
    description: 'Compose SMS messages with prefilled recipient and body text.',
    packageScheme: 'sms:',
    webFallbackUrl: 'sms:',
    installed: true,
    isDefault: false,
  },

  // --- SHOPPING & TRAVEL ---
  {
    id: 'amazon',
    name: 'Amazon',
    category: 'shopping_travel',
    icon: 'shopping-cart',
    color: '#FF9900',
    description: 'Search detected products, compare prices, or add to wishlist.',
    packageScheme: 'amazon://search?k=',
    webFallbackUrl: 'https://www.amazon.com/s?k=',
    installed: true,
    isDefault: true,
  },
  {
    id: 'linkedin_jobs',
    name: 'LinkedIn Jobs',
    category: 'shopping_travel',
    icon: 'briefcase',
    color: '#0A66C2',
    description: 'Search similar open job vacancies or view employer company page.',
    packageScheme: 'linkedin://jobs/search?keywords=',
    webFallbackUrl: 'https://www.linkedin.com/jobs/search/?keywords=',
    installed: true,
    isDefault: false,
  },
  {
    id: 'google_flights',
    name: 'Google Travel & Flights',
    category: 'shopping_travel',
    icon: 'plane',
    color: '#4285F4',
    description: 'Search flight reservations, hotel bookings, or tourist attractions.',
    packageScheme: 'https://www.google.com/travel/flights?q=',
    webFallbackUrl: 'https://www.google.com/travel/flights?q=',
    installed: true,
    isDefault: false,
  },
];

export class AppConnectivityRegistry {
  private static STORAGE_KEY = 'snapaction_connected_apps';

  static getConnectedApps(): AppConnection[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error loading app connections:', e);
    }
    return DEFAULT_APP_CONNECTIONS;
  }

  static saveConnectedApps(apps: AppConnection[]) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(apps));
    } catch (e) {
      console.error('Error saving app connections:', e);
    }
  }

  static getAppsByCategory(category: AppCategory): AppConnection[] {
    const apps = this.getConnectedApps();
    return apps.filter((a) => a.category === category && a.installed);
  }

  static getDefaultApp(category: AppCategory): AppConnection | undefined {
    const apps = this.getAppsByCategory(category);
    return apps.find((a) => a.isDefault) || apps[0];
  }

  static setDefaultApp(category: AppCategory, appId: string) {
    const apps = this.getConnectedApps().map((app) => {
      if (app.category === category) {
        return { ...app, isDefault: app.id === appId };
      }
      return app;
    });
    this.saveConnectedApps(apps);
  }

  static toggleAppInstalled(appId: string) {
    const apps = this.getConnectedApps().map((app) => {
      if (app.id === appId) {
        return { ...app, installed: !app.installed };
      }
      return app;
    });
    this.saveConnectedApps(apps);
  }

  static resetToDefaults() {
    this.saveConnectedApps(DEFAULT_APP_CONNECTIONS);
  }
}
