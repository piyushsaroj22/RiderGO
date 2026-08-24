# Ride Offer Timeout

## Configuration and current status

Ride-offer expiration is implemented by `jobs/rideOfferTimeout.job.ts`, but `server.ts` comments out `startRideOfferTimeoutJob()`. Therefore the timeout job is not started by normal development or production startup.

The job interval is read from `env.RIDE_OFFER_JOB_INTERVAL` and converted with `Number()`. `RIDE_OFFER_TIMEOUT` is required by `env.ts`, but the offer service currently uses a hard-coded ten-second offer duration rather than that variable.

## Offer records

`RideOffer` contains `ride`, `driver`, `status`, `offeredAt`, `respondedAt`, and `expiresAt`. Status is one of `PENDING`, `ACCEPTED`, `REJECTED`, or `EXPIRED`. A unique `(ride, driver)` index prevents another offer for the same Driver/Ride pair, even after an earlier offer is rejected or expired.

Offer creation sets `PENDING`, records the current offer time, and sets `expiresAt` ten seconds later. Dispatch offers one queued Driver at a time.

## Expiration algorithm

`claimExpiredRideOffer()` atomically finds one record matching:

```text
status = PENDING
expiresAt <= now
```

It changes the record to `EXPIRED` and sets `respondedAt`. `processExpiredRideOffers()` repeats this claim until no expired pending offer remains. For each claimed offer it calls `dispatchNextDriver(rideId)`.

`dispatchNextDriver` acquires a conditional per-ride lock requiring `SEARCHING`, incomplete dispatch, and `isDispatchInProgress: false`. It sets the lock, advances the queue index, marks `NO_DRIVER_FOUND` when the queue is exhausted, or creates/emits the next Driver offer. The lock is cleared in `finally`.

## Failure handling

The interval catches processing errors and logs `Ride offer timeout job failed:`. An individual failure can interrupt the current processing loop until a later interval; retry policy beyond the interval is not confirmed.

Offer status changes, ride dispatch updates, Driver availability, and next-offer creation are separate database operations. The complete expiration-to-dispatch workflow is not transactionally atomic.

## Startup and environment variables

| Variable                  | Current use                                                         |
| ------------------------- | ------------------------------------------------------------------- |
| `RIDE_OFFER_TIMEOUT`      | Required and exported by `env.ts`; no active consumer is confirmed. |
| `RIDE_OFFER_JOB_INTERVAL` | Polling interval for the timeout job, converted to a number.        |

The timeout job is process-local and has no queue or distributed scheduler. Accept/reject operations also do not check `expiresAt` directly; an offer can remain actionable while still `PENDING` if expiration processing is disabled or has not reached it.
