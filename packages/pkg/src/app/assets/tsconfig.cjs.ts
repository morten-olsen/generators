const createTsConfigCjs = (base: string) => ({
  extends: `${base}/tsc/tsconfig.cjs.json`,
  compilerOptions: {
    outDir: '../dist/cjs',
    declarationDir: '../dist/cjs/types',
  },
  include: ['../src/**/*'],
});

export { createTsConfigCjs };
