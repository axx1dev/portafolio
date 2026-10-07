# Reporte de Investigación de Rendimiento — Portafolio Next.js

**Fecha:** 2026-07-10  
**Alcance:** Solo lectura de código, sin cambios al repo.

---

## Resumen Ejecutivo

Hay **cuatro causas principales** que explican la lentitud en desktop y mobile:

1. **Imagen hero sin comprimir (185 KB de JPEG)** — `axel_gym.jpeg` en `/public` pesa 185.6 KB. Con `next/image` y `priority` se descarga al inicio de la carga, bloqueando el LCP (Largest Contentful Paint).
2. **Framer Motion importado en el bundle principal de forma síncrona en cada página** — `framer-motion` v13 pesa ~120-150 KB minificado/gzipped. Todas las páginas declaran `"use client"` e importan `framer-motion` directamente en el nivel superior, sin lazy-loading, lo que lo incluye en el chunk inicial.
3. **Google Fonts / Material Symbols bloqueantes en `<head>` con un `<link rel="stylesheet">` hardcoded** — `layout.tsx` inyecta manualmente `https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined...` como una hoja de estilos síncrona en `<head>`. Esto es un recurso de render-blocking que retrasa el First Contentful Paint, especialmente en conexiones lentas (mobile).
4. **96 animaciones `motion.div` en la home (GridReveal: 8×12 = 96 nodos DOM)** — el componente `GridReveal` en `app/page.tsx` crea 96 instancias de `motion.div`, cada una con su propio estado de animación de Framer Motion. En mobile esto genera jank severo al montar y animar.

Adicionalmente hay problemas menores con imágenes `<img>` crudas en múltiples componentes y una imagen de logo cargada desde un CDN externo en cada render.

---

## Evidencia Detallada

### Problema 1 — Imagen hero no optimizada (peso y formato)

**Archivo:** `public/axel_gym.jpeg`  
**Peso:** 185.6 KB (JPEG, formato legacy)

```
axel_gym.jpeg  185.6 KB
```

El archivo se usa en `app/page.tsx` con `<Image fill priority>`:

```tsx
// app/page.tsx línea ~83
<Image
  src="/axel_gym.jpeg"
  alt=""
  fill
  priority
  sizes="(max-width: 768px) 100vw, 60vw"
  className="object-cover object-center opacity-40 md:opacity-60 grayscale-[35%] contrast-110"
/>
```

El uso de `priority` es correcto para una imagen hero (precarga). El problema es el peso del archivo original. Next.js Image optimiza la imagen en el primer request y la sirve en WebP/AVIF con el ancho adecuado, pero si el JPEG fuente es grande, la primera carga sin caché (en dev, o en producción antes del primer request) tarda más. En desarrollo (`next dev`) la optimización ocurre en tiempo real — eso es notoriamente lento. En producción con caché ya calentada el impacto se reduce, pero el archivo fuente grande sigue siendo el techo.

**Diagnóstico adicional:** El archivo está siendo servido con `fill` y `sizes` correctos, lo cual es la forma adecuada. Sin embargo, un JPEG de 185 KB sin comprimir como fuente es subóptimo; debería estar entre 40–80 KB.

---

### Problema 2 — Framer Motion en el bundle inicial (sin lazy load)

**Archivos afectados:**
- `app/page.tsx` — `import { motion } from "framer-motion"` (línea 5)
- `app/components/navbar.tsx` — `import { motion } from "framer-motion"` (línea 3)
- `app/components/page-transition.tsx` — `import { AnimatePresence, motion } from "framer-motion"` (línea 3)
- `app/components/motion.tsx` — `import { motion, type Variants } from "framer-motion"` (línea 3)
- `app/hobbies/page.tsx` — `import { motion } from "framer-motion"` (línea 2)
- `app/work-cv/page.tsx` — `import { motion } from "framer-motion"` (línea 2)
- `app/contact/page.tsx` — `import { motion, AnimatePresence } from "framer-motion"` (línea 2)

