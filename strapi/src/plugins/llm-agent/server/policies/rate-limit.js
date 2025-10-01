/**
 * SPDX-License-Identifier: MIT
 * Copyright (c) 2024 AJW Tech
 */

'use strict';

/**
 * Rate limiting policy to prevent abuse of AI endpoints
 */
module.exports = async (policyContext, config, { strapi }) => {
  const { ctx } = policyContext;
  const userId = ctx.state.user?.id;
  
  if (!userId) {
    return ctx.unauthorized('Authentication required');
  }

  // Get rate limiting configuration
  const pluginConfig = strapi.config.get('plugin.llm-agent', {});
  const maxRequestsPerHour = pluginConfig.limits?.maxRequestsPerHour || 100;
  
  // Create a simple in-memory rate limiter (in production, use Redis)
  const rateLimitKey = `llm-agent:rate-limit:${userId}`;
  const currentHour = Math.floor(Date.now() / (1000 * 60 * 60));
  const cacheKey = `${rateLimitKey}:${currentHour}`;
  
  // Get current request count for this hour
  let requestCount = strapi.cache?.get(cacheKey) || 0;
  
  if (requestCount >= maxRequestsPerHour) {
    strapi.log.warn(`Rate limit exceeded for user ${userId}: ${requestCount}/${maxRequestsPerHour}`);
    return ctx.tooManyRequests('Rate limit exceeded. Please try again later.');
  }
  
  // Increment request count
  requestCount++;
  if (strapi.cache) {
    strapi.cache.set(cacheKey, requestCount, { ttl: 3600 }); // 1 hour TTL
  }
  
  // Log rate limit usage
  if (requestCount % 10 === 0) {
    strapi.log.info(`User ${userId} has made ${requestCount}/${maxRequestsPerHour} requests this hour`);
  }
  
  return true;
};