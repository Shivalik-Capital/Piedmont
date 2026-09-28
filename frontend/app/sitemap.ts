import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://piedmont-two.vercel.app'; // Replace with actual production URL

  // Define core static routes
  const routes = [
    '',
    '/dashboard',
    '/screener',
    '/macro',
    '/equities',
    '/commodities',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Add the static macro learning pages
  const macros = [
    'rbi-repo-rate', 'reverse-repo', 'standing-deposit-facility', 
    'wpi-inflation', 'iip-growth', 'fii-flows-mtd', 'dii-flows-mtd',
    'govt-borrowing', 'current-account', 'next-rbi-mpc', 'next-event',
    'gdp-growth', 'cpi-inflation', 'interest-rate', 'unemployment',
    'forex-reserves', 'trade-balance', 'fiscal-deficit', 'manufacturing-pmi'
  ];

  const macroRoutes = macros.map(slug => ({
    url: `${baseUrl}/learn/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...routes, ...macroRoutes];
}
