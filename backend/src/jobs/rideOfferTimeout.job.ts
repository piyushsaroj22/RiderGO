// import env from "../config/env.js";
// import RideOfferModel from "../modules/rideOffer/rideOffer.model.js";
// import { dispatchNextDriver } from "../services/dispatch.service.js";
// import {
//   expireRideOffer,
//   claimExpiredRideOffer,
// } from "../modules/rideOffer/rideOffer.service.js";

// export const processExpiredRideOffers = async () => {
//   while (true) {
//     const expiredOffer = await claimExpiredRideOffer();

//     if (!expiredOffer) {
//       break;
//     }

//     await dispatchNextDriver(expiredOffer.ride.toString());
//   }
// };

// export const startRideOfferTimeoutJob = () => {
//   setInterval(async () => {
//     try {
//       await processExpiredRideOffers();
//     } catch (error) {
//       console.error("Ride offer timeout job failed:", error);
//     }
//   }, Number(env.RIDE_OFFER_JOB_INTERVAL)); // Run every RIDE_OFFER_JOB_INTERVAL milliseconds
// };

// bad me chalu kar dunga
