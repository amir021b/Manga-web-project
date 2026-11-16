# MangaHub Frontend Overview

**Project:** MangaHub (frontend package name `manga-next`)
**Path:** `docs/FRONTEND_OVERVIEW.md`
**Status:** Design preview — mostly mock-data driven; no live backend connected.

This document is a read-only analysis of the existing Next.js frontend. No source files were modified to produce it.

---

## 1. Project Summary

**Purpose:** A manga reading/browsing platform ("MangaHub") frontend. It is currently a design preview: pages render from local mock data, with an axios API client and service layer prepared for a real backend that is not yet connected.

**Tech stack (exact versions from `package.json`):**

| Package | Version | Role |
|---|---|---|
| `next` | `16.4.6` | React framework (App Router + Pages Router coexist) |
| `react` | `19.3.0` | UI library |
| `react-dom` | `19.3.0` | React DOM |
| `@tanstack/react-query` | `^5.107.1` | Server-state management |
| `axios` | `^1.21.1` | HTTP client |
| `lucide-react` | `^1.72.0` | Icon library |
| `tailwindcss` | `4.3.3` | Styling (v4, via `@import "tailwindcss"`) |
| `@tailwindcss/turbopack` | `4.3.3` | Tailwind Turbopack loader |
| `typescript` | `^5` | Type checking |
| `eslint` | `^9` | Linting |
| `eslint-config-next` | `16.4.6` | Next.js ESLint config |

**TypeScript config (`tsconfig.json`):**
- Strict mode enabled, `noEmit`, bundler module resolution, path alias `@/*` → `./src/*`.
- Includes `.next/dev/types/route` manifests (auto-generated).

**Next.js config (`next.config.ts`):**
- Minimal; only configures Turbopack CSS loader rule for `*.css` using `@tailwindcss/turbopack`.
- No `tailwind.config.ts`, `postcss.config.*`, or `.env*` files found in the project root.

**Available npm scripts (`package.json`):**

| Script | Command |
|---|---|
| `dev` | `next dev` |
| `build` | `next build` |
| `start` | `next start` |
| `lint` | `eslint` |


---

## 2. Folder Structure

Tree (excluding `node_modules`, `.next`, `.git`):

```
Front-End/
├── docs/                          (documentation output only; not part of source)
├── public/
│   ├── avatars/manga-tester.png
│   └── manga-posters/*.jpg        (cover images used by mock data)
├── src/
│   ├── app/                       Next.js App Router
│   │   ├── globals.css            Global CSS + Tailwind import + CSS variables + animations
│   │   ├── icon.svg               App icon
│   │   ├── layout.tsx             Root layout (Server Component), metadata, fonts, Providers wrapper
│   │   ├── not-found.tsx          App Router 404 shell
│   │   ├── page.tsx               App Router home shell
│   │   ├── providers.tsx          Client providers (React Query, User, Theme, Toast, Backpack)
│   │   ├── explore/page.tsx       /explore shell
│   │   ├── login/page.tsx         /login shell
│   │   ├── signup/page.tsx        /signup shell
│   │   ├── profile/page.tsx       /profile shell
│   │   ├── search/page.tsx        /search shell (wrapped in Suspense)
│   │   ├── manga/[id]/page.tsx    /manga/[id] shell (async Server Component)
│   │   └── manga/[id]/chapter/[chapterId]/page.tsx   /manga/[id]/chapter/[chapterId] shell (async Server Component)
│   ├── pages/                     Pages Router (fallback / client pages)
│   │   ├── _app.tsx               Wraps pages in Providers
│   │   ├── HomePage.tsx
│   │   ├── ExplorePage.tsx
│   │   ├── MangaDetailPage.tsx
│   │   ├── ReaderPage.tsx
│   │   ├── ProfilePage.tsx
│   │   ├── SearchPage.tsx
│   │   └── NotFoundPage.tsx
│   ├── components/
│   │   ├── auth/AuthCard.tsx
│   │   ├── auth/TermsDialog.tsx
│   │   ├── home/MarqueeRow.tsx
│   │   ├── home/SectionHeader.tsx
│   │   ├── home/SectionTitle.tsx
│   │   ├── layout/Footer.tsx
│   │   ├── layout/Header.tsx
│   │   ├── layout/Layout.tsx
│   │   ├── layout/StarBackground.tsx
│   │   ├── manga/MangaCard.tsx
│   │   ├── manga/MangaGrid.tsx
│   │   ├── profile/EditProfileModal.tsx
│   │   ├── settings/AccountSection.tsx
│   │   ├── settings/AppearanceSection.tsx
│   │   ├── settings/NotificationsSection.tsx
│   │   ├── settings/SettingsTab.tsx
│   │   └── ui/                    (AuthTabs, Button, Checkbox, Collapse, FloatingInput,
│   │                             GlassCard, LinkButton, Logo, PasswordToggle, Toast)
│   ├── context/
│   │   ├── BackpackContext.tsx
│   │   ├── ThemeContext.tsx
│   │   ├── ToastContext.tsx
│   │   └── UserContext.tsx
│   ├── data/                      Mock data fixtures
│   │   ├── bestSellers.ts
│   │   ├── bigThree.ts
│   │   ├── index.ts
│   │   ├── latestUpdates.ts
│   │   ├── mangadata.ts
│   │   ├── mangaDetails.ts
│   │   └── newUserBundle.ts
│   ├── hooks/
│   │   ├── api/
│   │   │   ├── queryKeys.ts
│   │   │   ├── useAuth.ts
│   │   │   ├── useBackpack.ts
│   │   │   ├── useManga.ts
│   │   │   ├── useSettings.ts
│   │   │   └── useUser.ts
│   │   ├── useAuthForm.ts
│   │   ├── useAvatarCrop.ts
│   │   ├── useDebounce.ts
│   │   ├── usePasswordForm.ts
│   │   └── useStarfield.ts
│   ├── lib/axios.ts               Axios instance + token helpers
│   ├── services/
│   │   ├── authApi.ts
│   │   ├── backpackApi.ts
│   │   ├── mangaApi.ts
│   │   ├── settingsApi.ts
│   │   └── userApi.ts
│   ├── types/api.ts               TypeScript type definitions
│   ├── constants/
│   │   ├── authCopy.ts
│   │   ├── routes.ts
│   │   └── termsContent.ts
│   └── utils/validators.ts
├── next.config.ts
├── package.json
├── tsconfig.json
└── next-env.d.ts
```

