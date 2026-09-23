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

### Why `callbackUrl` is sanitized

`callbackUrl` is not a framework feature — it is a hand-attached search param read and trusted manually, so it must be validated manually. An attacker can craft `/admin/login?callbackUrl=https://evil.com` (or `//evil.com`, a protocol-relative URL). Without sanitization the browser would redirect to the attacker's origin after login — an **open redirect**. `sanitizeCallbackUrl` only accepts values that start with a single `/` and contains no backslashes preventing protocol-relative and backslash-normalized escapes, forcing the resolved URL onto our own origin.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
