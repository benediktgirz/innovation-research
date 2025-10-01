import redirects from 'lume/middlewares/redirects.ts';

export const definitions = {
  // Legacy content redirects
  '/w9': '/extras/w9.pdf',
  '/14/08/why-is-it-so-hard/': '/videos/why-is-it-so-hard/',
  '/18/03/rainbows-rainier/': '/videos/rainbows-rainier/',
  '/17/03/bey-toe-ven/': '/videos/bey-toe-ven/',
  '/16/03/past-to-find-the-future/': '/videos/past-to-find-the-future/',
  '/15/06/cooke-blowin-in-the-wind/': '/videos/cooke-blowin-in-the-wind/',
  '/14/09/apple-in-your-mouth/': '/videos/apple-in-your-mouth/',
  '/14/09/long-shadows/': '/videos/long-shadows/',
  '/tag/summer': '/writings',
  '/tag/video': '/writings',
  '/tag/twitter': '/writings',
  '/tag/movies': '/writings',
  '/tag/music': '/writings',
  '/tag/nyc': '/writings',
  '/feeds/rss.xml': '/writings',
  '/tags': '/writings',
  '/archives': '/writings',

  // Common 404 patterns - redirect to appropriate pages
  '/cv': '/resume/',
  '/cv/': '/resume/',
  '/curriculum': '/resume/',
  '/curriculum/': '/resume/',
  '/lebenslauf': '/de/lebenslauf/',
  '/blog': '/',
  '/blog/': '/',
  '/posts': '/',
  '/posts/': '/',
  '/work': '/experience/',
  '/work/': '/experience/',
  '/portfolio': '/experience/',
  '/portfolio/': '/experience/',
  '/services': '/contact/',
  '/services/': '/contact/',
  '/hire': '/contact/',
  '/hire/': '/contact/',
  '/booking': '/contact/',
  '/booking/': '/contact/',
  '/impressum': '/legal/',
  '/impressum/': '/legal/',
  '/datenschutz': '/privacy/',
  '/datenschutz/': '/privacy/',
  '/privacy-policy': '/privacy/',
  '/privacy-policy/': '/privacy/',
  '/discovery': {
    to: 'https://coaching.benedikt-girz.com/book/complimentary-coaching-consultation',
    code: 302,
  },
  '/vip': {
    to: 'https://coaching.benedikt-girz.com/book/vip-catch-up',
    code: 302,
  },
  '/calp': {
    to: '/vip',
    code: 302,
  },
  '/cal': {
    to: '/vip',
    code: 302,
  },
  '/mailto': {
    to: 'mailto:benedikt@benedikt-girz.com?subject=Hi!',
    code: 302,
  },
};

export default redirects({
  redirects: definitions as Record<
    string,
    | string
    | {
        to: string;
        code: 301 | 302 | 303 | 307 | 308 | 200;
      }
  >,
  strict: false,
});
