import type { OpaquePayload } from './core.js';

/** Lifecycle of a ZClaudia run as published in session resources. */
export type RunStatus = 'idle' | 'running' | 'waiting' | 'failed' | 'completed';

export interface ZClaudiaSessionResource {
  sessionId: string;
  projectId?: string;
  title?: string;
  createdAt: number;
  updatedAt: number;
  lastMessageAt?: number;
  lastMessagePreview?: string;
  runStatus: RunStatus;
  archived?: boolean;
}

export interface ZClaudiaProjectResource {
  projectId: string;
  name: string;
  createdAt: number;
  updatedAt: number;
}

export interface ZClaudiaSessionMessage {
  messageId: string;
  sessionId: string;
  offset: number;
  role: 'user' | 'assistant' | 'system' | 'tool';
  createdAt: number;
  content: OpaquePayload;
}

export type SessionItem = ZClaudiaSessionResource;
export type ProjectItem = ZClaudiaProjectResource;
export type SessionMessage = ZClaudiaSessionMessage;
