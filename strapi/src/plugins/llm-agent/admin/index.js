/**
 * SPDX-License-Identifier: MIT
 * Copyright (c) 2024 AJW Tech
 */

import { Sparkle } from '@strapi/icons';

const PLUGIN_ID = 'llm-agent';

export default {
  register(app) {
    // Register plugin settings link
    app.createSettingsSection(
      {
        id: PLUGIN_ID,
        intlLabel: {
          id: `${PLUGIN_ID}.plugin.name`,
          defaultMessage: 'LLM Agent',
        },
      },
      [
        {
          intlLabel: {
            id: `${PLUGIN_ID}.settings.title`,
            defaultMessage: 'Configuration',
          },
          id: 'settings',
          to: `/settings/${PLUGIN_ID}`,
          Component: async () => {
            const component = await import('./src/pages/SettingsPage');
            return component;
          },
        },
      ]
    );

    // Register main menu link
    app.addMenuLink({
      to: `/plugins/${PLUGIN_ID}`,
      icon: Sparkle,
      intlLabel: {
        id: `${PLUGIN_ID}.plugin.name`,
        defaultMessage: 'LLM Agent',
      },
      Component: async () => {
        const component = await import('./src/pages/HomePage');
        return component;
      },
      permissions: [],
    });

    app.registerPlugin({
      id: PLUGIN_ID,
      name: PLUGIN_ID,
    });
  },

  async bootstrap(app) {
    // Nothing to bootstrap yet
  },
};