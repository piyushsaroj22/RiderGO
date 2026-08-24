# Business Settings

## Overview

The BusinessSettings module stores configurable values used by pricing, cancellation, and driver matching. The schema is timestamped and is used as a singleton-style document: startup creates one document when none exists, while the service reads the first document.

## Model and defaults

`businessSettings.model.ts` defines the following settings:

| Path                                               | Default | Constraint            |
| -------------------------------------------------- | ------: | --------------------- |
| `pricing.bike.baseFare`                            |    `30` | Number, minimum `0`   |
| `pricing.bike.perKm`                               |     `8` | Number, minimum `0`   |
| `pricing.bike.perMinute`                           |     `1` | Number, minimum `0`   |
| `pricing.auto.baseFare`                            |    `40` | Number, minimum `0`   |
| `pricing.auto.perKm`                               |    `12` | Number, minimum `0`   |
| `pricing.auto.perMinute`                           |     `2` | Number, minimum `0`   |
| `pricing.car.baseFare`                             |    `60` | Number, minimum `0`   |
| `pricing.car.perKm`                                |    `15` | Number, minimum `0`   |
| `pricing.car.perMinute`                            |     `3` | Number, minimum `0`   |
| `cancellation.userFee`                             |    `20` | Number, minimum `0`   |
| `cancellation.driverPenalty`                       |    `50` | Number, minimum `0`   |
| `cancellation.freeCancellationBeforeDriverAccepts` |  `true` | Boolean               |
| `driverMatching.searchRadius`                      |  `5000` | Number, minimum `100` |
| `peakHour.enabled`                                 | `false` | Boolean               |
| `peakHour.multiplier`                              |   `1.5` | Number, minimum `1`   |
| `trafficPricing.enabled`                           | `false` | Boolean               |
| `trafficPricing.multiplier`                        |   `1.2` | Number, minimum `1`   |

`createdAt` and `updatedAt` are supplied by Mongoose timestamps.

## Routes and authorization

The router is mounted at `/api/business-settings`:

| Method  | Endpoint                  | Middleware                  | Result                                                |
| ------- | ------------------------- | --------------------------- | ----------------------------------------------------- |
| `GET`   | `/api/business-settings/` | `protectRoute`, `adminOnly` | Returns the current settings document.                |
| `PATCH` | `/api/business-settings/` | `protectRoute`, `adminOnly` | Applies an update and returns the resulting settings. |

`adminOnly` checks the account type `Admin`. The routes do not use `requireSuperAdmin`; any authenticated Admin account accepted by that middleware can access these controls. Controllers delegate to `businessSettings.service.ts`.

## Initialization and update flow

`server.ts` calls `initializeBusinessSettings()` after MongoDB connects and before the HTTP server starts listening. Initialization creates the default document only when no settings document exists. `getOrCreateBusinessSettings()` also exists, but it is not used by the exposed service operations according to the current source.

The update service performs a nested merge with the existing settings, validates the complete resulting object, saves it, and returns the updated document with `Business settings updated successfully.`. The GET response is `{ success: true, data: settings }`.

## Validation and consumers

Explicit service validation returns `400` for negative pricing values, negative user fees, negative driver penalties, a search radius below 100 meters, or a peak/traffic multiplier below 1. Mongoose schema validation also applies during save. The generic error middleware handles unnormalized Mongoose failures as `500 Internal Server Error`.

Current consumers are:

- `pricing.service.ts`: vehicle pricing, peak-hour multiplier, and traffic multiplier.
- `driverMatching.service.ts`: `driverMatching.searchRadius`.
- `ride.service.ts`: cancellation free flag, User cancellation fee, and Driver penalty.

The settings module does not confirm persistence of historical pricing snapshots on rides; rides store the calculated fare at creation time.

## Cancellation controls

When `freeCancellationBeforeDriverAccepts` is enabled, a User can cancel a `SEARCHING` ride without a fee. After driver assignment, `userFee` is stored on the Ride and added to `User.pendingCancellationFee`. A Driver cancellation adds `driverPenalty` to `Driver.pendingPenalty` and stores it in the Ride's cancellation fee field. Collection or settlement of either pending balance is not confirmed.

## What is not implemented or confirmed

The code does not confirm multiple settings documents, versioned settings, an audit log, role-specific settings permissions, automatic peak-hour schedules, automatic traffic measurement, or settings change notifications. Peak and traffic controls are manual booleans and multipliers only.
