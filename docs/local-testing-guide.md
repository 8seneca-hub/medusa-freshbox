# Local Testing Guide

Test your customizations in a downstream Medusa project **before** publishing to npm.

This uses `medusa-dev-cli`, which watches your local monorepo for changes and copies compiled files directly into your project's `node_modules/`.

---

## 1. Prerequisites

- **This monorepo** cloned and built:
  ```bash
  cd /path/to/medusa-freshbox
  yarn install
  yarn build
  ```
- **A downstream Medusa project** that depends on `@medusajs/*` packages (or `@freshbox-medusa/*` if you've already done the scope rename)

---

## 2. Install medusa-dev-cli

In your **downstream project** (not this monorepo):

```bash
npm install -g medusa-dev-cli
```

Verify:

```bash
medusa-dev --version
```

---

## 3. One-Time Setup

Tell `medusa-dev` where this monorepo lives:

medusa-dev --set-path-to-repo /path/to/medusa-freshbox

```bash
medusa-dev --set-path-to-repo /Users/leminhchi/Documents/Freshbox/medusa-freshbox
```

This saves the path globally (in your OS user config directory). You only need to do this once.

---

## 4. Start Watching

From your **downstream project root**:

```bash
medusa-dev
```

What happens:

1. Reads your project's `package.json` to find which `@medusajs/*` (or `@freshbox-medusa/*`) packages you depend on
2. Matches them against packages in this monorepo
3. Copies compiled `dist/` files from the monorepo into your `node_modules/`
4. Watches for further changes — when you rebuild a package in the monorepo, the updated files are automatically copied over

Your downstream project now uses your local monorepo code instead of what was installed from npm.

---

## 5. Typical Workflow

**Terminal 1** — monorepo (watch for changes):

```bash
cd /path/to/medusa-freshbox/packages/medusa
yarn watch
```

Or for a specific core package:

```bash
cd /path/to/medusa-freshbox/packages/core/core-flows
yarn watch
```

**Terminal 2** — downstream project (receive changes):

```bash
cd /path/to/your-project
medusa-dev
```

**Terminal 3** — downstream project (run your app):

```bash
cd /path/to/your-project
yarn dev
```

Now when you edit source files in the monorepo, `yarn watch` recompiles them, and `medusa-dev` copies the compiled output into your project's `node_modules/` automatically.

---

## 6. Common Options

```bash
# Copy once and exit (no watching)
medusa-dev --scan-once

# Suppress per-file copy logs
medusa-dev --quiet

# Copy all packages, not just the ones your project depends on
medusa-dev --copy-all

# Only copy specific packages
medusa-dev --packages @medusajs/utils @medusajs/framework

# Force Verdaccio local registry mode (needed for Yarn workspace projects)
medusa-dev --force-install
```

---

## 7. Yarn Workspace Projects

If your downstream project is inside a Yarn workspace, `medusa-dev` **automatically** switches to Verdaccio mode — it starts a local npm registry at `http://localhost:4873`, publishes packages there with a `-dev-<timestamp>` version suffix, and runs `yarn install` against that registry.

You can also trigger this manually with `--force-install`.

---

## 8. What Gets Copied

- Only compiled files in `dist/` (not `src/` TypeScript sources)
- `package.json` changes are **not** copied — they trigger dependency change detection instead
- If dependency changes are detected (e.g., a new dep was added to a core package), `medusa-dev` falls back to the Verdaccio flow for those packages

---

## 9. Testing a Specific Change

Example: you modified the store product API to also return draft products.

1. Build the changed package:

   ```bash
   cd /path/to/medusa-freshbox
   yarn workspace @medusajs/medusa build
   ```

2. In your downstream project with `medusa-dev` running, the new build is automatically copied.

3. Restart your downstream project's dev server and test:
   ```bash
   # Your SDK call now returns both published and draft products
   ```

If you changed multiple packages (e.g., `utils` and `framework`), build them in dependency order or just run `yarn build` from the monorepo root.

---

## 10. When to Use This vs Publishing

| Scenario                             | Use                                                                          |
| ------------------------------------ | ---------------------------------------------------------------------------- |
| Developing and iterating on a change | `medusa-dev` (this guide)                                                    |
| QA / staging environment testing     | Publish a pre-release: `node scripts/release-core-packages.js 2.13.6-beta.1` |
| Production deployment                | Publish a stable release: `node scripts/release-core-packages.js 2.13.6`     |

See `docs/publishing-guide.md` for the full publishing workflow.
