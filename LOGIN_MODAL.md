# Gabru Look - Login Modal Implementation

## Overview
Professional auto-popup login modal with Firebase Phone OTP authentication for Gabru Look salon platform.

## Features
- **Auto-popup**: Modal appears automatically on page load
- **Silent re-auth**: Checks for existing session and redirects appropriately
- **Phone OTP**: Firebase Phone Authentication with invisible reCAPTCHA
- **Australian numbers**: Validates and formats to E.164 (+61XXXXXXXXX)
- **Role-based redirects**: Sends users to correct dashboard after login
- **Premium UI**: Dark theme with luxury styling
- **Error handling**: Comprehensive error states and loading indicators

## Authentication Flow
1. Page loads → Modal opens automatically
2. Checks for existing Firebase token in sessionStorage
3. If token exists → Verifies with backend → Redirects to dashboard
4. If no token → User enters mobile number
5. Firebase sends OTP via SMS with invisible reCAPTCHA
6. User enters OTP → Firebase verifies → Backend syncs user
7. Redirects based on role: user/barber/admin

## File Structure
```
src/
├── components/LoginModal.js          # Main modal component
├── lib/firebase.js                   # Firebase config + auth exports
├── lib/api.js                        # Axios client with token interceptor
├── lib/phone.js                      # Australian phone validation
└── app/layout.jsx                    # Root layout with modal
```

## Security Features
- Firebase ID token stored in sessionStorage
- All role verification via backend API
- Invisible reCAPTCHA prevents abuse
- No client-side role trust
- Automatic token cleanup on errors

## UI/UX
- Dark premium theme (gray-900/800 backgrounds)
- Centered modal with backdrop blur
- Loading states for all async operations
- Clear error messages
- Back button to return to phone entry
- Professional typography and spacing

## Backend Integration
- `GET /auth/me` - Fetch user role for silent auth
- `POST /api/auth/sync` - Sync Firebase user to MongoDB
- Bearer token authentication for all API calls

## Usage
Modal automatically appears on every page load. No manual triggering required. Once authenticated, user is redirected to appropriate dashboard and modal closes automatically.

## Environment Variables Required
```env
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
```
