import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
      { protocol: "https", hostname: "randomuser.me", pathname: "/**" },
      { protocol: "https", hostname: "picsum.photos", pathname: "/**" },
      { protocol: "https", hostname: "flagcdn.com", pathname: "/**" },
      { protocol: "https", hostname: "res.cloudinary.com", pathname: "/**" },
      { protocol: "https", hostname: "api.hightribe.com", pathname: "/**" },
      { protocol: "https", hostname: "via.placeholder.com", pathname: "/**" }, // ✅
      { protocol: "https", hostname: "placehold.co", pathname: "/**" },       // (optional)

    ],
    // SVG chahiye ho to enable karna hota hai (risk samajh kar):
    // dangerouslyAllowSVG: true,
  },
};

export default nextConfig;
