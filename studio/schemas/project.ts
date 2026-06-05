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
      name: 'description',
      title: '説明',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'tags',
      title: 'タグ',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
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
