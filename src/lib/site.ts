export const siteConfig = {
  name: '9 Kings 日本語攻略',
  description: '9 Kingsの王ごとの攻略、クエスト攻略、カード情報をまとめる日本語攻略サイト。',
  // public/ に画像を置いたら '/og-image.png' などに変更します。
  ogImage: '',
};

export const categories = {
  guides: { label: '攻略記事一覧', description: 'すべての攻略記事とカード情報を、新しい順に掲載しています。' },
  kings: { label: '王ごとの攻略', description: '王ごとに関連する攻略記事とカード情報を探せます。' },
  quests: { label: 'クエスト攻略', description: 'クエストごとの攻略と検証メモをまとめています。' },
  cards: { label: 'カード情報', description: '日本語名・英語名とあわせてカード情報を確認できます。' },
} as const;
export type Category = keyof typeof categories;
export const categoryLabel = (category: Category) => category === 'guides' ? '一般攻略' : categories[category].label;
export const withBase = (path: string) => `${import.meta.env.BASE_URL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
export const articleUrl = (id: string) => withBase(`${id}/`);
export const formatDate = (date: Date) => new Intl.DateTimeFormat('ja-JP', { timeZone: 'UTC', dateStyle: 'long' }).format(date);
