#!/usr/bin/env node

import esbuildServe from "esbuild-serve";

//https://how-to.dev/how-to-add-live-reload-to-esbuild-server
esbuildServe(
  {
    logLevel: "info",
    entryPoints: ["./_build/default/app/app.js"],
    bundle: true,
    //platform: "node",
    outfile: "./public/assets/js/main.js"
  },
  { root: "./public" }
);
