# RiderGO Backend

## Overview

RiderGO is a ride-booking platform with separate rider, Driver, and Admin applications. This backend provides the HTTP API and realtime services for account authentication, driver verification, ride dispatch, ride lifecycle management, payments, reviews, appeals, and administration.

## Key Features

- User, Driver, and Admin authentication with JWT cookies
- Email verification for User and Driver accounts
- Driver approval, rejection, blocking, availability, location, and vehicle management
- Ride creation, fare calculation, dispatch, offers, OTP verification, and lifecycle tracking
- Rider and Driver cancellation rules with fees and penalties
- Cash, UPI, and Card ride payment support through Razorpay for online payments
- Razorpay webhook processing with event-ID deduplication
- User and Driver reviews with rating aggregation and Admin moderation
- Driver appeals and Admin review workflows
- Cloudinary image uploads for User and Driver profiles/documents
- Socket.IO ride notifications, Driver presence, location updates, and disconnect events
- Configurable pricing, cancellation, and Driver matching settings

## Tech Stack

- Node.js with TypeScript and native ESM
- Express 5
- MongoDB with Mongoose
- Socket.IO
- JWT, bcrypt, cookie-parser, Helmet, CORS, and Morgan
- Multer and streamifier for image upload handling
- Cloudinary for image storage
- Nodemailer for SMTP email delivery
- Google Routes API for route distance and duration
- Razorpay for online payments and webhooks

## Architecture

The backend follows a modular `route -> controller -> service -> model` structure. Express handles HTTP requests, Mongoose handles persistence, and Socket.IO is attached to the same HTTP server for realtime communication.

See [Architecture](docs/01-architecture.md) for the request lifecycle, startup flow, sockets, jobs, and integrations.

## Project Structure

```text
backend/
	src/
		config/       Environment and provider configuration
		middlewares/  Authentication, authorization, uploads, and errors
		modules/      Domain routes, controllers, services, models, and types
		services/     Shared dispatch, matching, pricing, maps, mail, and media services
		sockets/      Socket.IO authentication, rooms, handlers, and events
		jobs/         Background processing
		utils/        Shared helpers
```

See [Folder Structure](docs/02-folder-structure.md) for the complete tree.

## Core Modules

- [Authentication](docs/05-authentication.md)
- [Authorization](docs/06-authorization.md)
- [User](docs/07-user-module.md)
- [Driver](docs/08-driver-module.md)
- [Ride](docs/09-ride-module.md)
- [Dispatch](docs/10-dispatch-system.md)
- [Cancellation](docs/11-cancellation-system.md)
- [Business Settings](docs/12-business-settings.md)
- [Dynamic Pricing](docs/13-dynamic-pricing.md)
- [Payments](docs/14-payment-system.md)
- [Razorpay Webhooks](docs/15-razorpay-webhook.md)
- [Reviews](docs/16-review-module.md)
- [Admin](docs/17-admin-module.md)
- [Appeals](docs/18-appeal-module.md)
- [Email Verification](docs/19-email-verification.md)

## Authentication & Authorization

HTTP authentication uses a JWT in the HTTP-only `token` cookie. JWT payloads identify the account ID and account type (`User`, `Driver`, or `Admin`). Route middleware applies account-type authorization and selected active/blocked checks; services also enforce resource ownership.

## Ride Lifecycle

Rides are created in `SEARCHING`, matched to Driver offers, and normally progress through `DRIVER_ASSIGNED`, `DRIVER_ARRIVED`, `OTP_VERIFIED`, `IN_PROGRESS`, and `COMPLETED`. Rides can also become `NO_DRIVER_FOUND` or `CANCELLED` according to the implemented rules.

## Dispatch System

Dispatch finds nearby online, available, approved, email-verified Drivers using MongoDB geospatial queries. It offers a ride sequentially to one Driver at a time, then advances the queue after rejection or expiration. The timeout job exists but is not started by the current server startup path.

## Payment System

Cash rides are marked paid on completion. UPI and Card payments create Razorpay orders after ride completion and use HMAC signature verification. Payment verification updates the Payment and Ride records in a MongoDB transaction. Razorpay webhooks handle captured, failed, and paid-order events.

## Realtime Communication

Socket.IO runs on the same HTTP server. User and Driver clients authenticate with a JWT handshake token and join account-specific rooms. Driver presence and location updates, ride offers, ride lifecycle notifications, and disconnect notifications are implemented. Admin sockets are not supported.

## External Services

- MongoDB for persistence
- Cloudinary for profile and Driver document images
- SMTP/Nodemailer for verification email
- Google Routes API for route calculations
- Razorpay for online payments and webhook events

## Environment Setup

Install dependencies and configure the required local environment variables from `.env.example`:

```bash
npm install
npm run dev
```

See [Setup](docs/03-setup.md) and [Environment Variables](docs/04-environment-variables.md). Never commit actual credentials or secret values.

## API Documentation

See the [API Reference](docs/28-api-reference.md) for the complete list of registered HTTP endpoints, middleware, request formats, responses, and known errors.

## Deployment

The package supports `npm run build` and `npm start`, producing and running `dist/server.js`. Render-specific configuration is not committed to the repository; deployment requires external configuration and service credentials.

See [Render Deployment](docs/29-deployment-render.md).

## Testing

No automated backend test framework or test suite is configured. `npm run build` is the available TypeScript verification command, while `npm test` is a placeholder that exits with `Error: no test specified`. API, payment, webhook, Socket.IO, and full ride-flow checks currently require manual or future integration testing.

## Backend Status

The current source supports the backend V1 feature milestone, but this does not represent production certification, scalability certification, or a bug-free guarantee. See [Backend Status](docs/31-backend-status.md) for implemented functionality, testing gaps, deployment status, and known limitations.

## Important Notes

Frontend-dependent end-to-end testing is performed after the rider, Driver, and Admin frontends are available and integrated with the backend. Detailed implementation notes belong in [backend/docs](docs/README.md).
