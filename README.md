# GannetLabs

Landing page de GannetLabs — Vite + React + TypeScript, shadcn/ui, Tailwind CSS y Framer Motion.

## Stack

- **Vite** + **React 18** + **TypeScript**
- **Tailwind CSS** + `tailwindcss-animate`
- **shadcn/ui** (Radix UI primitives) en `src/components/ui`
- **Framer Motion** para animaciones (`src/components/animations`)
- **React Router** para el ruteo
- **React Hook Form** + **Zod** para formularios y validación

## Requisitos

- Node.js 18+
- npm

## Desarrollo local

```bash
npm install
npm run dev
```

El servidor de desarrollo queda arriba en `http://localhost:5173` (o el próximo puerto libre).

## Scripts

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Levanta el servidor de desarrollo de Vite |
| `npm run build` | Build de producción |
| `npm run build:dev` | Build en modo development |
| `npm run preview` | Sirve el build de producción localmente |
| `npm run lint` | Corre ESLint |

## Estructura

```
src/
├── components/
│   ├── animations/    # FadeUp, ShinyText, StaggeredFade
│   ├── sections/      # Secciones de la landing (Hero, Solutions, FAQ, etc.)
│   └── ui/            # Componentes shadcn/ui
├── hooks/
├── lib/
├── pages/             # Index, NotFound
└── main.tsx
```

## Formulario de contacto

Las tres webs (landing, `/modulitia/`, `/gannet-os/`) postean al mismo endpoint,
`api/contact.ts`, que envía el mail vía Resend. El campo `source` del payload es lo que
distingue el origen en el asunto: `[MODULITIA] Nueva consulta — Nombre`. El `reply-to`
apunta al email de quien consulta.

### Variables de entorno

Cargarlas en Vercel (Project Settings → Environment Variables), y en `.env.local` para
probar con `vercel dev`:

| Variable | Ejemplo | Notas |
| --- | --- | --- |
| `RESEND_API_KEY` | `re_xxx` | https://resend.com/api-keys |
| `CONTACT_TO` | `contacto@gannetlabs.com` | Destino de las consultas |
| `CONTACT_FROM` | `GannetLabs Web <web@gannetlabs.com>` | Requiere verificar el dominio en Resend (registros SPF/DKIM en el DNS de Hostinger). Sin verificar, usar `onboarding@resend.dev` |

### Probar el endpoint en local

`npm run dev` levanta solo Vite y **no ejecuta las funciones serverless**: `/api/contact`
responde 404. Para probarlo end-to-end hace falta el CLI de Vercel:

```bash
vercel dev
```

## Deploy

Desplegado en Vercel desde la rama `main`.
