export default () => ({
  'llm-agent': {
    enabled: true,
    resolve: './src/plugins/llm-agent',
  },
  upload: {
    config: {
      provider: 'strapi-provider-upload-azure-storage',
      providerOptions: {
        authType: 'default',
        account: process.env.STORAGE_ACCOUNT_NAME,
        accountKey: process.env.STORAGE_ACCOUNT_KEY,
        containerName: 'assets',
        defaultPath: 'assets',
        defaultCacheControl: process.env.STORAGE_CACHE_CONTROL,
        serviceBaseURL: process.env.STORAGE_URL,
      },
    },
  },
});
