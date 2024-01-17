import React from "react";
import type { HTMLProps } from "react";

interface SkeletonProps {
  className?: string;
  children?: React.ReactNode;
}

function Skeleton({
  className,
  children,
  ...others
}: SkeletonProps & HTMLProps<HTMLDivElement>) {
  return (
    <div
      {...others}
      className={`${className} animate-pulse bg-dark-lighten round-md`}
    >
      {children}
    </div>
  );
}

export default Skeleton;
