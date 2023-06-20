#!/usr/bin/env node

import { copy } from 'esbuild-plugin-copy';
import * as esbuild from 'esbuild'

const isWatch = process.argv.includes('-w');

let ctx = await esbuild.context({
  logLevel: "error",
  entryPoints: [
    {in: "./_build/default/main.bc.js", out: "assets/js/main" },
    {in: "./_build/default/main.min.css", out: "assets/css/main.min" }    
  ],
  bundle: false,
  allowOverwrite: true,
  platform: "node",
  outdir: "./_build/default/dist"  
  //outfile: "./_build/default/dist/assets/js/main.js" 
})




if(isWatch){
  await ctx.watch()
  let { host, port } = await ctx.serve({
    servedir: './_build/default/dist'
  })
}else{
  ctx.rebuild()  
  ctx.dispose()
}





