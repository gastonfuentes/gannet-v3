import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useReducedMotion } from "framer-motion";
import { Layers, Sparkles, TrendingUp, type LucideIcon } from "lucide-react";
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

/**
 * Kept deliberately short. The point is not to list everything we integrate
 * with — it is that a visitor recognises their own stack at a glance, so every
 * entry has to be a name they already know.
 *
 * Order is load-bearing: the first eight fill the two rows, four each, and the
 * LAST one takes the lead slot beside the hub. A tenth entry would put five in
 * a row, which the width cannot hold.
 */
export const INTEGRATION_NODES: IntegrationNode[] = [
  { name: "Tango Gestión", category: "ERP", slug: "tango" },
  { name: "Tiendanube", category: "Ecommerce", slug: "tiendanube" },
  { name: "Mercado Libre", category: "Marketplace", slug: "mercadolibre" },
  { name: "HubSpot", category: "CRM", slug: "hubspot" },
  { name: "DUX Software", category: "ERP", slug: "dux" },
  { name: "Odoo", category: "ERP", slug: "odoo" },
  { name: "Gmail", category: "Email", slug: "gmail" },
  { name: "Google Drive", category: "Documentos", slug: "drive" },
  { name: "WhatsApp", category: "Mensajería", slug: "whatsapp" },
];

/**
 * The diagram reads left to right as one sentence: the tools you already use,
 * collected into one place, processed with AI, turned into decisions.
 * Positions are percentages of the container.
 */
const HUB = { x: 27, y: 50 };
const AI = { x: 54.8, y: 50 };
const OUTCOME = { x: 80.6, y: 50 };
/**
 * One source sits level with the hub and to its left, filling the pocket the
 * two rows leave open in the middle. It is the last entry in the node list.
 */
const LEAD = { x: 7, y: 50 };
/**
 * Source logos sit in two rows, above and below the hub rather than ringing it,
 * which is what frees the right-hand half for the rest of the journey.
 *
 * `offset` is the load-bearing number. A logo sitting directly above the hub
 * spends 54px leaving its own card and 76px arriving at the hub's before any
 * line is drawn, so the rows have to sit far enough out that what is left reads
 * as a connection rather than a stub. That is what sets the container's height.
 */
const ROW = { from: 7, to: 47, offset: 37.6 };
/**
 * Keeps the rows from looking like a spreadsheet. Both amplitudes are small,
 * and for different reasons: `along` is bounded by the gap between neighbours
 * in a row, `across` by the container edge just beyond each row.
 */
const SCATTER = { along: 0.4, across: 2.5 };
/** Hash salts picked so no logo lands exactly in line with its neighbours. */
const SCATTER_SALT = { along: 0.37, across: 97.99 };
/**
 * Clearance between a connector's tip and the card it points at, in px. A
 * fixed distance rather than a fraction of the span: the stages sit at very
 * different distances from each other, so a fraction would leave a different
 * gap at every card, which looks careless.
 */
const CONNECTOR_GAP = 14;
/**
 * Fallbacks for the first paint, before the real boxes can be measured. All
 * three journey cards are the same size, so one entry covers them.
 */
const CARD_BOX = { w: 200, h: 124 };
const CHIP_BOX = { w: 132, h: 81 };

/**
 * Stable pseudo-random in -1..1. A hash rather than Math.random so the layout
 * is byte-identical across renders and reloads.
 */
const scatterAt = (index: number, salt: number) => {
  const v = Math.sin((index + 1) * salt) * 10000;
  return (v - Math.floor(v)) * 2 - 1;
};

/**
 * Places one source. The last node in the list goes to the lead slot; the rest
 * split evenly across the two rows, spread end to end. Every slot is then
 * nudged off its exact position so the rows read as hand-placed, not plotted.
 */