Top-level folder purposes:
- `src/app/` — Next.js App Router: route shells, root layout, global CSS, providers. Each route shell delegates to a client page under `src/pages/`.
- `src/pages/` — Client page components consumed by the App Router shells (hybrid App Router + Pages Router setup).
- `src/components/` — Reusable UI, organized by domain: `auth`, `home`, `layout`, `manga`, `profile`, `settings`, `ui`.
- `src/context/` — React Context providers: `BackpackContext`, `ThemeContext`, `ToastContext`, `UserContext`.
- `src/hooks/` — Custom hooks; `hooks/api/` contains React Query–based data hooks.
- `src/lib/` — Low-level library setup (`axios.ts`).
- `src/services/` — API service layer wrapping axios (`authApi`, `backpackApi`, `mangaApi`, `settingsApi`, `userApi`).
- `src/types/` — TypeScript interfaces/types (`api.ts`).
- `src/data/` — Static mock data fixtures used in place of a backend.
- `src/constants/` — UI copy, route constants, terms content.
- `src/utils/` — Form validation helpers.

---

## 3. Routes and Pages

| Route | File path (shell) | Page component | Type | Description | Data it uses | Current state |
|---|---|---|---|---|---|---|
| `/` | `src/app/page.tsx` | `HomePage` (`src/pages/HomePage.tsx`) | Client page inside Server layout | Home hero carousel + Most Popular + Latest Updates + Big Three + New User Special rows | Mock: `bigThree`, `bestSellers`, `latestUpdates`, `newUserBundle` | Done |
| `/explore` | `src/app/explore/page.tsx` | `ExplorePage` (`src/pages/ExplorePage.tsx`) | Client | Browse manga with genre filter chips | Mock: `getAllManga()` (`mangadata.ts`) | Done |
| `/manga/[id]` | `src/app/manga/[id]/page.tsx` | `MangaDetailPage` (`src/pages/MangaDetailPage.tsx`) | Client | Manga details, save toggle, chapters list | Mock: `mangaDetails[id]` (`mangaDetails.ts`) | Done |
| `/manga/[id]/chapter/[chapterId]` | `src/app/manga/[id]/chapter/[chapterId]/page.tsx` | `ReaderPage` (`src/pages/ReaderPage.tsx`) | Client | Chapter reader (placeholder) | None (static text) | Partial |
| `/search` | `src/app/search/page.tsx` | `SearchPage` (`src/pages/SearchPage.tsx`) | Client (inside `Suspense`) | Search results with debounced query | Mock: `searchManga()` | Done |
| `/login` | `src/app/login/page.tsx` | `AuthCard` (`src/components/auth/AuthCard.tsx`) | Client | Login form | API (`/api/auth/login`); mocked success path | Partial |
| `/signup` | `src/app/signup/page.tsx` | `AuthCard` (`src/components/auth/AuthCard.tsx`) | Client | Signup form | API (`/api/auth/signup`); mocked success path | Partial |
| `/profile` | `src/app/profile/page.tsx` | `ProfilePage` (`src/pages/ProfilePage.tsx`) | Client | Backpack, history, settings tabs, edit profile, logout | Mock profile (`USE_MOCK_PROFILE = true`) | Done |
| 404 | `src/app/not-found.tsx` | `NotFoundPage` (`src/pages/NotFoundPage.tsx`) | Client | Not-found page | None | Done |

