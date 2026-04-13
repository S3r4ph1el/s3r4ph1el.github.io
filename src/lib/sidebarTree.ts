import type { CollectionEntry } from 'astro:content';

type Writeup = CollectionEntry<'writeups'>;

export interface SidebarPlatform {
  platform: string;
  label: string;
  items: Array<{
    slug: string;
    title: string;
    difficulty?: string;
    os?: string;
    href: string;
  }>;
}

const PLATFORM_LABELS: Record<string, string> = {
  HackTheBox: 'Hack The Box',
  HackingClub: 'Hacking Club',
  TryHackMe: 'TryHackMe',
  CTF: 'CTFs',
};

const PLATFORM_ORDER = ['HackTheBox', 'HackingClub', 'TryHackMe', 'CTF'];
const DIFFICULTY_ORDER = ['Easy', 'Medium', 'Hard', 'Insane'];

export function buildSidebarTree(
  entries: Writeup[],
  lang: 'pt' | 'en' = 'pt'
): SidebarPlatform[] {
  const prefix = lang === 'en' ? '/en/acta' : '/acta';
  const byPlatform = new Map<string, Writeup[]>();

  for (const e of entries) {
    const p = e.data.platform;
    if (!byPlatform.has(p)) byPlatform.set(p, []);
    byPlatform.get(p)!.push(e);
  }

  const result: SidebarPlatform[] = [];
  for (const p of PLATFORM_ORDER) {
    const items = byPlatform.get(p);
    if (!items || items.length === 0) continue;
    items.sort((a, b) => {
      const da = DIFFICULTY_ORDER.indexOf(a.data.difficulty ?? '');
      const db = DIFFICULTY_ORDER.indexOf(b.data.difficulty ?? '');
      if (da !== db) return da - db;
      return a.data.title.localeCompare(b.data.title);
    });
    result.push({
      platform: p,
      label: PLATFORM_LABELS[p] ?? p,
      items: items.map((e) => ({
        slug: e.slug,
        title: e.data.title,
        difficulty: e.data.difficulty,
        os: e.data.os,
        href: `${prefix}/${e.slug}/`,
      })),
    });
  }
  for (const [p, items] of byPlatform) {
    if (PLATFORM_ORDER.includes(p)) continue;
    result.push({
      platform: p,
      label: PLATFORM_LABELS[p] ?? p,
      items: items.map((e) => ({
        slug: e.slug,
        title: e.data.title,
        difficulty: e.data.difficulty,
        os: e.data.os,
        href: `${prefix}/${e.slug}/`,
      })),
    });
  }
  return result;
}
