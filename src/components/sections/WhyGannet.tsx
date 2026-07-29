import { Target, Plug, Gauge, LineChart, type LucideIcon } from "lucide-react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import SectionHeading from "@/components/sections/SectionHeading";

const EASE_SPATIAL = [0.32, 0.72, 0, 1] as const;

const reasons: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: Target,
    title: "IA con criterio de negocio",
    description:
      "Primero entendemos qué necesita el negocio, después elegimos la tecnología. Nunca vendemos complejidad innecesaria.",
  },
  {
    icon: Plug,
    title: "Construimos sobre tus herramientas",
    description:
      "No pedimos que tires lo que ya funciona: nos integramos a tu software actual y lo hacemos rendir más.",
  },
  {
    icon: Gauge,
    title: "Velocidad sin descuidar la calidad",
    description:
      "Entregamos resultados desde la primera semana. Iteramos rápido con foco en lo que importa, no en funcionalidades secundarias.",
  },
  {
    icon: LineChart,
    title: "Medimos lo que construimos",
    description:
      "Cada solución tiene métricas de éxito definidas desde el inicio. Si no está funcionando, lo sabemos y lo ajustamos.",
  },
];

/** Orchestration only — staggerChildren must live in the parent's variant. */
const gridVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const WhyGannet = () => {
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
    <section id="por-que" className="relative px-4 py-32 md:px-6 lg:px-8 lg:py-52">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Por qué GannetLabs"
          title="Tecnología aplicada con criterio de negocio"
          highlight="criterio de negocio"
          description="Somos un equipo que entiende de inteligencia artificial y de cómo funciona un negocio real. Tecnología como medio, no como fin."
        />

        {/* Split layout: the image carries the human side of the claim, the
            list carries the argument. Two blocks instead of a fourth card
            grid, which is also what breaks the rhythm at this point. */}
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

          {/* One bezel per reason, stacked. Each keeps the site-wide card
              anatomy so this column matches Problems, Products and HowWeWork. */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={gridVariants}
            className="flex flex-col gap-4 md:gap-5"
          >
            {reasons.map((reason) => (
              <motion.div key={reason.title} variants={blockVariants} className="flex-1">
                <div className="group/card relative h-full rounded-[2rem] bg-white/[0.03] p-1.5 ring-1 ring-white/[0.06] transition-all duration-700 ease-spatial hover:ring-white/[0.14]">
                  <div className="relative flex h-full items-center overflow-hidden rounded-[1.625rem] bg-card p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] lg:p-7">
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(60%_100%_at_50%_0%,hsl(var(--brand)/0.12),transparent)] opacity-0 transition-opacity duration-700 ease-spatial group-hover/card:opacity-100" />

                    <div className="relative flex items-start gap-4 lg:items-center">
                      <div className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/[0.04] ring-1 ring-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition-transform duration-700 ease-spatial group-hover/card:scale-[1.06]">
                        <reason.icon strokeWidth={1.25} className="h-5 w-5 text-brand" />
                      </div>
                      <div>
                        <h3 className="font-display text-lg font-semibold tracking-tight text-foreground">
                          {reason.title}
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                          {reason.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default WhyGannet;
