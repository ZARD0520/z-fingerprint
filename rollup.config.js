import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.esm.js',
      format: 'esm'
    },
    {
      file: 'dist/index.cjs.js',
      format: 'cjs'
    },
    {
      file: 'dist/index.umd.js',
      format: 'umd',
      name: 'BrowserFingerprint'
    }
  ],
  plugins: [
    nodeResolve(),
    commonjs(),
    typescript({
      declaration: true,
      declarationDir: 'types'
    }),
    terser()
  ],
  external: ['lodash'] // 按需添加外部依赖
};