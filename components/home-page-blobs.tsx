"use client";

import { motion } from "motion/react";

const floatTransition = (duration: number) =>
  ({
    duration,
    repeat: Infinity,
    ease: "easeInOut" as const,
    repeatType: "loop" as const,
  }) as const;

export function HomePageBlobs() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      <div className="absolute inset-0">
        <motion.div className="absolute top-25 left-25 h-72 w-72 rounded-full bg-purple-600/30 blur-3xl" animate={{ y: [0, -20, 0], x: [0, 20, 0] }} transition={floatTransition(6)} />
        <motion.div
          className="absolute top-40 left-0 h-64 w-64 rounded-full bg-pink-500/30 blur-3xl md:top-50 md:left-120 lg:top-100 lg:left-150 xl:top-100 xl:left-100"
          animate={{ y: [0, 20, 0], x: [0, -20, 0] }}
          transition={floatTransition(5)}
        />
        <motion.div className="absolute right-25 bottom-25 h-72 w-72 rounded-full bg-blue-500/30 blur-3xl" animate={{ y: [0, -18, 0], x: [0, -16, 0] }} transition={floatTransition(4)} />
        <motion.div
          className="absolute right-0 bottom-40 h-64 w-64 rounded-full bg-yellow-500/30 blur-3xl md:bottom-50 md:right-120 lg:bottom-100 lg:right-150 xl:bottom-100 xl:right-100"
          animate={{ y: [0, -20, 0], x: [0, 20, 0] }}
          transition={floatTransition(6)}
        />
        {/* <motion.div
          className="absolute top-[28%] right-[8%] h-64 w-64 rounded-full bg-emerald-500/25 blur-3xl lg:right-[40%] xl:h-72 xl:w-72"
          animate={{ y: [0, 16, 0], x: [0, -14, 0] }}
          transition={floatTransition(5.5)}
        /> */}
      </div>
    </div>
  );
}
