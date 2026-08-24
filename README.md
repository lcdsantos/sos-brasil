# SOS Brasil

Plataforma web de apoio em situações de emergência no Brasil. A aplicação reúne
eventos de emergência, abrigos, doações, notícias e vias interditadas em uma
interface responsiva, com área administrativa protegida.

---

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **UI library:** Chakra UI v3
- **Auth and database:** Supabase (Auth + PostgreSQL)
- **Forms:** React Hook Form
- **Maps:** Google Maps
- **Icons:** React Icons (Remix Icon set)
- **Language:** TypeScript

---

## Getting Started

### 1. Clone & install

```bash
git clone <your-repo-url>
cd sos-brasil
npm install
```

### 2. Configure Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Apply the migration in `supabase/migrations/` using the Supabase CLI or the
   SQL Editor
3. Copy the project URL and publishable key from **Project Settings → API**

### 3. Configure environment variables

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-key
NEXT_PUBLIC_URL=http://localhost:3000
RESEND_API_KEY=your-resend-api-key
```

Never commit `.env.local` or expose server-only secrets in client-side code.
The Google Maps key must have the APIs required by the map enabled and should
be restricted by HTTP referrer in Google Cloud.

### 4. Generate TypeScript types from Supabase (optional)

```bash
npm run gen:types
```

This overwrites `src/types/database.ts`. Run it after schema changes and make
sure the CLI is authenticated and linked to the intended project.

### 5. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Available Commands

- `npm run dev`: starts the development server
- `npm run build`: creates a production build
- `npm run start`: serves the production build
- `npm run lint`: runs TypeScript and ESLint checks
- `npm run gen:types`: regenerates Supabase TypeScript types

## Project Structure

```text
src/
├── app/                         # Next.js App Router routes
│   ├── page.tsx                 # Current emergency events
│   ├── auth/                    # Sign in, sign up and password recovery
│   ├── eventos/                 # Event list and event details
│   ├── perfil/                  # User profile
│   ├── admin/                   # Protected administration area
│   │   ├── abrigos/
│   │   ├── doacoes/
│   │   ├── eventos/
│   │   ├── noticias/
│   │   ├── usuarios/
│   │   └── vias/
│   └── ...                      # Privacy, terms and data deletion pages
│
├── components/
│   ├── layout/                  # App shell, auth and event providers
│   ├── admin/                   # Administrative forms and tables
│   ├── abrigos/, doacoes/       # Public shelter and donation components
│   ├── eventos/, noticias/      # Event and news components
│   ├── vias/                    # Google Maps integration
│   └── ui/                      # Shared UI components
│
├── hooks/
│   └── useAutocompleteSuggestion.ts
│
├── lib/
│   ├── theme.ts                 # Chakra UI brand theme
│   └── supabase/
│       ├── client.ts            # Client-side Supabase instance
│       └── server.ts            # Server-side Supabase instance
│
└── types/
    └── database.ts              # TypeScript types from Supabase schema
```

---

## Authentication and Administration

- Email/password authentication is handled by Supabase Auth.
- The auth callback and password recovery routes live under `src/app/auth/`.
- A Supabase trigger creates the user profile after registration.
- Administrative pages live under `/admin` and are protected by the app and
  Supabase Row Level Security policies based on the profile role.

## Google Maps

The blocked-road map is implemented in `src/components/vias/MapContainer.tsx`.
Set `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` before running the application. Road
coordinates are stored in `vias_interditadas.latitude` and
`vias_interditadas.longitude`.

## Database

The database schema and seed data are kept in `supabase/migrations/` and
`supabase/seed.sql`. Keep migrations as the source of truth for schema changes;
do not edit the generated TypeScript types by hand after regenerating them.
