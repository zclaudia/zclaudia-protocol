import type { NotificationSeverity, OpaquePayload } from './core.js';

// Generic push notification protocol and configuration shared by gateway clients.

export type { NotificationSeverity } from './core.js';

export interface GatewayNotificationEvent {
  name: string;
  category?: string;
  severity?: NotificationSeverity;
  title: string;
  body: string;
  tags?: string[];
  clickUrl?: string;
  metadata?: Record<string, OpaquePayload>;
}

export type NotificationAuthMode = 'none' | 'bearer' | 'basic';

export interface NotificationConfig {
  enabled: boolean;
  ntfyUrl: string;
  ntfyTopic: string;
  ntfyAuthMode: NotificationAuthMode;
  ntfyPublishToken: string;
  ntfySubscribeToken: string;
  ntfyUsername: string;
  ntfyPassword: string;
  eventAllowlist: string[];
  eventDenylist: string[];
  minSeverity?: NotificationSeverity;
}

export const DEFAULT_NOTIFICATION_CONFIG: NotificationConfig = {
  enabled: false,
  ntfyUrl: 'https://ntfy.sh',
  ntfyTopic: '',
  ntfyAuthMode: 'none',
  ntfyPublishToken: '',
  ntfySubscribeToken: '',
  ntfyUsername: '',
  ntfyPassword: '',
  eventAllowlist: [],
  eventDenylist: [],
};
