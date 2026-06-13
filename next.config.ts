import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fix: Explicitly set turbopack root to THIS project directory
  // to prevent the rogue C:\Users\karan\package-lock.json from
  // confusing the workspace root detection.
  turbopack: {
    root: "C:\\Users\\karan\\OneDrive\\Desktop\\civic-issue-tracker",
  },

  // Allow Cloudinary and Mapbox images
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "api.mapbox.com",
      },
    ],
  },
};

export default nextConfig;
