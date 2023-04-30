/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    loader: "imgix",
    path: "/",
  },
  reactStrictMode: false,
}

module.exports = nextConfig
