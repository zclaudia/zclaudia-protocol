/**
 * ZClaudia business sync contracts — the canonical home.
 *
 * Resource snapshots, incremental events, and content catch-up travel as
 * opaque payloads inside gateway Topic messages / message channels; the
 * gateway never interprets them. Wire names are kept verbatim from the
 * legacy `/gateway` entry, including the historical `backend_` prefixes.
 */

import type { GatewayNamespace, OpaquePayload } from './core.js';

// Scalar aliases (BackendId/Epoch/Offset/Seq/…) remain exported by the
// frozen `/gateway` entry; this canonical entry adds no conflicting names.

// ============================================================================
// Resource envelope
// ============================================================================

export interface GatewayResourceEnvelope {
  resourceType: string;
  resourceId: string;
  resource: OpaquePayload;
  updatedAt?: number;
  metadata?: Record<string, OpaquePayload>;
}

// ============================================================================
// Snapshot & incremental events (payload of the `resources` topic)
// ============================================================================

/** Backend → clients, via the `resources` topic: full resource snapshot. */
export interface BackendResourceSnapshotMessage {
  type: 'backend_resource_snapshot';
  namespace?: GatewayNamespace;
  /** Set when relayed inside a topic message; absent at the publisher. */
  backendId?: string;
  resources: GatewayResourceEnvelope[];
}

/** Backend → clients, via the `resources` topic: incremental data event. */
export interface BackendResourceEventMessage {
  type: 'backend_resource_event';
  namespace?: GatewayNamespace;
  backendId?: string;
  op: 'upsert' | 'remove';
  resourceType: string;
  resourceId: string;
  resource?: OpaquePayload;
  updatedAt?: number;
  metadata?: Record<string, OpaquePayload>;
}

// ============================================================================
// Content catch-up (payload of the zclaudia message channel)
// ============================================================================

/** Client → backend, over the message channel: request content after an offset. */
export interface CatchUpContentMessage {
  type: 'catch_up_content';
  backendId: string;
  contentStreamId: string;
  afterOffset: number;
}

/** Backend → client, over the message channel: content patch reply. */
export interface ContentPatchMessage {
  type: 'content_patch';
  backendId: string;
  contentStreamId: string;
  patches: OpaquePayload[];
  latestOffset: number;
  metadata?: Record<string, OpaquePayload>;
}

/** Backend → client, over the message channel: catch-up failure reply. */
export interface ContentPatchErrorMessage {
  type: 'content_patch_error';
  backendId: string;
  contentStreamId: string;
  afterOffset: number;
  message: string;
}
