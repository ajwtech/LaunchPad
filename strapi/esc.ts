#!/usr/bin/env ts-node

/**
 * Runs the esc command with the ESC environment variable as the stack name.
 * Usage: yarn esc
 * Requires: ESC environment variable to be set.
 */

import { spawn } from 'child_process';

const escEnv = process.env.ESC;
if (!escEnv) {
  console.error('Error: ESC environment variable is not set.');
  process.exit(1);
}

const args = [
  'run',
  escEnv,
  '--',
  'bash',
  '-lc',
  'yarn develop:ssh --debug',
];

const child = spawn('esc', args, {
  stdio: 'inherit',
  env: process.env,
});

child.on('exit', code => process.exit(code ?? 1));
