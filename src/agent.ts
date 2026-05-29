import type { OpaquePayload } from './core.js';

export type AgentRunStatus = 'idle' | 'running' | 'waiting' | 'failed' | 'completed';

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
