/**
 * SPDX-License-Identifier: MIT
 * Copyright (c) 2024 AJW Tech
 */

import React from 'react';
import { Box, Button, Typography, Flex } from '@strapi/design-system';
import { Check } from '@strapi/icons';

const SettingsPage = () => {
  return (
    <Box padding={8}>
      <Box background="neutral0" padding={6} hasRadius shadow="tableShadow">
        <Flex direction="column" alignItems="flex-start" gap={6}>
          <div>
            <Typography variant="beta">Configure AI Providers</Typography>
            <Typography variant="omega" textColor="neutral600">
              Configure your API keys and model settings for AI-powered content generation.
            </Typography>
          </div>
          
          <Box width="100%">
            <Typography variant="delta" marginBottom={2}>OpenAI</Typography>
            <Typography variant="omega" textColor="neutral600">
              Configure your OpenAI API key and default model settings.
            </Typography>
          </Box>
          
          <Box width="100%">
            <Typography variant="delta" marginBottom={2}>Anthropic</Typography>
            <Typography variant="omega" textColor="neutral600">
              Configure your Anthropic API key and Claude model settings.
            </Typography>
          </Box>
          
          <Box width="100%">
            <Typography variant="delta" marginBottom={2}>AWS Bedrock</Typography>
            <Typography variant="omega" textColor="neutral600">
              Configure AWS credentials and Bedrock model settings.
            </Typography>
          </Box>
          
          <Box width="100%">
            <Typography variant="delta" marginBottom={2}>GitHub Models</Typography>
            <Typography variant="omega" textColor="neutral600">
              Configure GitHub token and model selection.
            </Typography>
          </Box>
          
          <Box width="100%">
            <Typography variant="delta" marginBottom={2}>xAI Grok</Typography>
            <Typography variant="omega" textColor="neutral600">
              Configure xAI API key and Grok model settings.
            </Typography>
          </Box>
          
          <Button startIcon={<Check />} type="button">
            Save Configuration
          </Button>
        </Flex>
      </Box>
    </Box>
  );
};

export default SettingsPage;
