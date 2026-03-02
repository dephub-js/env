#!/usr/bin/env node
import { Command, CommandError } from '@dephub/command';
import { logger } from '@dephub/logger';

import { loadEnv } from './core/env.js';
import { description, name, version } from './utils/pkg.js';

const shellQuote = (value: string): string =>
  `'${String(value).replace(/'/g, `'\\''`)}'`; // safe for sh/bash/zsh/fish

const powershellQuote = (value: string): string =>
  `'${String(value).replace(/'/g, `''`)}'`; // PowerShell: single quotes doubled

const validateShell = (shell: string): string => {
  const validShells = ['bash', 'zsh', 'fish', 'powershell', 'pwsh', 'sh'];
  const normalized = shell.toLowerCase();

  if (validShells.includes(normalized)) {
    return normalized;
  }

  // Auto-detect based on common patterns
  if (normalized.startsWith('pw')) return 'powershell';
  if (normalized.includes('fish')) return 'fish';
  if (normalized.includes('zsh')) return 'zsh';
  if (normalized.includes('bash')) return 'bash';

  return 'sh'; // default
};

const cmd = new Command()
  .name(name.split('/')[1] ?? 'env')
  .version(version)
  .description(description)
  .option('--project', {
    description: 'Path to the directory containing the .env file',
    optional: true,
  })
  .option('--shell', {
    description: 'bash|zsh|fish|powershell (defaults to detect)',
    optional: true,
  })
  .handler(async ({ options }) => {
    try {
      const { loaded, variables } = await loadEnv(options.project);

      if (!loaded) {
        logger.warn('No .env file found or file was empty');
        return;
      }

      const shell = validateShell(
        options.shell ?? process.env.SHELL?.split('/').pop() ?? 'sh',
      );

      // Generate shell-specific export commands
      switch (shell) {
        case 'fish':
          for (const [key, value] of Object.entries(variables)) {
            logger.log(`set -gx ${key} ${shellQuote(value)};`);
          }
          break;

        case 'powershell':
        case 'pwsh':
          for (const [key, value] of Object.entries(variables)) {
            logger.log(`$Env:${key} = ${powershellQuote(value)};`);
          }
          break;

        default: // bash / zsh / sh
          for (const [key, value] of Object.entries(variables)) {
            logger.log(`export ${key}=${shellQuote(value)};`);
          }
      }
    } catch (err) {
      logger.error('Error loading environment:', (err as Error).message);
      process.exit(1);
    }
  });

try {
  await cmd.run();
} catch (err) {
  if (err instanceof CommandError) {
    logger.error(`\nError: ${err.message}\n`);
    cmd.help();
    process.exit(1);
  }
  throw err;
}
