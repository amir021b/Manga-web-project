# MangaHub — Full-Stack API & Frontend Integration Audit Report

**Project:** Manga web project (MangaHub)  
**Front-End:** Next.js 16 (App Router), TypeScript, `src/` layout — `D:\Project\manga web project\Manga web project\Front-End`  
**Back-End:** Express 5 + Mongoose (MongoDB) — `D:\Project\manga web project\Manga web project\Back-End`  
**Audit scope:** All backend routes/controllers/middleware/models and all frontend service files, contexts, hooks, pages, and components.  
**Constraint honored:** No files were modified. This report is read-only analysis.

---

## 1. Executive Summary

The frontend and backend share a broadly coherent auth/profile/backpack domain, but the audit surfaced **several real integration defects**:

| Severity | Issue |
|----------|-------|
| 🔴 High | `settingsApi.ts` targets `/api/user/settings` (singular) while the backend mounts `/api/users` (plural) — every settings request 404s. |
| 🔴 High | `settingsApi.ts` reads the token from `sessionStorage`, but `authApi.ts` writes it to `localStorage` — settings calls are sent without an Authorization header. |
| 🔴 High | `settingsApi.changePassword()` and `updateEmail()` call `POST /api/user/settings/{password,email}` — **these routes do not exist on the backend** at all. |
| 🔴 High | `UserContext.logout()` removes `mangahub_token` from `sessionStorage`, but `authApi.ts` persists it in `localStorage` — logout never clears the actual bearer token. |
| 🟡 Medium | `ProfilePage.tsx` makes a direct `fetch()` to `PUT /api/users/profile` instead of using `userApi.updateProfile` (bypasses the centralized service layer and duplicates logic). |
| 🟡 Medium | Backend exposes `GET/POST /api/users/bookmarks` but no frontend service or component ever calls them. |
| 🟡 Medium | Backend `PUT /api/users/settings` exists but no frontend service calls it. |
| 🟡 Medium | Backend `.env` lacks `JWT_SECRET` and `JWT_EXPIRES_IN`, which `authController.js` requires for token signing/verification. |

---

## 2. Architecture Overview

### Backend (`Back-End/`)
- `server.js` — Express app; mounts routers with hardcoded prefixes:
  - `app.use("/api/auth", authRoutes)` → `routes/authRoutes.js`
  - `app.use("/api/users", userRouter)` → `routes/userRoutes.js`
- `controllers/authController.js` — `signup`, `login` (JWT signed with `process.env.JWT_SECRET`, expires `JWT_EXPIRES_IN`)
- `controllers/userController.js` — `getMe`, `updateUserProfile`, `updateUserSettings`, `toggleBackpack`, `getBackpack`
- `middlewares/authMiddleware.js` — `protect` (Bearer JWT, attaches `req.user`)
- `models/userModel.js` — User schema (username, email, password, avatar, bio, settings {theme, accentColor, density}, backpack [String])

### Frontend (`Front-End/src/`)
- **Services (centralized API layer):** `services/authApi.ts`, `services/userApi.ts`, `services/backpackApi.ts`, `services/settingsApi.ts`, `services/mangaApi.ts`
- **Contexts:** `context/UserContext.tsx`, `context/BackpackContext.tsx`, `context/ThemeContext.tsx`, `context/ToastContext.tsx`
- **Hooks:** `hooks/useAuthForm.ts` (drives login/signup via `authApi`), `hooks/usePasswordForm.ts`
- **App Router:** `src/app/*/page.tsx` route shells that import page components from `src/pages/` (e.g. `app/profile/page.tsx` → `pages/ProfilePage.tsx`)

---

## 3. API Endpoints Map (Backend Source of Truth)

All paths below are **absolute** after Express mounting in `server.js`.

### Auth — `routes/authRoutes.js` (mounted at `/api/auth`)

| # | Method | Endpoint | Controller | Auth | Request Body | Success Response |

---

## 4. Frontend Service Inventory

### `services/authApi.ts` — `API_URL = "http://localhost:5000/api/auth"`

