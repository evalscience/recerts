const localhost = "http://localhost:3000";

export const BASE_URL = process.env.VERCEL_URL
  ? process.env.VERCEL_URL
  : localhost;
