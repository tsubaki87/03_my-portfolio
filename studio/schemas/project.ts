import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'project',
  title: '制作実績',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'タイトル',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'スラッグ（URL）',
      type: 'slug',
      options: { source: 'title' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'mainImage',
      title: 'メイン画像',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'youtubeUrl',
      title: 'YouTube 動画 URL',
      description: '例: https://www.youtube.com/watch?v=xxxxxxxxxxx / https://youtu.be/xxxxxxxxxxx',
      type: 'url',
      validation: (Rule) =>
        Rule.uri({ scheme: ['https'] }).custom((value) => {
          if (!value) return true;
          return /^https:\/\/(www\.|m\.)?(youtube\.com|youtu\.be)\//.test(value)
            ? true
            : 'YouTube の URL を入力してください';
        }),
    }),
    defineField({
      name: 'topVideoUrl',
      title: 'トップページ専用動画 URL',
      description:
        'トップの Recent Works に無音・ループで流す動画（MP4 推奨）。Cloudflare R2 などに置いた動画の URL を入力します。' +
        '設定すると YouTube 動画より優先されます。例: https://media.example.com/works/xxx.mp4',
      type: 'url',
      validation: (Rule) => Rule.uri({ scheme: ['https'], allowRelative: true }),
    }),
    defineField({
      name: 'description',
      title: '説明',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'links',
      title: 'リンクボタン',
      description: '詳細ページの説明文の下に、ボタンとして表示されます（例: 「サイトを見る」「GitHub」）',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'linkButton',
          title: 'リンクボタン',
          fields: [
            defineField({
              name: 'label',
              title: 'ボタンの名前',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'url',
              title: 'リンク先 URL',
              type: 'url',
              validation: (Rule) => Rule.required().uri({ scheme: ['http', 'https'] }),
            }),
          ],
          preview: {
            select: { title: 'label', subtitle: 'url' },
          },
        },
      ],
    }),
    defineField({
      name: 'tags',
      title: 'タグ',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'featured',
      title: 'トップに表示',
      description: 'オンにするとトップページの Recent Works に表示されます（公開日の新しい順に最大3件）',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'publishedAt',
      title: '公開日',
      type: 'date',
    }),
  ],
  preview: {
    select: { title: 'title', media: 'mainImage' },
  },
});
