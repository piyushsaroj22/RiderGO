const verificationEmailTemplate = (
  name: string,
  verificationLink: string,
): string => {
  return `
    <!DOCTYPE html>
    <html>
      <body style="font-family: Arial, sans-serif;">
        <h2>Welcome to RiderGO 🚖</h2>

        <p>Hi <strong>${name}</strong>,</p>

        <p>
          Thank you for registering.
          Please verify your email by clicking the button below.
        </p>

        <a
          href="${verificationLink}"
          style="
            display:inline-block;
            padding:12px 20px;
            background:#000;
            color:#fff;
            text-decoration:none;
            border-radius:6px;
          "
        >
          Verify Email
        </a>

        <p>
          If you didn't create this account,
          you can safely ignore this email.
        </p>
      </body>
    </html>
  `;
};

export default verificationEmailTemplate;
