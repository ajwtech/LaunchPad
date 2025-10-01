/**
 * SPDX-License-Identifier: MIT
 * Copyright (c) 2024 AJW Tech
 */

'use strict';

module.exports = ({ strapi }) => ({
  /**
   * Sanitize user input to prevent injection attacks
   */
  sanitizeInput(input, type = 'text') {
    if (!input || typeof input !== 'string') {
      return input;
    }

    const config = strapi.config.get('plugin.llm-agent', {});
    if (!config.security?.validateInput) {
      return input;
    }

    // Remove potentially dangerous characters
    let sanitized = input
      .replace(/[<>]/g, '') // Remove < and > to prevent HTML injection
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/data:/gi, '') // Remove data: protocol
      .replace(/vbscript:/gi, '') // Remove vbscript: protocol
      .trim();

    // Check for blocked keywords
    const blockedKeywords = config.security?.blockedKeywords || [];
    for (const keyword of blockedKeywords) {
      const regex = new RegExp(keyword, 'gi');
      if (regex.test(sanitized)) {
        strapi.log.warn(`Blocked keyword detected in input: ${keyword}`);
        throw new Error('Input contains prohibited content');
      }
    }

    // Limit length based on type
    const maxLength = type === 'prompt' ? config.limits?.maxPromptLength || 5000 : 1000;
    if (sanitized.length > maxLength) {
      sanitized = sanitized.substring(0, maxLength);
    }

    return sanitized;
  },

  /**
   * Validate content type against allowed patterns
   */
  validateContentType(contentType) {
    if (!contentType || typeof contentType !== 'string') {
      return false;
    }

    const config = strapi.config.get('plugin.llm-agent', {});
    const allowedPatterns = config.security?.allowedContentTypes || [];
    
    return allowedPatterns.some(pattern => pattern.test(contentType));
  },

  /**
   * Sanitize output data to prevent information disclosure
   */
  sanitizeOutput(data) {
    if (!data || typeof data !== 'object') {
      return data;
    }

    const config = strapi.config.get('plugin.llm-agent', {});
    if (!config.security?.sanitizeOutput) {
      return data;
    }

    // Deep clone to avoid mutating original data
    const sanitized = JSON.parse(JSON.stringify(data));

    // Remove any keys that might contain sensitive information
    const sensitiveKeys = ['apiKey', 'token', 'secret', 'password', 'credential', 'accessKey'];
    
    function removeSensitiveKeys(obj) {
      if (typeof obj !== 'object' || obj === null) {
        return obj;
      }

      if (Array.isArray(obj)) {
        return obj.map(removeSensitiveKeys);
      }

      const cleaned = {};
      for (const [key, value] of Object.entries(obj)) {
        const keyLower = key.toLowerCase();
        const isSensitive = sensitiveKeys.some(sensitive => keyLower.includes(sensitive));
        
        if (isSensitive) {
          // Replace with placeholder or remove entirely
          cleaned[key] = '[REDACTED]';
        } else {
          cleaned[key] = removeSensitiveKeys(value);
        }
      }
      return cleaned;
    }

    return removeSensitiveKeys(sanitized);
  },

  /**
   * Validate user permissions for a specific action
   */
  async validateUserPermissions(user, action, contentType = null) {
    if (!user || !user.id) {
      throw new Error('User authentication required');
    }

    // Check if user has the required permission
    try {
      await strapi.admin.services.permission.check(user, action);
    } catch (error) {
      strapi.log.warn(`Permission denied for user ${user.id} on action ${action}`);
      throw new Error('Insufficient permissions');
    }

    // Additional content type specific checks
    if (contentType) {
      const contentTypeConfig = strapi.contentTypes[contentType];
      if (contentTypeConfig?.pluginOptions?.['llm-agent']?.enabled === false) {
        throw new Error('LLM Agent is not enabled for this content type');
      }
    }

    return true;
  },

  /**
   * Create audit log entry
   */
  async createAuditLog(action, user, data = {}) {
    const config = strapi.config.get('plugin.llm-agent', {});
    if (!config.features?.auditLog) {
      return; // Audit logging is disabled
    }

    const auditEntry = {
      action,
      userId: user?.id,
      userEmail: user?.email,
      timestamp: new Date().toISOString(),
      data: this.sanitizeOutput(data),
      ip: data.ip || 'unknown',
      userAgent: data.userAgent || 'unknown',
    };

    // In a full implementation, this would write to a database table
    strapi.log.info('LLM Agent Audit Log:', auditEntry);
    
    // Store in audit log table (would need to be implemented)
    // await strapi.entityService.create('plugin::llm-agent.audit-log', { data: auditEntry });
  },
});