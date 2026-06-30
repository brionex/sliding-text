# sliding-text

## Commands

- `npm run dev` — Vite dev server (root: `src/`)
- `npm run build` — `tsc && vite build` (typecheck then bundle)
- `npm run preview` — preview production build

## Structure

| Path | Purpose |
|---|---|
| `src/lib/` | Library source: `sliding-text.ts` (exports `SlidingText`), `style.css` (animations) |
| `src/` root | Landing page: `index.html`, `main.ts`, `style.css` |
| `utility/` | Empty, reserved for future use |

## Conventions

- **No tests, linter, or formatter** — none configured
- **Tailwind CSS v4** — `@import 'tailwindcss'` in `src/style.css`; no config file needed
- **CSS animations** live in `src/lib/style.css` (keys: `textIn`, `textOut`)
- **Vite root** is `src/` (set via `vite.config.ts` `root: 'src'`)
- **TypeScript strict mode** with `noUnusedLocals`, `noUnusedParameters` — unused code fails `npm run build`
- **Code highlighting** uses `highlight.js` (tree-shaken: only TypeScript, CSS, JavaScript languages)
- **TS→JS transpilation** in the source code viewer uses the TypeScript compiler loaded lazily from CDN
