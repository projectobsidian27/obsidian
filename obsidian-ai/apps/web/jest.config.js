module.exports = {
  testEnvironment: "jsdom",
  transform: { "^.+\.(ts|tsx)$": ["ts-jest", { tsconfig: "tsconfig.json" }] },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  collectCoverageFrom: ["src/**/*.{ts,tsx}", "!src/**/*.d.ts"]
};