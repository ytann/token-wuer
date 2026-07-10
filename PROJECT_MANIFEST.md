# PROJECT_MANIFEST.md — Water Calculator

## Stage: Complete (Merged to main)

Goal: All modules implemented, tested, built, merged to main.

## ADRs

| ID | Decision | Rationale |
|---|---|---|
| ADR-01 | DOM scraping for token detection | Safer than network interception; won't trigger CSP/ToS bans |
| ADR-02 | Manifest V3, Chrome-first | Latest extension standard; Brave/Chrome share the same engine |
| ADR-03 | Fixed water ratio from literature | Single, citable conversion factor (3ml/1000 tokens); inference only |
| ADR-04 | IndexedDB for local storage | Privacy-preserving; no data leaves the browser |
| ADR-05 | Dashboard/analytics out of scope | Separate future project; extension focuses on tracking + visual |
| ADR-06 | Interface-first OOP (constructor injection) | Modules are self-contained plugins; removing one won't break the pipeline |
| ADR-07 | BPE token estimation (no model) | Lightweight JS implementation with embedded vocab; no download needed |
| ADR-08 | addDelta uses options object | Extensible without breaking callers (ml, tokens, topic?) |
| ADR-09 | onNewText returns disposer | Callbacks can be unsubscribed, preventing memory leaks |

## Activity Log

| Date | Activity | Details |
|---|---|---|
| 2026-07-10 | Seeding complete | Interview conducted, seed.yaml generated |
| 2026-07-10 | Design complete | Architecture spec with OOP principles |
| 2026-07-10 | Planning complete | 15-task TDD implementation plan |
| 2026-07-10 | Execution complete | 10 modules, 44 tests, 0 lint errors, build passes |
