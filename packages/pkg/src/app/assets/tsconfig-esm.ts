const createTsConfigEsm = (base: string) => ({
  extends: `${base}/esm`,
  compilerOptions: {
    outDir: 'dist/esm',
    declarationDir: './dist/esm/types',
  },
  include: ['src/**/*'],
});

export { createTsConfigEsm };
