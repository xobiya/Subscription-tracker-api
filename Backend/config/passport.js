// Passport and OAuth strategy loader with graceful fallback.
// If the passport packages are not installed (for example when `npm install` fails
// because of network/CA issues), this module exports a lightweight dummy that
// prevents the app from crashing while clearly disabling OAuth endpoints.

let passport;

try {
  // Use dynamic import so failures can be caught
  const passportModule = await import('passport');
  passport = passportModule.default || passportModule;

  const { Strategy: GoogleStrategy } = await import('passport-google-oauth20');
  const { Strategy: TwitterStrategy } = await import('passport-twitter');

  const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
  const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
  const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL || `${process.env.SERVER_URL || `http://localhost:${process.env.PORT || 5000}`}/api/v1/auth/google/callback`;

  const TWITTER_CLIENT_ID = process.env.TWITTER_CLIENT_ID;
  const TWITTER_CLIENT_SECRET = process.env.TWITTER_CLIENT_SECRET;
  const TWITTER_CALLBACK_URL = process.env.TWITTER_CALLBACK_URL || `${process.env.SERVER_URL || `http://localhost:${process.env.PORT || 5000}`}/api/v1/auth/twitter/callback`;

  if (GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET) {
    passport.use(
      new GoogleStrategy(
        {
          clientID: GOOGLE_CLIENT_ID,
          clientSecret: GOOGLE_CLIENT_SECRET,
          callbackURL: GOOGLE_CALLBACK_URL,
        },
        (accessToken, refreshToken, profile, done) => done(null, { provider: 'google', profile, accessToken })
      )
    );
  }

  if (TWITTER_CLIENT_ID && TWITTER_CLIENT_SECRET) {
    passport.use(
      new TwitterStrategy(
        {
          consumerKey: TWITTER_CLIENT_ID,
          consumerSecret: TWITTER_CLIENT_SECRET,
          callbackURL: TWITTER_CALLBACK_URL,
          includeEmail: true,
        },
        (token, tokenSecret, profile, done) => done(null, { provider: 'twitter', profile, accessToken: token })
      )
    );
  }
} catch (err) {
  // eslint-disable-next-line no-console
  console.warn('Passport or OAuth strategies are not installed — OAuth routes will be disabled.', err && err.message);

  passport = {
    initialize: () => (req, res, next) => next(),
    authenticate: () => (req, res) => res.status(503).json({ success: false, message: 'OAuth not available on this server (missing dependencies)' }),
  };
}

export default passport;
