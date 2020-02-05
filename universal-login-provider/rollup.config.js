import typescript from '@rollup/plugin-typescript'

import pkg from './package.json'

export default {
  input: 'src/index.ts',
  output: {
    name: 'ULIFrameProvider',
    file: pkg.browser,
    format: 'umd'
  },
  plugins: [
    typescript()
  ]
}
