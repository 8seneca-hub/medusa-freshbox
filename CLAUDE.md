# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Fork Context

This is a **fork of Medusa v2** (currently based on v2.13.5) maintained by 8seneca-hub at `github.com/8seneca-hub/medusa-freshbox`. The purpose is to customize core commerce logic (pricing, promotions, totals, workflows) and publish packages under a custom npm scope (e.g. `@8medusa`) so downstream projects can use these instead of the standard `@medusajs/*` packages.

**Target npm scope**: `@freshbox-medusa`. The scope is currently still `@medusajs` — before publishing, it must be changed repo-wide. See `docs/publishing-guide.md` for the full procedure.

**Main branch**: `develop`

## Publishing Custom Packages

Full guide: `docs/publishing-guide.md`

### Core package dependency chain (must publish in this order):
```
utils → orchestration → modules-sdk → workflows-sdk → framework → cli → medusa
```

### Release commands:
```bash
# Full core release (7 packages) — use when touching utils, framework, orchestration, etc.
node scripts/release-core-packages.js <version>

# Core-flows only release (2 packages) — use when only core-flows changed
node scripts/release-workflow.js <version>

# Pre-release example
node scripts/release-core-packages.js 2.12.0-beta.1
```

### Scope change (one-time setup before first publish):
```bash
# Replace @medusajs with @freshbox-medusa in all package.json files
find . -name "package.json" -not -path "*/node_modules/*" -exec sed -i '' 's/@medusajs/@freshbox-medusa/g' {} +
# Also replace in TypeScript source imports
find packages -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" \) \
  -not -path "*/node_modules/*" -not -path "*/dist/*" \
  -exec sed -i '' 's/@medusajs/@freshbox-medusa/g' {} +
# Plus: scripts/*.js, .changeset/config.json
```

After release, commit the version-bumped `package.json` files (the scripts do NOT auto-commit).

## Build System

**Package Manager**: Yarn 3.2.1 (node-modules linker, hardlinks-global mode)
**Build Orchestrator**: Turborepo (`turbo.json`) — `build` tasks respect `^build` dependency order.

```bash
yarn install                                    # Install all workspace deps
yarn build                                      # Build all packages (turbo, 100% concurrency)
yarn workspace @medusajs/medusa build           # Build a single package
yarn watch                                      # Watch mode (run from within a package dir)
```

## Testing

**Backend/Core**: Jest 29.7.0 | **Frontend/Admin**: Vitest 3.0.5

```bash
yarn test                                       # All unit tests
yarn test:integration:packages                  # All package integration tests
yarn test:integration:http                      # HTTP integration tests
yarn test:integration:api                       # API integration tests
yarn test:integration:modules                   # Module integration tests
```

**Run a single test file** (from the package directory):
```bash
# Jest (backend)
yarn jest path/to/__tests__/some.spec.ts
# Vitest (frontend)
yarn vitest run path/to/some.test.ts
```

**Test locations**:
- Unit: `__tests__/` directories alongside source (`.spec.ts` or `.test.ts`)
- Package integration: `packages/*/integration-tests/__tests__/`
- HTTP integration: `integration-tests/http/__tests__/`

## Codebase Structure

```
packages/
├── medusa/              # Main server package — API routes in src/api/
├── core/
│   ├── framework/       # Core runtime, HTTP, database
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Shared utilities, decorators, base classes
│   ├── core-flows/      # Predefined workflow steps & workflows
│   ├── workflows-sdk/   # Workflow composition primitives
│   ├── modules-sdk/     # Module development SDK
│   └── orchestration/   # Workflow orchestration engine
├── modules/             # 30+ commerce modules (product, order, cart, payment, etc.)
│   └── providers/       # Provider implementations (payment, notification, etc.)
├── admin/dashboard/     # React admin UI (Vite + Vitest)
├── cli/                 # CLI tools (medusa-cli)
└── design-system/       # UI component library
integration-tests/       # Full-stack integration tests
```

## Code Style

**Prettier**: No semicolons, double quotes, 2-space indent, ES5 trailing commas, always parens on arrows.

**Naming**: Files in kebab-case. Types/Classes in PascalCase. Functions/vars in camelCase. DB fields in snake_case.

**TypeScript**: Target ES2021, Module Node16, strict null checks, experimental decorators.

## Architecture Patterns

### Modules — Services with Decorators

Services extend `MedusaService<T>` and use decorators for DI and cross-cutting concerns:
- `@InjectManager()` on public methods, `@InjectTransactionManager()` on protected methods
- `@MedusaContext()` for shared context parameter, `@EmitEvents()` for domain events

**Reference**: `packages/modules/order/src/services/order-module-service.ts`

### API Routes

Named exports for HTTP methods (`GET`, `POST`, `DELETE`, etc.) typed with `AuthenticatedMedusaRequest<T>` / `MedusaResponse<T>`. Resolve services from `req.scope`, invoke workflows from `@medusajs/core-flows`.

**Reference**: `packages/medusa/src/api/admin/orders/route.ts`

### Workflows

Steps: `createStep(id, handler, compensation?)` returning `StepResponse(result, compensationData)`.
Workflows: `createWorkflow(id, fn)` composing steps with `transform()`, `when()`, `parallelize()`, `useQueryGraphStep()`.

**Reference**: `packages/core/core-flows/src/order/workflows/update-order.ts`

### Error Handling

Use `MedusaError(type, message)` with types: `NOT_FOUND`, `INVALID_DATA`, `NOT_ALLOWED`.

### Common Imports

```typescript
// Decorators & utils
import { InjectManager, MedusaContext, MedusaError, MedusaService, Modules } from "@medusajs/framework/utils"
// Types
import type { Context, IOrderModuleService } from "@medusajs/framework/types"
// Workflows SDK
import { createStep, createWorkflow, WorkflowData, WorkflowResponse, transform } from "@medusajs/framework/workflows-sdk"
// HTTP
import { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http"
```

### Path Aliases (in tsconfig.json per package)

`@models`, `@types`, `@services`, `@repositories`, `@utils` — resolve to local source directories.
