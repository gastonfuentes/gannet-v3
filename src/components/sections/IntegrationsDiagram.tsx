import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useReducedMotion } from "framer-motion";
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

/** Diagram geometry, in percentage units of the container. */
const HUB = { x: 50, y: 50 };
/**
 * Half-extents of the rectangle the nodes sit on. Roughly 2:1 once the
 * container's own aspect ratio is applied, so the constellation echoes the
 * card geometry the rest of the page is built from instead of reading as a
 * circle.
 */
const RECT = { x: 37, y: 32 };
/**
 * How far a node may sit off its exact slot: `along` runs parallel to its own
 * edge, `across` pushes it in or out.
 *
 * The asymmetry is what sells the shape. Sliding a node `along` its own edge
 * costs the silhouette nothing, so the long runs get a lot of it. Pushing a
 * node `across` its edge is what bends the outline, and the vertical edges are
 * the sensitive ones: those four nodes carry the left and right sides on their
 * own, so any real `across` wander bows them out into an oval or pinches them
 * into an hourglass. They stay nearly in line with the corners; the top and
 * bottom runs, which have empty space above and below and eight nodes to
 * average out, can wander freely.
 */
const SCATTER = {
  horizontal: { along: 4.4, across: 6.4 },
  vertical: { along: 1.2, across: 1.8 },
};
/** Hash salts picked so no node lands visibly in line with its neighbours. */
const SCATTER_SALT = { along: 0.37, across: 97.99 };
/**
 * Fraction of each vertical edge its nodes may use. Under 1 so they stay off
 * the corners, which sit close enough to collide once everything is drifting.
 */
const SIDE_SPAN = 0.85;
/** Where each connector starts and stops, as a fraction of node -> hub. */
const LINE_START = 0.12;
const LINE_END = 0.66;

/**
 * Stable pseudo-random in -1..1. A hash rather than Math.random so the layout
 * is byte-identical across renders and reloads.
 */
const scatterAt = (index: number, salt: number) => {
  const v = Math.sin((index + 1) * salt) * 10000;
  return (v - Math.floor(v)) * 2 - 1;
};

/**
 * Walks the nodes clockwise around the perimeter of RECT, starting top-left:
 * most of them along the long top and bottom runs, the rest down each side.
 * Corners are occupied on purpose — they are what makes the shape read as a
 * rectangle. Each slot is then nudged off the exact line so the result looks
 * hand-placed rather than plotted.
 */
const positionFor = (index: number, total: number) => {
  const perSide = Math.max(1, Math.round(total / 6));
  const topCount = Math.ceil((total - perSide * 2) / 2);
  const bottomCount = Math.max(1, total - perSide * 2 - topCount);
  /** Spreads n nodes end to end, corners included. */
  const run = (i: number, n: number) => (n > 1 ? i / (n - 1) : 0.5);
  /** Spreads n nodes around the middle of an edge, clear of both corners. */
  const between = (i: number, n: number) =>
    0.5 + SIDE_SPAN * ((i + 1) / (n + 1) - 0.5);

  let x: number;
  let y: number;
  /** Which axis the node's edge runs along, so scatter can follow it. */
  let horizontal: boolean;

  if (index < topCount) {
    x = -RECT.x + 2 * RECT.x * run(index, topCount);
    y = -RECT.y;
    horizontal = true;
  } else if (index < topCount + perSide) {
    x = RECT.x;
    y = -RECT.y + 2 * RECT.y * between(index - topCount, perSide);
    horizontal = false;
  } else if (index < topCount + perSide + bottomCount) {
    x = RECT.x - 2 * RECT.x * run(index - topCount - perSide, bottomCount);
    y = RECT.y;
    horizontal = true;
  } else {
    x = -RECT.x;
    y =
      RECT.y -
      2 *
        RECT.y *
        between(index - topCount - perSide - bottomCount, perSide);
    horizontal = false;
  }

  const scatter = horizontal ? SCATTER.horizontal : SCATTER.vertical;
  const along = scatterAt(index, SCATTER_SALT.along) * scatter.along;
  const across = scatterAt(index, SCATTER_SALT.across) * scatter.across;

  return {
    x: HUB.x + x + (horizontal ? along : across),
    y: HUB.y + y + (horizontal ? across : along),
  };
};

