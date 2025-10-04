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
  Grid,
  Divider,
  Field,
  SingleSelect,
  SingleSelectOption,
  Alert,
  Badge,
  Card,
  CardHeader,
  CardBody,
  CardContent,
  CardBadge,
  CardTitle,
  CardSubtitle,
  CardAsset,
} from '@strapi/design-system';
import { Check, ArrowClockwise, Sparkle } from '@strapi/icons';
import { settingsApi } from '../api';

const PLUGIN_ID = 'llm-agent';

// Provider metadata for catalog display
const PROVIDER_INFO = {
  openai: {
    name: 'OpenAI',
    description: 'GPT-4 and other cutting-edge language models',
    icon: '🤖',
    color: '#10a37f',
    website: 'https://openai.com',
  },
  anthropic: {
    name: 'Anthropic',
    description: 'Claude models for safer, more accurate AI',
    icon: '🧠',
    color: '#d97757',
    website: 'https://anthropic.com',
  },
  bedrock: {
    name: 'AWS Bedrock',
    description: 'Enterprise foundation models on AWS',
    icon: '☁️',
    color: '#ff9900',
    website: 'https://aws.amazon.com/bedrock',
  },
  github: {
    name: 'GitHub Models',
    description: 'Free AI models from the GitHub Marketplace',
    icon: '🐙',
    color: '#24292e',
    website: 'https://github.com/marketplace/models',
  },
  xai: {
    name: 'xAI Grok',
    description: 'Grok models with real-time knowledge',
    icon: '⚡',
    color: '#1da1f2',
    website: 'https://x.ai',
  },
};

