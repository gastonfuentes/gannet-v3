import { FadeUp } from "@/components/animations/FadeUp";
import SectionHeading from "@/components/sections/SectionHeading";

const partners = [
  { name: "Nueva Era", src: "/logonuevaera.svg" },
  { name: "Tienda", src: "/logotienda.svg" },
  { name: "Dux", src: "/logoduxsvg.svg" },
];

const Verticals = () => {
  return (
    <section id="verticales" className="relative px-6 py-32 lg:px-8 lg:py-52">
      <div className="mx-auto max-w-7xl">
        <SectionHeading title="Partners estratégicos" highlight="estratégicos" />

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {partners.map((partner, i) => (
            <FadeUp key={partner.name} delay={i * 0.1}>
              <div className="flex h-32 items-center justify-center rounded-2xl border border-border/60 bg-card/60 p-8">
                <img
                  src={partner.src}
                  alt={partner.name}
                  className="max-h-12 w-auto opacity-80 transition hover:opacity-100"
                />
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Verticals;
