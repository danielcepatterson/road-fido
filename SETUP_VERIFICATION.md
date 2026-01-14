# Quick Google Calendar Setup Checklist

## ✅ Before Testing

Follow these steps in order to fix the 401 error:

### 1. Get Your Google Credentials
Go to [Google Cloud Console](https://console.cloud.google.com):

1. Create a new project (or select existing)
2. Enable **Google Calendar API**
   - Search for "Google Calendar API" in the Library
   - Click Enable
3. Go to **APIs & Services → Credentials**
4. Click **Create Credentials → OAuth Client ID**
5. Choose **Web application**
6. Under "Authorized redirect URIs", add:
   ```
   http://localhost:5173/auth/callback
   ```
7. Click Create and copy your **Client ID** and **Client Secret**

### 2. Create .env.local File
In your project root, create a `.env.local` file:

```
VITE_GOOGLE_CLIENT_ID=your_actual_client_id_here
```

**Replace `your_actual_client_id_here` with the Client ID from Google Cloud Console (it looks like: `xxxxx.apps.googleusercontent.com`)**

### 3. Update wrangler.json
Open `wrangler.json` and update the `vars` section:

```json
"vars": {
  "GOOGLE_CLIENT_ID": "your_actual_client_id_here",
  "GOOGLE_CLIENT_SECRET": "your_actual_client_secret_here",
  "GOOGLE_REDIRECT_URI": "http://localhost:5173/auth/callback"
}
```

**Replace the placeholder values with your actual credentials**

### 4. Verify Redirect URI Matches
Make sure `http://localhost:5173/auth/callback` is:
- ✅ In `.env.local` (implicitly via localhost check)
- ✅ In `wrangler.json` as `GOOGLE_REDIRECT_URI`
- ✅ In Google Cloud Console under Authorized redirect URIs

**The exact URL must match perfectly** (protocol, domain, port, path)

### 5. Restart Your Dev Server
```bash
npm run dev
```

### 6. Test the Connection
1. Click "🔗 Connect Google Calendar"
2. You should be redirected to Google login (not see a 401 error)
3. Sign in and grant permissions
4. You'll be redirected back to your app

## 🐛 Debugging

If you still get a 401 error:

1. **Check browser console** (F12 or right-click → Inspect)
   - Look for error messages
   
2. **Check the status message** in the app
   - It will show exactly what's missing
   
3. **Verify your Client ID**
   - Open `.env.local` and confirm it's set
   - It should be a long string ending in `.apps.googleusercontent.com`
   
4. **Check Google Cloud Console**
   - Make sure Google Calendar API is **Enabled** (not just created)
   - Check that OAuth credentials are for "Web application" (not Native app)
   
5. **Clear browser data**
   ```javascript
   // In browser console, run:
   localStorage.clear()
   location.reload()
   ```

## ⚙️ If Using Production Domain

When deploying to production, update:

1. Google Cloud Console → Add your domain to Authorized redirect URIs:
   ```
   https://your-domain.com/auth/callback
   ```

2. Update `wrangler.json`:
   ```json
   "vars": {
     "GOOGLE_CLIENT_ID": "your_id",
     "GOOGLE_CLIENT_SECRET": "your_secret",
     "GOOGLE_REDIRECT_URI": "https://your-domain.com/auth/callback"
   }
   ```

3. Deploy:
   ```bash
   npm run deploy
   ```

## 📝 File Checklist

- [ ] `.env.local` exists with `VITE_GOOGLE_CLIENT_ID` set
- [ ] `wrangler.json` has all three Google vars configured
- [ ] `http://localhost:5173/auth/callback` is in Google Cloud Console
- [ ] Google Calendar API is **Enabled** in Google Cloud Console
- [ ] Dev server restarted after changes
