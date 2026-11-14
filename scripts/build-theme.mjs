import { build, context } from "esbuild";
import { resolve } from "node:path";
import { addonOptions } from "./lifecycle.mjs";

const watch = process.argv.includes("--watch");
const reactShim = resolve("src/settings/react-shim.ts");

const options = addonOptions({
  entry: "src/index.ts",
  outfile: "dist/theme.js",
  runtime: "src/lifecycle/runtime.ts",
  globals: /^(glowify|showGlowify|__coverSwipe)/,
  remove: ".glowify-popup-clone",
  target: ["chrome98"],
  platform: "browser",
  loader: {
    ".png": "dataurl",
  },
  jsxFactory: "React.createElement",
  jsxFragment: "React.Fragment",
  plugins: [
    {
      name: "spotikit-react-shim",
      setup(build) {
        build.onResolve({ filter: /^react$/ }, () => ({ path: reactShim }));
      },
    },
  ],
});

if (watch) {
  const ctx = await context(options);
  await ctx.watch();
  console.log("Watching src/index.ts -> dist/theme.js");
} else {
  await build(options);
}