const positionFor = (index: number, total: number) => {
  const along = scatterAt(index, SCATTER_SALT.along) * SCATTER.along;
  const across = scatterAt(index, SCATTER_SALT.across) * SCATTER.across;

  const rowed = total - 1;
  if (index >= rowed) {
    return { x: LEAD.x + along, y: LEAD.y + across };
  }

  const perRow = Math.ceil(rowed / 2);
  const onTop = index < perRow;
  const column = onTop ? index : index - perRow;
  const columns = onTop ? perRow : rowed - perRow;
  const t = columns > 1 ? column / (columns - 1) : 0.5;

  return {
    x: ROW.from + (ROW.to - ROW.from) * t + along,
    y: HUB.y + (onTop ? -ROW.offset : ROW.offset) + across,
  };
};

type Point = { x: number; y: number };

/**
 * Walks from `from` toward `to` and returns the point where the path leaves a
 * box of the given half-extents centred on `from`. Never travels past `to`.
 */
const boxExit = (from: Point, to: Point, halfW: number, halfH: number): Point => {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const spanX = Math.abs(dx) > 0.01 ? halfW / Math.abs(dx) : Infinity;
  const spanY = Math.abs(dy) > 0.01 ? halfH / Math.abs(dy) : Infinity;
  const t = Math.min(spanX, spanY, 1);
  return { x: from.x + dx * t, y: from.y + dy * t };
};

/**
 * The visible span of one connector: it leaves the first card and stops short
 * of the second. When the two clearances meet — which happens once the hub is
 * dragged close enough to something — the segment would flip backwards, so it
 * collapses to nothing instead.
 */
const connector = (from: Point, to: Point, fromHalf: Point, toHalf: Point) => {
  const start = boxExit(from, to, fromHalf.x, fromHalf.y);
  const end = boxExit(to, from, toHalf.x, toHalf.y);
  const forward = (end.x - start.x) * (to.x - from.x) + (end.y - start.y) * (to.y - from.y);
  return forward > 0 ? { start, end } : { start, end: start };
};

/** Half-extents plus the clearance, which is what the connector math wants. */
const halfWithGap = (w: number, h: number): Point => ({
  x: w / 2 + CONNECTOR_GAP,
  y: h / 2 + CONNECTOR_GAP,
});

/**
 * A Lissajous drift: amplitudes in px, frequencies in rad/ms, phases in rad.
 * Every field is required on purpose — a missing phase silently evaluates to
 * NaN, which propagates through every connector and erases the lines.
 */
type Drift = { ax: number; ay: number; fx: number; fy: number; px: number; py: number };

/**
 * Per-logo drift. Periods are deliberately incommensurate so the diagram never
 * visibly repeats. Amplitudes are modest because the horizontal spacing inside
 * a row is the tightest dimension in the layout.
 */
const NODE_DRIFT: Drift[] = INTEGRATION_NODES.map((_, i) => ({
  ax: 3 + (i % 3) * 1.5,
  ay: 6 + ((i + 1) % 4) * 2,
  fx: (Math.PI * 2) / (26000 + (i % 5) * 4100),
  fy: (Math.PI * 2) / (21000 + (i % 4) * 5300),
  px: i * 1.7,
  py: i * 2.3,
}));

/** The hub breathes on its own, slightly slower than the logos. */
const HUB_DRIFT: Drift = {
  ax: 6,
  ay: 8,
  fx: (Math.PI * 2) / 17000,
  fy: (Math.PI * 2) / 23000,
  px: 0,
  py: 1.3,
};

/** The two downstream stages drift gently, and out of step with the hub. */
const STAGE_DRIFT: Drift[] = [
  { ax: 4, ay: 6, fx: (Math.PI * 2) / 19000, fy: (Math.PI * 2) / 25000, px: 0.8, py: 2.1 },
  { ax: 5, ay: 7, fx: (Math.PI * 2) / 22000, fy: (Math.PI * 2) / 28000, px: 2.4, py: 0.6 },
];

