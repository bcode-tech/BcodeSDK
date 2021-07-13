import dts from "rollup-plugin-dts";
import esbuild from "rollup-plugin-esbuild";
import json from "@rollup/plugin-json";

const name = require("./package.json").main.replace(/\.js$/, "");

const bundle = (config) => ({
  ...config,
  input: "./src/main.ts",
  external: (id) => !/^[./]/.test(id),
});

export default [
  bundle({
    plugins: [esbuild(), json({ compact: true })],
    output: [
      {
        file: `${name}.js`,
        format: "cjs",
        sourcemap: true,
      },
      {
        file: `${name}.mjs`,
        format: "es",
        sourcemap: true,
      },
    ],
  }),
  bundle({
    plugins: [dts()],
    output: {
      file: `${name}.d.ts`,
      format: "es",
    },
  }),
];