Notes:
- Dynamic routes `[id]` and `[chapterId]` use async Server Components that `await params` then pass `id`/`chapterId` to client pages.
- Route groups like `(main)` do **not** exist.
- `loading.tsx` and `error.tsx` are **not found** anywhere in `src/app/`.
- `Header` is hidden on `/login` and `/signup`.
- All route shells wrap content in `Layout` (`src/components/layout/Layout.tsx`).


---

## 4. Layouts and Navigation

### Root layout — `src/app/layout.tsx`
- Server Component (no `"use client"`).
- Sets page metadata: `title: "MangaHub"`, `description: "Manga reading platform"`.
- Loads `Geist` and `Geist_Mono` fonts from `next/font/google`, applied as CSS variables `--font-geist-sans` / `--font-geist-mono` on `<html>`.
- Imports `./globals.css`.
- Wraps children in `<Providers>`.

### Layout — `src/components/layout/Layout.tsx`
- Server Component.
- Structure: `StarBackground` (canvas, decorative) → `Header` → `<main>` (children) → `Footer`.
- `<main>` uses `pt-24` padding to clear the fixed sticky header.
- Background uses `--mh-bg`; text uses `--mh-text`; supports `transition-colors duration-300` for theme changes.

### Header — `src/components/layout/Header.tsx`
- Client Component (`"use client"`).
- **Sticky/fixed:** `fixed top-4 left-1/2 z-50 w-[min(1200px,calc(100%-2rem))] -translate-x-1/2`, with `backdrop-blur-md`, shadow, and border.
- Returns `null` on `/login` and `/signup` (hidden on auth pages).
- Contains:
  - `Logo` (variant `header`).
  - Desktop nav links: Home (`/`), Explore (`/explore`).
  - Search form: on submit pushes `/search?q=<query>` via `router.push`. Input is **not debounced** in the header itself (the search page debounces the `q` param).
  - Signed-in state: shows username + avatar/profile button → `/profile`.
  - Signed-out state: Login button → `/login`.
- **Active link highlighting:** `NavLink` compares `pathname === href`; active link gets `text-[var(--mh-text)] font-semibold border-b-2 border-[var(--mh-accent)]`; inactive gets `text-[var(--mh-text-muted)] hover:text-[var(--mh-text)]`.

### Footer — `src/components/layout/Footer.tsx`
- Server Component.
- Copyright line (`© <year> MangaHub. Design preview.`) and static links (Terms, Privacy, Contact) pointing to `#`.

### StarBackground — `src/components/layout/StarBackground.tsx`
- Client Component; renders a `<canvas>` with an animated starfield via `useStarfield()` hook. `aria-hidden`, `pointer-events-none`.


---

## 5. Components Inventory

| Component | File path | Props (name and type) | Used in | Client/Server | Notes |
|---|---|---|---|---|---|
| Layout | `src/components/layout/Layout.tsx` | `{ children: React.ReactNode }` | All app routes | Server | Wraps Header, main, Footer; fixed-header padding |
| Header | `src/components/layout/Header.tsx` | none | All routes except `/login`, `/signup` | Client | Fixed sticky nav, search, auth toggle |
| Footer | `src/components/layout/Footer.tsx` | none | All app routes | Server | Copyright + static links |
| StarBackground | `src/components/layout/StarBackground.tsx` | none | Layout, AuthCard | Client | Animated canvas starfield |
| MangaCard | `src/components/manga/MangaCard.tsx` | `id: number\|string`, `title: string`, `genres: string[]`, `posterUrl?: string`, `to?: string`, `hoverLift?: boolean`, `hoverLiftClass?: string`, `showSaveButton?: boolean`, `badge?: React.ReactNode` | HomePage, ExplorePage, SearchPage, ProfilePage | Client | Save/remove toggle via BackpackContext; grayscale poster; "No Poster Yet" fallback |
| MangaGrid | `src/components/manga/MangaGrid.tsx` | `{ children, className? }` | Most pages | Server | Simple `grid gap-4 sm:grid-cols-3` wrapper |
| MarqueeRow | `src/components/home/MarqueeRow.tsx` | `items: MangaItem[]`, `className?` | HomePage | Client | Auto-scrolling horizontal marquee (doubled items), drag-to-scroll, pauses on hover |
| SectionTitle | `src/components/home/SectionTitle.tsx` | `{ children, className? }` | HomePage | Server | Section divider with side rules |
| SectionHeader | `src/components/home/SectionHeader.tsx` | `{ title, subtitle?, className? }` | HomePage | Server | Centered section header with side rules |
| EditProfileModal | `src/components/profile/EditProfileModal.tsx` | `user`, `onSave`, `onClose` | ProfilePage | Client | Avatar crop/zoom via `useAvatarCrop`; username/bio inputs |
| SettingsTab | `src/components/settings/SettingsTab.tsx` | none | ProfilePage | Client | Collapsible sections: Appearance, Account & Security, Notifications |

