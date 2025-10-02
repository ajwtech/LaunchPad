/**
 * SPDX-License-Identifier: MIT
 * Copyright (c) 2024 AJW Tech
 */

import { Sparkle } from '@strapi/icons';
import pluginId from './src/pluginId';

export default {
  register(app) {
    // Register plugin
    app.addMenuLink({
      to: `llm-agent`,
      icon: Sparkle,
      intlLabel: {
        id: `${pluginId}.plugin.name`,
        defaultMessage: 'LLM Agent',
      },
      Component: async () => {
        return import('./src/pages/Settings');
      },
    });

    // Register settings link
    app.registerPlugin({
      id: pluginId,
      name: pluginId,
    });

    console.log('LLM Agent Plugin: Admin panel registered');
  },

  bootstrap(app) {
    // Bootstrap admin panel logic
    console.log('LLM Agent Plugin: Admin panel bootstrapped');
  },

  async registerTrads({ locales }) {
    const importedTrads = await Promise.all(
      locales.map((locale) => {
        return import(`./src/translations/${locale}.json`)
          .then(({ default: data }) => {
            return {
              data,
              locale,
            };
          })
          .catch(() => {
            return {
              data: {},
              locale,
            };
          });
      })
    );

    return Promise.resolve(importedTrads);
  },
};
