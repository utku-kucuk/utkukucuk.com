# utkukucuk.com

Source code for the personal portfolio of **Muhammet Utku Küçük**, Backend Software Engineer. Live at [utkukucuk.com](https://utkukucuk.com).

## Tech stack

| Area      | Choice                                       |
| --------- | -------------------------------------------- |
| Framework | [Astro](https://astro.build) (static output) |
| Language  | TypeScript (strict)                          |
| Styling   | Tailwind CSS v4                              |
| Content   | MDX content collections                      |
| Hosting   | Cloudflare Pages                             |

## Getting started

Requires Node.js 22.12+ (see `.nvmrc`) and pnpm (via Corepack).

```bash
corepack enable
pnpm install
pnpm dev        # http://localhost:4321
```

## Scripts

| Command         | Description                                         |
| --------------- | --------------------------------------------------- |
| `pnpm dev`      | Start the dev server                                |
| `pnpm build`    | Build the static site into `dist/`                  |
| `pnpm preview`  | Preview the production build locally                |
| `pnpm lint`     | Lint with ESLint                                    |
| `pnpm format`   | Format with Prettier                                |
| `pnpm check`    | Type-check `.astro` and `.ts` files                 |
| `pnpm validate` | Run everything CI runs (lint, format, types, build) |

## License

Source code is released under the [MIT License](./LICENSE). Written content, CV documents and photographs are © Muhammet Utku Küçük, all rights reserved.
