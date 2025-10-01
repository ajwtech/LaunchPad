/**
 * SPDX-License-Identifier: MIT
 * Copyright (c) 2024 AJW Tech
 */

'use strict';

module.exports = ({ strapi }) => ({
  async getAvailable() {
    const config = strapi.config.get('plugin.llm-agent', {});
    const providers = [];

    // Check each provider configuration
    if (config.providers?.openai?.enabled) {
      providers.push({
        id: 'openai',
        name: 'OpenAI',
        models: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo'],
        features: ['generateDraft', 'seoOptimize', 'streaming'],
        status: config.providers.openai.apiKey ? 'configured' : 'missing-key',
      });
    }

    if (config.providers?.anthropic?.enabled) {
      providers.push({
        id: 'anthropic', 
        name: 'Anthropic',
        models: ['claude-3-5-sonnet-20241022', 'claude-3-5-haiku-20241022', 'claude-3-opus-20240229'],
        features: ['generateDraft', 'seoOptimize', 'streaming'],
        status: config.providers.anthropic.apiKey ? 'configured' : 'missing-key',
      });
    }

    if (config.providers?.bedrock?.enabled) {
      providers.push({
        id: 'bedrock',
        name: 'AWS Bedrock',
        models: ['anthropic.claude-3-5-sonnet-20241022-v2:0', 'anthropic.claude-3-haiku-20240307-v1:0'],
        features: ['generateDraft', 'seoOptimize', 'streaming'],
        status: config.providers.bedrock.accessKeyId && config.providers.bedrock.secretAccessKey ? 'configured' : 'missing-credentials',
      });
    }

    if (config.providers?.github?.enabled) {
      providers.push({
        id: 'github',
        name: 'GitHub Models',
        models: ['gpt-4o', 'gpt-4o-mini', 'claude-3-5-sonnet'],
        features: ['generateDraft', 'seoOptimize'],
        status: config.providers.github.token ? 'configured' : 'missing-token',
      });
    }

    if (config.providers?.xai?.enabled) {
      providers.push({
        id: 'xai',
        name: 'xAI Grok',
        models: ['grok-beta', 'grok-vision-beta'],
        features: ['generateDraft', 'seoOptimize'],
        status: config.providers.xai.apiKey ? 'configured' : 'missing-key',
      });
    }

    return {
      providers,
      total: providers.length,
      configured: providers.filter(p => p.status === 'configured').length,
    };
  },
});