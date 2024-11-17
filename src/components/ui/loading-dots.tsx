import { cn } from "@/lib/utils";
import * as React from "react";

interface LoadingDotsProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "default" | "sm" | "lg";
}

const LoadingDots = React.forwardRef<HTMLDivElement, LoadingDotsProps>(
  ({ className, size = "default", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center gap-1",
          size === "sm" && "scale-75",
          size === "lg" && "scale-125",
          className
        )}
        {...props}
      >
        <span className="animate-loader h-1 w-1 rounded-full bg-foreground/50" />
        <span className="animate-loader h-1 w-1 rounded-full bg-foreground/50 animation-delay-200" />
        <span className="animate-loader h-1 w-1 rounded-full bg-foreground/50 animation-delay-400" />
      </div>
    );
  }
);
LoadingDots.displayName = "LoadingDots";

export { LoadingDots };
