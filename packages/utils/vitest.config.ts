import { defineConfig } from 'vitest/config';
export default defineConfig({
  test: {
    include: ['**/*.test.{ts,js}'],
    environment: 'node',
    testTimeout: 1000 * 30,
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,js}'],
    },
  },
});
