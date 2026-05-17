# ԷՊՔ — Ejmiatsin State College Full-Stack App

## 📁 Project Structure

```
epq/
├── server/       ← Express.js API + MongoDB  (port 5000)
├── admin/        ← Next.js Admin Panel        (port 3001)
└── frontend/     ← Next.js Client Site        (port 3000)  ← your existing site
```

---

## 🚀 Setup & Run

### 1. Prerequisites
- Node.js v18+
- MongoDB running locally OR MongoDB Atlas URI

### 2. Server
```bash
cd server
cp .env.example .env
# Edit .env — set MONGODB_URI and JWT_SECRET
npm install
npm run dev
```

### 3. Admin Panel
```bash
cd admin
npm install
npm run dev
# → http://localhost:3001
```

### 4. Frontend (your existing site)
```bash
cd frontend
npm install
npm run dev
# → http://localhost:3000
```

---

## ✨ Features

### Admin Panel (localhost:3001)
- **Login / Register** — JWT auth
- **Dashboard** — count overview  
- **Announcements** — create, edit, delete with:
  - 3 languages: Հայ / Русский / English
  - Image upload (multiple)
  - Facebook/YouTube video embed
  - "Valid until" date
  - Publish/unpublish toggle
- **News (Գրառումներ)** — same features without "valid until"

### Frontend (localhost:3000)
- **Announcement page** — fetches live from DB, shows in current language
- **Notes page** — fetches live news from DB
- **Events page** — combines announcements + news, sorted by date
- All existing pages (About, Departments, Staff, etc.) — **unchanged**
- Language switcher still works for all content

### Server (localhost:5000)
- `POST   /api/auth/register`  — create admin
- `POST   /api/auth/login`     — login
- `GET    /api/auth/me`        — current user (protected)
- `GET    /api/announcements`  — public list
- `GET    /api/announcements/admin` — all (protected)
- `GET    /api/announcements/:id`   — single
- `POST   /api/announcements`       — create (protected, multipart)
- `PUT    /api/announcements/:id`   — update (protected, multipart)
- `DELETE /api/announcements/:id`   — delete (protected)
- Same routes for `/api/news`
- Static files: `GET /uploads/*`

---

## 🌍 Translation (Multilingual)
Every announcement and news post stores:
```json
{
  "title":   { "am": "...", "ru": "...", "en": "..." },
  "content": { "am": "...", "ru": "...", "en": "..." }
}
```
The frontend reads the user's current language and falls back to Armenian if a translation is missing.

---

## 🔧 How it connects

```
Admin Panel  →  POST/PUT/DELETE  →  Server (MongoDB)
Frontend     →  GET              →  Server (MongoDB)
```

When you add an announcement in the admin panel, it instantly appears on the frontend site.

---

## 📝 Notes
- Images uploaded via admin are served from `/uploads/` on the server
- Facebook image URLs from your existing static data still work
- The frontend's existing static data (departments, staff, etc.) is **not changed**
- Only announcements and news now come from the database
