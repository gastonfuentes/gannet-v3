import { useState } from "react";
import { ArrowRight, ArrowUpRight, Menu, X } from "lucide-react";
import ShinyText from "@/components/animations/ShinyText";
import Logo from "@/components/icons/Logo";

// Video served locally from /public. Trimmed to its moving section (the original
// had ~1.6s of frozen frames at the end that broke the loop). See hero-bg.mp4.
const VIDEO_URL = "/hero-bg.mp4";

const navLinks = [
  { label: "Inicio", href: "#inicio" },
  { label: "Soluciones", href: "#soluciones" },
  { label: "Cómo trabajamos", href: "#como-trabajamos" },
  { label: "FAQ", href: "#faq" },
];

const HeroSection = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section id="inicio" className="relative h-screen w-full overflow-hidden bg-black font-sans">
      {/* Video Background */}
      <video
        className="absolute inset-0 z-0 h-full w-full object-cover"
        src={VIDEO_URL}
        autoPlay
        loop
        muted
        playsInline
      />
      {/* Overlay to keep text legible over the video */}
      <div className="absolute inset-0 z-0 bg-black/50" />

      {/* Foreground */}
      <div className="relative z-10 flex h-full flex-col">
        {/* Navigation */}
        <header className="mx-auto w-full max-w-7xl px-6 py-5 lg:px-8">
          <nav className="flex items-center justify-between">
            {/* Logo */}
            <a href="#inicio" className="flex items-center">
              <Logo className="h-7 w-auto" />
            </a>

            {/* Desktop nav pill */}
            <div className="hidden items-center gap-1 rounded-full border border-gray-700 px-2 py-1 lg:flex">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="rounded-full px-3 py-1.5 text-sm text-white/80 transition-colors hover:text-white"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#contacto"
                className="flex items-center gap-1 rounded-full px-3 py-1.5 text-sm text-white/80 transition-colors hover:text-white"
              >
                Contacto
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>

            {/* Mobile hamburger */}
            <button
              className="p-2 text-white lg:hidden"
              onClick={() => setIsOpen((v) => !v)}
              aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </nav>

          {/* Mobile menu */}
          {isOpen && (
            <div className="mt-4 flex flex-col gap-1 rounded-2xl border border-gray-700 bg-black/80 p-3 backdrop-blur lg:hidden">
              {[...navLinks, { label: "Contacto", href: "#contacto" }].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm text-white/80 transition-colors hover:text-white"
                >
                  {link.label}
                </a>
              ))}
            </div>
          )}
        </header>

        {/* Top context row */}
        <div className="mx-auto mt-4 w-full max-w-7xl px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-2">
            <p className="max-w-md text-sm text-white/80 md:text-base">
              Diseñamos automatizaciones, integraciones y agentes de IA para que vendas mejor,
              ahorres tiempo y tomes decisiones con información, no con intuición.
            </p>
            <p className="max-w-xs text-sm text-white/80 md:text-base lg:justify-self-end lg:text-right">
              8+ proyectos entregados en 3 países !
            </p>
          </div>
        </div>

        {/* Hero center block */}
        <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center px-6 text-center lg:px-8">
          <p className="text-xs uppercase tracking-tight text-white/80 md:text-sm">
            Software · Automatización · IA aplicada
          </p>

          <h1 className="mt-4 tracking-tighter text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl leading-[0.85]">
            <span className="block font-medium text-brand">Gannet</span>
            <span className="block font-medium text-white">Tecnología que</span>
            <ShinyText text="resuelve." className="block font-medium" baseColor="#7dda9a" speed={8} />
          </h1>

          <a
            href="#contacto"
            className="group mt-10 inline-flex items-center gap-2 rounded-full bg-black px-6 py-3 text-sm text-white transition-colors hover:bg-gray-900 md:px-8 md:py-4"
          >
            Agendar una reunión
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
