/**
 * SPDX-License-Identifier: MIT
 * Copyright (c) 2024 AJW Tech
 */

import { getFetchClient } from '@strapi/strapi/admin';

const { get, put, post } = getFetchClient();

export const settingsApi = {
  async getConfig() {
    const { data } = await get('/llm-agent/config');
    return data;
  },

  async updateConfig(config) {
    const { data } = await put('/llm-agent/config', config);
    return data;
  },

  async getProviderModels(provider, credentials) {
    const { data } = await post(`/llm-agent/providers/${provider}/models`, { credentials });
    return data;
  },
};

export const providersApi = {
  async getProviders() {
    const { data } = await get('/llm-agent/providers');
    return data;
  },
};

export const contentApi = {
  async generateDraft(params) {
    const { data } = await post('/llm-agent/generate-draft', params);
    return data;
  },

  async seoOptimize(params) {
    const { data } = await post('/llm-agent/seo-optimize', params);
    return data;
  },

  async insertSuggestions(params) {
    const { data } = await post('/llm-agent/insert-suggestions', params);
    return data;
  },
};

export const metricsApi = {
  async getMetrics() {
    const { data } = await get('/llm-agent/metrics');
    return data;
  },
};
