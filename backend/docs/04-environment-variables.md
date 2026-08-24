# Environment Variables

`src/config/env.ts` loads dotenv values and throws when any listed variable is missing. Therefore every variable below is required by the current startup validation, even where a consumer is inactive or only used in a particular workflow. Values are intentionally not shown.

## Server

| Name       | Required | Format/type                                  | Purpose and usage                                                                          | Sensitive |
| ---------- | -------- | -------------------------------------------- | ------------------------------------------------------------------------------------------ | --------- |
| `PORT`     | Yes      | Port value; retained as a string by `env.ts` | HTTP server listen port in `src/server.ts`.                                                | No        |
| `NODE_ENV` | Yes      | Environment name string                      | Controls production cookie security in `src/utils/cookie.ts`; also exported from `env.ts`. | No        |

## Database

| Name        | Required | Format/type            | Purpose and usage                                         | Sensitive |
| ----------- | -------- | ---------------------- | --------------------------------------------------------- | --------- |
| `MONGO_URI` | Yes      | MongoDB connection URI | Passed to `mongoose.connect` in `src/config/database.ts`. | Yes       |

## Authentication

| Name             | Required | Format/type                                           | Purpose and usage                                             | Sensitive                     |
| ---------------- | -------- | ----------------------------------------------------- | ------------------------------------------------------------- | ----------------------------- |
| `JWT_SECRET`     | Yes      | Secret string                                         | Signs and verifies JWTs in `src/utils/jwt.ts`.                | Yes                           |
| `JWT_EXPIRES_IN` | Yes      | JWT expiration expression accepted by the JWT library | Sets token expiry when JWTs are signed in `src/utils/jwt.ts`. | No, but protect configuration |

## Email

| Name        | Required | Format/type                                                                | Purpose and usage                                                                                | Sensitive                      |
| ----------- | -------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ | ------------------------------ |
| `SMTP_HOST` | Yes      | SMTP hostname                                                              | Nodemailer transport host in `src/config/mail.ts`.                                               | No                             |
| `SMTP_PORT` | Yes      | Numeric string; converted with `Number()`                                  | Nodemailer transport port in `src/config/mail.ts`.                                               | No                             |
| `SMTP_USER` | Yes      | SMTP username                                                              | Nodemailer authentication in `src/config/mail.ts`.                                               | Often sensitive                |
| `SMTP_PASS` | Yes      | SMTP password                                                              | Nodemailer authentication in `src/config/mail.ts`.                                               | Yes                            |
| `SMTP_FROM` | Yes      | Mail sender value; `.env.example` demonstrates a display-name/address form | Sender passed to Nodemailer by `src/services/mail.service.ts`.                                   | No, but may contain an address |
| `APP_URL`   | Yes      | Application base URL                                                       | Builds email-verification links in `src/modules/emailVerification/emailVerification.service.ts`. | No                             |

## Client and CORS

| Name         | Required | Format/type       | Purpose and usage                                                                                                                | Sensitive |
| ------------ | -------- | ----------------- | -------------------------------------------------------------------------------------------------------------------------------- | --------- |
| `CLIENT_URL` | Yes      | Client origin URL | Express CORS configuration in `src/app.ts` and Socket.IO CORS configuration in `src/sockets/socket.ts`. Credentials are enabled. | No        |

## Cloudinary

| Name                    | Required | Format/type           | Purpose and usage                                              | Sensitive |
| ----------------------- | -------- | --------------------- | -------------------------------------------------------------- | --------- |
| `CLOUDINARY_CLOUD_NAME` | Yes      | Cloudinary cloud name | Cloudinary client configuration in `src/config/cloudinary.ts`. | No        |
| `CLOUDINARY_API_KEY`    | Yes      | Cloudinary API key    | Cloudinary client configuration in `src/config/cloudinary.ts`. | Yes       |
| `CLOUDINARY_API_SECRET` | Yes      | Cloudinary API secret | Cloudinary client configuration in `src/config/cloudinary.ts`. | Yes       |

## Ride configuration

| Name                      | Required | Format/type                                                              | Purpose and usage                                                                                                                       | Sensitive |
| ------------------------- | -------- | ------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| `RIDE_OFFER_TIMEOUT`      | Yes      | Value is not parsed in `env.ts`; intended timeout value is not confirmed | Validated and exported by `env.ts`. No active consumer is confirmed; the offer service currently uses a hard-coded ten-second duration. | No        |
| `RIDE_OFFER_JOB_INTERVAL` | Yes      | Numeric string; converted with `Number()`                                | Interval in `src/jobs/rideOfferTimeout.job.ts`. That job's startup call is commented out in `server.ts`.                                | No        |

## Maps

| Name                       | Required | Format/type           | Purpose and usage                                                                      | Sensitive |
| -------------------------- | -------- | --------------------- | -------------------------------------------------------------------------------------- | --------- |
| `GOOGLE_DEMO_MAPS_API_KEY` | Yes      | Google API key string | Sent as `X-Goog-Api-Key` by `src/services/maps.service.ts` when calling Google Routes. | Yes       |

## Razorpay

| Name                      | Required | Format/type             | Purpose and usage                                                                                                             | Sensitive |
| ------------------------- | -------- | ----------------------- | ----------------------------------------------------------------------------------------------------------------------------- | --------- |
| `RAZORPAY_KEY_ID`         | Yes      | Razorpay key identifier | Razorpay client configuration and payment responses in `src/config/razorpay.ts` and `src/modules/payment/payment.service.ts`. | Yes       |
| `RAZORPAY_KEY_SECRET`     | Yes      | Razorpay secret string  | Razorpay client configuration and payment verification HMAC in `src/modules/payment/payment.service.ts`.                      | Yes       |
| `RAZORPAY_WEBHOOK_SECRET` | Yes      | Webhook secret string   | Razorpay webhook HMAC verification in `src/modules/payment/payment.webhook.service.ts`.                                       | Yes       |

## Loading and security notes

- `dotenv.config()` runs from `src/config/env.ts` before validation.
- `CLIENT_URL` is checked twice in `env.ts`; this does not create a second variable.
- `src/utils/cookie.ts` reads `process.env.NODE_ENV` directly for one production-cookie check; the remaining configuration is accessed through the exported `env` object.
- No variable is optional according to the current validation code.
- Never include values from `.env` in source control, logs, examples, or documentation. The repository's `.env.example` contains placeholders only.
- Whether external credentials are valid, whether SMTP requires TLS-specific settings, and which deployment environment supplies these values are not confirmed from the current codebase.
