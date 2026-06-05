import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'about',
  title: 'プロフィール',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: '氏名',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'avatar',
      title: 'プロフィール画像',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'bio',
      title: '自己紹介',
      type: 'text',
      rows: 6,
    }),
    defineField({
      name: 'skills',
      title: 'スキル',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    }),
  ],
});
