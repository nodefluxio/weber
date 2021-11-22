/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  images: {
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384]
  },
  publicRuntimeConfig: {
    BACKEND_URL: process.env.BACKEND_URL
  }
}
