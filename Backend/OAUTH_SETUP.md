# OAuth / Social Login Setup (Google & Twitter)

This project includes server-side support for OAuth using Passport.js. To enable Google and/or Twitter login you need to register an OAuth application with each provider and set the following environment variables in your Backend environment file (e.g. `.env.development.local`):

```env
# Google
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/v1/auth/google/callback

# Twitter
TWITTER_CLIENT_ID=your-twitter-consumer-key
TWITTER_CLIENT_SECRET=your-twitter-consumer-secret
TWITTER_CALLBACK_URL=http://localhost:5000/api/v1/auth/twitter/callback

# Frontend URL (used to redirect back with the JWT token)
CLIENT_URL=http://localhost:5173
```

Notes:
- After adding the variables, install the new backend dependencies and restart the backend server:

```bash
cd Backend
npm install
npm run dev
```

- The OAuth flow will redirect the user back to `CLIENT_URL/auth/callback?token=<JWT>` after successful authentication. The frontend should implement a small route (`/auth/callback`) that reads the `token` query string, stores it (e.g., localStorage), and redirects to the app (for example, `/dashboard`).

- If a provider does not return an email (Twitter may not provide email by default), the backend creates a unique placeholder email for the user so account creation still succeeds.

Security:
- Keep client secrets private. Do not commit them to source control. Use environment variables and a secrets manager in production.
