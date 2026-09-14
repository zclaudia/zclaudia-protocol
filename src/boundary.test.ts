import { describe, expect, it } from 'vitest';
import type { BackendResourceSnapshotMessage as BackendResourceSnapshotMessageSync } from './sync.js';
import {
  MESSAGE_CHANNEL_KIND,
  RESOURCES_TOPIC,
  ZCLAUDIA_NAMESPACE,
} from './transport.js';
import type { RunStatus } from './zclaudia.js';
import type {
  BackendResourceSnapshotMessage,
  CatchUpContentMessage,
  ContentPatchMessage,
} from './gateway.js';
// The gateway entry re-exports the canonical /sync definitions under their
// historical names; these imports must stay assignable in both directions.
import type {
  CatchUpContentMessage as CatchUpContentMessageSync,
  ContentPatchMessage as ContentPatchMessageSync,
} from './sync.js';

describe('@zclaudia/protocol boundary', () => {
  it('keeps the /gateway business aliases identical to the canonical /sync definitions', () => {
    const snapshot: BackendResourceSnapshotMessageSync = {
      type: 'backend_resource_snapshot',
      namespace: 'zclaudia',
      resources: [
        { resourceType: 'session', resourceId: 's1', resource: { title: 'Session' } },
      ],
    };

    // Same symbol via the frozen alias…
    const viaCompat: BackendResourceSnapshotMessage = snapshot;
    expect(viaCompat.type).toBe('backend_resource_snapshot');

    // …and assignable back (single canonical definition, two names until 0.3.0).
    const canonical: BackendResourceSnapshotMessageSync = viaCompat;
    expect(canonical.resources[0].resourceId).toBe('s1');
  });

  it('preserves the sync wire names, including the historical backend_ prefixes', () => {
    const catchUp: CatchUpContentMessageSync = {
      type: 'catch_up_content',
      backendId: 'backend-1',
      contentStreamId: 'session-1',
      afterOffset: 42,
    };
    const patch: ContentPatchMessageSync = {
      type: 'content_patch',
      backendId: 'backend-1',
      contentStreamId: 'session-1',
      patches: [{ role: 'assistant' }],
      latestOffset: 43,
    };

    const compatCatchUp: CatchUpContentMessage = catchUp;
    const compatPatch: ContentPatchMessage = patch;
    expect(compatCatchUp.type).toBe('catch_up_content');
    expect(compatPatch.type).toBe('content_patch');
    expect(patch.latestOffset).toBe(43);
  });

  it('owns the ZClaudia transport binding constants', () => {
    expect(ZCLAUDIA_NAMESPACE).toBe('zclaudia');
    expect(RESOURCES_TOPIC).toBe('resources');
    expect(MESSAGE_CHANNEL_KIND).toBe('zclaudia');
  });

  it('keeps the RunStatus set unchanged after moving it out of /agent', () => {
    const statuses: RunStatus[] = ['idle', 'running', 'waiting', 'failed', 'completed'];
    const session: { runStatus: RunStatus } = { runStatus: 'waiting' };
    expect(statuses).toContain(session.runStatus);
    expect(statuses).toHaveLength(5);
  });
});