| AppearanceSection | `src/components/settings/AppearanceSection.tsx` | `accent`, `setAccent`, `density`, `setDensity`, `ACCENT_OPTIONS`, `DENSITY_OPTIONS` | SettingsTab | Client | Accent color + density toggle buttons |
| AccountSection | `src/components/settings/AccountSection.tsx` | `user`, `setCurrentUser`, `setBackpack`, `addToast`, `router` | SettingsTab | Client | Password change, email update, delete account (danger zone) |
| NotificationsSection | `src/components/settings/NotificationsSection.tsx` | none | SettingsTab | Client | Notification toggles persisted to `localStorage` (`mangahub_notifications`) |
| Button | `src/components/ui/Button.tsx` | `type?`, `children`, `disabled?`, `loading?`, `loadingLabel?`, `onClick?`, `className?`, `style?` | Many | Server (no `"use client"`) | Primary white/black button with loading spinner |
| Logo | `src/components/ui/Logo.tsx` | `variant?`, `className?` | Header, AuthCard | Client | "MangaHub" wordmark + icon |
| Toast | `src/components/ui/Toast.tsx` | `title`, `message`, `onClose` | ToastProvider | Client | Auto-dismiss after 3500ms; accent-colored icon |
| AuthTabs | `src/components/ui/AuthTabs.tsx` | `mode`, `onChange`, `disabled?` | AuthCard | Client | Login/Signup toggle tabs |
| Checkbox | `src/components/ui/Checkbox.tsx` | `id`, `checked`, `onChange`, `label`, `labelAction?`, `error?`, `disabled?` | AccountSection, NotificationsSection, AuthCard | Client | Custom-styled checkbox |
| Collapse | `src/components/ui/Collapse.tsx` | `open`, `children` | AuthCard, SettingsTab | Client | Height-animated collapse |
| FloatingInput | `src/components/ui/FloatingInput.tsx` | `id`, `label?`, `type?`, `value`, `onChange`, `placeholder?`, `autoComplete?`, `name?`, `disabled?`, `endAdornment?`, `leadingIcon?`, `error?`, `className?` | AuthCard, EditProfileModal, AccountSection | Client | Floating-label input |
| GlassCard | `src/components/ui/GlassCard.tsx` | `{ children }` | AuthCard | Client | Blurred glass container |
| LinkButton | `src/components/ui/LinkButton.tsx` | `type?`, `children`, `onClick?`, `disabled?` | AuthCard | Client | Link-styled button |
| PasswordToggle | `src/components/ui/PasswordToggle.tsx` | `visible`, `onToggle`, `disabled?` | AuthCard, AccountSection | Client | Eye/eye-off toggle |
| AuthCard | `src/components/auth/AuthCard.tsx` | none | `/login`, `/signup` | Client | Full auth form (tabs, inputs, validation, terms dialog, success state) |
| TermsDialog | `src/components/auth/TermsDialog.tsx` | `open`, `onClose`, `onAccept` | AuthCard | Client | Terms of use modal |


---

## 6. Data Layer

### Axios instance — `src/lib/axios.ts`
- **Base URL source:** `process.env.NEXT_PUBLIC_API_BASE` env variable, falling back to hardcoded `http://localhost:5000` (`DEFAULT_API_BASE_URL`). Trailing slashes stripped.
- **Timeout:** `15000` ms.
- **Headers:** `Content-Type: application/json`.
- **Request interceptor:** Attaches `Authorization: Bearer <token>` where token comes from `getStoredToken()` (reads `localStorage` key `mangahub_token`, with `sessionStorage` fallback migration).
- **Response interceptor:** None.
- **Token helpers:** `getStoredToken()`, `setStoredToken(token)`, `clearStoredToken()`; storage keys `mangahub_token` and `mangahub_user`.
- **Error helpers:** `getApiErrorBody(error)`, `getApiErrorStatus(error)`, `getApiErrorMessage(error, fallback)`.
- Default export: `api` axios instance.

### React Query setup — `src/app/providers.tsx`
- Client Component.
- `QueryClient` created with `useState` (one instance):
  - `staleTime: 60 * 1000` (1 minute)
  - `gcTime: 5 * 60 * 1000` (5 minutes)
  - `retry: 1`
  - `refetchOnWindowFocus: false`
- Provider stack (outer to inner): `QueryClientProvider` → `UserProvider` → `ThemeProvider` → `ToastProvider` → `BackpackProvider`.
- Also used by Pages Router `_app.tsx`, which renders `Providers` around `Component`.

### Query keys — `src/hooks/api/queryKeys.ts`
- `queryKeys.profile = ["user", "profile"]`
- `queryKeys.backpack = ["backpack"]`
- `queryKeys.manga.list = ["manga", "list"]`
- `queryKeys.manga.detail(id) = ["manga", "detail", String(id)]`
- `queryKeys.manga.search(query) = ["manga", "search", query]`

### Custom hooks

