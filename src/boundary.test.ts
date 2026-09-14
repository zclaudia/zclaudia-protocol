import { describe, expect, it } from 'vitest';
import type {
  BackendResourceSnapshotMessage,
  CatchUpContentMessage,
  ContentPatchMessage,
} from './sync.js';
import { MESSAGE_CHANNEL_KIND, RESOURCES_TOPIC, ZCLAUDIA_NAMESPACE } from './transport.js';
import type { RunStatus } from './zclaudia.js';

describe('@zclaudia/protocol boundary', () => {
  it('preserves the sync wire names, including the historical backend_ prefixes', () => {
    const snapshot: BackendResourceSnapshotMessage = {
      type: 'backend_resource_snapshot',
      namespace: 'zclaudia',
      resources: [
        { resourceType: 'session', resourceId: 's1', resource: { title: 'Session' } },
      ],
    };
    const catchUp: CatchUpContentMessage = {
      type: 'catch_up_content',
      backendId: 'backend-1',
      contentStreamId: 'session-1',
      afterOffset: 42,
    };
    const patch: ContentPatchMessage = {
      type: 'content_patch',
      backendId: 'backend-1',
      contentStreamId: 'session-1',
      patches: [{ role: 'assistant' }],
      latestOffset: 43,
    };

    expect(snapshot.type).toBe('backend_resource_snapshot');
    expect(catchUp.type).toBe('catch_up_content');
    expect(patch.type).toBe('content_patch');
    expect(patch.latestOffset).toBe(43);
  });

  it('owns the ZClaudia transport binding constants', () => {
    expect(ZCLAUDIA_NAMESPACE).toBe('zclaudia');
    expect(RESOURCES_TOPIC).toBe('resources');
    expect(MESSAGE_CHANNEL_KIND).toBe('zclaudia');
  });

  it('keeps the RunStatus set stable', () => {
    const statuses: RunStatus[] = ['idle', 'running', 'waiting', 'failed', 'completed'];
    const session: { runStatus: RunStatus } = { runStatus: 'waiting' };
    expect(statuses).toContain(session.runStatus);
    expect(statuses).toHaveLength(5);
  });
});
