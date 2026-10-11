# Contributing

This is a personal site, but the repository follows a strict workflow so history stays clean and every change is reviewable.

## Branches

`main` is protected and always deployable. Work happens on short-lived branches:

| Prefix     | Use for                         |
| ---------- | ------------------------------- |
| `feat/`    | New sections, components, pages |
| `fix/`     | Bug fixes                       |
| `content/` | Copy, projects, CV updates      |
| `chore/`   | Tooling, dependencies, config   |
| `ci/`      | GitHub Actions and automation   |
| `docs/`    | Documentation only              |

## Commits

Commits follow [Conventional Commits](https://www.conventionalcommits.org):

```
feat(hero): add WebGL service-graph scene
fix(nav): close mobile menu on route change
```

## Pull requests

- Every change lands through a PR; PRs are **squash-merged**, so the PR title becomes the commit on `main` and must follow Conventional Commits.
- CI (lint, format, type-check, build, Lighthouse) must pass.
- Each PR gets a Cloudflare preview deployment.
