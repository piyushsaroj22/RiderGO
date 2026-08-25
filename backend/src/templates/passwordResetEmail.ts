const passwordResetEmailTemplate = (
  name: string,
  resetLink: string,
): string => {
  return `
    <!DOCTYPE html>
    <html>
      <body
        style="
          margin: 0;
          padding: 0;
          background: #ffffff;
          font-family: Arial, sans-serif;
          color: #111111;
        "
      >
        <div
          style="
            max-width: 600px;
            margin: 0 auto;
            padding: 40px 24px;
          "
        >
          <h1>RiderGO</h1>

          <h2>Reset your password</h2>

          <p>Hi ${name},</p>

          <p>
            We received a request to reset your RiderGO
            account password.
          </p>

          <p style="margin: 32px 0;">
            <a
              href="${resetLink}"
              style="
                display: inline-block;
                padding: 14px 24px;
                background: #000000;
                color: #ffffff;
                text-decoration: none;
                border-radius: 6px;
                font-weight: 600;
              "
            >
              Reset password
            </a>
          </p>

          <p>
            This link will expire in 15 minutes.
          </p>

          <p>
            If you did not request a password reset,
            you can safely ignore this email.
          </p>

          <p style="margin-top: 32px;">
            — RiderGO
          </p>
        </div>
      </body>
    </html>
  `;
};

export default passwordResetEmailTemplate;
