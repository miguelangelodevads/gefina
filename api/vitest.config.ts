import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    setupFiles: ['./src/test.setup.ts'],
    include: ['./src/tests/invoice.test.ts'],
    testTimeout: 10000,
    hookTimeout: 10000
  }
});
