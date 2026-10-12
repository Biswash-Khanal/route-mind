This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Admin Authentication Flow

A hand-rolled JWT auth system for the admin area — no auth library. This section documents the architecture and maps it onto a classic SPA + Express setup.

### Pieces

| Layer | File | Responsibility |
|---|---|---|
| Frontend gate | `proxy.ts` (Next middleware, Node runtime) | Cryptographically verifies the JWT from the `admin_access_token` cookie for every page under `/admin/:path*`. Redirects to `/admin/login?callbackUrl=...` when missing/invalid. Reverse-gates `/admin/login` (bounces already-logged-in users). |
| API gate | `requireAdminAuth` in `utilities/authenticationWrappers.ts` | Cryptographically verifies the JWT inside every protected route handler — this is the real security boundary. |
| API pre-check | `proxy.ts` | Cheap token existence/shape check on `/api/admin/:path*` to short-circuit missing/garbage tokens before touching a route handler. Deliberately **not** cryptographic. |
| Cookie | `utilities/cookieHelpers.ts` | Sets/clears the `admin_access_token` `httpOnly` cookie. |
| Callback sanitizer | `utilities/callbackUrl.ts` | `sanitizeCallbackUrl()` whitelists same-origin relative paths only. |

### Why two gates?

Page protection == UX; API protection == security. Even if a user reaches a page they shouldn't, no data leaks unless the API also authorizes them. The check is performed exactly once on each path, keyed to the part of the system it guards:

- `proxy.ts` verifies the JWT once per **page** request.
- `requireAdminAuth` verifies it once per **API** request.

In a classic SPA + Express world the same split exists: the SPA's route guard (`<Route element={<RequireAuth>…}`) is the UX layer, and Express `app.use('/api', authenticate, …)` middleware is the security layer. Next.js simply moves the page guard onto the server.

### Why `router.replace`/refresh matters after auth mutations

`proxy` runs on every matching HTTP request but never re-evaluates an already-mounted client tree.

- **Login** — the login response sets the cookie before `router.replace(callbackUrl)` runs; that navigation is itself a server request carrying the fresh cookie, so `proxy` lets the user through. No extra refresh needed.
- **Logout** — the logout endpoint clears the cookie (`Set-Cookie: max-age=0`) but the current page was already rendered server-side while authenticated. Without a new request the stale page stays visible, so `LogoutButton` calls `router.replace("/admin/login")` after the logout fetch succeeds.

Equivalent in an SPA: `window.location.href = '/login'` after clearing the stored token.

## Frontend

### Route groups and page chrome

Public and admin chrome are scoped with App Router **route groups** rather than by
switching on `usePathname()` in a client component:

| Group | Layout | Contains |
|---|---|---|
| `app/(public)/` | `layout.tsx` | `Navbar` + `main` + `Footer` |
| `app/admin/(app)/` | `layout.tsx` | `AdminSidebar` + admin top bar |
| `app/admin/login/` | — | Unauthenticated; renders without the shell |

A layout receives no pathname, so the previous `LayoutWrapper` approach had to run
on the client and re-evaluate on every navigation. Route groups scope chrome
server-side instead. **Route groups are not part of the URL**, so `/`, `/admin`,
`/admin/account` and friends keep their paths — and `proxy.ts`'s `/admin/:path*`
matcher is unaffected, because it matches the request path, not the file tree.

`/admin/login` sits *outside* the admin group so it does not render inside the
authenticated shell.

### What is live and what is sample data

Most of the UI is currently a visual prototype fed by `shared/mock/`. **That whole
directory is temporary and should be deleted once the corresponding endpoints land.**

| Surface | Source | Replace when |
|---|---|---|
| Planner stops, results, operator cards | `shared/mock/*` | A routing endpoint returns `RouteOption` |
| Admin dashboard, admins table, operators page | `shared/mock/*` | `GET /api/admin/users` and an admin operators `GET` exist |
| Admin sidebar identity (name/role) | `CURRENT_ADMIN` constant | Read from `GET /api/admin/me` |
| **Account: change username** | **live** — `PATCH /api/admin/me/username` | already implemented |
| **Account: change password** | **live** — `POST /api/admin/me/password` | already implemented |
| **Admin sign-in** | **live** — `POST /api/admin/auth/login` | already implemented |
| Map panel | placeholder | A map engine is chosen |

The two account forms are the exception: those endpoints are implemented, so the
forms call them for real and validate with the same Zod schema the route handler
uses. Screens fed by sample data say so on the page itself.

Changing a password ends the session server-side (`clearAuthCookie`), so the form
navigates to `/admin/login` on success — same reason `LogoutButton` re-navigates.

### Styling

Tailwind v4 with design tokens in `app/globals.css`:

- **Roles**: `paper` (page background), `surface` (cards/inputs), `ink` (primary
  text), `slate` (secondary text), `mist` (hairlines/hover), `stone` (disabled,
  dashed). **Accents**: `transit-*` blue for transit, `walk-*` green for walking.
- **Typography**: Inter for UI, JetBrains Mono for eyebrows, labels and figures.
  `text-h1` … `text-caption` are registered in `@theme`; a Tailwind token may
  **not** share a name with the raw token it points at (`--radius-md: var(--radius-md)`
  is a circular reference and resolves to nothing).
- **Component classes** (`@layer components`): `.card`, `.eyebrow`, `.input`,
  `.select`, `.table-head`, `.table-cell`. Button variants live in
  `app/components/ui/Button.tsx` so they stay next to their logic.

### Reusable primitives — `app/components/ui/`

`Button` (plus a `ButtonLink` twin sharing `buttonClasses`), `Card` (polymorphic via
`as`), `Badge`, `Field`, and `utilities/cn.ts` for conditional class names.

### Known gap

The UI is built and reviewed at **desktop widths only**. There is no responsive
breakpoint work yet — layouts use fixed multi-column grids and are not intended to
be used on small screens until that pass happens.

### Why `callbackUrl` is sanitized

`callbackUrl` is not a framework feature — it is a hand-attached search param read and trusted manually, so it must be validated manually. An attacker can craft `/admin/login?callbackUrl=https://evil.com` (or `//evil.com`, a protocol-relative URL). Without sanitization the browser would redirect to the attacker's origin after login — an **open redirect**. `sanitizeCallbackUrl` only accepts values that start with a single `/` and contains no backslashes preventing protocol-relative and backslash-normalized escapes, forcing the resolved URL onto our own origin.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
