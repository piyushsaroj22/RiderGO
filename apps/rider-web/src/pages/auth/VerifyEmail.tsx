import { Link, useLocation } from "react-router-dom";

interface VerifyEmailLocationState {
  email?: string;
}

const VerifyEmail = () => {
  const location = useLocation();

  const state = location.state as VerifyEmailLocationState | null;
  const email = state?.email;

  return (
    <main className="flex min-h-screen flex-col bg-white">
      {/* Top bar */}
      <header className="px-6 py-6 sm:px-10">
        <Link to="/" className="text-2xl font-bold tracking-tight text-black">
          RiderGO
        </Link>
      </header>

      {/* Content */}
      <div className="flex flex-1 items-center justify-center px-6 pb-16">
        <div className="w-full max-w-sm text-center">
          {/* Icon */}
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-8 w-8 text-black"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 7.5 12 13l9-5.5M4.5 5.5h15A1.5 1.5 0 0 1 21 7v10a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17V7a1.5 1.5 0 0 1 1.5-1.5Z"
              />
            </svg>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-black">
            Check your email
          </h1>

          <p className="mt-3 text-sm leading-6 text-neutral-500">
            We&apos;ve sent a verification link to
          </p>

          {email && (
            <p className="mt-1 break-all text-sm font-medium text-black">
              {email}
            </p>
          )}

          <div className="mt-8">
            <Link
              to="/login"
              className="mt-8 flex h-14 w-full items-center justify-center rounded-md bg-black text-base font-medium text-white transition-colors hover:bg-neutral-800"
            >
              If You Verified Your Email, Click Here
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default VerifyEmail;
