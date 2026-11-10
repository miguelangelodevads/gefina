import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    setupFiles: ['./test.setup.ts'],
    include: ['./invoice.test.ts'],
    testTimeout: 10000,
    hookTimeout: 10000,
  },
});
