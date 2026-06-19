import { ArrowRight, Repeat, Database, TrendingDown, Unplug } from "lucide-react";
import { FadeUp } from "@/components/animations/FadeUp";
import { Button } from "@/components/ui/button";
import SectionHeading from "@/components/sections/SectionHeading";

const problems = [
  {
    icon: Repeat,
    title: "Procesos manuales",
    description:
      "Lo que podría automatizarse se hace a mano todos los días. Tiempo perdido, errores repetidos y un equipo atrapado en tareas operativas.",
  },
  {
    icon: Database,
    title: "Información dispersa",
    description:
      "Datos en WhatsApp, planillas, mails y sistemas que no se hablan. Sin una fuente clara, las decisiones se toman a ciegas.",
  },
  {
    icon: TrendingDown,
    title: "Ventas sin sistema",
    description:
      "Consultas que se enfrían, oportunidades sin seguimiento y ningún lugar claro donde ver qué pasa con cada venta.",
  },
  {
    icon: Unplug,
    title: "Tecnología sin integración",
    description:
      "Herramientas sueltas que no conversan entre sí. Trabajo duplicado, datos desactualizados y procesos que se caen entre los sistemas.",
  },
];

const Problems = () => {
  return (
    <section id="problemas" className="relative px-6 py-32 lg:px-8 lg:py-52">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          title="Muchos negocios no necesitan más herramientas. Necesitan que lo que ya hacen funcione mejor."
          highlight="funcione mejor"
          description="Si tu equipo pierde tiempo en lo operativo, las ventas se enfrían solas o las decisiones se toman sin datos claros, el problema no es falta de esfuerzo. Es falta de sistema."
        />

        <div className="mt-20 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {problems.map((problem, i) => (
            <FadeUp key={problem.title} delay={i * 0.1}>
              <div className="group h-full rounded-2xl border border-border/60 bg-card/60 p-6 transition-colors hover:border-brand/40">
                <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-brand">
                  <problem.icon className="h-5 w-5" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground">
                  {problem.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">{problem.description}</p>
              </div>
            </FadeUp>
          ))}
        </div>

        <FadeUp delay={0.2} className="mt-12 flex justify-center">
          <Button asChild variant="heroOutline" size="pillLg" className="gap-1.5">
            <a href="#soluciones">
              Ver cómo lo resolvemos
              <ArrowRight className="h-4 w-4" />
            </a>
          </Button>
        </FadeUp>
      </div>
    </section>
  );
};

export default Problems;
