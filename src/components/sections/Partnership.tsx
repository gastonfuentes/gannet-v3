import { CalendarCheck, Server, LifeBuoy, Sprout, Check, type LucideIcon } from "lucide-react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import SectionHeading from "@/components/sections/SectionHeading";

const EASE_SPATIAL = [0.32, 0.72, 0, 1] as const;

const pillars: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: CalendarCheck,
    title: "Un abono mensual, no un proyecto cerrado",
    description:
      "No cobramos una vez y listo. Pagás un abono mensual que acompaña la carga de trabajo real de cada mes, y sabés de antemano en qué rango vas a estar.",
  },
  {
    icon: Server,
    title: "Un servidor dedicado a tu empresa",
    description:
      "Tus automatizaciones, tus agentes y tu base de datos corren en una infraestructura propia, no en una plataforma compartida. Tus datos no se mezclan con los de nadie.",
  },
  {
    icon: LifeBuoy,
    title: "Lo que ya funciona sigue siendo asunto nuestro",
    description:
      "Si algo falla, se rompe una integración o cambia una herramienta que usás, lo resolvemos nosotros. No te quedás solo administrando un sistema que no construiste.",
  },
  {
    icon: Sprout,
    title: "Tu operación cambia y el sistema cambia con ella",
    description:
      "Cada mes aparecen necesidades nuevas. Esas también entran: el sistema no queda congelado el día que se entrega, crece junto con el negocio.",
  },
];

/** Orchestration only — staggerChildren must live in the parent's variant. */
const gridVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const Partnership = () => {
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
    <section id="modelo" className="relative px-4 py-32 md:px-6 lg:px-8 lg:py-52">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Nuestro modelo"
          title="Trabajamos como un socio, no como un proveedor"
          highlight="como un socio"
          description="La mayoría entrega un sistema, cobra y desaparece. Nosotros nos quedamos: acompañamos mes a mes, sostenemos lo que ya está funcionando y construimos lo que tu negocio vaya necesitando."
        />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={gridVariants}
          className="mt-20 grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-4"
        >
          {pillars.map((pillar) => (
            <motion.div key={pillar.title} variants={cardVariants}>
              <div className="group relative h-full rounded-[2rem] bg-white/[0.03] p-1.5 ring-1 ring-white/[0.06] transition-all duration-700 ease-spatial hover:ring-white/[0.14]">
                <div className="relative h-full overflow-hidden rounded-[1.625rem] bg-card p-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] lg:p-8">
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(60%_100%_at_50%_0%,hsl(var(--brand)/0.12),transparent)] opacity-0 transition-opacity duration-700 ease-spatial group-hover:opacity-100" />

                  <div className="relative">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.04] ring-1 ring-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition-transform duration-700 ease-spatial group-hover:scale-[1.06]">
                      <pillar.icon strokeWidth={1.25} className="h-5 w-5 text-brand" />
                    </div>
                    <h3 className="mt-6 font-display text-lg font-semibold tracking-tight text-foreground">
                      {pillar.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {pillar.description}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* The line the user wrote themselves. It closes the argument better
            than anything written around it, so it gets its own space. */}
        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={cardVariants}
          className="mx-auto mt-14 max-w-2xl text-center font-display text-xl font-medium tracking-tight text-foreground md:text-2xl"
        >
          No nos gusta entregar un sistema, cobrar y desaparecer.{" "}
          <span className="gradient-text">Preferimos el acompañamiento.</span>
        </motion.p>

        {/* Proof for the claim above: saying you are a partner means little
            if the client is contractually tied. */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={cardVariants}
          className="mt-8 flex justify-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-brand/25 bg-brand/[0.06] px-5 py-2.5 text-sm font-medium text-brand">
            <Check strokeWidth={2} className="h-4 w-4 shrink-0" />
            Cancelás cuando quieras, sin contrato de permanencia
          </span>
        </motion.div>
      </div>
    </section>
  );
};

export default Partnership;
