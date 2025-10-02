"use client";

import { motion } from "framer-motion";
import { motionVariants } from "./motionVariants";

interface ScaleOnHoverProps {
  children: React.ReactNode;
  className?: string;
  scaleValue?: number;
}

export function ScaleOnHover({ 
  children, 
  className,
  scaleValue = 1.02
}: ScaleOnHoverProps) {
  return (
    <motion.div
      initial={motionVariants.scale.initial}
      animate={motionVariants.scale.animate}
      whileHover={{ scale: scaleValue }}
      whileTap={motionVariants.scale.tap}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
