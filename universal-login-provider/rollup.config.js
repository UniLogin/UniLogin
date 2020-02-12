import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import {terser} from 'rollup-plugin-terser';

import pkg from './package.json';

export default {
  input: 'src/index.ts',
  output: {
    name: 'ULIFrameProvider',
    file: pkg.browser,
    format: 'umd',
  },
  plugins: [
    typescript(),
    resolve(),
    commonjs(),
    terser({output: {comments: false}}),
  ],
};
