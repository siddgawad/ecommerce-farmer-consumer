// NodeNext/ESM build: keep .js extensions on local imports
import env from "./config/env.js";
import app from "./app.js";
import { connectDB } from "./db/mongoose.js";
import { logger } from "./config/logger.js";

(async () => {
  try {
    await connectDB();

    const server = app.listen(env.PORT, () => {
      logger.info(`API listening on :${env.PORT}`);
    });

    const shutdown = (sig: string) => {
      logger.info(`Received ${sig}. Shutting down.`);
      server.close(() => process.exit(0));
      // Force exit if something hangs
      setTimeout(() => process.exit(1), 5000).unref();
    };

    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));
  } catch (err: any) {
    logger.error(`Fatal boot error: ${err?.message || err}`);
    process.exit(1);
  }
})();
