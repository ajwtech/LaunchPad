/**
 * SPDX-License-Identifier: MIT
 * Copyright (c) 2024 AJW Tech
 */

import React from 'react';
import { useIntl } from 'react-intl';
import { Page, Layouts } from '@strapi/strapi/admin';
import { Box, Button, Typography, Flex } from '@strapi/design-system';
import { Cog } from '@strapi/icons';
import { useNavigate } from 'react-router-dom';

const PLUGIN_ID = 'llm-agent';

const HomePage = () => {
  const { formatMessage } = useIntl();
  const navigate = useNavigate();

  return (
    <Page.Main>
      <Page.Title>
        {formatMessage({ id: `${PLUGIN_ID}.home.title` })}
      </Page.Title>
      
      <Layouts.Header
        title={formatMessage({ id: `${PLUGIN_ID}.home.title` })}
        subtitle={formatMessage({ id: `${PLUGIN_ID}.home.description` })}
      />

      <Layouts.Content>
        <Box padding={8}>
          <Flex direction="column" alignItems="center" gap={6}>
            <Typography variant="alpha">
              {formatMessage({ id: `${PLUGIN_ID}.home.title` })}
            </Typography>
            <Typography variant="epsilon" textColor="neutral600">
              {formatMessage({ id: `${PLUGIN_ID}.home.description` })}
            </Typography>
            <Button
              variant="secondary"
              startIcon={<Cog />}
              onClick={() => navigate(`/settings/${PLUGIN_ID}`)}
            >
              {formatMessage({ id: `${PLUGIN_ID}.home.goToSettings` })}
            </Button>
          </Flex>
        </Box>
      </Layouts.Content>
    </Page.Main>
  );
};

export default HomePage;
