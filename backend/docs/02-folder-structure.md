# Backend Folder Structure

The following tree reflects the current contents of `backend/src`.

```text
src/
	app.ts
	server.ts
	config/
		cloudinary.ts
		cors.ts
		database.ts
		env.ts
		mail.ts
		razorpay.ts
	jobs/
		rideOfferTimeout.job.ts
	middlewares/
		admin.middleware.ts
		auth.middleware.ts
		authorize.middleware.ts
		ensureDriverIsActive.middleware.ts
		ensureUserIsActive.middleware.ts
		error.middleware.ts
		notFound.middleware.ts
		requireSuperAdmin.middleware.ts
		upload.middleware.ts
	modules/
		admin/
			admin.controller.ts
			admin.model.ts
			admin.routes.ts
			admin.service.ts
			admin.types.ts
		appeal/
			appeal.controller.ts
			appeal.model.ts
			appeal.routes.ts
			appeal.service.ts
			appeal.types.ts
		auth/
			auth.controller.ts
			auth.routes.ts
			auth.service.ts
			auth.types.ts
		businessSettings/
			businessSettings.controller.ts
			businessSettings.initialize.ts
			businessSettings.model.ts
			businessSettings.routes.ts
			businessSettings.service.ts
			businessSettings.types.ts
		driver/
			driver.controller.ts
			driver.image.service.ts
			driver.model.ts
			driver.routes.ts
			driver.service.ts
			driver.types.ts
		emailVerification/
			emailVerification.cleanup.ts
			emailVerification.controller.ts
			emailVerification.model.ts
			emailVerification.routes.ts
			emailVerification.service.ts
		health/
			health.controller.ts
			health.routes.ts
		payment/
			payment.controller.ts
			payment.model.ts
			payment.routes.ts
			payment.service.ts
			payment.types.ts
			payment.webhook.controller.ts
			payment.webhook.service.ts
			paymentWebhookEvent.model.ts
		review/
			review.controller.ts
			review.model.ts
			review.routes.ts
			review.service.ts
			review.types.ts
		ride/
			ride.controller.ts
			ride.model.ts
			ride.routes.ts
			ride.service.ts
			ride.types.ts
		rideOffer/
			rideOffer.model.ts
			rideOffer.service.ts
			rideOffer.types.ts
		user/
			user.controller.ts
			user.model.ts
			user.routes.ts
			user.service.ts
			user.types.ts
	services/
		cloudinary.service.ts
		dispatch.service.ts
		driverMatching.service.ts
		mail.service.ts
		maps.service.ts
		pricing.service.ts
	sockets/
		socket.auth.ts
		socket.events.ts
		socket.handlers.ts
		socket.rooms.ts
		socket.ts
		socket.types.ts
		socketStore.ts
	templates/
		verificationEmail.ts
	types/
		express.d.ts
	utils/
		AppError.ts
		asyncHandler.ts
		cookie.ts
		jwt.ts
		review.utils.ts
```

## Top-level files

| File        | Responsibility                                                                                                                                        |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `app.ts`    | Creates Express, registers middleware, mounts routers, and installs not-found/error handlers.                                                         |
| `server.ts` | Connects MongoDB, initializes settings, creates the HTTP server, attaches Socket.IO, listens on the configured port, and starts verification cleanup. |

## Configuration

`env.ts` loads and validates environment variables. `database.ts` connects Mongoose to MongoDB. `cloudinary.ts`, `mail.ts`, and `razorpay.ts` configure their corresponding clients. `cors.ts` exists but is empty and is not used by `app.ts`; CORS is configured directly in `app.ts` and the Socket.IO setup.

## Middleware

The middleware directory contains JWT account loading, account-type and admin authorization, active-account checks, upload validation, not-found handling, and centralized error handling. `requireSuperAdmin.middleware.ts` exists, but no current route imports it.

## Modules

Each domain directory owns its route/controller/service/model/type files where applicable:

| Module              | Current responsibility                                                                                        |
| ------------------- | ------------------------------------------------------------------------------------------------------------- |
| `admin`             | Admin accounts, driver verification, user/driver management, blocking, and review administration.             |
| `appeal`            | Driver appeals and admin appeal review.                                                                       |
| `auth`              | User/driver registration, login/logout, current account, and email verification route handling.               |
| `businessSettings`  | Settings schema, initialization, and admin read/update operations.                                            |
| `driver`            | Driver accounts, profile, location, verification data, and images.                                            |
| `emailVerification` | Verification persistence, email workflow, and expired-account cleanup. Its routes file is empty.              |
| `health`            | Health controller and route.                                                                                  |
| `payment`           | Razorpay payment creation/verification, payment persistence, webhook handling, and webhook-event idempotency. |
| `review`            | Completed-ride reviews and rating summaries/aggregates.                                                       |
| `ride`              | Ride creation, lifecycle, dispatch actions, cancellation, OTP, history, and details.                          |
| `rideOffer`         | Driver ride offers and offer progression/expiration support.                                                  |
| `user`              | User profile and profile-image operations.                                                                    |

Controllers handle HTTP input/output, services contain domain logic, models define Mongoose schemas, and types hold TypeScript contracts. The exact split varies slightly by module.

## Shared services and other directories

`services/` contains Cloudinary, dispatch, driver-matching, mail, maps, and pricing integrations. `sockets/` contains Socket.IO setup, authentication, rooms, handlers, events, types, and the in-memory connection store. `jobs/` contains ride-offer timeout processing. `templates/` contains the verification email template. `types/express.d.ts` extends Express request typing for authenticated account data. `utils/` contains reusable error, async, cookie, JWT, and review helpers.

No source files outside the tree above are implied by this document.
