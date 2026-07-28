import { Search, Plug, Sparkles, type LucideIcon } from "lucide-react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import SectionHeading from "@/components/sections/SectionHeading";
import IntegrationsDiagram from "@/components/sections/IntegrationsDiagram";

const EASE_SPATIAL = [0.32, 0.72, 0, 1] as const;

const steps: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: Search,
    title: "Nos adaptamos",
    description:
      "Relevamos las herramientas que ya usás y cómo trabaja tu equipo hoy. Nada de empezar de cero.",
  },
  {
    icon: Plug,
    title: "Integramos",
    description:
      "Conectamos tus sistemas entre sí con APIs e integraciones a medida. Tus datos dejan de estar aislados.",
  },
  {
    icon: Sparkles,
    title: "Sumamos IA",
    description:
      "Construimos agentes y automatizaciones que trabajan sobre tus datos reales, dentro de tu ecosistema.",
  },
];

/** Orchestration only — staggerChildren must live in the parent's variant. */
const gridVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const Integrations = () => {
  const reduceMotion = useReducedMotion();

  const itemVariants: Variants = {
    hidden: reduceMotion ? { opacity: 0 } : { opacity: 0, y: 64, filter: "blur(8px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: reduceMotion ? 0.3 : 0.9, ease: EASE_SPATIAL },
    },
  };

  return (
    <section id="integraciones" className="relative px-4 py-32 md:px-6 lg:px-8 lg:py-52">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Nos adaptamos a vos"
          title="No cambies tu software. Nosotros nos adaptamos."
          highlight="No cambies tu software."
          description="Seguí usando Odoo, Tango, Tiendanube, DUX o lo que ya funciona en tu empresa. Nosotros nos integramos a esas herramientas, conectamos todo tu ecosistema y construimos soluciones con inteligencia artificial sobre él."
        />

        <motion.div
          initial={reduceMotion ? undefined : { opacity: 0, y: 40 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1, ease: EASE_SPATIAL }}
          className="mt-20"
        >
          <IntegrationsDiagram />
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={gridVariants}
          className="mt-20 grid grid-cols-1 gap-4 md:gap-5 sm:grid-cols-3"
        >
          {steps.map((step) => (
            <motion.div key={step.title} variants={itemVariants}>
              {/* Same double-bezel language as the Problems cards. */}
              <div className="group relative h-full rounded-[2rem] bg-white/[0.03] p-1.5 ring-1 ring-white/[0.06] transition-all duration-700 ease-spatial hover:ring-white/[0.14]">
                <div className="relative h-full overflow-hidden rounded-[1.625rem] bg-card p-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] lg:p-8">
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(60%_100%_at_50%_0%,hsl(var(--brand)/0.12),transparent)] opacity-0 transition-opacity duration-700 ease-spatial group-hover:opacity-100" />

                  <div className="relative">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.04] ring-1 ring-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition-transform duration-700 ease-spatial group-hover:scale-[1.06]">
                      <step.icon strokeWidth={1.25} className="h-5 w-5 text-brand" />
                    </div>
                    <h3 className="mt-6 font-display text-lg font-semibold tracking-tight text-foreground">
                      {step.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Integrations;
