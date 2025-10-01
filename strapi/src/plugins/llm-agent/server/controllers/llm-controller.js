/**
 * SPDX-License-Identifier: MIT
 * Copyright (c) 2024 AJW Tech
 */

'use strict';

module.exports = ({ strapi }) => ({
  async generateDraft(ctx) {
    try {
      const { contentType, documentId, locale, prompt, provider, model } = ctx.request.body;
      
      // Check permissions
      await strapi.admin.services.permission.check(ctx.state.user, 'plugin::llm-agent.generate-draft');
      
      const result = await strapi.plugin('llm-agent').service('llm').generateDraft({
        contentType,
        documentId,
        locale,
        prompt,
        provider,
        model,
        user: ctx.state.user,
      });
      
      ctx.send(result);
    } catch (error) {
      ctx.throw(500, error);
    }
  },

  async seoOptimize(ctx) {
    try {
      const { contentType, documentId, locale, provider, model } = ctx.request.body;
      
      // Check permissions
      await strapi.admin.services.permission.check(ctx.state.user, 'plugin::llm-agent.seo-optimize');
      
      const result = await strapi.plugin('llm-agent').service('llm').seoOptimize({
        contentType,
        documentId,
        locale,
        provider,
        model,
        user: ctx.state.user,
      });
      
      ctx.send(result);
    } catch (error) {
      ctx.throw(500, error);
    }
  },

  async insertSuggestions(ctx) {
    try {
      const { contentType, documentId, locale, suggestions } = ctx.request.body;
      
      // Check permissions  
      await strapi.admin.services.permission.check(ctx.state.user, 'plugin::llm-agent.insert-suggestions');
      
      const result = await strapi.plugin('llm-agent').service('llm').insertSuggestions({
        contentType,
        documentId,
        locale,
        suggestions,
        user: ctx.state.user,
      });
      
      ctx.send(result);
    } catch (error) {
      ctx.throw(500, error);
    }
  },

  async getProviders(ctx) {
    try {
      const providers = await strapi.plugin('llm-agent').service('providers').getAvailable();
      ctx.send(providers);
    } catch (error) {
      ctx.throw(500, error);
    }
  },

  async getMetrics(ctx) {
    try {
      // Check permissions
      await strapi.admin.services.permission.check(ctx.state.user, 'plugin::llm-agent.view-metrics');
      
      const metrics = await strapi.plugin('llm-agent').service('metrics').getUserMetrics(ctx.state.user.id);
      ctx.send(metrics);
    } catch (error) {
      ctx.throw(500, error);
    }
  },
});