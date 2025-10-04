/**
 * SPDX-License-Identifier: MIT
 * Copyright (c) 2024 AJW Tech
 */

'use strict';

module.exports = ({ strapi }) => ({
  async generateDraft({ contentType, documentId, locale, prompt, provider, model, user }) {
    // Security validation
    const securityService = strapi.plugin('llm-agent').service('security');
    
    // Sanitize inputs
    const sanitizedPrompt = securityService.sanitizeInput(prompt, 'prompt');
    const sanitizedContentType = securityService.sanitizeInput(contentType);
    const sanitizedProvider = provider ? securityService.sanitizeInput(provider) : null;
    const sanitizedModel = model ? securityService.sanitizeInput(model) : null;
    
    // Validate content type
    if (!securityService.validateContentType(sanitizedContentType)) {
      throw new Error('Invalid or unauthorized content type');
    }
    
    // Create audit log entry
    await securityService.createAuditLog('generate-draft', user, {
      contentType: sanitizedContentType,
      documentId,
      locale,
      provider: sanitizedProvider,
      model: sanitizedModel,
      promptLength: sanitizedPrompt.length,
    });
    
    strapi.log.info('LLM Service: Generate draft called', { 
      contentType: sanitizedContentType, 
      documentId, 
      locale, 
      provider: sanitizedProvider, 
      model: sanitizedModel,
      userId: user?.id 
    });
    
    // Get plugin configuration
    const pluginStore = strapi.store({
      type: 'plugin',
      name: 'llm-agent',
    });
    
    let config = await pluginStore.get({ key: 'settings' });
    if (!config) {
      config = strapi.plugin('llm-agent').config('default');
    }
    
    // Determine which provider to use
    const selectedProvider = sanitizedProvider || this._getDefaultProvider(config);
    const selectedModel = sanitizedModel || config.providers[selectedProvider]?.defaultModel;
    
    if (!selectedProvider || !config.providers[selectedProvider]?.enabled) {
      throw new Error('No AI provider configured or enabled');
    }
    
    // Call the appropriate provider
    let generatedContent;
    try {
      generatedContent = await this._callProvider(
        selectedProvider,
        selectedModel,
        sanitizedPrompt,
        config.providers[selectedProvider]
      );
    } catch (error) {
      strapi.log.error('AI generation error:', error);
      throw new Error(`Failed to generate content: ${error.message}`);
    }
    
    const result = {
      success: true,
      message: 'Content generated successfully',
      data: {
        provider: selectedProvider,
        model: selectedModel,
        contentType: sanitizedContentType,
        documentId,
        locale,
        generatedAt: new Date().toISOString(),
        suggestions: generatedContent,
      }
    };
    
    // Sanitize output to prevent information disclosure
    return securityService.sanitizeOutput(result);
  },
  
  /**
   * Get the default enabled provider
   */
  _getDefaultProvider(config) {
    const providers = ['openai', 'anthropic', 'github', 'bedrock', 'xai'];
    for (const provider of providers) {
      if (config.providers[provider]?.enabled) {
        return provider;
      }
    }
    return null;
  },
  
  /**
   * Call the selected AI provider
   */
  async _callProvider(provider, model, prompt, providerConfig) {
    switch (provider) {
      case 'openai':
        return await this._callOpenAI(model, prompt, providerConfig);
      case 'anthropic':
        return await this._callAnthropic(model, prompt, providerConfig);
      case 'github':
        return await this._callGitHub(model, prompt, providerConfig);
      case 'bedrock':
        return await this._callBedrock(model, prompt, providerConfig);
      case 'xai':
        return await this._callXAI(model, prompt, providerConfig);
      default:
        throw new Error(`Unknown provider: ${provider}`);
    }
  },
  
  /**
   * Call OpenAI API
   */
  async _callOpenAI(model, prompt, config) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model || 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful content writer. Generate content based on the user prompt. Return a JSON object with title, body, and excerpt fields.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: config.maxTokens || 4000,
        temperature: 0.7,
      }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'OpenAI API error');
    }
    
    const data = await response.json();
    const content = data.choices[0].message.content;
    
    // Try to parse as JSON, otherwise structure the text
    try {
      return JSON.parse(content);
    } catch {
      return {
        title: 'AI Generated Content',
        body: content,
        excerpt: content.substring(0, 200) + '...',
      };
    }
  },
  
  /**
   * Call Anthropic Claude API
   */
  async _callAnthropic(model, prompt, config) {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': config.apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: model || 'claude-3-5-sonnet-20241022',
        max_tokens: config.maxTokens || 4000,
        messages: [
          {
            role: 'user',
            content: `You are a helpful content writer. Generate content based on this prompt: "${prompt}". Return a JSON object with title, body, and excerpt fields.`,
          },
        ],
      }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Anthropic API error');
    }
    
    const data = await response.json();
    const content = data.content[0].text;
    
    // Try to parse as JSON, otherwise structure the text
    try {
      return JSON.parse(content);
    } catch {
      return {
        title: 'AI Generated Content',
        body: content,
        excerpt: content.substring(0, 200) + '...',
      };
    }
  },
  
  /**
   * Call GitHub Models API
   */
  async _callGitHub(model, prompt, config) {
    const response = await fetch('https://models.inference.ai.azure.com/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.token || ''}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model || 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful content writer. Generate content based on the user prompt. Return a JSON object with title, body, and excerpt fields.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: config.maxTokens || 4000,
        temperature: 0.7,
      }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'GitHub Models API error');
    }
    
    const data = await response.json();
    const content = data.choices[0].message.content;
    
    // Try to parse as JSON, otherwise structure the text
    try {
      return JSON.parse(content);
    } catch {
      return {
        title: 'AI Generated Content',
        body: content,
        excerpt: content.substring(0, 200) + '...',
      };
    }
  },
  
  /**
   * Call AWS Bedrock API
   */
  async _callBedrock(model, prompt, config) {
    // Note: AWS Bedrock requires AWS SDK, this is a simplified version
    // In production, use @aws-sdk/client-bedrock-runtime
    throw new Error('AWS Bedrock integration requires AWS SDK. Please install @aws-sdk/client-bedrock-runtime.');
  },
  
  /**
   * Call xAI Grok API
   */
  async _callXAI(model, prompt, config) {
    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model || 'grok-beta',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful content writer. Generate content based on the user prompt. Return a JSON object with title, body, and excerpt fields.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: config.maxTokens || 4000,
        temperature: 0.7,
      }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'xAI API error');
    }
    
    const data = await response.json();
    const content = data.choices[0].message.content;
    
    // Try to parse as JSON, otherwise structure the text
    try {
      return JSON.parse(content);
    } catch {
      return {
        title: 'AI Generated Content',
        body: content,
        excerpt: content.substring(0, 200) + '...',
      };
    }
  },

  async seoOptimize({ contentType, documentId, locale, provider, model, user }) {
    // Security validation
    const securityService = strapi.plugin('llm-agent').service('security');
    
    // Sanitize inputs
    const sanitizedContentType = securityService.sanitizeInput(contentType);
    const sanitizedProvider = provider ? securityService.sanitizeInput(provider) : null;
    const sanitizedModel = model ? securityService.sanitizeInput(model) : null;
    
    // Validate content type
    if (!securityService.validateContentType(sanitizedContentType)) {
      throw new Error('Invalid or unauthorized content type');
    }
    
    // Create audit log entry
    await securityService.createAuditLog('seo-optimize', user, {
      contentType: sanitizedContentType,
      documentId,
      locale,
      provider: sanitizedProvider,
      model: sanitizedModel,
    });
    
    strapi.log.info('LLM Service: SEO optimize called', { 
      contentType: sanitizedContentType, 
      documentId, 
      locale, 
      provider: sanitizedProvider, 
      model: sanitizedModel,
      userId: user?.id 
    });
    
    // Get current content if documentId provided
    let currentContent = '';
    if (documentId) {
      try {
        const document = await strapi.documents(sanitizedContentType).findOne({
          documentId,
          locale,
        });
        if (document) {
          currentContent = `Title: ${document.title || ''}\nContent: ${document.body || document.description || ''}`;
        }
      } catch (error) {
        strapi.log.warn('Could not fetch current content:', error);
      }
    }
    
    // Get plugin configuration
    const pluginStore = strapi.store({
      type: 'plugin',
      name: 'llm-agent',
    });
    
    let config = await pluginStore.get({ key: 'settings' });
    if (!config) {
      config = strapi.plugin('llm-agent').config('default');
    }
    
    // Determine which provider to use
    const selectedProvider = sanitizedProvider || this._getDefaultProvider(config);
    const selectedModel = sanitizedModel || config.providers[selectedProvider]?.defaultModel;
    
    if (!selectedProvider || !config.providers[selectedProvider]?.enabled) {
      throw new Error('No AI provider configured or enabled');
    }
    
    // Call the provider for SEO optimization
    let seoSuggestions;
    try {
      const prompt = `Analyze the following content and provide SEO optimization suggestions. Return a JSON object with the following fields:
- title: An SEO-optimized title (max 60 characters)
- metaDescription: An SEO-optimized meta description (max 160 characters)
- slug: An SEO-friendly URL slug
- keywords: Array of relevant keywords
- headings: Array of suggested H1, H2 headings

Current content:
${currentContent || 'No content provided. Generate generic SEO suggestions for a blog post.'}`;

      const generatedContent = await this._callProvider(
        selectedProvider,
        selectedModel,
        prompt,
        config.providers[selectedProvider]
      );
      
      seoSuggestions = typeof generatedContent === 'string' ? JSON.parse(generatedContent) : generatedContent;
    } catch (error) {
      strapi.log.error('SEO optimization error:', error);
      throw new Error(`Failed to optimize SEO: ${error.message}`);
    }
    
    const result = {
      success: true,
      message: 'SEO optimization completed successfully',
      data: {
        provider: selectedProvider,
        model: selectedModel,
        contentType: sanitizedContentType,
        documentId,
        locale,
        optimizedAt: new Date().toISOString(),
        suggestions: seoSuggestions,
      }
    };
    
    return securityService.sanitizeOutput(result);
  },

  async insertSuggestions({ contentType, documentId, locale, suggestions, user }) {
    // Security validation
    const securityService = strapi.plugin('llm-agent').service('security');
    
    // Sanitize inputs
    const sanitizedContentType = securityService.sanitizeInput(contentType);
    
    // Validate content type
    if (!securityService.validateContentType(sanitizedContentType)) {
      throw new Error('Invalid or unauthorized content type');
    }
    
    // Sanitize suggestions object
    const sanitizedSuggestions = {};
    const allowedKeys = ['title', 'body', 'excerpt', 'metaDescription', 'slug', 'headings', 'altText', 'keywords', 'description'];
    
    for (const [key, value] of Object.entries(suggestions || {})) {
      if (allowedKeys.includes(key)) {
        if (typeof value === 'string') {
          sanitizedSuggestions[key] = securityService.sanitizeInput(value);
        } else if (Array.isArray(value)) {
          sanitizedSuggestions[key] = value.map(v => 
            typeof v === 'string' ? securityService.sanitizeInput(v) : v
          );
        }
      }
    }
    
    // Create audit log entry
    await securityService.createAuditLog('insert-suggestions', user, {
      contentType: sanitizedContentType,
      documentId,
      locale,
      suggestionsCount: Object.keys(sanitizedSuggestions).length,
    });
    
    strapi.log.info('LLM Service: Insert suggestions called', { 
      contentType: sanitizedContentType, 
      documentId, 
      locale, 
      suggestions: Object.keys(sanitizedSuggestions),
      userId: user?.id 
    });
    
    // Update the document with suggestions if documentId provided
    if (documentId) {
      try {
        await strapi.documents(sanitizedContentType).update({
          documentId,
          locale,
          data: sanitizedSuggestions,
        });
        
        const result = {
          success: true,
          message: 'Suggestions applied successfully',
          data: {
            contentType: sanitizedContentType,
            documentId,
            locale,
            insertedAt: new Date().toISOString(),
            appliedSuggestions: sanitizedSuggestions,
          }
        };
        
        return securityService.sanitizeOutput(result);
      } catch (error) {
        strapi.log.error('Failed to update document:', error);
        throw new Error(`Failed to insert suggestions: ${error.message}`);
      }
    }
    
    // If no documentId, just return the suggestions
    const result = {
      success: true,
      message: 'Suggestions prepared (no document update)',
      data: {
        contentType: sanitizedContentType,
        documentId,
        locale,
        insertedAt: new Date().toISOString(),
        appliedSuggestions: sanitizedSuggestions,
      }
    };
    
    return securityService.sanitizeOutput(result);
  },
});