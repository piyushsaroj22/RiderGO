import { VehicleType } from "../modules/ride/ride.types.js";

interface CalculateFareInput {
  vehicleType: VehicleType;
  distance: number;
  duration: number;
}

export const calculateFare = ({
  vehicleType,
  distance,
  duration,
}: CalculateFareInput): number => {
  const baseFare = {
    Bike: 30,
    Auto: 50,
    Car: 80,
  };

  const perKmRate = {
    Bike: 10,
    Auto: 15,
    Car: 20,
  };

  const perMinuteRate = {
    Bike: 1,
    Auto: 2,
    Car: 3,
  };

  const fare =
    baseFare[vehicleType] +
    distance * perKmRate[vehicleType] +
    duration * perMinuteRate[vehicleType];

  return Math.round(fare);
};
