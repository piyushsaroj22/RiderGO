// import { Server } from "socket.io";
// import DriverModel from "../modules/driver/driver.model.js";

// export const registerSocketHandlers = (io: Server) => {
//   io.on("connection", (socket) => {
//     console.log(`Socket Connected: ${socket.id}`);

//     socket.on("driver:online", async (driverId: string) => {
//       await DriverModel.findByIdAndUpdate(driverId, {
//         isOnline: true,
//       });

//       socket.data.driverId = driverId;

//       console.log(`Driver Online: ${driverId}`);
//     });

//     socket.on("disconnect", async () => {
//       if (socket.data.driverId) {
//         await DriverModel.findByIdAndUpdate(socket.data.driverId, {
//           isOnline: false,
//         });

//         console.log(`Driver Offline: ${socket.data.driverId}`);
//       }

//       console.log(`Socket Disconnected: ${socket.id}`);
//     });
//   });
// };
