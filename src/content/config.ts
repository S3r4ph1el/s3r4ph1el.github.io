import { defineCollection, z } from 'astro:content';

const locale = z.enum(['pt', 'en']).default('pt');

const baseFields = {
  title: z.string(),
  description: z.string().optional(),
  date: z.coerce.date(),
  draft: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
  categories: z.array(z.string()).default([]),
  translationKey: z.string().optional(),
  cover: z.string().optional(),
  locale,
};

const blog = defineCollection({
  type: 'content',
  schema: z.object({ ...baseFields }),
});

const projects = defineCollection({
  type: 'content',
  schema: z.object({
    ...baseFields,
    repo: z.string().url().optional(),
    demo: z.string().url().optional(),
    stack: z.array(z.string()).default([]),
  }),
});

const writeups = defineCollection({
  type: 'content',
  schema: z.object({
    ...baseFields,
    platform: z.enum(['HackTheBox', 'HackingClub', 'TryHackMe', 'CTF']),
    difficulty: z.enum(['Easy', 'Medium', 'Hard', 'Insane']).optional(),
    os: z.enum(['Linux', 'Windows']).optional(),
  }),
});

const about = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.coerce.date().optional(),
    translationKey: z.string().default('about'),
    locale,
  }),
});

export const collections = { blog, projects, writeups, about };
