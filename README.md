# @zclaudia/protocol

ZClaudia business contracts shared across desktop, server, and SDKs: business
resource models, sync payloads, notification semantics, and this application's
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

## Migration notes for 0.3.0

The frozen compatibility entries removed in 0.3.0, and where their content
lives now:

- `@zclaudia/protocol/gateway` — gateway transport contracts moved to
  `@zclaudia/gateway-protocol` (protocol v4). The dead v3 wire names
  (`subscribe_backend`, `http_proxy_*`, stream demand, the legacy HTTP proxy
  frames, …) have no replacement: the v4 gateway never routed them.
- `@zclaudia/protocol/agent` — the legacy agent runtime contracts had no
  consumers; runtime interaction contracts live in plugin-sdk. The run
  status set survives unchanged as `RunStatus` in `/zclaudia`.

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
