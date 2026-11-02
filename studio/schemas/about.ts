import { defineArrayMember, defineField, defineType } from 'sanity';

// Google マップの埋め込み欄には、<iframe ...> タグをそのまま貼っても URL だけでもよい
const GOOGLE_MAPS_EMBED = /https:\/\/www\.google\.com\/maps\/embed\?[^"'\s>]+/;

export default defineType({
  name: 'about',
  title: 'プロフィール',
  type: 'document',
  groups: [
    { name: 'about', title: 'About Me', default: true },
    { name: 'company', title: 'Company Profile' },
    { name: 'access', title: 'Access Map' },
  ],
  fields: [
    // ---- About Me ----
    defineField({
      name: 'name',
      title: '名前（事務所名）',
      description: 'トップページの見出しにも使われます',
      type: 'string',
      group: 'about',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'avatar',
      title: 'プロフィール画像',
      type: 'image',
      group: 'about',
      options: { hotspot: true },
    }),
    defineField({
      name: 'bio',
      title: '紹介文',
      description: 'About Me に表示されます。トップページとページ説明（検索結果の説明文）にも使われます',
      type: 'text',
      rows: 6,
      group: 'about',
    }),
    defineField({
      name: 'skills',
      title: 'スキル',
      description: '空にすると表示されません',
      type: 'array',
      group: 'about',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    }),

    // ---- Company Profile ----
    defineField({
      name: 'companyProfile',
      title: '会社概要',
      description: '「会社名」「創立」など、項目名と内容の組を上から順に表示します（ドラッグで並べ替え可）',
      type: 'array',
      group: 'company',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'profileRow',
          fields: [
            defineField({
              name: 'label',
              title: '項目名',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'value',
              title: '内容',
              description: '改行すると表示も改行されます',
              type: 'text',
              rows: 3,
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'url',
              title: 'リンク先 URL（任意）',
              description: '入力すると内容がリンクになります',
              type: 'url',
            }),
          ],
          preview: {
            select: { title: 'label', subtitle: 'value' },
          },
        }),
      ],
    }),

    // ---- Access Map ----
    defineField({
      name: 'address',
      title: '住所',
      description: '例: 〒810-0062 福岡市中央区荒戸1-15-12',
      type: 'text',
      rows: 2,
      group: 'access',
    }),
    defineField({
      name: 'tel',
      title: '電話・FAX',
      description: '例: TEL/FAX：092-761-5282',
      type: 'string',
      group: 'access',
    }),
    defineField({
      name: 'mapEmbed',
      title: 'Google マップ（埋め込み）',
      description:
        'Google マップで「共有」→「地図を埋め込む」→「HTML をコピー」した <iframe ...> をそのまま貼り付けてください（URL だけでも可）',
      type: 'text',
      rows: 3,
      group: 'access',
      validation: (Rule) =>
        Rule.custom((value) => {
          if (!value) return true;
          return GOOGLE_MAPS_EMBED.test(value)
            ? true
            : 'Google マップの埋め込みコード（https://www.google.com/maps/embed?... を含むもの）を貼り付けてください';
        }),
    }),
  ],
  preview: {
    select: { title: 'name', media: 'avatar' },
  },
});
