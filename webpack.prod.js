const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

/**
 * Extends the base webpack config by just setting the "mode"
 * to production.
 * This optimizes the built javascript code and it minifies it.
 */
module.exports = merge(common, {
  mode: "production",
});