| Hook | File | Fetches / does | Parameters | Return shape |
|---|---|---|---|---|
| `useMangaList` | `src/hooks/api/useManga.ts` | All manga list | none | `UseQueryResult<MangaItem[]>` (`staleTime: Infinity`, `initialData: getAllManga`) |
| `useMangaById` | `src/hooks/api/useManga.ts` | Single manga with details | `id: number` | `UseQueryResult<MangaWithDetails \| null>` (`staleTime: Infinity`, `retry: false`, `enabled: Number.isFinite(id)`) |
| `useMangaSearch` | `src/hooks/api/useManga.ts` | Search manga by title | `query: string` | `UseQueryResult<MangaItem[]>` (`staleTime: Infinity`) |
| `useProfileQuery` | `src/hooks/api/useUser.ts` | User profile | `enabled = true` | `UseQueryResult<UserData \| null>` (`staleTime: 5 min`, `retry: 1`) |
| `useUpdateProfile` | `src/hooks/api/useUser.ts` | Update profile (mutation) | none | `UseMutation<UserData \| null, Error, UpdateProfileInput>` |
| `useBackpackQuery` | `src/hooks/api/useBackpack.ts` | Backpack IDs | `enabled = true` | `UseQueryResult<string[]>` (`staleTime: 60s`, `retry: 1`) |
| `useToggleBackpackItem` | `src/hooks/api/useBackpack.ts` | Add/remove backpack item (mutation) | none | `UseMutation<BackpackToggleResult, Error, ToggleBackpackVariables, ToggleBackpackContext>` with optimistic updates |
| `useChangePassword` | `src/hooks/api/useSettings.ts` | Change password (mutation) | none | `UseMutation<void, Error, ChangePasswordInput>` |
| `useUpdateEmail` | `src/hooks/api/useSettings.ts` | Update email (mutation) | none | `UseMutation<void, Error, UpdateEmailInput>` |
| `useAuthMutation` | `src/hooks/api/useAuth.ts` | Login/signup (mutation) | none | `UseMutation<AuthResponse, AuthRequestError, AuthMutationVariables>` |
| `useAuthForm` | `src/hooks/useAuthForm.ts` | Auth form state + submission | none | `{ mode, values, errors, isSubmitting, isSuccess, isSignup, copy, isFilled, handleChange, handleSubmit, switchMode, ... }` |
| `useAvatarCrop` | `src/hooks/useAvatarCrop.ts` | Avatar crop/zoom logic | `initialAvatar: string \| null` | `{ avatarFile, avatarPreview, crop, isPanning, handleAvatarChange, handlePanStart/Move/End, handleZoom, cropImage, ... }` |
| `useDebounce` | `src/hooks/useDebounce.ts` | Debounce a string value | `value: string`, `delay = 300` | debounced `string` |
| `usePasswordForm` | `src/hooks/usePasswordForm.ts` | Password form state | `{ onSave }` | `{ passwords, passwordErrors, passwordVisibility, handleSubmit, handleChange, toggleVisibility }` |
| `useStarfield` | `src/hooks/useStarfield.ts` | Animated canvas starfield | `canvasRef` | (side effects only) |

### Current data source per page
- **Home:** Mock data only (`bigThree`, `bestSellers`, `latestUpdates`, `newUserBundle` from `src/data/`; ultimately `mangadata.ts`). No API call.
- **Explore:** Mock data only (`getAllManga()` from `mangaApi.ts` → `mangadata.ts`). No API call.
- **Manga details:** Mock data only (`getMangaById(id)` → `mangadata.ts` + `mangaDetails.ts`). No API call.
- **Reader:** Placeholder only; no data fetching.
- **Search:** Mock data only (`searchManga(query)` → `mangadata.ts`). No API call.
- **Profile:** Mock profile (`USE_MOCK_PROFILE = true` in `userApi.ts` → `getMockProfile()`). Backpack uses `localStorage`/mock sync.
- **Auth:** Calls `submitAuth()` → `api.post("/api/auth/login" \| "/api/auth/signup")`, but success flow stores token/user in localStorage and shows a "design preview, nothing was saved" message.

**Overall:** Every page currently uses **mock data / localStorage**, not a real backend. The API client and service functions exist but point at `http://localhost:5000` with no backend confirmed.


---

## 7. Types and Data Models

Defined in `src/types/api.ts`:

```ts
export interface UserData {
  id?: string;
  username?: string;
  email?: string;
  avatar?: string | null;
  bio?: string;
}
export type AuthMode = "login" | "signup";
export interface AuthValues {
  username?: string;
  email: string;
  password: string;
  confirmPassword?: string;
  acceptTerms?: boolean;
}
export interface LoginPayload { email: string; password: string; }
export interface SignupPayload { username?: string; email: string; password: string; }
export interface AuthPayload { token?: string; user?: UserData; }
export interface ApiResponse<T> { data?: T; message?: string; }
export type AuthResponse = ApiResponse<AuthPayload>;
export type ProfilePayload = UserData | { user?: UserData };
export type ProfileResponse = ApiResponse<ProfilePayload>;
export interface BackpackPayload { backpack?: Array<string | number>; }
export type BackpackResponse = ApiResponse<BackpackPayload | Array<string | number>>;
export interface BackpackItem {
  id: string | number;
  title: string;
  genres: string[];
  posterUrl?: string;
}
export type BackpackToggleResult = BackpackItem[] | string[] | number[];
export interface UpdateProfileInput { username?: string; bio?: string; avatar?: string | null; }
export interface ChangePasswordInput { currentPassword: string; newPassword: string; }
export interface UpdateEmailInput { email: string; }
export type AuthErrorCode =
  | "email_exists"
  | "invalid_credentials"
  | "network_error"
  | "server_error";
export interface ApiErrorBody { message?: string; code?: string; error?: string; }
```

