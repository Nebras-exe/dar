/**
 * A tiny `localStorage`-backed external store for `useSyncExternalStore`.
 *
 * Using an external-store subscription (rather than a load-in-`useEffect`) is
 * the idiomatic way to read persisted state: no synchronous `setState` in an
 * effect, no hydration warning (the server snapshot is the fallback), and
 * cross-tab updates come free via the `storage` event. `getSnapshot` caches by
 * the raw string so it returns a stable reference between renders.
 */

export interface PersistentStore<T> {
  subscribe: (cb: () => void) => () => void;
  getSnapshot: () => T;
  getServerSnapshot: () => T;
  get: () => T;
  set: (next: T) => void;
}

export function createPersistentStore<T>(
  key: string,
  fallback: T,
  validate: (value: unknown) => T,
): PersistentStore<T> {
  let cache: { raw: string | null; value: T } = { raw: null, value: fallback };
  const listeners = new Set<() => void>();

  function readRaw(): string | null {
    try {
      return typeof localStorage === "undefined"
        ? null
        : localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  function getSnapshot(): T {
    const raw = readRaw();
    if (raw !== cache.raw) {
      let value = fallback;
      if (raw != null) {
        try {
          value = validate(JSON.parse(raw));
        } catch {
          value = fallback;
        }
      }
      cache = { raw, value };
    }
    return cache.value;
  }

  function emit() {
    for (const cb of listeners) cb();
  }

  return {
    subscribe(cb) {
      listeners.add(cb);
      const onStorage = (e: StorageEvent) => {
        if (e.key === key) emit();
      };
      if (typeof window !== "undefined") {
        window.addEventListener("storage", onStorage);
      }
      return () => {
        listeners.delete(cb);
        if (typeof window !== "undefined") {
          window.removeEventListener("storage", onStorage);
        }
      };
    },
    getSnapshot,
    getServerSnapshot: () => fallback,
    get: getSnapshot,
    set(next) {
      try {
        const raw = JSON.stringify(next);
        localStorage.setItem(key, raw);
        cache = { raw, value: next };
      } catch {
        cache = { raw: cache.raw, value: next };
      }
      emit();
    },
  };
}

/** Subscribe helper for a "have we hydrated on the client yet" boolean. */
export function alwaysTrue() {
  return true;
}
export function alwaysFalse() {
  return false;
}
