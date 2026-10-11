import { getCollection, type CollectionEntry } from 'astro:content';

import type { Locale } from '@/i18n/ui';

export type Project = CollectionEntry<'projects'> & { slug: string };

/** Projects for one locale, sorted by `order`, with a locale-free slug. */
export async function getProjects(locale: Locale): Promise<Project[]> {
  const entries = await getCollection('projects', (e) => e.id.startsWith(`${locale}/`));
  return entries
    .map((e) => ({ ...e, slug: e.id.slice(locale.length + 1) }))
    .sort((a, b) => a.data.order - b.data.order);
}
