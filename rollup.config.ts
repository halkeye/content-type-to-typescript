import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import sourceMaps from 'rollup-plugin-sourcemaps';

// tslint:disable-next-line:no-var-requires
const pkg = require('./package.json');

export default [
  {
    input: `compiled/content-type-to-typescript.js`,
    output: [{ file: pkg.main, format: 'cjs' }],
    sourcemap: true,
    // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
    external: ['lodash', 'contentful', 'json-schema-to-typescript'],
    watch: {
      include: 'compiled/**',
    },
    plugins: [commonjs(), resolve(), sourceMaps()],
  },
  {
    input: `compiled/cli.js`,
    output: [
      {
        file: pkg.bin,
        format: 'cjs',
        banner: '#!/usr/bin/env node',
      },
    ],
    sourcemap: true,
    // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
    external: ['lodash', 'contentful', 'contentful-management', 'json-schema-to-typescript', 'commander', 'chalk'],
    watch: {
      include: 'compiled/**',
    },
    plugins: [commonjs(), resolve(), sourceMaps()],
  },
];
