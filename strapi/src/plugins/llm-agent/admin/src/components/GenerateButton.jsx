/**
 * SPDX-License-Identifier: MIT
 * Copyright (c) 2024 AJW Tech
 */

import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { Button, Box, Modal, Flex, Typography, Textarea } from '@strapi/design-system';
import { Sparkle, Check } from '@strapi/icons';
import { contentApi } from '../api';

const PLUGIN_ID = 'llm-agent';

const GenerateButton = ({ model, documentId, locale }) => {
  const { formatMessage } = useIntl();
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleGenerate = async () => {
    try {
      setLoading(true);
      const data = await contentApi.generateDraft({
        contentType: model,
        documentId,
        locale,
        prompt,
      });
      setResult(data);
    } catch (error) {
      console.error('Error generating content:', error);
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
      setPrompt('');
      setResult(null);
      // Trigger page refresh
      window.location.reload();
    } catch (error) {
      console.error('Error inserting suggestions:', error);
    }
  };

  return (
    <>
      <Button
        variant="secondary"
        startIcon={<Sparkle />}
        onClick={() => setIsOpen(true)}
      >
        {formatMessage({ id: `${PLUGIN_ID}.content.generate` })}
      </Button>

      {isOpen && (
        <Modal.Root onClose={() => setIsOpen(false)}>
          <Modal.Header>
            <Typography fontWeight="bold" textColor="neutral800" as="h2">
              {formatMessage({ id: `${PLUGIN_ID}.content.generate` })}
            </Typography>
          </Modal.Header>
          <Modal.Body>
            <Flex direction="column" alignItems="stretch" gap={4}>
              {!result ? (
                <>
                  <Textarea
                    label="Prompt"
                    placeholder="Describe what content you want to generate..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    rows={6}
                  />
                  <Button
                    onClick={handleGenerate}
                    loading={loading}
                    disabled={!prompt}
                    fullWidth
                  >
                    {formatMessage({ id: `${PLUGIN_ID}.content.generating` })}
                  </Button>
                </>
              ) : (
                <>
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
                    Insert Suggestions
                  </Button>
                </>
              )}
            </Flex>
          </Modal.Body>
        </Modal.Root>
      )}
    </>
  );
};

export default GenerateButton;
