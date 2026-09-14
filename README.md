# @zclaudia/protocol

ZClaudia business contracts shared across desktop, server, and SDKs: business
resource models, sync payloads, event semantics, and this application's
transport binding conventions. Gateway transport contracts (handshake,
control plane, channels, topics, HTTP frames) live in the independent
[`@zclaudia/gateway-protocol`](https://www.npmjs.com/package/@zclaudia/gateway-protocol)
package — the two protocol packages do not depend on each other.

## Entries

- `@zclaudia/protocol` — everything below re-exported.
- `@zclaudia/protocol/zclaudia` — business models (`SessionItem`,
  `ProjectItem`, `SessionMessage`, `RunStatus`).
- `@zclaudia/protocol/sync` — business sync payloads published over gateway
  topics/channels (`backend_resource_snapshot`, `backend_resource_event`,
  `catch_up_content`, `content_patch`, `content_patch_error`).
- `@zclaudia/protocol/transport` — ZClaudia binding conventions:
  namespace, `resources` topic, `zclaudia` channel kind.
- `@zclaudia/protocol/notifications` — application notification event
  semantics and user-facing config shape.
- `@zclaudia/protocol/core` — opaque payload and envelope primitives.
- `@zclaudia/protocol/gateway` — **frozen compatibility entry** for
  pre-migration consumers; removal target 0.3.0. New code imports the
  entries above (business) or `@zclaudia/gateway-protocol` (transport).
- `@zclaudia/protocol/agent` — frozen legacy agent contracts without
  consumers; removal target 0.3.0 (`RunStatus` lives in `/zclaudia`).

## Install

```bash
npm install @zclaudia/protocol
```

## Usage

```ts
import type { SessionItem } from '@zclaudia/protocol/zclaudia';
import type { BackendResourceEventMessage } from '@zclaudia/protocol/sync';
import { RESOURCES_TOPIC, MESSAGE_CHANNEL_KIND } from '@zclaudia/protocol/transport';
```

## License

MIT