| Function | Method | Endpoint | Body | Token storage | Notes |
|----------|--------|----------|------|---------------|-------|
| `submitAuth(values, mode)` | POST | `/api/auth/signup` or `/api/auth/login` | `{username,email,password}` / `{email,password}` | Writes `localStorage.setItem("mangahub_token", token)` on success | Correctly wired to A1/A2. Returns raw JSON. |

### `services/userApi.ts` — `API_URL = "http://localhost:5000/api/users"`

| Function | Method | Endpoint | Body | Token storage | Notes |
|----------|--------|----------|------|---------------|-------|
| `fetchProfile()` | GET | `/api/users/profile` | none | Reads `localStorage.getItem("mangahub_token")` | Correctly wired to U1. Returns `result.data?.user \|\| result.data`. |
| `updateProfile(userData)` | PUT | `/api/users/profile` | `{username, bio, avatar}` | Reads `localStorage.getItem("mangahub_token")` | Correctly wired to U2, but **never imported or called anywhere** (see §7). |

### `services/backpackApi.ts` — `API_URL = "http://localhost:5000/api/users/backpack"`

| Function | Method | Endpoint | Body | Token storage | Notes |
|----------|--------|----------|------|---------------|-------|
| `fetchBackpack()` | GET | `/api/users/backpack` | none | `localStorage` | Wired to U4. |
| `toggleBackpackItem(mangaId)` | POST | `/api/users/backpack` | `{ mangaId: String(mangaId) }` | `localStorage` | Wired to U5. |

---

## 5. Backend Endpoint ↔ Frontend Service Cross-Reference Matrix

| Backend Endpoint | Method | Frontend Service Function | Wired? | Discrepancy |
|------------------|--------|---------------------------|--------|-------------|
| `/api/auth/signup` | POST | `authApi.submitAuth(..., "signup")` | ✅ Yes | None |
| `/api/auth/login` | POST | `authApi.submitAuth(..., "login")` | ✅ Yes | None |
| `/api/users/profile` | GET | `userApi.fetchProfile()` | ✅ Yes | None |
| `/api/users/profile` | PUT | `userApi.updateProfile()` | ⚠️ Defined but **unused** | ProfilePage uses a raw `fetch()` instead (§7) |
| `/api/users/settings` | PUT | *(none)* | ❌ **Not called** | Backend route exists; no frontend service invokes it |
| `/api/users/backpack` | GET | `backpackApi.fetchBackpack()` | ✅ Yes | None |
| `/api/users/backpack` | POST | `backpackApi.toggleBackpackItem()` | ✅ Yes | None |
| `/api/users/bookmarks` | GET | *(none)* | ❌ **Backend only** | Duplicate of U4; no frontend consumer |
| `/api/users/bookmarks` | POST | *(none)* | ❌ **Backend only** | Duplicate of U5; no frontend consumer |
| `/api/user/settings/password` | POST | `settingsApi.changePassword()` | ❌ **Frontend only** | Route does not exist on backend; path singular + wrong storage |
| `/api/user/settings/email` | POST | `settingsApi.updateEmail()` | ❌ **Frontend only** | Route does not exist on backend; path singular + wrong storage |

### Where services are consumed
- `authApi.submitAuth` → `hooks/useAuthForm.ts` → `components/auth/AuthCard.tsx` (login/signup pages)

---

## 6. Mismatches & Bugs

### 6.1 Route-path mismatches (singular vs. plural)

| File | Frontend path | Backend path | Result |
|------|---------------|--------------|--------|
| `src/services/settingsApi.ts:2` | `/api/user/settings` (singular `user`) | `/api/users` (plural `users`, mounted in `server.js:14`) | **All settingsApi requests resolve to a non-existent path → 404**, even before the missing sub-routes (`/password`, `/email`) are considered. |

Sub-routes called by `settingsApi` (`/password`, `/email`) do **not** exist on the backend under any path.

### 6.2 HTTP-method mismatches

