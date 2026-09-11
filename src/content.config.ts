import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const articles = defineCollection({
  loader: glob({
    base: './src/content/articles',
    pattern: '**/*.md',
    generateId: ({ entry, data }) => {
      const id = entry.replace(/\.md$/, '');
      if (!/^(guides|kings|quests|cards)\/[a-z0-9-]+(?:\/[a-z0-9-]+)*$/.test(id)) {
        throw new Error(`記事パスはカテゴリ/半角英小文字・数字・ハイフンにしてください: ${entry}`);
      }
      if (id.split('/')[0] !== data.category) {
        throw new Error(`フォルダとcategoryが一致していません: ${entry}`);
      }
      return id;
    },
  }),
  schema: ({ image }) => z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    category: z.enum(['guides', 'kings', 'quests', 'cards']),
    king: z.string().min(1),
    date: z.coerce.date(),
    tags: z.array(z.string().min(1)),
    japaneseName: z.string().optional(),
    englishName: z.string().optional(),
    cardType: z.string().optional(),
    version: z.string().optional(),
    cover: image().optional(),
    coverAlt: z.string().optional(),
  }).superRefine((data, ctx) => {
    if (data.category === 'cards') {
      for (const key of ['japaneseName', 'englishName'] as const) {
        if (!data[key]?.trim()) ctx.addIssue({ code: 'custom', path: [key], message: 'カード記事では必須です' });
      }
    }
    if (data.cover && !data.coverAlt?.trim()) {
      ctx.addIssue({ code: 'custom', path: ['coverAlt'], message: '画像の説明を入力してください' });
    }
  }),
});
export const collections = { articles };
