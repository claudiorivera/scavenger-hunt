/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: [
      "res.cloudinary.com",
      "claudiorivera.com",
      "loremflickr.com",
      "picsum.photos",
      "avatars.githubusercontent.com",
    ],
  },
};

module.exports = nextConfig;
