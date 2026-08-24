# Security

## Implemented controls

| Control          | Current implementation                                                                                       |
| ---------------- | ------------------------------------------------------------------------------------------------------------ |
| Helmet           | Registered globally in `app.ts`.                                                                             |
| CORS             | Express and Socket.IO use `CLIENT_URL` with credentials enabled.                                             |
| Cookies          | Auth cookie is HTTP-only, strict same-site, secure in production, and expires after seven days.              |
| JWT              | Signed and verified with `JWT_SECRET`; payload carries account ID and account type.                          |
| Passwords        | User, Driver, and Admin registration hashes passwords with bcrypt cost `10`; login compares hashes.          |
| Authorization    | `protectRoute`, `authorize`, `adminOnly`, and active-account middleware enforce selected route restrictions. |
| Webhooks         | Raw-body HMAC-SHA256 verification with `RAZORPAY_WEBHOOK_SECRET` and timing-safe comparison.                 |
| Uploads          | Image MIME prefix check and 5 MB Multer limit.                                                               |
| Database secrets | Credentials and provider secrets are loaded from environment variables.                                      |

## Authentication and authorization

`protectRoute` reads the `token` cookie, verifies it, loads the account by the JWT's `User`, `Driver`, or `Admin` type, and attaches it to the request. Services also perform ownership checks for rides, payments, reviews, and appeals. Admin settings and management routes require Admin account type. `requireSuperAdmin` exists but is not used by mounted routes.

Blocking or deactivating an account does not revoke existing JWTs. Active-account checks are selective, and Admin `isActive` is checked at login rather than by general authorization middleware on every request.

## Webhook and file security

Razorpay webhooks are mounted before JSON parsing and require a raw Buffer, `x-razorpay-signature`, and event ID. The HMAC uses the webhook secret and timing-safe comparison. Payment/Ride updates and event-ledger insertion are not transactional.

Uploads are buffered in memory and sent to Cloudinary. The implementation does not verify file signatures, decode image data, enforce dimensions, sanitize metadata, or impose a broader upload request policy.

## Input and operational limitations

No explicit rate limiting, brute-force protection, CSRF token mechanism, password reset, email-change verification, JWT denylist, or session invalidation is confirmed. Search strings are used in MongoDB regular expressions without confirmed escaping. Socket location updates do not validate coordinate range, finite values, freshness, or rate.

Verification links and email HTML interpolate name/link values without confirmed HTML escaping. Socket connected-account state is process-local, and multi-instance coordination is not implemented.

The code does not confirm environment-specific error detail behavior; unknown errors are logged and returned as a generic 500 message. Sensitive variables include MongoDB, JWT, SMTP password, Cloudinary key/secret, Google API key, and Razorpay credentials/secrets.
