import type { NotificationSeverity, OpaquePayload } from './core.js';

// Application-side notification contracts: ZClaudia event semantics and the
// user-facing configuration shape. The generic gateway push contract
// (`push_notification_request` wire message, gateway management DTO) lives in
// `@zclaudia/gateway-protocol/notifications`; `GatewayNotificationEvent` is
// structurally compatible with the gateway's push-event fields, so it adapts
// directly. The ntfy-specific config fields here mirror the gateway's
// management API as-is — a round-1 compatibility decision, to be re-cut when
// the gateway splits its public config DTO from internal storage.

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
