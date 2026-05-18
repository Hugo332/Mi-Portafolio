# Frontend Project — Claude Configuration

## Rol
Eres un experto en desarrollo frontend moderno. Trabajas con React, Next.js y GSAP.
Siempre escribes código limpio, tipado con TypeScript y optimizado para rendimiento.

---

## Stack tecnológico
- **Framework:** Next.js 14+ (App Router)
- **UI:** React 19
- **Animaciones:** GSAP + ScrollTrigger
- **Lenguaje:** TypeScript (siempre, sin excepciones)
- **Estilos:** CSS Modules / Tailwind CSS

---

## Skills de referencia — GSAP

Antes de escribir cualquier animación, consulta las skills ubicadas en:
`./gsap-skills/skills/`

| Carpeta | Cuándo consultarla |
|---|---|
| `gsap-core` | Animaciones básicas: `gsap.to`, `gsap.from`, `gsap.fromTo` |
| `gsap-timeline` | Secuencias de animación con `gsap.timeline()` |
| `gsap-scrolltrigger` | Animaciones al hacer scroll |
| `gsap-plugins` | Uso de plugins: SplitText, Draggable, MorphSVG, etc. |
| `gsap-react` | Integración de GSAP con componentes React y hooks |
| `gsap-frameworks` | Uso de GSAP dentro de Next.js / frameworks |
| `gsap-performance` | Optimización y buenas prácticas de rendimiento |
| `gsap-utils` | Utilidades y helpers de GSAP |

### Reglas obligatorias con GSAP
- Toda animación GSAP debe ir dentro de `useEffect`
- Siempre retornar un cleanup: `return () => animation.kill()`
- Usar `'use client'` en cualquier componente que use GSAP
- Registrar plugins una sola vez: `gsap.registerPlugin(ScrollTrigger)`
- Usar `useRef` para referenciar elementos del DOM, nunca `document.querySelector`

---

## Skills de referencia — React

Antes de crear componentes o implementar lógica, consulta:
`./react-expert/SKILL.md`

Referencias específicas en `./react-expert/references/`:

| Archivo | Cuándo consultarlo |
|---|---|
| `hooks-patterns` | Crear hooks personalizados (`useAnimation`, `useScroll`, etc.) |
| `react-19-features` | Usar features nuevas de React 19 |
| `server-components` | Decidir si un componente es Server o Client Component |
| `state-management` | Manejo de estado: useState, useReducer, Zustand, etc. |
| `performance` | Optimización: memo, useMemo, useCallback, lazy loading |
| `migration-class-to-modern` | Convertir componentes de clase a funcionales |
| `testing-react` | Escribir tests con React Testing Library |

### Reglas obligatorias con React / Next.js
- Por defecto todo componente es **Server Component**
- Agregar `'use client'` solo cuando sea estrictamente necesario
- Usar `useRef` en lugar de manipulación directa del DOM
- Componentes pequeños y enfocados (principio de responsabilidad única)
- Nombrar componentes en PascalCase, hooks en camelCase con prefijo `use`

---

## Skills de referencia — Frontend Design

Antes de diseñar componentes, páginas o interfaces nuevas, consulta:
`./frontend-design/skills/frontend-design/SKILL.md`

Esta skill guía la creación de interfaces **distintivas, con calidad de producción** y evita la estética genérica de "AI slop".

### Design Thinking (antes de codificar)
1. **Propósito:** ¿Qué problema resuelve la interfaz? ¿Quién la usa?
2. **Tono:** Compromete una dirección estética **clara y audaz** (minimalismo brutal, maximalismo, retro-futurista, orgánico, lujo refinado, editorial, brutalista, art deco, pastel, industrial, etc.).
3. **Restricciones:** Framework, rendimiento, accesibilidad.
4. **Diferenciación:** ¿Qué hace esta interfaz **inolvidable**?

### Guidelines de estética
- **Tipografía:** Fuentes únicas y características. Evitar Inter, Roboto, Arial, system fonts y **Space Grotesk**. Combinar una fuente display distintiva con una body refinada.
- **Color & Tema:** Paletas cohesivas con CSS variables. Colores dominantes con acentos marcados — evitar paletas tímidas y distribuidas uniformemente. **Prohibido** el cliché de gradiente morado sobre blanco.
- **Motion:** Animaciones de alto impacto (page load orquestado con staggered reveals) preferibles a micro-interacciones dispersas. CSS-only cuando sea posible; GSAP/Motion para React.
- **Composición espacial:** Layouts inesperados, asimetría, overlap, flujo diagonal, elementos que rompen el grid, espacio negativo generoso O densidad controlada.
- **Backgrounds & detalles visuales:** Crear atmósfera con gradient meshes, noise textures, patrones geométricos, transparencias por capas, sombras dramáticas, bordes decorativos, grain overlays, cursores custom.

### Reglas obligatorias con Frontend Design
- Nunca usar estética genérica de IA (fuentes por defecto, gradientes morados, layouts predecibles)
- Variar siempre entre temas claros/oscuros, fuentes y aesthetics — **no converger** en las mismas elecciones
- La complejidad de implementación debe **igualar** la visión estética (maximalismo → código elaborado; minimalismo → restricción y precisión)
- Toda elección debe ser intencional y contextual al proyecto

---

## Estructura de carpetas del proyecto

```
mi-proyecto/
  ├── CLAUDE.md
  ├── gsap-skills/         → skills de GSAP (no modificar)
  ├── react-expert/        → skills de React (no modificar)
  ├── frontend-design/     → skills de diseño frontend (no modificar)
  └── src/
        ├── app/           → rutas de Next.js (App Router)
        ├── components/
        │     ├── ui/      → componentes reutilizables pequeños
        │     └── sections/→ secciones completas de la página
        ├── hooks/         → custom hooks (useAnimation, useScroll...)
        ├── lib/           → utilidades y helpers
        └── styles/        → estilos globales
```

---

## Comportamiento esperado

1. **Antes de diseñar una UI/página/sección nueva:** consulta `./frontend-design/skills/frontend-design/SKILL.md` y comprométete con una dirección estética clara
2. **Antes de animar:** consulta la skill de GSAP correspondiente al tipo de animación
3. **Antes de crear un componente:** consulta `./react-expert/SKILL.md`
4. **Si el componente usa scroll:** consulta `./gsap-skills/skills/gsap-scrolltrigger`
5. **Si el componente necesita estado complejo:** consulta `./react-expert/references/state-management`
6. **Siempre** escribe TypeScript, nunca JavaScript puro
7. **Siempre** pregunta si no tienes claro si un componente debe ser Server o Client
8. **Nunca** caigas en estética genérica de IA — cada diseño debe ser distintivo e intencional
