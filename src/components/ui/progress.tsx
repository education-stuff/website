"use client"

import * as React from "react"

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
  indicatorClassName?: string;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className = "", value = 0, max = 100, indicatorClassName = "", ...props }, ref) => {
    const percentage = value && max ? (value / max) * 100 : 0;
    
    return (
      <div
        ref={ref}
        className={`progress ${className}`}
        {...props}
      >
        <div
          className={`progress-indicator ${indicatorClassName}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    );
  }
);
Progress.displayName = "Progress";

export { Progress } 