# Balcı Market Defterim — Project Documentation

## Overview

**Balcı Market Defterim** is a mobile-first Progressive Web App (PWA) that allows customers of Balcı Market to view their own credit (veresiye) account. Customers log in with their home number and phone number and can see their balance, purchase history, and payment history. The app is read-only — customers cannot make payments through the portal.

- **Frontend repo:** https://github.com/arita10/debt-portal
- **Backend repo:** https://github.com/arita10/POSBackEnd
- **Live URL:** https://balci-defterim.vercel.app
- **Backend API:** https://posbackend-3zqv.onrender.com

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, React Router v6, CSS Modules |
| PWA | Service Worker, Web App Manifest |
| Backend | NestJS (separate repo) |
| Auth | JWT (30-day token) |
| Hosting (frontend) | Vercel |
| Hosting (backend) | Render |

---

## Environment Variables

Create a `.env` file in the project root (not committed to git):

```env
REACT_APP_API_URL=https://posbackend-3zqv.onrender.com
REACT_APP_SHOP_ID=1
```

| Variable | Description |
|---|---|
| `REACT_APP_API_URL` | Base URL of the backend API. Leave empty to use CRA proxy in dev. |
| `REACT_APP_SHOP_ID` | The shop ID embedded at build time. Each shop gets its own deployment. |

> **Dev tip:** Set `REACT_APP_API_URL=` (empty) and add `"proxy": "https://posbackend-3zqv.onrender.com"` in `package.json` to avoid CORS issues locally.

---

## Project Structure

```
src/
  index.js                  → App entry point, service worker registration
  index.css                 → Global reset and body styles
  App.js                    → Router, global state (loggedIn, data), auth flow
  api.js                    → API call functions (login, getMe)
  auth.js                   → localStorage token helpers

  pages/
    LoginPage.js/css        → Login form (Ev No + Telefon)
    DashboardPage.js/css    → Balance card + quick nav links
    TransactionsPage.js/css → Expandable list of credit purchases
    PaymentsPage.js/css     → List of payments made

  components/
    Layout.js/css           → Header + bottom nav tabs wrapper
    InstallPrompt.js/css    → "Add to Home Screen" banner

public/
  index.html                → HTML shell, meta tags, favicon links
  manifest.json             → PWA manifest (name, icons, theme color)
  service-worker.js         → Offline caching strategy
  favicon.svg               → Browser tab icon (SVG, modern browsers)
  favicon.ico               → Browser tab icon (ICO, legacy browsers)
  icon-192.svg/png          → PWA home screen icon
  icon-512.svg/png          → PWA splash screen icon
```

---

## Authentication Flow

```
1. Customer opens the app
2. App checks localStorage for a token (isLoggedIn())
3a. No token → show LoginPage
3b. Token exists → fetch /portal/me → show Dashboard

Login:
  POST /shops/:shopId/verisiye/portal/login
  Body: { homeNo: "12", telNo: "05551234567" }
  Response: { accessToken, customer: { id, name, homeNo, shopId } }
  → Token saved to localStorage (valid 30 days)
  → loggedIn state set to true → App fetches data → redirect to /dashboard

Logout:
  → clearAuth() removes token from localStorage
  → loggedIn state set to false → redirect to /login

Token expiry / 401:
  → clearAuth() + loggedIn set to false → redirect to /login automatically
```

---

## API Reference

Base URL: `REACT_APP_API_URL` + `/shops/REACT_APP_SHOP_ID/verisiye/portal`

### POST `/login`
Login with home number and phone number.

**Request body:**
```json
{ "homeNo": "12", "telNo": "05551234567" }
```

**Response:**
```json
{
  "accessToken": "eyJ...",
  "customer": { "id": 1, "name": "Ahmet", "homeNo": "12", "shopId": 1 }
}
```

---

### GET `/me`
Get the logged-in customer's full data.

**Headers:** `Authorization: Bearer <accessToken>`

**Response:**
```json
{
  "customer": { "id": 1, "name": "Ahmet", "balance": "150.00" },
  "sales": [
    {
      "id": 10,
      "totalAmount": "200.00",
      "createdAt": "2026-03-01T10:00:00Z",
      "items": [
        { "productName": "Ekmek", "quantity": "2", "priceAtSale": "5.00", "lineTotal": "10.00" }
      ]
    }
  ],
  "payments": [
    { "amount": "50.00", "paymentDate": "2026-03-10", "note": "Nakit" }
  ]
}
```

---

## Pages

