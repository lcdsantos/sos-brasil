# SOS Brasil — Next.js + Chakra UI + Supabase

Plataforma de apoio em situações de emergência.

---

## Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Framework  | Next.js 14 (App Router)             |
| UI Library | Chakra UI v2                        |
| Auth & DB  | Supabase (Auth + PostgreSQL)        |
| Forms      | React Hook Form                     |
| Icons      | React Icons (Remix Icon set)        |
| Language   | TypeScript                          |

---

## Getting Started

### 1. Clone & install

```bash
git clone <your-repo-url>
cd sos-brasil
npm install
```

### 2. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the full `sos_brasil_schema.sql` file
3. Copy your project URL and anon key from **Settings → API**

### 3. Configure environment variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-anon-key
```

### 4. (Optional) Generate TypeScript types from Supabase

```bash
npx supabase gen types typescript \
  --project-id YOUR_PROJECT_ID \
  > src/types/database.ts
```

This overwrites the manually-written types with auto-generated ones — recommended after any schema change.

### 5. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Project Structure

```
src/
├── app/                         # Next.js App Router pages
│   ├── page.tsx                 # Home (dashboard tiles)
│   ├── layout.tsx               # Root layout + Chakra provider
│   ├── providers.tsx            # ChakraProvider wrapper
│   ├── auth/
│   │   ├── login/page.tsx
│   │   ├── cadastro/page.tsx
│   │   └── esqueci-senha/page.tsx
│   ├── abrigos/
│   │   ├── page.tsx             # Shelter list
│   │   ├── novo/page.tsx        # Create shelter
│   │   └── [id]/
│   │       ├── page.tsx         # Shelter detail
│   │       └── editar/page.tsx  # Edit shelter
│   ├── doacoes/
│   │   ├── page.tsx             # Donations list
│   │   └── gerenciar/page.tsx   # Manage donation items
│   ├── noticias/page.tsx        # News feed
│   └── vias-interditadas/       # Blocked roads + map
│       └── page.tsx
│
├── components/
│   ├── layout/
│   │   ├── MobileShell.tsx      # Max-width wrapper + bottom nav
│   │   ├── BottomNav.tsx        # Sticky bottom navigation
│   │   └── PageHeader.tsx       # Back button + page title
│   ├── abrigos/
│   │   ├── AbrigoCard.tsx       # Shelter list card
│   │   └── AbrigoForm.tsx       # Create/edit form with mutations
│   ├── doacoes/
│   │   ├── PriorityList.tsx     # Colour-coded priority groups
│   │   └── LocalDoacaoCard.tsx  # Donation location card
│   └── ui/
│       └── SearchInput.tsx      # Reusable search bar
│
├── hooks/
│   └── useAuth.ts               # Auth state + profile + isAdmin
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

## Authentication Flow

- Email/password via `supabase.auth.signInWithPassword`
- OAuth: Google, Apple, Facebook, Microsoft
- On sign-up, a trigger in Supabase automatically creates a `profiles` row
- Admin actions (create/edit/delete) are protected by RLS policies on the `profiles.role` field

## Map Integration (Vias Interditadas)

The map placeholder in `vias-interditadas/page.tsx` is ready to be swapped with:

```bash
# Option A — Leaflet (open source, no API key needed)
npm install react-leaflet leaflet @types/leaflet

# Option B — Google Maps
npm install @react-google-maps/api
```

Coordinates are already stored in `vias_interditadas.latitude` and `vias_interditadas.longitude`.
