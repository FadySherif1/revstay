"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion";

const MAX_TILT_DEG = 6;

export function TiltCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const springConfig = { stiffness: 200, damping: 20, mass: 0.5 };
  const rotateX = useSpring(
    useTransform(mouseY, [0, 1], [MAX_TILT_DEG, -MAX_TILT_DEG]),
    springConfig
  );
  const rotateY = useSpring(
    useTransform(mouseX, [0, 1], [-MAX_TILT_DEG, MAX_TILT_DEG]),
    springConfig
  );
  const glowX = useTransform(mouseX, [0, 1], ["0%", "100%"]);
  const glowY = useTransform(mouseY, [0, 1], ["0%", "100%"]);

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (prefersReducedMotion || event.pointerType === "touch") return;
    const rect = event.currentTarget.getBoundingClientRect();
    mouseX.set((event.clientX - rect.left) / rect.width);
    mouseY.set((event.clientY - rect.top) / rect.height);
  }

  function handlePointerLeave() {
    mouseX.set(0.5);
    mouseY.set(0.5);
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={
        prefersReducedMotion
          ? undefined
          : {
              rotateX,
              rotateY,
              transformPerspective: 800,
            }
      }
      className={`relative will-change-transform ${className ?? ""}`}
    >
      {children}
      {!prefersReducedMotion && (
        <motion.div
          aria-hidden
          style={{
            background: `radial-gradient(180px circle at ${glowX} ${glowY}, rgba(212,175,55,0.18), transparent 70%)`,
          }}
          className="pointer-events-none absolute inset-0 rounded-2xl"
        />
      )}
    </motion.div>
  );
}
