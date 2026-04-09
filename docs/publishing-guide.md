# Publishing @freshbox-medusa Core Packages to npm

Step-by-step guide for publishing the Medusa v2 core packages to npm.

---

## 0. Change Your npm Scope (First-Time Fork Setup)

If you forked this repo, you **must** replace `@freshbox-medusa` with your own npm scope before publishing. Publishing under `@freshbox-medusa` will either fail (no permission) or conflict with existing packages.

### Create your npm scope

1. Go to [npmjs.com](https://www.npmjs.com) and sign in
2. Create an organization (e.g., `@myshop`) — this becomes your scope

### Find and replace the scope

Replace `@freshbox-medusa` with `@yourscope` in these locations:

| Location | What to change |
|----------|---------------|
| **48 `package.json` files** across `packages/` | The `"name"` field (e.g., `@freshbox-medusa/utils` -> `@yourscope/utils`) |
| `scripts/release-core-packages.js` | Hardcoded package names in `CORE_PACKAGES` array (lines 14-82) |
| `scripts/release-workflow.js` | Hardcoded package names in `CORE_PACKAGES` array |
| `scripts/publish-new-packages.js` | `const SCOPE = '@freshbox-medusa'` (line 12) |
| `scripts/publish-providers.js` | `const SCOPE = '@freshbox-medusa'` (line 12) |
| `.changeset/config.json` | `"fixed": [["@freshbox-medusa/*", ...]]` (line 5) |

**Quick way** (from repo root):
```bash
# Preview what would change
grep -r "@freshbox-medusa" --include="package.json" -l
grep -r "@freshbox-medusa" scripts/ .changeset/config.json
```

```bash
# macOS:
find . -name "package.json" -not -path "*/node_modules/*" -exec sed -i '' 's/@freshbox-medusa/@yourscope/g' {} +
sed -i '' 's/@freshbox-medusa/@yourscope/g' scripts/*.js .changeset/config.json

# Linux:
find . -name "package.json" -not -path "*/node_modules/*" -exec sed -i 's/@freshbox-medusa/@yourscope/g' {} +
sed -i 's/@freshbox-medusa/@yourscope/g' scripts/*.js .changeset/config.json
```

You also need to update the **TypeScript source imports** across the codebase. These are in `packages/core/`, `packages/modules/`, `packages/medusa/`, etc.:
```bash
# macOS:
find packages -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" \) \
  -not -path "*/node_modules/*" -not -path "*/dist/*" \
  -exec sed -i '' 's/@freshbox-medusa/@yourscope/g' {} +

# Linux:
find packages -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" \) \
  -not -path "*/node_modules/*" -not -path "*/dist/*" \
  -exec sed -i 's/@freshbox-medusa/@yourscope/g' {} +
```

After replacing:
1. Run `yarn install` to update workspace resolution
2. Run `yarn build` to verify everything compiles
3. Review the diff with `git diff` and commit the scope change

---

## 1. Prerequisites

Before publishing, make sure you have:

- [ ] **Node.js >= 20** installed
- [ ] **npm account** with publish access to your scope
- [ ] Logged in to npm:
  ```bash
  npm login
  # Verify with:
  npm whoami
  ```
- [ ] **npm 2FA**: If your npm account has two-factor authentication enabled, `npm publish` will prompt for a one-time password (OTP) during each publish. The release scripts pass the prompt through to your terminal, so just type it when asked. You will be prompted **once per package** (up to 7 times for a full core release).
- [ ] **Clean git state** on the `develop` branch:
  ```bash
  git checkout develop
  git pull origin develop
  git status  # should be clean
  ```
- [ ] **Decide the new version number** using semver:
  - Patch (`2.11.1` -> `2.11.2`): bug fixes, decimal precision tweaks
  - Minor (`2.11.1` -> `2.12.0`): new features, new workflow steps
  - Major (`2.11.1` -> `3.0.0`): breaking API changes
  - Pre-release: `2.12.0-beta.1` (publishes with `beta` tag instead of `latest`)

---

## 2. Package Dependency Chain

The core packages **must** be published in this order because each depends on the ones above it:

```
@freshbox-medusa/utils
    |
@freshbox-medusa/orchestration
    |
@freshbox-medusa/modules-sdk
    |
@freshbox-medusa/workflows-sdk
    |
@freshbox-medusa/framework
    |
@freshbox-medusa/cli
    |
@freshbox-medusa/medusa          (the final server package)
```

The `release-core-packages.js` script handles this order automatically. **Do not publish these packages manually out of order** — downstream packages will fail to resolve their dependencies on npm.

---

## 3. Full Core Release (Most Common)

**When to use**: You modified anything in `packages/core/utils`, `packages/core/framework`, `packages/core/orchestration`, `packages/core/modules-sdk`, `packages/core/workflows-sdk`, `packages/cli/medusa-cli`, or `packages/medusa`. This covers pricing/promotion changes, totals logic, cart workflows, etc.

### Run the release

```bash
node scripts/release-core-packages.js <version>

# Example:
node scripts/release-core-packages.js 2.12.0

# Pre-release example (publishes with "beta" npm tag):
node scripts/release-core-packages.js 2.12.0-beta.1
```

### What happens behind the scenes

For each of the 7 packages, in dependency order, the script:

1. **Updates `package.json` version** to the new version
2. **Runs `yarn build`** in the package directory
3. **Clears yarn cache** to avoid stale resolution
4. **Runs `npm publish --access public`** (with `--tag beta` for pre-release versions)
5. **Verifies on the npm registry** that the package is available (polls up to 10 times with 30s intervals)
6. **Updates dependent packages' `package.json`** to reference the new version

If any package fails, the script **stops immediately** — no partial releases where downstream packages reference versions that don't exist.

> **Important**: The script modifies `package.json` files locally (version bumps + cross-dependency updates) but does **not** commit them. After a successful release, you must commit and push these changes:
> ```bash
> git add -A
> git commit -m "chore: release v2.12.0"
> git push origin develop
> ```

### Timing

- There is a **5-second cancellation window** at the start (Ctrl+C to abort)
- **10-second delay** between each package publish
- **30-second retry delay** on failure (up to 3 retries per package)
- Full release of all 7 packages takes approximately **5-10 minutes**

---

## 4. Core-Flows Only Release (Shortcut)

**When to use**: You **only** modified files in `packages/core/core-flows` (workflow steps, compensations) and did NOT touch `utils`, `framework`, or other core packages.

```bash
node scripts/release-workflow.js <version>

# Example:
node scripts/release-workflow.js 2.12.0
```

This publishes only 2 packages:
1. `@freshbox-medusa/core-flows`
2. `@freshbox-medusa/medusa` (because it depends on core-flows)

Same behavior as the full release script — just fewer packages.

---

## 5. Post-Release Verification

### Check that packages are on npm

```bash
# Check a specific package
npm view @freshbox-medusa/utils dist-tags.latest
npm view @freshbox-medusa/framework dist-tags.latest
npm view @freshbox-medusa/medusa dist-tags.latest

# For pre-release versions
npm view @freshbox-medusa/medusa dist-tags.beta
```

### Catch any missed packages

Run the auto-discover script to check for unpublished `@freshbox-medusa/*` packages:

```bash
yarn publish:check-and-publish
```

> **Limitation**: This script only scans `packages/*` and `packages/modules/*` (one level deep). It does **not** scan `packages/core/*`, `packages/admin/*`, or `packages/cli/*`. So it will **not** catch core packages like `utils`, `framework`, etc. It is mainly useful for catching missed module packages. For core packages, use the verification loop below instead.

### Verify version consistency

Check that all core packages are on the same version:

```bash
for pkg in utils orchestration modules-sdk workflows-sdk framework cli medusa; do
  echo "@freshbox-medusa/$pkg: $(npm view @freshbox-medusa/$pkg dist-tags.latest)"
done
```

All 7 should show the same version number.

---

## 6. Installing in a Downstream Project

After publishing, update your project's `package.json` to use the new version:

```json
{
  "dependencies": {
    "@freshbox-medusa/medusa": "2.12.0",
    "@freshbox-medusa/framework": "2.12.0",
    "@freshbox-medusa/core-flows": "2.12.0",
    "@freshbox-medusa/utils": "2.12.0",
    "@freshbox-medusa/cli": "2.12.0"
  }
}
```

These are the most commonly needed packages. Depending on your project, you may also need:
- `@freshbox-medusa/orchestration` — if you use workflow orchestration directly
- `@freshbox-medusa/modules-sdk` — if you build custom modules
- `@freshbox-medusa/workflows-sdk` — if you define custom workflows

Then clean install to avoid stale cached versions:

```bash
yarn cache clean
rm -rf node_modules yarn.lock
yarn install
```

These packages are **not** Lyra-specific — any Medusa v2 project can use them by replacing the standard `@medusajs/*` packages with the corresponding `@freshbox-medusa/*` packages. The custom pricing/promotion logic (gross-based calculations, enhanced decimal precision) applies automatically.

---

## 7. Troubleshooting

### `npm ERR! 403 Forbidden`
You don't have publish access to the scope. Check:
```bash
npm whoami                    # Are you logged in?
npm org ls @freshbox-medusa           # Are you a member of the org?
```

### `npm ERR! 402 Payment Required`
Your scope is set to private but you don't have a paid npm plan. Ensure all `package.json` files have:
```json
"publishConfig": {
  "access": "public"
}
```

### `npm ERR! You cannot publish over the previously published versions`
The version already exists on npm. You need to bump to a higher version number. Check the current published version:
```bash
npm view @freshbox-medusa/utils versions --json | tail -5
```

### Build fails during release
The release script builds each package before publishing. If a build fails:
1. Fix the build error in the source code
2. Check which packages were **already published** before the failure:
   ```bash
   npm view @freshbox-medusa/utils@2.12.0 version 2>/dev/null && echo "published" || echo "not published"
   ```
3. **If no packages were published yet**: re-run the script with the same version
4. **If some packages were already published**: you cannot re-publish those versions. Bump to a new patch version (e.g., `2.12.0` -> `2.12.1`) and run the script again. All 7 packages will publish at the new version.

> **The script has no resume capability.** It always starts from the first package (`utils`). If `utils` is already published at the target version, the script will fail with "cannot publish over previously published versions".

### Registry propagation lag
After publishing, `npm view` might still show the old version for a few minutes. The script handles this by polling up to 10 times with 30-second intervals. If you're checking manually, wait 2-3 minutes and clear your cache:
```bash
yarn cache clean
npm cache clean --force
```

### Pre-release version installed by default
If you published `2.12.0-beta.1`, users running `yarn add @freshbox-medusa/medusa` should still get the latest stable version. Pre-release versions are tagged as `beta` on npm, not `latest`. To install a pre-release explicitly:
```bash
yarn add @freshbox-medusa/medusa@beta
# or
yarn add @freshbox-medusa/medusa@2.12.0-beta.1
```
