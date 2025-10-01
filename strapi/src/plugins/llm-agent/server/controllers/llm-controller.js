/**
 * SPDX-License-Identifier: MIT
 * Copyright (c) 2024 AJW Tech
 */

'use strict';

module.exports = ({ strapi }) => ({
  async generateDraft(ctx) {
    try {
      const { contentType, documentId, locale, prompt, provider, model } = ctx.request.body;
      
      // Input validation
      if (!contentType || typeof contentType !== 'string') {
        return ctx.badRequest('Content type is required and must be a string');
      }
      if (!prompt || typeof prompt !== 'string' || prompt.length > 5000) {
        return ctx.badRequest('Prompt is required, must be a string, and cannot exceed 5000 characters');
      }
      if (provider && typeof provider !== 'string') {
        return ctx.badRequest('Provider must be a string');
      }
      if (model && typeof model !== 'string') {
        return ctx.badRequest('Model must be a string');
      }
      
      // Check permissions
      await strapi.admin.services.permission.check(ctx.state.user, 'plugin::llm-agent.generate-draft');
      
      const result = await strapi.plugin('llm-agent').service('llm').generateDraft({
        contentType: contentType.trim(),
        documentId,
        locale,
        prompt: prompt.trim(),
        provider: provider?.trim(),
        model: model?.trim(),
        user: ctx.state.user,
      });
      
      ctx.send(result);
    } catch (error) {
      strapi.log.error('LLM generateDraft error:', error);
      // Don't expose internal error details
      ctx.throw(500, 'An error occurred while generating draft content');
    }
  },

  async seoOptimize(ctx) {
    try {
      const { contentType, documentId, locale, provider, model } = ctx.request.body;
      
      // Input validation
      if (!contentType || typeof contentType !== 'string') {
        return ctx.badRequest('Content type is required and must be a string');
      }
      if (provider && typeof provider !== 'string') {
        return ctx.badRequest('Provider must be a string');
      }
      if (model && typeof model !== 'string') {
        return ctx.badRequest('Model must be a string');
      }
      
      // Check permissions
      await strapi.admin.services.permission.check(ctx.state.user, 'plugin::llm-agent.seo-optimize');
      
      const result = await strapi.plugin('llm-agent').service('llm').seoOptimize({
        contentType: contentType.trim(),
        documentId,
        locale,
        provider: provider?.trim(),
        model: model?.trim(),
        user: ctx.state.user,
      });
      
      ctx.send(result);
    } catch (error) {
      strapi.log.error('LLM seoOptimize error:', error);
      // Don't expose internal error details
      ctx.throw(500, 'An error occurred while optimizing SEO content');
    }
  },

  async insertSuggestions(ctx) {
    try {
      const { contentType, documentId, locale, suggestions } = ctx.request.body;
      
      // Input validation
      if (!contentType || typeof contentType !== 'string') {
        return ctx.badRequest('Content type is required and must be a string');
      }
      if (!suggestions || typeof suggestions !== 'object' || Array.isArray(suggestions)) {
        return ctx.badRequest('Suggestions must be a valid object');
      }
      
      // Validate suggestions object doesn't contain sensitive keys
      const allowedKeys = ['title', 'body', 'excerpt', 'metaDescription', 'slug', 'headings', 'altText'];
      const suggestionKeys = Object.keys(suggestions);
      const invalidKeys = suggestionKeys.filter(key => !allowedKeys.includes(key));
      if (invalidKeys.length > 0) {
        return ctx.badRequest(`Invalid suggestion keys: ${invalidKeys.join(', ')}`);
      }
      
      // Check permissions  
      await strapi.admin.services.permission.check(ctx.state.user, 'plugin::llm-agent.insert-suggestions');
      
      const result = await strapi.plugin('llm-agent').service('llm').insertSuggestions({
        contentType: contentType.trim(),
        documentId,
        locale,
        suggestions,
        user: ctx.state.user,
      });
      
      ctx.send(result);
    } catch (error) {
      strapi.log.error('LLM insertSuggestions error:', error);
      // Don't expose internal error details
      ctx.throw(500, 'An error occurred while inserting suggestions');
    }
  },

  async getProviders(ctx) {
    try {
      // Check permissions - providers endpoint should also be protected
      await strapi.admin.services.permission.check(ctx.state.user, 'plugin::llm-agent.switch-provider');
      
      const providers = await strapi.plugin('llm-agent').service('providers').getAvailable();
      ctx.send(providers);
    } catch (error) {
      strapi.log.error('LLM getProviders error:', error);
      // Don't expose internal error details
      ctx.throw(500, 'An error occurred while retrieving providers');
    }
  },

  async getMetrics(ctx) {
    try {
      // Check permissions
      await strapi.admin.services.permission.check(ctx.state.user, 'plugin::llm-agent.view-metrics');
      
      // Validate user ID exists and is a number
      if (!ctx.state.user?.id || typeof ctx.state.user.id !== 'number') {
        return ctx.unauthorized('Invalid user session');
      }
      
      const metrics = await strapi.plugin('llm-agent').service('metrics').getUserMetrics(ctx.state.user.id);
      ctx.send(metrics);
    } catch (error) {
      strapi.log.error('LLM getMetrics error:', error);
      // Don't expose internal error details
      ctx.throw(500, 'An error occurred while retrieving metrics');
    }
  },
});