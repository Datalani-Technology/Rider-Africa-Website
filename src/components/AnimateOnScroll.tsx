"use client";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

interface Props {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "left" | "right" | "none";
}

// Content is ALWAYS visible. We only animate position (y/x transform).
// This prevents blank pages when framer-motion doesn't hydrate correctly on network devices.
export default function AnimateOnScroll({
  children,
  className = "",
  delay = 0,
  direction = "up",
}: Props) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  const initialMap = {
    up:    { y: 32 },
    left:  { x: -32 },
    right: { x: 32 },
    none:  {},
  };

  const animateMap = {
    up:    { y: 0 },
    left:  { x: 0 },
    right: { x: 0 },
    none:  {},
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={initialMap[direction]}
      animate={inView ? animateMap[direction] : initialMap[direction]}
      transition={{ duration: 0.55, delay, ease: "easeOut" }}
      style={{ opacity: 1 }}
    >
      {children}
    </motion.div>
  );
}
