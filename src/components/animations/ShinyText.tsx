import { motion } from "framer-motion";

type ShinyTextProps = {
  text: string;
  className?: string;
  /** Base text color. */
  baseColor?: string;
  /** Color of the moving shine band. */
  shineColor?: string;
  /** Duration of one sweep, in seconds. */
  speed?: number;
  /** Gradient angle, in degrees. */
  spread?: number;
};

/**
 * Animated "shiny" text: a shine band sweeps continuously across the text
 * from left to right using a CSS gradient clipped to the glyphs.
 */
const ShinyText = ({
  text,
  className = "",
  baseColor = "#64CEFB",
  shineColor = "#ffffff",
  speed = 3,
  spread = 100,
}: ShinyTextProps) => {
  return (
    <motion.span
      className={className}
      style={{
        display: "inline-block",
        backgroundImage: `linear-gradient(${spread}deg, ${baseColor} 0%, ${baseColor} 35%, ${shineColor} 50%, ${baseColor} 65%, ${baseColor} 100%)`,
        backgroundSize: "200% 100%",
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        WebkitTextFillColor: "transparent",
        color: "transparent",
      }}
      animate={{ backgroundPosition: ["200% 0%", "-200% 0%"] }}
      transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
    >
      {text}
    </motion.span>
  );
};

export default ShinyText;
