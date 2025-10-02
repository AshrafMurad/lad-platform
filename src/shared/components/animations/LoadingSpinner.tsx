"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  color?: string;
}

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
};

export function LoadingSpinner({
  size = "md",
  className,
  color = "currentColor",
}: LoadingSpinnerProps) {
  return (
    <motion.div
      className={cn(
        "border-2 border-transparent rounded-full",
        sizeClasses[size],
        className
      )}
      style={{
        borderTopColor: color,
        borderRightColor: color,
        borderBottomColor: `${color}20`,
        borderLeftColor: `${color}20`,
      }}
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  );
}
