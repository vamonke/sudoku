const nextJest = require("next/jest");

/** @type {import('jest').Config} */
const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./",
});

// Add any custom config to be passed to Jest
const config = {
  coverageProvider: "v8",
  testEnvironment: "jsdom",
  collectCoverageFrom: [
    "app/_components/**/*.{js,jsx,ts,tsx}",
    "!**/coverage/**",
  ],
};

module.exports = createJestConfig(config);
