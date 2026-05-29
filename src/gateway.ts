/**
 * Gateway Sync Protocol
 *
 * The gateway is a relay and should not depend on app-specific client/server
 * message unions. Those embedded payloads stay opaque at this boundary.
 */
import type {
  GatewayNamespace,
  NamespaceProtocolVersion,
  OpaquePayload,
} from './core.js';
import type { GatewayNotificationEvent } from './notifications.js';

// ============================================================================
// Core Types
// ============================================================================

export type ProtocolVersion = number;
export type PeerSessionId = string;
export type RecoveryToken = string;
export type BackendId = string;
export type Epoch = number;
export type Offset = number;
export type Seq = number;
export type GatewayOpaqueMessage = OpaquePayload;

export { GatewayNamespace, NamespaceProtocolVersion } from './core.js';

export const GATEWAY_PROTOCOL_VERSION = 3 as const;

// ============================================================================
// Peer Handshake Protocol
// ============================================================================

export interface PeerHelloMessage {
  type: 'peer_hello';
  protocolVersion: ProtocolVersion;
  namespace: GatewayNamespace;
  clientProtocolVersion: NamespaceProtocolVersion;
  minBackendProtocolVersion?: NamespaceProtocolVersion;
  peerType: 'client-only' | 'client+backend';
  gatewaySecret: string;
  identity: {
    deviceId: string;
    instanceId: string;
    channel?: string;
    name?: string;
  };
  backend?: {
    visible: boolean;
    capabilities: string[];
    backendProtocolVersion: NamespaceProtocolVersion;
    minClientProtocolVersion?: NamespaceProtocolVersion;
  };
}

export interface PeerReadyMessage {
  type: 'peer_ready';
  protocolVersion: ProtocolVersion;
  peerSessionId: PeerSessionId;
  recoveryToken: RecoveryToken;
  backend?: {
    backendId: BackendId;
    epoch: Epoch;
    leaseTtlMs: number;
  };
  registrySync: RegistrySyncPayload;
}

export interface RegistrySyncPayload {
  items: BackendPresence[];
}

// ============================================================================
// Registry Protocol
// ============================================================================

export interface BackendPresence {
  namespace: GatewayNamespace;
  backendId: BackendId;
  instanceId: string;
  deviceId: string;
  name: string;
  channel: string;
  visible: boolean;
  capabilities: string[];
  backendProtocolVersion: NamespaceProtocolVersion;
  minClientProtocolVersion?: NamespaceProtocolVersion;
  epoch: Epoch;
  connectedAt: number;
  lastSeenAt: number;
}

/** Client requests an immediate full registry snapshot, for example on mobile resume. */
export interface RequestRegistrySnapshotMessage {
  type: 'request_registry_snapshot';
}

export interface RegistrySnapshotMessage {
  type: 'registry_snapshot';
  items: BackendPresence[];
}

// ============================================================================
// Backend Lease and Heartbeat
// ============================================================================

export interface BackendHeartbeatMessage {
  type: 'backend_heartbeat';
  epoch: Epoch;
  observedAt: number;
}

export interface HeartbeatAckMessage {
  type: 'heartbeat_ack';
  epoch: Epoch;
  streamDemand: boolean;
}

// ============================================================================
// Backend Resource Protocol
// ============================================================================

export interface GatewayResourceEnvelope {
  resourceType: string;
  resourceId: string;
  resource: GatewayOpaqueMessage;
  updatedAt?: number;
  metadata?: Record<string, GatewayOpaqueMessage>;
}

/** Backend -> Gateway -> Client: full resource snapshot. */
export interface BackendResourceSnapshotMessage {
  type: 'backend_resource_snapshot';
  namespace?: GatewayNamespace;
  /** Set by gateway when relaying to clients. Absent when backend sends to gateway. */
  backendId?: BackendId;
  resources: GatewayResourceEnvelope[];
}

/** Backend -> Gateway -> Client: incremental data event. */
export interface BackendResourceEventMessage {
  type: 'backend_resource_event';
  namespace?: GatewayNamespace;
  backendId?: BackendId;
  op: 'upsert' | 'remove';
  resourceType: string;
  resourceId: string;
  resource?: GatewayOpaqueMessage;
  updatedAt?: number;
  metadata?: Record<string, GatewayOpaqueMessage>;
}

/** Client -> Gateway -> Backend: request immediate resource snapshot. */
export interface RequestBackendResourceSnapshotMessage {
  type: 'request_backend_resource_snapshot';
  backendId: BackendId;
  resourceTypes?: string[];
  /** Optional requesting subscriber so the backend can send immediate state only to that peer. */
  targetPeerSessionId?: string;
}

// ============================================================================
// Backend Subscription Protocol
// ============================================================================

export interface SubscribeBackendMessage {
  type: 'subscribe_backend';
  backendId: BackendId;
}

export interface BackendSubscribedMessage {
  type: 'backend_subscribed';
  backendId: BackendId;
  epoch: Epoch;
  capabilities: string[];
}

export interface UnsubscribeBackendMessage {
  type: 'unsubscribe_backend';
  backendId: BackendId;
}

export interface BackendUnsubscribedMessage {
  type: 'backend_unsubscribed';
  backendId: BackendId;
  reason: 'client_unsubscribed' | 'backend_offline' | 'epoch_changed' | 'peer_disconnected';
}

