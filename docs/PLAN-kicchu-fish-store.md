# 🐠 Kicchu — Pet Fish & Accessories Store

> **Plan File:** `docs/PLAN-kicchu-fish-store.md`
> **Project Type:** WEB (Mobile-first PWA)
> **Created:** 2026-05-25
> **Status:** 🟢 IN PROGRESS

---

## 🎯 Goal

Build a stunning, mobile-first e-commerce website for selling pet fish and accessories.
Customers can browse products, add to cart, checkout as guests, pay via QR code, and receive a unique self-pickup confirmation code.
A protected admin panel allows full content management from any device.

---

## ✅ Success Criteria

- [ ] Customers can browse fish & accessories without logging in
- [ ] Cart persists across page refreshes (localStorage)
- [ ] Checkout generates a unique pickup code after QR payment confirmation
- [ ] Admin can log in and manage products, orders, QR image, and admin users
- [ ] Site scores 90+ on Lighthouse mobile performance
- [ ] All pages work flawlessly on screens 375px and above

---

## 🛠️ Tech Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| **Framework** | Next.js 14 (App Router) | Best mobile perf, SEO, file-based routing, SSR/SSG |
| **Styling** | Tailwind CSS v4 | Fastest mobile-first utility CSS, zero runtime |
| **Backend/DB** | Supabase (PostgreSQL) | Realtime, Auth, Storage (for product & QR images) |
| **Auth** | Supabase Auth | Admin-only login, Row Level Security (RLS) |
| **Image Storage** | Supabase Storage | Product images + QR code image bucket |
| **Hosting** | Vercel | Free tier, zero-config Next.js deploy |
| **Fonts** | Inter (Google Fonts) | Clean, modern, highly legible on mobile |

---

## 🗄️ Database Schema (Supabase / PostgreSQL)

### `products`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid (PK) | auto |
| name | text | product name |
| description | text | short description |
| price | numeric | in rupees |
| category | text | `fish` / `food` / `tank` / `decor` / `other` |
| stock | integer | quantity available |
| image_url | text | Supabase Storage URL |
| is_active | boolean | show/hide on storefront |
| created_at | timestamptz | auto |

### `orders`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid (PK) | auto |
| pickup_code | text | 6-char alphanumeric, unique |
| customer_name | text | guest name |
| customer_phone | text | for pickup notification |
| items | jsonb | [{product_id, name, qty, price}] |
| total_amount | numeric | calculated total |
| status | text | pending / payment_confirmed / ready / picked_up |
| notes | text | optional customer note |
| created_at | timestamptz | auto |

### `settings`
| Column | Type | Notes |
|--------|------|-------|
| key | text (PK) | e.g. qr_code_url, store_name, pickup_address |
| value | text | the value |

### `profiles`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid (FK to auth.users.id) | |
| role | text | always 'admin' for now |
| display_name | text | admin display name |

---

## 📁 File Structure

```
kicchu/
├── app/
│   ├── layout.tsx              # Root layout, fonts, meta
│   ├── page.tsx                # Homepage (hero + featured products)
│   ├── shop/
│   │   └── page.tsx            # All products, category filter
│   ├── product/[id]/
│   │   └── page.tsx            # Product detail page
│   ├── cart/
│   │   └── page.tsx            # Cart review
│   ├── checkout/
│   │   └── page.tsx            # Guest form + QR payment + pickup code
│   ├── admin/
│   │   ├── layout.tsx          # Admin guard (auth check)
│   │   ├── login/page.tsx      # Admin login
│   │   ├── page.tsx            # Dashboard (order stats)
│   │   ├── products/page.tsx   # Product CRUD
│   │   ├── orders/page.tsx     # Order management
│   │   ├── settings/page.tsx   # QR upload, store settings
│   │   └── users/page.tsx      # Admin user management
│   └── api/
│       └── orders/route.ts     # Order creation API
├── components/
│   ├── ui/                     # Button, Card, Badge, Modal, Input
│   ├── layout/
│   │   ├── Navbar.tsx          # Mobile nav + hamburger menu
│   │   └── Footer.tsx
│   ├── shop/
│   │   ├── ProductCard.tsx
│   │   ├── ProductGrid.tsx
│   │   └── CategoryFilter.tsx
│   ├── cart/
│   │   ├── CartDrawer.tsx      # Slide-in cart on mobile
│   │   └── CartItem.tsx
│   ├── checkout/
│   │   ├── GuestForm.tsx
│   │   ├── QRPayment.tsx       # Shows QR + "I've paid" button
│   │   └── PickupCode.tsx      # Success screen with code
│   └── admin/
│       ├── Sidebar.tsx
│       ├── ProductForm.tsx
│       ├── OrderTable.tsx
│       └── QRUploader.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts           # Browser client
│   │   └── server.ts           # Server client
│   ├── utils/
│   │   ├── pickup-code.ts      # Random code generator
│   │   └── cart.ts             # localStorage cart helpers
│   └── hooks/
│       ├── useCart.ts
│       └── useProducts.ts
├── public/
│   └── icons/                  # PWA icons, favicon
├── styles/
│   └── globals.css             # Tailwind base + custom tokens
├── middleware.ts               # Admin route protection
├── next.config.js
├── tailwind.config.ts
└── .env.local                  # Supabase keys
```

