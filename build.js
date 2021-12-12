import { rm, readFile } from 'fs/promises'
import { build } from 'esbuild'

rm('./dist', { force: true, recursive: true })
  .then(() => readFile('./package.json', { encoding: 'utf8' }))
  .then(JSON.parse)
  .then(({ dependencies = {} }) => build({
    bundle: true,
    entryPoints: ['src/app.ts'],
    external: Object.keys(dependencies),
    format: 'esm',
    logLevel: 'info',
    minify: true,
    outdir: 'dist',
    platform: 'node',
    sourcemap: true,
    target: 'node16'
  }))
