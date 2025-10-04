/**
 * SPDX-License-Identifier: MIT
 * Copyright (c) 2024 AJW Tech
 */

import { Sparkle } from '@strapi/icons';

const PLUGIN_ID = 'llm-agent';

export default {
  register(app) {
    // Register plugin
    app.registerPlugin({
      id: PLUGIN_ID,
      name: PLUGIN_ID,
    });

    // Register main menu link
    app.addMenuLink({
      to: `llm-agent`,
      icon: Sparkle,
      intlLabel: {
        id: `${PLUGIN_ID}.plugin.name`,
        defaultMessage: 'LLM Agent',
      },
      Component: async () => {
        return import('./src/pages/SettingsPage');
      },
    });

    console.log('LLM Agent Plugin: Admin panel registered');
  },

  async bootstrap(app) {
    console.log('LLM Agent Plugin: Admin panel bootstrapped');
  },

  async registerTrads({ locales }) {
    const importedTrads = await Promise.all(
      locales.map((locale) => {
        return import(`./src/translations/${locale}.js`)
          .then(({ default: data }) => {
            return {
              data: prefixPluginTranslations(data, PLUGIN_ID),
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

// Helper function to prefix translation keys
function prefixPluginTranslations(trad, pluginId) {
  return Object.keys(trad).reduce((acc, current) => {
    acc[`${pluginId}.${current}`] = trad[current];
    return acc;
  }, {});
};