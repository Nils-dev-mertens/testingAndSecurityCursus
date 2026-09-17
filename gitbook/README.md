# Student Docs (Astro)

Static documentation site built with [Astro](https://astro.build) that hosts the shared,
multi-subject cursus. React is kept for the interactive parts (sidebar, search, file toggles).

## Stack

- **Astro** (SSG) + Tailwind CSS
- **React** islands: sidebar navigation, Ctrl+K search, "See files" buttons
- **shadcn/ui** + Radix primitives
- **Vitest** + Testing Library for unit/component tests
- Deployed as a static build served by nginx (see root `Dockerfile`)

## Commands

Run everything from this directory:

| Command             | Description                                      |
|---------------------|--------------------------------------------------|
| `npm ci`            | Install dependencies                             |
| `npm run dev`       | Start the dev server (`localhost:4321`)          |
| `npm run prebuild`  | Regenerate `public/tree.json` (search index)     |
| `npm run lint`      | Lint code (`eslint .`)                           |
| `npm test`          | Run tests once (Vitest)                          |
| `npm run test:watch`| Run tests in watch mode                          |
| `npm run build`     | `astro check` + static build → `dist/`           |
| `npm run preview`   | Serve the production build locally               |

## Adding content

Content lives in `content/`. One top-level folder per subject. Every subject has an
`index.md`; chapters are subfolders with their own `index.md` and pages.

See `content/Contributing/` for the template rules and the step-by-step guide. After adding
or editing content, run `npm run prebuild` to refresh the search index.

## Testing

- `tests/pages.test.ts` + `tests/path.test.ts` — navigation/slug helpers
- `tests/FolderFiles.test.tsx` — see-files button behavior
- `tests/SearchResult.test.tsx` — search matching and links
- `tests/SidebarNav.test.tsx` — sidebar rendering and active state

## CI

Every PR runs: `npm ci` → `prebuild` → `lint` → `test` → `build`
(see `.github/workflows/ci.yml` at the repo root).