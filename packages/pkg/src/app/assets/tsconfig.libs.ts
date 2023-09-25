const createTsConfigLibs = () => ({
  include: [],
  references: [
    {
      path: './tsconfig.cjs.json',
    },
    {
      path: './tsconfig.esm.json',
    },
  ],
});

export { createTsConfigLibs };