Todos estos son `"use client"` con import estático. Framer Motion v13 (`"framer-motion": "^13.1.1"`) incluye el runtime completo de animación. Este bundle se descarga **en cada página**, incluyendo la home.

`PageTransition` está importado en `app/layout.tsx` de forma síncrona:
```tsx
// app/layout.tsx línea 5
import { PageTransition } from "./components/page-transition";
```

Esto significa que `framer-motion` siempre forma parte del bundle del layout (que aplica a todas las rutas), incluso si no hubiera animaciones en una página específica. No se usa `next/dynamic` con `ssr: false` ni ningún mecanismo de code-splitting para diferir la carga.

---

### Problema 3 — Google Fonts / Material Symbols como stylesheet bloqueante

**Archivo:** `app/layout.tsx`

```tsx
// app/layout.tsx líneas 20-26
<head>
  <link
    href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
    rel="stylesheet"
  />
</head>
```

Este `<link rel="stylesheet">` es **render-blocking**. El navegador no puede pintar la página hasta que este CSS se descargue y parsee. En mobile con conexión lenta (o simplemente con latencia a los servidores de Google), esto puede agregar 200–600ms al FCP.

La fuente Sora sí está cargada correctamente via `next/font/google`:
```tsx
// app/layout.tsx líneas 7-11
const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});
```

Pero Material Symbols está hardcodeado en `<head>` de forma manual, omitiendo la optimización de `next/font`. Next.js con `next/font` inline el CSS crítico y usa `font-display: optional` para evitar el bloqueo.

**Nota adicional:** La URL de Material Symbols usa un rango variable de parámetros muy amplio (`wght,FILL,GRAD@20..48,100..700,0..1,-50..200`) lo que descarga un archivo de fuente mucho más pesado que si se pidieran solo los valores usados.

---

### Problema 4 — GridReveal: 96 instancias de motion.div en la home

**Archivo:** `app/page.tsx`

```tsx
// app/page.tsx líneas 13-14
const GRID_COLS = 8;
const GRID_ROWS = 12;
// Total: 96 motion.div
```

```tsx
// app/page.tsx líneas ~57-72
{Array.from({ length: cells }, (_, i) => (
  <motion.div
    key={i}
    initial={{ opacity: 1 }}
    animate={offsets ? { opacity: 0 } : { opacity: 1 }}
    transition={{
      duration: 0.9,
      delay: offsets ? delay + offsets[i] : 0,
      ease: "easeOut",
    }}
    className="bg-obsidian-base"
    style={{ boxShadow: "0 0 0 0.5px var(--color-obsidian-base)" }}
  />
))}
```

Cada `motion.div` registra su propio subscription en el Framer Motion scheduler. 96 elementos animados simultáneamente = 96 RAF (requestAnimationFrame) callbacks compitiendo. En mobile (GPU/CPU limitados), esto causa jank visible durante los primeros ~3 segundos de la carga de la home, ya que todos los overlays de celda se animan al mismo tiempo con delays variables.

El uso de `boxShadow` en cada celda también es costoso en mobile (GPU compositing por elemento).

---

### Problema 5 — Imágenes raw `<img>` externas en hobbies (sin cache control, sin optimización)

**Archivo:** `app/hobbies/page.tsx`

Todas las imágenes de anime y motos usan `<img>` crudas con URLs externas hardcodeadas:

```tsx
// hobbies/page.tsx — sección ANIME
img: "https://i0.wp.com/teamgeek.mx/wp-content/uploads/2025/09/wp8536793-jujutsu-kaisen-group-wallpapers.jpg?fit=1920%2C1080&ssl=1",
// ↑ imagen de 1920x1080px descargada completa

img: "https://soymotero.net/wp-content/uploads/2026/08/2027_Sportbike_GSX-R750_PPH_2500x1227.jpg",
// ↑ imagen de 2500x1227px descargada completa
```

