import { ARCJET_KEY } from "./env.js";
import arcjet, { shield, detectBot, tokenBucket } from "@arcjet/node";

const aj = arcjet({
  key: ARCJET_KEY,
  characteristics: ["ip.src"],
  rules: [
    // Protect your app from common attacks (e.g., SQL injection)
    shield({ mode: "LIVE" }),

    // Bot detection rule
    detectBot({
      mode: "LIVE", // Blocks requests; use "DRY_RUN" to log only
      allow: [
        "CATEGORY:SEARCH_ENGINE", // Google, Bing, etc.
        // Uncomment to allow other common bot categories
        // "CATEGORY:MONITOR", // Uptime monitoring services
        // "CATEGORY:PREVIEW", // Link previews (Slack, Discord, etc.)
      ],
    }),

    // Token bucket rate limiting
    tokenBucket({
      mode: "LIVE",
      // Tracked by IP address by default
      refillRate: 5, // Refill 5 tokens per interval
      interval: 10, // Refill every 10 seconds
      capacity: 10, // Bucket capacity of 10 tokens
    }),
  ],
});

export default aj;
