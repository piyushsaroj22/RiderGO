# Backend Setup

## Prerequisites

The backend package is TypeScript ESM (`"type": "module"`) and requires a Node.js runtime capable of running the installed dependencies and the native `fetch` used by the maps service. The repository does not declare an `engines` field, so the exact minimum Node.js version is not confirmed.

You also need access to the services required by the current startup and request paths:

- MongoDB for application persistence.
- An SMTP server for verification email.
- Cloudinary for image operations.
- Google Routes API access for ride route calculations.
- Razorpay credentials for online payments and webhook verification.

The code validates all related environment variables during startup, so omitting any variable currently causes configuration loading to fail even if a particular integration is not being exercised.

## Install dependencies

From the backend directory:

```bash
npm install
```

The dependencies are defined in `backend/package.json`; there is no separate package manager configuration confirmed in the repository.

## Environment setup

Copy the placeholder file to a local `.env` file and fill it with values for your environment:

```text
cp .env.example .env
```

On Windows PowerShell, the equivalent is:

```powershell
Copy-Item .env.example .env
```

Use [04-environment-variables.md](./04-environment-variables.md) for the complete variable list. Do not commit secrets or paste actual credentials into documentation. `dotenv.config()` loads the environment before validation; the exact resolution path is left to dotenv's default behavior.

## Development

```bash
npm run dev
```

This runs `tsx watch src/server.ts`, which starts the TypeScript entry point and watches source files.

## Build and production start

Compile TypeScript with:

```bash
npm run build
```

This runs `tsc` using the backend TypeScript configuration and emits the compiled output used by the start script. Start the compiled server with:

```bash
npm start
```

The production script runs `node dist/server.js`. A successful production start requires a completed build and valid startup environment variables.

## MongoDB

`server.ts` calls the Mongoose connection routine before the HTTP server begins listening. Set `MONGO_URI` to the MongoDB connection string for the target database. If the connection fails, startup logs the failure and exits.

## External services

SMTP is configured through Nodemailer. Cloudinary is configured for uploaded images. The maps service calls Google Routes using the configured API key. Razorpay is used for payment operations and webhook signature checks. The current source does not confirm local emulators, mocks, retry setup, deployment provisioning, or a required MongoDB hosting provider.

## Available scripts

| Command         | Implementation                                                                       |
| --------------- | ------------------------------------------------------------------------------------ |
| `npm run dev`   | `tsx watch src/server.ts`                                                            |
| `npm run build` | `tsc`                                                                                |
| `npm start`     | `node dist/server.js`                                                                |
| `npm test`      | Deliberately exits with `Error: no test specified`; no test framework is configured. |

## Confirmed limitations

The package does not declare a Node.js engine version, test runner, migration command, seed command, or graceful-shutdown command. The ride-offer timeout job exists, but its startup invocation is commented out, so running the normal development or production command does not activate that job through `server.ts`.