Manga models (split across `src/data/mangadata.ts`, `src/data/mangaDetails.ts`, `src/services/mangaApi.ts`):

`src/data/mangadata.ts` — `MangaSeedItem`:
```ts
export interface MangaSeedItem {
  id: number;
  title: string;
  japaneseTitle: string;
  author: string;
  status: string;
  genres: string[];
  description: string;
  coverImage: string;
}
```

`src/data/mangaDetails.ts`:
```ts
export interface Chapter {
  chapterId: number;
  title: string;
  date: string;
}
export interface MangaDetail {
  chapters: Chapter[];
}
```

`src/services/mangaApi.ts`:
```ts
export interface MangaItem extends MangaSeedItem {
  posterUrl: string;
}
export type { Chapter, MangaDetail } from '@/data/mangaDetails';
export interface MangaWithDetails extends MangaItem {
  detail: MangaDetail;
}
```

Auth form status constants (`src/constants/authCopy.ts`): `STATUS = { IDLE: "idle", SUBMITTING: "submitting", SUCCESS: "success" }`.


---

## 8. Expected API Contract (inferred)

All endpoints below are **inferred** from the service layer; none are connected to a live backend. Frontend currently drives everything from mock data (`USE_MOCK_PROFILE = true`, `mangaApi` reads local files).

| Method | Path | Query params | Request body | Response shape | Source |
|---|---|---|---|---|---|
| POST | `/api/auth/login` | none | `LoginPayload` { email, password } | `AuthResponse` { data: { token?, user? }, message? } | `authApi.ts` `submitAuth` (inferred) |
| POST | `/api/auth/signup` | none | `SignupPayload` { username?, email, password } | `AuthResponse` { data: { token?, user? }, message? } | `authApi.ts` (inferred) |
| GET | `/api/users/profile` | none | none | `ProfileResponse` | `userApi.ts` `fetchProfile` (inferred) |
| PUT | `/api/users/profile` | none | `{ username?, bio?, avatar? }` | `ProfileResponse` | `userApi.ts` `updateProfile` (inferred) |
| GET | `/api/users/backpack` | none | none | `BackpackResponse` | `backpackApi.ts` `fetchBackpack` (inferred) |
| POST | `/api/users/backpack` | none | `{ mangaId: string }` | `BackpackToggleResult` | `backpackApi.ts` `toggleBackpackItem` (inferred) |
| POST | `/api/user/settings/password` | none | `ChangePasswordInput` { currentPassword, newPassword } | void | `settingsApi.ts` `changePassword` (inferred) |
| POST | `/api/user/settings/email` | none | `UpdateEmailInput` { email } | `ApiResponse<ProfilePayload>` | `settingsApi.ts` `updateEmail` (inferred) |

Mock-layer functions (not HTTP endpoints) used by the UI instead:
- `getAllManga(): MangaItem[]` — `mangaApi.ts` (reads `mangadata.ts`)
- `getMangaById(id): MangaWithDetails \| undefined` — `mangaApi.ts`
- `getMangaByIds(ids): MangaItem[]` — `mangaApi.ts`
- `searchManga(query): MangaItem[]` — `mangaApi.ts` (case-insensitive title filter)
- `hasAvailableChapters(id): boolean` — `mangaApi.ts`
- `getMockProfile(): UserData` — `userApi.ts`


---

## 9. Styling and Design System

### Tailwind config
- **No `tailwind.config.ts` / `tailwind.config.js` found.** Tailwind v4 is used via `@import "tailwindcss";` in `src/app/globals.css`, so customization is via CSS variables and arbitrary-value utilities rather than a JS config.
- No PostCSS config found.

### CSS variables (`src/app/globals.css`, `:root` / `[data-theme="dark"]`)
- `--mh-bg: #0a0a0a`
- `--mh-surface: rgba(255,255,255,0.04)`
- `--mh-surface-strong: rgba(255,255,255,0.07)`
- `--mh-text: #f5f5f5`
- `--mh-text-secondary: #9a9a9a`
- `--mh-text-muted: rgba(255,255,255,0.5)`
- `--mh-border: rgba(255,255,255,0.16)`
- `--mh-border-soft: rgba(255,255,255,0.1)`
- `--mh-shadow: 0 8px 32px rgba(0,0,0,0.4)`
- `--mh-shadow-strong: 0 30px 80px rgba(0,0,0,0.75)`
- `--mh-gradient-bg`: linear gradient
- `--mh-input-bg: #050505`
- `--mh-input-text: #f5f5f5`
- `--mh-input-placeholder: #9a9a9a`
- `--mh-card-bg: rgba(255,255,255,0.09)`
- `--mh-star-bg: #050505`

