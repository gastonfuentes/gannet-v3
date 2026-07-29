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

// Ordered by how much anxiety each question causes, not by business logic:
// price and data security block the decision, so they come first. Nobody
// scrolls to the ninth item to find out whether they can afford you.
const faqs = [
  {
    question: "¿Qué incluye la suscripción mensual?",
    answer:
      "El soporte de todo lo que ya está funcionando y las nuevas soluciones que tu negocio vaya necesitando. No nos gusta entregar un sistema, cobrar y desaparecer: preferimos ser un socio de tu empresa, que entiende cómo trabajás y mejora tus herramientas mes a mes.",
  },
  {
    question: "¿Qué pasa con mis datos? ¿Es seguro?",
    answer:
      "Cada cliente tiene su propio servidor privado y su propia base de datos. Tus datos no se mezclan con los de otras empresas ni viven en una plataforma compartida: corren en una infraestructura dedicada a tu negocio. Nos conectamos a tus sistemas solo con los permisos que vos nos habilitás y podés revocarlos cuando quieras. Tu información tampoco se usa para entrenar modelos de inteligencia artificial. Y si tu empresa necesita firmar un acuerdo de confidencialidad, lo firmamos.",
  },
  {
    question: "¿Qué pasa si en algún momento dejo el servicio?",
    answer:
      "Cancelás cuando quieras, sin contrato de permanencia. Te exportamos tu base de datos completa, así que los datos son tuyos y te los llevás siempre. Lo que no se transfiere es el desarrollo: las automatizaciones, los agentes y las integraciones que construimos.",
  },
  {
    question: "¿Trabajan con negocios de cualquier tamaño?",
    answer:
      "Sí. Trabajamos con pymes, emprendimientos que quieren crecer y equipos internos de empresas medianas. El factor clave no es el tamaño: es que haya un problema real que resolver y ganas de mejorarlo con tecnología.",
  },
  {
    question: "¿Qué significa que aplican inteligencia artificial?",
    answer:
      "Que tus sistemas no solo guardan información: la usan. Construimos agentes y automatizaciones que leen tus datos reales —ventas, stock, clientes, documentos— y responden, clasifican, avisan y ejecutan tareas por tu equipo. Todo conectado a tus herramientas vía API.",
  },
  {
    question: "¿Cuánto tiempo lleva ver la primera solución funcionando?",
    answer:
      "Depende del alcance, pero trabajamos para que veas algo andando rápido. Una automatización simple puede estar lista en 2 a 4 semanas. Una integración entre varios sistemas, con lógica de negocio más compleja, puede llevar de 6 a 12. Siempre arrancamos con una propuesta clara de tiempos.",
  },
  {
    question: "¿Y si mi software es viejo o no tiene API?",
    answer:
      "Casi siempre hay una forma de conectarlo, aunque no sea la obvia: exportaciones automáticas, lectura de archivos, acceso a la base de datos o procesar los documentos que el sistema ya genera. Y si de verdad no hay manera, te lo decimos de entrada en lugar de hacerte perder tiempo.",
  },
  {
    question: "¿Necesito tener a alguien técnico en mi equipo?",
    answer:
      "No. De la parte técnica nos ocupamos nosotros, y te dejamos todo listo para usar con capacitación para tu equipo. Lo que sí necesitamos es alguien que conozca bien cómo funciona el negocio: esa persona nos sirve más que un perfil técnico.",
  },
  {
    question: "¿Necesito tener todo claro antes de contactarlos?",
    answer:
      "No. Muchas veces el primer paso es entender juntos cuál es el problema real. Podés llegar con 'tengo este dolor' o 'quiero mejorar esto' y de ahí arrancamos. La primera conversación es sin compromiso.",
  },
];

const FAQ = () => {
  return (
    <section id="faq" className="relative px-4 py-32 md:px-6 lg:px-8 lg:py-52">
      <div className="mx-auto max-w-3xl">
        <SectionHeading
          eyebrow="Preguntas frecuentes"
          title="Las dudas más comunes antes de arrancar"
          highlight="antes de arrancar"
        />

        <FadeUp delay={0.1} className="mt-16">
          {/* Each question is its own bezel, so an open answer reads as one
              object rather than as text spilling out of a list. */}
          <Accordion type="single" collapsible className="flex w-full flex-col gap-3">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={faq.question}
                value={`item-${i}`}
                className="group/faq rounded-[1.75rem] border-0 bg-white/[0.03] p-1.5 ring-1 ring-white/[0.06] transition-all duration-700 ease-spatial hover:ring-white/[0.14] data-[state=open]:ring-brand/25"
              >
                <div className="overflow-hidden rounded-[1.375rem] bg-card px-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                  <AccordionTrigger className="py-5 text-left font-display text-base font-medium tracking-tight text-foreground hover:no-underline data-[state=open]:text-brand">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="pb-5 text-sm leading-relaxed text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </div>
              </AccordionItem>
            ))}
          </Accordion>
        </FadeUp>

        <FadeUp delay={0.2} className="mt-12 flex justify-center">
          <Button
            asChild
            variant="heroOutline"
            size="pillLg"
            className="group/cta h-12 pr-2 transition-transform duration-500 ease-spatial active:scale-[0.98]"
          >
            <a href="#contacto">
              Todavía tengo una duda
              {/* Button-in-button: the arrow gets its own island. */}
              <span className="ml-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/10 transition-transform duration-500 ease-spatial group-hover/cta:translate-x-1 group-hover/cta:scale-105">
                <ArrowRight strokeWidth={1.5} className="h-4 w-4" />
              </span>
            </a>
          </Button>
        </FadeUp>
      </div>
    </section>
  );
};

export default FAQ;
