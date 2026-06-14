import { cn } from "@/lib/utils";

interface LoaderProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  color?: string;
}

const sizeMap = {
  sm: "h-4 w-4 border-2",
  md: "h-6 w-6 border-2",
  lg: "h-10 w-10 border-[3px]",
};

export function Loader({
  size = "md",
  className,
  color = "#C70A24",
}: LoaderProps) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn("inline-block", className)}
    >
      <div
        className={cn(
          sizeMap[size],
          "rounded-full border-t-transparent animate-spin",
        )}
        style={{ borderColor: color, borderTopColor: "transparent" }}
      />
      <span className="sr-only">Loading...</span>
    </div>
  );
}
