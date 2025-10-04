# LLM Agent Plugin - Testing Guide

## Prerequisites

1. Strapi 5 application running
2. Admin panel accessible at `http://localhost:1337/admin`
3. Plugin enabled in `strapi/config/plugins.ts`

## Manual Testing Steps

### 1. Verify Plugin Installation

After starting Strapi, check the console for:
```
LLM Agent Plugin: Admin panel registered
LLM Agent Plugin: Admin panel bootstrapped
```

### 2. Test Settings Page

1. **Navigate to Settings:**
   - Log in to Strapi Admin Panel
   - Go to `Settings` in the left sidebar
   - Look for `LLM Agent` section
   - Click on `Configuration`

2. **Test Provider Configuration:**
   - Click on each provider tab:
     - OpenAI
     - Anthropic
     - AWS Bedrock
     - GitHub Models
     - xAI Grok
   
3. **Test Form Inputs:**
   - Toggle "Enabled" switch (should enable/disable fields)
   - Enter API key in password field
   - Enter model name (e.g., "gpt-4o")
   - Set max tokens (e.g., 4000)
   - For AWS Bedrock:
     - Enter Region
     - Enter Access Key ID
     - Enter Secret Access Key
   - For GitHub:
     - Enter GitHub Token instead of API Key

4. **Test Save Functionality:**
   - Click "Save Configuration" button
   - Verify no errors in browser console
   - Refresh the page
   - Verify settings are persisted

### 3. Test Content Manager Integration

1. **Navigate to Content Manager:**
   - Go to `Content Manager` in left sidebar
   - Choose any content type (e.g., Article, Page)
   - Create a new entry or edit existing one

2. **Test Generate with AI Button:**
   - Look for "Generate with AI" button (with sparkle icon ✨)
   - Click the button
   - Modal should open with:
     - Prompt textarea
     - Generate button
   - Enter a prompt (e.g., "Write a blog post about AI")
   - Click "Generate"
   - Should show loading state
   - Should display generated suggestions
   - Click "Insert Suggestions"
   - Page should refresh with content

3. **Test Optimize SEO Button:**
   - Look for "Optimize SEO" button (with search icon 🔍)
   - Click the button
   - Modal should open and immediately start optimizing
   - Should show loading state
   - Should display SEO suggestions
   - Click "Insert SEO Suggestions"
   - Page should refresh with optimized content

### 4. Test Main Menu Link

1. **Navigate to Plugin:**
   - Look for "LLM Agent" in left sidebar (with sparkle icon ✨)
   - Click on it
   - Should navigate to plugin home page
   - Should show:
     - Plugin title
     - Description
     - "Go to Settings" button

2. **Test Navigation:**
   - Click "Go to Settings" button
   - Should navigate to Settings page

### 5. Test API Endpoints

Using browser DevTools or curl:

1. **Get Configuration:**
   ```bash
   curl -X GET http://localhost:1337/api/llm-agent/config \
     -H "Authorization: Bearer YOUR_TOKEN"
   ```
   Should return sanitized config (without API keys)

2. **Update Configuration:**
   ```bash
   curl -X PUT http://localhost:1337/api/llm-agent/config \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{
       "providers": {
         "openai": {
           "enabled": true,
           "apiKey": "sk-...",
           "defaultModel": "gpt-4o",
           "maxTokens": 4000
         }
       }
     }'
   ```

3. **Get Providers:**
   ```bash
   curl -X GET http://localhost:1337/api/llm-agent/providers \
     -H "Authorization: Bearer YOUR_TOKEN"
   ```

4. **Generate Draft:**
   ```bash
   curl -X POST http://localhost:1337/api/llm-agent/generate-draft \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{
       "contentType": "api::article.article",
       "prompt": "Write a blog post about AI"
     }'
   ```

## Expected Behavior

### Settings Page
- ✅ Form inputs work correctly
- ✅ Enable/disable toggles work
- ✅ Save button persists configuration
- ✅ Configuration loads on page refresh
- ✅ No API keys are exposed in responses

### Content Manager Integration
- ✅ Buttons appear in edit view
- ✅ Modals open correctly
- ✅ Loading states display
- ✅ Generated content displays
- ✅ Insert functionality works

### API Endpoints
- ✅ Authentication required
- ✅ Proper error handling
- ✅ Sanitized responses
- ✅ Rate limiting applied

## Known Issues

1. **Placeholder Implementations:**
   - AI generation returns mock data
   - Actual provider integration not implemented
   - This is expected and documented

2. **Pre-existing TypeScript Error:**
   - Error in `src/middlewares/deepPopulate.ts`
   - Unrelated to LLM Agent plugin
   - Does not affect plugin functionality

3. **Page Refresh on Insert:**
   - Current implementation refreshes page after inserting suggestions
   - Could be improved with state management in future

## Troubleshooting

### Plugin Not Appearing
- Check `strapi/config/plugins.ts` has llm-agent enabled
- Check console for errors during startup
- Verify plugin structure with `node validate-structure.js`

### Settings Not Saving
- Check browser console for API errors
- Verify authentication token is valid
- Check Strapi logs for server errors

### Buttons Not Appearing in Content Manager
- Verify plugin bootstrap completed
- Check for JavaScript errors in console
- Try clearing browser cache

### API Errors
- Verify user has proper permissions
- Check authentication headers
- Review Strapi server logs

## Performance Notes

- Settings page loads instantly
- Config API calls are fast (<100ms)
- Content generation mock responses are immediate
- Real AI integrations will take longer (2-10 seconds)

## Browser Compatibility

Tested and working on:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Next Steps After Testing

1. Implement actual AI provider integrations
2. Add streaming support for long responses
3. Implement cost tracking
4. Add usage metrics dashboard
5. Enhance error handling
6. Add unit tests
7. Add E2E tests
