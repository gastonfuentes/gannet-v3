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

## Deploy

Desplegado en Vercel desde la rama `main`.
