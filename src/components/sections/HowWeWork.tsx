import { ArrowRight } from "lucide-react";
import { FadeUp } from "@/components/animations/FadeUp";
import { Button } from "@/components/ui/button";
import SectionHeading from "@/components/sections/SectionHeading";

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

const HowWeWork = () => {
  return (
    <section id="como-trabajamos" className="relative px-6 py-32 lg:px-8 lg:py-52">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          title="Trabajamos con foco, claridad y validación rápida"
          highlight="validación rápida"
          description="Un proceso pensado para negocios que no tienen tiempo para proyectos interminables."
        />

        <div className="mt-20 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <FadeUp key={step.title} delay={i * 0.1}>
              <div className="relative h-full rounded-2xl border border-border/60 bg-card/60 p-6">
                <span className="font-display text-4xl font-bold text-brand/30">
                  0{i + 1}
                </span>
                <h3 className="mt-3 font-display text-lg font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
              </div>
            </FadeUp>
          ))}
        </div>

        <FadeUp delay={0.2} className="mt-12 flex justify-center">
          <Button asChild variant="hero" size="pillLg" className="gap-1.5">
            <a href="#contacto">
              Coordinar una llamada
              <ArrowRight className="h-4 w-4" />
            </a>
          </Button>
        </FadeUp>
      </div>
    </section>
  );
};

export default HowWeWork;
