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
      maxPromptLength: 5000, // Characters
    },
    security: {
      // Security settings
      validateInput: true,
      sanitizeOutput: true,
      logSensitiveData: false,
      requireStrongAuth: true,
      // Allowed content type patterns
      allowedContentTypes: [
        /^api::[a-z0-9-]+\.[a-z0-9-]+$/,
        /^plugin::[a-z0-9-]+\.[a-z0-9-]+$/,
      ],
      // Blocked keywords in prompts (security)
      blockedKeywords: [
        'password',
        'secret',
        'token',
        'key',
        'credential',
        'private',
        'confidential',
      ],
    },
  },
  validator(config) {
    // Configuration validation
    if (config.limits) {
      if (config.limits.maxTokensPerRequest > 32000) {
        throw new Error('maxTokensPerRequest cannot exceed 32000');
      }
      if (config.limits.maxRequestsPerHour > 1000) {
        throw new Error('maxRequestsPerHour cannot exceed 1000');
      }
      if (config.limits.maxPromptLength > 10000) {
        throw new Error('maxPromptLength cannot exceed 10000 characters');
      }
    }
    
    // Validate at least one provider is configured
    const providers = config.providers || {};
    const enabledProviders = Object.values(providers).filter(p => p.enabled);
    if (enabledProviders.length === 0) {
      strapi.log.warn('No LLM providers are enabled. The plugin will not function until at least one provider is configured.');
    }
  },
};