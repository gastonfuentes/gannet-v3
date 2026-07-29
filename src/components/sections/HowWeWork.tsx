import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import SectionHeading from "@/components/sections/SectionHeading";

const EASE_SPATIAL = [0.32, 0.72, 0, 1] as const;

const steps = [
  {
    title: "Entendemos el problema",
    description:
      "Antes de proponer cualquier solución, entendemos cómo funciona tu negocio hoy, qué duele más y dónde está el mayor impacto posible.",
  },
  {
    title: "Diseñamos una solución simple",
    description:
      "Proponemos un alcance claro, sin sobrediseñar. La solución más simple que resuelve el problema real es siempre la mejor opción.",
  },
  {
    title: "Construimos e integramos",
    description:
      "Desarrollamos con foco en resultados. Sin procesos lentos ni reuniones infinitas. Mostramos avances reales desde la primera semana.",
  },
  {
    title: "Medimos y mejoramos",
    description:
      "Una vez implementado, medimos si está funcionando y ajustamos. El objetivo no es entregar, es que sirva.",
  },
];

/** Orchestration only — staggerChildren must live in the parent's variant. */
const gridVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const HowWeWork = () => {
  const reduceMotion = useReducedMotion();

  const blockVariants: Variants = {
    hidden: reduceMotion ? { opacity: 0 } : { opacity: 0, y: 64, filter: "blur(8px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: reduceMotion ? 0.3 : 0.9, ease: EASE_SPATIAL },
    },
  };

  return (
    <section id="como-trabajamos" className="relative px-4 py-32 md:px-6 lg:px-8 lg:py-52">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Cómo trabajamos"
          title="Trabajamos con foco, claridad y validación rápida"
          highlight="validación rápida"
          description="Un proceso pensado para negocios que no tienen tiempo para proyectos interminables. Tecnología como medio, no como fin."
        />

        {/* Split layout: the photo carries the human side, the steps carry the
            process. Absorbed the former WhyGannet section, whose four points
            restated these ones almost verbatim. */}
        <div className="mt-20 grid grid-cols-1 gap-4 md:gap-5 lg:grid-cols-2">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={blockVariants}
            className="relative h-full"
          >
            {/* No frame: two crossed gradient masks dissolve all four edges so
                the photo emerges from the background instead of sitting in a
                box. `mask-composite` intersects them — Safari needs the
                -webkit- pair, hence both declarations. */}
            <img
              src="/equipo-trabajando.jpg"
              alt="Dos integrantes del equipo de GannetLabs trabajando frente a dos monitores con paneles de datos y código"
              width={1122}
              height={1402}
              loading="lazy"
              decoding="async"
              className="aspect-[4/5] h-full w-full object-cover object-center lg:aspect-auto [mask-image:linear-gradient(to_bottom,transparent,black_16%,black_72%,transparent),linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] [mask-composite:intersect] [-webkit-mask-composite:source-in]"
            />
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={gridVariants}
            className="flex flex-col gap-4 md:gap-5"
          >
            {steps.map((step, i) => (
              <motion.div key={step.title} variants={blockVariants} className="flex-1">
                <div className="group/card relative h-full rounded-[2rem] bg-white/[0.03] p-1.5 ring-1 ring-white/[0.06] transition-all duration-700 ease-spatial hover:ring-white/[0.14]">
                  <div className="relative flex h-full items-center overflow-hidden rounded-[1.625rem] bg-card p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] lg:p-7">
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(60%_100%_at_50%_0%,hsl(var(--brand)/0.12),transparent)] opacity-0 transition-opacity duration-700 ease-spatial group-hover/card:opacity-100" />

                    {/* Oversized step number as a watermark. The inner core's
                        overflow-hidden is what keeps it from escaping. */}
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute -bottom-5 -right-2 font-display text-[6rem] font-bold leading-none text-white/[0.03]"
                    >
                      0{i + 1}
                    </span>

                    <div className="relative flex items-start gap-4 lg:items-center">
                      {/* The step number takes the slot the icon holds in the
                          other sections, so every card shares one anatomy. */}
                      <div className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/[0.04] font-display text-base font-bold text-brand ring-1 ring-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition-transform duration-700 ease-spatial group-hover/card:scale-[1.06]">
                        0{i + 1}
                      </div>
                      <div>
                        <h3 className="font-display text-lg font-semibold tracking-tight text-foreground">
                          {step.title}
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={blockVariants}
          className="mt-14 flex justify-center"
        >
          <Button
            asChild
            variant="hero"
            size="pillLg"
            className="group/cta h-12 pr-2 transition-transform duration-500 ease-spatial active:scale-[0.98]"
          >
            <a href="#contacto">
              Coordinar una llamada
              {/* Button-in-button: the arrow gets its own island. */}
              <span className="ml-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/10 transition-transform duration-500 ease-spatial group-hover/cta:translate-x-1 group-hover/cta:scale-105">
                <ArrowRight strokeWidth={1.5} className="h-4 w-4" />
              </span>
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default HowWeWork;
