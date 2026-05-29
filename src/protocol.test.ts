import { describe, expect, it } from 'vitest';
import type {
  BackendClientMessage,
  BackendResourceEventMessage,
  BackendStreamEvent,
  PeerHelloMessage,
  PushNotificationRequestMessage,
} from './gateway.js';
import { DEFAULT_NOTIFICATION_CONFIG } from './notifications.js';
import type { AgentRunEvent } from './agent.js';
import type { ZClaudiaSessionResource } from './zclaudia.js';

describe('@zclaudia/protocol', () => {
  it('keeps gateway app payloads opaque', () => {
    const message: BackendClientMessage = {
      type: 'backend_client_message',
      backendId: 'backend-1',
      message: { type: 'app_specific_message' },
    };

    expect(message.message).toEqual({ type: 'app_specific_message' });
  });

  it('models gateway handshakes with namespace and compatibility versions', () => {
    const hello: PeerHelloMessage = {
      type: 'peer_hello',
      protocolVersion: 3,
      namespace: 'zclaudia',
      clientProtocolVersion: 1,
      gatewaySecret: 'secret',
      peerType: 'client+backend',
      identity: {
        deviceId: 'device-1',
        instanceId: 'instance-1',
      },
      backend: {
        visible: true,
        capabilities: ['resource-sync', 'stream'],
        backendProtocolVersion: 1,
        minClientProtocolVersion: 1,
      },
    };

    expect(hello.namespace).toBe('zclaudia');
    expect(hello.backend?.backendProtocolVersion).toBe(1);
  });

  it('keeps gateway stream and resource envelopes app-neutral', () => {
    const stream: BackendStreamEvent = {
      type: 'backend_stream_event',
      streamId: 'run-1',
      eventName: 'zclaudia.run.delta',
      seq: 1,
      channel: 'session-1',
      payload: { text: 'hello' },
    };
    const resourceEvent: BackendResourceEventMessage = {
      type: 'backend_resource_event',
      namespace: 'zclaudia',
      op: 'upsert',
      resourceType: 'session',
      resourceId: 'session-1',
      resource: { title: 'Session' },
    };

    expect(stream.eventName).toBe('zclaudia.run.delta');
    expect(resourceEvent.resource).toEqual({ title: 'Session' });
  });

  it('uses generic notification events and filters', () => {
    const request: PushNotificationRequestMessage = {
      type: 'push_notification_request',
      event: {
        name: 'zclaudia.run.failed',
        category: 'run',
        severity: 'error',
        title: 'Run failed',
        body: 'The run failed.',
        tags: ['run', 'error'],
      },
    };

    expect(DEFAULT_NOTIFICATION_CONFIG).toMatchObject({
      enabled: false,
      ntfyUrl: 'https://ntfy.sh',
      ntfyAuthMode: 'none',
      eventAllowlist: [],
      eventDenylist: [],
    });
    expect(request.event.name).toBe('zclaudia.run.failed');
  });

  it('keeps zclaudia-specific concepts outside gateway types', () => {
    const runEvent: AgentRunEvent = {
      type: 'run.completed',
      runId: 'run-1',
      sessionId: 'session-1',
    };
    const session: ZClaudiaSessionResource = {
      sessionId: 'session-1',
      runStatus: 'completed',
      createdAt: 1,
      updatedAt: 2,
    };

    expect(runEvent.type).toBe('run.completed');
    expect(session.runStatus).toBe('completed');
  });
});
