import * as esbuild from 'esbuild';
import * as path from 'path';
import {sync} from 'fast-glob';

async function main() {
  let options: esbuild.BuildOptions = {
    platform: 'node',
    sourcemap: 'linked',
    entryPoints: [
      ...sync('./test/**/*.spec.ts', {}).map((item) => {
        return { in: item, out: path.join('', item.slice(0, -3)) };
      }),
    ],
    outdir: path.join(process.cwd(), './test-dist'),
    tsconfig: 'tsconfig.spec.json',
    packages: 'bundle',
    inject: [path.join(process.cwd(), './script/cjs-shim.ts')],
    outExtension: {
      '.js': '.mjs',
    },
    bundle: true,
    format: 'esm',
  };
  await esbuild.build(options);
}
main();
