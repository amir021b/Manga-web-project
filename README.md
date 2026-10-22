# Manga web project

React + Vite (JavaScript) manga website. The Vite app lives in the `manga-web/` folder.

## Folder structure

- `manga-web/src/components/layout/` - Header, Footer and Layout: the shared frame around every page.
- `manga-web/src/components/ui/` - small generic UI pieces (Button, Input, Logo, GlassCard, AuthTabs) that any page can reuse.
- `manga-web/src/components/auth/` - auth-specific pieces (AuthCard).
- `manga-web/src/components/manga/` - manga specific pieces (MangaCard, MangaGrid).
- `manga-web/src/pages/` - one file per page: Home, Search, Manga detail, Reader, Bookmarks, Profile, Log in, Sign up, Not found.
- `manga-web/src/hooks/` - reusable React hooks, for example `useDebounce`.
- `manga-web/src/services/` - every call to the backend lives here, for example `mangaApi.js`.
- `manga-web/src/utils/` - small helper functions that are not React code, for example `validators.js`.
- `manga-web/src/constants/` - shared constants, for example the `ROUTES` paths and `authCopy.js` (login / sign up copy).
- `manga-web/src/styles/` - global stylesheets (currently empty).

## Naming conventions

- Components and pages use PascalCase, and the file name is the same as the component name (`MangaCard.jsx` exports `MangaCard`).
- Hooks and utilities use camelCase (`useDebounce.js`, `validators.js`).
- One component per file, exported as the default export.
- No barrel files (no `index.js` that only re-exports) for now.

## Note

Bookmarks and Profile are for logged-in users only; route protection will be added later.

