# Testing the Google Calendar Integration

## Quick Start Testing

### 1. Get Google Credentials
- Visit [Google Cloud Console](https://console.cloud.google.com)
- Create project → Enable Google Calendar API → Create OAuth Web credentials
- Note your **Client ID** and **Client Secret**

### 2. Configure Locally
```bash
# Create .env.local in project root
echo "VITE_GOOGLE_CLIENT_ID=your_client_id_here" > .env.local
```

### 3. Update wrangler.json
```json
"vars": {
  "GOOGLE_CLIENT_ID": "your_client_id_here",
  "GOOGLE_CLIENT_SECRET": "your_client_secret_here",
  "GOOGLE_REDIRECT_URI": "http://localhost:5173/auth/callback"
}
```

### 4. Run Locally
```bash
npm run dev
```

### 5. Test the Flow
1. Navigate to your calendar view in the app
2. Click **"🔗 Connect Google Calendar"**
3. Sign in with your Google account
4. Grant calendar permissions
5. You'll be redirected back with a success message
6. Click **"📤 Export to Google Calendar"**
7. Check your Google Calendar for the new events

## Testing Checklist

- [ ] OAuth login redirects to Google
- [ ] Redirect back to app after authorization
- [ ] "Connected" status shows in UI
- [ ] Can click export button without errors
- [ ] Events appear in Google Calendar
- [ ] Event details are correct (title, time, venue, description)
- [ ] Can disconnect and re-authorize
- [ ] Error messages display properly if auth fails

## Debugging Tips

### Check Browser Console
```javascript
// View stored tokens
localStorage.getItem('google_access_token')
localStorage.getItem('google_refresh_token')
localStorage.getItem('google_token_expires_at')
```

### Check Worker Logs (Cloudflare Dashboard)
- Visit [Cloudflare Workers Dashboard](https://dash.cloudflare.com/)
- Select your worker and view real-time logs

### Common Issues

**"OAuth code not found"**
- Make sure redirect URI in Google Cloud matches exactly
- Check that `VITE_GOOGLE_CLIENT_ID` is set in `.env.local`

**"Failed to create event"**
- Verify Google Calendar API is enabled in Google Cloud Console
- Check that access token hasn't expired (app should auto-refresh)
- Look at worker logs for detailed error message

**"CORS error"**
- Requests go through the Cloudflare Worker (not direct to Google)
- Should not have CORS issues, but check worker logs if it does

## Production Deployment

When deploying to production:

1. Update redirect URI in Google Cloud Console to your production domain
2. Set secrets in Wrangler:
   ```bash
   wrangler secret put GOOGLE_CLIENT_SECRET
   ```

3. Update `GOOGLE_REDIRECT_URI` in wrangler.json to production URL:
   ```json
   "vars": {
     "GOOGLE_CLIENT_ID": "your_id",
     "GOOGLE_REDIRECT_URI": "https://your-domain.com/auth/callback"
   }
   ```

4. Deploy:
   ```bash
   npm run deploy
   ```

## API Endpoints Reference

All endpoints are `/api/*` prefixed:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/auth/google-callback` | POST | Exchange OAuth code for tokens |
| `/api/auth/refresh-token` | POST | Refresh expired access token |
| `/api/calendar/create-event` | POST | Create single event |
| `/api/calendar/create-run-events` | POST | Create multiple events for run |

Request/Response format: JSON

Example request:
```json
{
  "accessToken": "ya29.a0...",
  "event": {
    "summary": "My Event",
    "start": { "dateTime": "2025-01-20T14:00:00", "timeZone": "America/Chicago" },
    "end": { "dateTime": "2025-01-20T16:00:00", "timeZone": "America/Chicago" }
  }
}
```
