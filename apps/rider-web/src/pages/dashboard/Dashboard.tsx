import { useAppSelector } from "../../app/hooks";

const Dashboard = () => {
  const user = useAppSelector((state) => state.auth.user);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Map area */}
      <section className="absolute inset-0 bg-neutral-200">
        {/* Map placeholder */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,white_0%,transparent_25%),radial-gradient(circle_at_75%_60%,#d4d4d4_0%,transparent_35%)]" />

        {/* Fake roads for visual structure only */}
        <div className="absolute left-[15%] top-0 h-full w-16 rotate-[18deg] bg-white/80" />
        <div className="absolute right-[25%] top-0 h-full w-20 -rotate-[28deg] bg-white/70" />
        <div className="absolute left-0 top-[45%] h-20 w-full rotate-[-5deg] bg-white/80" />
        <div className="absolute left-0 top-[65%] h-12 w-full rotate-[8deg] bg-white/70" />

        {/* Current location */}
        <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center">
          <div className="absolute h-14 w-14 animate-pulse rounded-full bg-black/10" />
          <div className="relative h-5 w-5 rounded-full border-4 border-white bg-black shadow-lg" />
        </div>

        {/* Current location button */}
        <button
          type="button"
          className="absolute bottom-28 right-5 flex h-12 w-12 items-center justify-center rounded-full bg-white text-lg shadow-lg transition-transform hover:scale-105 lg:bottom-8 lg:right-8"
          aria-label="Current location"
        >
          ◎
        </button>
      </section>

      {/* Desktop booking panel */}
      <section className="absolute bottom-8 left-8 hidden w-[420px] lg:block">
        <div className="rounded-2xl bg-white p-6 shadow-2xl">
          <p className="text-sm text-neutral-500">
            Good to see you{user?.name ? `, ${user.name}` : ""}
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight">
            Where are you going?
          </h1>

          <div className="mt-6 space-y-3">
            <button
              type="button"
              className="flex h-14 w-full items-center rounded-xl bg-neutral-100 px-4 text-left transition-colors hover:bg-neutral-200"
            >
              <span className="mr-4 flex h-3 w-3 rounded-full bg-black" />

              <span className="text-sm text-neutral-500">Pickup location</span>
            </button>

            <button
              type="button"
              className="flex h-14 w-full items-center rounded-xl bg-neutral-100 px-4 text-left transition-colors hover:bg-neutral-200"
            >
              <span className="mr-4 flex h-3 w-3 rounded-full border-[3px] border-black" />

              <span className="text-sm text-neutral-500">Where to?</span>
            </button>
          </div>

          <button
            type="button"
            className="mt-4 h-14 w-full rounded-xl bg-black text-sm font-semibold text-white transition-colors hover:bg-neutral-800"
          >
            Find a ride
          </button>
        </div>
      </section>

      {/* Mobile booking sheet */}
      <section className="absolute bottom-0 left-0 right-0 lg:hidden">
        <div className="rounded-t-3xl bg-white px-5 pb-6 pt-5 shadow-2xl">
          <div className="mx-auto mb-5 h-1.5 w-10 rounded-full bg-neutral-300" />

          <p className="text-sm text-neutral-500">
            Good to see you{user?.name ? `, ${user.name}` : ""}
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight">
            Where are you going?
          </h1>

          <div className="mt-5 space-y-3">
            <button
              type="button"
              className="flex h-14 w-full items-center rounded-xl bg-neutral-100 px-4 text-left"
            >
              <span className="mr-4 h-3 w-3 rounded-full bg-black" />

              <span className="text-sm text-neutral-500">Pickup location</span>
            </button>

            <button
              type="button"
              className="flex h-14 w-full items-center rounded-xl bg-neutral-100 px-4 text-left"
            >
              <span className="mr-4 h-3 w-3 rounded-full border-[3px] border-black" />

              <span className="text-sm text-neutral-500">Where to?</span>
            </button>
          </div>

          <button
            type="button"
            className="mt-4 h-14 w-full rounded-xl bg-black text-sm font-semibold text-white active:bg-neutral-800"
          >
            Find a ride
          </button>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
