import typescript from 'rollup-plugin-typescript2'
import { terser } from 'rollup-plugin-terser'
import pkg from './package.json'

let defaults = { compilerOptions: { declaration: true } }
let override = { compilerOptions: { declaration: false } }

export default {
  input: 'src/index.ts',
  output: {
    file: 'lib/index.js',
    format: 'cjs',
  },
  plugins: [
    typescript({
      typescript: require('typescript'),
      tsconfigDefaults: defaults,
      tsconfig: 'tsconfig.json',
      tsconfigOverride: override,
    }),
    terser(), // minifies generated bundles
  ],
  external: [...Object.keys(pkg.dependencies || {})],
}
