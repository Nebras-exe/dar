"use client";

import * as React from "react";

/**
 * Holds the user's room photo for the lifetime of the designer session, so the
 * Phase 07 before/after preview can show it at the result phase — WITHOUT ever
 * persisting the blob. The image is kept only as an in-memory `File` plus a
 * derived object URL that is revoked when the file changes or the provider
 * unmounts. Nothing here touches `localStorage` or the reducer state (§19/§20).
 */

interface RoomImageValue {
  /** The current room photo, or null. Never serialized. */
  file: File | null;
  /** A live object URL for previewing `file`, or null. Owned + revoked here. */
  url: string | null;
  setFile: (file: File | null) => void;
}

const RoomImageContext = React.createContext<RoomImageValue | null>(null);

export function RoomImageProvider({ children }: { children: React.ReactNode }) {
  const [file, setFileState] = React.useState<File | null>(null);
  const [url, setUrl] = React.useState<string | null>(null);
  const urlRef = React.useRef<string | null>(null);

  const setFile = React.useCallback((next: File | null) => {
    // Revoke any previous URL before creating a new one — no leaks.
    if (urlRef.current) {
      URL.revokeObjectURL(urlRef.current);
      urlRef.current = null;
    }
    if (next) {
      const objectUrl = URL.createObjectURL(next);
      urlRef.current = objectUrl;
      setUrl(objectUrl);
    } else {
      setUrl(null);
    }
    setFileState(next);
  }, []);

  React.useEffect(() => {
    return () => {
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    };
  }, []);

  const value = React.useMemo<RoomImageValue>(
    () => ({ file, url, setFile }),
    [file, url, setFile],
  );

  return <RoomImageContext.Provider value={value}>{children}</RoomImageContext.Provider>;
}

/** Access the room-image holder. Safe to call outside a provider (returns nulls). */
export function useRoomImage(): RoomImageValue {
  const ctx = React.useContext(RoomImageContext);
  if (!ctx) {
    return { file: null, url: null, setFile: () => {} };
  }
  return ctx;
}
