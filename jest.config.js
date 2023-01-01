const config = {
  testEnvironment: "jsdom",
  moduleDirectories: ["node_modules"],
  transform: {
    "\\.[jt]sx?$": "babel-jest",
  },
  transformIgnorePatterns: ["node_modules/(?!d3|internmap)"],
  setupFiles: [
    "<rootDir>/setupJest.js",
    "<rootDir>/node_modules/dotenv/config",
    "jest-canvas-mock",
  ],
  collectCoverage: true,
  coverageReporters: ["json", "html", "text-summary"],
  moduleNameMapper: {
    "^worker-loader.+$": "pdfjs-dist/legacy/build/pdf.worker.js",
  },
};

module.exports = config;