No PUT-vs-POST swap exists for the routes that *do* match (authApi/userApi/backpackApi methods align with backend).  
The method mismatch is semantic: `settingsApi` uses `POST` for `/password` and `/email`, but the backend's only settings mutation is `PUT /api/users/settings`. Since those routes are absent, the calls fail regardless of method.

### 6.3 Token-storage inconsistencies (critical)

| File | Token key | Storage | Used by |
|------|-----------|---------|---------|

### 6.4 Missing backend routes for frontend calls

`settingsApi.changePassword()` and `settingsApi.updateEmail()` are invoked by `components/settings/AccountSection.tsx`, but the backend implements **no** password-change or email-change route. The closest backend route is `PUT /api/users/settings` (theme/accent/density only). These frontend calls will always fail (404 due to the wrong singular base path; even if corrected to `/api/users/settings`, there is no `/password` or `/email` sub-route).

### 6.5 Environment / configuration gaps


---

## 7. Direct Fetches Bypassing the Centralized Service Layer

One direct `fetch()` was found outside the `services/` layer:

### `src/pages/ProfilePage.tsx` — lines 68–89 (`handleSave`)
```ts
const res = await fetch("http://localhost:5000/api/users/profile", {
  method: "PUT",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({ username: next.username, bio: next.bio, avatar: next.avatar }),
});
```

