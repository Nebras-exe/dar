"use client";

import * as React from "react";
import { ImagePlus, RefreshCw, Trash2, UploadCloud, ImageIcon } from "lucide-react";
import type { Dictionary } from "@/i18n/dictionaries";
import { cn } from "@/lib/utils";

const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];
const MAX_BYTES = 12 * 1024 * 1024;

/**
 * Local-only room photo upload: drag & drop or click, live preview, replace and
 * remove — with a keyboard-accessible drop zone. The image never leaves the
 * browser (no upload, no AI). Only the file name is lifted to wizard state; the
 * preview object URL is owned here and revoked to avoid leaks.
 */
export function ImageUpload({
  t,
  imageName,
  onSet,
  onClear,
  onFile,
}: {
  t: Dictionary["design"]["upload"];
  imageName?: string;
  onSet: (name: string) => void;
  onClear: () => void;
  /** Lifts the actual File (never persisted) so it can be analysed; null on remove. */
  onFile?: (file: File | null) => void;
}) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [dragOver, setDragOver] = React.useState(false);

  React.useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    if (!ACCEPTED.includes(file.type)) {
      setError(t.invalid);
      return;
    }
    if (file.size > MAX_BYTES) {
      setError(t.tooLarge);
      return;
    }
    setError(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(file));
    onSet(file.name);
    onFile?.(file);
  };

  const remove = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
    onClear();
    onFile?.(null);
  };

  const openPicker = () => inputRef.current?.click();

  const hasImage = Boolean(previewUrl || imageName);

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED.join(",")}
        className="sr-only"
        aria-label={t.title}
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {!hasImage ? (
        <div
          role="button"
          tabIndex={0}
          onClick={openPicker}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              openPicker();
            }
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            handleFile(e.dataTransfer.files?.[0]);
          }}
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 py-14 text-center transition-colors",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
            dragOver
              ? "border-brand bg-brand-soft/50"
              : "border-border bg-surface hover:border-taupe hover:bg-surface",
          )}
        >
          <span className="flex size-12 items-center justify-center rounded-full bg-brand-soft text-brand">
            <UploadCloud className="size-6" strokeWidth={1.75} aria-hidden="true" />
          </span>
          <p className="text-[0.95rem] text-foreground">
            {t.dropHere}{" "}
            <span className="font-semibold text-brand underline underline-offset-2">
              {t.browse}
            </span>
          </p>
          <p className="text-xs text-subtle">{t.formats}</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border-subtle bg-surface">
          <div className="relative aspect-[4/3] w-full bg-cream">
            {previewUrl ? (
              // eslint-disable-next-line @next/next/no-img-element -- local object URL preview, never optimized/remote
              <img
                src={previewUrl}
                alt={t.previewAlt}
                className="size-full object-cover"
              />
            ) : (
              <div className="flex size-full flex-col items-center justify-center gap-2 text-taupe">
                <ImageIcon className="size-10" strokeWidth={1.25} aria-hidden="true" />
                <span className="max-w-[80%] truncate px-4 text-sm text-muted">
                  {imageName}
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center justify-between gap-3 px-4 py-3">
            <span className="min-w-0 flex-1 truncate text-sm text-muted">{imageName}</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={openPicker}
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-foreground hover:bg-elevated focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                <RefreshCw className="size-4" strokeWidth={1.75} aria-hidden="true" />
                {t.replace}
              </button>
              <button
                type="button"
                onClick={remove}
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm text-muted hover:text-danger focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                <Trash2 className="size-4" strokeWidth={1.75} aria-hidden="true" />
                {t.remove}
              </button>
            </div>
          </div>
        </div>
      )}

      {error && (
        <p className="mt-3 flex items-center gap-2 text-sm text-danger" role="alert">
          <ImagePlus className="size-4" strokeWidth={1.75} aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
}
