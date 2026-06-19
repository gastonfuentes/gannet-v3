import { ArrowRight } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FadeUp } from "@/components/animations/FadeUp";
import { Button } from "@/components/ui/button";
import SectionHeading from "@/components/sections/SectionHeading";

const faqs = [
  {
    question: "¿Trabajan con negocios de cualquier tamaño?",
    answer:
      "Sí. Trabajamos con pymes, emprendimientos que quieren crecer y equipos internos de empresas medianas. El factor clave no es el tamaño: es que haya un problema real que resolver y ganas de mejorarlo con tecnología.",
  },
  {
    question: "¿Cuánto tiempo lleva un proyecto típico?",
    answer:
      "Depende del alcance. Un sitio web o una automatización simple puede estar lista en 2 a 4 semanas. Un sistema más complejo con integraciones y lógica de negocio puede llevar de 6 a 12 semanas. Siempre arrancamos con una propuesta clara de tiempos antes de empezar.",
  },
  {
    question: "¿Necesito tener todo claro antes de contactarlos?",
    answer:
      "No. Muchas veces el primer paso es entender juntos cuál es el problema real. Podés llegar con 'tengo este dolor' o 'quiero mejorar esto' y de ahí arrancamos. La primera conversación es sin compromiso.",
  },
  {
    question: "¿Qué pasa después de que entregan el proyecto?",
    answer:
      "Depende del acuerdo. Algunos proyectos son de entrega única con documentación y capacitación incluida. Otros tienen soporte continuo o mejoras iterativas. Lo definimos antes de empezar para que no haya sorpresas.",
  },
  {
    question: "¿Puedo seguir usando mis herramientas actuales?",
    answer:
      "Sí, en la mayoría de los casos. Antes de proponer cambiar algo, analizamos qué ya tenés y cómo aprovecharlo mejor. Rara vez es necesario tirar todo y empezar de cero. Preferimos construir sobre lo que funciona.",
  },
];

const FAQ = () => {
  return (
    <section id="faq" className="relative px-6 py-32 lg:px-8 lg:py-52">
      <div className="mx-auto max-w-3xl">
        <SectionHeading
          title="Preguntas frecuentes"
          description="Las dudas más comunes antes de arrancar."
        />

        <FadeUp delay={0.1} className="mt-12">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={faq.question}
                value={`item-${i}`}
                className="border-border/60"
              >
                <AccordionTrigger className="text-left font-display text-base font-medium text-foreground hover:text-brand hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </FadeUp>

        <FadeUp delay={0.2} className="mt-10 flex justify-center">
          <Button asChild variant="heroOutline" size="pill" className="gap-1.5">
            <a href="#contacto">
              Todavía tengo una duda
              <ArrowRight className="h-4 w-4" />
            </a>
          </Button>
        </FadeUp>
      </div>
    </section>
  );
};

export default FAQ;
