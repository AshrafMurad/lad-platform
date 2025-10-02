"use client";

import { motion } from "framer-motion";
import { motionVariants } from "./motionVariants";

interface StaggerContainerProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  staggerDelay?: number;
}

export function StaggerContainer({ 
  children, 
  className,
  delay = 0,
  staggerDelay = 0.1
}: StaggerContainerProps) {
  return (
    <motion.div
      variants={{
        ...motionVariants.stagger.container,
        animate: {
          ...motionVariants.stagger.container.animate,
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: delay
          }
        }
      }}
      initial="initial"
      animate="animate"
      exit="exit"
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Individual item component to be used inside StaggerContainer
export function StaggerItem({ 
  children, 
  className 
}: { 
  children: React.ReactNode; 
  className?: string; 
}) {
  return (
    <motion.div
      variants={motionVariants.stagger.item}
      className={className}
    >
      {children}
    </motion.div>
  );
}
