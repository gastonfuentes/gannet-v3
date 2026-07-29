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
