import { Search, Plug, Sparkles } from "lucide-react";
import { FadeUp } from "@/components/animations/FadeUp";
import SectionHeading from "@/components/sections/SectionHeading";

const steps = [
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

const tools = [
  "DUX Software",
  "Tango",
  "Tienda Nube",
  "Google Drive",
  "Mercado Libre",
  "WhatsApp",
  "y las que uses vos",
];

const Integrations = () => {
  return (
    <section id="integraciones" className="relative px-6 py-32 lg:px-8 lg:py-52">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Nos adaptamos a vos"
          title="No cambies tu software. Nosotros nos adaptamos."
          highlight="No cambies tu software."
          description="Seguí usando DUX, Tango, Tienda Nube, Google Drive o lo que ya funciona en tu empresa. Nosotros nos integramos a esas herramientas, conectamos todo tu ecosistema y construimos soluciones con inteligencia artificial sobre él."
        />

        <div className="mt-20 grid gap-5 sm:grid-cols-3">
          {steps.map((step, i) => (
            <FadeUp key={step.title} delay={i * 0.1}>
              <div className="group h-full rounded-2xl border border-border/60 bg-card/60 p-6 transition-colors hover:border-brand/40">
                <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-brand">
                  <step.icon className="h-5 w-5" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
              </div>
            </FadeUp>
          ))}
        </div>

        <FadeUp delay={0.2} className="mt-12 flex flex-wrap justify-center gap-3">
          {tools.map((tool) => (
            <span
              key={tool}
              className="inline-flex items-center rounded-full border border-border/60 bg-secondary/40 px-4 py-2 text-sm font-medium text-foreground"
            >
              {tool}
            </span>
          ))}
        </FadeUp>
      </div>
    </section>
  );
};

export default Integrations;
