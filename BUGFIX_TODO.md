# Vantage Bug Fix Tracker

## Bugs to Fix

- [x] 1. Fix missing `useAuth` import in Dashboard.jsx (uses useAuth() but doesn't import it)
- [x] 2. Fix token key mismatch (api.js uses "access_token", AuthProvider uses "vantage-access-token")
- [x] 3. Fix auth response consistency (auth endpoints don't use APIResponse wrapper)
- [ ] 4. Add missing GET /articles list endpoint (only /articles/{id} exists)
- [ ] 5. Fix hardcoded similarity_score in build_event_out (replace with real cosine similarity)
- [ ] 6. Fix /sentiment endpoint to use real ML inference instead of keyword matching

## Authentication Fixes (completed)

The following authentication issues were identified and fixed:

### Frontend
- Removed hardcoded demo credentials from SignIn.jsx
- Removed "Use the demo account" button from SignIn.jsx
- Added field-level validation (email format, password length) to SignIn.jsx
- Added field-specific error messages to SignIn.jsx and SignUp.jsx
- Added password confirmation validation and visual feedback to SignUp.jsx
- Clear field-specific errors when user edits a field
- Submit button disabled while request is processing
- Forms work correctly when pressing Enter (form onSubmit)
- Show/hide password controls on both forms
- Password strength meter on SignUp.jsx

### API / Auth Provider
- Removed `notifyRouteChange` function that cleared session on '/' (critical bug)
- Removed `notifyRouteChange('/')` call from Landing.jsx (was logging out users)
- Improved error handling in api.js to preserve HTTP status codes
- Replaced hard `window.location.href` redirect on 401 with custom event
- AuthProvider now listens for `auth:logout` event to sync state
- `signOut` now calls the `/auth/logout` backend endpoint
- Login still uses FormData (OAuth2PasswordRequestForm standard)

### Backend
- Email is now normalized (lowercased + stripped) before saving and comparing
- Password validation (min 6 chars) added to UserCreate model
- full_name validation (max 255 chars) added to UserCreate model
- Duplicate-key errors (IntegrityError) handled with user-friendly 400 response
- Login endpoint now uses `wrap_response` (APIResponse wrapper) for consistency
- SECRET_KEY, ALGORITHM, and ACCESS_TOKEN_EXPIRE_MINUTES now read from settings
- Added `get_current_user` dependency for protected routes
- Added `/me` endpoint to retrieve current user
- Added `updated_at` column to User model
- Login returns same error for missing user and wrong password (prevents enumeration)
