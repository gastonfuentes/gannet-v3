import { ArrowUpRight } from "lucide-react";
import { FadeUp } from "@/components/animations/FadeUp";
import { Button } from "@/components/ui/button";
import SectionHeading from "@/components/sections/SectionHeading";
import { cn } from "@/lib/utils";

type ProductAccent = "mint" | "amber";

type Product = {
  name: string;
  badge: string;
  accent: ProductAccent;
  pitch: string;
  ctaLabel: string;
  href: string;
};

const accentStyles: Record<ProductAccent, { badge: string; hoverBorder: string }> = {
  mint: {
    badge: "border-brand/40 bg-brand/10 text-brand",
    hoverBorder: "hover:border-brand/40",
  },
  amber: {
    badge: "border-amber-400/40 bg-amber-400/10 text-amber-300",
    hoverBorder: "hover:border-amber-400/40",
  },
};

const products: Product[] = [
  {
    name: "GANNET OS",
    badge: "Para empresas en marcha",
    accent: "mint",
    pitch:
      "El sistema operativo inteligente de tu empresa: conecta toda su información y trabaja las 24 horas.",
    ctaLabel: "Conocer GANNET OS",
    href: "/gannet-os/",
  },
  {
    name: "Modulitia",
    badge: "Para emprendedores",
    accent: "amber",
    pitch: "El kit de herramientas de IA que crece con tu negocio, módulo a módulo.",
    ctaLabel: "Conocer Modulitia",
    href: "/modulitia/",
  },
];

const Products = () => {
  return (
    <section id="productos" className="relative px-6 py-32 lg:px-8 lg:py-52">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Productos"
          title="Estos son nuestros productos más vendidos"
          highlight="más vendidos"
          description="Dos productos propios, ya probados en empresas y emprendimientos reales. Elegí el que se ajusta a tu momento."
        />

        <div className="mt-20 grid gap-5 sm:grid-cols-2">
          {products.map((product, i) => {
            const accent = accentStyles[product.accent];
            return (
              <FadeUp key={product.name} delay={i * 0.1}>
                <div
                  className={cn(
                    "flex h-full flex-col rounded-2xl border border-border/60 bg-card/60 p-8 transition-colors",
                    accent.hoverBorder,
                  )}
                >
                  <span
                    className={cn(
                      "inline-flex w-fit items-center rounded-full border px-3 py-1 text-xs font-medium",
                      accent.badge,
                    )}
                  >
                    {product.badge}
                  </span>

                  <h3 className="mt-5 font-display text-2xl font-bold text-foreground">
                    {product.name}
                  </h3>
                  <p className="mt-3 flex-1 text-sm text-muted-foreground md:text-base">
                    {product.pitch}
                  </p>

                  <Button asChild variant="hero" size="pillLg" className="mt-8 w-fit gap-1.5">
                    <a href={product.href}>
                      {product.ctaLabel}
                      <ArrowUpRight className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </FadeUp>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Products;
