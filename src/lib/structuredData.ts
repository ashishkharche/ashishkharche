import { site } from '~/content/site'

export const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: site.name,
  jobTitle: 'Software Engineer',
  url: `${site.url}/`,
  email: `mailto:${site.email}`,
  address: { '@type': 'PostalAddress', addressLocality: site.city, addressCountry: 'GB' },
  alumniOf: { '@type': 'CollegeOrUniversity', name: 'Kingston University' },
  sameAs: [site.linkedin, site.github],
} as const
