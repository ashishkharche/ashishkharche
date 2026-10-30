import { site } from '~/content/site'
import { absoluteUrl } from './urls'

export interface PageMeta {
  path: string
  /** Short page title, e.g. "Work". Leave out on the home page. */
  title?: string
  /** Full document title, when it should not be "<title> · Ashish Kharche". */
  fullTitle?: string
  description: string
  type?: 'website' | 'article' | 'profile'
  noindex?: boolean
}

type MetaTag =
  { title: string } | { name: string; content: string; media?: string } | { property: string; content: string }

export function documentTitle({ title, fullTitle }: Pick<PageMeta, 'title' | 'fullTitle'>): string {
  if (fullTitle) return fullTitle
  return title ? `${title} · ${site.name}` : site.name
}

/** Meta tags for a page: description, Open Graph and Twitter card. */
export function pageMeta(page: PageMeta): MetaTag[] {
  const url = absoluteUrl(page.path)
  const ogTitle = page.title ?? site.name
  const image = absoluteUrl(site.ogImage)
  const tags: MetaTag[] = [{ title: documentTitle(page) }, { name: 'description', content: page.description }]
  if (page.noindex) tags.push({ name: 'robots', content: 'noindex' })
  tags.push(
    { property: 'og:type', content: page.type ?? 'website' },
    { property: 'og:site_name', content: site.name },
    { property: 'og:title', content: ogTitle },
    { property: 'og:description', content: page.description },
    { property: 'og:url', content: url },
    { property: 'og:image', content: image },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    { property: 'og:image:alt', content: site.ogImageAlt },
    { property: 'og:locale', content: site.locale },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: ogTitle },
    { name: 'twitter:description', content: page.description },
    { name: 'twitter:image', content: image },
  )
  return tags
}

/** `head()` result for a route: meta tags plus the canonical link. */
export function seo(page: PageMeta) {
  return {
    meta: pageMeta(page),
    links: page.noindex ? [] : [{ rel: 'canonical', href: absoluteUrl(page.path) }],
  }
}
