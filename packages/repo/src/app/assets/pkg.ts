export default {
  private: true,
  version: '0.0.1',
  scripts: {
    build: 'turbo build',
    dev: 'turbo dev',
    start: 'turbo start',
    test: 'turbo test',
    lint: 'eslint packages/*/src',
  },
  dependencies: {
    turbo: '^1.9.9',
    prettier: '^2.8.3',
    '@react-native-community/eslint-config': '^3.2.0',
    eslint: '^8.33.0',
  },
};
