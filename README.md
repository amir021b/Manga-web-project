# Manga web project

React + Vite (JavaScript) manga website. The Vite app lives in the `manga-web/` folder.

## Architecture

### Overview
This is the frontend of a manga website: a React app where users can log in or create an account. It is written in plain JavaScript (no TypeScript) and is a single-page app — there is no router yet, so the pages are placeholders.

Tech stack (versions from `manga-web/package.json`):
- React 19.3.1 and React DOM 19.3.1 (`^19.3.1`)
- Vite 8.3.4 (`^8.3.4`) — build tool and dev server
- Tailwind CSS 4.3.3 (`^4.3.3`) with the `@tailwindcss/vite` plugin (`^4.3.3`)
- ESLint 10.13.0 (`^10.13.0`) with the React hooks and React refresh plugins

Scripts (run from the `manga-web/` folder):
- `npm run dev` — starts the Vite dev server with hot reloading
- `npm run build` — builds the app for production into the `dist/` folder
- `npm run lint` — runs ESLint over all JavaScript and JSX files
- `npm run preview` — serves the production build locally so you can test it

### Folder tree of src/
One line per file that really exists, saying what it does:
- `src/main.jsx` — entry point: renders `<App>` inside React StrictMode into the `#root` div, and imports the global CSS
- `src/App.jsx` — root component: renders `Layout` wrapping `AuthCard`
- `src/index.css` — global stylesheet: imports Tailwind and sets a dark color scheme plus a body reset
- `src/components/layout/Layout.jsx` — page container: starfield canvas plus a centered main area
- `src/components/layout/StarBackground.jsx` — full-screen animated starry sky behind the content
- `src/components/layout/Header.jsx` — placeholder: returns `<h1>Header</h1>`, not used anywhere
- `src/components/layout/Footer.jsx` — placeholder: returns `<h1>Footer</h1>`, not used anywhere
- `src/components/auth/AuthCard.jsx` — the login / sign up card: owns the mode and all form values
- `src/components/ui/GlassCard.jsx` — frosted-glass container for the card
- `src/components/ui/Logo.jsx` — MangaHub brand mark
- `src/components/ui/AuthTabs.jsx` — Log in / Sign up segmented toggle
- `src/components/ui/FloatingInput.jsx` — outlined input with a floating label
- `src/components/ui/Button.jsx` — full-width glass action button
- `src/components/ui/Checkbox.jsx` — custom-styled checkbox
- `src/components/ui/LinkButton.jsx` — muted text link styled as a button
- `src/components/ui/Collapse.jsx` — smoothly expanding/collapsing section
- `src/components/manga/MangaCard.jsx` — placeholder: returns `<h1>MangaCard</h1>`, not used
- `src/components/manga/MangaGrid.jsx` — placeholder: returns `<h1>MangaGrid</h1>`, not used
- `src/pages/HomePage.jsx` — placeholder: `<h1>HomePage</h1>`, not connected to routing
- `src/pages/LoginPage.jsx` — placeholder: `<h1>LoginPage</h1>`
- `src/pages/SignupPage.jsx` — placeholder: `<h1>SignupPage</h1>`
- `src/pages/SearchPage.jsx` — placeholder: `<h1>SearchPage</h1>`
- `src/pages/MangaDetailPage.jsx` — placeholder: `<h1>MangaDetailPage</h1>`
- `src/pages/ReaderPage.jsx` — placeholder: `<h1>ReaderPage</h1>`
- `src/pages/BookmarksPage.jsx` — placeholder: `<h1>BookmarksPage</h1>`
- `src/pages/ProfilePage.jsx` — placeholder: `<h1>ProfilePage</h1>`
- `src/pages/NotFoundPage.jsx` — placeholder: `<h1>NotFoundPage</h1>`
- `src/hooks/useStarfield.js` — animates the starfield on a canvas without React re-renders
- `src/hooks/useDebounce.js` — placeholder: returns the value unchanged (no real debouncing yet)
- `src/constants/authCopy.js` — all auth text: `AUTH_MODES`, `AUTH_COPY`, `TERMS_TEXT`, `FORGOT_PASSWORD_TEXT`
- `src/constants/routes.js` — `ROUTES` path map: defined but not imported anywhere yet
- `src/services/mangaApi.js` — placeholder: `fetchManga` returns `{ endpoint, data: null }`
- `src/utils/validators.js` — placeholder: `validateEmail` only checks if a value is empty
- `src/styles/.gitkeep` — placeholder file for the empty styles folder

