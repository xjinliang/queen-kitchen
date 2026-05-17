# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

女王厨房 (Queen's Kitchen) — a mobile-first web app for a couple to manage dishes, plan meals, and showcase cooked meals. Single shared account with two-person labeling ("女王"/"保洁").

## Commands

```bash
npm run dev          # Start dev server (Vite HMR)
npm run build        # TypeScript check + production build
npm run preview      # Preview production build
```

## Architecture

**Frontend**: React 19 + Vite + TypeScript + Tailwind CSS 4 + React Router v6 + lucide-react icons

**Backend**: Supabase (`dlwwolfjtsojwhwfigbd.supabase.co`)
- **Auth**: email/password (email confirmation manually handled)
- **Database**: PostgreSQL with RLS + realtime subscriptions
- **Storage**: `dish-images` bucket (public read, authenticated write)
- Tables: `profiles`, `dishes`, `meal_plans`, `cooked_meals`

## Key patterns

### Hooks data flow
Every data table follows the same pattern: `useRealtime<T>(table, fetchFn)` → `useDishes()` / `useMealPlans()` / `useCookedMeals()`. The realtime hook fetches initial data then subscribes to INSERT/UPDATE/DELETE via Supabase channels. CRUD methods call `supabase.from(...)` directly then manually refresh.

### Auth
`AuthContext` wraps the entire app. `AppLayout` checks `user` and redirects to `/login` if unauthenticated. Profile is auto-created by a database trigger on `auth.users` insert. The `useAuth()` hook exposes `user`, `profile`, `signIn`, `signUp`, `signOut`.

### "谁做的" labeling
Since both users share one account, `CookedMealForm` encodes who cooked via a `[XX做]` prefix in the notes field. `ShowcaseCard` parses this prefix for display. The two buttons are the user's nickname and "保洁" (hardcoded).

### Image upload
`ImageUploader` component uploads to `supabase.storage.from('dish-images')`, generates path as `{folder}/{userId}/{timestamp}.{ext}`, returns public URL via `getPublicUrl()`.

## Routes

| Path | Page | Notes |
|------|------|-------|
| `/login` | LoginPage | Redirects to `/order` if authenticated |
| `/order` | OrderPage | Home page — date + meal type + dish selection with random picker |
| `/library` | LibraryPage | Dish grid with category filter |
| `/library/new` | DishFormPage | Add dish (name, category, difficulty, recipe, image, tags) |
| `/library/:id` | DishDetailPage | View with edit/delete |
| `/library/:id/edit` | DishFormPage | Edit mode |
| `/showcase` | ShowcasePage | Cooked meal photo grid, long-press to delete |
| `/showcase/new` | CookedMealFormPage | Record a cooked dish |
| `/profile` | ProfilePage | Stats + sign out |

## Environment variables

Required in `.env` (not committed):
- `VITE_SUPABASE_URL` — Supabase project URL
- `VITE_SUPABASE_ANON_KEY` — Supabase publishable (anon) key
