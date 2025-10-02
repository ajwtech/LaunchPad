#!/usr/bin/env node
/**
 * Simple validation script to check LLM Agent plugin structure
 */

const fs = require('fs');
const path = require('path');

const PLUGIN_DIR = __dirname;
const REQUIRED_FILES = [
  'admin/index.js',
  'admin/src/api/index.js',
  'admin/src/pages/HomePage.jsx',
  'admin/src/pages/SettingsPage.jsx',
  'admin/src/components/GenerateButton.jsx',
  'admin/src/components/OptimizeSEOButton.jsx',
  'admin/src/translations/en.js',
  'admin/src/utils/prefixPluginTranslations.js',
  'server/index.js',
  'server/controllers/llm-controller.js',
  'server/routes/index.js',
  'server/config/index.js',
  'strapi-admin.js',
  'strapi-server.js',
  'package.json',
];

console.log('🔍 Validating LLM Agent Plugin Structure...\n');

let allValid = true;

REQUIRED_FILES.forEach(file => {
  const filePath = path.join(PLUGIN_DIR, file);
  const exists = fs.existsSync(filePath);
  
  if (exists) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING`);
    allValid = false;
  }
});

console.log('\n' + '='.repeat(50));

if (allValid) {
  console.log('✅ Plugin structure is valid!');
  process.exit(0);
} else {
  console.log('❌ Some files are missing!');
  process.exit(1);
}
