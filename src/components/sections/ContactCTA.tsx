import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Check, ArrowUpRight, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FadeUp } from "@/components/animations/FadeUp";
import SectionHeading from "@/components/sections/SectionHeading";

const WHATSAPP_NUMBER = "5491100000000";
const CONTACT_EMAIL = "hola@gannetlabs.com";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[+\d][\d\s()-]{6,}$/;

const contactSchema = z.object({
  name: z.string().min(2, "Ingresá tu nombre"),
  company: z.string().min(1, "Contanos tu empresa o proyecto"),
  contact: z
    .string()
    .min(1, "Dejanos un email o WhatsApp")
    .refine(
      (value) => emailRegex.test(value) || phoneRegex.test(value),
      "Ingresá un email o número de WhatsApp válido",
    ),
  message: z.string().min(10, "Contanos un poco más (mínimo 10 caracteres)"),
});

type ContactForm = z.infer<typeof contactSchema>;

const valuePoints = [
  "Sin formularios largos ni procesos lentos",
  "Respuesta en menos de 24 horas hábiles",
  "Si no podemos ayudarte, te lo decimos directo",
];

const ContactCTA = () => {
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", company: "", contact: "", message: "" },
  });

  const buildMessage = (data: ContactForm) =>
    `Hola GannetLabs! Soy ${data.name} de ${data.company}.\n` +
    `Contacto: ${data.contact}\n\n${data.message}`;

  const onWhatsApp = (data: ContactForm) => {
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildMessage(data))}`;
    window.open(url, "_blank", "noopener,noreferrer");
    toast.success("¡Mensaje listo!", {
      description:
        "Te abrimos WhatsApp con tu consulta. Te respondemos en menos de 24 horas hábiles.",
    });
    reset();
  };

  const onEmail = () => {
    const data = getValues();
    const subject = encodeURIComponent(`Consulta de ${data.name || "un nuevo proyecto"}`);
    const body = encodeURIComponent(buildMessage(data));
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  };

  return (
    <section id="contacto" className="relative px-6 py-32 lg:px-8 lg:py-52">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Left: copy */}
        <div>
          <SectionHeading
            align="left"
            title="Si tu negocio necesita más orden, mejores respuestas o procesos más simples, conversemos."
            highlight="conversemos"
            description="La primera conversación es sin compromiso. Nos contás qué está pasando y te decimos honestamente si podemos ayudarte y cómo."
          />

          <FadeUp delay={0.1}>
            <ul className="mt-8 space-y-3">
              {valuePoints.map((point) => (
                <li key={point} className="flex items-start gap-3 text-sm text-foreground/80">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                  {point}
                </li>
              ))}
            </ul>
          </FadeUp>

          <FadeUp delay={0.2}>
            <div className="mt-8 text-sm text-muted-foreground">
              ¿Preferís escribirnos directo?{" "}
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-brand hover:underline"
              >
                Escribinos por WhatsApp
              </a>
            </div>
          </FadeUp>
        </div>

        {/* Right: form */}
        <FadeUp delay={0.15}>
          <form
            onSubmit={handleSubmit(onWhatsApp)}
            className="rounded-2xl border border-border/60 bg-card/60 p-6 lg:p-8"
            noValidate
          >
            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre</Label>
                <Input id="name" placeholder="Tu nombre" {...register("name")} />
                {errors.name && (
                  <p className="text-xs text-destructive">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Empresa o proyecto</Label>
                <Input id="company" placeholder="Nombre de tu negocio" {...register("company")} />
                {errors.company && (
                  <p className="text-xs text-destructive">{errors.company.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact">Email o WhatsApp</Label>
                <Input
                  id="contact"
                  placeholder="hola@ejemplo.com o +54 9 11 ..."
                  {...register("contact")}
                />
                {errors.contact && (
                  <p className="text-xs text-destructive">{errors.contact.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">¿Qué estás intentando resolver?</Label>
                <Textarea
                  id="message"
                  rows={4}
                  placeholder="Contanos brevemente qué necesitás..."
                  {...register("message")}
                />
                {errors.message && (
                  <p className="text-xs text-destructive">{errors.message.message}</p>
                )}
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button
                type="submit"
                variant="hero"
                size="pill"
                className="flex-1 gap-1.5"
                disabled={isSubmitting}
              >
                Agendar una reunión
                <ArrowUpRight className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="heroOutline"
                size="pill"
                className="flex-1 gap-1.5"
                onClick={onEmail}
              >
                <Mail className="h-4 w-4" />
                Enviar por email
              </Button>
            </div>
          </form>
        </FadeUp>
      </div>
    </section>
  );
};

export default ContactCTA;
