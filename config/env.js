import { config } from 'dotenv';
import process from 'process';

// Load .env.development.local or .env.production.local depending on NODE_ENV
config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

// Export environment variables
// Normalize SERVER_URL: prefer SERVER_URL, fall back to SERVER-URL or construct from PORT
const SERVER_URL = process.env.SERVER_URL || process.env['SERVER-URL'] || `http://localhost:${process.env.PORT || 5000}`;

export const {
    PORT,
    NODE_ENV,
    DB_URI,
    JWT_SECRET,
    EMAIL_PASSWORD,
    JWT_EXPIRES_IN,
    ARCJET_KEY,
    ARCJET_ENV,
    QSTASH_URL,
    QSTASH_TOKEN,
    QSTASH_CURRENT_SIGNING_KEY,
    QSTASH_NEXT_SIGNING_KEY,
} = process.env;

export { SERVER_URL };
