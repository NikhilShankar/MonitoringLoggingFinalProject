const ModuleFederationPlugin = require("webpack").container.ModuleFederationPlugin;
const mf = require("@angular-architects/module-federation/webpack");
const path = require("path");
const share = mf.share;

module.exports = {
  output: {
    uniqueName: "products",
    publicPath: "auto",
    scriptType: "text/javascript",
  },
  optimization: {
    runtimeChunk: false,
  },
  resolve: {
    alias: {},
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "products",
      filename: "remoteEntry.js",
      exposes: {
        "./ProductsModule": "./src/app/products/products.module.ts",
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
