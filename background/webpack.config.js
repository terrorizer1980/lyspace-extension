// @ts-nocheck
const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: "production",
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: "./manifest.json",
          to: "../extension",
        },
        {
          from: "./icons",
          to: "../extension/icons",
        }
      ],
    }),
  ],
  entry: {
    background: "./src/index.js",
    "content_scripts/youtube": "./src/content_scripts/youtube.js",
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "../extension/"),
  },
};
