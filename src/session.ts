/**
 * FOUNDATION ONLY: an anonymous id kept in this browser so Keel works with
 * no sign-up. Replaced by Convex Auth in Phase 1 (see docs/ARCHITECTURE.md).
 */
const KEY = "keel.sessionId";

function getSessionId(): string {
  try {
    let id = localStorage.getItem(KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(KEY, id);
    }
    return id;
  } catch {
    return crypto.randomUUID();
  }
}

/** Stable for the life of the page. */
export const sessionId = getSessionId();