- Bypasses `userApi.updateProfile` (which exists, is correctly typed, and hits the same endpoint U2).
- Hardcodes the base URL a second time (in addition to the 3 service files).
- Duplicates error handling and localStorage persistence logic inline.
- Also writes `mangahub_user` to `localStorage` directly (inconsistent with `UserContext`'s `sessionStorage`, see Bug 3).

All other data mutations go through the service layer:
- `components/auth/AuthCard.tsx` → `useAuthForm` → `authApi.submitAuth` ✅
- `components/settings/AccountSection.tsx` → `settingsApi.changePassword/updateEmail` ✅ (but targets non-existent backend routes, §6.4)
- `context/BackpackContext.tsx` → `backpackApi.fetchBackpack/toggleBackpackItem` ✅

---

## 8. Unused / Dead Items

| Item | Status |
|------|--------|
| `userApi.updateProfile` | Defined and correctly typed, but **never imported or called** anywhere. `ProfilePage.handleSave` uses a raw `fetch` instead. |
| `GET/POST /api/users/bookmarks` | Backend routes exist with handlers, but **no frontend service or component references them**. |
| `PUT /api/users/settings` | Backend route exists (theme/accent/density), but **no frontend service calls it**. `settingsApi` instead invents `/password` and `/email` sub-routes. |
| `services/mangaApi.ts` | Stub (`fetchManga` returns `{endpoint, data: null}`); not wired to any backend manga route (no manga routes exist on the backend at all). |

---

## 9. Recommended Fixes (for reference; no changes made)

1. **Fix settings base path:** change `settingsApi.ts` `SETTINGS_ENDPOINT` to `/api/users/settings` (plural) to match `server.js` mounting.
2. **Unify token storage:** standardize on `localStorage` (`mangahub_token`) everywhere — or `sessionStorage` everywhere. Update `settingsApi.authHeaders()` and `UserContext.logout()` accordingly so logout actually clears the token.
3. **Implement missing backend routes (or remove the frontend calls):** add password-change and email-change endpoints under `/api/users/settings`, or wire `settingsApi` to the existing `PUT /api/users/settings` and drop `/password`/`/email`.
4. **Replace direct fetch in ProfilePage:** use `userApi.updateProfile()` instead of the inline `fetch("http://localhost:5000/api/users/profile", ...)`.
5. **Consolidate user-persistence storage:** pick one of `localStorage`/`sessionStorage` for `mangahub_user` across `UserContext` and `ProfilePage`.
6. **Configure `JWT_SECRET` / `JWT_EXPIRES_IN`** in backend `.env`; configure `NEXT_PUBLIC_API_BASE` on the frontend and stop hardcoding `localhost:5000`.
7. **Decide on bookmarks:** either implement a frontend bookmark feature consuming `GET/POST /api/users/bookmarks`, or remove the duplicate backend routes.
8. **Either implement or remove** the unused `PUT /api/users/settings` frontend integration and the `userApi.updateProfile` dead function.

---

**Audited files (backend):** `server.js`, `routes/authRoutes.js`, `routes/userRoutes.js`, `controllers/authController.js`, `controllers/userController.js`, `middlewares/authMiddleware.js`, `models/userModel.js`, `.env`, `package.json`

**Audited files (frontend):** `src/services/authApi.ts`, `src/services/userApi.ts`, `src/services/backpackApi.ts`, `src/services/settingsApi.ts`, `src/services/mangaApi.ts`, `src/context/UserContext.tsx`, `src/context/BackpackContext.tsx`, `src/context/ThemeContext.tsx`, `src/context/ToastContext.tsx`, `src/hooks/useAuthForm.ts`, `src/hooks/usePasswordForm.ts`, `src/pages/ProfilePage.tsx`, `src/components/auth/AuthCard.tsx`, `src/components/profile/EditProfileModal.tsx`, `src/components/settings/SettingsTab.tsx`, `src/components/settings/AccountSection.tsx`, `src/components/settings/AppearanceSection.tsx`, `src/components/settings/NotificationsSection.tsx`, `src/components/layout/Header.tsx`, `src/app/layout.tsx`, `next.config.ts`, `package.json`
- Backend `.env` defines only `PORT` and `DATABASE_LOCAL`. `authController.signToken` references `process.env.JWT_SECRET` and `process.env.JWT_EXPIRES_IN`, which are undefined — token signing/verification would fail or produce insecure tokens.
- Frontend `authApi.ts`, `userApi.ts`, `backpackApi.ts` hardcode `http://localhost:5000`. `settingsApi.ts` uses `process.env.NEXT_PUBLIC_API_BASE`, which is not configured anywhere (defaults to `''`), producing a browser-relative URL. No frontend `.env` / `.env.example` was found.

### 6.6 Duplicate backend routes

`GET /api/users/bookmarks` and `POST /api/users/bookmarks` are exact duplicates of `/api/users/backpack` (same handlers `getBackpack` / `toggleBackpack`). No frontend consumer exists for either bookmark route.
| `src/services/authApi.ts:50` | `mangahub_token` | **localStorage** (write on login/signup) | Login/signup |
| `src/services/userApi.ts:11,31` | `mangahub_token` | **localStorage** (read) | Profile GET/PUT |
| `src/services/backpackApi.ts:11,31` | `mangahub_token` | **localStorage** (read) | Backpack GET/POST |
| `src/pages/ProfilePage.tsx:65` | `mangahub_token` | **localStorage** (read) | Direct profile PUT fetch |
| `src/services/settingsApi.ts:5` | `mangahub_token` | **sessionStorage** (read) | **changePassword / updateEmail** |
| `src/context/UserContext.tsx:46-47` | `mangahub_token` | **sessionStorage** (remove on logout) | Logout |

**Bug 1 — settings calls are unauthenticated:** `authApi` persists the JWT in `localStorage`, but `settingsApi.authHeaders()` reads `sessionStorage`. The token will never be found, so `changePassword` and `updateEmail` are sent without `Authorization: Bearer ...` and would be rejected by `authMiddleware.protect` (401 "you are not logged in").

**Bug 2 — logout does not clear the real token:** `UserContext.logout()` removes `mangahub_token` from `sessionStorage`, but the token lives in `localStorage` (set by `authApi`). After logout, `localStorage.getItem("mangahub_token")` still returns the JWT, so the client remains authenticated on every service that reads `localStorage` (userApi, backpackApi, ProfilePage direct fetch).

**Bug 3 — user-profile persistence split across storages:** `UserContext.setCurrentUser` writes `mangahub_user` to `sessionStorage`; `ProfilePage.handleSave` writes `mangahub_user` to `localStorage`. The two sources can diverge, causing inconsistent restored user state on refresh.
- `userApi.fetchProfile` → `pages/ProfilePage.tsx`
- `userApi.updateProfile` → **nowhere** (dead function)
- `backpackApi.*` → `context/BackpackContext.tsx` (used by `ProfilePage` backpack tab)
- `settingsApi.changePassword` / `updateEmail` → `components/settings/AccountSection.tsx` (inside `SettingsTab`, rendered by `ProfilePage` settings tab)
| `addToBackpack(itemOrId)` / `removeFromBackpack(itemOrId)` | POST (delegated) | `/api/users/backpack` | `{ mangaId }` | `localStorage` | Convenience wrappers over `toggleBackpackItem`. |

### `services/settingsApi.ts` — `API_BASE = process.env.NEXT_PUBLIC_API_BASE \|\| ''`; `SETTINGS_ENDPOINT = "/api/user/settings"`

| Function | Method | Endpoint (frontend) | Body | Token storage | Backend match? |
|----------|--------|---------------------|------|---------------|----------------|
| `changePassword({currentPassword, newPassword})` | POST | `/api/user/settings/password` | `{currentPassword, newPassword}` | `sessionStorage.getItem("mangahub_token")` | ❌ **No backend route exists** (and path is singular `/api/user/...`) |
| `updateEmail({email})` | POST | `/api/user/settings/email` | `{email}` | `sessionStorage.getItem("mangahub_token")` | ❌ **No backend route exists** (and path is singular `/api/user/...`) |

### `services/mangaApi.ts`
- `fetchManga(endpoint)` stub — returns `{ endpoint, data: null }`. Placeholder; not part of the audited user/auth domain. No manga routes exist on the backend.
|---|--------|----------|------------|------|--------------|------------------|
| A1 | POST | `/api/auth/signup` | `authController.signup` | Public | `{ username: string, email: string, password: string }` | `201 { status:"success", message:"Sign up successful", data: { token: string, user: { id, username, email } } }` |
| A2 | POST | `/api/auth/login` | `authController.login` | Public | `{ email: string, password: string }` | `200 { status:"success", message:"Login successful", data: { token: string, user: { id, username, email } } }` |

*Error shapes:* `400 { status:"error", message }`, `401 { status:"error", message }`, `500 { status:"error", message:"Internal server error!" }`

### Users — `routes/userRoutes.js` (mounted at `/api/users`)

| # | Method | Endpoint | Controller | Auth | Request Body | Success Response |
|---|--------|----------|------------|------|--------------|------------------|
| U1 | GET | `/api/users/profile` | `userController.getMe` | Bearer JWT | none | `200 { status:"success", message:"User profile retrieved successfully", data: { user } }` |
| U2 | PUT | `/api/users/profile` | `userController.updateUserProfile` | Bearer JWT | `{ username?, bio?, avatar? }` | `200 { status:"success", message:"Profile updated successfully", data: { user: { id, username, email, avatar, bio, settings, backpack } } }` |
| U3 | PUT | `/api/users/settings` | `userController.updateUserSettings` | Bearer JWT | `{ theme?, accentColor?, density? }` | `200 { status:"success", message:"Settings updated successfully", data: { settings } }` |
| U4 | GET | `/api/users/backpack` | `userController.getBackpack` | Bearer JWT | none | `200 { status:"success", data: { backpack: string[] } }` |
| U5 | POST | `/api/users/backpack` | `userController.toggleBackpack` | Bearer JWT | `{ mangaId: string }` | `200 { status:"success", message:"Added to backpack" \| "Removed from backpack", data: { isSaved: boolean, backpack: string[] } }` |
| U6 | GET | `/api/users/bookmarks` | `userController.getBackpack` | Bearer JWT | none | *Same as U4* (duplicate route, same handler) |
| U7 | POST | `/api/users/bookmarks` | `userController.toggleBackpack` | Bearer JWT | `{ mangaId }` | *Same as U5* (duplicate route, same handler) |

**Note:** There are **no** backend routes for password change, email change, account deletion, or any `/api/user` (singular) path.