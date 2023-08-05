import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  legacy: {
    alias: {
        graphql: path.resolve(__dirname, 'node_modules/graphql'),
      },
  },
  test: {
    alias: {
      graphql: path.resolve(__dirname, 'node_modules/graphql'),
    },
    // ... Other options
  },
});
