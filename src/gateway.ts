/**
 * Gateway Sync Protocol — FROZEN compatibility entry (removal target 0.3.0).
 *
 * The canonical homes for everything that used to live here:
 * - Gateway transport contracts (handshake, registry, heartbeat, control
 *   plane, channels, topics, HTTP frames): `@zclaudia/gateway-protocol`.
 * - ZClaudia business sync payloads: `@zclaudia/protocol/sync`.
 * - ZClaudia topic names / channel kinds / namespace:
 *   `@zclaudia/protocol/transport`.
 *
 * This entry stays for pre-migration consumers only: no new types, no
 * evolution, no dependency on the gateway package (the two protocol packages
 * are independent). Every export below is either a deprecated alias of a
 * canonical definition or a frozen legacy declaration slated for removal.
 */

import type {
  GatewayNamespace,
  NamespaceProtocolVersion,
  OpaquePayload,
} from './core.js';
import type { GatewayNotificationEvent } from './notifications.js';
import type {
  BackendResourceEventMessage,
  BackendResourceSnapshotMessage,
  CatchUpContentMessage,
  ContentPatchErrorMessage,
  ContentPatchMessage,
} from './sync.js';

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

/** @deprecated v3 constant; the wire protocol is v4 only. Removed in 0.3.0. */
export const GATEWAY_PROTOCOL_VERSION = 3 as const;

// ============================================================================
// Peer Handshake Protocol (canonical: @zclaudia/gateway-protocol)
// ============================================================================