### Accent color theme (`data-accent` attribute on `<html>`)
Set by `ThemeContext` and persisted to `localStorage` (`mangahub_accent`, default `"red"`):
- `red`: `--mh-accent: #ef4444`, soft `rgba(239,68,68,0.15)`, hover `#dc2626`
- `purple`: `--mh-accent: #a855f7`, soft `rgba(168,85,247,0.15)`, hover `#9333ea`
- `blue`: `--mh-accent: #22d3ee`, soft `rgba(34,211,238,0.15)`, hover `#0891b2`

### UI density
`DENSITY_OPTIONS = [ { id: 'comfortable', label: 'Comfortable' }, { id: 'compact', label: 'Compact' } ]` (ThemeContext). Stored in `localStorage` (`mangahub_density`), applied as `data-density` attribute. **Note:** density is stored/applied but no visible CSS rules consume `data-density` — it appears not to actually adjust spacing (cosmetic only).

### Theme
`THEME_OPTIONS = [ { id: 'dark', label: 'Dark' } ]` only. Stored as `mangahub_theme`, applied as `data-theme`. Only dark exists.

### Fonts
- `Geist` (sans) and `Geist_Mono` (mono) via `next/font/google`, CSS variables `--font-geist-sans` / `--font-geist-mono`.

### Animations (`globals.css` `@keyframes`)
- `smoothZoom` (hero background scale), `fadeUp`, `backdropFadeIn/Out`, `modalFadeIn/Out`, `pageFadeIn`, `tabContentIn`, `authCardIn`.
- Utility classes: `.no-scrollbar`, `.fade-up`, `.backdrop-fade-in/out`, `.modal-fade-in/out`, `.page-fade-in`, `.tab-content-in`, `.auth-card-in`.

### Reusable UI patterns
- Cards: `MangaCard` (rounded-2xl, border, grayscale poster, gradient overlay, save button), `GlassCard` (backdrop-blur, white/30 bg).
- Buttons: `Button` (white bg, black text, shadow, loading state); text `LinkButton`.
- Badges: inline pill spans with `border-[var(--mh-border-soft)]`, `text-[var(--mh-text-secondary)]`.
- Glass/blur: `backdrop-blur-md` header/footer, `backdrop-blur-[5px]` modal, `backdrop-blur-[8px]` toast.

### Theme/settings logic
- `ThemeProvider` (`src/context/ThemeContext.tsx`): `theme`, `accent`, `density` state initialized from `localStorage`; `useEffect` writes back to `localStorage` and sets `document.documentElement.dataset.theme/accent/density`.
- Defaults: theme `dark`, accent `red` ("Default Red"), density `comfortable`.
- Accent options: Default Red, Neon Purple, Cyber Blue (per `ThemeContext.ACCENT_OPTIONS`).
- Density options: Comfortable, Compact (not visibly consumed by CSS).


---

## 10. Feature Status

| Feature | Status | Evidence |
|---|---|---|
| Home hero carousel | Done | `HomePage.tsx`: hero section with zooming background image (`smoothZoom` animation) + "Big Three" grid |
| Most Popular row | Done | `HomePage.tsx`: `MarqueeRow items={bestSellers}` |
| Latest Updates row | Done | `HomePage.tsx`: `MarqueeRow items={latestUpdates}` |
| Explore with genre filter | Done | `ExplorePage.tsx`: genre chips, `filteredManga` memo |
| Search | Done | `SearchPage.tsx`: debounced query (300ms), `useMangaSearch`; header search pushes to `/search?q=` |
| Manga details | Done | `MangaDetailPage.tsx`: poster, title, status, author, genres, synopsis, save button, chapter list |
| Chapters list | Done | `MangaDetailPage.tsx`: chapter links to `/manga/:id/chapter/:chapterId`; empty state "No chapters available yet." |
| Save/Backpack | Done | `MangaCard`, `MangaDetailPage`, `ProfilePage` backpack tab via `BackpackContext` + `useBackpack` |
| Reading history | Partial | `ProfilePage.tsx` history tab renders only "No reading history yet." — no actual history tracking |
| Profile | Done | `ProfilePage.tsx`: avatar, username, email, bio, tabs, logout |
| Edit Profile | Done | `EditProfileModal.tsx`: username/bio inputs + avatar crop |
| Settings: Appearance | Done | `AppearanceSection.tsx`: accent color + density toggles |
| Settings: Account & Security | Done | `AccountSection.tsx`: change password, update email, delete account |
| Settings: Notifications | Done | `NotificationsSection.tsx`: localStorage-persisted toggles |
| Auth pages (login/signup) | Done | `AuthCard.tsx`: form, validation, terms dialog, success state (preview message only) |


---

## 11. Known Issues and Observations

