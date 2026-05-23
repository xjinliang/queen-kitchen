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

**IMPORTANT**: Repo root is `my-project/`, source code is in `小李厨房/`. GitHub Pages serves from the root of the `gh-pages` branch, so dist files must go to the root, NOT `小李厨房/dist/`.

1. `npm run build` produces `小李厨房/dist/`
2. Copy `dist/index.html` to `dist/404.html` (SPA routing fallback)
3. Deploy to gh-pages branch root:
   ```bash
   cd "C:\Users\29972\Desktop\my-project"
   git checkout gh-pages
   # Remove old root files (keep .git, 小李厨房/, etc.)
   rm -f index.html 404.html manifest.json icon-192.png icon-512.png
   rm -rf assets
   # Copy new dist to root
   cp "小李厨房/dist/index.html" .
   cp "小李厨房/dist/404.html" .
   cp "小李厨房/dist/manifest.json" .
   cp "小李厨房/dist/icon-192.png" .
   cp "小李厨房/dist/icon-512.png" .
   cp -r "小李厨房/dist/assets" .
   # Clean up wrong-location dist
   git rm -r "小李厨房/dist/" 2>/dev/null; true
   # Stage and push
   git add index.html 404.html manifest.json icon-192.png icon-512.png assets/
   git commit -m "deploy" && git push origin gh-pages
   git checkout master
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
