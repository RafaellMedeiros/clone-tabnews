const dotenv = require("dotenv");
const nextJest = require("next/jest");
const { join } = require("path");

dotenv.config({ path: join(__dirname, ".env.development") });

const createJestConfig = nextJest();
const jestConfig = createJestConfig({
  moduleDirectories: ["node_modules", "<rootDir>"],
  testTimeout: 60000,
});

module.exports = jestConfig;
