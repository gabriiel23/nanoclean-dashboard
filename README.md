# ÑañoClean · Web

Aplicación web unificada de **ÑañoClean**, sistema inteligente de gestión y
clasificación de residuos urbanos (IoT + ESP32 + visión artificial). Un solo
proyecto Next.js que sirve dos cosas:

| Ruta | Qué es |
|------|--------|
| `/` | **Landing** — página principal de presentación del producto. |
| `/dashboard` | **Dashboard** — panel de control en tiempo real (contenedores, nodos, alertas, ajustes). |
| `/clasificacion` | Pantalla pública de clasificación en vivo (kiosko junto al contenedor). |

La landing y el dashboard están enlazados en ambos sentidos:

- En la landing, la cabecera tiene el botón **"Ir al Dashboard"** (y enlaces en el footer).
- En el dashboard, la cabecera tiene **"Sitio web"** y el sidebar **"Volver al sitio"**,
  que regresan a la landing.

## Stack

- **Next.js 16** (App Router) + **React 19**
- **Tailwind CSS v4** para el dashboard
- CSS propio (acotado bajo `.landing`) para la landing
- `lucide-react`, `recharts`, `leaflet`, `socket.io-client`

## Correr en local

```bash
npm install
npm run dev
```

Abre `http://localhost:3000`. La landing queda en `/` y el dashboard en `/dashboard`.

## Compilar para producción

El proyecto usa `output: "export"` (Next.js), así que el build genera un sitio
**estático** en la carpeta `out/`, que cualquier servidor web (Nginx) puede
servir directamente — sin proceso ni puerto.

```bash
npm run build      # genera out/
```

El despliegue en el servidor (Nginx + Certbot, subdominio `nanoclean.uidehub.tech`)
está documentado paso a paso en [`deploy/DEPLOY.md`](deploy/DEPLOY.md).

## Estructura

```
app/
├── layout.tsx                 # layout raíz (html/body, fuente Inter)
├── page.tsx                   # LANDING  → "/"
├── landing.css                # estilos de la landing (scoped bajo .landing)
├── globals.css                # Tailwind (dashboard)
├── clasificacion/             # kiosko público → "/clasificacion"
└── dashboard/                 # DASHBOARD → "/dashboard/*"
    ├── layout.tsx             # DashboardShell (sidebar + navbar)
    ├── page.tsx               # panel de control
    ├── alertas/  nodos/  contenedores/  ajustes/  clasificaciones-stats/
components/
├── landing/                   # Hero, Telemetria, Problema, Arquitectura,
│                              # Clasificacion, Fase, Equipo, Footer, LandingNav
├── layout/                    # Sidebar, Navbar, DashboardShell
└── dashboard/                 # StatCard, Chart, BinVisualizer, ContainerMap, ...
```

## Imágenes

La landing usa fotografías de **Unsplash** (Unsplash License: uso libre y
comercial, sin atribución obligatoria), servidas optimizadas desde su CDN. Las
URLs están centralizadas en `components/landing/images.ts`.

## Equipo

Denis L. Rodríguez · Gabriel A. Diaz · Nicolas A. Cevallos · Nicole B. Abad
— Universidad Internacional del Ecuador · Smart Cities y gestión ambiental.