const driftAt = (d: Drift, t: number) => ({
  x: d.ax * Math.sin(t * d.fx + d.px),
  y: d.ay * Math.sin(t * d.fy + d.py),
});

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
      // Wordmarks are bound by the width cap and square glyphs by the height
      // one, so the two caps are tuned independently: the taller height cap
      // only ever grows a square mark, which would otherwise read as small
      // next to a 92px wordmark.
      className="max-h-10 w-auto max-w-[92px] object-contain brightness-0 invert"
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

/**
 * The three cards warm up from left to right, so colour carries the reading
 * order on its own: the hub is the dark card the rest of the page is built
 * from, the middle one is tinted, and the payoff is the institutional green
 * at full strength. `--brand-foreground` exists precisely for text on top of
 * a solid brand fill, so the last card uses the pair rather than inventing a
 * contrast of its own.
 */
type Tone = "base" | "mid" | "peak";

const TONES: Record<
  Tone,
  { bezel: string; face: string; tint: boolean; plate: string; ink: string }
> = {
  base: {
    bezel: "bg-white/[0.06] ring-brand/25",
    face: "bg-card",
    tint: false,
    plate: "bg-white/[0.04] ring-white/[0.08]",
    ink: "text-foreground",
  },
  mid: {
    bezel: "bg-brand/[0.10] ring-brand/40",
    face: "bg-card",
    tint: true,
    plate: "bg-brand/[0.10] ring-brand/25",
    ink: "text-foreground",
  },
  peak: {
    bezel: "bg-brand/30 ring-brand/60",
    face: "bg-brand",
    tint: false,
    plate: "bg-brand-foreground/10 ring-brand-foreground/20",
    ink: "text-brand-foreground",
  },
};

/**
 * One beat of the journey. All three are the same size on purpose: this is a
 * sequence of equals, not a hub with satellites. What sets the first one apart
 * is the halo and the fact that you can grab it, not extra bulk.
 *
 * `select-none` matters on the hub. It is draggable, and without it a drag
 * starting on the label selects text instead of moving the card.
 */
const JourneyCard = ({
  icon: Icon,
  label,
  tone,
  halo = false,
}: {
  icon: LucideIcon;
  label: string;
  tone: Tone;
  halo?: boolean;
}) => {
  const t = TONES[tone];
  return (
    <div className="relative flex select-none items-center justify-center">
      {halo && (
        /* Breathing halo. Sits behind the plate, never clipped by it. */
        <div
          aria-hidden="true"
          className="pointer-events-none absolute h-[260px] w-[260px] rounded-full bg-[radial-gradient(circle,hsl(var(--brand)/0.22),transparent_65%)] motion-safe:animate-hub-pulse"
        />
      )}
      <div className={cn("relative rounded-[1.75rem] p-1.5 ring-1", t.bezel)}>
        <div
          className={cn(
            "relative flex h-[112px] w-[188px] flex-col items-center justify-center gap-2.5 overflow-hidden rounded-[1.375rem] px-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]",
            t.face,
          )}
        >
          {t.tint && (
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-brand/[0.12]" />
          )}
          {/* Same icon plate as the step cards below the diagram, so these
              read as part of the page's card system, not as an illustration. */}
          <div
            className={cn(
              "relative inline-flex h-10 w-10 items-center justify-center rounded-xl ring-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]",
              t.plate,
            )}
          >
            <Icon aria-hidden="true" strokeWidth={1.25} className={cn("h-[18px] w-[18px]", t.ink)} />
          </div>
          <p
            className={cn(
              "relative text-center font-display text-sm font-semibold leading-tight tracking-tight",
              t.ink,
            )}
          >
            {label}
          </p>
        </div>
      </div>
    </div>
  );
};

const Hub = () => (
  <JourneyCard icon={Layers} label="Toda tu información en un mismo lugar" tone="base" halo />
);

