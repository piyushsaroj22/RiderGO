# Email Service

## SMTP transport

`config/mail.ts` creates a Nodemailer transporter using `SMTP_HOST`, numeric `SMTP_PORT`, `SMTP_USER`, and `SMTP_PASS`. It sets `secure: false`. `services/mail.service.ts` sends mail with `from: env.SMTP_FROM`, a recipient, subject, and HTML body.

## Verification email

The current email workflow is verification for User and Driver registration. `emailVerification.service.ts` generates a 32-byte random hex token, expires it after 15 minutes, deletes earlier records for the account, creates a new verification record, builds `${APP_URL}/api/auth/verify-email/${token}`, and sends the message.

The subject is `Verify your RiderGO account`. The template is `templates/verificationEmail.ts` and includes a RiderGO welcome heading, recipient name, verification button/link, and instructions for an unintended recipient.

## Error handling and delivery boundaries

SMTP/provider errors propagate to the caller. There is no retry queue, background mail worker, or email-specific error normalization. Registration saves the account and verification record before sending mail, so a delivery failure can leave stored account/token state even when the message was not delivered.

The template interpolates the recipient name and verification link directly into HTML; escaping is not confirmed. The email-verification cleanup interval runs separately from mail delivery and is documented in [19-email-verification.md](./19-email-verification.md).

## Configuration

| Variable    | Use                                   |
| ----------- | ------------------------------------- |
| `SMTP_HOST` | SMTP hostname.                        |
| `SMTP_PORT` | SMTP port, converted with `Number()`. |
| `SMTP_USER` | SMTP authentication username.         |
| `SMTP_PASS` | SMTP authentication password.         |
| `SMTP_FROM` | Sender value.                         |
| `APP_URL`   | Base URL for verification links.      |

The source does not confirm TLS configuration beyond `secure: false`, sender-domain validation, email templates other than verification, delivery retries, or provider-specific setup requirements.
