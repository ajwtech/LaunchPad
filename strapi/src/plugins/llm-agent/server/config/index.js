/**
 * SPDX-License-Identifier: MIT
 * Copyright (c) 2024 AJW Tech
 */

'use strict';

module.exports = {
  default: {
    // Default plugin configuration
    enabled: true,
    providers: {
      openai: {
        enabled: false,
        apiKey: process.env.OPENAI_API_KEY,
        defaultModel: 'gpt-4o',
        maxTokens: 4000,
      },
      anthropic: {
        enabled: false,
        apiKey: process.env.ANTHROPIC_API_KEY,
        defaultModel: 'claude-3-5-sonnet-20241022',
        maxTokens: 4000,
      },
      bedrock: {
        enabled: false,
        region: process.env.AWS_REGION || 'us-east-1',
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        defaultModel: 'anthropic.claude-3-5-sonnet-20241022-v2:0',
        maxTokens: 4000,
      },
      github: {
        enabled: false,
        token: process.env.GITHUB_TOKEN,
        defaultModel: 'gpt-4o',
        maxTokens: 4000,
      },
      xai: {
        enabled: false,
        apiKey: process.env.XAI_API_KEY,
        defaultModel: 'grok-beta',
        maxTokens: 4000,
      },
    },
    features: {
      generateDraft: true,
      seoOptimize: true,
      insertSuggestions: true,
      streaming: true,
      auditLog: false, // Default OFF as per requirements
    },
    limits: {
      maxTokensPerRequest: 8000,
      maxRequestsPerHour: 100,
      maxCostPerDay: 10.00, // USD
    },
  },
  validator() {
    // Configuration validation
  },
};