const STAGES: { icon: LucideIcon; label: string; tone: Tone }[] = [
  { icon: Sparkles, label: "Procesados con IA", tone: "mid" },
  { icon: TrendingUp, label: "Mejores decisiones", tone: "peak" },
];

/**
 * Every connector in the diagram is a swarm of dots rather than a dashed
 * line. Every dot leaves its card, but each one has its own reach, so the
 * swarm thins out on the way — only a few actually arrive, which is the
 * visual argument: lots of raw data goes in, less comes through.
 */
const STREAM_SIZE = 18;
/** Half-width of the funnel mouth at the source card, in px. */
const STREAM_SPREAD = 15;

/**
 * One dot in a stream. Every field is fixed at module load — the animation
 * only ever advances progress along the connector, so the swarm is
 * byte-identical across renders, just like the layout.
 */
type StreamParticle = {
  /** Where in the cycle this dot starts, 0..1. */
  phase: number;
  /** Cycle progress per ms. */
  speed: number;
  /** How far along the connector this dot survives, 0..1. */
  reach: number;
  /** Signed lateral offset at the funnel mouth, in px. */
  spread: number;
  /** Radius at the source, in px. */
  size: number;
  /** Amplitude and frequency of the in-flight wobble. */
  sway: number;
  swayFreq: number;
};

/** Companion to `scatterAt`: stable pseudo-random in 0..1 from one seed. */
const hash01 = (seed: number) => {
  const v = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return v - Math.floor(v);
};

const streamFor = (streamIndex: number): StreamParticle[] =>
  Array.from({ length: STREAM_SIZE }, (_, j) => {
    const seed = streamIndex * 100 + j;
    return {
      phase: hash01(seed + 17),
      speed: 1 / (2600 + hash01(seed + 29) * 1800),
      // Linear over 0.3..1, so roughly a fifth of the swarm crosses the final
      // stretch — enough dots to keep the hub visibly fed, few enough that
      // the taper reads.
      reach: 0.3 + 0.7 * hash01(seed),
      spread: (hash01(seed + 43) * 2 - 1) * STREAM_SPREAD,
      size: 1.1 + hash01(seed + 59) * 1.3,
      sway: 1 + hash01(seed + 71) * 2,
      swayFreq: (Math.PI * 2) / (2400 + hash01(seed + 83) * 2600),
    };
  });

/** Streams are per-connector and deterministic, so they live at module scope. */
const NODE_STREAMS: StreamParticle[][] = INTEGRATION_NODES.map((_, i) => streamFor(i));

/**
 * The two output legs, hub -> AI -> outcome. Seeded past the node range so
 * they never share a pattern with a source stream.
 */
const FLOW_STREAMS: StreamParticle[][] = [streamFor(50), streamFor(51)];

/**
 * Repaints one stream between the current endpoints. The funnel narrows on
 * `(1 - progress)^1.5`, so the swarm leaves the card wide and converges onto
 * the connector's axis well before the hub. With motion off the same dots
 * freeze at their own resting points instead of travelling.
 */
const paintStream = (
  circles: (SVGCircleElement | null)[],
  particles: StreamParticle[],
  start: Point,
  end: Point,
  t: number,
  frozen: boolean,
  alpha = 0.75,
) => {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const len = Math.hypot(dx, dy);
  for (let j = 0; j < particles.length; j++) {
    const dot = circles[j];
    if (!dot) continue;
    const p = particles[j];
    const progress = frozen ? p.phase * p.reach : (t * p.speed + p.phase) % 1;
    // Past its reach the dot has expired for this cycle; a collapsed
    // connector (hub dragged onto the card) has no axis to offset from.
    if (len < 1 || progress > p.reach) {
      dot.setAttribute("opacity", "0");
      continue;
    }
    const funnel = (1 - progress) ** 1.5;
    const wobble = frozen ? 0 : Math.sin(t * p.swayFreq + j) * p.sway * funnel;
    const lateral = p.spread * funnel + wobble;
    const x = start.x + dx * progress + (-dy / len) * lateral;
    const y = start.y + dy * progress + (dx / len) * lateral;
    // Born just off the card, gone just before its reach runs out — the
    // envelope keeps both ends of every dot's life from popping.
    const envelope = Math.min(progress / 0.07, (p.reach - progress) / 0.14, 1);
    dot.setAttribute("cx", String(x));
    dot.setAttribute("cy", String(y));
    dot.setAttribute("r", String(p.size * (1 - 0.35 * progress)));
    dot.setAttribute("opacity", String(Math.max(0, envelope) * alpha));
  }
};

