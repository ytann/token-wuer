# PROJECT_MANIFEST.md — Water Calculator

## Stage: Seeding

Goal: Complete Ouroboros requirement gathering and generate a seed at `docs/superpowers/seed.yaml`.

## ADRs

| ID | Decision | Rationale |
|---|---|---|
| ADR-01 | DOM scraping for token detection | Safer than network interception; won't trigger CSP/ToS bans |
| ADR-02 | Manifest V3, Chrome-first | Latest extension standard; Brave/Chrome share the same engine, multi-browser later |
| ADR-03 | Fixed water ratio from literature | Single, citable conversion factor rather than configurable; inference only |
| ADR-04 | IndexedDB for local storage | Privacy-preserving; no data leaves the browser |
| ADR-05 | Dashboard/analytics out of scope | Separate future project; keeps extension focused on tracking + visual |

## Activity Log

| Date | Activity | Details |
|---|---|---|
| 2026-07-10 | Seeding complete | Interview conducted, seed.yaml generated from 10 rounds of Socratic Q&A |
