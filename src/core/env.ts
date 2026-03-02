import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

import { logger } from '@dephub/logger';

export interface EnvResult {
  /** Parsed environment variables */
  variables: Record<string, string>;
  /** Whether the .env file was found and loaded */
  loaded: boolean;
}

/**
 * Load and parse .env file from specified directory and set process.env
 *
 * @param project - Project directory containing .env file (default: current directory)
 * @returns Parsed environment variables and load status
 *
 * @example
 * ```typescript
 * const { variables, loaded } = await loadEnv('./project');
 * console.log(variables.DATABASE_URL);
 * ```
 */
export const loadEnv = async (project = '.'): Promise<EnvResult> => {
  const dir = resolve(project, '.env');
  const envVars: Record<string, string> = {};
  let loaded = false;

  try {
    const content = await readFile(dir, 'utf-8');

    content.split('\n').forEach((line, index) => {
      const trimmed = line.trim();

      // Skip empty lines and comments
      if (!trimmed || trimmed.startsWith('#')) return;

      const eqIndex = trimmed.indexOf('=');
      if (eqIndex === -1) {
        logger.warn(`Invalid line ${index + 1} in ${dir}: missing equals sign`);
        return;
      }

      const key = trimmed.slice(0, eqIndex).trim();
      let value = trimmed.slice(eqIndex + 1).trim();

      // Handle inline comments
      const commentIndex = value.indexOf(' #');
      if (commentIndex !== -1) {
        value = value.slice(0, commentIndex).trim();
      }

      // Remove surrounding quotes while preserving escaped characters
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }

      if (key) {
        if (envVars[key] === undefined) {
          envVars[key] = value;
          loaded = true;

          // Set process.env if not already set
          process.env[key] ??= value;
        }
      }
    });

    return { loaded: true, variables: envVars };
  } catch (error) {
    // File doesn't exist or cannot be read
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
      logger.warn(`Error reading ${dir}:`, (error as Error).message);
    }
    return { loaded, variables: {} };
  }
};
