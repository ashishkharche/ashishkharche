import { defineConfig } from 'vitest/config'
import { mdxFrontmatter, pele } from './plugins/content.ts'

export default defineConfig({
  plugins: [pele(), mdxFrontmatter()],
  resolve: { tsconfigPaths: true },
  test: {
    include: ['tests/unit/**/*.test.ts'],
    environment: 'node',
  },
})
