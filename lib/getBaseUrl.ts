export function getBaseUrl() {
  // Check if we're in a browser environment
  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  // Check if we're in a production environment
  const isProduction = process.env.NODE_ENV === "production";

  if (isProduction) {
    //  Custom domain (recommended for production)
    if (process.env.NEXT_PUBLIC_APP_URL) {
      return process.env.NEXT_PUBLIC_APP_URL;
    }

    //  Vercel auto-generated URL
    if (process.env.VERCEL_URL) {
      return `https://${process.env.VERCEL_URL}`;
    }

    //  Vercel project production URL (more reliable)
    if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
      return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
    }

    // Fallback — you should set this variable in production
    throw new Error(
      "No production URL configured. Please set NEXT_PUBLIC_APP_URL environment variable."
    );
  }

  //  Default to localhost for development
  return "http://localhost:3000";
}