// import json from "rollup-plugin-json";
// import typescript from "rollup-plugin-typescript2";
// import commonjs from "rollup-plugin-commonjs";
// import resolve from "rollup-plugin-node-resolve";
// import uglify from "@lopatnov/rollup-plugin-uglify";

// import pkg from "./package.json";

// // const name = require("./package.json").main.replace(/\.js$/, "");

// export default [
//   {
//     input: `src/index.ts`,
//     output: [
//       {
//         file: pkg.main,
//         format: "umd",
//         name: pkg.umdName,
//         sourcemap: true,
//       },
//       {
//         file: pkg.module,
//         format: "es",
//         sourcemap: true,
//       },
//     ],
//     external: [
//       ...Object.keys(pkg.devDependencies || {}),
//       ...Object.keys(pkg.peerDependencies || {}),
//     ],
//     plugins: [
//       json(),
//       typescript({
//         typescript: require("typescript"),
//       }),
//       resolve(),
//       commonjs(),
//     ],
//   },
//   {
//     input: `src/${pkg.libraryFile}.ts`,
//     output: {
//       file: `build/${pkg.libraryFile}.min.js`,
//       name: pkg.umdName,
//       format: "umd",
//       sourcemap: true,
//     },
//     external: [
//       ...Object.keys(pkg.devDependencies || {}),
//       ...Object.keys(pkg.peerDependencies || {}),
//     ],
//     plugins: [
//       json(),
//       typescript({
//         typescript: require("typescript"),
//       }),
//       resolve(),
//       commonjs(),
//       uglify(),
//     ],
//   },
// ];

import dts from "rollup-plugin-dts";
import esbuild from "rollup-plugin-esbuild";
import json from "@rollup/plugin-json";
import jsdoc from "rollup-plugin-jsdoc";

const name = require("./package.json").main.replace(/\.js$/, "");

const bundle = (config) => ({
  ...config,
  input: "./src/index.ts",
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
    input: "./src/index.ts",
    plugins: [
      jsdoc({
        args: ["-d", "doc"], // Command-line options passed to JSDoc, Note: use "config" to indicate configuration file, do not use "-c" or "--configure" in "args"
        config: "jsdoc.config.json", // Path to the configuration file for JSDoc. Default: jsdoc.json
      }),
    ],
  }),
  // bundle({
  //   plugins: [dts()],
  //   output: {
  //     file: `${name}.d.ts`,
  //     format: "es",
  //   },
  // }),
];
