# Error Handling

## Core utilities

`AppError` carries a `message`, numeric `statusCode`, and `success: false`. Services and middleware throw or forward it for known failures. `asyncHandler` wraps asynchronous controllers and forwards rejected promises to Express's `next` function.

`notFound.middleware.ts` handles requests that match no mounted route and returns HTTP `404` with `{ success: false, message: "Route not found" }`.

`error.middleware.ts` logs the error and returns known AppError status/message values. Unknown errors are normalized to HTTP `500` and `{ success: false, message: "Internal Server Error" }`.

## Response shape and status conventions

Known errors use:

```json
{
  "success": false,
  "message": "..."
}
```

Common statuses used by the current services are:

| Status | Current examples                                                                                       |
| -----: | ------------------------------------------------------------------------------------------------------ |
|  `400` | Missing/rejected input, invalid OTP, coordinates, ObjectId, signature, or state transition.            |
|  `401` | Missing authentication, invalid account type, or invalid credentials.                                  |
|  `403` | Wrong account type, blocked account, resource authorization failure, or inactive Admin login.          |
|  `404` | Missing account, Ride, Payment, Review, Driver, or Appeal.                                             |
|  `409` | Duplicate email, duplicate active review, existing appeal, unavailable offer, or competing assignment. |
|  `500` | Unexpected errors, missing settings, and uncategorized provider/database failures.                     |

Successful responses conventionally contain `success: true`, with a message and/or `data` object shaped by the controller/service.

## Known limitations

Mongoose cast, validation, duplicate-key, Multer, Cloudinary, SMTP, and many third-party failures are not generally mapped to dedicated AppError responses. They can therefore reach the generic `500` response. Webhook controller failures are a special case: they are logged and returned as `400 Webhook processing failed.`.

Invalid or expired JWT exceptions from `verifyToken` are not wrapped by `protectRoute`, so they can reach the generic `500` path rather than a normalized `401`. Some asynchronous middleware throws directly; exact behavior depends on the surrounding Express execution path.

Error messages can include stored block or rejection reasons. Development-versus-production error detail switching is not implemented or confirmed; the visible generic handler uses the same generic message for unknown errors.
