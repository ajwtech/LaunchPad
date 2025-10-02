/**
 * SPDX-License-Identifier: MIT
 * Copyright (c) 2024 AJW Tech
 */

import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { Button, Box, Modal, Flex, Typography } from '@strapi/design-system';
import { Search, Check } from '@strapi/icons';
import { contentApi } from '../api';

const PLUGIN_ID = 'llm-agent';

const OptimizeSEOButton = ({ model, documentId, locale }) => {
  const { formatMessage } = useIntl();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleOptimize = async () => {
    try {
      setLoading(true);
      const data = await contentApi.seoOptimize({
        contentType: model,
        documentId,
        locale,
      });
      setResult(data);
    } catch (error) {
      console.error('Error optimizing SEO:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInsert = async () => {
    if (!result) return;
    
    try {
      await contentApi.insertSuggestions({
        contentType: model,
        documentId,
        locale,
        suggestions: result.suggestions,
      });
      setIsOpen(false);
      setResult(null);
      // Trigger page refresh
      window.location.reload();
    } catch (error) {
      console.error('Error inserting SEO suggestions:', error);
    }
  };

  return (
    <>
      <Button
        variant="secondary"
        startIcon={<Search />}
        onClick={() => {
          setIsOpen(true);
          handleOptimize();
        }}
      >
        {formatMessage({ id: `${PLUGIN_ID}.content.optimize` })}
      </Button>

      {isOpen && (
        <Modal.Root onClose={() => setIsOpen(false)}>
          <Modal.Header>
            <Typography fontWeight="bold" textColor="neutral800" as="h2">
              {formatMessage({ id: `${PLUGIN_ID}.content.optimize` })}
            </Typography>
          </Modal.Header>
          <Modal.Body>
            {loading ? (
              <Typography>
                {formatMessage({ id: `${PLUGIN_ID}.content.optimizing` })}
              </Typography>
            ) : result ? (
              <Flex direction="column" alignItems="stretch" gap={4}>
                <Box padding={4} background="neutral100" hasRadius>
                  <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
                    {JSON.stringify(result.suggestions, null, 2)}
                  </pre>
                </Box>
                <Button
                  onClick={handleInsert}
                  startIcon={<Check />}
                  fullWidth
                >
                  Insert SEO Suggestions
                </Button>
              </Flex>
            ) : null}
          </Modal.Body>
        </Modal.Root>
      )}
    </>
  );
};

export default OptimizeSEOButton;
