import app from "./app.js";
import env from "./config/env.js";
import connectDatabase from "./config/database.js";
// import { startRideOfferTimeoutJob } from "./jobs/rideOfferTimeout.job.js";
import { cleanupExpiredVerificationUsers } from "./modules/emailVerification/emailVerification.cleanup.js";

const startServer = async () => {
  try {
    await connectDatabase();

    // startRideOfferTimeoutJob();

    app.listen(env.PORT, () => {
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
