# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

女王厨房 (Queen's Kitchen) — mobile-first web app for a couple to manage dishes, plan meals, and showcase cooked meals. Single shared Supabase account with two-person labeling ("女王"/"保洁").

**Live URL**: https://xjinliang.github.io/queen-kitchen/

## Commands

```bash
npm run dev          # Dev server
npm run build        # TypeScript check + production build
npm run preview      # Preview production build
```

## Deployment (GitHub Pages)

1. `npm run build` produces `dist/`
2. Copy `dist/index.html` to `dist/404.html` (SPA routing fallback)
3. Push `dist/` contents to `gh-pages` branch:
   ```
   cp -r dist/* /tmp/gh-pages-deploy/ && cd /tmp/gh-pages-deploy
   git add . && git commit -m "deploy" && git push origin gh-pages
   ```
4. Vite `base: '/queen-kitchen/'` and Router `basename="/queen-kitchen"` — must match repo name

`.env` contains real Supabase keys (not committed). Vite embeds `import.meta.env.VITE_*` values at build time into the JS bundle.

## Architecture

**Frontend**: React 19 + Vite + TypeScript + Tailwind CSS 4 + React Router v6 + lucide-react icons

**Backend**: Supabase (project `dlwwolfjtsojwhwfigbd.supabase.co`)
- Auth: email/password, profile auto-created via DB trigger on `auth.users` insert
- DB: PostgreSQL with RLS, all tables have `FOR ALL USING (auth.role() = 'authenticated')`
- Storage: `dish-images` bucket, public read, authenticated write
- Realtime: enabled on `dishes`, `meal_plans`, `cooked_meals`
- Tables: `profiles`, `dishes`, `meal_plans`, `cooked_meals` (see `supabase/schema.sql`)

## Key patterns

### Data hooks
`useRealtime<T>(table, fetchFn)` → generic realtime subscription hook. Unique channel name per instance (counter-based). Fetches initial data then listens for INSERT/UPDATE/DELETE. `useDishes()`, `useMealPlans()`, `useCookedMeals()` are thin wrappers with table-specific CRUD.

### Auth
`AuthContext` wraps the app. `AppLayout` redirects to `/login` if no `user`. `useAuth()` exposes `user`, `profile`, `signIn`, `signUp`, `signOut`. LoginPage handles both sign-in and sign-up via a toggle.

### "谁做的" labeling (single-account workaround)
`CookedMealForm` encodes who cooked via `[XX做]` prefix in notes. Two buttons: current nickname and "保洁". `ShowcaseCard` parses `[XX做]` prefix for display.

### Image upload
`ImageUploader` → `supabase.storage.from('dish-images').upload(path, file)` where path is `{folder}/{userId}/{timestamp}.{ext}`, then `getPublicUrl(path)`.

### PWA
`public/manifest.json` + `public/icon-192.png` + `public/icon-512.png` + `index.html` apple-touch-icon meta tags for "Add to Home Screen" on mobile.
