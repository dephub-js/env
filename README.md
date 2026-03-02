# @dephub/env 🔧

> Load environment variables from .env files into process.env

[![NPM version](https://img.shields.io/npm/v/@dephub/env.svg?style=flat)](https://npmjs.org/package/@dephub/env)
[![ESM-only](https://img.shields.io/badge/ESM-only-brightgreen?style=flat)](https://nodejs.org/)

---

## Features ✨

- 📁 Load `.env` files into `process.env`
- 🐚 Generate shell exports (bash, zsh, fish, PowerShell)
- 🔧 Simple API - `loadEnv()` and CLI
- 🛡️ TypeScript support
- 💻 Cross-platform shell support

---

## Installation 📦

- npm: `npm install @dephub/env`
- pnpm: `pnpm add @dephub/env`
- yarn: `yarn add @dephub/env`
- bun: `bun add @dephub/env`

## Quick Start 🚀

```bash
# CLI - load .env and export to shell
eval "$(env)"

# API - load into process.env
import { loadEnv } from '@dephub/env';
await loadEnv();
```

---

## Usage

### CLI

```bash
# Load .env and generate shell exports
eval "$(env)"

# From specific directory
eval "$(env --project ./my-app)"

# Different shell formats
env --shell powershell
env --shell fish
```

### API

```typescript
import { loadEnv } from '@dephub/env';

// Load .env into process.env
const { variables, loaded } = await loadEnv();

// Use variables directly
console.log(process.env.DATABASE_URL);
console.log(variables.API_KEY);
```

---

## API

### `loadEnv(project?)`

Load .env file and set `process.env`

**Parameters:**

- `project` - Directory containing .env (default: current)

**Returns:**

```typescript
{
  variables: Record<string, string>; // Parsed vars
  loaded: boolean; // File was found and loaded
}
```

### CLI Options

- `--project` - Project directory
- `--shell` - Output format: bash, zsh, fish, powershell

---

## Examples

### Basic App Setup

```typescript
// Load env before app starts
await loadEnv();

// Now available in process.env
server.listen(process.env.PORT);
db.connect(process.env.DATABASE_URL);
```

### Shell Integration

```bash
# Development setup
echo 'eval "$(env)"' >> ~/.zshrc

# Project-specific
echo 'eval "$(env --project ~/projects/my-app)"' >> ~/.bashrc
```

---

## License 📄

MIT License – see [LICENSE](LICENSE) for details.

**Author:** Estarlin R ([estarlincito.com](https://estarlincito.com))
