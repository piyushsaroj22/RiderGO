# User Module

## Responsibility

The User module manages the User document and authenticated profile operations. It is mounted at `/api/users`. User registration, login, email verification, and `/api/auth/me` are implemented by the auth module but use the User model.

## User model

The Mongoose model is defined in `user.model.ts` and uses timestamps. Its fields are:

| Field                    | Definition/meaning                                                          |
| ------------------------ | --------------------------------------------------------------------------- |
| `name`                   | Required string, trimmed.                                                   |
| `email`                  | Required, unique, trimmed string. Lowercasing is not enabled in the schema. |
| `password`               | Required string containing the stored password hash after registration.     |
| `profileImage`           | Image URL, default empty string.                                            |
| `profileImagePublicId`   | Cloudinary public ID for replacement/deletion, default empty string.        |
| `isEmailVerified`        | Boolean, default `false`.                                                   |
| `isBlocked`              | Boolean, default `false`.                                                   |
| `blockReason`            | Trimmed string, default empty, maximum 500 characters.                      |
| `blockedAt`              | Date or `null`.                                                             |
| `blockedBy`              | Admin ObjectId reference or `null`.                                         |
| `pendingCancellationFee` | Number, default `0`, minimum `0`.                                           |
| `averageRating`          | Number, default `0`, range `0` to `5`.                                      |
| `totalRatings`           | Number, default `0`, minimum `0`.                                           |
| `createdAt`, `updatedAt` | Mongoose timestamps.                                                        |

## Routes

The router is mounted by `app.ts` at `/api/users`.

| Method  | Endpoint                   | Middleware                                                            | Behavior                                  |
| ------- | -------------------------- | --------------------------------------------------------------------- | ----------------------------------------- |
| `GET`   | `/api/users/profile`       | `protectRoute`, `ensureUserIsActive`                                  | Returns the authenticated user's profile. |
| `PATCH` | `/api/users/profile`       | `protectRoute`, `ensureUserIsActive`                                  | Updates the user's name.                  |
| `PATCH` | `/api/users/profile-image` | `protectRoute`, `ensureUserIsActive`, `upload.single("profileImage")` | Replaces the user's profile image.        |

The user controller wraps each operation with `asyncHandler`, obtains `req.account`, and delegates to the user service. Each successful operation returns HTTP `200` and JSON containing `success: true`; profile data includes `id`, `name`, `email`, `profileImage`, and `isEmailVerified`.

## Profile operations

`getUserProfile` returns the authenticated User document in a limited response shape. It does not return the password, block metadata, cancellation fee, or rating aggregates.

`updateUserProfile` accepts `{ name }`. A missing or whitespace-only name returns `400`. Names longer than 100 characters after trimming return `400`. The saved value is trimmed. The success response returns the updated profile shape and the message `Profile updated successfully`.

The service does not update email, password, verification state, block state, ratings, or cancellation-fee fields through this route. Such operations are not confirmed as User profile functionality.

## Profile image handling

The upload route expects a multipart file in the `profileImage` field. Multer is configured with memory storage, accepts only MIME types beginning with `image/`, and limits each file to 5 MB. A missing file returns `400` with `Profile image is required`; non-image files are rejected by the upload middleware.

`uploadProfileImage` deletes the existing Cloudinary asset when `profileImagePublicId` is present, uploads the new in-memory buffer to the `ridergo/profile-images` folder with `resource_type: "image"`, stores the returned secure URL and public ID, and saves the User document. Upload and deletion errors are delegated to the generic error path rather than converted into a User-specific error response.

## Middleware and validation

`protectRoute` authenticates the cookie and loads the account. The User router then calls `ensureUserIsActive`, which checks `req.accountType === "User"` and rejects a blocked User with `403`, using the stored block reason when available. The profile service performs the name validation described above. There is no schema-level email-format validator or dedicated request-validation library confirmed for these routes.

## Relationships and related functionality

The User model's `blockedBy` field references `Admin`. The User model also stores rating aggregates and a pending cancellation fee. Rides, payments, and reviews reference or operate on users in their own modules; no User-module route directly lists those resources. The current source confirms User-specific ride history/cancellation, payment operations, and review operations elsewhere, but their complete endpoint and business rules belong to those modules.

User registration is handled by `auth.service.ts`: it hashes the password with bcrypt, creates the User with email unverified, and starts email verification. `/api/auth/me` uses the same authenticated User document and returns the same core identity/profile fields. The auth service's current-user response includes `profileImage`.

## Response and error behavior

Known service validation failures use `AppError` and are shaped by the shared error middleware as `{ success: false, message }`. Confirmed User-module failures include:

| Condition                                    | Status |
| -------------------------------------------- | -----: |
| Missing auth cookie                          |  `401` |
| User account not found during authentication |  `404` |
| Blocked User on these routes                 |  `403` |
| Missing/blank name                           |  `400` |
| Name over 100 characters                     |  `400` |
| Missing profile image                        |  `400` |
| Non-image upload                             |  `400` |

Invalid or expired JWT errors are not normalized by `protectRoute` and can reach the generic `500` path. Exact status/output for raw Mongoose, Multer, or Cloudinary failures is not confirmed beyond the explicit cases above.

## Business rules

- User email must be verified before User login succeeds.
- Passwords are stored as bcrypt hashes, not the submitted password.
- Profile names are trimmed and limited to 100 characters by the update service.
- Profile image replacement removes the prior Cloudinary asset before uploading the replacement.
- Blocked status is enforced on the three User profile routes through `ensureUserIsActive`.
- The User model's rating and cancellation fields exist, but this module does not expose direct profile update operations for them.

The full API reference document is planned for a later batch and is not linked here because its current placeholder is not complete.
