import typescript from '@rollup/plugin-typescript'
import resolve from '@rollup/plugin-node-resolve'
import json from '@rollup/plugin-json'
import { terser } from "rollup-plugin-terser";


import pkg from './package.json'

export default {
  input: 'src/index.ts',
  output: {
    name: 'ULIFrameProvider',
    file: pkg.browser,
    format: 'umd',
  },
  plugins: [
    resolve({
      only: ['@universal-login/commons', /universal-login/],
      modulesOnly: true,
    }),
    json(),
    typescript(),
    terser(),
  ]
}
