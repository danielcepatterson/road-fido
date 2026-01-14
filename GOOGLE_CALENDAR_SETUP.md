# Google Calendar Integration Setup Guide

## Overview
This app exports your run calendar events directly to Google Calendar using OAuth 2.0 and the Google Calendar API.

## Steps to Set Up

### 1. Create Google OAuth Credentials
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project (or select an existing one)
3. Enable the **Google Calendar API**:
   - Go to "APIs & Services" → "Library"
   - Search for "Google Calendar API"
   - Click "Enable"
4. Create OAuth 2.0 credentials:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth Client ID"
   - Choose "Web application"
   - Add Authorized redirect URIs:
     - For local development: `http://localhost:5173/auth/callback`
     - For production: `https://your-domain.com/auth/callback`
   - Copy the **Client ID** and **Client Secret**

### 2. Configure Your App

#### For Local Development:
Create a `.env.local` file in the project root:
```
VITE_GOOGLE_CLIENT_ID=your_client_id_here
```

#### In `wrangler.json`:
Update the `vars` section with your credentials:
```json
"vars": {
  "GOOGLE_CLIENT_ID": "your_client_id_here",
  "GOOGLE_CLIENT_SECRET": "your_client_secret_here",
  "GOOGLE_REDIRECT_URI": "http://localhost:5173/auth/callback"
}
```

For production, use Wrangler secrets:
```bash
wrangler secret put GOOGLE_CLIENT_SECRET
```

### 3. Run the App

```bash
npm run dev
```

This will start:
- React app on `http://localhost:5173`
- Cloudflare Worker on the same local server

### 4. Use the Feature

1. Click **"🔗 Connect Google Calendar"** to authorize the app
2. You'll be redirected to Google's login page
3. Once authorized, click **"📤 Export to Google Calendar"** to create events
4. All run dates will be added to your primary Google Calendar

## Architecture

### Frontend (React)
- Handles OAuth flow by redirecting to Google login
- Manages local storage of access/refresh tokens
- Provides UI for authorization and export

### Backend (Cloudflare Worker)
- `/api/auth/google-callback` - Exchanges auth code for tokens
- `/api/auth/refresh-token` - Refreshes expired tokens
- `/api/calendar/create-event` - Creates a single calendar event
- `/api/calendar/create-run-events` - Creates multiple events for a run

### Security
- Client secret is never exposed to the frontend
- Refresh tokens are stored securely on the user's device
- Access tokens are short-lived and refreshed automatically
- All sensitive operations go through the worker backend

## Troubleshooting

### "Failed to connect to Google Calendar"
- Check that your Client ID is correct in `.env.local`
- Verify the redirect URI matches exactly in Google Cloud Console
- Check browser console for detailed error messages

### "No refresh token available"
- Click "Disconnect" and re-authorize
- Make sure to grant permission when Google asks

### Events not appearing in Google Calendar
- Check that Google Calendar API is enabled in Google Cloud Console
- Verify the access token hasn't expired (auto-refresh should handle this)
- Check browser console for any error messages

## Event Details

Each exported event includes:
- **Title**: Run name + day type (Show/Travel/Off)
- **Venue**: Location from the run data
- **Description**: Date, type, pay amount, travel info
- **Time**: Based on the day's start time with 2-hour default duration
- **Timezone**: America/Chicago (configurable)

## Privacy & Permissions

- This app only requests access to create calendar events
- No other calendar data is accessed or modified
- Your refresh token is stored locally in your browser
- You can revoke access anytime by disconnecting or through Google Account settings
