const createTsConfigEsm = (base: string) => ({
  extends: `${base}/tsc/tsconfig.esm.json`,
  compilerOptions: {
    outDir: '../dist/esm',
    declarationDir: '../dist/esm/types',
  },
  include: ['../src/**/*'],
});

export { createTsConfigEsm };
