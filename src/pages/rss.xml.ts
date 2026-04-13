import rss from '@astrojs/rss';
import { getCollection, type CollectionEntry } from 'astro:content';
import type { APIContext } from 'astro';

type Section = 'blog' | 'projects' | 'writeups';
const urlPrefix: Record<Section, string> = {
  blog: 'scripta',
  projects: 'opera',
  writeups: 'acta',
};

export async function GET(context: APIContext) {
  const [blog, projects, writeups] = await Promise.all([
    getCollection('blog', (e) => !e.data.draft && (e.data.locale ?? 'pt') === 'pt'),
    getCollection('projects', (e) => !e.data.draft && (e.data.locale ?? 'pt') === 'pt'),
    getCollection('writeups', (e) => !e.data.draft && (e.data.locale ?? 'pt') === 'pt'),
  ]);

  type Entry = CollectionEntry<'blog'> | CollectionEntry<'projects'> | CollectionEntry<'writeups'>;
  const all: Entry[] = [...blog, ...projects, ...writeups];
  all.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

  return rss({
    title: 'S3r4ph1el',
    description: 'Scripta · Opera · Acta — Offensive Security de Enzo Teles.',
    site: context.site!,
    items: all.map((entry) => ({
      title: entry.data.title,
      description: entry.data.description ?? '',
      pubDate: entry.data.date,
      link: `/${urlPrefix[entry.collection as Section]}/${entry.slug}/`,
    })),
    customData: `<language>pt-BR</language>`,
  });
}
