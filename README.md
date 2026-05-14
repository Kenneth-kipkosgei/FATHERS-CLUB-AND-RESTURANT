# Fathers Club & Restaurant — Demo Bar Website

This repository contains a small demo website for a bar/restaurant.

What you get
- Static responsive frontend (home, menu, reservation form, admin view)
- Small Express backend exposing a reservations API with file-based storage

Quick start

1. Install dependencies

```bash
npm install
```

2. Start the server

```bash
npm start
```

The site will be available at http://localhost:3000

API
- POST /api/reservations — submit a reservation (body: name, phone, date, time, guests, notes)
- GET /api/reservations — list saved reservations (demo/admin view)

Notes & next steps
- This is a demo scaffold. For production: add input sanitization, admin authentication, a real database, and tests.

If you want me to add deployment steps (Docker, Vercel, etc.), or protect the admin area, tell me which you prefer and I'll implement it.
