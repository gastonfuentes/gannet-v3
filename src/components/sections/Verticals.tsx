import { motion, useReducedMotion, type Variants } from "framer-motion";
import SectionHeading from "@/components/sections/SectionHeading";

const EASE_SPATIAL = [0.32, 0.72, 0, 1] as const;

// Nueva Era is also a client, so it appears in the Clients marquee too.
const partners = [
  { name: "Nueva Era", src: "/logonuevaera.svg" },
  { name: "Tiendanube", src: "/logos/tiendanube.svg" },
  { name: "DUX Software", src: "/logos/dux.svg" },
];

/** Orchestration only — staggerChildren must live in the parent's variant. */
const gridVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const Verticals = () => {
  const reduceMotion = useReducedMotion();

  const cardVariants: Variants = {
    hidden: reduceMotion ? { opacity: 0 } : { opacity: 0, y: 64, filter: "blur(8px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: reduceMotion ? 0.3 : 0.9, ease: EASE_SPATIAL },
    },
  };

  return (
    <section id="verticales" className="relative px-4 py-32 md:px-6 lg:px-8 lg:py-52">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Partners"
          title="Partners estratégicos"
          highlight="estratégicos"
        />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={gridVariants}
          className="mt-16 grid grid-cols-1 gap-4 md:gap-5 sm:grid-cols-3"
        >
          {partners.map((partner) => (
            <motion.div key={partner.name} variants={cardVariants}>
              <div className="group relative h-full rounded-[2rem] bg-white/[0.03] p-1.5 ring-1 ring-white/[0.06] transition-all duration-700 ease-spatial hover:ring-white/[0.14]">
                <div className="relative flex h-36 items-center justify-center overflow-hidden rounded-[1.625rem] bg-card px-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(60%_100%_at_50%_0%,hsl(var(--brand)/0.12),transparent)] opacity-0 transition-opacity duration-700 ease-spatial group-hover:opacity-100" />
                  <img
                    src={partner.src}
                    alt={partner.name}
                    loading="lazy"
                    // Normalized to white: these are dark, full-color marks
                    // and would be nearly invisible on the navy background.
                    className="relative max-h-12 w-auto max-w-[70%] object-contain opacity-70 brightness-0 invert transition-all duration-700 ease-spatial group-hover:scale-[1.03] group-hover:opacity-100"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Verticals;
