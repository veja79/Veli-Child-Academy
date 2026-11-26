# Veli Child Academy

Official website and administration portal for Veli Child Academy.

# Project Overview

This project is being developed to provide an online presence for Veli Child Academy while also offering an administration portal for managing school announcements and news.

# Features

# Public Website
- Home
- About the School
- Announcements
- Contact Us

# Administration
- Secure Login
- Manage Announcements
- Manage News

# Technology Stack

# Backend
- Java 21
- Spring Boot
- Spring Security
- Spring Data JPA

# Frontend
- React
- TypeScript

# Database
- MySQL

# Running the frontend

```bash
cd frontend
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check and production build
```

School details (phone, address, programmes, about text) live in `frontend/src/content/school.ts`.
Until the backend is running, the Announcements page shows sample data. In development, `/api` calls are proxied to `http://localhost:8080`.

# Running the backend

Needs Java 21, Maven and Docker (for MySQL).

```bash
docker compose up -d            # starts MySQL on port 3306
cd backend
export JWT_SECRET="$(openssl rand -base64 48)"
export ADMIN_USERNAME=admin ADMIN_PASSWORD='choose-a-strong-password'
mvn spring-boot:run             # http://localhost:8080
mvn verify                      # run the tests (uses an in-memory H2 database)
```

Flyway creates the tables on first start (`backend/src/main/resources/db/migration`). The first admin account is created from `ADMIN_USERNAME` / `ADMIN_PASSWORD` only if no admin exists. See `backend/.env.example` for all settings.

## API

| Method | Path | Access |
| --- | --- | --- |
| GET | `/api/announcements`, `/api/announcements/{id}` | Public (published, not future-dated) |
| POST | `/api/contact` | Public (POPIA consent required) |
| POST | `/api/applications` | Public online application (POPIA consent required) |
| POST | `/api/auth/login` | Public, returns `{ token, expiresAt }` |
| GET | `/api/admin/me` | Admin |
| GET, POST | `/api/admin/announcements` | Admin |
| GET, PUT, DELETE | `/api/admin/announcements/{id}` | Admin |
| GET | `/api/admin/messages`, `/api/admin/messages/unread-count` | Admin |
| PATCH, DELETE | `/api/admin/messages/{id}` | Admin (`{ "read": true }` to mark read) |
| GET | `/api/admin/applications`, `/api/admin/applications/new-count` | Admin |
| PATCH, DELETE | `/api/admin/applications/{id}` | Admin (`{ "status": "CONTACTED" }`; NEW, CONTACTED, ACCEPTED, WAITLIST, DECLINED) |

Admin requests send `Authorization: Bearer <token>`.

# Going live

**Website: Cloudflare Workers (free, static assets).** The Worker `veli-child-academy-website` is connected
to this repo with root directory `frontend`, build command `npm install && npm run build` and deploy command
`npx wrangler deploy` (set in the Cloudflare dashboard: Workers Builds ignores build steps in `wrangler.jsonc`). `frontend/wrangler.jsonc` serves `dist/` and sends page addresses like `/register`
to `index.html`. Every merge into `main` goes live automatically.

**Site address and backend address** live in `frontend/.env.production` (with safe defaults in
`frontend/vite.config.ts` and `frontend/src/config.ts`):

- `VITE_SITE_URL`: the public address, used for the canonical link, share previews, `sitemap.xml` and `robots.txt`
  (generated at build time). Change it when the .co.za domain is connected.
- `VITE_API_BASE`: the backend on Railway. If the website moves to a new address, add it to `CORS_ORIGINS` in Railway.

The website still works if the backend is down: news falls back to the built-in list in
`frontend/src/api/announcements.ts`, and the contact and application forms offer WhatsApp instead.

`netlify.toml` and `frontend/vercel.json` are kept so the site can also be deployed to those hosts.

Backend hosting steps: [docs/DEPLOY-BACKEND.md](docs/DEPLOY-BACKEND.md).

# Admin portal

Staff log in at `/admin` to post news (with drafts, pinning, scheduled dates and posters), follow up
online applications from the Register page, and read contact-form messages. It needs the backend to be running.

# Project Status

 Currently in Development
Developed as a portfolio project and real-world solution for Veli Child Academy.

# Author

Designed and developed by **Siphesihle (Gift) Dlomo** ([@Veja79](https://github.com/Veja79)).
