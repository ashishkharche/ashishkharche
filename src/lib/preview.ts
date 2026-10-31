/** Width and height from a PNG's header, or undefined if it is not a PNG. */
export function pngSize(data: Uint8Array): { width: number; height: number } | undefined {
  const signature = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]
  if (data.length < 24 || signature.some((byte, i) => data[i] !== byte)) return undefined
  const view = new DataView(data.buffer, data.byteOffset, data.byteLength)
  return { width: view.getUint32(16), height: view.getUint32(20) }
}

function metaContent(html: string, key: string): string | undefined {
  const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const match = new RegExp(`<meta (?:property|name)="${escaped}" content="([^"]*)"`).exec(html)
  return match?.[1]
}

/**
 * Checks the link preview tags of a built page. Returns the problems found
 * and the site path of the preview image, so the caller can check the file.
 */
export function checkPreviewTags(html: string, siteUrl: string): { problems: string[]; imagePath?: string } {
  const problems: string[] = []
  for (const key of ['og:title', 'og:description', 'twitter:title', 'twitter:description', 'og:image:alt']) {
    if (!metaContent(html, key)) problems.push(`missing ${key}`)
  }
  if (metaContent(html, 'twitter:card') !== 'summary_large_image')
    problems.push('twitter:card is not summary_large_image')
  if (metaContent(html, 'og:image:width') !== '1200' || metaContent(html, 'og:image:height') !== '630') {
    problems.push('og:image size is not declared as 1200x630')
  }
  const image = metaContent(html, 'og:image')
  if (!image) return { problems: [...problems, 'missing og:image'] }
  if (metaContent(html, 'twitter:image') !== image) problems.push('twitter:image differs from og:image')
  if (!image.startsWith(`${siteUrl}/`)) {
    problems.push(`og:image is not an absolute ${siteUrl} URL: ${image}`)
    return { problems }
  }
  return { problems, imagePath: image.slice(siteUrl.length) }
}
