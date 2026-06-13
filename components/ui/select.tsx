import { cn } from "@/lib/utils";

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

export function Select({ className, children, ...props }: SelectProps) {
  return (
    <select
      className={cn(
        "h-11 w-full rounded-xl border border-stone-300 bg-white px-4 text-sm text-stone-900",
        "focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}
