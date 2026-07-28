import {
  ArrowRight,
  Repeat,
  FileSearch,
  Compass,
  KeyRound,
  type LucideIcon,
} from "lucide-react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import SectionHeading from "@/components/sections/SectionHeading";
import { cn } from "@/lib/utils";

/** Heavy, physical easing shared by every transition in this section. */
const EASE_SPATIAL = [0.32, 0.72, 0, 1] as const;

type Problem = {
  icon: LucideIcon;
  title: string;
  description: string;
  /** Drives the asymmetric 6-column bento on large screens. */
  span: string;
  /** Only one card is featured: brighter bezel and a larger type scale. */
  featured?: boolean;
};

const problems: Problem[] = [
  {
    icon: Repeat,
    title: "Trabajo que nadie debería hacer",
    description:
      "Pasar datos de un lado a otro, cargar los mismos pedidos, armar el mismo informe cada lunes. Horas de gente capacitada en tareas que no piden criterio.",
    span: "lg:col-span-2",
  },
  {
    icon: FileSearch,
    title: "Información que nadie lee",
    description:
      "Mails, remitos, PDFs, planillas, audios de WhatsApp. La respuesta a tus preguntas ya está ahí adentro, pero abrir todo eso y sacar conclusiones no lo hace nadie.",
    span: "lg:col-span-4",
    featured: true,
  },
  {
    icon: Compass,
    title: "Decisiones tomadas a ojo",
    description:
      "Qué comprar, a qué cliente seguir, dónde se está yendo la plata. Se decide por intuición porque llegar al dato cuesta más que la decisión misma.",
    span: "lg:col-span-3",
  },
  {
    icon: KeyRound,
    title: "Todo pasa por la misma persona",
    description:
      "El criterio del negocio vive en la cabeza de dos o tres personas. Si no están, la operación se frena y nadie más sabe bien cómo se hacía.",
    span: "lg:col-span-3",
  },
];

const ProblemCard = ({ problem }: { problem: Problem }) => (
  // Outer shell of the double bezel: hairline tray the inner core sits in.
  <div
    className={cn(
      "group relative h-full rounded-[2rem] p-1.5 ring-1 transition-all duration-700",
      "ease-spatial",
      problem.featured
        ? "bg-white/[0.05] ring-white/[0.10] hover:ring-brand/30"
        : "bg-white/[0.03] ring-white/[0.06] hover:ring-white/[0.14]",
    )}
  >
    {/* Inner core: concentric radius (2rem - 0.375rem) and a top inset highlight. */}
    <div className="relative h-full overflow-hidden rounded-[1.625rem] bg-card p-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] lg:p-8">
      {/* Ambient brand glow, revealed on hover. Paint-only, no filters. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(60%_100%_at_50%_0%,hsl(var(--brand)/0.12),transparent)] opacity-0 transition-opacity duration-700 ease-spatial group-hover:opacity-100" />

      <div className="relative">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.04] ring-1 ring-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition-transform duration-700 ease-spatial group-hover:scale-[1.06]">
          <problem.icon strokeWidth={1.25} className="h-5 w-5 text-brand" />
        </div>

        <h3
          className={cn(
            "mt-6 font-display font-semibold tracking-tight text-foreground",
            problem.featured ? "text-2xl" : "text-lg",
          )}
        >
          {problem.title}
        </h3>
        <p
          className={cn(
            "mt-3 text-muted-foreground",
            problem.featured ? "max-w-xl text-base leading-relaxed" : "text-sm leading-relaxed",
          )}
        >
          {problem.description}
        </p>
      </div>
    </div>
  </div>
);

/** Orchestration only — staggerChildren must live in the parent's variant. */
const gridVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const Problems = () => {
  const reduceMotion = useReducedMotion();

  const cardVariants: Variants = {
    hidden: reduceMotion
      ? { opacity: 0 }
      : { opacity: 0, y: 64, filter: "blur(8px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: reduceMotion ? 0.3 : 0.9, ease: EASE_SPATIAL },
    },
  };

  return (
    <section id="problemas" className="relative px-4 py-32 md:px-6 lg:px-8 lg:py-52">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="El diagnóstico"
          title="Tu empresa ya genera toda la información que necesita. Nadie la está leyendo."
          highlight="Nadie la está leyendo."
          description="Nada de esto pasa por falta de esfuerzo. Pasa porque el trabajo de leer, cargar, buscar y cruzar información crece todos los días, y tu equipo no crece al mismo ritmo."
        />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={gridVariants}
          className="mt-20 grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-6"
        >
          {problems.map((problem) => (
            <motion.div key={problem.title} variants={cardVariants} className={problem.span}>
              <ProblemCard problem={problem} />
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={cardVariants}
          className="mt-14 flex justify-center"
        >
          <Button
            asChild
            variant="heroOutline"
            size="pillLg"
            className="group h-12 pr-2 transition-transform duration-500 ease-spatial active:scale-[0.98]"
          >
            <a href="#integraciones">
              Ver cómo lo resolvemos
              {/* Button-in-button: the arrow lives in its own nested island. */}
              <span className="ml-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/10 transition-transform duration-500 ease-spatial group-hover:translate-x-1 group-hover:scale-105">
                <ArrowRight strokeWidth={1.5} className="h-4 w-4" />
              </span>
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default Problems;
