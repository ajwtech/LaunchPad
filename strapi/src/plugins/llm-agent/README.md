# Strapi LLM Agent Plugin

A comprehensive Strapi 5 plugin for AI-powered content generation and SEO optimization supporting multiple LLM providers.

## Features

- **Multi-Provider Support**: OpenAI, Anthropic, AWS Bedrock, GitHub Models, and xAI Grok
- **Content Generation**: AI-powered draft creation and content enhancement
- **SEO Optimization**: Automated meta descriptions, titles, slugs, and internal linking
- **Draft-Only Workflow**: All AI changes remain as drafts until manually published
- **Role-Based Access Control**: Granular permissions per content type and action  
- **Audit Logging**: Complete traceability of AI actions and changes
- **Real-time Streaming**: Live token streaming for supported providers
- **Cost Management**: Token usage tracking and cost controls

## Installation

### As a Local Plugin

1. Add the plugin to your Strapi app's `package.json`:
```json
{
  "dependencies": {
    "@ajwtech/strapi-plugin-llm-agent": "file:../plugins/strapi-plugin-llm-agent"
  }
}
```

2. Enable the plugin in `config/plugins.ts`:
```typescript
export default {
  '@ajwtech/strapi-plugin-llm-agent': {
    enabled: true,
  },
};
```

3. Install dependencies and start your Strapi application:
```bash
npm install
npm run develop
```

## Configuration

Configure provider credentials in your environment variables or plugin settings:

```env
# OpenAI
OPENAI_API_KEY=your_openai_key

# Anthropic
ANTHROPIC_API_KEY=your_anthropic_key

# AWS Bedrock
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_REGION=us-east-1

# GitHub Models
GITHUB_TOKEN=your_github_token

# xAI Grok
XAI_API_KEY=your_xai_key
```

## Usage

1. Navigate to any content type in the Strapi Admin panel
2. Look for the "Generate with AI" panel in the content editor
3. Select your preferred provider and model
4. Choose from available actions:
   - **Generate Draft**: Create new content based on prompts
   - **SEO Optimize**: Enhance titles, meta descriptions, and slugs
   - **Insert Suggestions**: Apply AI recommendations to specific fields
   - **Regenerate**: Refine content with additional feedback

## Permissions

Configure granular permissions in Settings > Users & Permissions:

- `Generate Draft`: Create AI-generated content
- `SEO Optimize`: Generate SEO recommendations
- `Insert Suggestions`: Apply AI suggestions to content
- `Switch Provider`: Change LLM provider/model
- `View Metrics`: Access usage and cost analytics

## License

MIT License - see [LICENSE](./LICENSE) file for details.

## Contributing

Please read our contributing guidelines and submit pull requests to help improve this plugin.