let googleMapsPromise: Promise<typeof google> | null = null;

export const loadGoogleMaps = async (): Promise<typeof google> => {
  if (typeof window === "undefined") {
    throw new Error("Google Maps can only be loaded in the browser.");
  }

  if (googleMapsPromise) {
    return googleMapsPromise;
  }

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    throw new Error("VITE_GOOGLE_MAPS_API_KEY is not configured.");
  }

  googleMapsPromise = new Promise<typeof google>((resolve, reject) => {
    if (window.google?.maps) {
      resolve(window.google);
      return;
    }

    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[data-ridergo-google-maps="true"]',
    );

    if (existingScript) {
      existingScript.addEventListener("load", () => {
        if (window.google?.maps) {
          resolve(window.google);
        } else {
          reject(new Error("Google Maps loaded without the Maps API."));
        }
      });

      existingScript.addEventListener("error", () => {
        reject(new Error("Unable to load Google Maps."));
      });

      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&v=weekly&libraries=places`;
    script.async = true;
    script.defer = true;
    script.dataset.ridergoGoogleMaps = "true";

    script.addEventListener("load", () => {
      if (window.google?.maps) {
        resolve(window.google);
      } else {
        reject(new Error("Google Maps loaded without the Maps API."));
      }
    });

    script.addEventListener("error", () => {
      reject(new Error("Unable to load Google Maps."));
    });

    document.head.appendChild(script);
  }).catch((error) => {
    googleMapsPromise = null;
    throw error;
  });

  return googleMapsPromise;
};
