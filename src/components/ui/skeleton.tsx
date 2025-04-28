import * as React from "react";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className = "", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`animate-pulse bg-gray-200 rounded-md ${className}`}
        {...props}
      />
    );
  }
);
Skeleton.displayName = "Skeleton";

export { Skeleton }; 