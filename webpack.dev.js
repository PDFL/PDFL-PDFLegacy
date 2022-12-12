const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const path = require("path");

/**
 * Extends the base webpack config for development environment.
 * Enables dev server with a precise 'source-map'.
 * Dev server is used to serve the tool locally for development
 *  - it auto (hot) reloads
 *  - does not build the src to disk, but it serves it from memory
 * Devtool source-map enables viewing the exact place of a "stdout" or "stderr"
 *  in the browser (it will show the correct line and functions called in the
 *  source code).
 */
module.exports = merge(common, {
  mode: "development",
  devtool: "eval-cheap-module-source-map",
  devServer: {
    static: path.join(__dirname, "dist"),
    watchFiles: ["./src/templates/*"],
    open: true,
  },
});
