// Import with `import * as Sentry from "@sentry/node"` if you are using ESM
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: "https://8144e796606cb52be65ab5138d289ae0@o4510441333587968.ingest.us.sentry.io/4510441343746048",
  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,

   integrations: [
    Sentry.mongooseIntegration(),   
  ],
});