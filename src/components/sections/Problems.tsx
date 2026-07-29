import {
  ArrowRight,
  ScanSearch,
  TrendingDown,
  Compass,
  type LucideIcon,
} from "lucide-react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import SectionHeading from "@/components/sections/SectionHeading";
import { cn } from "@/lib/utils";

/** Heavy, physical easing shared by every transition in this section. */
const EASE_SPATIAL = [0.32, 0.72, 0, 1] as const;

type Panel = {
  icon: LucideIcon;
  kicker: string;
  items: string[];
  /** Drives the asymmetric 6-column bento on large screens. */
  span: string;
  /** The consequence panel carries a brighter bezel and brand-tinted markers. */
  featured?: boolean;
};

const panels: Panel[] = [
  {
    icon: ScanSearch,
    kicker: "¿Te resulta familiar alguna de estas situaciones?",
    items: [
      "Hay tareas repetitivas que consumen demasiado tiempo.",
      "La información está distribuida entre Excel, WhatsApp, correos y distintos sistemas.",
      "Los procesos dependen demasiado de personas específicas.",
      "Se pierde tiempo buscando información o realizando seguimientos manuales.",
      "Existen oportunidades de mejora, pero no está claro por dónde empezar.",
      "La tecnología actual ya no acompaña el crecimiento de la empresa.",
    ],
    span: "lg:col-span-3",
  },
  {
    icon: TrendingDown,
    kicker: "Mientras estos problemas siguen presentes...",
    items: [
      "Se invierten horas en tareas que podrían automatizarse.",
      "Se generan errores, demoras y costos innecesarios.",
      "La información llega tarde o es difícil de analizar.",
      "Se pierden oportunidades comerciales y de mejora.",
      "El crecimiento depende de trabajar más, en lugar de trabajar mejor.",
    ],
    span: "lg:col-span-3",
    featured: true,
  },
];

/** Hairline tray + concentric inner core: the shared card anatomy of the site. */
const Bezel = ({
  featured,
  className,
  children,
}: {
  featured?: boolean;
  className?: string;
  children: React.ReactNode;
}) => (
  <div
    className={cn(
      "group relative h-full rounded-[2rem] p-1.5 ring-1 transition-all duration-700",
      "ease-spatial",
      featured
        ? "bg-white/[0.05] ring-white/[0.10] hover:ring-brand/30"
        : "bg-white/[0.03] ring-white/[0.06] hover:ring-white/[0.14]",
    )}
  >
    {/* Inner core: concentric radius (2rem - 0.375rem) and a top inset highlight. */}
    <div
      className={cn(
        "relative h-full overflow-hidden rounded-[1.625rem] bg-card p-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] lg:p-8",
        className,
      )}
    >
      {/* Ambient brand glow, revealed on hover. Paint-only, no filters. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(60%_100%_at_50%_0%,hsl(var(--brand)/0.12),transparent)] opacity-0 transition-opacity duration-700 ease-spatial group-hover:opacity-100" />
      <div className="relative">{children}</div>
    </div>
  </div>
);

const IconChip = ({ icon: Icon }: { icon: LucideIcon }) => (
  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.04] ring-1 ring-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition-transform duration-700 ease-spatial group-hover:scale-[1.06]">
    <Icon strokeWidth={1.25} className="h-5 w-5 text-brand" />
  </div>
);

const PanelCard = ({ panel }: { panel: Panel }) => (
  <Bezel featured={panel.featured}>
    <IconChip icon={panel.icon} />

    <h3 className="mt-6 font-display text-lg font-semibold tracking-tight text-foreground">
      {panel.kicker}
    </h3>

    <ul className="mt-6 space-y-4">
      {panel.items.map((item) => (
        <li key={item} className="flex gap-3.5 text-sm leading-relaxed text-muted-foreground">
          {/* Typographic marker only — this section carries no illustrations.
              The h-6 wrapper centres the dot on the first line of text. */}
          <span aria-hidden className="flex h-6 w-1 shrink-0 items-center">
            <span
              className={cn(
                "h-1 w-1 rounded-full",
                panel.featured ? "bg-brand/70" : "bg-white/25",
              )}
            />
          </span>
          {item}
        </li>
      ))}
    </ul>
  </Bezel>
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
          eyebrow="Entendemos tu empresa"
          title="La mayoría de las empresas no necesita más herramientas. Necesita que las que ya tiene trabajen mejor juntas."
          highlight="que las que ya tiene trabajen mejor juntas."
          description="Antes de hablar de tecnología, entendemos cómo funciona tu empresa. Cada negocio tiene procesos, personas y desafíos distintos. Por eso, el primer paso no es ofrecer una solución, sino identificar qué está frenando el crecimiento."
        />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={gridVariants}
          className="mt-20 grid grid-cols-1 gap-4 md:gap-5 lg:grid-cols-6"
        >
          {panels.map((panel) => (
            <motion.div key={panel.kicker} variants={cardVariants} className={panel.span}>
              <PanelCard panel={panel} />
            </motion.div>
          ))}

          {/* Closing statement: full width, and the only card that owns the CTA. */}
          <motion.div variants={cardVariants} className="lg:col-span-6">
            <Bezel featured className="lg:p-12">
              <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
                <div className="max-w-2xl">
                  <IconChip icon={Compass} />

                  <h3 className="mt-6 font-display text-2xl font-semibold tracking-tight text-foreground">
                    Ahí es donde comenzamos.
                  </h3>
                  <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                    Analizamos los procesos, detectamos oportunidades y diseñamos soluciones
                    tecnológicas que generan un impacto real en la operación diaria.
                  </p>
                  <p className="mt-4 text-base leading-relaxed text-foreground/90">
                    No implementamos tecnología porque sí. La implementamos donde realmente
                    aporta valor.
                  </p>
                </div>

                <Button
                  asChild
                  variant="heroOutline"
                  size="pillLg"
                  className="group/cta h-12 shrink-0 self-start pr-2 transition-transform duration-500 ease-spatial active:scale-[0.98]"
                >
                  <a href="#integraciones">
                    Ver cómo lo resolvemos
                    {/* Button-in-button: the arrow lives in its own nested island. */}
                    <span className="ml-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/10 transition-transform duration-500 ease-spatial group-hover/cta:translate-x-1 group-hover/cta:scale-105">
                      <ArrowRight strokeWidth={1.5} className="h-4 w-4" />
                    </span>
                  </a>
                </Button>
              </div>
            </Bezel>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Problems;
