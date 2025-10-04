export default {
  'plugin.name': 'LLM Agent',
  'plugin.description': 'AI-powered content generation and SEO optimization for Strapi',
  'settings.title': 'LLM Agent Configuration',
  'settings.description': 'Configure AI providers for content generation',
  'settings.providers.title': 'Provider Settings',
  'settings.save': 'Save Configuration',
  'settings.saved': 'Configuration saved successfully',
  'settings.error': 'Error saving configuration',
  
  // Provider Names
  'provider.openai': 'OpenAI Configuration',
  'provider.openai.description': 'Configure OpenAI API access for GPT-4 and other models',
  'provider.anthropic': 'Anthropic Configuration',
  'provider.anthropic.description': 'Configure Anthropic API access for Claude models',
  'provider.bedrock': 'AWS Bedrock Configuration',
  'provider.bedrock.description': 'Configure AWS Bedrock access for Claude and other foundation models',
  'provider.github': 'GitHub Models Configuration',
  'provider.github.description': 'Configure GitHub Models API access for Azure OpenAI models',
  'provider.xai': 'xAI Grok Configuration',
  'provider.xai.description': 'Configure xAI API access for Grok models',
  
  // Common Fields
  'provider.enabled': 'Enable Provider',
  'provider.enabled.hint': 'Toggle to activate this AI provider',
  'provider.apiKey': 'API Key',
  'provider.apiKey.hint': 'Your API key for this provider (stored securely)',
  'provider.model': 'Default Model',
  'provider.model.hint': 'The default model to use for generation requests',
  'provider.maxTokens': 'Max Tokens',
  'provider.maxTokens.hint': 'Maximum number of tokens to generate per request',
  
  // AWS Bedrock Specific
  'provider.region': 'AWS Region',
  'provider.region.hint': 'AWS region for Bedrock service (e.g., us-east-1)',
  'provider.accessKeyId': 'AWS Access Key ID',
  'provider.accessKeyId.hint': 'Your AWS access key ID (stored securely)',
  'provider.secretAccessKey': 'AWS Secret Access Key',
  'provider.secretAccessKey.hint': 'Your AWS secret access key (stored securely)',
  
  // GitHub Specific
  'provider.token': 'GitHub Token',
  'provider.token.hint': 'Your GitHub personal access token (stored securely)',
  
  // Content Manager
  'home.title': 'LLM Agent',
  'home.description': 'AI-powered content generation and SEO optimization',
  'home.goToSettings': 'Go to Settings',
  'content.generate': 'Generate with AI',
  'content.optimize': 'Optimize SEO',
  'content.generating': 'Generating...',
  'content.optimizing': 'Optimizing...',
  
  // Actions
  'action.testConnection': 'Test Connection & Fetch Models',
  'action.connectionSuccess': 'Connection Successful',
  'action.connectionFailed': 'Connection Failed',
};
