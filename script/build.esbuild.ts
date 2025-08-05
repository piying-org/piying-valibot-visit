import * as esbuild from 'esbuild';
import { copy } from 'esbuild-plugin-copy';
import { clean } from 'esbuild-plugin-clean';
async function main() {
  let options: esbuild.BuildOptions = {
    platform: 'node',
    bundle: true,
    splitting: true,
    format: 'esm',
    keepNames: false,
    outExtension: {
      '.js': '.mjs',
    },
    sourcemap: true,
    plugins: [
      copy({
        assets: [{ from: `./assets/*`, to: './' }],
      }),
      clean({ patterns: ['./dist/*'] }),
    ],
    entryPoints: [
      {
        in: 'src/index.ts',
        out: 'index',
      },
    ],
    outdir: './dist',
    tsconfig: 'tsconfig.json',
    packages: 'external',
  };
  await esbuild.build(options);
}
main();
