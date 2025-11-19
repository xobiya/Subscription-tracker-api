import { ARCJET_KEY, NODE_ENV } from "./env.js";
import arcjet, { shield, detectBot, tokenBucket } from "@arcjet/node";

const isProduction = NODE_ENV === 'production';

const aj = arcjet({
  key: ARCJET_KEY,
  characteristics: ["ip.src"],
  rules: [
    shield({ mode: isProduction ? "LIVE" : "DRY_RUN" }),

    // Bot detection rule
    detectBot({
      mode: isProduction ? "LIVE" : "DRY_RUN", // Blocks requests only in production
      allow: [
        "CATEGORY:SEARCH_ENGINE", // Google, Bing, etc.
        // Optionally allow other common bot categories in non-production
        // "CATEGORY:MONITOR", // Uptime monitoring services
        // "CATEGORY:PREVIEW", // Link previews (Slack, Discord, etc.)
      ],
    }),

    // Token bucket rate limiting
    tokenBucket({
      mode: isProduction ? "LIVE" : "DRY_RUN",
      // Tracked by IP address by default
      refillRate: 5, // Refill 5 tokens per interval
      interval: 10, // Refill every 10 seconds
      capacity: 10, // Bucket capacity of 10 tokens
    }),
  ],
});

export default aj;
