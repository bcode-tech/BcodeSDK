import json from "rollup-plugin-json";
import typescript from "rollup-plugin-typescript2";
import commonjs from "rollup-plugin-commonjs";
import resolve from "rollup-plugin-node-resolve";
import uglify from "@lopatnov/rollup-plugin-uglify";

import pkg from "./package.json";

// const name = require("./package.json").main.replace(/\.js$/, "");

export default [
  {
    input: `src/index.ts`,
    output: [
      {
        file: pkg.main,
        format: "umd",
        name: pkg.umdName,
        sourcemap: true,
      },
      {
        file: pkg.module,
        format: "es",
        sourcemap: true,
      },
    ],
    external: [
      ...Object.keys(pkg.devDependencies || {}),
      ...Object.keys(pkg.peerDependencies || {}),
    ],
    plugins: [
      json(),
      typescript({
        typescript: require("typescript"),
      }),
      resolve(),
      commonjs(),
    ],
  },
  {
    input: `src/${pkg.libraryFile}.ts`,
    output: {
      file: `build/${pkg.libraryFile}.min.js`,
      name: pkg.umdName,
      format: "umd",
      sourcemap: true,
    },
    external: [
      ...Object.keys(pkg.devDependencies || {}),
      ...Object.keys(pkg.peerDependencies || {}),
    ],
    plugins: [
      json(),
      typescript({
        typescript: require("typescript"),
      }),
      resolve(),
      commonjs(),
      uglify(),
    ],
  },
];