export interface BackendClientMessage {
  type: 'backend_client_message';
  backendId: BackendId;
  /** Gateway fills this with the sender's peerSessionId for server-side client identity. */
  sourcePeerSessionId?: PeerSessionId;
  message: GatewayOpaqueMessage;
}

export interface BackendServerMessage {
  type: 'backend_server_message';
  backendId: BackendId;
  /** If set, gateway routes to this specific client instead of broadcasting. */
  targetPeerSessionId?: PeerSessionId;
  message: GatewayOpaqueMessage;
}

/** Gateway -> Backend: a subscriber disconnected; backend should clean up its server-side state. */
export interface SubscriberDisconnectedMessage {
  type: 'subscriber_disconnected';
  backendId: BackendId;
  peerSessionId: PeerSessionId;
}

// ============================================================================
// Backend Stream and Content Patch Protocol
// ============================================================================

export interface StreamDemandMessage {
  type: 'backend_stream_demand';
  active: boolean;
}

/** Backend -> Gateway: stream event from backend, gateway adds backendId when forwarding. */
export interface BackendStreamEvent {
  type: 'backend_stream_event';
  streamId: string;
  eventName: string;
  seq: Seq;
  channel?: string;
  payload: GatewayOpaqueMessage;
  metadata?: Record<string, GatewayOpaqueMessage>;
}

/** Gateway -> Client: stream event forwarded to subscribers. */
export interface GatewayStreamEvent {
  type: 'backend_stream_event';
  backendId: BackendId;
  streamId: string;
  eventName: string;
  seq: Seq;
  channel?: string;
  payload: GatewayOpaqueMessage;
  metadata?: Record<string, GatewayOpaqueMessage>;
}

export interface CatchUpContentMessage {
  type: 'catch_up_content';
  backendId: BackendId;
  contentStreamId: string;
  afterOffset: Offset;
}

export interface ContentPatchMessage {
  type: 'content_patch';
  backendId: BackendId;
  contentStreamId: string;
  patches: GatewayOpaqueMessage[];
  latestOffset: Offset;
  metadata?: Record<string, GatewayOpaqueMessage>;
}

export interface ContentPatchErrorMessage {
  type: 'content_patch_error';
  backendId: BackendId;
  contentStreamId: string;
  afterOffset: Offset;
  message: string;
}

// ============================================================================
// Error Model
// ============================================================================

export type GatewayErrorCode =
  | 'INVALID_MESSAGE'
  | 'PROTOCOL_VERSION_MISMATCH'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN_NAMESPACE'
  | 'INCOMPATIBLE_PROTOCOL_VERSION'
  | 'BACKEND_OFFLINE'
  | 'BACKEND_NOT_SUBSCRIBED'
  | 'RESOURCE_NOT_FOUND'
  | 'STREAM_GAP_DETECTED'
  | 'RATE_LIMITED';

export type GatewayErrorRecovery =
  | 'resubscribe'
  | 'catch_up_content'
  | 'reconnect';

export interface GatewayErrorMessage {
  type: 'gateway_error';
  code: GatewayErrorCode;
  message: string;
  recovery?: GatewayErrorRecovery;
}

// ============================================================================
// Push Notification (backend -> gateway only)
// ============================================================================

export interface PushNotificationRequestMessage {
  type: 'push_notification_request';
  namespace?: GatewayNamespace;
  event: GatewayNotificationEvent;
}

// ============================================================================
// Union Types
// ============================================================================

export type BackendToGatewayMessage =
  | PeerHelloMessage
  | RequestRegistrySnapshotMessage
  | BackendHeartbeatMessage
  | BackendResourceSnapshotMessage
  | BackendResourceEventMessage
  | BackendServerMessage
  | BackendStreamEvent
  | ContentPatchMessage
  | ContentPatchErrorMessage
  | PushNotificationRequestMessage;

export type GatewayToBackendMessage =
  | PeerReadyMessage
  | RegistrySnapshotMessage
  | HeartbeatAckMessage
  | StreamDemandMessage
  | BackendClientMessage
  | RequestBackendResourceSnapshotMessage
  | SubscriberDisconnectedMessage
  | GatewayErrorMessage;

export type ClientToGatewayMessage =
  | PeerHelloMessage
  | RequestRegistrySnapshotMessage
  | SubscribeBackendMessage
  | UnsubscribeBackendMessage
  | BackendClientMessage
  | RequestBackendResourceSnapshotMessage
  | CatchUpContentMessage;

// ============================================================================
// HTTP Proxy Protocol (shared between gateway server and backend)
// ============================================================================

export interface GatewayHttpProxyRequest {
  type: 'http_proxy_request';
  requestId: string;
  method: string;
  path: string;
  headers: Record<string, string>;
  bodyEncoding?: 'utf8' | 'base64';
  body?: unknown;
}

export interface GatewayHttpProxyResponse {
  type: 'http_proxy_response';
  requestId: string;
  statusCode: number;
  headers: Record<string, string>;
  bodyEncoding: 'utf8' | 'base64';
  body: string;
}

export interface GatewayHttpProxyResponseStart {
  type: 'http_proxy_response_start';
  requestId: string;
  statusCode: number;
  headers: Record<string, string>;
}

export interface GatewayHttpProxyResponseChunk {
  type: 'http_proxy_response_chunk';
  requestId: string;
  data: string;
}

export interface GatewayHttpProxyResponseEnd {
  type: 'http_proxy_response_end';
  requestId: string;
}