---

## 📋 Task Breakdown

### 🏗️ PHASE 1 — Foundation (P0)
> Agent: `backend-specialist` + `security-auditor`

- [x] **T1.1** Init Next.js 14 project with Tailwind CSS v4 and TypeScript
  → `npx create-next-app@latest` with app router + TS + Tailwind
  → Verify: `npm run dev` starts without error

- [x] **T1.2** Create Supabase project, set up all 4 tables with RLS policies
  → Tables: `products`, `orders`, `settings`, `profiles`
  → RLS: Public can read `products` + `settings`; only admins can write
  → Verify: Supabase table editor shows schema

- [x] **T1.3** Configure Supabase Storage buckets
  → Bucket `fishes` (public read)
  → Verify: Upload test image, get public URL

- [x] **T1.4** Set up Supabase Auth + admin seed
  → Create first admin account via Supabase dashboard
  → Add to `profiles` table with `role: admin`
  → Verify: Auth login works in Supabase dashboard

- [x] **T1.5** Configure environment variables + middleware
  → `.env.local` with Supabase URL + anon key + service role key
  → `middleware.ts` guards `/admin/*` routes, redirects to `/admin/login`
  → Verify: Visiting `/admin` without auth redirects to login

---

### 🎨 PHASE 2 — Storefront UI (P2)
> Agent: `frontend-specialist` with `frontend-design` skill