/**
 * The living diagram. Every position is recomputed each frame from one clock,
 * and every connector is redrawn from those exact positions — so no matter how
 * far anything drifts, or how far the hub is dragged, the lines stay attached
 * by construction.
 */
const DesktopJourney = () => {
  const reduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const streamRefs = useRef<(SVGCircleElement | null)[][]>([]);
  const flowStreamRefs = useRef<(SVGCircleElement | null)[][]>([]);
  const hubFloatRef = useRef<HTMLDivElement | null>(null);
  const stageRefs = useRef<(HTMLDivElement | null)[]>([]);
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
    const toPx = (p: { x: number; y: number }) => ({
      x: (p.x / 100) * size.w,
      y: (p.y / 100) * size.h,
    });
    const bases = INTEGRATION_NODES.map((_, i) => toPx(positionFor(i, total)));
    const hubBase = toPx(HUB);
    const stageBases = [toPx(AI), toPx(OUTCOME)];

    // Measured once per layout, never inside the loop: reading offsetWidth
    // forces a synchronous layout, and doing that every frame would thrash.
    const hubEl = hubFloatRef.current;
    const chipEl = nodeRefs.current.find(Boolean);
    const hubHalf = halfWithGap(hubEl?.offsetWidth || CARD_BOX.w, hubEl?.offsetHeight || CARD_BOX.h);
    const chipHalf = halfWithGap(
      chipEl?.offsetWidth || CHIP_BOX.w,
      chipEl?.offsetHeight || CHIP_BOX.h,
    );
    const stageHalves = stageBases.map((_, i) => {
      const stageEl = stageRefs.current[i];
      return halfWithGap(
        stageEl?.offsetWidth || CARD_BOX.w,
        stageEl?.offsetHeight || CARD_BOX.h,
      );
    });

    const tick = (t: number) => {
      // Under reduced motion nothing drifts, so the only thing left to track
      // is the drag offset — the card transforms stay untouched at zero.
      const hubDrift = reduceMotion ? { x: 0, y: 0 } : driftAt(HUB_DRIFT, t);
      const hub = {
        x: hubBase.x + hubDrift.x + dragX.get(),
        y: hubBase.y + hubDrift.y + dragY.get(),
      };
      if (hubFloatRef.current && !reduceMotion) {
        hubFloatRef.current.style.transform = `translate3d(${hubDrift.x}px, ${hubDrift.y}px, 0)`;
      }

      const stages = stageBases.map((base, i) => {
        const drift = reduceMotion ? { x: 0, y: 0 } : driftAt(STAGE_DRIFT[i], t);
        const stageEl = stageRefs.current[i];
        if (stageEl && !reduceMotion) {
          stageEl.style.transform = `translate3d(${drift.x}px, ${drift.y}px, 0)`;
        }
        return { x: base.x + drift.x, y: base.y + drift.y };
      });

      for (let i = 0; i < total; i++) {
        const drift = reduceMotion ? { x: 0, y: 0 } : driftAt(NODE_DRIFT[i], t);
        const node = { x: bases[i].x + drift.x, y: bases[i].y + drift.y };

        const nodeEl = nodeRefs.current[i];
        if (nodeEl && !reduceMotion) {
          nodeEl.style.transform = `translate3d(${drift.x}px, ${drift.y}px, 0)`;
        }

        const { start, end } = connector(node, hub, chipHalf, hubHalf);
        paintStream(streamRefs.current[i] ?? [], NODE_STREAMS[i], start, end, t, !!reduceMotion);
      }

      // Output flow. Drawn hub -> AI -> outcome so the dots travel away from
      // the hub, which is what makes it read as a result rather than an input.
      // The output brightens toward the payoff, on the same ramp as the cards.
      const hubToAi = connector(hub, stages[0], hubHalf, stageHalves[0]);
      paintStream(flowStreamRefs.current[0] ?? [], FLOW_STREAMS[0], hubToAi.start, hubToAi.end, t, !!reduceMotion, 0.85);
      const aiToOutcome = connector(stages[0], stages[1], stageHalves[0], stageHalves[1]);
      paintStream(flowStreamRefs.current[1] ?? [], FLOW_STREAMS[1], aiToOutcome.start, aiToOutcome.end, t, !!reduceMotion, 1);

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

  return (
    <div
      ref={containerRef}
      className="relative mx-auto hidden aspect-[11/5] w-full max-w-7xl xl:block"
    >
      {size.w > 0 && (
        <svg
          aria-hidden="true"
          viewBox={`0 0 ${size.w} ${size.h}`}
          className="absolute inset-0 h-full w-full"
        >
          {INTEGRATION_NODES.map((node, i) => (
            <g key={node.slug} fill="hsl(var(--brand))">
              {NODE_STREAMS[i].map((_, j) => (
                <circle
                  key={j}
                  ref={(elem) => {
                    (streamRefs.current[i] ??= [])[j] = elem;
                  }}
                  // The first tick places every dot; until then they wait
                  // invisible so there is no one-frame pile at 0,0.
                  opacity={0}
                />
              ))}
            </g>
          ))}

          {FLOW_STREAMS.map((stream, i) => (
            <g key={`flow-${i}`} fill="hsl(var(--brand))">
              {stream.map((_, j) => (
                <circle
                  key={j}
                  ref={(elem) => {
                    (flowStreamRefs.current[i] ??= [])[j] = elem;
                  }}
                  opacity={0}
                />
              ))}
            </g>
          ))}
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

      <div
        className="absolute -translate-x-1/2 -translate-y-1/2"
        style={{ left: `${HUB.x}%`, top: `${HUB.y}%` }}
      >
        <motion.div
          drag
          dragMomentum={false}
          dragSnapToOrigin
          dragElastic={reduceMotion ? 0 : 0.18}
          // Asymmetric on purpose: there is open space to the left, but the
          // rest of the journey is to the right, and letting the hub bury the
          // AI card serves nobody.
          dragConstraints={{
            left: -size.w * 0.2,
            right: size.w * 0.1,
            top: -size.h * 0.28,
            bottom: size.h * 0.28,
          }}
          // The snap back to origin is an inertia animation built from
          // dragTransition, so this is where the spring has to be tuned.
          // Reduced motion keeps the interaction and overdamps it instead, so
          // the hub returns without the springy overshoot.
          dragTransition={
            reduceMotion
              ? { bounceStiffness: 1200, bounceDamping: 90 }
              : { bounceStiffness: 140, bounceDamping: 16 }
          }
          // Deliberately no scale-up while dragging: the connector gap is
          // computed from the hub's layout size, which a transform does not
          // change, so scaling the card visibly eats into that gap.
          style={{ x: dragX, y: dragY }}
          className="cursor-grab touch-none active:cursor-grabbing"
        >
          <div ref={hubFloatRef} style={{ willChange: "transform" }}>
            <Hub />
          </div>
        </motion.div>
      </div>

      {STAGES.map((stage, i) => {
        const at = i === 0 ? AI : OUTCOME;
        return (
          <div
            key={stage.label}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${at.x}%`, top: `${at.y}%` }}
          >
            <div
              ref={(elem) => {
                stageRefs.current[i] = elem;
              }}
              style={{ willChange: "transform" }}
            >
              <JourneyCard icon={stage.icon} label={stage.label} tone={stage.tone} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

/**
 * The stacked layout's links, seeded past both the node range and the desktop
 * flow legs so no two streams on the page share a pattern.
 */
const STACK_STREAMS: StreamParticle[][] = [streamFor(60), streamFor(61), streamFor(62)];

/** Canvas for one stacked link. Wide enough for the funnel mouth plus sway. */
const STACK_STREAM = { w: 72, h: 56 };

/**
 * The stacked counterpart to the desktop streams: the same swarm on one short
 * vertical run, in its own tiny SVG since there is no shared canvas here. The
 * endpoints never move, so each instance only needs its clock — it owns a
 * loop, pauses it off screen, and under reduced motion paints the frozen
 * scatter once instead of running at all.
 */
const StackStream = ({
  particles,
  alpha,
}: {
  particles: StreamParticle[];
  alpha?: number;
}) => {
  const reduceMotion = useReducedMotion();
  const svgRef = useRef<SVGSVGElement | null>(null);
  const dotRefs = useRef<(SVGCircleElement | null)[]>([]);

  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    const start = { x: STACK_STREAM.w / 2, y: 0 };
    const end = { x: STACK_STREAM.w / 2, y: STACK_STREAM.h };

    if (reduceMotion) {
      paintStream(dotRefs.current, particles, start, end, 0, true, alpha);
      return;
    }

    let frame = 0;
    const tick = (t: number) => {
      paintStream(dotRefs.current, particles, start, end, t, false, alpha);
      frame = requestAnimationFrame(tick);
    };
    const startLoop = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };
    const stopLoop = () => {
      if (!frame) return;
      cancelAnimationFrame(frame);
      frame = 0;
    };
    const intersection = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) startLoop();
      else stopLoop();
    });
    intersection.observe(el);
    return () => {
      stopLoop();
      intersection.disconnect();
    };
  }, [particles, alpha, reduceMotion]);

  return (
    <svg
      ref={svgRef}
      aria-hidden="true"
      viewBox={`0 0 ${STACK_STREAM.w} ${STACK_STREAM.h}`}
      width={STACK_STREAM.w}
      height={STACK_STREAM.h}
      className="mx-auto block"
    >
      <g fill="hsl(var(--brand))">
        {particles.map((_, j) => (
          <circle
            key={j}
            ref={(elem) => {
              dotRefs.current[j] = elem;
            }}
            opacity={0}
          />
        ))}
      </g>
    </svg>
  );
};

/**
 * Below xl the left-to-right journey has nowhere to go, so the same four beats
 * stack vertically instead. The order still tells the story: your tools, then
 * one place, then AI, then decisions.
 */
const StackedJourney = () => (
  <div className="xl:hidden">
    <div className="grid grid-cols-2 justify-items-center gap-4 sm:grid-cols-4">
      {INTEGRATION_NODES.map((node) => (
        <NodeChip key={node.slug} node={node} />
      ))}
    </div>
    <StackStream particles={STACK_STREAMS[0]} />
    <div className="flex justify-center">
      <Hub />
    </div>
    {STAGES.map((stage, i) => (
      <div key={stage.label}>
        {/* Same brightening ramp toward the payoff as the desktop flow. */}
        <StackStream particles={STACK_STREAMS[i + 1]} alpha={0.85 + i * 0.15} />
        <div className="flex justify-center">
          <JourneyCard icon={stage.icon} label={stage.label} tone={stage.tone} />
        </div>
      </div>
    ))}
  </div>
);

const IntegrationsDiagram = ({ className }: { className?: string }) => (
  <div className={cn("relative", className)}>
    <DesktopJourney />
    <StackedJourney />
  </div>
);

export default IntegrationsDiagram;
