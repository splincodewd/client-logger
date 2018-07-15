import pkg from './package.json';
import typescript from 'rollup-plugin-typescript2';
import path from 'path';

export default {
    input: path.resolve('index.ts'),
    output: [
        { file: pkg.main, format: 'umd', name: pkg.name, sourcemap: true }
    ],
    plugins: [
        typescript()
    ]
}
