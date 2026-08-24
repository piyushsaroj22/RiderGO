# Review Module

## Model and relationships

`review.model.ts` defines a timestamped Review with polymorphic reviewer/reviewee references:

| Field                       | Definition                                           |
| --------------------------- | ---------------------------------------------------- |
| `ride`                      | Required Ride reference.                             |
| `reviewer` / `reviewerType` | Required User or Driver reference and discriminator. |
| `reviewee` / `revieweeType` | Required User or Driver reference and discriminator. |
| `rating`                    | Required number constrained from `1` to `5`.         |
| `comment`                   | Trimmed string, maximum `500` characters.            |
| `isDeleted`                 | Soft-delete flag, default `false`.                   |
| `deletedAt`                 | Soft-delete timestamp.                               |
| `deletedBy`                 | Optional Admin reference.                            |
| timestamps                  | Mongoose timestamps.                                 |

A unique `(ride, reviewer)` index prevents duplicate database records by the same account for a Ride. A reviewee/date index supports review listing.

## Routes

Mounted at `/api/reviews`:

| Method | Endpoint                                | Access         | Behavior                                |
| ------ | --------------------------------------- | -------------- | --------------------------------------- |
| `POST` | `/api/reviews/`                         | User or Driver | Creates a review for a completed Ride.  |
| `GET`  | `/api/reviews/driver/:driverId`         | Public         | Lists non-deleted reviews for a Driver. |
| `GET`  | `/api/reviews/driver/:driverId/summary` | Public         | Returns Driver rating aggregate.        |
| `GET`  | `/api/reviews/user/:userId`             | Protected      | Lists non-deleted reviews for a User.   |
| `GET`  | `/api/reviews/user/:userId/summary`     | Protected      | Returns User rating aggregate.          |

Admin review listing, detail, and deletion routes are under `/api/admin` and require Admin authorization.

## Who can review whom

Only completed Rides may be reviewed. A User can review the Driver assigned to that Ride, and a Driver can review the User who owns the Ride. The service checks that the requester is the relevant participant and selects the opposite participant as the reviewee. Wrong-participant requests return `403` with `You are not allowed to review this ride.`

The review creation flow requires a valid Ride, `COMPLETED` status, and an existing review recipient. Missing Ride returns `404`; a non-completed Ride returns `400`; missing recipient returns `404`.

## Validation and duplicate prevention

Ratings must be between 1 and 5; invalid values return `400` with `Rating must be between 1 and 5.`. The schema also constrains the rating. An active existing review for the same Ride and reviewer returns `409` with `You have already reviewed this ride.`.

The service's duplicate lookup ignores reviews where `isDeleted` is true, but the database unique index still covers `(ride, reviewer)` without that flag. Reinsertion after soft deletion may therefore still encounter a database uniqueness conflict; the exact normalized response for that conflict is not confirmed.

## Rating aggregates

After creation and after Admin soft deletion, `recalculateRatings()` aggregates non-deleted reviews, computes the average rounded to one decimal place, and updates the reviewed User or Driver's `averageRating` and `totalRatings`.

Public Driver reviews and protected User reviews return reviewer identity/type, name, profile image, rating, comment, and creation time. Summary responses contain `averageRating` and `totalRatings`. Lists omit deleted reviews and sort newest first.

## Admin moderation

Admins can list reviews with pagination, search, rating, reviewee type, and sort order, view one review, and soft-delete one review. Deletion sets `isDeleted`, `deletedAt`, and `deletedBy`, then recalculates aggregates. Invalid IDs return `400`; missing reviews return `404`; already deleted reviews return `400`.

No edit-review route, moderation reason, hard deletion, notification, or review audit event beyond `deletedBy` is confirmed.
