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
| POST | `/api/auth/login` | Public, returns `{ token, expiresAt }` |
| GET | `/api/admin/me` | Admin |
| GET, POST | `/api/admin/announcements` | Admin |
| GET, PUT, DELETE | `/api/admin/announcements/{id}` | Admin |
| GET | `/api/admin/messages`, `/api/admin/messages/unread-count` | Admin |
| PATCH, DELETE | `/api/admin/messages/{id}` | Admin (`{ "read": true }` to mark read) |

Admin requests send `Authorization: Bearer <token>`.

# Going live

The public website can run on its own, without the backend: announcements come from the built-in list in `frontend/src/api/announcements.ts`, and the contact form offers WhatsApp or email.

**Netlify (recommended, free):** Add new site → Import from GitHub → pick this repo. `netlify.toml` sets the folder and build command. Then add the school's domain under Domain management.

**Vercel:** Import the repo and set Root Directory to `frontend` (`frontend/vercel.json` handles the rest). Vercel's free plan is for non-commercial use.

When the backend is hosted, set `VITE_API_BASE` to its URL (for example `https://api.example.co.za/api`) in the host's environment variables and redeploy.

# Project Status

 Currently in Development
Developed as a portfolio project and real-world solution for Veli Child Academy.
