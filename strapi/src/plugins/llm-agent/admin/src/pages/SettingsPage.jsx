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
  Tabs,
  Divider,
} from '@strapi/design-system';
import { Check } from '@strapi/icons';
import { settingsApi } from '../api';

const PLUGIN_ID = 'llm-agent';

const ProviderConfig = ({ provider, config, onChange }) => {
  const { formatMessage } = useIntl();

  const handleChange = (field, value) => {
    onChange(provider, {
      ...config,
      [field]: value,
    });
  };

  return (
    <Box padding={4} background="neutral0" hasRadius shadow="tableShadow">
      <Flex direction="column" alignItems="stretch" gap={4}>
        <Typography variant="beta">
          {formatMessage({ id: `${PLUGIN_ID}.provider.${provider}` })}
        </Typography>
        
        <Toggle
          label={formatMessage({ id: `${PLUGIN_ID}.provider.enabled` })}
          checked={config.enabled || false}
          onChange={(e) => handleChange('enabled', e.target.checked)}
        />

        {provider === 'bedrock' ? (
          <>
            <TextInput
              label={formatMessage({ id: `${PLUGIN_ID}.provider.region` })}
              name="region"
              value={config.region || ''}
              onChange={(e) => handleChange('region', e.target.value)}
              disabled={!config.enabled}
            />
            <TextInput
              label={formatMessage({ id: `${PLUGIN_ID}.provider.accessKeyId` })}
              name="accessKeyId"
              type="password"
              value={config.accessKeyId || ''}
              onChange={(e) => handleChange('accessKeyId', e.target.value)}
              disabled={!config.enabled}
            />
            <TextInput
              label={formatMessage({ id: `${PLUGIN_ID}.provider.secretAccessKey` })}
              name="secretAccessKey"
              type="password"
              value={config.secretAccessKey || ''}
              onChange={(e) => handleChange('secretAccessKey', e.target.value)}
              disabled={!config.enabled}
            />
          </>
        ) : provider === 'github' ? (
          <TextInput
            label={formatMessage({ id: `${PLUGIN_ID}.provider.token` })}
            name="token"
            type="password"
            value={config.token || ''}
            onChange={(e) => handleChange('token', e.target.value)}
            disabled={!config.enabled}
          />
        ) : (
          <TextInput
            label={formatMessage({ id: `${PLUGIN_ID}.provider.apiKey` })}
            name="apiKey"
            type="password"
            value={config.apiKey || ''}
            onChange={(e) => handleChange('apiKey', e.target.value)}
            disabled={!config.enabled}
          />
        )}

        <TextInput
          label={formatMessage({ id: `${PLUGIN_ID}.provider.model` })}
          name="defaultModel"
          value={config.defaultModel || ''}
          onChange={(e) => handleChange('defaultModel', e.target.value)}
          disabled={!config.enabled}
        />

        <NumberInput
          label={formatMessage({ id: `${PLUGIN_ID}.provider.maxTokens` })}
          name="maxTokens"
          value={config.maxTokens || 4000}
          onValueChange={(value) => handleChange('maxTokens', value)}
          disabled={!config.enabled}
        />
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
