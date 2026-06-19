import { FadeUp } from "@/components/animations/FadeUp";

const logos = [
  { src: "/logosvg.svg", alt: "GannetLabs" },
  { src: "/logonuevaera.svg", alt: "Nueva Era" },
  { src: "/logotienda.svg", alt: "Tienda" },
];

const Clients = () => {
  // Duplicate the list so the marquee loops seamlessly (translateX -50%).
  const track = [...logos, ...logos, ...logos, ...logos];

  return (
    <section className="relative px-6 py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <FadeUp className="text-center">
          <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            Empresas que confían en GannetLabs
          </p>
        </FadeUp>

        <div className="relative mt-10 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
          <div className="flex w-max animate-marquee items-center gap-16">
            {track.map((logo, i) => (
              <img
                key={`${logo.alt}-${i}`}
                src={logo.src}
                alt={logo.alt}
                className="h-8 w-auto opacity-60 grayscale transition hover:opacity-100 hover:grayscale-0"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Clients;
