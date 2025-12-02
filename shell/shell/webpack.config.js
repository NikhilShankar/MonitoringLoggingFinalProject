const ModuleFederationPlugin =
  require("webpack").container.ModuleFederationPlugin;
const mf = require("@angular-architects/module-federation/webpack");
const path = require("path");
const share = mf.share;

module.exports = {
  output: {
    uniqueName: "shell",
    publicPath: "auto",
  },
  optimization: {
    runtimeChunk: false,
  },
  plugins: [
    new ModuleFederationPlugin({
      // Remotes: other microfrontends that Shell will consume
      remotes: {
        products: "products@http://localhost:4201/remoteEntry.js",
      },
      shared: share({
        "@angular/core": {
          singleton: true,
          strictVersion: true,
          requiredVersion: "auto",
          eager: false,
        },
        "@angular/common": {
          singleton: true,
          strictVersion: true,
          requiredVersion: "auto",
          eager: false,
        },
        "@angular/router": {
          singleton: true,
          strictVersion: true,
          requiredVersion: "auto",
          eager: false,
        },
        "@angular/platform-browser": {
          singleton: true,
          strictVersion: true,
          requiredVersion: "auto",
          eager: false,
        },
        "@angular/platform-browser-dynamic": {
          singleton: true,
          strictVersion: true,
          requiredVersion: "auto",
          eager: false,
        },
      }),
    }),
  ],
};
