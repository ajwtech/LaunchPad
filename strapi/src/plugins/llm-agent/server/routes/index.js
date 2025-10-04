/**
 * SPDX-License-Identifier: MIT
 * Copyright (c) 2024 AJW Tech
 */

'use strict';

module.exports = {
  admin: {
    type: 'admin',
    routes: [
      {
        method: 'POST',
        path: '/generate-draft',
        handler: 'llm.generateDraft',
        config: {
          policies: ['plugin::llm-agent.rate-limit', 'plugin::llm-agent.validate-content-type'],
        },
      },
      {
        method: 'POST',
        path: '/seo-optimize',
        handler: 'llm.seoOptimize',
        config: {
          policies: ['plugin::llm-agent.rate-limit', 'plugin::llm-agent.validate-content-type'],
        },
      },
      {
        method: 'POST',
        path: '/insert-suggestions',
        handler: 'llm.insertSuggestions',
        config: {
          policies: ['plugin::llm-agent.rate-limit', 'plugin::llm-agent.validate-content-type'],
        },
      },
      {
        method: 'GET',
        path: '/providers',
        handler: 'llm.getProviders',
        config: {
          policies: ['plugin::llm-agent.rate-limit'],
        },
      },
      {
        method: 'GET', 
        path: '/metrics',
        handler: 'llm.getMetrics',
        config: {
          policies: ['plugin::llm-agent.rate-limit'],
        },
      },
      {
        method: 'GET',
        path: '/config',
        handler: 'llm.getConfig',
        config: {
          policies: ['plugin::llm-agent.rate-limit'],
        },
      },
      {
        method: 'PUT',
        path: '/config',
        handler: 'llm.updateConfig',
        config: {
          policies: ['plugin::llm-agent.rate-limit'],
        },
      },
      {
        method: 'POST',
        path: '/providers/:provider/models',
        handler: 'llm.getProviderModels',
        config: {
          policies: ['plugin::llm-agent.rate-limit'],
        },
      },
    ],
  },
};