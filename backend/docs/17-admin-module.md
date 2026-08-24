# Admin Module

## Responsibility and model

The Admin module manages Admin authentication, Driver verification/blocking, User blocking, review moderation, appeals, and business settings. `admin.model.ts` defines a timestamped Admin document:

| Field       | Definition                                     |
| ----------- | ---------------------------------------------- |
| `fullName`  | Required, trimmed string with length `3..100`. |
| `email`     | Required, unique, lowercase, trimmed string.   |
| `password`  | Required and `select: false` by default.       |
| `role`      | `SUPER_ADMIN` or `ADMIN`, default `ADMIN`.     |
| `isActive`  | Boolean, default `true`.                       |
| `lastLogin` | Date or `null`.                                |
| timestamps  | Mongoose timestamps.                           |

## Authentication and authorization

Public routes are `POST /api/admin/register` and `POST /api/admin/login`. Registration requires `fullName`, `email`, and `password`; missing fields return `400`, an existing Admin prevents further registration with `409`, and duplicate email returns `409`. The first Admin is assigned `SUPER_ADMIN`, its password is bcrypt-hashed with cost 10, and a JWT is set in the shared `token` cookie.

Login returns `400` for missing credentials, `401` for invalid credentials, and `403` for an inactive account. It explicitly selects the hidden password, updates `lastLogin`, signs an Admin JWT, and sets the cookie.

Protected Admin routes use `protectRoute` plus `authorize(["Admin"])`. `requireSuperAdmin` exists but is not used by current routes, so no mounted endpoint is confirmed as super-admin-only. The route middleware also does not visibly recheck `isActive` after login.

## Routes

| Method   | Endpoint                                    | Current operation                      |
| -------- | ------------------------------------------- | -------------------------------------- |
| `POST`   | `/api/admin/register`                       | First-admin registration.              |
| `POST`   | `/api/admin/login`                          | Admin login.                           |
| `POST`   | `/api/admin/logout`                         | Clear auth cookie.                     |
| `GET`    | `/api/admin/me`                             | Current Admin.                         |
| `GET`    | `/api/admin/drivers`                        | Paginated Driver listing.              |
| `GET`    | `/api/admin/drivers/pending`                | Pending Driver listing.                |
| `GET`    | `/api/admin/drivers/:driverId`              | Driver details.                        |
| `PATCH`  | `/api/admin/drivers/:driverId/verification` | Approve or reject Driver verification. |
| `PATCH`  | `/api/admin/drivers/:driverId/block`        | Block a Driver.                        |
| `PATCH`  | `/api/admin/drivers/:driverId/unblock`      | Unblock a Driver.                      |
| `GET`    | `/api/admin/users`                          | Paginated User listing.                |
| `PATCH`  | `/api/admin/users/:userId/block`            | Block a User.                          |
| `PATCH`  | `/api/admin/users/:userId/unblock`          | Unblock a User.                        |
| `GET`    | `/api/admin/reviews`                        | Review listing.                        |
| `GET`    | `/api/admin/reviews/:reviewId`              | Review detail.                         |
| `DELETE` | `/api/admin/reviews/:reviewId`              | Soft-delete a review.                  |
| `GET`    | `/api/appeals/admin`                        | Appeal listing.                        |
| `PATCH`  | `/api/appeals/admin/:appealId`              | Review an appeal.                      |
| `GET`    | `/api/business-settings/`                   | Read settings.                         |
| `PATCH`  | `/api/business-settings/`                   | Update settings.                       |

## Driver management

Pending Drivers are selected with `verificationStatus: "PENDING"`, oldest first. Verification can approve or reject a Driver. Approval records `approvedAt` and `verifiedBy` and clears rejection reason. Rejection requires a nonblank reason, stores it, and clears approval metadata. Repeating the current status returns `400`.

Driver blocking requires a nonblank reason of at least 10 characters, stores reason/time/Admin reference, and rejects repeated state changes. Unblocking clears the block metadata. Invalid IDs return `400`; missing Drivers return `404`.

## User management

User listing supports pagination, search by name/email, blocked status, sort field, and sort order. User block/unblock uses the same reason and minimum-length rules as Driver blocking and stores or clears block metadata. Admin code does not confirm notification email, ride cancellation, JWT invalidation, or financial settlement as side effects.

## Settings, reviews, appeals, and analytics

Admins can update BusinessSettings, including pricing, cancellation, matching radius, and manual peak/traffic multipliers. Review moderation is soft deletion with rating recalculation. Appeal review can approve/unblock or reject a Driver appeal. No analytics or dashboard aggregation implementation is confirmed. No Admin ride-management route for direct ride operations is confirmed.

## Error handling

Known admin validation and authorization errors use `{ success: false, message }`: missing fields and invalid IDs are `400`, duplicate/second registration is `409`, invalid credentials are `401`, inactive login is `403`, and protected non-admin requests are rejected by authorization. Exact output for raw Mongoose failures is not normalized beyond the shared generic error path.