### `/login` — Login Page
- Two fields: **Ev Numarası** (free text) and **Telefon Numarası** (digits only)
- Shows error message on failed login
- On success: saves token → sets loggedIn → App auto-redirects to `/dashboard`
- If already logged in, redirects to `/dashboard`

### `/dashboard` — Dashboard
- Greeting with customer name
- **Big red balance card** showing total outstanding debt in ₺
- Two stat cards: total number of purchases and payments
- Quick-link buttons to Transactions and Payments pages
- Refresh button to re-fetch latest data
- Shows offline warning banner if API call failed (cached data shown)

### `/transactions` — Alışverişlerim
- List of all credit (veresiye) purchases, sorted newest first
- Each row shows: date + total amount
- **Tap to expand** → shows item breakdown (product name, quantity, unit price, line total)
- Shows offline badge if using cached data

### `/payments` — Ödemelerim
- List of all payments made, sorted newest first
- Each row shows: date + amount paid + note (e.g. "Nakit")
- Green summary card at top showing total amount paid across all payments
- Shows offline badge if using cached data

---

## Components

### `Layout`
Wraps all authenticated pages. Provides:
- **Header** (green, sticky): App name + Çıkış (logout) button
- **Main content area**: scrollable, padded, with bottom padding for nav bar
- **Bottom navigation**: 3 tabs — Ana Sayfa, Alışverişler, Ödemeler

Props: `onLogout` (function called when logout button clicked)

### `InstallPrompt`
Floating banner at the bottom of the screen on first visit:
- "Uygulamayı telefona ekle" with Install / Dismiss buttons
- Listens for the browser's `beforeinstallprompt` event
- Dismissal is remembered in localStorage (`pwa_install_dismissed`)
- Only shown on supported browsers (Chrome on Android)

---

## Global State (App.js)

All data is fetched once at the top level and passed down as props.

| State | Type | Description |
|---|---|---|
| `loggedIn` | boolean | Whether the user has a valid token |
| `data` | object | Full response from `/portal/me` (customer, sales, payments) |
| `loading` | boolean | True while API call is in progress |
| `error` | string | Error message if API call failed |

`fetchData()` is wrapped in `useCallback` and called:
- On mount if already logged in
- After successful login (triggered by `loggedIn` state change via `useEffect`)
- Manually via the Refresh button on Dashboard

---

## Auth Helpers (`auth.js`)

| Function | Description |
|---|---|
| `saveAuth(token, customer)` | Saves token and customer to localStorage |
| `getToken()` | Returns stored JWT token or null |
| `getCustomer()` | Returns stored customer object or null |
| `clearAuth()` | Removes token and customer from localStorage |
| `isLoggedIn()` | Returns true if a token exists |

---

## PWA & Offline Support

### Service Worker (`service-worker.js`)
- Only registered in **production** (`NODE_ENV === 'production'`) — not in dev
- **Cache name:** `veresiye-v1`
- On install: pre-caches `/`, `/index.html`, `/manifest.json`
- On fetch strategy:
  - `/portal/me` API calls: **network first**, caches successful response for offline use
  - Same-origin requests: **network first**, falls back to cache, then `/index.html`
  - Non-GET requests: not intercepted

### Manifest (`manifest.json`)
```json
{
  "name": "Balcı Market Defterim",
  "short_name": "Defterim",
  "theme_color": "#22c55e",
  "display": "standalone",
  "start_url": "/"
}
```

---

## Deployment

### Frontend (Vercel)
1. Connect GitHub repo `arita10/debt-portal` to Vercel
2. Set environment variables in Vercel dashboard:
   ```
   REACT_APP_API_URL=https://posbackend-3zqv.onrender.com
   REACT_APP_SHOP_ID=1
   ```
3. Build command: `npm run build`
4. Output directory: `build`

### Backend CORS (Render)
The backend must allow the Vercel domain. Set in Render dashboard → Environment:
```
ALLOWED_ORIGINS=https://balci-defterim.vercel.app
```

---

## Running Locally

```bash
# Install dependencies
cd Veresiye-Portal
npm install

# Start dev server (proxies API to avoid CORS)
npm start
# Opens http://localhost:3000

# Production build
npm run build
```

> **Note:** Render free tier spins down after inactivity. The first API request may take 30–60 seconds.

---

## Known Limitations

- **Read-only** — customers cannot make payments through this portal
- **Single shop** — `REACT_APP_SHOP_ID` is baked in at build time; each shop needs its own deployment
- **No push notifications** — balance changes are only visible after manual refresh
- **iOS install prompt** — iOS Safari does not support `beforeinstallprompt`; users must use "Add to Home Screen" from the Share menu manually
