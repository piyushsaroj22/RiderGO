# Dynamic Pricing

## Implementation

Fare calculation is implemented in `services/pricing.service.ts` as `calculateFare({ vehicleType, distance, duration })`. The service loads the first BusinessSettings document and selects the section for the requested vehicle type:

| Ride vehicle type | Settings section |
| ----------------- | ---------------- |
| `Bike`            | `pricing.bike`   |
| `Auto`            | `pricing.auto`   |
| `Car`             | `pricing.car`    |

## Formula

The base fare is calculated as:

```text
baseFare + (distance * perKm) + (duration * perMinute)
```

Ride creation obtains distance and duration from the Google Routes service, storing distance in kilometers and duration in minutes before passing them to the pricing service.

The service then applies the configured multipliers:

```text
fare = baseFare + distance * perKm + duration * perMinute

if peakHour.enabled:
	fare = fare * peakHour.multiplier

if trafficPricing.enabled:
	fare = fare * trafficPricing.multiplier

finalFare = Math.round(fare)
```

The returned fare is the rounded number and is stored on the Ride.

## Current defaults

| Vehicle | Base | Per kilometer | Per minute |
| ------- | ---: | ------------: | ---------: |
| `Bike`  | `30` |           `8` |        `1` |
| `Auto`  | `40` |          `12` |        `2` |
| `Car`   | `60` |          `15` |        `3` |

Peak pricing defaults to disabled with multiplier `1.5`; traffic pricing defaults to disabled with multiplier `1.2`. These values are BusinessSettings defaults, not necessarily the values at runtime after an admin update.

## Directly derived examples

With the default Bike values, a route of 10 kilometers and 5 minutes produces:

```text
30 + (10 * 8) + (5 * 1) = 115
```

If peak pricing were enabled at its default multiplier, the result before rounding would be `172.5`, and `Math.round` would return `173`. Traffic pricing is applied similarly; if both switches are enabled, both multipliers are applied in sequence. These examples use only the formula and defaults in the source.

## Settings integration and errors

The service reads the first BusinessSettings document. If none exists, it throws `Business settings not configured.` as a normal Error. The generic error middleware therefore returns the generic `500 Internal Server Error` path. Server startup normally creates the initial settings document before accepting requests.

Admins can read and update settings through `/api/business-settings/`. The update service rejects negative pricing/fees, a search radius below 100 meters, or multipliers below 1.

## Not implemented or confirmed

No time-of-day peak schedule, traffic API input, dynamic demand calculation, tax, platform fee, minimum fare, discount, surge cap, currency conversion, or pricing history is implemented or confirmed. The current “dynamic” behavior consists only of manually enabled peak and traffic multipliers over the vehicle-specific base formula.
