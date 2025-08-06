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
          "frame-src": ["'self'", "http://localhost:3000", "https:"],
          "img-src": [
            "'self'",
            "data:",
            "blob:",
            "https://market-assets.strapi.io",
            // Production Azure Storage (for direct CDN access if configured)
            ...(process.env.STORAGE_URL ? [process.env.STORAGE_URL] : []),
            ...(process.env.STORAGE_ACCOUNT_NAME && !process.env.STORAGE_URL ? [`https://${process.env.STORAGE_ACCOUNT_NAME}.blob.core.windows.net`] : []),
            "http://localhost:10000", // Azurite for local development
          ],
          "media-src": [
            "'self'",
            "data:",
            "blob:",
            "https://market-assets.strapi.io",
            // Production Azure Storage (for direct CDN access if configured)
            ...(process.env.STORAGE_URL ? [process.env.STORAGE_URL] : []),
            ...(process.env.STORAGE_ACCOUNT_NAME && !process.env.STORAGE_URL ? [`https://${process.env.STORAGE_ACCOUNT_NAME}.blob.core.windows.net`] : []),
            "http://localhost:10000", // Azurite for local development
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
