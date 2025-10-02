"use client";

import { motion } from "framer-motion";
import { motionVariants } from "./motionVariants";

interface SlideUpProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export function SlideUp({ children, delay = 0, className }: SlideUpProps) {
  return (
    <motion.div
      initial={motionVariants.slideUp.initial}
      animate={motionVariants.slideUp.animate}
      exit={motionVariants.slideUp.exit}
      transition={{ 
        ...motionVariants.slideUp.transition,
        delay 
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
