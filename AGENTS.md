# AGENTS.md — Water Calculator

## Commands

- **setup:** `npm install`
- **build:** `npm run build` (tsc + vite build)
- **lint:** `npm run lint` (tsc --noEmit)
- **typecheck:** `npm run lint`
- **test:** `npm test` (vitest run)
- **run single test:** `npx vitest run tests/path/to/test.ts`
- **dev:** `npm run dev` (vite watch)

## Architecture

<!-- Key entrypoints, package boundaries, generated code, etc. -->

## Conventions

- **OOP, interface-first:** every module exposes a TS interface, one class implements it. Dependencies are constructor-injected. No module reaches into another's internals.
- Features are self-contained plugins — removing any one (detector, scraper, estimator, overlay) must not break the pipeline.
- No circular imports. All shared types in `src/shared/types.ts`. All DB access through `src/shared/db.ts`.

## Gotchas

<!-- Setup requirements, env quirks, flaky tests, required command order, etc. -->
