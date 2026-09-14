/**
 * Legacy agent runtime contracts. No app, plugin, or SDK consumes this
 * entry directly; the runtime interaction contracts live in plugin-sdk.
 * The whole entry (including `AgentRunEvent`, `AgentPermissionRequest`,
 * and `AgentInteractionPrompt`) is removed in 0.3.0; only the business
 * `RunStatus` (in `/zclaudia`) survives it.
 */

import type { OpaquePayload } from './core.js';
import type { RunStatus } from './zclaudia.js';

/**
 * @deprecated Compatibility alias for the business `RunStatus` defined in
 * `/zclaudia`. Removed together with this `/agent` entry in 0.3.0 — the
 * status set itself lives on as `RunStatus`.
 */
export type AgentRunStatus = RunStatus;

export type AgentRunEvent =
  | {
    type: 'run.started';
    runId: string;
    sessionId?: string;
    payload?: OpaquePayload;
  }
  | {
    type: 'run.delta';
    runId: string;
    sessionId?: string;
    payload: OpaquePayload;
  }
  | {
    type: 'run.completed';
    runId: string;
    sessionId?: string;
    payload?: OpaquePayload;
  }
  | {
    type: 'run.failed';
    runId: string;
    sessionId?: string;
    error?: string;
    payload?: OpaquePayload;
  }
  | {
    type: 'tool_call.started' | 'tool_call.delta' | 'tool_call.completed';
    runId: string;
    sessionId?: string;
    toolCallId: string;
    payload?: OpaquePayload;
  };

export interface AgentPermissionRequest {
  requestId: string;
  sessionId: string;
  toolName: string;
  detail: string;
  metadata?: Record<string, OpaquePayload>;
}

export interface AgentInteractionPrompt {
  interactionId: string;
  sessionId: string;
  title: string;
  fields: OpaquePayload[];
  metadata?: Record<string, OpaquePayload>;
}
