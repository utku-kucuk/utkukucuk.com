import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const projects = defineCollection({
  // ids look like "en/viducate" / "tr/viducate"
  loader: glob({ pattern: '**/*.mdx', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    tagline: z.string(),
    summary: z.string(),
    order: z.number(),
    role: z.string(),
    stack: z.array(z.string()),
    repo: z.url(),
    diagram: z.enum(['commerce', 'viducate', 'ironecho', 'smarthome']),
    highlights: z.array(z.string()).max(4),
  }),
});

export const collections = { projects };
