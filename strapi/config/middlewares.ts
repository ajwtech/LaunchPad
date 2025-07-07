export default [
  'strapi::logger',
  'strapi::errors',
   {
    name: "strapi::security",
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          "connect-src": ["'self'", "https:"],
          "img-src": [
            "'self'",
            "data:",
            "blob:",
            "https://market-assets.strapi.io",
            /**
             * Note: If using a STORAGE_URL replace `https://${process.env.STORAGE_ACCOUNT}.blob.core.windows.net` w/ process.env.STORAGE_URL
             * If using a CDN URL make sure to include that url in the CSP headers process.env.STORAGE_CDN_URL
             */
            `https://${process.env.STORAGE_ACCOUNT_NAME}.blob.core.windows.net`,
          ],
          "media-src": [
            "'self'",
            "data:",
            "blob:",
            "https://market-assets.strapi.io",
            /**
             * Note: If using a STORAGE_URL replace `https://${process.env.STORAGE_ACCOUNT}.blob.core.windows.net` w/ process.env.STORAGE_URL
             * If using a CDN URL make sure to include that url in the CSP headers process.env.STORAGE_CDN_URL
             */
            `https://${process.env.STORAGE_ACCOUNT_NAME}.blob.core.windows.net`,

          ],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  'strapi::cors',
  {
    name: 'strapi::cors',
    config: {
      origin: (() => {
        const domain = process.env.DOMAIN;
        if (!domain) {
          // During build time, allow all origins since env vars aren't available
          return ['*'];
        }
        const baseDomain = domain.replace(/^cms\./, '');
        return [
          `https://${domain}`,
          `https://beta.${baseDomain}`,
          // Add localhost for development
          'http://localhost:3000',
          'http://localhost:1337'
        ];
      })(),
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      headers: '*',
      credentials: true,
    },
  },
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
  'global::deepPopulate'
];
