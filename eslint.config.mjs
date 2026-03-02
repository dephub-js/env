import { defineConfig } from 'eslint/config';
import tsConfig from '@dephub/eslint-ts';

export default defineConfig([
  ...tsConfig,
  {
    rules: {
      'security/detect-non-literal-fs-filename': 'off',
      'security/detect-object-injection': 'off',
    },
  },
]);
