import { useState } from "react";
import { cn } from "@/lib/utils";

export type IntegrationNode = {
  name: string;
  category: string;
  /**
   * Logo resolution is convention-based: drop an SVG at
   * `public/logos/<slug>.svg` and it renders automatically. Until then the
   * node falls back to a typographic wordmark, so the diagram is never broken.
   */
  slug: string;
  /** Escape hatch for logos that already live elsewhere in `public/`. */
  logo?: string;
};

/** Ordered by adoption among the businesses GannetLabs sells to. */
export const INTEGRATION_NODES: IntegrationNode[] = [
  { name: "Odoo", category: "ERP", slug: "odoo" },
  { name: "Tango Gestión", category: "ERP", slug: "tango" },
  { name: "Tiendanube", category: "Ecommerce", slug: "tiendanube" },
  { name: "DUX Software", category: "ERP", slug: "dux" },
  { name: "HubSpot", category: "CRM", slug: "hubspot" },
  { name: "Mercado Libre", category: "Marketplace", slug: "mercadolibre" },
  { name: "SAP Business One", category: "ERP", slug: "sap" },
  { name: "Finnegans", category: "ERP", slug: "finnegans" },
  { name: "Fudo", category: "Gastronomía", slug: "fudo" },
  { name: "Tokko Broker", category: "Inmobiliarias", slug: "tokko" },
  { name: "Google Drive", category: "Documentos", slug: "drive" },
  { name: "Gmail", category: "Email", slug: "gmail" },
];

/** Diagram geometry, in viewBox percentage units shared by SVG and DOM. */
const HUB = { x: 50, y: 50 };
const RADIUS = { x: 38, y: 40 };
/** Where each connector starts and stops, as a fraction of node -> hub. */
const LINE_START = 0.12;
const LINE_END = 0.66;

/**
 * Spreads nodes over an ellipse, offset by half a step so none of them lands
 * directly above or below the hub.
 */
const positionFor = (index: number, total: number) => {
  const step = 360 / total;
  const angle = ((-90 + step / 2 + step * index) * Math.PI) / 180;
  return {
    x: HUB.x + RADIUS.x * Math.cos(angle),
    y: HUB.y + RADIUS.y * Math.sin(angle),
  };
};

const lerp = (from: number, to: number, t: number) => from + (to - from) * t;

/**
 * Renders the vendor logo, falling back to a wordmark when the asset is
 * missing. Logos are normalized to white so third-party brand colors stay
 * legible on the dark background.
 */
const NodeMark = ({ node }: { node: IntegrationNode }) => {
  const [failed, setFailed] = useState(false);
  const src = node.logo ?? `/logos/${node.slug}.svg`;

  if (failed) {
    return (
      <span className="text-center font-display text-[13px] font-semibold leading-tight text-foreground/90">
        {node.name}
      </span>
    );
  }

  return (
    <img
      src={src}
      alt={node.name}
      loading="lazy"
      onError={() => setFailed(true)}
      // Every logo ships a viewBox tightened to its own artwork, so the width
      // cap is what does the work; the height cap only guards the tallest.
      className="max-h-8 w-auto max-w-[92px] object-contain brightness-0 invert"
    />
  );
};

const NodeChip = ({ node }: { node: IntegrationNode }) => (
  <div className="group/node flex w-[132px] flex-col items-center gap-2">
    <div className="flex h-[58px] w-full items-center justify-center rounded-2xl bg-white/[0.04] px-3 opacity-80 ring-1 ring-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.07)] transition-all duration-700 ease-spatial group-hover/node:-translate-y-0.5 group-hover/node:opacity-100 group-hover/node:ring-brand/30">
      <NodeMark node={node} />
    </div>
    <span className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground/50">
      {node.category}
    </span>
  </div>
);

const Hub = () => (
  <div className="relative flex items-center justify-center">
    {/* Breathing halo. Sits behind the plate, never clipped by it. */}
    <div
      aria-hidden="true"
      className="pointer-events-none absolute h-[260px] w-[260px] rounded-full bg-[radial-gradient(circle,hsl(var(--brand)/0.22),transparent_65%)] motion-safe:animate-hub-pulse"
    />
    <div className="relative rounded-[2rem] bg-white/[0.06] p-1.5 ring-1 ring-brand/25">
      <div className="flex h-[100px] w-[200px] items-center justify-center rounded-[1.625rem] bg-card px-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.10)]">
        <img
          src="/logosvg.svg"
          alt="GannetLabs"
          className="h-auto w-[136px] object-contain"
        />
      </div>
    </div>
  </div>
);

const IntegrationsDiagram = ({ className }: { className?: string }) => {
  const total = INTEGRATION_NODES.length;

  return (
    <div className={cn("relative", className)}>
      {/* Desktop: the constellation. Every system converges on the hub. */}
      <div className="relative mx-auto hidden aspect-[16/10] w-full max-w-5xl lg:block">
        <svg
          aria-hidden="true"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full"
        >
          {INTEGRATION_NODES.map((node, i) => {
            const { x, y } = positionFor(i, total);
            return (
              <line
                key={node.slug}
                x1={lerp(x, HUB.x, LINE_START)}
                y1={lerp(y, HUB.y, LINE_START)}
                x2={lerp(x, HUB.x, LINE_END)}
                y2={lerp(y, HUB.y, LINE_END)}
                stroke="hsl(var(--brand))"
                strokeOpacity={0.35}
                strokeWidth={1.25}
                strokeDasharray="2 4"
                strokeLinecap="round"
                // Keeps hairlines even despite preserveAspectRatio="none".
                vectorEffect="non-scaling-stroke"
                style={{ animationDelay: `${i * 0.13}s` }}
                className="motion-safe:animate-dataflow"
              />
            );
          })}
        </svg>

        {INTEGRATION_NODES.map((node, i) => {
          const { x, y } = positionFor(i, total);
          return (
            <div
              key={node.slug}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${x}%`, top: `${y}%` }}
            >
              <NodeChip node={node} />
            </div>
          );
        })}

        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <Hub />
        </div>
      </div>

      {/* Below lg the constellation is unreadable: fall back to a plain grid. */}
      <div className="lg:hidden">
        <div className="flex justify-center">
          <Hub />
        </div>
        <div className="mt-10 grid grid-cols-2 justify-items-center gap-4 sm:grid-cols-3">
          {INTEGRATION_NODES.map((node) => (
            <NodeChip key={node.slug} node={node} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default IntegrationsDiagram;
