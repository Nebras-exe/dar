"use client";

import * as React from "react";
import { Heart } from "lucide-react";
import { IconButton } from "@/components/ui/icon-button";
import { useFavorites } from "@/features/favorites/favorites-context";
import { cn } from "@/lib/utils";

export interface FavoriteButtonProps {
  slug: string;
  labelSave: string;
  labelSaved: string;
  size?: "sm" | "md";
  className?: string;
}

/**
 * Local favourite toggle. Renders a real, `aria-pressed` button that sits above
 * a card's stretched link so it stays independently focusable and clickable.
 * State only appears after hydration to avoid an SSR/client mismatch.
 */
export function FavoriteButton({
  slug,
  labelSave,
  labelSaved,
  size = "sm",
  className,
}: FavoriteButtonProps) {
  const { isFavorite, toggle, hydrated } = useFavorites();
  const active = hydrated && isFavorite(slug);

  return (
    <IconButton
      label={active ? labelSaved : labelSave}
      size={size}
      aria-pressed={active}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(slug);
      }}
      className={cn(
        "relative z-10 bg-elevated/85 backdrop-blur-sm hover:bg-elevated",
        active && "text-brand",
        className,
      )}
    >
      <Heart
        className="size-4.5"
        strokeWidth={1.75}
        fill={active ? "currentColor" : "none"}
      />
    </IconButton>
  );
}
