import axios from "axios";
import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useParams } from "react-router-dom";

import { authApi } from "../../services/api/auth.api";

const ResetPassword = () => {
  const { token } = useParams<{ token: string }>();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");

    if (!token) {
      setError("Invalid password reset link.");
      return;
    }

    if (!password || !confirmPassword) {
      setError("Please enter your new password.");
      return;
    }

    if (password.length < 3) {
      setError("Password must be at least 3 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setIsLoading(true);

      await authApi.resetPassword(token, {
        password,
      });

      setSuccess(true);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.message || "Unable to reset your password.",
        );
      } else {
        setError("Unable to reset your password.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <main className="flex min-h-screen flex-col bg-white">
        <header className="px-6 py-6 sm:px-10">
          <Link to="/" className="text-2xl font-bold tracking-tight text-black">
            RiderGO
          </Link>
        </header>

        <div className="flex flex-1 items-center justify-center px-6 pb-16">
          <div className="w-full max-w-sm text-center">
            <h1 className="text-3xl font-bold tracking-tight text-black">
              Password reset
            </h1>

            <p className="mt-3 text-sm leading-6 text-neutral-500">
              Your password has been reset successfully. You can now sign in
              with your new password.
            </p>

            <Link
              to="/login"
              className="mt-8 flex h-14 w-full items-center justify-center rounded-md bg-black text-base font-medium text-white transition-colors hover:bg-neutral-800"
            >
              Continue to sign in
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col bg-white">
      <header className="px-6 py-6 sm:px-10">
        <Link to="/" className="text-2xl font-bold tracking-tight text-black">
          RiderGO
        </Link>
      </header>

      <div className="flex flex-1 items-center justify-center px-6 pb-16">
        <div className="w-full max-w-sm">
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-black">
            Reset your password
          </h1>

          <p className="mb-8 text-sm text-neutral-500">
            Enter a new password for your RiderGO account.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label htmlFor="password" className="sr-only">
                New password
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="New password"
                autoComplete="new-password"
                className="h-14 w-full rounded-md border border-neutral-300 px-4 text-base text-black outline-none transition-colors placeholder:text-neutral-500 focus:border-black focus:ring-1 focus:ring-black"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="sr-only">
                Confirm password
              </label>

              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Confirm password"
                autoComplete="new-password"
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
              {isLoading ? "Resetting password…" : "Reset password"}
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
        </div>
      </div>
    </main>
  );
};

export default ResetPassword;
