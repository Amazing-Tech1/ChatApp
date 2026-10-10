import arcjet, { shield, detectBot, slidingWindow } from "@arcjet/node";
import "dotenv/config";

if (!process.env.ARCJET_KEY) {
  throw new Error("ARCJET_KEY is missing");
}

export const aj = arcjet({
  // Get your site key from https://console.arcjet.com and set it as an environment
  // variable rather than hard coding.
  key: process.env.ARCJET_KEY as string,
  rules: [
    // Shield protects your app from common attacks such as SQL injection
    shield({ mode: "LIVE" }),
    // Create a bot detection rule
    detectBot({
      mode: "LIVE", // Blocks requests. Use "DRY_RUN" to log only
      // Block all bots except the following
      allow: [
        "CATEGORY:SEARCH_ENGINE", // Google, Bing, etc
        // Uncomment to allow these other common bot categories
        // See the full list at https://arcjet.com/bot-list
        //"CATEGORY:MONITOR", // Uptime monitoring services
        //"CATEGORY:PREVIEW", // Link previews such as Slack, Discord
      ],
    }),
    // Create a token bucket rate limit. Other algorithms are supported.

    slidingWindow({
      mode: "LIVE",
      max: 2,
      interval: 60, // 60 seconds
      // Tracked by IP address by default, but this can be customized
      // See https://docs.arcjet.com/fingerprints
      //characteristics: ["ip.src"],
    }),

    // tokenBucket({
    //   mode: "LIVE",
    //   // Tracked by IP address by default, but this can be customized
    //   // See https://docs.arcjet.com/fingerprints
    //   //characteristics: ["ip.src"],
    //   refillRate: 5, // Refill 5 tokens per interval
    //   interval: 10, // Refill every 10 seconds
    //   capacity: 10, // Bucket capacity of 10 tokens
    // }),
  ],
});
