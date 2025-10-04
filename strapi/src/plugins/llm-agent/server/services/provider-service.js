/**
 * SPDX-License-Identifier: MIT
 * Copyright (c) 2024 AJW Tech
 */

'use strict';

/**
 * Provider service to interact with AI provider APIs
 */
module.exports = ({ strapi }) => ({
  /**
   * Test connection and fetch available models for OpenAI
   */
  async getOpenAIModels(apiKey) {
    try {
      const response = await fetch('https://api.openai.com/v1/models', {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      
      // Filter for GPT models only
      const gptModels = data.data
        .filter(model => model.id.includes('gpt'))
        .map(model => ({
          id: model.id,
          name: model.id,
          created: model.created,
        }))
        .sort((a, b) => b.created - a.created);

      return {
        success: true,
        models: gptModels,
      };
    } catch (error) {
      strapi.log.error('OpenAI models fetch error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  },

  /**
   * Test connection and fetch available models for Anthropic
   */
  async getAnthropicModels(apiKey) {
    // Anthropic doesn't have a models list endpoint, return known models
    const knownModels = [
      { id: 'claude-3-5-sonnet-20241022', name: 'Claude 3.5 Sonnet (Latest)' },
      { id: 'claude-3-5-haiku-20241022', name: 'Claude 3.5 Haiku' },
      { id: 'claude-3-opus-20240229', name: 'Claude 3 Opus' },
      { id: 'claude-3-sonnet-20240229', name: 'Claude 3 Sonnet' },
      { id: 'claude-3-haiku-20240307', name: 'Claude 3 Haiku' },
    ];

    // Test the API key with a minimal request
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-3-5-haiku-20241022',
          max_tokens: 1,
          messages: [{ role: 'user', content: 'test' }],
        }),
      });

      // Even if we get rate limited, a 4xx error means the key is valid
      if (response.status === 401 || response.status === 403) {
        return {
          success: false,
          error: 'Invalid API key',
        };
      }

      return {
        success: true,
        models: knownModels,
      };
    } catch (error) {
      strapi.log.error('Anthropic validation error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  },

  /**
   * Test connection and fetch available models for AWS Bedrock
   */
  async getBedrockModels(credentials) {
    const { accessKeyId, secretAccessKey, region } = credentials;

    // Known Bedrock foundation models
    const knownModels = [
      { id: 'anthropic.claude-3-5-sonnet-20241022-v2:0', name: 'Claude 3.5 Sonnet v2' },
      { id: 'anthropic.claude-3-5-sonnet-20240620-v1:0', name: 'Claude 3.5 Sonnet v1' },
      { id: 'anthropic.claude-3-5-haiku-20241022-v1:0', name: 'Claude 3.5 Haiku' },
      { id: 'anthropic.claude-3-opus-20240229-v1:0', name: 'Claude 3 Opus' },
      { id: 'anthropic.claude-3-sonnet-20240229-v1:0', name: 'Claude 3 Sonnet' },
      { id: 'anthropic.claude-3-haiku-20240307-v1:0', name: 'Claude 3 Haiku' },
      { id: 'meta.llama3-1-405b-instruct-v1:0', name: 'Llama 3.1 405B' },
      { id: 'meta.llama3-1-70b-instruct-v1:0', name: 'Llama 3.1 70B' },
      { id: 'meta.llama3-1-8b-instruct-v1:0', name: 'Llama 3.1 8B' },
    ];

    // For now, return known models without testing (AWS SDK would be needed for full validation)
    // TODO: Implement AWS Bedrock SDK validation
    return {
      success: true,
      models: knownModels,
      warning: 'Credential validation not implemented - using known models list',
    };
  },

  /**
   * Test connection and fetch available models for GitHub Models
   */
  async getGitHubModels(token) {
    try {
      // Fetch models from GitHub Models Marketplace
      // The catalog endpoint doesn't require authentication
      const response = await fetch('https://models.github.ai/catalog/models', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          // Only include authorization if token is provided
          ...(token && token.trim() ? { 'Authorization': `Bearer ${token}` } : {}),
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        strapi.log.error('GitHub Models Catalog error:', response.status, errorText);
        
        if (response.status === 401 || response.status === 403) {
          return {
            success: false,
            error: 'Invalid or expired GitHub token. Make sure your token has access to GitHub Models.',
          };
        }
        
        if (response.status === 404) {
          // Catalog endpoint might not be available, fallback to inference endpoint
          strapi.log.info('Catalog endpoint not found, trying inference endpoint...');
          return await this.getGitHubModelsFromInference(token);
        }
        
        throw new Error(`API returned ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      strapi.log.info('GitHub Models Catalog response:', JSON.stringify(data, null, 2));
      
      // Parse the catalog response
      let modelsList = [];
      
      if (Array.isArray(data)) {
        modelsList = data;
      } else if (data.models && Array.isArray(data.models)) {
        modelsList = data.models;
      } else if (data.data && Array.isArray(data.data)) {
        modelsList = data.data;
      }
      
      const models = modelsList.map(model => ({
        id: model.name || model.id || model.model_id,
        name: model.friendly_name || model.display_name || model.summary || model.name || model.id,
        publisher: model.publisher || model.provider,
        version: model.version,
        description: model.summary || model.description,
      })).filter(m => m.id);

      strapi.log.info(`Successfully fetched ${models.length} models from GitHub Catalog`);

      return {
        success: true,
        models: models,
      };
    } catch (error) {
      strapi.log.error('GitHub Models fetch error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  },

  /**
   * Fallback: Get models from inference endpoint
   */
  async getGitHubModelsFromInference(token) {
    try {
      // Try the Azure AI inference endpoint which GitHub Models uses
      const response = await fetch('https://models.inference.ai.azure.com/models', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Inference API returned ${response.status}`);
      }

      const data = await response.json();
      strapi.log.info('GitHub Inference API response:', JSON.stringify(data, null, 2));

      let modelsList = Array.isArray(data) ? data : (data.data || data.models || []);
      
      const models = modelsList.map(model => {
        if (typeof model === 'string') {
          return { id: model, name: model };
        }
        return {
          id: model.id || model.name || model.model_id,
          name: model.friendly_name || model.name || model.id,
          publisher: model.publisher,
        };
      }).filter(m => m.id);

      strapi.log.info(`Successfully fetched ${models.length} models from Inference API`);

      return {
        success: true,
        models: models,
      };
    } catch (error) {
      strapi.log.error('GitHub Inference API error:', error);
      return {
        success: false,
        error: `Could not fetch models from GitHub: ${error.message}`,
      };
    }
  },

  /**
   * Test connection and fetch available models for xAI Grok
   */
  async getXAIModels(apiKey) {
    const knownModels = [
      { id: 'grok-beta', name: 'Grok Beta' },
      { id: 'grok-vision-beta', name: 'Grok Vision Beta' },
    ];

    // Test the API key
    try {
      const response = await fetch('https://api.x.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'grok-beta',
          messages: [{ role: 'user', content: 'test' }],
          max_tokens: 1,
        }),
      });

      if (response.status === 401 || response.status === 403) {
        return {
          success: false,
          error: 'Invalid API key',
        };
      }

      return {
        success: true,
        models: knownModels,
      };
    } catch (error) {
      strapi.log.error('xAI validation error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  },
});
