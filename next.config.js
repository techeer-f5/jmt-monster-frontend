/** @type {import("next").NextConfig} */
const withPWA = require("next-pwa");
const runtimeCaching = require("next-pwa/cache");

const nextConfig = withPWA({
    reactStrictMode: true,
    pwa: {
        dest: "public",
        register: true,
        skipWaiting: true,
        runtimeCaching
    },
    options: {
        sourcemaps: "development" // possible values can be production, development, or none
    }
});

module.exports = nextConfig;
