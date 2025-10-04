/**
 * SPDX-License-Identifier: MIT
 * Copyright (c) 2024 AJW Tech
 */

import React, { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { Page, Layouts } from '@strapi/strapi/admin';
import {
  Box,
  Button,
  Flex,
  Typography,
  TextInput,
  NumberInput,
  Toggle,
  Divider,
  SingleSelect,
  SingleSelectOption,
  Alert,
  Badge,
  Field,
} from '@strapi/design-system';
import { Check, ArrowClockwise } from '@strapi/icons';
import { settingsApi } from '../api';

const PLUGIN_ID = 'llm-agent';

// Provider metadata for catalog display
const PROVIDER_INFO = {
  openai: {
    name: 'OpenAI',
    description: 'GPT-4 and other cutting-edge language models',
    icon: '🤖',
    color: '#10a37f',
  },
  anthropic: {
    name: 'Anthropic',
    description: 'Claude models for safer, more accurate AI',
    icon: '🧠',
    color: '#d97757',
  },
  bedrock: {
    name: 'AWS Bedrock',
    description: 'Enterprise foundation models on AWS',
    icon: '☁️',
    color: '#ff9900',
  },
  github: {
    name: 'GitHub Models',
    description: 'Free AI models from the GitHub Marketplace',
    icon: '🐙',
    color: '#24292e',
  },
  xai: {
    name: 'xAI Grok',
    description: 'Grok models with real-time knowledge',
    icon: '⚡',
    color: '#1da1f2',
  },
};

const ProviderCard = ({ provider, config, onChange }) => {
  const { formatMessage } = useIntl();
  const [models, setModels] = useState([]);
  const [loadingModels, setLoadingModels] = useState(false);
  const [modelError, setModelError] = useState(null);
  const [hasTestedConnection, setHasTestedConnection] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const providerInfo = PROVIDER_INFO[provider];

  // Auto-fetch models for GitHub on component mount
  useEffect(() => {
    if (provider === 'github') {
      fetchGitHubModels();
    }
  }, [provider]);

  const fetchGitHubModels = async () => {
    setLoadingModels(true);
    setModelError(null);
    
    try {
      const result = await settingsApi.getProviderModels('github', { token: '' });
      
      if (result.success) {
        setModels(result.models || []);
        setHasTestedConnection(true);
      } else {
        setModelError(result.error || 'Failed to fetch GitHub models');
      }
    } catch (error) {
      setModelError(error.message || 'Failed to fetch GitHub models');
    } finally {
      setLoadingModels(false);
    }
  };

  const handleChange = (field, value) => {
    onChange(provider, {
      ...config,
      [field]: value,
    });
    
    if (provider !== 'github' && ['apiKey', 'token', 'accessKeyId', 'secretAccessKey', 'region'].includes(field)) {
      setHasTestedConnection(false);
      setModels([]);
    }
  };

  const handleTestConnection = async () => {
    setLoadingModels(true);
    setModelError(null);
    
    try {
      const credentials = provider === 'bedrock'
        ? { accessKeyId: config.accessKeyId, secretAccessKey: config.secretAccessKey, region: config.region }
        : provider === 'github'
        ? { token: config.token }
        : { apiKey: config.apiKey };

      const result = await settingsApi.getProviderModels(provider, credentials);
      
      if (result.success) {
        setModels(result.models || []);
        setHasTestedConnection(true);
      } else {
        setModelError(result.error || 'Failed to fetch models');
        setModels([]);
      }
    } catch (error) {
      setModelError(error.message || 'Failed to connect to provider');
      setModels([]);
    } finally {
      setLoadingModels(false);
    }
  };

  const canTestConnection = () => {
    if (!config.enabled) {
      return false;
    }
    if (provider === 'bedrock') {
      return config.accessKeyId && config.secretAccessKey && config.region;
    }
    if (provider === 'github') {
      return true;
    }
    return config.apiKey;
  };

  const needsConfiguration = provider !== 'github' && !hasTestedConnection;

  return (
    <Box
      padding={6}
      background="neutral0"
      hasRadius
      shadow="tableShadow"
      style={{
        borderLeft: `4px solid ${providerInfo.color}`,
        height: '100%',
      }}
    >
      <Flex direction="column" alignItems="stretch" gap={4}>
        {/* Header */}
        <Flex justifyContent="space-between" alignItems="flex-start">
          <Flex gap={3} alignItems="flex-start">
            <Typography variant="alpha" style={{ fontSize: '2.5rem', lineHeight: 1 }}>
              {providerInfo.icon}
            </Typography>
            <Box>
              <Typography variant="beta" fontWeight="bold">
                {providerInfo.name}
              </Typography>
              <Typography variant="pi" textColor="neutral600">
                {providerInfo.description}
              </Typography>
            </Box>
          </Flex>
          <Field.Root>
            <Toggle
              checked={config.enabled || false}
              onChange={(e) => handleChange('enabled', e.target.checked)}
              onLabel="On"
              offLabel="Off"
            />
          </Field.Root>
        </Flex>

        {/* Status Badges */}
        {config.enabled && (
          <Flex gap={2}>
            <Badge active={hasTestedConnection}>
              {loadingModels ? 'Loading...' : hasTestedConnection ? `${models.length} models` : 'Not connected'}
            </Badge>
            {needsConfiguration && <Badge backgroundColor="warning100">Setup required</Badge>}
          </Flex>
        )}

        {/* Status Alerts */}
        {config.enabled && (
          <>
            {!isExpanded && needsConfiguration && (
              <Alert variant="default" title="Setup Required">
                Configure your credentials to connect and fetch available models.
              </Alert>
            )}

            {hasTestedConnection && models.length > 0 && !isExpanded && (
              <Alert variant="success" title="Connected">
                Ready to use • {models.length} model{models.length !== 1 ? 's' : ''} available
              </Alert>
            )}

            {modelError && (
              <Alert variant={hasTestedConnection ? "default" : "danger"} title={hasTestedConnection ? "Notice" : "Error"}>
                {modelError}
              </Alert>
            )}

            {/* Configuration Toggle */}
            <Button
              variant="secondary"
              onClick={() => setIsExpanded(!isExpanded)}
              fullWidth
            >
              {isExpanded ? 'Hide Configuration' : 'Configure Provider'}
            </Button>

            {/* Configuration Panel */}
            {isExpanded && (
              <Box padding={4} background="neutral100" hasRadius>
                <Flex direction="column" alignItems="stretch" gap={4}>
                  {/* Credentials Fields */}
                  {provider === 'bedrock' ? (
                    <>
                      <Field.Root>
                        <Field.Label>AWS Region</Field.Label>
                        <TextInput
                          placeholder="us-east-1"
                          name="region"
                          value={config.region || ''}
                          onChange={(e) => handleChange('region', e.target.value)}
                        />
                        <Field.Hint>AWS region for Bedrock service</Field.Hint>
                      </Field.Root>
                      
                      <Field.Root>
                        <Field.Label>Access Key ID</Field.Label>
                        <TextInput
                          name="accessKeyId"
                          type="password"
                          value={config.accessKeyId || ''}
                          onChange={(e) => handleChange('accessKeyId', e.target.value)}
                        />
                      </Field.Root>
                      
                      <Field.Root>
                        <Field.Label>Secret Access Key</Field.Label>
                        <TextInput
                          name="secretAccessKey"
                          type="password"
                          value={config.secretAccessKey || ''}
                          onChange={(e) => handleChange('secretAccessKey', e.target.value)}
                        />
                      </Field.Root>
                    </>
                  ) : provider === 'github' ? (
                    <Field.Root>
                      <Field.Label>GitHub Token (Optional)</Field.Label>
                      <TextInput
                        name="token"
                        type="password"
                        value={config.token || ''}
                        onChange={(e) => handleChange('token', e.target.value)}
                        placeholder="ghp_..."
                      />
                      <Field.Hint>GitHub PAT for authenticated requests (optional for public catalog)</Field.Hint>
                    </Field.Root>
                  ) : (
                    <Field.Root>
                      <Field.Label>API Key</Field.Label>
                      <TextInput
                        name="apiKey"
                        type="password"
                        value={config.apiKey || ''}
                        onChange={(e) => handleChange('apiKey', e.target.value)}
                      />
                      <Field.Hint>Your API key (stored securely)</Field.Hint>
                    </Field.Root>
                  )}

                  {/* Test Connection Button */}
                  {provider !== 'github' && (
                    <Button
                      onClick={handleTestConnection}
                      loading={loadingModels}
                      disabled={!canTestConnection()}
                      startIcon={<ArrowClockwise />}
                      variant="default"
                      fullWidth
                    >
                      Test Connection & Fetch Models
                    </Button>
                  )}

                  {/* Model Selection */}
                  {models.length > 0 && (
                    <>
                      <Divider />
                      <Field.Root>
                        <Field.Label>Default Model</Field.Label>
                        <SingleSelect
                          value={config.defaultModel || ''}
                          onChange={(value) => handleChange('defaultModel', value)}
                        >
                          {models.map((model) => (
                            <SingleSelectOption key={model.id} value={model.id}>
                              {model.name || model.id}
                            </SingleSelectOption>
                          ))}
                        </SingleSelect>
                        <Field.Hint>The default model to use for generation requests</Field.Hint>
                      </Field.Root>

                      <Field.Root>
                        <Field.Label>Max Tokens</Field.Label>
                        <NumberInput
                          name="maxTokens"
                          value={config.maxTokens || 4000}
                          onValueChange={(value) => handleChange('maxTokens', value)}
                        />
                        <Field.Hint>Maximum tokens per request</Field.Hint>
                      </Field.Root>
                    </>
                  )}
                </Flex>
              </Box>
            )}
          </>
        )}
      </Flex>
    </Box>
  );
};

const SettingsPage = () => {
  const { formatMessage } = useIntl();
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      setLoading(true);
      const data = await settingsApi.getConfig();
      setConfig(data);
      setError(null);
    } catch (err) {
      console.error('Error loading config:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleProviderChange = (provider, providerConfig) => {
    setConfig({
      ...config,
      providers: {
        ...config.providers,
        [provider]: providerConfig,
      },
    });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await settingsApi.updateConfig(config);
      setError(null);
    } catch (err) {
      console.error('Error saving config:', err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Page.Loading />;
  }

  if (error) {
    return <Page.Error />;
  }

  return (
    <Page.Main>
      <Page.Title>
        {formatMessage({ id: `${PLUGIN_ID}.settings.title` })}
      </Page.Title>
      
      <Layouts.Header
        title="AI Provider Marketplace"
        subtitle="Configure AI providers and models for content generation"
        primaryAction={
          <Button
            onClick={handleSave}
            loading={saving}
            startIcon={<Check />}
            size="L"
          >
            Save Configuration
          </Button>
        }
      />

      <Layouts.Content>
        <Box padding={8}>
          <Flex direction="row" wrap="wrap" gap={6}>
            {config?.providers && Object.keys(config.providers).map((provider) => (
              <Box key={provider} style={{ flex: '1 1 calc(50% - 12px)', minWidth: '400px' }}>
                <ProviderCard
                  provider={provider}
                  config={config.providers[provider]}
                  onChange={handleProviderChange}
                />
              </Box>
            ))}
          </Flex>
        </Box>
      </Layouts.Content>
    </Page.Main>
  );
};

export default SettingsPage;
