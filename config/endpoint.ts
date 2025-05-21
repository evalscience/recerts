const localhost = "http://localhost:3000";

export const BASE_URL = (() => {
  // In development, use localhost
  if (!process.env.NEXT_PUBLIC_VERCEL_ENV) {
    return localhost;
  }

  // In production, use the production URL if available
  if (process.env.NEXT_PUBLIC_VERCEL_ENV === 'production' && 
      process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`;
  }

  // For preview deployments (and fallback), use the deployment URL
  return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
})();