Problemas concretos:
- Sin `next/image`, no hay resize ni conversión a WebP/AVIF
- Sin `loading="lazy"`, algunas de estas imágenes se descargan inmediatamente aunque estén fuera del viewport
- Sin `width`/`height` explícitos, hay Layout Shift (CLS alto)
- Los dominios externos no están en `next.config.ts` como `remotePatterns`, por lo que `next/image` no podría optimizarlos sin configuración adicional
- Una imagen (`soymotero.net`) es de 2500px de ancho — se descarga la imagen completa en mobile

---

### Problema 6 — Logo externo de Google en Navbar y Footer (CDN con latencia)

**Archivos:** `app/components/navbar.tsx` línea 36, `app/components/footer.tsx` línea 2

```tsx
const LOGO_URL =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBgm6wlQ...";
```

Este logo se carga desde `lh3.googleusercontent.com` como `<img>` cruda en cada render. Si el CDN de Google está lento o hay problemas de conectividad, el logo bloquea visualmente la navbar. Además no tiene `width`/`height` explícitos, causando CLS.

---

### Problema 7 — `next.config.ts` completamente vacío (sin optimizaciones habilitadas)

**Archivo:** `next.config.ts`

```ts
const nextConfig: NextConfig = {
  /* config options here */
};
```

No hay ninguna configuración de optimización. En particular:
- Sin `images.formats: ["image/avif", "image/webp"]` — Next.js por defecto sirve WebP pero AVIF (mejor compresión) requiere configuración explícita o se habilita por defecto según la versión.
- Sin `compiler.removeConsole` para producción
- Sin headers de cache para assets estáticos

---

### Problema 8 — Todas las páginas usan `"use client"` innecesariamente

Cada página del proyecto declara `"use client"` en la primera línea:
- `app/page.tsx` — usa `useState`, `useSyncExternalStore` y animaciones
- `app/hobbies/page.tsx` — solo usa `motion` y componentes de animación (sin state propio)
- `app/work-cv/page.tsx` — solo usa `motion` y componentes de animación (sin state propio)

`app/hobbies/page.tsx` y `app/work-cv/page.tsx` son páginas que no tienen estado propio: son `"use client"` únicamente por sus imports de framer-motion. Esto impide cualquier generación estática (SSG) en estas rutas y obliga al browser a descargar el bundle completo de React client-side para cada página.

---

### Problema 9 — Scanlines CSS en `position: fixed` con `z-index: 50`

**Archivo:** `app/layout.tsx` + `app/globals.css`

```tsx
// layout.tsx
<div className="fixed inset-0 scanlines z-50 mix-blend-overlay opacity-40" />
```

```css
/* globals.css */
.scanlines {
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0) ...
  );
  background-size: 100% 4px;
}
```

Un `div` fixed que cubre toda la pantalla con `mix-blend-overlay` fuerza al browser a crear una **nueva capa de compositing** para todo el contenido debajo. En mobile esto aumenta el uso de memoria GPU y puede causar janks durante el scroll. Es un efecto decorativo con costo de rendimiento real.

---

## Resumen de Archivos Revisados

| Archivo | Relevancia |
|---|---|
| `app/page.tsx` | GridReveal (96 motion.div), framer-motion síncrono, imagen hero |
| `app/layout.tsx` | Material Symbols bloqueante en `<head>`, scanlines fixed overlay |
| `app/components/page-transition.tsx` | framer-motion + AnimatePresence en layout global |
| `app/components/navbar.tsx` | framer-motion, logo externo crudo |
| `app/components/footer.tsx` | logo externo crudo |
| `app/hobbies/page.tsx` | Todas `<img>` crudas con URLs externas sin lazy ni dimensiones |
| `app/work-cv/page.tsx` | "use client" innecesario, framer-motion síncrono |
| `app/contact/page.tsx` | Data fetching (fetch POST a /api/contact) — correcto, no afecta home |
| `next.config.ts` | Completamente vacío, sin optimizaciones |
| `public/axel_gym.jpeg` | 185.6 KB — imagen fuente pesada |

