import { Target, Plug, Gauge, LineChart } from "lucide-react";
import { FadeUp } from "@/components/animations/FadeUp";
import SectionHeading from "@/components/sections/SectionHeading";

const reasons = [
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

const WhyGannet = () => {
  return (
    <section id="por-que" className="relative px-6 py-32 lg:px-8 lg:py-52">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Por qué GannetLabs"
          title="Tecnología aplicada con criterio de negocio"
          highlight="criterio de negocio"
          description="Somos un equipo que entiende de inteligencia artificial y de cómo funciona un negocio real. Tecnología como medio, no como fin."
        />

        <div className="mt-20 grid gap-5 sm:grid-cols-2">
          {reasons.map((reason, i) => (
            <FadeUp key={reason.title} delay={i * 0.1}>
              <div className="flex h-full gap-4 rounded-2xl border border-border/60 bg-card/60 p-6">
                <div className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-brand">
                  <reason.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold text-foreground">
                    {reason.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">{reason.description}</p>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyGannet;