export interface PeerHelloMessage {
  type: 'peer_hello';
  protocolVersion: ProtocolVersion;
  namespace: GatewayNamespace;
  clientProtocolVersion: NamespaceProtocolVersion;
  /** @deprecated Dead field: the v4 gateway never reads it. Removed in 0.3.0. */
  minBackendProtocolVersion?: NamespaceProtocolVersion;
  peerType: 'client-only' | 'client+backend';
  /**
   * @deprecated Comment kept from the shared-secret era: the v4 gateway only
   * accepts issued credential tokens (zgd_/zgb_/zga_).
   */
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
// Backend Resource Protocol — canonical: `@zclaudia/protocol/sync`
// ============================================================================

/** @deprecated Migrated to `/sync`; kept until 0.3.0. */
export type {
  BackendResourceEventMessage,
  BackendResourceSnapshotMessage,
  CatchUpContentMessage,
  ContentPatchErrorMessage,
  ContentPatchMessage,
  GatewayResourceEnvelope,
} from './sync.js';

/** @deprecated Dead wire name: no gateway route and no active sender. Removed in 0.3.0. */
export interface RequestBackendResourceSnapshotMessage {
  type: 'request_backend_resource_snapshot';
  backendId: BackendId;
  resourceTypes?: string[];
  /** Optional requesting subscriber so the backend can send immediate state only to that peer. */
  targetPeerSessionId?: string;
}

// ============================================================================
// Backend Subscription Protocol — dead wire names (v3 fan-out era)
// ============================================================================

/** @deprecated Dead wire name: superseded by v4 topic_subscribe. Removed in 0.3.0. */
export interface SubscribeBackendMessage {
  type: 'subscribe_backend';
  backendId: BackendId;
}

/**
 * @deprecated Dead wire name. The process-local facade events of the same
 * name (`FacadeAdapterEvent`) are unrelated and stay.
 */
export interface BackendSubscribedMessage {
  type: 'backend_subscribed';
  backendId: BackendId;
  epoch: Epoch;
  capabilities: string[];
}

/** @deprecated Dead wire name: superseded by v4 topic_unsubscribe. Removed in 0.3.0. */
export interface UnsubscribeBackendMessage {
  type: 'unsubscribe_backend';
  backendId: BackendId;
}

/**
 * @deprecated Dead wire name. The process-local facade events of the same
 * name (`FacadeAdapterEvent`) are unrelated and stay.
 */
export interface BackendUnsubscribedMessage {
  type: 'backend_unsubscribed';
  backendId: BackendId;
  reason: 'client_unsubscribed' | 'backend_offline' | 'epoch_changed' | 'peer_disconnected';
}

/** @deprecated Dead wire name: replaced by v4 message channels. Removed in 0.3.0. */
export interface BackendClientMessage {
  type: 'backend_client_message';
  backendId: BackendId;
  /** Gateway fills this with the sender's peerSessionId for server-side client identity. */
  sourcePeerSessionId?: PeerSessionId;
  message: GatewayOpaqueMessage;
}

/**
 * Backend → Gateway → Client directed message (with `targetPeerSessionId`):
 * still routed by the v4 gateway as the targeted fallback. Canonical home:
 * `@zclaudia/gateway-protocol` (`message` is `unknown` there). Removed here in 0.3.0.
 */
export interface BackendServerMessage {
  type: 'backend_server_message';
  backendId: BackendId;
  /** If set, gateway routes to this specific client instead of broadcasting. */
  targetPeerSessionId?: PeerSessionId;
  message: GatewayOpaqueMessage;
}

/** @deprecated Dead wire name: never implemented by the current gateway. Removed in 0.3.0. */
export interface SubscriberDisconnectedMessage {
  type: 'subscriber_disconnected';
  backendId: BackendId;
  peerSessionId: PeerSessionId;
}

// ============================================================================
// Backend Stream and Content Patch Protocol
// ============================================================================


/** @deprecated Dead wire name: the v3 stream-demand negotiation is gone. Removed in 0.3.0. */
export interface StreamDemandMessage {
  type: 'backend_stream_demand';
  active: boolean;
}

/**
 * @deprecated Legacy top-level stream-event send shape. Unreachable in the
 * current server (`streamDemandActive` is permanently false); run events
 * travel over the v4 message channel. Receive path tracked separately
 * before any decision on re-homing. Removed in 0.3.0.
 */
export interface BackendStreamEvent {
  type: 'backend_stream_event';
  streamId: string;
  eventName: string;
  seq: Seq;
  channel?: string;
  payload: GatewayOpaqueMessage;
  metadata?: Record<string, GatewayOpaqueMessage>;
}

/**
 * @deprecated Legacy forwarded stream-event shape; see BackendStreamEvent.
 * Removed in 0.3.0.
 */
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

// ============================================================================
// Error Model (canonical: @zclaudia/gateway-protocol)
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
// Union Types (frozen; new code uses the direction unions of the gateway
// package and the canonical `/sync` payload types instead)
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
// HTTP Proxy Protocol — dead wire names (replaced by v4 HTTP-over-channel)
// ============================================================================

/** @deprecated Dead wire name: replaced by the v4 http channel frames. Removed in 0.3.0. */
export interface GatewayHttpProxyRequest {
  type: 'http_proxy_request';
  requestId: string;
  method: string;
  path: string;
  headers: Record<string, string>;
  bodyEncoding?: 'utf8' | 'base64';
  body?: unknown;
}

/** @deprecated Dead wire name: replaced by the v4 http channel frames. Removed in 0.3.0. */
export interface GatewayHttpProxyResponse {
  type: 'http_proxy_response';
  requestId: string;
  statusCode: number;
  headers: Record<string, string>;
  bodyEncoding: 'utf8' | 'base64';
  body: string;
}

/** @deprecated Dead wire name: replaced by the v4 http channel frames. Removed in 0.3.0. */
export interface GatewayHttpProxyResponseStart {
  type: 'http_proxy_response_start';
  requestId: string;
  statusCode: number;
  headers: Record<string, string>;
}

/** @deprecated Dead wire name: replaced by the v4 http channel frames. Removed in 0.3.0. */
export interface GatewayHttpProxyResponseChunk {
  type: 'http_proxy_response_chunk';
  requestId: string;
  data: string;
}

/** @deprecated Dead wire name: replaced by the v4 http channel frames. Removed in 0.3.0. */
export interface GatewayHttpProxyResponseEnd {
  type: 'http_proxy_response_end';
  requestId: string;
}
