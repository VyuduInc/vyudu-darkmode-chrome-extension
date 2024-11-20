export interface Settings {
  enabled: boolean;
  brightness: number;
  contrast: number;
  temperature: number;
  premium: boolean;
  siteSpecificSettings: Record<string, SiteSettings>;
}

export interface SiteSettings {
  enabled: boolean;
  brightness: number;
  contrast: number;
  temperature: number;
  mode: 'dynamic' | 'contrast' | 'gentle';
}

export interface Message {
  type: string;
  settings?: Settings;
}

export interface SubscriptionStatus {
  premium: boolean;
  plan?: 'monthly' | 'yearly' | 'lifetime';
  expiresAt?: string;
}