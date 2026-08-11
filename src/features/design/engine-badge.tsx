"use client";

import * as React from "react";
import { Sparkles, Cpu } from "lucide-react";
import type { Dictionary } from "@/i18n/dictionaries";
import { Badge } from "@/components/ui/badge";

/**
 * Honest provider-mode badge for the AI Designer (additive; the existing wizard is
 * unchanged). Reads the interior-engine capability endpoint (an enum only, never a
 * credential) and shows whether Claude Vision or the deterministic Demo analysis is
 * active. Fails silently to Demo if the endpoint is unreachable. Development/demo
 * signal only — it never blocks or alters the existing flow.
 */
export function EngineBadge({ t }: { t: Dictionary["design"]["engine"] }) {
  const [mode, setMode] = React.useState<"claude" | "demo" | null>(null);

  React.useEffect(() => {
    let alive = true;
    fetch("/api/interior-agent/run")
      .then((r) => r.json())
      .then((d: { designerMode?: string }) => {
        if (alive) setMode(d.designerMode === "claude" ? "claude" : "demo");
      })
      .catch(() => alive && setMode("demo"));
    return () => {
      alive = false;
    };
  }, []);

  if (!mode) return null;

  return (
    <Badge tone={mode === "claude" ? "brand" : "neutral"}>
      {mode === "claude" ? (
        <Sparkles className="size-3.5" strokeWidth={1.75} aria-hidden="true" />
      ) : (
        <Cpu className="size-3.5" strokeWidth={1.75} aria-hidden="true" />
      )}
      {mode === "claude" ? t.claudeMode : t.demoMode}
    </Badge>
  );
}
