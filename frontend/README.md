# Vantage — Frontend

<div align="center">

### **React + Vite dashboard for AI-powered news intelligence and media bias analysis**

*Interactive workspace for exploring news event clusters, entity sentiment, and cross-publisher bias across Nepal's leading English press outlets.*

<br>

![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-6-CA4245?style=for-the-badge&logo=reactrouter&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts-2-22B5BF?style=for-the-badge&logo=recharts&logoColor=white)

</div>

---

## Overview

Vantage's frontend is a single-page application that serves as the intelligence workspace. It communicates with the FastAPI backend via REST endpoints and provides:

- **Live news feed dashboard** — clustered event intelligence with real-time metrics
- **Comparison tools** — side-by-side headline and coverage comparison across publishers
- **Entity sentiment analysis** — track sentiment toward politicians, organizations, and institutions
- **Media bias detection** — cross-publisher bias dashboards with visual indicators
- **AI playground** — run aspect-based sentiment analysis on custom text
- **Knowledge graph** — explore relationships between entities, publishers, and events

---

## Tech Stack

| Category        | Technology                           |
|-----------------|--------------------------------------|
| Framework       | React 18                             |
| Build Tool      | Vite 5                               |
| Styling         | Tailwind CSS 3 + CSS custom properties|
| Charts          | Recharts 2                           |
| Icons           | Lucide React                         |
| HTTP Client     | Axios (with JWT interceptor)         |
| Routing         | React Router 6                       |
| Animation       | Framer Motion 12                     |
| Auth            | JWT-based (localStorage + Axios interceptor) |
| Language        | JavaScript (JSX)                     |

---

## Project Structure

```
frontend/
├── public/                    # Static assets
├── src/
│   ├── app/                   # App shell & route definitions
│   ├── components/
│   │   ├── layout/           # Sidebar, NavRail, TopBar, MobileNav, Footer
│   │   └── ui/               # Button, Badge, Avatar, Alert, Progress, etc.
│   ├── hooks/                # Custom hooks
│   ├── layouts/              # AppLayout, AuthLayout, PageContainer, PanelLayout
│   ├── lib/                  # Axios API client, utility functions
│   ├── pages/                # Route-level page components
│   ├── providers/            # AuthProvider, ThemeProvider
│   ├── services/             # API service modules (articles, events, bias, etc.)
│   ├── styles/               # Theme CSS (light/dark CSS custom properties)
│   ├── tokens/               # Design tokens (colors, spacing, typography)
│   └── utils/                # Helpers, config, mock data
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Backend server running on `http://localhost:8000` (see [backend README](../backend/README.md))

### Setup

```bash
# 1. Install dependencies
npm install

# 2. (Optional) Set environment variables for the API base URL
#    Default: http://localhost:8000/api/v1 (proxied via Vite)
cp .env.example .env

# 3. Start the development server
npm run dev
```

The app runs at **http://localhost:5173**.

> API requests to `/api/*` are proxied to `http://localhost:8000` by Vite's dev server. No CORS issues in development.

---

## Available Scripts

| Command             | Description                         |
|---------------------|-------------------------------------|
| `npm run dev`       | Start the Vite development server   |
| `npm run build`     | Build the production bundle         |
| `npm run preview`   | Preview the production build        |

---

## Backend Integration

This frontend is **not mock-only** — it communicates with a real FastAPI backend.

### How it connects

1. **API client** (`src/lib/api.js`) — Axios instance configured with `VITE_API_BASE_URL` (default: `/api/v1`)
2. **Request interceptor** — automatically attaches JWT `Authorization: Bearer <token>` header from localStorage
3. **Response interceptor** — unwraps the standardized `{ success, message, data }` response format and handles 401 errors (clears session, dispatches `auth:logout` event)
4. **Auth flow** — stores JWT in `localStorage` under `vantage-access-token`; the `AuthProvider` reads it on mount to hydrate the session

### Environment Variables

| Variable              | Default                   | Description             |
|-----------------------|---------------------------|-------------------------|
| `VITE_API_BASE_URL`   | `/api/v1`                 | Backend API base path   |

In production, set `VITE_API_BASE_URL` to your deployed backend URL (e.g., `https://api.vantage.np/api/v1`).

---

## Routing

| Path              | Page              | Auth Required |
|-------------------|-------------------|---------------|
| `/`               | Landing page      | No            |
| `/sign-in`        | Sign In           | No            |
| `/sign-up`        | Sign Up           | No            |
| `/dashboard`      | Dashboard         | Yes           |
| `/events`         | Event Clusters    | Yes           |
| `/events/:id`     | Event Detail      | Yes           |
| `/articles`       | Article Archive   | Yes           |
| `/articles/:id`   | Article Detail    | Yes           |
| `/compare`        | Compare Headlines | Yes           |
| `/bias`           | Bias Dashboard    | Yes           |
| `/publishers`     | Media Houses      | Yes           |
| `/publishers/:id` | Publisher Profile | Yes           |
| `/entities`       | Entity Sentiment  | Yes           |
| `/analytics`      | Analytics         | Yes           |
| `/graphs`         | Knowledge Graph   | Yes           |
| `/playground`     | AI Playground     | Yes           |
| `/live`           | Live Analysis     | Yes           |
| `/insights`       | AI Insights       | Yes           |
| `/search`         | Search            | Yes           |
| `/notifications`  | Notifications     | Yes           |
| `/settings`       | Settings          | Yes           |

---

## App Layouts

The app provides three layout modes configurable per-route:

| Layout   | Description                                      |
|----------|--------------------------------------------------|
| `full`   | Top bar only — landing, auth, reports            |
| `workspace` | Top bar + sidebar — main dashboard workspace |
| `rail`   | Top bar + compact icon-only nav rail             |

Layout is selected in `src/app/routes.jsx` via the `layout` metadata field.

---

## Design System

Colors, spacing, typography, and elevation are defined in **CSS custom properties** under `:root` and `.dark` scopes in `src/styles/theme.css`. Design tokens are centrally managed in `src/tokens/theme.js`.

Key principles:
- Light mode + dark mode via `ThemeProvider`
- Reusable component library in `src/components/ui/`
- Consistent `--radius-md`, `--radius-lg`, `--color-brand-*` tokens
- Backdrop blur for sticky headers
- `card-elevated` utility for consistent card shadows

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes
4. Push: `git push origin feature/your-feature`
5. Open a Pull Request

---

## License

MIT