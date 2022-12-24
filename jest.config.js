const config = {
  testEnvironment: "jsdom",
  moduleDirectories: ["node_modules"],
  transform: {
    "\\.[jt]sx?$": "babel-jest",
  },
  transformIgnorePatterns: ["node_modules/(?!d3|internmap)"],
  setupFiles: ["setupJest.js"],
};

module.exports = config;
