import { memo, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "framer-motion";

type RotatingTextProps = {
  phrases: string[];
  /** How long each phrase stays on screen before rotating, in ms. */
  interval?: number;
  /** Where the phrase sits inside the reserved box. */
  align?: "center" | "end";
  className?: string;
};

// Soft, slow spring: low stiffness with light damping gives a languid settle
// that reads at the same tempo as the hero's looping wave video.
const wordSpring = { type: "spring", stiffness: 55, damping: 18 } as const;

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.09 },
  },
  exit: {
    transition: { staggerChildren: 0.09 },
  },
};

const wordVariants: Variants = {
  hidden: { opacity: 0, y: "100%" },
  visible: {
    opacity: 1,
    y: "0%",
    transition: wordSpring,
  },
  exit: {
    opacity: 0,
    y: "-100%",
    transition: wordSpring,
  },
};

const splitWords = (phrase: string) => phrase.split(" ");

/**
 * Cycles through a list of phrases with a vertical mask reveal: each phrase
 * is split into words that slide in/out independently with a staggered
 * spring transition. Only `transform` and `opacity` are animated.
 *
 * The box is sized by an invisible stack of every phrase, so its width and
 * height always match the longest one. That keeps whatever follows the
 * phrase from shifting as it rotates, and stops the box collapsing while
 * `AnimatePresence` swaps phrases (the outgoing one unmounts first).
 *
 * Memoized because it runs a perpetual animation loop that must not be reset
 * by unrelated re-renders of its parent. For the memo to be effective,
 * callers must pass a stable `phrases` reference (e.g. a module-level
 * constant), not an inline array literal.
 */
const RotatingText = ({
  phrases,
  interval = 5200,
  align = "center",
  className = "",
}: RotatingTextProps) => {
  const [index, setIndex] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;

    const id = setInterval(() => {
      setIndex((current) => (current + 1) % phrases.length);
    }, interval);

    return () => clearInterval(id);
  }, [phrases.length, interval, prefersReducedMotion]);

  // Every layer uses the same row treatment so the sizer measures exactly
  // what the animated phrase will occupy.
  const row = `flex flex-wrap gap-x-[0.25em] ${align === "end" ? "justify-end" : "justify-center"}`;

  return (
    <span className={`relative inline-grid ${className}`}>
      {phrases.map((phrase) => (
        <span key={phrase} aria-hidden="true" className={`invisible col-start-1 row-start-1 ${row}`}>
          {splitWords(phrase).map((word, i) => (
            <span key={`${word}-${i}`} className="inline-block">
              {word}
            </span>
          ))}
        </span>
      ))}

      {prefersReducedMotion ? (
        <span className={`col-start-1 row-start-1 ${row}`}>
          {splitWords(phrases[0]).map((word, i) => (
            <span key={`${word}-${i}`} className="inline-block">
              {word}
            </span>
          ))}
        </span>
      ) : (
        <span className={`col-start-1 row-start-1 overflow-hidden ${row}`}>
          <AnimatePresence mode="wait">
            <motion.span
              key={phrases[index]}
              className={row}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {splitWords(phrases[index]).map((word, i) => (
                <motion.span key={`${word}-${i}`} className="inline-block" variants={wordVariants}>
                  {word}
                </motion.span>
              ))}
            </motion.span>
          </AnimatePresence>
        </span>
      )}
    </span>
  );
};

export default memo(RotatingText);
