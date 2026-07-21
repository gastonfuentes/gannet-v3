import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Check, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FadeUp } from "@/components/animations/FadeUp";
import SectionHeading from "@/components/sections/SectionHeading";

const CONTACT_EMAIL = "contacto@gannetlabs.com";

const contactSchema = z.object({
  name: z.string().min(2, "Ingresá tu nombre"),
  company: z.string().min(1, "Contanos tu empresa o proyecto"),
  email: z.string().email("Ingresá un email válido"),
  phone: z.string().optional(),
  message: z.string().min(10, "Contanos un poco más (mínimo 10 caracteres)"),
  // Honeypot: hidden from real users, so it must stay empty.
  website: z.string().max(0).optional(),
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
    formState: { errors, isSubmitting },
  } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", company: "", email: "", phone: "", message: "", website: "" },
  });

  const onSubmit = async (data: ContactForm) => {
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "gannetlabs",
          name: data.name,
          email: data.email,
          phone: data.phone,
          message: data.message,
          meta: { Empresa: data.company },
          website: data.website,
        }),
      });

      if (!response.ok) throw new Error("request failed");

      toast.success("¡Mensaje enviado!", {
        description: "Te respondemos en menos de 24 horas hábiles.",
      });
      reset();
    } catch {
      toast.error("No pudimos enviar el mensaje", {
        description: `Probá de nuevo o escribinos a ${CONTACT_EMAIL}.`,
      });
    }
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
              También podés escribirnos a{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="font-medium text-brand hover:underline"
              >
                {CONTACT_EMAIL}
              </a>
            </div>
          </FadeUp>
        </div>

        {/* Right: form */}
        <FadeUp delay={0.15}>
          <form
            onSubmit={handleSubmit(onSubmit)}
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
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="hola@ejemplo.com"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-xs text-destructive">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">
                  Teléfono <span className="text-muted-foreground">(opcional)</span>
                </Label>
                <Input id="phone" placeholder="+54 9 11 ..." {...register("phone")} />
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

            {/* Honeypot — hidden from users, catches bots that fill every field. */}
            <input
              type="text"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="hidden"
              {...register("website")}
            />

            <Button
              type="submit"
              variant="hero"
              size="pill"
              className="mt-6 w-full gap-1.5"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Enviando..." : "Agendar una reunión"}
              {!isSubmitting && <ArrowUpRight className="h-4 w-4" />}
            </Button>
          </form>
        </FadeUp>
      </div>
    </section>
  );
};

export default ContactCTA;
