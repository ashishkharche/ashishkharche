import mdx from '@mdx-js/rollup'
import stylex from '@stylexjs/unplugin'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import { defineConfig } from 'vite'
import { fileURLToPath } from 'node:url'
import { mdxFrontmatter, pele } from './plugins/content.ts'

const root = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig(({ command }) => ({
  resolve: {
    tsconfigPaths: true,
  },
  server: {
    port: 3000,
  },
  plugins: [
    pele(),
    mdxFrontmatter(),
    {
      enforce: 'pre',
      ...mdx({
        remarkPlugins: [remarkFrontmatter, [remarkMdxFrontmatter, { name: 'frontmatter' }]],
        providerImportSource: undefined,
      }),
    },
    stylex.vite({
      dev: command === 'serve',
      runtimeInjection: false,
      useCSSLayers: { before: ['reset'] },
      unstable_moduleResolution: { type: 'commonJS', rootDir: root },
      aliases: { '~/*': [`${root}src/*`] },
    }),
    tanstackStart({
      prerender: {
        enabled: true,
        crawlLinks: true,
        autoSubfolderIndex: true,
        failOnError: true,
      },
      pages: [{ path: '/404', prerender: { enabled: true, outputPath: '/404.html' } }],
    }),
    viteReact({ include: /\.(mdx|jsx|tsx)$/ }),
  ],
}))
