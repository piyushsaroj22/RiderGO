# Render Deployment

## Confirmed repository setup

The repository is an npm workspace containing `apps/*` frontends and `backend`. The backend is an independent TypeScript ESM package with source in `backend/src` and compiled output in `backend/dist`.

Confirmed backend commands:

```bash
npm install
npm run build
npm start
```

`npm run build` runs `tsc`, using `backend/tsconfig.json` to compile `src` to `dist`. `npm start` runs `node dist/server.js`. The development command is `npm run dev`, which runs `tsx watch src/server.ts`.

No `render.yaml`, `render.yml`, `Dockerfile`, `Procfile`, Render service configuration, or Node `engines` field is present or confirmed. The exact Render root directory and workspace command configuration must therefore be selected in the Render dashboard; the repository does not prescribe them.

## Required environment

`src/config/env.ts` requires all variables in [`.env.example`](../.env.example): `PORT`, `NODE_ENV`, `MONGO_URI`, SMTP variables, `APP_URL`, JWT variables, `CLIENT_URL`, Cloudinary variables, ride-offer variables, Google Maps, and Razorpay variables. Do not put actual secret values in this document or source control.

The deployed service needs externally provisioned MongoDB, SMTP, Cloudinary, Google Routes, and Razorpay access. The repository does not confirm a specific Atlas project, database user, network allowlist, SMTP provider, Cloudinary account, or Razorpay account.

## Render service commands

The commands derived from `backend/package.json` are:

| Render setting | Value supported by the repository                                                                                                  |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Build command  | `npm run build` from the backend package directory, or an equivalent workspace command if the service root is the repository root. |
| Start command  | `npm start` from the backend package directory, or an equivalent workspace command if configured at the repository root.           |
| Output         | `dist/server.js` under the backend package.                                                                                        |
| Node version   | Not configured in the repository.                                                                                                  |

The appropriate Render root directory/workspace invocation is not confirmed from code and should be verified against the chosen Render service layout.

## MongoDB Atlas and CORS

Startup calls `mongoose.connect(env.MONGO_URI)` before listening. An Atlas connection string, database credentials, and network access allowing the deployed service are required for a real deployment, but no Atlas configuration is committed.

Express and Socket.IO both configure CORS with `CLIENT_URL` and credentials enabled. Set `CLIENT_URL` to the deployed frontend origin. The authentication cookie is `SameSite: "strict"`; compatibility with a particular frontend/backend domain arrangement is not confirmed by the repository and must be tested with the actual deployment topology.

## Razorpay webhook

Configure Razorpay to send webhooks to:

```text
https://<deployed-backend-host>/api/payments/webhook
```

The route must receive `application/json` and preserve the raw body because signature verification uses the exact bytes. Supply `RAZORPAY_WEBHOOK_SECRET` in the service environment and configure the Razorpay event ID/signature headers as expected by the service. The repository does not contain a Render webhook registration or external dashboard configuration.

## Health, logging, and sockets

Use `GET /health` as the available health endpoint. It returns `RiderGO API is running` when the Express process is handling requests; it does not confirm database or external-service readiness.

Morgan is configured with `dev` format, and startup/errors use `console.log`/`console.error`. No production-specific logging sink, retention policy, or structured logger is configured.

Socket.IO attaches to the same HTTP server. The implementation uses a process-local in-memory connected-account store and no distributed adapter. Multi-instance scaling, cross-instance room state, sticky-session configuration, graceful shutdown, and zero-downtime guarantees are not implemented or confirmed.

## Common deployment issues visible from source

- Missing any startup-validated environment variable prevents configuration loading.
- Starting with `npm start` before building leaves the required `dist/server.js` unavailable or stale.
- MongoDB connection failure stops startup.
- Incorrect `CLIENT_URL` prevents the intended credentialed CORS setup.
- Webhook signature verification fails if a proxy/parser changes the raw JSON body or the webhook secret is wrong.
- The ride-offer timeout job is not started because its call is commented out in `server.ts`.
- No Node version is pinned, so runtime compatibility must be selected externally.

Production certification, scaling behavior, zero-downtime deployment, and deployment-provider health checks are not confirmed by the current repository.
