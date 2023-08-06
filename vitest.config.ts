import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    alias: {
      graphql: path.resolve(__dirname, 'node_modules/graphql/index.js'),
    },
    // ... Other options
  },
});
