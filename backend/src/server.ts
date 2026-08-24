import app from "./app.js";
import env from "./config/env.js";
import { createServer } from "http";
import connectDatabase from "./config/database.js";
import { initializeSocket } from "./sockets/socket.js";
import { startRideOfferTimeoutJob } from "./jobs/rideOfferTimeout.job.js";
import { cleanupExpiredVerificationUsers } from "./modules/emailVerification/emailVerification.cleanup.js";
import { initializeBusinessSettings } from "./modules/businessSettings/businessSettings.initialize.js";

const startServer = async () => {
  try {
    await connectDatabase();
    await initializeBusinessSettings();

    startRideOfferTimeoutJob(); // Start the ride offer timeout job temp remove TODO

    const httpServer = createServer(app);

    initializeSocket(httpServer);

    httpServer.listen(env.PORT, () => {
      console.log(`🚀 Server running on http://localhost:${env.PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server");
    console.error(error);

    process.exit(1);
  }
};

startServer();

setInterval(
  async () => {
    try {
      await cleanupExpiredVerificationUsers();
    } catch (error) {
      console.error("Verification cleanup failed:", error);
    }
  },
  2 * 60 * 1000,
); // Run every 2 minutes
