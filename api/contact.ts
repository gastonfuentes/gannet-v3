import { z } from "zod";

/**
 * Contact endpoint shared by the three sites (landing, Modulitia, GANNET OS).
 * They all live on the same domain, so the static pages can post here too.
 *
 * The `source` field is what tells the three apart in the inbox.
 */

const SOURCE_LABELS = {
  gannetlabs: "GANNETLABS",
  modulitia: "MODULITIA",
  "gannet-os": "GANNET OS",
} as const;

const contactSchema = z.object({
  source: z.enum(["gannetlabs", "modulitia", "gannet-os"]),
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().max(50).optional(),
  message: z.string().trim().min(10).max(2000),
  /** Per-site extra fields, rendered as a list in the email body. */
  meta: z.record(z.string().max(200)).optional(),
  /**
   * Honeypot. Real users never see this field, so it must stay empty.
   * Accepts any string on purpose: a filled one is handled below with a fake
   * success, so the bot never learns it was rejected.
   */
  website: z.string().max(200).nullish(),
});

/**
 * Environment variables are typed into a dashboard by hand, and wrapping the
 * value in quotes is the usual slip: the quotes become part of the string and
 * the provider rejects it. Strip them, and any stray whitespace, on read.
 */
const readEnv = (name: string): string | undefined => {
  const raw = process.env[name]?.trim();
  if (!raw) return undefined;
  const unquoted = raw.replace(/^(["'])([\s\S]*)\1$/, "$2").trim();
  return unquoted || undefined;
};

/** Accepts `email@example.com` and `Name <email@example.com>`, as Resend does. */
const isValidFrom = (value: string): boolean =>
  /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(value) ||
  /^[^<>]+<[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+>$/.test(value);

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const buildHtml = (
  label: string,
  data: z.infer<typeof contactSchema>,
): string => {
  const rows: Array<[string, string]> = [
    ["Origen", label],
    ["Nombre", data.name],
    ["Email", data.email],
  ];

  if (data.phone) rows.push(["Teléfono", data.phone]);
  for (const [key, value] of Object.entries(data.meta ?? {})) {
    if (value) rows.push([key, value]);
  }

  const rowsHtml = rows
    .map(
      ([key, value]) =>
        `<tr><td style="padding:6px 16px 6px 0;color:#5B6B7F;white-space:nowrap">${escapeHtml(
          key,
        )}</td><td style="padding:6px 0;color:#0E1A2B"><strong>${escapeHtml(
          value,
        )}</strong></td></tr>`,
    )
    .join("");

  return `<div style="font-family:system-ui,sans-serif;font-size:15px;line-height:1.6;color:#0E1A2B">
  <p style="margin:0 0 4px;font-size:12px;letter-spacing:.12em;color:#1E4FD6"><strong>${escapeHtml(
    label,
  )}</strong></p>
  <h2 style="margin:0 0 20px;font-size:20px">Nueva consulta desde la web</h2>
  <table style="border-collapse:collapse;margin-bottom:20px">${rowsHtml}</table>
  <p style="margin:0 0 6px;color:#5B6B7F">Mensaje</p>
  <div style="padding:16px;background:#F4F6FA;border-radius:12px;white-space:pre-wrap">${escapeHtml(
    data.message,
  )}</div>
</div>`;
};

/**
 * Vercel's Node runtime invokes handlers with the Express-style (req, res)
 * pair, not the Web Request/Response pair. Typed structurally so this stays
 * dependency-free.
 */
type VercelRequest = {
  method?: string;
  body?: unknown;
};

type VercelResponse = {
  status(code: number): VercelResponse;
  json(body: unknown): void;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  // The runtime parses JSON bodies, but fall back in case it hands us a string.
  let payload: unknown = req.body;
  if (typeof payload === "string") {
    try {
      payload = JSON.parse(payload);
    } catch {
      return res.status(400).json({ ok: false, error: "Cuerpo inválido." });
    }
  }

  const parsed = contactSchema.safeParse(payload);
  if (!parsed.success) {
    return res.status(400).json({ ok: false, error: "Revisá los datos del formulario." });
  }

  const data = parsed.data;

  // Bot: pretend it worked so it doesn't retry, but send nothing.
  if (data.website) return res.status(200).json({ ok: true });

  const apiKey = readEnv("RESEND_API_KEY");
  const to = readEnv("CONTACT_TO");
  const from = readEnv("CONTACT_FROM");

  if (!apiKey || !to || !from) {
    // Name which ones are unset, never their values: this tells us whether the
    // project is misconfigured without exposing anything secret.
    const missing = [
      !apiKey && "RESEND_API_KEY",
      !to && "CONTACT_TO",
      !from && "CONTACT_FROM",
    ].filter(Boolean);
    console.error("contact: missing env", missing.join(", "));
    return res.status(500).json({
      ok: false,
      error: "No pudimos enviar el mensaje.",
      code: "config_missing",
      missing,
    });
  }

  // Catch a malformed sender here rather than as an opaque 422 from the provider.
  if (!isValidFrom(from)) {
    console.error("contact: CONTACT_FROM is malformed", JSON.stringify(from));
    return res.status(500).json({
      ok: false,
      error: "No pudimos enviar el mensaje.",
      code: "invalid_from",
      hint: "CONTACT_FROM debe ser 'email@dominio.com' o 'Nombre <email@dominio.com>', sin comillas.",
    });
  }

  const label = SOURCE_LABELS[data.source];

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: data.email,
      subject: `[${label}] Nueva consulta — ${data.name}`,
      html: buildHtml(label, data),
    }),
  });

  if (!response.ok) {
    // The provider's message goes to the logs only. The status code is enough
    // to tell a bad key (401) from an unverified domain (403) from the outside.
    console.error("contact: resend failed", response.status, await response.text());
    return res.status(500).json({
      ok: false,
      error: "No pudimos enviar el mensaje.",
      code: "provider_error",
      providerStatus: response.status,
    });
  }

  return res.status(200).json({ ok: true });
}
