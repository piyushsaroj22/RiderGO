import axios from "axios";
import { useState } from "react";
import type { FormEvent } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../../services/api/auth.api";
import { useAppDispatch } from "../../app/hooks";
import { setUser } from "../../store/slices/authSlice";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");

    if (!email.trim() || !password) {
      setError("Email and password are required.");
      return;
    }

    try {
      setIsLoading(true);

      await authApi.login({
        email: email.trim(),
        password,
      });

      const response = await authApi.me();

      dispatch(setUser(response.data));

      navigate("/dashboard", {
        replace: true,
      });
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.message || "Unable to login. Please try again.",
        );
      } else {
        setError("Unable to login. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col bg-white">
      {/* Top bar */}
      <header className="flex items-center justify-between px-6 py-6 sm:px-10">
        <span className="text-2xl font-bold tracking-tight text-black">
          RiderGO
        </span>
        <Link
          to="/register"
          className="text-sm font-medium text-black underline underline-offset-4"
        >
          Sign up
        </Link>
      </header>

      {/* Centered form */}
      <div className="flex flex-1 items-center justify-center px-6 pb-16">
        <div className="w-full max-w-sm">
          <h1 className="mb-8 text-3xl font-bold tracking-tight text-black">
            Welcome back
          </h1>

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

            <div className="relative">
              <label htmlFor="password" className="sr-only">
                Password
              </label>

              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Password"
                autoComplete="current-password"
                className="h-14 w-full rounded-md border border-neutral-300 px-4 pr-12 text-base text-black outline-none transition-colors placeholder:text-neutral-500 focus:border-black focus:ring-1 focus:ring-black"
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-neutral-500 transition-colors hover:text-black"
              >
                {showPassword ? (
                  <EyeOff size={20} strokeWidth={1.8} />
                ) : (
                  <Eye size={20} strokeWidth={1.8} />
                )}
              </button>
            </div>

            <div className="relative">
              {error && (
                <p
                  role="alert"
                  className="absolute left-0 top-0 text-sm text-red-600"
                >
                  {error}
                </p>
              )}

              <div className="text-right">
                <Link
                  to="/forgot-password"
                  className="text-sm font-medium text-black underline underline-offset-4"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="h-14 w-full rounded-md bg-black text-base font-medium text-white transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-neutral-600">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-medium text-black underline underline-offset-4"
            >
              Create account
            </Link>
          </p>

          <p className="mt-8 text-xs leading-5 text-neutral-500">
            By continuing, you agree to RiderGO's{" "}
            <Link to="/terms" className="underline underline-offset-2">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="underline underline-offset-2">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </main>
  );
};

export default Login;
