import { ArrowUpRight } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import SectionHeading from "@/components/sections/SectionHeading";

const solutions = [
  {
    title: "Agentes de IA y análisis de datos",
    description:
      "Asistentes que atienden consultas, clasifican leads y organizan información. Tableros que muestran lo que pasa en tu negocio. IA que resuelve problemas concretos, no experimentos.",
    tags: ["GPT-4", "Dashboards", "RAG", "Reportes"],
    price: "$800 USD/mes",
  },
  {
    title: "Automatizaciones operativas",
    description:
      "Eliminamos las tareas que se hacen a mano todos los días: notificaciones, reportes, sincronización de datos y seguimiento. Menos operación repetitiva, más tiempo para lo que importa.",
    tags: ["n8n", "Make", "Webhooks", "Zapier"],
    price: "$150 USD/mes",
  },
  {
    title: "E-commerce e integraciones",
    description:
      "Tiendas online integradas con stock, facturación, logística y CRM. Que vender online signifique más ventas, no más trabajo manual.",
    tags: ["Shopify", "WooCommerce", "APIs", "Pagos"],
    price: "$200 USD/mes",
  },
  {
    title: "Sitios web y landings conectadas",
    description:
      "Sitios rápidos, bien posicionados y conectados a tus procesos de negocio. No solo una vidriera digital: un sitio que captura leads y genera oportunidades reales.",
    tags: ["Next.js", "SEO", "CMS", "Analytics"],
    price: "$80 USD/mes",
  },
  {
    title: "Chatbots y atención automatizada",
    description:
      "Bots entrenados con tu información que responden preguntas, califican leads y derivan casos complejos a tu equipo. Atención 24/7 sin escalar el headcount.",
    tags: ["WhatsApp", "Web chat", "LLM", "Handoff"],
    price: "$200 USD/mes",
  },
  {
    title: "Reportes y tableros de decisión",
    description:
      "Centralizamos tus datos dispersos en un solo lugar y los convertimos en visualizaciones claras. Tomás decisiones con información real, no con Excel desactualizado.",
    tags: ["Metabase", "Power BI", "SQL", "ETL"],
    price: "$150 USD/mes",
  },
  {
    title: "CRM y gestión de clientes",
    description:
      "Implementamos y personalizamos tu CRM para que tu equipo comercial trabaje con contexto completo. Seguimiento de oportunidades, historial y automatización del pipeline.",
    tags: ["HubSpot", "Pipedrive", "Salesforce", "Custom"],
    price: "$200 USD/mes",
  },
  {
    title: "Software a medida",
    description:
      "Cuando ninguna herramienta existente resuelve exactamente tu problema, construimos la solución desde cero. Aplicaciones web internas, portales de clientes y herramientas operativas.",
    tags: ["Next.js", "Node.js", "PostgreSQL", "APIs"],
    price: "$500 USD/mes",
  },
];

const Solutions = () => {
  return (
    <section id="soluciones" className="relative px-6 py-32 lg:px-8 lg:py-52">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Soluciones"
          title="Qué podemos construir para tu negocio"
          highlight="para tu negocio"
          description="Cada solución está diseñada para resolver un problema real, no para impresionar con tecnología."
        />

        <div className="mt-20">
          <Carousel opts={{ align: "start" }} className="w-full">
            <CarouselContent className="-ml-4">
              {solutions.map((solution) => (
                <CarouselItem
                  key={solution.title}
                  className="pl-4 sm:basis-1/2 lg:basis-1/3"
                >
                  <div className="flex h-full flex-col rounded-2xl border border-border/60 bg-card/60 p-6 transition-colors hover:border-brand/40">
                    <h3 className="font-display text-lg font-semibold text-foreground">
                      {solution.title}
                    </h3>
                    <p className="mt-3 flex-1 text-sm text-muted-foreground">
                      {solution.description}
                    </p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {solution.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-border/60 bg-secondary/50 px-2.5 py-1 text-xs text-secondary-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="mt-6 flex items-center justify-between border-t border-border/50 pt-5">
                      <span className="text-sm font-semibold text-brand">
                        Desde {solution.price}
                      </span>
                      <Button asChild variant="ghost" size="sm" className="gap-1 text-xs">
                        <a href="#contacto">
                          Cotizar solución
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </a>
                      </Button>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="mt-8 flex items-center justify-center gap-3">
              <CarouselPrevious className="static translate-y-0" />
              <CarouselNext className="static translate-y-0" />
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default Solutions;
