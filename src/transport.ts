/**
 * ZClaudia transport binding conventions — application-side names for the
 * gateway topics, channel kinds, and namespace this application uses.
 *
 * These are pure constants owned by ZClaudia; the gateway package does not
 * import them (the gateway treats topics and channel kinds as opaque
 * strings). Senders and receivers inside ZClaudia consume this single set.
 */

/** Namespace ZClaudia peers register under. */
export const ZCLAUDIA_NAMESPACE = 'zclaudia';

/** Topic carrying backend resource snapshots and incremental events. */
export const RESOURCES_TOPIC = 'resources';

/** Channel kind carrying ZClaudia business messages (the message channel). */
export const MESSAGE_CHANNEL_KIND = 'zclaudia';
