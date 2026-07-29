import { FadeUp } from "@/components/animations/FadeUp";
import { cn } from "@/lib/utils";

// Actual clients only. GannetLabs' own logo used to sit here, which undercut
// the claim above it, and Tiendanube belongs with the partners instead.
// Nueva Era is both a client and a partner, so it appears in both sections.
const logos = [
  { src: "/logonuevaera.svg", alt: "Nueva Era" },
  { src: "/logos/ersa.svg", alt: "Ersa" },
  { src: "/logos/laseis.svg", alt: "La Seis" },
  // Negative mark: a solid shape with the wordmark knocked out of it. Forcing
  // it white would flatten shape and text into one blob, so it only gets
  // inverted — the shape turns white and the lettering stays readable.
  { src: "/logos/motopartes.svg", alt: "Moto Partes Sur", negative: true },
];

const Clients = () => {
  // Duplicate the list so the marquee loops seamlessly (translateX -50%).
  const track = [...logos, ...logos, ...logos, ...logos];

  return (
    <section className="relative px-4 py-24 md:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <FadeUp className="flex justify-center">
          <span className="inline-flex items-center rounded-full border border-border/60 bg-secondary/40 px-3 py-1 text-xs font-medium text-brand">
            Empresas que confían en GannetLabs
          </span>
        </FadeUp>

        <div className="relative mt-10 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
          <div className="flex w-max animate-marquee items-center gap-16">
            {track.map((logo, i) => (
              <img
                key={`${logo.alt}-${i}`}
                src={logo.src}
                alt={logo.alt}
                loading="lazy"
                className={cn(
                  "w-auto opacity-60 transition duration-700 ease-spatial hover:opacity-100",
                  // Normalized to white rather than grayscaled: these marks are
                  // dark, and grayscale would leave them invisible on navy.
                  logo.negative ? "max-h-12 invert" : "h-8 brightness-0 invert",
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Clients;
