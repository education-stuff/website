"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  indicatorClassName?: string;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  (
    { 
      className, 
      value = 0, 
      max = 100, 
      indicatorClassName,
      ...props 
    }, 
    ref
  ) => {
    const percentage = Math.min(Math.max(0, (value / max) * 100), 100);

    return (
      <div
        className={cn("progress", className)}
        ref={ref}
        {...props}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={value}
      >
        <div
          className={cn("progress-indicator", indicatorClassName)}
          style={{ width: `${percentage}%` }}
        />
      </div>
    );
  }
);
Progress.displayName = "Progress";

export { Progress } 