const lerp = (from: number, to: number, t: number) => from + (to - from) * t;

/**
 * Per-node Lissajous drift: amplitudes in px, frequencies in rad/ms.
 * Periods hover around 20-40s and are deliberately incommensurate so the
 * constellation never visibly repeats itself.
 */
const NODE_DRIFT = INTEGRATION_NODES.map((_, i) => ({
  ax: 8 + (i % 3) * 3,
  ay: 10 + ((i + 1) % 4) * 2.5,
  fx: (Math.PI * 2) / (26000 + (i % 5) * 4100),
  fy: (Math.PI * 2) / (21000 + (i % 4) * 5300),
  px: i * 1.7,
  py: i * 2.3,
}));

/** The hub breathes on its own, slightly slower than the satellites. */
const HUB_DRIFT = {
  ax: 6,
  ay: 8,
  fx: (Math.PI * 2) / 17000,
  fy: (Math.PI * 2) / 23000,
};

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
          draggable={false}
          className="h-auto w-[136px] select-none object-contain"
        />
      </div>
    </div>
  </div>
);

/**
 * The living constellation. Node and hub positions are recomputed every frame
 * from the same clock, and each connector is redrawn from those exact
 * positions — so no matter how far anything drifts (or gets dragged), the
 * lines stay attached by construction.
 */
