import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
        variant === "primary" &&
          "bg-amber-600 text-white shadow-sm hover:bg-amber-700 active:scale-[0.98]",
        variant === "secondary" &&
          "bg-stone-900 text-white hover:bg-stone-800 active:scale-[0.98]",
        variant === "ghost" && "text-stone-700 hover:bg-stone-100",
        variant === "outline" &&
          "border border-stone-300 bg-white text-stone-800 hover:bg-stone-50",
        size === "sm" && "h-9 px-3 text-sm",
        size === "md" && "h-11 px-5 text-sm",
        size === "lg" && "h-12 px-6 text-base",
        className
      )}
      {...props}
    />
  );
}
