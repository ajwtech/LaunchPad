/**
 * SPDX-License-Identifier: MIT
 * Copyright (c) 2024 AJW Tech
 */

'use strict';

/**
 * Content type validation policy
 */
module.exports = async (policyContext, config, { strapi }) => {
  const { ctx } = policyContext;
  const { contentType } = ctx.request.body;
  
  if (!contentType) {
    return ctx.badRequest('Content type is required');
  }
  
  // Validate content type format (should be api::name.name or plugin::name.name)
  const contentTypePattern = /^(api|plugin)::[a-z0-9-]+\.[a-z0-9-]+$/i;
  if (!contentTypePattern.test(contentType)) {
    return ctx.badRequest('Invalid content type format');
  }
  
  // Check if content type exists in the Strapi content types
  const availableContentTypes = Object.keys(strapi.contentTypes);
  if (!availableContentTypes.includes(contentType)) {
    return ctx.badRequest('Content type does not exist');
  }
  
  // Check if user has permissions for this content type
  const contentTypeConfig = strapi.contentTypes[contentType];
  if (contentTypeConfig?.pluginOptions?.['llm-agent']?.enabled === false) {
    return ctx.forbidden('LLM Agent is not enabled for this content type');
  }
  
  return true;
};