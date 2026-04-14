"use client";

import { motion } from "motion/react";

const floatTransition = (duration: number) =>
  ({
    duration,
    repeat: Infinity,
    ease: "easeInOut" as const,
    repeatType: "loop" as const,
  }) as const;

export function DetailPageBlobs() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      <motion.div
        className="absolute -top-16 right-0 h-80 w-80 rounded-full bg-blue-500/25 blur-3xl sm:-right-12 md:top-8 md:right-[8%]"
        animate={{ y: [0, 28, 0], x: [0, -22, 0] }}
        transition={floatTransition(7)}
      />
      <motion.div
        className="absolute top-[38%] -left-24 h-64 w-64 rounded-full bg-yellow-500/25 blur-3xl md:left-[2%] lg:top-[32%]"
        animate={{ y: [0, -24, 0], x: [0, 18, 0] }}
        transition={floatTransition(5.5)}
      />
      <motion.div
        className="absolute bottom-32 left-[18%] h-72 w-72 rounded-full bg-purple-600/25 blur-3xl md:bottom-24 lg:left-[22%]"
        animate={{ y: [0, 20, 0], x: [0, 26, 0] }}
        transition={floatTransition(6.5)}
      />
      <motion.div
        className="absolute right-[12%] top-[55%] h-56 w-56 rounded-full bg-pink-500/25 blur-3xl lg:right-[18%] lg:top-1/2"
        animate={{ y: [0, -16, 0], x: [0, -20, 0] }}
        transition={floatTransition(4.5)}
      />
      <motion.div
        className="absolute top-[18%] right-[8%] h-64 w-64 rounded-full bg-emerald-500/25 blur-3xl lg:right-[34%] xl:h-72 xl:w-72"
        animate={{ y: [0, 16, 0], x: [0, -14, 0] }}
        transition={floatTransition(5.5)}
      />
    </div>
  );
}