const ProviderCard = ({ provider, config, onChange, onTestConnection }) => {
  const { formatMessage } = useIntl();
  const [models, setModels] = useState([]);
  const [loadingModels, setLoadingModels] = useState(false);
  const [modelError, setModelError] = useState(null);
  const [hasTestedConnection, setHasTestedConnection] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const providerInfo = PROVIDER_INFO[provider];

  // Auto-fetch models for GitHub on component mount (no auth required)
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
        if (result.warning) {
          setModelError(result.warning);
        }
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
        if (result.warning) {
          setModelError(result.warning);
        }
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
      return true; // GitHub doesn't require token to test
    }
    return config.apiKey;
  };

  const needsConfiguration = provider !== 'github' && !hasTestedConnection;

  return (
    <Card
      style={{
        height: '100%',
        borderLeft: `4px solid ${providerInfo.color}`,
      }}
    >
      <CardHeader>
        <Flex direction="column" alignItems="flex-start" gap={2}>
          <Flex justifyContent="space-between" width="100%">
            <Flex gap={2} alignItems="center">
              <Typography variant="alpha" style={{ fontSize: '2rem' }}>
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
            <Toggle
              checked={config.enabled || false}
              onChange={(e) => handleChange('enabled', e.target.checked)}
              onLabel="On"
              offLabel="Off"
            />
          </Flex>
          
          {config.enabled && (
            <Flex gap={2}>
              <Badge active={hasTestedConnection}>
                {hasTestedConnection ? `${models.length} models` : 'Not connected'}
              </Badge>
              {needsConfiguration && (
                <Badge backgroundColor="warning100">Needs setup</Badge>
              )}
            </Flex>
          )}
        </Flex>
      </CardHeader>

      {config.enabled && (
        <CardBody>
          <Flex direction="column" alignItems="stretch" gap={4}>
            {/* Credentials Section */}
            {!isExpanded && needsConfiguration && (
              <Alert variant="default" title="Setup Required">
                Click "Configure" to add your API credentials and fetch available models.
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

            {/* Toggle configuration panel */}
            <Button
              variant="tertiary"
              onClick={() => setIsExpanded(!isExpanded)}
              fullWidth
            >
              {isExpanded ? 'Hide Configuration' : 'Configure'}
            </Button>

            {isExpanded && (
              <Box padding={4} background="neutral100" hasRadius>
                <Flex direction="column" alignItems="stretch" gap={4}>
    if (provider === 'bedrock') {
      return config.accessKeyId && config.secretAccessKey && config.region;
    }
    if (provider === 'github') {
      return config.token;
    }
    return config.apiKey;
  };

  return (
    <Box padding={4} background="neutral0" hasRadius shadow="tableShadow">
      <Flex direction="column" alignItems="stretch" gap={4}>
        <Box>
          <Typography variant="beta">
            {formatMessage({ id: `${PLUGIN_ID}.provider.${provider}` })}
          </Typography>
          <Typography variant="pi" textColor="neutral600">
            {formatMessage({ id: `${PLUGIN_ID}.provider.${provider}.description` })}
          </Typography>
        </Box>
        
        <Field.Root>
          <Field.Label>{formatMessage({ id: `${PLUGIN_ID}.provider.enabled` })}</Field.Label>
          <Toggle
            checked={config.enabled || false}
            onChange={(e) => handleChange('enabled', e.target.checked)}
          />
          <Field.Hint>{formatMessage({ id: `${PLUGIN_ID}.provider.enabled.hint` })}</Field.Hint>
        </Field.Root>

        {provider === 'bedrock' ? (
          <>
            <Field.Root>
              <Field.Label>{formatMessage({ id: `${PLUGIN_ID}.provider.region` })}</Field.Label>
              <TextInput
                placeholder="us-east-1"
                name="region"
                value={config.region || ''}
                onChange={(e) => handleChange('region', e.target.value)}
                disabled={!config.enabled}
              />
              <Field.Hint>{formatMessage({ id: `${PLUGIN_ID}.provider.region.hint` })}</Field.Hint>
            </Field.Root>
            
            <Field.Root>
              <Field.Label>{formatMessage({ id: `${PLUGIN_ID}.provider.accessKeyId` })}</Field.Label>
              <TextInput
                name="accessKeyId"
                type="password"
                value={config.accessKeyId || ''}
                onChange={(e) => handleChange('accessKeyId', e.target.value)}
                disabled={!config.enabled}
              />
              <Field.Hint>{formatMessage({ id: `${PLUGIN_ID}.provider.accessKeyId.hint` })}</Field.Hint>
            </Field.Root>
            
            <Field.Root>
              <Field.Label>{formatMessage({ id: `${PLUGIN_ID}.provider.secretAccessKey` })}</Field.Label>
              <TextInput
                name="secretAccessKey"
                type="password"
                value={config.secretAccessKey || ''}
                onChange={(e) => handleChange('secretAccessKey', e.target.value)}
                disabled={!config.enabled}
              />
              <Field.Hint>{formatMessage({ id: `${PLUGIN_ID}.provider.secretAccessKey.hint` })}</Field.Hint>
            </Field.Root>
          </>
        ) : provider === 'github' ? (
          <Field.Root>
            <Field.Label>{formatMessage({ id: `${PLUGIN_ID}.provider.token` })}</Field.Label>
            <TextInput
              name="token"
              type="password"
              value={config.token || ''}
              onChange={(e) => handleChange('token', e.target.value)}
              disabled={!config.enabled}
            />
            <Field.Hint>{formatMessage({ id: `${PLUGIN_ID}.provider.token.hint` })}</Field.Hint>
          </Field.Root>
        ) : (
          <Field.Root>
            <Field.Label>{formatMessage({ id: `${PLUGIN_ID}.provider.apiKey` })}</Field.Label>
            <TextInput
              name="apiKey"
              type="password"
              value={config.apiKey || ''}
              onChange={(e) => handleChange('apiKey', e.target.value)}
              disabled={!config.enabled}
            />
            <Field.Hint>{formatMessage({ id: `${PLUGIN_ID}.provider.apiKey.hint` })}</Field.Hint>
          </Field.Root>
        )}

        {/* Test Connection Button */}
        <Box>
          <Button
            onClick={handleTestConnection}
            loading={loadingModels}
            disabled={!canTestConnection()}
            startIcon={<ArrowClockwise />}
            variant="secondary"
            fullWidth
          >
            Test Connection & Fetch Models
          </Button>
        </Box>

        {/* Connection Status */}
        {modelError && (
          <Alert variant={hasTestedConnection ? "default" : "danger"} title={hasTestedConnection ? "Notice" : "Error"}>
            {modelError}
          </Alert>
        )}

        {hasTestedConnection && models.length > 0 && (
          <Alert variant="success" title="Connection Successful">
            Found {models.length} available model{models.length !== 1 ? 's' : ''}
          </Alert>
        )}

        {/* Model Selection */}
        <Field.Root>
          <Field.Label>{formatMessage({ id: `${PLUGIN_ID}.provider.model` })}</Field.Label>
          {models.length > 0 ? (
            <SingleSelect
              value={config.defaultModel || ''}
              onChange={(value) => handleChange('defaultModel', value)}
              disabled={!config.enabled}
            >
              {models.map((model) => (
                <SingleSelectOption key={model.id} value={model.id}>
                  {model.name || model.id}
                </SingleSelectOption>
              ))}
            </SingleSelect>
          ) : (
            <TextInput
              name="defaultModel"
              value={config.defaultModel || ''}
              onChange={(e) => handleChange('defaultModel', e.target.value)}
              disabled={!config.enabled}
              placeholder={hasTestedConnection ? "No models found" : "Test connection to see available models"}
            />
          )}
          <Field.Hint>{formatMessage({ id: `${PLUGIN_ID}.provider.model.hint` })}</Field.Hint>
        </Field.Root>

        <Field.Root>
          <Field.Label>{formatMessage({ id: `${PLUGIN_ID}.provider.maxTokens` })}</Field.Label>
          <NumberInput
            name="maxTokens"
            value={config.maxTokens || 4000}
            onValueChange={(value) => handleChange('maxTokens', value)}
            disabled={!config.enabled}
          />
          <Field.Hint>{formatMessage({ id: `${PLUGIN_ID}.provider.maxTokens.hint` })}</Field.Hint>
        </Field.Root>
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
      // Show success notification
    } catch (err) {
      console.error('Error saving config:', err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Page.Loading />
    );
  }

  if (error) {
    return (
      <Page.Error />
    );
  }

  return (
    <Page.Main>
      <Page.Title>
        {formatMessage({ id: `${PLUGIN_ID}.settings.title` })}
      </Page.Title>
      
      <Layouts.Header
        title={formatMessage({ id: `${PLUGIN_ID}.settings.title` })}
        subtitle={formatMessage({ id: `${PLUGIN_ID}.settings.description` })}
        primaryAction={
          <Button
            onClick={handleSave}
            loading={saving}
            startIcon={<Check />}
            size="L"
          >
            {formatMessage({ id: `${PLUGIN_ID}.settings.save` })}
          </Button>
        }
      />

      <Layouts.Content>
        <Box padding={8}>
          <Tabs.Root defaultValue="openai">
            <Tabs.List>
              <Tabs.Trigger value="openai">OpenAI</Tabs.Trigger>
              <Tabs.Trigger value="anthropic">Anthropic</Tabs.Trigger>
              <Tabs.Trigger value="bedrock">AWS Bedrock</Tabs.Trigger>
              <Tabs.Trigger value="github">GitHub Models</Tabs.Trigger>
              <Tabs.Trigger value="xai">xAI Grok</Tabs.Trigger>
            </Tabs.List>

            <Divider />

            {config?.providers && Object.keys(config.providers).map((provider) => (
              <Tabs.Content key={provider} value={provider}>
                <Box paddingTop={6}>
                  <ProviderConfig
                    provider={provider}
                    config={config.providers[provider]}
                    onChange={handleProviderChange}
                  />
                </Box>
              </Tabs.Content>
            ))}
          </Tabs.Root>
        </Box>
      </Layouts.Content>
    </Page.Main>
  );
};

export default SettingsPage;
