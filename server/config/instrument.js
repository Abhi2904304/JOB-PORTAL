import * as Sentry from "@sentry/node";
import mongoose from "mongoose";

Sentry.init({
  dsn: "https://104675165b5a0b580eb80877fad67c69@o4510493242884096.ingest.us.sentry.io/4510493247799296",

  integrations: [
    Sentry.mongooseIntegration(mongoose),
  ],

  sendDefaultPii: true,
});
