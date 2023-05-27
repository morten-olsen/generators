const createTsConfigCjs = (base: string) => ({
  extends: `${base}/cjs`,
  compilerOptions: {
    outDir: 'dist/cjs',
    declarationDir: './dist/cjs/types',
  },
  include: ['src/**/*'],
});

export { createTsConfigCjs };
