import type { AgentRunStatus } from './agent.js';
import type { OpaquePayload } from './core.js';

export interface ZClaudiaSessionResource {
  sessionId: string;
  projectId?: string;
  title?: string;
  createdAt: number;
  updatedAt: number;
  lastMessageAt?: number;
  lastMessagePreview?: string;
  runStatus: AgentRunStatus;
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
export type RunStatus = AgentRunStatus;