- [x] **T2.1** Global design system + Navbar with hamburger menu
  → Color theme: Deep ocean dark navy (#0a0f1e) + aqua accent (#00d4aa) + white text
  → Hamburger menu slides in a full-screen mobile nav drawer
  → Cart icon with item count badge in navbar
  → Verify: Hamburger opens/closes on 375px viewport

- [x] **T2.2** Homepage — Hero + Featured Products section
  → Hero: Animated fish/water gradient background, headline, CTA button
  → Featured: 4 product cards in 2x2 mobile grid
  → Verify: Renders correctly on mobile + desktop

- [x] **T2.3** Shop page — Product grid + category filter
  → Category pills: ALL / FISH / FOOD / TANKS / DECOR / OTHER
  → 2-column card grid on mobile, 4-column on desktop
  → Each card: image, name, price, stock badge, Add to Cart button
  → Verify: Filter by category updates grid instantly

- [x] **T2.4** Product detail page [id]
  → Full image, name, price, description, stock, quantity picker, Add to Cart
  → "Back to Shop" link
  → Verify: Dynamic route renders correct product data

- [x] **T2.5** Cart drawer (slide-in from right on mobile)
  → List of cart items with qty controls + remove button
  → Subtotal + "Proceed to Checkout" CTA
  → Persists via localStorage
  → Verify: Add items, refresh page, items still in cart

---

### 💳 PHASE 3 — Checkout & Payment (P1)
> Agent: `backend-specialist`

- [x] **T3.1** Guest checkout form
  → Fields: Name, Phone number, optional pickup note
  → Client-side validation (required fields, phone format)
  → Verify: Form shows error on empty submit

- [x] **T3.2** QR payment step
  → Fetch QR image URL from `settings` table (key: qr_code_url)
  → Display QR with total amount, instruction text
  → "I've Paid" button triggers order creation
  → Verify: QR image displays, button clickable

- [x] **T3.3** Order creation API route POST /api/orders (Implemented as Server Action)
  → Generate 6-char alphanumeric pickup code (unique, checked against DB)
  → Insert order into `orders` table with status `payment_confirmed`
  → Return pickup code to client
  → Verify: POST test returns 200 + pickup code

- [x] **T3.4** Pickup confirmation screen
  → Large styled pickup code display (e.g., KIC-X7G3)
  → Order summary (items, total, customer name)
  → "Save / Screenshot this code" reminder message
- [x] **T3.5** Order tracking page (`/track`)
  → Search form: Pickup Code + Phone Number
  → Uses `SUPABASE_SERVICE_ROLE_KEY` to fetch securely
  → Displays order items, total amount, and current status (pending, ready, completed)
  → Verify: Searching valid order shows details, invalid shows error

---

### 🔧 PHASE 4 — Admin Panel (P2)
> Agent: `frontend-specialist` + `backend-specialist`

- [x] **T4.1** Admin login page
  → Email + password form using Supabase Auth
  → Error message on failed login
  → Redirect to /admin dashboard on success
  → Verify: Wrong creds shows error, correct creds redirects

- [x] **T4.2** Admin dashboard (overview)
  → Stats cards: Total Orders, Pending, Ready for Pickup, Revenue today
  → Recent orders table (last 10)
  → Works on mobile + desktop
  → Verify: Stats match Supabase data

- [x] **T4.3** Products management page
  → Table list of all products with edit/delete actions
  → Adjust stock with + and - buttons
  → Toggle active visibility
  → Verify: Add product → appears on storefront

- [x] **T4.4** Orders management page
  → Table: pickup code, customer name, phone, items, total, status, timestamp
  → Status action buttons: "Mark Ready" / "Mark Picked Up"
  → Filter by status (pending / ready / picked up)
  → Mobile-friendly scrollable table
  → Verify: Change status → updates in Supabase

- [ ] **T4.5** Settings page
  → QR code image uploader (replaces existing QR)
  → Store name, pickup address, store hours (from settings table)
  → Verify: Upload new QR → checkout page shows updated QR

- [ ] **T4.6** Admin user management
  → List current admin accounts (from profiles + auth)
  → "Invite Admin" button → sends invite via Supabase Auth email invite
  → Remove admin (deletes profile row + disables auth user)
  → Verify: Invited user receives email, can log in to admin

---

### ✨ PHASE 5 — Polish & PWA (P3)
> Agent: `frontend-specialist`

- [ ] **T5.1** Add PWA manifest + service worker
  → manifest.json: name, icons, theme color, display standalone
  → "Add to Home Screen" banner on mobile
  → Verify: Chrome shows install prompt on mobile

- [ ] **T5.2** SEO metadata on all pages
  → title + meta description for all pages
  → Open Graph tags for social sharing
  → Verify: view-source shows correct meta tags

- [ ] **T5.3** Loading skeletons + empty states
  → Product grid shows shimmer skeleton while fetching
  → Empty cart state with "Browse Shop" CTA
  → Empty order state in admin
  → Verify: Skeleton visible during slow network (DevTools throttle)

- [ ] **T5.4** Micro-animations
  → Add to Cart button: bounce animation
  → Product card: hover lift + shadow
  → Pickup code: slide-up reveal animation
  → Hamburger: animated to X on open
  → Verify: Smooth 60fps on mid-range Android (Chrome DevTools)

- [ ] **T5.5** Final audit
  → Run `python .agent/scripts/verify_all.py . --url http://localhost:3000`
  → Fix any Critical issues before deploy
  → Verify: Lighthouse mobile score >= 90

---

## 🎨 Design Language

| Token | Value | Usage |
|-------|-------|-------|
| **Primary BG** | #0a0f1e (deep navy) | Page background |
| **Surface** | #111827 (dark card) | Cards, panels |
| **Accent** | #00d4aa (aqua/teal) | CTAs, badges, highlights |
| **Accent 2** | #f59e0b (amber) | Warnings, stock badges |
| **Text** | #f9fafb | Primary text |
| **Muted** | #9ca3af | Secondary text |
| **Danger** | #ef4444 | Errors, delete actions |
| **Font** | Inter (Google Fonts) | All text |
| **Radius** | 16px cards, 12px buttons | Rounded modern feel |

> NO purple/violet at any point — aqua/teal is the brand color.

---

## 🚦 Risk Areas

| Risk | Mitigation |
|------|-----------|
| QR payment not verifiable | Admin manually confirms via "Mark Ready" — document this clearly in UI |
| Duplicate pickup codes | Check uniqueness in DB before inserting order |
| Image upload size | Validate max 2MB client-side before Supabase upload |
| Admin route leaks | Middleware + RLS double protection |
| Stock going negative | Check stock > 0 before checkout submission |

---

## 📦 Milestones

| Milestone | Done When |
|-----------|-----------|
| **M1: Foundation** | DB up, auth working, env configured |
| **M2: Storefront** | Can browse and add products to cart |
| **M3: Checkout** | Can place order and receive pickup code |
| **M4: Admin** | Admin can manage products, orders, QR, users |
| **M5: Ship** | Deployed on Vercel, Lighthouse >= 90 |

---

## Phase X — Verification Checklist

- [ ] `npm run build` → 0 errors
- [ ] `npm run dev` → all pages render on mobile (375px)
- [ ] Lighthouse mobile score >= 90 (Performance + SEO)
- [ ] Guest can add to cart → checkout → get pickup code
- [ ] Admin login → manage products → manage orders
- [ ] QR code image upload works
- [ ] RLS policies prevent public from writing to DB
- [ ] `python .agent/skills/frontend-design/scripts/ux_audit.py .`
- [ ] `python .agent/skills/performance-profiling/scripts/lighthouse_audit.py http://localhost:3000`

---

```
[OK] Plan created: docs/PLAN-kicchu-fish-store.md
[OK] All required sections present
[OK] Awaiting user approval before any code is written
```
