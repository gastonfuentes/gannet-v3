import { useState } from "react";
import { ArrowRight, ArrowUpRight, Menu, X } from "lucide-react";
import ShinyText from "@/components/animations/ShinyText";
import RotatingText from "@/components/animations/RotatingText";
import Logo from "@/components/icons/Logo";

// Video served locally from /public. Trimmed to its moving section (the original
// had ~1.6s of frozen frames at the end that broke the loop). See hero-bg.mp4.
const VIDEO_URL = "/hero-bg.mp4";

// Module-level constant so RotatingText receives a stable array reference —
// required for its React.memo to actually prevent re-renders when
// HeroSection re-renders for unrelated reasons (e.g. toggling the mobile menu).
// The H1 reads as one sentence: "Gannet <phrase> con IA." Each phrase is a
// verb clause taking "Gannet" as its subject, so the three lines connect.
// Imperatives, so each phrase stands on its own as a full sentence. Kept
// within a narrow character range so the reserved box stays close to every
// phrase's natural width.
const HERO_ROTATING_PHRASES = [
  "Potenciá tu negocio",
  "Conectá tus sistemas",
  "Ordená tu operación",
  "Automatizá tus tareas",
  "Integrá tu ecosistema",
];

// Shared by the rotating phrase and the fixed "con IA." that closes it —
// they read as one sentence, so they share a size.
//
// The line height rides along in the `text-{size}/{leading}` shorthand on
// purpose: Tailwind's `text-*` utilities also set `line-height` (`text-7xl`
// ships `line-height: 1`), and a responsive variant sits in a later media
// query than a standalone `leading-*`, so it would win the cascade and
// silently override it. 1.4 clears the font's ~1.25em content area, which
// the rotating phrase's `overflow-hidden` mask would otherwise clip.
// Sizes are arbitrary rather than Tailwind steps: the next step up at this
// scale is ~33% larger, which overflows the line, so each breakpoint sits
// about 12% above the step below it.
const HERO_LINE_SIZE =
  "text-[1.7rem]/[1.4] font-medium sm:text-[2.1rem]/[1.4] md:text-[3.4rem]/[1.4] lg:text-[4.2rem]/[1.4] xl:text-[5rem]/[1.4]";

const navLinks = [
  { label: "Inicio", href: "#inicio" },
  { label: "Productos", href: "#productos" },
  { label: "Integraciones", href: "#integraciones" },
  { label: "Cómo trabajamos", href: "#como-trabajamos" },
  { label: "FAQ", href: "#faq" },
];

const HeroSection = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section id="inicio" className="relative min-h-[100dvh] w-full overflow-hidden bg-black font-sans">
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
      {/* Matches the section's min-height: a percentage `h-full` would not
          resolve against a min-height-only parent, collapsing the centering. */}
      <div className="relative z-10 flex min-h-[100dvh] flex-col">
        {/* Navigation */}
        <header className="mx-auto w-full max-w-7xl px-6 py-5 lg:px-8">
          {/* Three tracks so the nav pill is centered against the header
              itself, not against the space the logo leaves over. */}
          <nav className="grid grid-cols-[1fr_auto_1fr] items-center">
            {/* Logo */}
            <a href="#inicio" className="flex items-center justify-self-start">
              <Logo className="h-7 w-auto" />
            </a>

            {/* Desktop nav pill */}
            <div className="hidden items-center gap-3 lg:flex">
              <div className="flex items-center gap-1 rounded-full border border-gray-700 px-2 py-1">
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
            </div>

            {/* Mobile hamburger. Pinned to the third track: the desktop pill
                is `display: none` here, so it generates no grid cell and the
                button would otherwise slide into the middle one. */}
            <button
              className="col-start-3 justify-self-end p-2 text-white lg:hidden"
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

        {/* Hero center block */}
        <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center px-6 text-center lg:px-8">
          {/* Sets up the rotating headline below it. From `md` up, each clause
              is a block so the sentence breaks exactly where intended; below
              that they stay inline and reflow naturally. The wider measure at
              `md` is what keeps the longest clause on one line instead of
              wrapping and turning three lines into four. Line height rides in
              the `text-{size}/{leading}` shorthand: a standalone `leading-*`
              loses the cascade to a responsive `text-*`. */}
          <p className="mb-8 max-w-md text-[13px]/[1.65] text-white/80 md:mb-10 md:max-w-2xl md:text-[15px]/[1.65]">
            <span className="md:block">Conectamos las herramientas que ya usás</span>{" "}
            <span className="md:block">
              y construimos soluciones con inteligencia artificial sobre ellas:
            </span>{" "}
            <span className="md:block">vendé mejor, ahorrá tiempo y decidí con datos.</span>
          </p>

          <h1 className="tracking-tighter">
            {/* Stable full heading for screen readers and crawlers — the
                animated content below is decorative and hidden from them. */}
            <span className="sr-only">
              Potenciá tu negocio con inteligencia artificial
            </span>
            <span className="block" aria-hidden="true">
              {/* The rotating phrase and "con IA." share one line and read as
                  a single sentence. The leading that keeps the mask from
                  clipping descenders lives in HERO_LINE_SIZE. */}
              <span
                className={`flex flex-wrap items-start justify-center gap-x-[0.25em] ${HERO_LINE_SIZE}`}
              >
                <RotatingText
                  phrases={HERO_ROTATING_PHRASES}
                  align="end"
                  className="tracking-tight text-white"
                />
                <ShinyText text="con IA." baseColor="#7dda9a" speed={8} />
              </span>
            </span>
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
