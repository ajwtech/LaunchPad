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
      policies: [],
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
      policies: [],
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
      policies: [],
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
      policies: [],
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
      policies: [],
      auth: {
        scope: ['admin::is-authenticated']
      }
    },
  },
];