const DesktopConstellation = () => {
  const reduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const lineRefs = useRef<(SVGLineElement | null)[]>([]);
  const hubFloatRef = useRef<HTMLDivElement | null>(null);
  const dragX = useMotionValue(0);
  const dragY = useMotionValue(0);
  const [size, setSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      // Bail on no-op resizes: the animation effect keys off this object, and
      // a fresh identity would tear the whole loop down and rebuild it.
      setSize((prev) =>
        prev.w === width && prev.h === height ? prev : { w: width, h: height },
      );
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || size.w === 0 || size.h === 0) return;

    const total = INTEGRATION_NODES.length;
    const bases = INTEGRATION_NODES.map((_, i) => {
      const p = positionFor(i, total);
      return { x: (p.x / 100) * size.w, y: (p.y / 100) * size.h };
    });
    const hubBase = { x: (HUB.x / 100) * size.w, y: (HUB.y / 100) * size.h };

    const tick = (t: number) => {
      // Under reduced motion nothing drifts, so the only thing left to track
      // is the drag offset — the node transforms stay untouched at zero.
      const hubDrift = reduceMotion
        ? { x: 0, y: 0 }
        : {
            x: HUB_DRIFT.ax * Math.sin(t * HUB_DRIFT.fx),
            y: HUB_DRIFT.ay * Math.sin(t * HUB_DRIFT.fy + 1.3),
          };
      const hub = {
        x: hubBase.x + hubDrift.x + dragX.get(),
        y: hubBase.y + hubDrift.y + dragY.get(),
      };
      if (hubFloatRef.current && !reduceMotion) {
        hubFloatRef.current.style.transform = `translate3d(${hubDrift.x}px, ${hubDrift.y}px, 0)`;
      }

      for (let i = 0; i < total; i++) {
        const d = NODE_DRIFT[i];
        const drift = reduceMotion
          ? { x: 0, y: 0 }
          : {
              x: d.ax * Math.sin(t * d.fx + d.px),
              y: d.ay * Math.sin(t * d.fy + d.py),
            };
        const node = { x: bases[i].x + drift.x, y: bases[i].y + drift.y };

        const nodeEl = nodeRefs.current[i];
        if (nodeEl && !reduceMotion) {
          nodeEl.style.transform = `translate3d(${drift.x}px, ${drift.y}px, 0)`;
        }

        const line = lineRefs.current[i];
        if (line) {
          line.setAttribute("x1", String(lerp(node.x, hub.x, LINE_START)));
          line.setAttribute("y1", String(lerp(node.y, hub.y, LINE_START)));
          line.setAttribute("x2", String(lerp(node.x, hub.x, LINE_END)));
          line.setAttribute("y2", String(lerp(node.y, hub.y, LINE_END)));
        }
      }

      frame = requestAnimationFrame(tick);
    };

    // Off screen the loop is genuinely cancelled, not just skipped, so a
    // section the visitor never scrolls to costs nothing.
    let frame = 0;
    const start = () => {
      if (frame) return;
      frame = requestAnimationFrame(tick);
    };
    const stop = () => {
      if (!frame) return;
      cancelAnimationFrame(frame);
      frame = 0;
    };

    const intersection = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) start();
      else stop();
    });
    intersection.observe(el);

    return () => {
      stop();
      intersection.disconnect();
    };
  }, [size, reduceMotion, dragX, dragY]);

  const total = INTEGRATION_NODES.length;
  const hubBase = { x: (HUB.x / 100) * size.w, y: (HUB.y / 100) * size.h };

  return (
    <div
      ref={containerRef}
      className="relative mx-auto hidden aspect-[16/9] w-full max-w-5xl lg:block"
    >
      {size.w > 0 && (
        <svg
          aria-hidden="true"
          viewBox={`0 0 ${size.w} ${size.h}`}
          className="absolute inset-0 h-full w-full"
        >
          {INTEGRATION_NODES.map((node, i) => {
            const p = positionFor(i, total);
            const base = { x: (p.x / 100) * size.w, y: (p.y / 100) * size.h };
            return (
              <line
                key={node.slug}
                ref={(elem) => {
                  lineRefs.current[i] = elem;
                }}
                x1={lerp(base.x, hubBase.x, LINE_START)}
                y1={lerp(base.y, hubBase.y, LINE_START)}
                x2={lerp(base.x, hubBase.x, LINE_END)}
                y2={lerp(base.y, hubBase.y, LINE_END)}
                stroke="hsl(var(--brand))"
                strokeOpacity={0.35}
                strokeWidth={1.25}
                // Period 12 matches the dataflow keyframe's 12px offset sweep,
                // so the dash march loops seamlessly.
                strokeDasharray="4 8"
                strokeLinecap="round"
                style={{ animationDelay: `${i * 0.13}s` }}
                className="motion-safe:animate-dataflow"
              />
            );
          })}
        </svg>
      )}

      {INTEGRATION_NODES.map((node, i) => {
        const { x, y } = positionFor(i, total);
        return (
          <div
            key={node.slug}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${x}%`, top: `${y}%` }}
          >
            <div
              ref={(elem) => {
                nodeRefs.current[i] = elem;
              }}
              style={{ willChange: "transform" }}
            >
              <NodeChip node={node} />
            </div>
          </div>
        );
      })}

      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <motion.div
          drag
          dragMomentum={false}
          dragSnapToOrigin
          dragElastic={reduceMotion ? 0 : 0.18}
          dragConstraints={{
            left: -size.w * 0.32,
            right: size.w * 0.32,
            top: -size.h * 0.3,
            bottom: size.h * 0.3,
          }}
          // The snap back to origin is an inertia animation built from
          // dragTransition, so this is where the spring has to be tuned.
          // Reduced motion keeps the interaction and overdamps it instead:
          // the hub returns without the springy overshoot, and without the
          // grab scale-up.
          dragTransition={
            reduceMotion
              ? { bounceStiffness: 1200, bounceDamping: 90 }
              : { bounceStiffness: 140, bounceDamping: 16 }
          }
          whileDrag={reduceMotion ? undefined : { scale: 1.04 }}
          style={{ x: dragX, y: dragY }}
          className="cursor-grab touch-none active:cursor-grabbing"
        >
          <div ref={hubFloatRef} style={{ willChange: "transform" }}>
            <Hub />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const IntegrationsDiagram = ({ className }: { className?: string }) => (
  <div className={cn("relative", className)}>
    {/* Desktop: the constellation. Every system converges on the hub. */}
    <DesktopConstellation />

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

export default IntegrationsDiagram;
