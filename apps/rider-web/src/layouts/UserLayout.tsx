import { NavLink, Outlet } from "react-router-dom";
import { useAppSelector } from "../app/hooks";

const UserLayout = () => {
  const user = useAppSelector((state) => state.auth.user);

  return (
    <div className="min-h-screen bg-neutral-100 text-black">
      {/* Desktop / Mobile Header */}
      <header className="absolute left-0 right-0 top-0 z-50">
        <div className="flex items-center justify-between px-5 py-5 sm:px-8">
          <NavLink
            to="/dashboard"
            className="rounded-full bg-white px-5 py-2.5 text-xl font-bold tracking-tight shadow-md"
          >
            RiderGO
          </NavLink>

          <NavLink
            to="/profile"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-sm font-semibold shadow-md transition-transform hover:scale-105"
            aria-label="Profile"
          >
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </NavLink>
        </div>
      </header>

      {/* Main application */}
      <main className="min-h-screen pb-20 lg:pb-0">
        <Outlet />
      </main>

      {/* Mobile bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-neutral-200 bg-white lg:hidden">
        <div className="grid h-16 grid-cols-4">
          <NavLink
            to="/dashboard"
            className={({ isActive }: { isActive: boolean }) =>
              `flex flex-col items-center justify-center gap-1 text-xs ${
                isActive ? "font-semibold text-black" : "text-neutral-500"
              }`
            }
          >
            <span className="text-lg">⌂</span>
            Home
          </NavLink>

          <NavLink
            to="/ride"
            className={({ isActive }: { isActive: boolean }) =>
              `flex flex-col items-center justify-center gap-1 text-xs ${
                isActive ? "font-semibold text-black" : "text-neutral-500"
              }`
            }
          >
            <span className="text-lg">●</span>
            Rides
          </NavLink>

          <NavLink
            to="/history"
            className={({ isActive }: { isActive: boolean }) =>
              `flex flex-col items-center justify-center gap-1 text-xs ${
                isActive ? "font-semibold text-black" : "text-neutral-500"
              }`
            }
          >
            <span className="text-lg">◷</span>
            Activity
          </NavLink>

          <NavLink
            to="/profile"
            className={({ isActive }: { isActive: boolean }) =>
              `flex flex-col items-center justify-center gap-1 text-xs ${
                isActive ? "font-semibold text-black" : "text-neutral-500"
              }`
            }
          >
            <span className="text-lg">○</span>
            Account
          </NavLink>
        </div>
      </nav>
    </div>
  );
};

export default UserLayout;
