import axios from "axios";
import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";

import { authApi } from "../../services/api/auth.api";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setSuccess(false);

    const normalizedEmail = email.trim();

    if (!normalizedEmail) {
      setError("Email is required.");
      return;
    }

    try {
      setIsLoading(true);

      await authApi.forgotPassword({
        email: normalizedEmail,
      });

      setSuccess(true);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.message ||
            "Unable to send reset link. Please try again.",
        );
      } else {
        setError("Unable to send reset link. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col bg-white">
      {/* Top bar */}
      <header className="flex items-center justify-between px-6 py-6 sm:px-10">
        <Link to="/" className="text-2xl font-bold tracking-tight text-black">
          RiderGO
        </Link>

        <Link
          to="/login"
          className="text-sm font-medium text-black underline underline-offset-4"
        >
          Sign in
        </Link>
      </header>

      {/* Centered content */}
      <div className="flex flex-1 items-center justify-center px-6 pb-16">
        <div className="w-full max-w-sm">
          {!success ? (
            <>
              <h1 className="mb-2 text-3xl font-bold tracking-tight text-black">
                Forgot your password?
              </h1>

              <p className="mb-8 text-sm leading-6 text-neutral-500">
                Enter your email address and we&apos;ll send you a link to reset
                your password.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <div>
                  <label htmlFor="email" className="sr-only">
                    Email
                  </label>

                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="Email"
                    autoComplete="email"
                    className="h-14 w-full rounded-md border border-neutral-300 px-4 text-base text-black outline-none transition-colors placeholder:text-neutral-500 focus:border-black focus:ring-1 focus:ring-black"
                  />
                </div>

                {error && (
                  <p role="alert" className="text-sm text-red-600">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="h-14 w-full rounded-md bg-black text-base font-medium text-white transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isLoading ? "Sending…" : "Send reset link"}
                </button>
              </form>

              <p className="mt-8 text-center text-sm text-neutral-600">
                Remember your password?{" "}
                <Link
                  to="/login"
                  className="font-medium text-black underline underline-offset-4"
                >
                  Sign in
                </Link>
              </p>
            </>
          ) : (
            <>
              <h1 className="mb-2 text-3xl font-bold tracking-tight text-black">
                Check your email
              </h1>

              <p className="text-sm leading-6 text-neutral-500">
                If an account exists with this email, we&apos;ve sent a password
                reset link. Check your inbox and follow the link to create a new
                password.
              </p>

              <Link
                to="/login"
                className="mt-8 flex h-14 w-full items-center justify-center rounded-md bg-black text-base font-medium text-white transition-colors hover:bg-neutral-800"
              >
                Back to sign in
              </Link>

              <button
                type="button"
                onClick={() => {
                  setSuccess(false);
                  setEmail("");
                }}
                className="mt-4 w-full text-center text-sm font-medium text-black underline underline-offset-4"
              >
                Try another email
              </button>
            </>
          )}
        </div>
      </div>
    </main>
  );
};

export default ForgotPassword;
