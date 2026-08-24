import { Socket } from "socket.io";
import DriverModel from "../modules/driver/driver.model.js";
import { SocketAccount } from "./socket.auth.js";
import RideModel from "../modules/ride/ride.model.js";
import { emitDriverLocation, emitDriverDisconnected } from "./socket.events.js";
import { DriverLocationPayload, DriverLocationEvent } from "./socket.types.js";

export const registerSocketHandlers = (
  socket: Socket,
  account: SocketAccount,
) => {
  if (account.accountType !== "Driver") {
    return;
  }

  socket.on("driver:online", async () => {
    await DriverModel.findByIdAndUpdate(account.accountId, {
      isOnline: true,
      isAvailable: true,
    });
  });

  socket.on("driver:offline", async () => {
    await DriverModel.findByIdAndUpdate(account.accountId, {
      isOnline: false,
      isAvailable: false,
    });
  });

  socket.on(
    "driver:location:update",
    async (payload: DriverLocationPayload) => {
      if (
        typeof payload.latitude !== "number" ||
        typeof payload.longitude !== "number"
      ) {
        return;
      }

      await DriverModel.findByIdAndUpdate(account.accountId, {
        currentLocation: {
          type: "Point",
          coordinates: [payload.longitude, payload.latitude],
          lastUpdated: new Date(),
        },
      });

      const ride = await RideModel.findOne({
        driver: account.accountId,
        status: {
          $in: [
            "DRIVER_ASSIGNED",
            "DRIVER_ARRIVED",
            "OTP_VERIFIED",
            "IN_PROGRESS",
          ],
        },
      });

      if (!ride) {
        return;
      }

      const event: DriverLocationEvent = {
        driverId: account.accountId,
        latitude: payload.latitude,
        longitude: payload.longitude,
      };

      emitDriverLocation(ride.rider.toString(), event);
    },
  );

  socket.on("disconnect", async () => {
    try {
      const activeRide = await RideModel.findOne({
        driver: account.accountId,
        status: {
          $in: [
            "DRIVER_ASSIGNED",
            "DRIVER_ARRIVED",
            "OTP_VERIFIED",
            "IN_PROGRESS",
          ],
        },
      });

      await DriverModel.findByIdAndUpdate(account.accountId, {
        isOnline: false,
        isAvailable: false,
      });

      if (!activeRide) {
        return;
      }

      emitDriverDisconnected(activeRide.rider.toString(), {
        rideId: activeRide._id.toString(),
      });
    } catch (error) {
      console.error("Driver disconnect handling failed:", error);
    }
  });
};
