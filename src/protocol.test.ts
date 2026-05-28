import { describe, expect, it } from 'vitest';
import type { BackendClientMessage } from './gateway.js';
import { DEFAULT_NOTIFICATION_CONFIG } from './notifications.js';

describe('@zclaudia/protocol', () => {
  it('keeps gateway app payloads opaque', () => {
    const message: BackendClientMessage = {
      type: 'backend_client_message',
      backendId: 'backend-1',
      message: { type: 'app_specific_message' },
    };

    expect(message.message).toEqual({ type: 'app_specific_message' });
  });

  it('exports notification defaults', () => {
    expect(DEFAULT_NOTIFICATION_CONFIG).toMatchObject({
      enabled: false,
      ntfyUrl: 'https://ntfy.sh',
      ntfyAuthMode: 'none',
    });
  });
});