### Render path from the browser to the screen
1. `index.html` — the page has `<div id="root"></div>` and loads `/src/main.jsx`
2. `main.jsx` — creates a React root in StrictMode and renders `<App>`
3. `App.jsx` — renders `<Layout><AuthCard /></Layout>`
4. `Layout.jsx` — renders `StarBackground` and a centered `<main>` that shows `children` (the `AuthCard`)
5. `StarBackground.jsx` — renders a full-screen `<canvas>` and starts the starfield animation via `useStarfield`
6. `AuthCard.jsx` — renders the `GlassCard` containing `Logo`, `AuthTabs`, and the sign-in / sign-up form

### Component map
| Component | Props | State? | Parent |
| --------- | ----- | ------ | ------ |
| `Layout` | `children` | Presentational, no state | `App` |
| `StarBackground` | none | Presentational, no state (animation is handled by the `useStarfield` hook) | `Layout` |
| `GlassCard` | `children` | Presentational, no state | `AuthCard` |
| `Logo` | `isFilled` (default `false`) | Presentational, no state | `AuthCard` |
| `AuthTabs` | `mode`, `onChange` | Presentational, no state; reports clicks back to the parent | `AuthCard` |
| `FloatingInput` | `id`, `label`, `type`, `value`, `onChange`, `placeholder`, `autoComplete` | Presentational, fully controlled by the parent | `AuthCard` |
| `Button` | `type`, `children`, `disabled`, `onClick` | Presentational, no state | `AuthCard` |
| `Checkbox` | `id`, `checked`, `onChange`, `label` | Presentational, controlled by the parent | `AuthCard` |
| `LinkButton` | `type`, `children`, `onClick` | Presentational, no state | `AuthCard` |
| `Collapse` | `open`, `children` | Presentational, no state | `AuthCard` |
| `AuthCard` | none | Stateful: owns `mode` and `values` | `App` |

### State and data flow in AuthCard
AuthCard owns two pieces of state:
- `mode` — `"login"` or `"signup"` (starts as `"login"`), changed through `setMode`
- `values` — `{ username, email, password, confirmPassword, acceptTerms }`, the form values

`copy = AUTH_COPY[mode]` gives the right text for the current mode, and `isSignup` is true when mode is `"signup"`.

The change handler works like this: `handleChange(name)` returns an event handler. The handler reads `event.target.type`, `value`, and `checked`; for checkboxes it uses `checked`, otherwise `value`. It then calls `setValues({ ...values, [name]: newValue })`, which creates a brand-new object and leaves the old one untouched — nothing is mutated.

`mode` is passed down to `AuthTabs` as `mode={mode}`, and `setMode` is passed as `onChange`, so clicking a tab tells the parent to switch modes.

The checkbox is handled as a controlled input: `checked={values.acceptTerms}` and `onChange={handleChange("acceptTerms")}`, so tapping it flips `acceptTerms` in `values` through the same generic handler.

### How the starry background works
`StarBackground` creates a `canvasRef` and hands it to the `useStarfield` hook. The hook draws a black sky with slowly drifting, twinkling stars and the occasional shooting star on a 2D canvas.

A canvas is used because drawing and moving hundreds of pixels imperatively is far faster than managing that many DOM or SVG elements.

The stars array, the shooting-stars array, the animation frame id, and the next-shooter time are all kept in refs (`frameRef`, `starsRef`, `shootersRef`, `nextShooterRef`), not in React state. Changing state triggers a re-render, and re-rendering 60 times a second would freeze the app; refs can be mutated without telling React.

Cleanup: the `useEffect` return function cancels the pending animation frame, removes the window `resize` listener, and clears the debounce timer.

Reduced motion: the hook checks `window.matchMedia('(prefers-reduced-motion: reduce)')`. When reduced motion is requested, it draws a static sky once (`drawStars(0, false)`), starts no animation frame, and spawns no shooting stars. On resize it only redraws the static sky.

### How the styling works
Tailwind v4 is used through the `@tailwindcss/vite` Vite plugin (registered in `vite.config.js`). Tailwind is imported in `src/index.css` with `@import "tailwindcss";`, and `main.jsx` imports that CSS file.

