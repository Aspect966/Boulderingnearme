import { cn } from "@/lib/utils";

export function Badge({
  className,
  children,
  tone = "neutral",
}: {
  className?: string;
  children: React.ReactNode;
  tone?: "neutral" | "accent" | "success";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold tracking-wide",
        tone === "neutral" && "bg-stone-100 text-stone-700",
        tone === "accent" && "bg-amber-100 text-amber-800",
        tone === "success" && "bg-emerald-100 text-emerald-800",
        className
      )}
    >
      {children}
    </span>
  );
}
