export default {
  scripts: {
    build: 'tsc --build configs/tsconfig.libs.json',
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
