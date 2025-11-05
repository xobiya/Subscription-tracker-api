import { config } from 'dotenv';
import process from 'process';

// Load .env.development.local or .env.production.local depending on NODE_ENV
config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

// Export environment variables
export const { PORT, NODE_ENV, DB_URI 
    , JWT_SECRET, JWT_EXPIRES_IN
} = process.env;