The design uses many Tailwind arbitrary values, for example `h-[52px]`, `rounded-[11px]`, `text-[15px]`, `text-[#f5f5f5]`, `text-[#9a9a9a]`, `border-white/16`, `bg-[linear-gradient(...)]`, `backdrop-blur-[9px]`, `w-[calc(50%_-_4px)]`, `shadow-[0_30px_80px_rgba(0,0,0,0.75),...]`, `grid-rows-[1fr]` / `grid-rows-[0fr]`, `duration-[400ms]`, and `motion-reduce:transition-none` to respect the user's motion preference.

Outlined floating label (in `FloatingInput.jsx`): a wrapper `div.group relative h-[52px]` contains an `<input>` with the `peer` class (transparent background, placeholder hidden by default), a `<label>` absolutely positioned over it, and a `<fieldset>` with a `<legend>`. The fieldset, not the input, draws the border. The legend's width is collapsed to `max-w-[0.01px]` so it leaves a gap in the border line where the label text (inside a `<span className="px-1">`) can sit on the transparent background. When the field is focused or filled, `peer-focus:` / `peer-[:not(:placeholder-shown):]` variants move the label up and shrink it, and expand the legend width to `max-w-full`.

Collapsible fields (in `Collapse.jsx`): the outer div is a grid with `transition-[grid-template-rows]`. It uses `grid-rows-[1fr]` when open and `grid-rows-[0fr]` when closed, so the height animates from zero to the content size without knowing the content height in advance. Opacity fades in/out at the same time. The inner div gets `inert={!open}` and `aria-hidden={!open}` when closed, so it cannot be tabbed into or announced by screen readers.

### Constants
`src/constants/authCopy.js` holds `AUTH_MODES` (`LOGIN`, `SIGNUP`), `AUTH_COPY` (title, subtitle, tab label, submit label, swap text for each mode), `TERMS_TEXT`, and `FORGOT_PASSWORD_TEXT`. `src/constants/routes.js` holds `ROUTES` (all app paths in one place) but nothing imports it yet.

UI text is not hard-coded in the JSX so that all copy lives in one file. `AuthCard` and `AuthTabs` share the same labels through `AUTH_COPY[mode]`, and switching modes changes every piece of text at once.

### What is not built yet
- Validation and error messages — `handleSubmit` only prevents the default; `validateEmail` is a stub
- Show/Hide password toggle
- Logo inversion when all fields are filled — `Logo` accepts `isFilled` but it is never passed `true`
- Success state after submitting the form
- Routing — `ROUTES` exists but no router is installed and no page switches views
- API calls — `fetchManga` returns a stub `{ endpoint, data: null }`
- Protected routes — Bookmarks and Profile are noted as logged-in only, but nothing enforces it
- Other pages — all page files return only an `<h1>`; `MangaCard`, `MangaGrid`, `Header`, and `Footer` are placeholders too

Placeholder files: `src/pages/*.jsx` (9 files), `src/components/manga/MangaCard.jsx`, `src/components/manga/MangaGrid.jsx`, `src/components/layout/Header.jsx`, `src/components/layout/Footer.jsx`, `src/hooks/useDebounce.js`, `src/services/mangaApi.js`, `src/utils/validators.js`, and the unused `src/constants/routes.js`.

### How to add a new field
Open `src/components/auth/AuthCard.jsx`:
1. Add the new key to the `useState` initial object (for example `phone: ""`).
2. Add a `<FloatingInput id="phone" value={values.phone} onChange={handleChange("phone")} ...>` inside the `<form>` (wrap it in `<Collapse open={isSignup}>` if it is sign-up only).
3. If you need new wording, add it to `src/constants/authCopy.js`.
The existing `handleChange` already handles any key generically, so no handler change is needed.

### How to change the brand name or any text
- Brand name "MangaHub": the text span in `src/components/ui/Logo.jsx`, and the `<title>` in `index.html`.
- All login / sign up wording (titles, subtitles, tab labels, buttons, swap text, terms, forgot password): `src/constants/authCopy.js`.

## Naming conventions

- Components and pages use PascalCase, and the file name is the same as the component name (`MangaCard.jsx` exports `MangaCard`).
- Hooks and utilities use camelCase (`useDebounce.js`, `validators.js`).
- One component per file, exported as the default export.
- No barrel files (no `index.js` that only re-exports) for now.

## Note

Bookmarks and Profile are for logged-in users only; route protection will be added later.

