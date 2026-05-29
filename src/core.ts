export type OpaquePayload = unknown;

export type GatewayNamespace = string;

export type NamespaceProtocolVersion = number;

export type NotificationSeverity = 'info' | 'success' | 'warning' | 'error';

export interface ResourceEnvelope {
  resourceType: string;
  resourceId: string;
  resource: OpaquePayload;
  metadata?: Record<string, OpaquePayload>;
}

export interface StreamEnvelope {
  streamId: string;
  eventName: string;
  seq: number;
  payload: OpaquePayload;
  channel?: string;
  metadata?: Record<string, OpaquePayload>;
}
