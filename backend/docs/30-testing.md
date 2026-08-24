# Testing Status

## Current automated testing state

The backend package has no configured test framework and no backend test files confirmed. Its `npm test` script is:

```text
echo "Error: no test specified" && exit 1
```

There is no confirmed Jest, Vitest, Mocha, Chai, Supertest, Newman, Postman collection, fixture set, mock provider, test database, or emulator configuration. Automated test coverage is therefore not implemented.

## Build verification

The available verification command is:

```bash
npm run build
```

It runs `tsc` against the backend source and emits `dist`. The repository does not define a test command that runs after compilation. Static workspace diagnostics have reported no backend errors during documentation inspection; a successful diagnostic result is not a substitute for runtime integration testing.

## Manual API testing

Manual testing is possible with a REST client, browser requests, or `curl` after MongoDB and all startup-validated integrations are configured. A minimal public check is:

```text
GET /health
```

Authenticated HTTP tests must preserve the `token` cookie set by login or email verification. Profile and Driver document tests require multipart requests. Ride tests require configured Google Routes and BusinessSettings. The exact request fields and route list are in [28-api-reference.md](./28-api-reference.md).

## Areas requiring manual or future tests

| Area                  | Current status                                                                                                                                                                     |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Authentication        | No automated tests. Manually test registration, email verification, login/logout, `/me`, invalid credentials, and unverified access.                                               |
| Authorization         | No automated tests. Test User/Driver/Admin route boundaries, blocked accounts, ownership, and inactive Admin login.                                                                |
| Rides                 | No automated tests. A full flow needs User and Driver accounts, email verification, Admin approval, matching, OTP, lifecycle, payment, and cancellation.                           |
| Payments              | No automated tests. Requires completed rides, Razorpay credentials, order creation, signature verification, duplicate attempts, and failure paths.                                 |
| Webhooks              | No automated tests. Generate a valid HMAC over the exact raw JSON body and test supported/unsupported events, duplicate event IDs, malformed payloads, and missing local payments. |
| Socket.IO             | No automated tests. Use User/Driver clients to test handshake tokens, rooms, Driver presence, location forwarding, ride events, disconnect, and multiple connections.              |
| Uploads               | No automated tests. Test all image fields, missing files, non-image MIME types, 5 MB limit, replacement, and Cloudinary failures.                                                  |
| Reviews/appeals/admin | No automated tests. Test status/ownership rules, duplicate reviews, soft deletion, blocked-driver appeals, and Admin decisions.                                                    |

## Frontend integration testing

The three frontend applications are Vite applications, but no confirmed backend HTTP or Socket.IO integration is present in the inspected source. End-to-end testing that depends on rider, Driver, or Admin UI workflows therefore remains frontend-dependent and is not complete.

## Reliability and regression testing

No regression suite, CI test workflow, load test, concurrency test, or production smoke-test script is confirmed. Important manual concurrency checks include competing offer acceptance, simultaneous dispatch advancement, cancellation versus assignment, duplicate payment creation, duplicate webhook delivery, and socket replacement/disconnect behavior.

The current code has known untested boundaries: disabled normal-startup ride-offer expiration, non-transactional assignment/cancellation/appeal workflows, provider failure handling, and invalid identifier paths.

## Summary

Build/type compilation is the available automated-style check. Runtime API, payment, webhook, socket, and full ride-flow verification require configured external services and manual or future automated tests. No automated tests should be inferred from the presence of compiled output or source modules.
