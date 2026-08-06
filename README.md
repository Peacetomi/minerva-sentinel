# Sentinel Case Operations

Sentinel is a self-contained React/TypeScript investigation workspace built for AfterQuery Minerva. Analysts can search, filter, sort and page through a deterministic local case dataset; retain stable-ID selections across views; edit records in a focus-aware detail drawer; run bulk actions; use a command palette; save URL-backed views; review session activity; and persist workspace preferences.

The codebase is intentionally organized around realistic interaction boundaries rather than intentionally broken code. Async request ownership, optimistic mutation overlays, selection reconciliation, form drafts, URL state, persistence, keyboard ownership and focus restoration are separate concerns that meet in user-facing workflows.

## Requirements

- Node.js 20 (`.nvmrc`)
- npm

## Commands

```bash
npm ci
npm run lint
npm test
npm run build
npm run test:e2e
```

All runtime data is local and deterministic. Tests require no credentials, remote APIs, databases or network access after dependencies and Playwright Chromium are installed.

## Architecture

- `src/features/cases`: domain model, fixtures, list controls and workspace orchestration
- `src/services`: deterministic async repository and activity ledger
- `src/features/selection`: stable-ID selection reducer/context
- `src/features/drawer`: detail view and dirty form state
- `src/features/search`: stale-safe command search
- `src/features/views`: persisted saved filters
- `src/features/preferences`: persisted user preferences
- `src/hooks`: URL state, async cases, focus return, persistence and global shortcuts
- `src/components`: reusable accessible primitives
- `tests/e2e`: integrated Playwright user flows

Vitest explicitly excludes `tests/e2e/**`; Playwright runs only through `npm run test:e2e`.
