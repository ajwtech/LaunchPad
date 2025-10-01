/**
 * SPDX-License-Identifier: MIT
 * Copyright (c) 2024 AJW Tech
 */

'use strict';

module.exports = [
  {
    method: 'POST',
    path: '/generate-draft',
    handler: 'llm.generateDraft',
    config: {
      policies: ['plugin::llm-agent.rate-limit', 'plugin::llm-agent.validate-content-type'],
      auth: {
        scope: ['admin::is-authenticated']
      }
    },
  },
  {
    method: 'POST',
    path: '/seo-optimize',
    handler: 'llm.seoOptimize',
    config: {
      policies: ['plugin::llm-agent.rate-limit', 'plugin::llm-agent.validate-content-type'],
      auth: {
        scope: ['admin::is-authenticated']
      }
    },
  },
  {
    method: 'POST',
    path: '/insert-suggestions',
    handler: 'llm.insertSuggestions',
    config: {
      policies: ['plugin::llm-agent.rate-limit', 'plugin::llm-agent.validate-content-type'],
      auth: {
        scope: ['admin::is-authenticated']
      }
    },
  },
  {
    method: 'GET',
    path: '/providers',
    handler: 'llm.getProviders',
    config: {
      policies: ['plugin::llm-agent.rate-limit'],
      auth: {
        scope: ['admin::is-authenticated']
      }
    },
  },
  {
    method: 'GET', 
    path: '/metrics',
    handler: 'llm.getMetrics',
    config: {
      policies: ['plugin::llm-agent.rate-limit'],
      auth: {
        scope: ['admin::is-authenticated']
      }
    },
  },
];