import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import SectionHeading from "@/components/sections/SectionHeading";
import { cn } from "@/lib/utils";

const EASE_SPATIAL = [0.32, 0.72, 0, 1] as const;

type ProductAccent = "mint" | "amber";

type Product = {
  name: string;
  badge: string;
  accent: ProductAccent;
  pitch: string;
  ctaLabel: string;
  href: string;
};

/**
 * Each product keeps the accent of its own standalone page. Classes are spelled
 * out rather than interpolated so Tailwind can find them when scanning.
 */
const accentStyles: Record<ProductAccent, { badge: string; ring: string; glow: string }> = {
  mint: {
    badge: "border-brand/40 bg-brand/10 text-brand",
    ring: "hover:ring-brand/30",
    glow: "bg-[radial-gradient(60%_100%_at_50%_0%,hsl(var(--brand)/0.14),transparent)]",
  },
  amber: {
    badge: "border-amber-400/40 bg-amber-400/10 text-amber-300",
    ring: "hover:ring-amber-400/30",
    glow: "bg-[radial-gradient(60%_100%_at_50%_0%,rgba(251,191,36,0.14),transparent)]",
  },
};

const products: Product[] = [
  {
    name: "GANNET OS",
    badge: "Para empresas en marcha",
    accent: "mint",
    pitch:
      "El sistema operativo inteligente de tu empresa: conecta toda su información y trabaja las 24 horas.",
    ctaLabel: "Conocer GANNET OS",
    href: "/gannet-os/",
  },
  {
    name: "Modulitia",
    badge: "Para emprendedores",
    accent: "amber",
    pitch: "El kit de herramientas de IA que crece con tu negocio, módulo a módulo.",
    ctaLabel: "Conocer Modulitia",
    href: "/modulitia/",
  },
];

/** Orchestration only — staggerChildren must live in the parent's variant. */
const gridVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const Products = () => {
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
    <section id="productos" className="relative px-4 py-32 md:px-6 lg:px-8 lg:py-52">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Productos"
          title="Estos son nuestros productos más vendidos"
          highlight="más vendidos"
          description="Dos productos propios, ya probados en empresas y emprendimientos reales. Elegí el que se ajusta a tu momento."
        />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={gridVariants}
          className="mt-20 grid grid-cols-1 gap-4 md:gap-5 sm:grid-cols-2"
        >
          {products.map((product) => {
            const accent = accentStyles[product.accent];
            return (
              <motion.div key={product.name} variants={cardVariants}>
                {/* Same double-bezel language as Problems and Integrations. */}
                <div
                  className={cn(
                    "group relative h-full rounded-[2rem] bg-white/[0.03] p-1.5 ring-1 ring-white/[0.06] transition-all duration-700 ease-spatial",
                    accent.ring,
                  )}
                >
                  <div className="relative flex h-full flex-col overflow-hidden rounded-[1.625rem] bg-card p-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] lg:p-8">
                    <div
                      className={cn(
                        "pointer-events-none absolute inset-x-0 top-0 h-40 opacity-0 transition-opacity duration-700 ease-spatial group-hover:opacity-100",
                        accent.glow,
                      )}
                    />

                    <div className="relative flex h-full flex-col">
                      <span
                        className={cn(
                          "inline-flex w-fit items-center rounded-full border px-3 py-1 text-xs font-medium",
                          accent.badge,
                        )}
                      >
                        {product.badge}
                      </span>

                      <h3 className="mt-6 font-display text-2xl font-bold tracking-tight text-foreground">
                        {product.name}
                      </h3>
                      <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground md:text-base">
                        {product.pitch}
                      </p>

                      <Button
                        asChild
                        variant="hero"
                        size="pillLg"
                        className="group/cta mt-8 h-12 w-fit pr-2 transition-transform duration-500 ease-spatial active:scale-[0.98]"
                      >
                        <a href={product.href}>
                          {product.ctaLabel}
                          {/* Button-in-button: the arrow gets its own island. */}
                          <span className="ml-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/10 transition-transform duration-500 ease-spatial group-hover/cta:translate-x-1 group-hover/cta:scale-105">
                            <ArrowUpRight strokeWidth={1.5} className="h-4 w-4" />
                          </span>
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default Products;
