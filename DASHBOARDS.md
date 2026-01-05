# Urban Gabhru Salon - Dashboard Setup

## Overview
Role-based dashboards for Urban Gabhru salon platform using Next.js App Router, Firebase Auth, and MongoDB Atlas.

## Dashboard Routes
- `/dashboard/user` - Customer booking & history
- `/dashboard/barber` - Staff daily operations  
- `/dashboard/admin` - Full system control

## Security Model
- Role verification via backend API (`GET /auth/me`)
- Firebase token sent via `Authorization: Bearer <token>`
- Frontend redirects if role mismatch
- No client-side role trust

## API Endpoints
- `GET /auth/me` - Returns `{ id, role, phone }`
- `POST /api/auth/sync` - Sync Firebase user to MongoDB

## Role Permissions
- **user**: View bookings, book appointments, favorites
- **barber**: View assigned bookings, client notes, availability
- **admin**: Manage barbers, roles, schedules, analytics, pricing

## File Structure
```
src/
├── app/dashboard/[role]/page.js
├── components/DashboardLayout.js
├── lib/api.js
└── lib/phone.js
```

## Running Locally
1. Start backend: `npm run dev` (port 5001)
2. Start frontend: `npm run dev` (port 3000)
3. Access dashboards based on user role

## Environment Variables
Frontend (.env.local):
- `NEXT_PUBLIC_FIREBASE_*` (Firebase config)
- `NEXT_PUBLIC_API_BASE_URL=http://localhost:5001`

Backend (.env):
- `PORT=5001`
- `CLIENT_ORIGIN=http://localhost:3000`
- `MONGODB_URI` (MongoDB Atlas connection string)
