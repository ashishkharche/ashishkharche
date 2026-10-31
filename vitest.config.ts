import { defineConfig } from 'vitest/config'
import { mdxFrontmatter, pele } from './plugins/content.ts'
import { datesPlugin } from './plugins/dates.ts'

export default defineConfig({
  plugins: [pele(), mdxFrontmatter(), datesPlugin()],
  resolve: { tsconfigPaths: true },
  test: {
    include: ['tests/unit/**/*.test.ts'],
    environment: 'node',
  },
})
