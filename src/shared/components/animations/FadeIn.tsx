"use client";

import { motion } from "framer-motion";
import { motionVariants } from "./motionVariants";

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  duration?: number;
}

export function FadeIn({ 
  children, 
  delay = 0, 
  className,
  duration = 0.3 
}: FadeInProps) {
  return (
    <motion.div
      initial={motionVariants.fadeIn.initial}
      animate={motionVariants.fadeIn.animate}
      exit={motionVariants.fadeIn.exit}
      transition={{ 
        ...motionVariants.fadeIn.transition,
        delay,
        duration 
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
