/**
 * SPDX-License-Identifier: MIT
 * Copyright (c) 2024 AJW Tech
 */

'use strict';

module.exports = ({ strapi }) => {
  // Register plugin permissions
  const actions = [
    {
      section: 'plugins',
      displayName: 'Generate Draft',
      uid: 'generate-draft',
      pluginName: 'llm-agent',
    },
    {
      section: 'plugins',
      displayName: 'SEO Optimize',
      uid: 'seo-optimize',
      pluginName: 'llm-agent',
    },
    {
      section: 'plugins',
      displayName: 'Insert Suggestions',
      uid: 'insert-suggestions',
      pluginName: 'llm-agent',
    },
    {
      section: 'plugins',
      displayName: 'Switch Provider',
      uid: 'switch-provider',
      pluginName: 'llm-agent',
    },
    {
      section: 'plugins',
      displayName: 'View Metrics',
      uid: 'view-metrics',
      pluginName: 'llm-agent',
    },
  ];

  strapi.admin.services.permission.actionProvider.registerMany(actions);
  
  console.log('LLM Agent Plugin: Server registered with permissions');
};