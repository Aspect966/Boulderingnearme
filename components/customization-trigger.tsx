"use client";

import { useState } from "react";
import { CustomizationPanel } from "@/components/customization-panel";
import { cn } from "@/lib/utils";

type CustomizationTriggerProps = {
  className?: string;
  onOpen?: () => void;
};

export function CustomizationTrigger({
  className,
  onOpen,
}: CustomizationTriggerProps) {
  const [open, setOpen] = useState(false);

  function handleOpen() {
    onOpen?.();
    setOpen(true);
  }

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className={className}
      >
        Customization
      </button>
      <CustomizationPanel open={open} onClose={() => setOpen(false)} />
    </>
  );
}

export function CustomizationNavButton({
  className,
  onOpen,
}: CustomizationTriggerProps) {
  return (
    <CustomizationTrigger
      onOpen={onOpen}
      className={cn(
        "block w-full rounded-lg px-4 py-2.5 text-left text-sm font-medium",
        "text-[var(--theme-foreground)] hover:bg-[color-mix(in_srgb,var(--theme-foreground)_6%,transparent)]",
        className
      )}
    />
  );
}
