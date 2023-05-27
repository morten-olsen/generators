export default {
  scripts: {
    'build:cjs': 'tsc -p tsconfig.json',
    'build:esm': 'tsc -p tsconfig.esm.json',
    build: 'pnpm build:esm && pnpm build:cjs',
  },
  types: './dist/cjs/types/index.d.ts',
  main: './dist/cjs/index.js',
  files: ['dist/**/*'],
  exports: {
    '.': {
      import: {
        types: './dist/esm/types/index.d.ts',
        default: './dist/esm/index.js',
      },
      require: {
        types: './dist/cjs/types/index.d.ts',
        default: './dist/cjs/index.js',
      },
    },
  },
  devDependencies: {
    typescript: '^5.0.4',
  },
};
