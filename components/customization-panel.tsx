"use client";

import { useEffect } from "react";
import { useTheme } from "@/components/theme-provider";
import { THEME_FIELDS } from "@/lib/theme";
import { cn } from "@/lib/utils";

type CustomizationPanelProps = {
  open: boolean;
  onClose: () => void;
};

export function CustomizationPanel({ open, onClose }: CustomizationPanelProps) {
  const { theme, setColor, resetTheme } = useTheme();

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center sm:justify-center">
      <button
        type="button"
        aria-label="Close customization"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="customization-title"
        className={cn(
          "relative z-10 flex max-h-[85vh] w-full flex-col",
          "rounded-t-2xl border border-[var(--theme-border)] bg-[var(--theme-surface)] shadow-2xl",
          "sm:max-w-md sm:rounded-2xl"
        )}
      >
        <div className="flex items-center justify-between border-b border-[var(--theme-border)] px-5 py-4">
          <div>
            <h2
              id="customization-title"
              className="text-lg font-semibold text-[var(--theme-foreground)]"
            >
              Customization
            </h2>
            <p className="text-xs text-[var(--theme-muted)]">
              Pick colors to personalize the site
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-[var(--theme-muted)] hover:bg-[color-mix(in_srgb,var(--theme-foreground)_6%,transparent)]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-5 w-5"
              aria-hidden
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto px-5 py-4">
          <ul className="space-y-4">
            {THEME_FIELDS.map(({ key, label, description }) => (
              <li
                key={key}
                className="flex items-center gap-4 rounded-xl border border-[var(--theme-border)] bg-[color-mix(in_srgb,var(--theme-background)_60%,var(--theme-surface))] p-3"
              >
                <label htmlFor={`theme-${key}`} className="min-w-0 flex-1 cursor-pointer">
                  <p className="text-sm font-medium text-[var(--theme-foreground)]">
                    {label}
                  </p>
                  <p className="text-xs text-[var(--theme-muted)]">{description}</p>
                </label>
                <div className="relative shrink-0">
                  <span
                    className="block h-10 w-10 rounded-full border-2 border-[var(--theme-border)] shadow-inner"
                    style={{ backgroundColor: theme[key] }}
                    aria-hidden
                  />
                  <input
                    id={`theme-${key}`}
                    type="color"
                    value={theme[key]}
                    onChange={(event) => setColor(key, event.target.value)}
                    className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                    aria-label={`${label} color`}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex gap-3 border-t border-[var(--theme-border)] px-5 py-4">
          <button
            type="button"
            onClick={() => {
              resetTheme();
            }}
            className="flex-1 rounded-xl border border-[var(--theme-border)] px-4 py-2.5 text-sm font-medium text-[var(--theme-foreground)] hover:bg-[color-mix(in_srgb,var(--theme-foreground)_6%,transparent)]"
          >
            Reset defaults
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl bg-[var(--theme-accent)] px-4 py-2.5 text-sm font-medium text-white hover:bg-[var(--theme-accent-hover)]"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
