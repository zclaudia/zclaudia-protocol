import { describe, expect, it } from 'vitest';
import type { BackendResourceEventMessage } from './sync.js';
import { DEFAULT_NOTIFICATION_CONFIG, type GatewayNotificationEvent } from './notifications.js';
import type { ZClaudiaSessionResource } from './zclaudia.js';

describe('@zclaudia/protocol', () => {
  it('keeps sync resource payloads opaque', () => {
    const resourceEvent: BackendResourceEventMessage = {
      type: 'backend_resource_event',
      namespace: 'zclaudia',
      op: 'upsert',
      resourceType: 'session',
      resourceId: 'session-1',
      resource: { title: 'Session' },
    };

    expect(resourceEvent.resource).toEqual({ title: 'Session' });
  });

  it('uses application notification events and defaults', () => {
    const event: GatewayNotificationEvent = {
      name: 'zclaudia.run.failed',
      category: 'run',
      severity: 'error',
      title: 'Run failed',
      body: 'The run failed.',
      tags: ['run', 'error'],
    };

    expect(DEFAULT_NOTIFICATION_CONFIG).toMatchObject({
      enabled: false,
      ntfyUrl: 'https://ntfy.sh',
      ntfyAuthMode: 'none',
      eventAllowlist: [],
      eventDenylist: [],
    });
    expect(event.name).toBe('zclaudia.run.failed');
  });

  it('keeps zclaudia business models application-owned', () => {
    const session: ZClaudiaSessionResource = {
      sessionId: 'session-1',
      runStatus: 'completed',
      createdAt: 1,
      updatedAt: 2,
    };

    expect(session.runStatus).toBe('completed');
  });
});
