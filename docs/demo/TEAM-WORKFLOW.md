# Team Workflow — two developers

Repo: `https://github.com/abdullllbasith/y5-HuT.git`

## Branches

- `main` — untouched stable baseline. **Never push to it directly.**
- `development` — shared integration branch. All phase PRs target this.
- `feature/demo-NN-*` — exactly one branch per phase, created from the latest `origin/development`
  after the previous phase has been merged.

## Ownership

| Developer | Owns |
| --- | --- |
| A | Admin dashboard and UI (`src/components/admin/**`, layout, styling) |
| B | Data model, business logic, CSV, tests (`src/data/**`, `src/lib/**`, tests) |
| Both — coordinate first | `src/types/index.ts`, `src/context/StoreContext.tsx`, `package.json` |

Do not both edit shared core files on unrelated branches at the same time. Announce the intent
(chat or issue) before touching them.

## Per-phase routine

```bash
git status --short                 # must be clean; if not, stop and ask — don't stash/discard others' work
git fetch origin
git switch development
git pull --ff-only origin development
git switch -c feature/demo-NN-name
# ... implement ...
git diff
npm run lint && npm run build
git add <only intended files>
git diff --cached
git commit -m "<exact phase message>"
git push -u origin feature/demo-NN-name
gh pr create --base development --head feature/demo-NN-name
```

If `gh` is unavailable, open
`https://github.com/abdullllbasith/y5-HuT/compare/development...feature/demo-NN-name`.

Rules: no force-push, no history rewrite on shared branches, no secrets (`.env*` is git-ignored; only
`.env.example` is tracked), no auto-merge. The next phase starts only after the PR is reviewed and merged.

## Review checklist for each PR

- Only the phase's scope; no unrelated refactors.
- `npm run lint` and `npm run build` pass.
- Existing storefront, cart, checkout demo and role switching still work.
- The Demo Mode notice is not removed; no inert buttons presented as working.
- Currency handling is explicit (LKR vs USD).
- No stray files (`dist/`, `package-lock.json` unless agreed).

## Conflict handling

1. Keep PRs small and merge quickly to limit drift.
2. If your branch falls behind: `git fetch origin && git merge origin/development` into your feature
   branch (merge rather than rebase once it has been pushed/reviewed), resolve, rerun lint + build.
3. For `StoreContext.tsx` and `types/index.ts`: add new items in separate blocks (new interfaces, new
   action groups) instead of reformatting existing lines, so merges stay trivial.
4. If you hit a conflict you don't understand, keep both sides' intent and ask the other developer.
   Never resolve by discarding their change.
5. If `development` breaks (lint/build fails), fix forward with a small PR or revert the offending
   merge commit via a PR — don't force-push.

## Dependencies

`npm install` failed on `main` because of `esbuild ^0.25.0` vs Vite 8's peer range; Phase 0 bumps it to
`^0.28.0`. No lockfile is committed. If the owner decides to add one, do it in a dedicated PR so it is
not mixed with feature work.