---

## Recomendaciones Priorizadas

### 🔴 Alta Prioridad (impacto inmediato y visible)

**1. Comprimir y convertir `axel_gym.jpeg`**  
Reducir a WebP o AVIF con calidad 75–80. Target: < 60 KB. Usar `squoosh.app` o `sharp` CLI. Renombrar a `axel_gym.webp` y actualizar el `src` en `page.tsx`.

**2. Reemplazar el `<link>` de Material Symbols por `next/font` o cambiar a `rel="preconnect"` + `rel="stylesheet" media="print" onload="this.media='all'"`**  
La solución más rápida es hacer el load no-bloqueante. La solución correcta es usar la API de fuentes de Next.js o autoalojar el icon font. Como mínimo, agregar `rel="preconnect"` antes del stylesheet:
```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
```

**3. Reducir GridReveal de 96 a 32 celdas (4×8) o eliminarlo en mobile**  
96 `motion.div` animados simultáneamente destruyen el rendimiento en mobile. Bajar a 32 celdas o usar CSS animation (`@keyframes`) en lugar de Framer Motion para este efecto específico es más eficiente. En mobile (viewport < 768px), considerar desactivar el efecto completamente con un `prefers-reduced-motion` media query.

### 🟡 Media Prioridad (mejora de bundle y TTI)

**4. Mover `framer-motion` a lazy imports donde sea posible**  
`PageTransition` en `layout.tsx` puede envolverse con `dynamic(() => import('./components/page-transition'), { ssr: false })`. Esto separa el bundle de framer-motion del chunk crítico del layout. Las páginas `hobbies` y `work-cv` no necesitan `"use client"` si sus componentes de animación se importan dinámicamente.

**5. Convertir las imágenes en `hobbies/page.tsx` a `next/image` con `loading="lazy"`**  
Primero agregar los dominios a `next.config.ts` en `images.remotePatterns`. Luego reemplazar `<img>` por `<Image>`. Esto activa compresión automática, lazy loading nativo y elimina el CLS.

**6. Bajar el logo del Navbar/Footer a `/public` y servirlo localmente**  
Eliminar la dependencia del CDN de Google para un asset crítico como el logo de la navbar. Descargarlo una vez a `public/logo.svg` (o WebP) y referenciarlo con `/logo.svg`.

### 🟢 Baja Prioridad (refinamiento)

**7. Agregar configuración mínima en `next.config.ts`**  
```ts
const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      // + otros dominios de hobbies
    ],
  },
};
```

**8. Evaluar si el overlay `scanlines` con `mix-blend-overlay` es necesario en mobile**  
Aplicar `@media (max-width: 768px) { .scanlines { display: none; } }` o reducir su complejidad (quitar `mix-blend-overlay`) para evitar el layer de compositing extra.

**9. Considerar `prefers-reduced-motion` para las animaciones de entrada**  
Los usuarios en mobile a menudo tienen activada la opción de reducir movimiento. Framer Motion respeta `prefers-reduced-motion` con `useReducedMotion()`, pero hay que invocarlo explícitamente.

---

## Conclusión

La causa raíz de la lentitud en **desktop** es principalmente la imagen hero de 185 KB sin comprimir y los 96 nodos animados del GridReveal que cargan el CPU/GPU al inicio.

La causa raíz de la lentitud en **mobile (primera carga)** es la combinación de: (1) Material Symbols como stylesheet bloqueante que retrasa el FCP, (2) framer-motion ~130 KB en el bundle inicial de cada página, y (3) las imágenes externas crudas en hobbies que se descargan en tamaño completo sin lazy loading.

El hecho de que el usuario no use data fetching en la home es correcto — no hay `fetch`, `useEffect` para datos, ni SWR. El cuello de botella es puramente de **assets pesados + bundle JS grande + render-blocking resources**, no de datos.