1. **Mock data everywhere** — All pages render from local fixtures (`mangadata.ts`, `mangaDetails.ts`) or `localStorage`. `USE_MOCK_PROFILE = true` forces mock profile. No live backend is wired up (`src/services/*` functions exist but call `http://localhost:5000`).
2. **Hardcoded default API base URL** — `src/lib/axios.ts` hardcodes `http://localhost:5000` as the fallback when `NEXT_PUBLIC_API_BASE` is unset. No `.env.example` exists to document required env vars.
3. **Header search has no debounce** — The header input updates state on every keystroke and submits on form submit only (so no excessive requests), but the input itself isn't debounced. The search page does debounce the `q` param (300ms via `useDebounce`).
4. **Disabled "Coming Soon" button** — `MangaDetailPage.tsx` renders a `disabled` "Coming Soon" button when `firstChapterId` is undefined.
5. **Empty chapters state** — `MangaDetailPage.tsx` shows "No chapters available yet." because `mangaDetails` chapter store is empty for every manga (`mangaDetails.ts` initializes all to `{ chapters: [] }`).
6. **Low-contrast save buttons** — Save/remove buttons on `MangaCard` and `MangaDetailPage` use `bg-[var(--mh-surface)]` with `text-[var(--mh-text)]`; on dark surfaces this may be low contrast depending on accent/theme.
7. **Navbar overlap risk** — `Header` is `fixed`; `Layout`'s `<main>` uses `pt-24` to compensate, but some page sections add their own padding; potential overlap on small viewports not verified.
8. **History feature not implemented** — Profile "History" tab is a static empty placeholder; no history service or hook exists.
9. **Density setting does nothing** — `data-density` is set on `<html>` but no CSS consumes it; the Comfortable/Compact toggle has no visual effect.
10. **Missing `loading.tsx` / `error.tsx`** — No Next.js loading or error UI shells exist in `src/app/`; `/search` wraps its own inline `Suspense` fallback ("Loading...").
11. **Auth success is a preview stub** — `AuthCard` shows "This is a design preview, so nothing was saved." and redirects home after 1.5s; no real session persistence beyond localStorage token/user.
12. **`hasAvailableChapters` imported but unused** — `MangaCard.tsx` imports `hasAvailableChapters` from `mangaApi` but does not appear to use it.
13. **Account deletion is local-only** — `handleDeleteAccount` removes localStorage keys and resets context but calls no backend endpoint.
14. **`__PAGE__` route manifests referenced** — `next-env.d.ts` imports `.next/dev/types/routes.d.ts` (auto-generated; normal for Next.js).
15. **Router type in AccountSection is a stub** — `SettingsTab` passes `router={{ push: () => {}, replace: () => {} }}` to `AccountSection` (no-op router), so delete-account redirect does not actually navigate in the settings tab context (though `ProfilePage` handles logout redirect separately).


---

## 12. Missing Pieces / Next Steps (to connect backend)

1. **Env variables:** Create `.env.example` documenting `NEXT_PUBLIC_API_BASE` (and any auth/cookie secrets). Remove hardcoded `http://localhost:5000` fallback or keep as local dev default.
2. **API client refactor:** Current `axios` instance attaches a Bearer token from `localStorage` (`mangahub_token`). Confirm backend expects `Authorization: Bearer` vs HTTP-only cookies; add response interceptor for centralized error handling and 401→logout flow.
3. **Auth handling:** Implement real login/signup against `/api/auth/login` and `/api/auth/signup`; persist token + user; add `isLoggedIn` gating on `/profile`; add logout that clears cookies/storage and invalidates React Query cache (`queryClient.clear()` already exists in `UserContext.logout`).
4. **Real data sources:** Replace mock reads in `mangaApi.ts` (`getAllManga`, `getMangaById`, `searchManga`) and `userApi.ts` (`USE_MOCK_PROFILE`) with `api.get`/`api.put` calls to the backend endpoints listed in Section 8.
5. **Error and loading states:** Add `loading.tsx`/`error.tsx` shells per route; add error toasts and retry handling; currently errors are mostly swallowed (`catch { return [] }` / `return null`).
6. **Reading history:** Implement history tracking (service + hook + context) to back the Profile history tab.
7. **Accessibility/contrast:** Review save-button contrast, focus states, and `aria` labels across cards and buttons.
8. **Backend contract:** Backend team must provide the endpoints in Section 8 with request/response shapes matching `src/types/api.ts` (`AuthResponse`, `ProfileResponse`, `BackpackResponse`, `ApiErrorBody`).
9. **Remove Pages Router duplication:** The project mixes App Router (`src/app`) with Pages Router (`src/pages`, `_app.tsx`). Decide on a single router strategy to avoid double-provisioning (`Providers` is rendered by both `app/layout.tsx` and `pages/_app.tsx`).

---

**Files not found during review:** `tailwind.config.*`, `postcss.config.*`, `.env*`, `.env.example`, `loading.tsx`, `error.tsx`, `jsconfig.json`.

- `public/` — Static assets (poster images, default avatar).
