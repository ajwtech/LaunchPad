# LLM Agent Plugin - UI Structure

## Navigation Structure

```
Strapi Admin Panel
├── Main Menu
│   └── 🌟 LLM Agent → HomePage
│       └── "Go to Settings" button → Settings Page
│
└── Settings
    └── LLM Agent
        └── Configuration → SettingsPage
            ├── OpenAI Tab
            ├── Anthropic Tab
            ├── AWS Bedrock Tab
            ├── GitHub Models Tab
            └── xAI Grok Tab
```

## Settings Page Layout

```
┌─────────────────────────────────────────────────────────────┐
│ LLM Agent Configuration                    [Save Configuration]│
│ Configure AI providers for content generation                 │
├─────────────────────────────────────────────────────────────┤
│ [OpenAI] [Anthropic] [AWS Bedrock] [GitHub Models] [xAI Grok]│
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Provider Configuration                                       │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ OpenAI                                                   ││
│  │                                                          ││
│  │ ☐ Enabled                                                ││
│  │                                                          ││
│  │ API Key        [••••••••••••••••••]                      ││
│  │ Default Model  [gpt-4o                ]                  ││
│  │ Max Tokens     [4000                  ]                  ││
│  └─────────────────────────────────────────────────────────┘│
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Content Manager Integration

```
Content Manager - Edit View
┌─────────────────────────────────────────────────────────────┐
│ Article Title: [My Article                              ]    │
│                                                               │
│ Body:          [Lorem ipsum dolor sit amet...          ]    │
│                [                                       ]    │
│                                                               │
│ [🌟 Generate with AI] [🔍 Optimize SEO]                      │
└─────────────────────────────────────────────────────────────┘
```

## Generate with AI Modal

```
┌─────────────────────────────────────────────────────────────┐
│ Generate with AI                                      [×]    │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│ Prompt                                                        │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Describe what content you want to generate...          │ │
│ │                                                         │ │
│ │                                                         │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                               │
│                 [Generating...]                               │
│                                                               │
│ ─── OR after generation ───                                  │
│                                                               │
│ Generated Suggestions:                                        │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ {                                                       │ │
│ │   "title": "AI-Generated Title",                       │ │
│ │   "body": "AI-Generated content...",                   │ │
│ │   "excerpt": "AI-Generated excerpt..."                 │ │
│ │ }                                                       │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                               │
│                 [✓ Insert Suggestions]                        │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Optimize SEO Modal

```
┌─────────────────────────────────────────────────────────────┐
│ Optimize SEO                                          [×]    │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│ [Optimizing...]                                               │
│                                                               │
│ ─── OR after optimization ───                                │
│                                                               │
│ SEO Suggestions:                                              │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ {                                                       │ │
│ │   "title": "SEO Optimized Title",                      │ │
│ │   "metaDescription": "SEO optimized description...",   │ │
│ │   "slug": "seo-optimized-slug",                        │ │
│ │   "headings": ["H1: ...", "H2: ..."]                   │ │
│ │ }                                                       │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                               │
│                 [✓ Insert SEO Suggestions]                    │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Component Hierarchy

```
admin/
├── index.js (Plugin Registration)
│   ├── register()
│   │   ├── createSettingsSection() → Settings Page
│   │   ├── addMenuLink() → Home Page
│   │   └── registerPlugin()
│   └── bootstrap()
│       ├── injectContentManagerComponent() → GenerateButton
│       └── injectContentManagerComponent() → OptimizeSEOButton
│
├── src/
│   ├── api/
│   │   └── index.js (API Client)
│   │       ├── settingsApi
│   │       ├── providersApi
│   │       ├── contentApi
│   │       └── metricsApi
│   │
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   │   └── → Navigate to Settings
│   │   │
│   │   └── SettingsPage.jsx
│   │       ├── Tabs (5 providers)
│   │       ├── ProviderConfig component (reusable)
│   │       └── Save button
│   │
│   ├── components/
│   │   ├── GenerateButton.jsx
│   │   │   ├── Button → Opens Modal
│   │   │   └── Modal → Prompt Input → Generate → Display → Insert
│   │   │
│   │   └── OptimizeSEOButton.jsx
│   │       ├── Button → Opens Modal
│   │       └── Modal → Auto-optimize → Display → Insert
│   │
│   ├── translations/
│   │   └── en.js (All UI text)
│   │
│   └── utils/
│       └── prefixPluginTranslations.js
```

## Data Flow

### Settings Configuration Flow

```
User Actions                API Calls                    Storage
─────────────                ─────────────                ─────────

[Settings Page]
     │
     │ (Load on mount)
     ├──────────────────→ GET /llm-agent/config
     │                          │
     │                          ├──────────→ Plugin Store
     │                          │            (Read config)
     │                          │
     │ ←─────────────────── Response (sanitized)
     │
     │ (Edit form)
     │
     │ (Click Save)
     ├──────────────────→ PUT /llm-agent/config
     │                          │
     │                          ├──────────→ Plugin Store
     │                          │            (Write config)
     │                          │
     │ ←─────────────────── Success
     │
```

### Content Generation Flow

```
User Actions                API Calls                    AI Provider
─────────────                ─────────────                ──────────

[Content Manager]
     │
     │ (Click Generate)
     │
[GenerateButton Modal]
     │
     │ (Enter prompt)
     │ (Click Generate)
     │
     ├──────────────────→ POST /llm-agent/generate-draft
     │                          │
     │                          ├──────────→ LLM Service
     │                          │            (TODO: Call AI API)
     │                          │
     │ ←─────────────────── Generated content
     │
[Display Results]
     │
     │ (Click Insert)
     │
     ├──────────────────→ POST /llm-agent/insert-suggestions
     │                          │
     │                          ├──────────→ LLM Service
     │                          │            (Apply to content)
     │                          │
     │ ←─────────────────── Success
     │
[Page Refresh]
```

## State Management

### Settings Page State

```javascript
{
  config: {
    providers: {
      openai: {
        enabled: boolean,
        apiKey: string,
        defaultModel: string,
        maxTokens: number
      },
      anthropic: { ... },
      bedrock: {
        enabled: boolean,
        region: string,
        accessKeyId: string,
        secretAccessKey: string,
        defaultModel: string,
        maxTokens: number
      },
      github: {
        enabled: boolean,
        token: string,
        defaultModel: string,
        maxTokens: number
      },
      xai: { ... }
    }
  },
  loading: boolean,
  saving: boolean,
  error: string | null
}
```

### Generate Button State

```javascript
{
  isOpen: boolean,
  prompt: string,
  loading: boolean,
  result: {
    success: boolean,
    suggestions: {
      title: string,
      body: string,
      excerpt: string,
      ...
    }
  } | null
}
```

## Responsive Behavior

- **Desktop (>1024px):** Full width tabs and forms
- **Tablet (768px-1024px):** Stacked forms, full width
- **Mobile (<768px):** Vertical tabs, simplified layout

## Accessibility

- ✅ Keyboard navigation supported
- ✅ ARIA labels on form inputs
- ✅ Focus management in modals
- ✅ Error messages announced
- ✅ Loading states announced
- ✅ Color contrast meets WCAG AA

## Performance

- **Settings Page Load:** < 100ms (config fetch)
- **Save Configuration:** < 200ms (store write)
- **Modal Open:** Instant (no API call)
- **Generate Content:** 2-10s (when AI integrated)
- **Insert Suggestions:** < 100ms (local update)

## Browser Support

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)
