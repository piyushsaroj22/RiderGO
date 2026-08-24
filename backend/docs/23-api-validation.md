# API Validation

## Validation architecture

Validation is distributed across controllers, services, Multer, and Mongoose schemas. There is no centralized request-validation middleware or library such as Zod in the current source. TypeScript interfaces describe compile-time shapes only and do not validate runtime input.

Express globally parses JSON and URL-encoded bodies. The payment webhook is deliberately parsed as a raw Buffer before the normal JSON parser.

## Request validation summary

| Area              | Implemented checks                                                                                                                                               |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| User auth         | Required name/email/password fields; duplicate email; bcrypt password handling. No email format, password-strength, or registration name-length service check.   |
| Driver auth       | Required name/email/password/phone/vehicleType; duplicate email; model enum for vehicle type. No explicit email/phone/password-strength registration validation. |
| Admin auth        | Required fields; model checks full name length `3..100`, lowercase unique email, and role enum. First-admin rule.                                                |
| User profile      | Nonblank name and maximum 100 characters; trimmed before save.                                                                                                   |
| Driver profile    | Nonblank name/phone and maximum 100-character name.                                                                                                              |
| Driver location   | HTTP latitude `-90..90`, longitude `-180..180`; socket handler checks only JavaScript number type.                                                               |
| Ride creation     | Requires pickup, destination, vehicleType, paymentMethod; downstream model enums and nonnegative numeric constraints.                                            |
| Ride state        | Ownership, assigned driver, expected status, and completed status checks.                                                                                        |
| Reviews           | Integer-like rating `1..5`, completed Ride, participant ownership, recipient existence, duplicate active review.                                                 |
| Appeals           | Blocked Driver, reason minimum 10 characters, pending-appeal duplicate, valid appeal ID, response minimum 10 characters.                                         |
| Business settings | Nonnegative prices/fees, search radius at least 100, multipliers at least 1, plus schema constraints.                                                            |
| Payments          | Ownership, completed Ride, supported method/business state, and HMAC signature checks. Presence/type format checks are not comprehensive.                        |
| Files             | Image MIME prefix and 5 MB limit through Multer; expected field names are enforced by `upload.single()`.                                                         |
| Webhooks          | Raw Buffer, signature, event ID, JSON payload identifiers, and supported event handling.                                                                         |

## Parameters and identifiers

Some Admin Driver/User IDs, Appeal IDs, and Admin Review IDs use `Types.ObjectId.isValid()`. Many Ride IDs, Payment IDs, public review target IDs, and verification lookups rely on Mongoose casting or query results. Invalid values in those paths can become uncategorized errors and reach `500`.

Pagination values are converted with `Number()` but are not comprehensively checked for finite, positive, or maximum values. Search values are interpolated into MongoDB regular expressions without confirmed escaping.

## File validation

Multer uses memory storage, accepts MIME types beginning with `image/`, and limits uploads to 5 MB. Profile, license, RC, vehicle, and user profile routes supply expected single-file field names. The code does not inspect magic bytes, decode image contents, validate dimensions, or normalize all Multer/provider failures.

## Business and payment validation

Ride business validation checks status, ownership, assignment, OTP, and payment state in services. Payment creation requires a User owner, a non-Cash method, and a completed Ride; verification additionally checks the Razorpay order/signature relationship. The code does not confirm a centralized body schema, exhaustive numeric validation, pickup/destination equality checks, or a separate payment input validator.

## Limitations

The current implementation does not confirm request-size policy beyond uploads, rate limiting, schema validation error formatting, consistent missing/type checks before `.trim()` or `Number()`, or an application-wide validation error contract.
