// テキスト中の URL を検出し、「文字」と「リンク」の部品に分ける。
// HTML を文字列で組み立てず、Astro 側で部品ごとに描画するので、説明文に < などが入っても安全。
export type TextPart = { type: 'text'; value: string } | { type: 'link'; value: string };

const URL_PATTERN = /https?:\/\/[A-Za-z0-9\-._~:/?#\[\]@!$&*+,;=%()]+/g; // URL に使える半角文字だけ（日本語の手前で止める）
// URL の末尾に付きがちな句読点・閉じ括弧はリンクに含めない
const TRAILING_PUNCTUATION = /[.,;:!?)\]}]+$/;

export function splitLinks(text: string): TextPart[] {
  const parts: TextPart[] = [];
  let last = 0;

  for (const match of text.matchAll(URL_PATTERN)) {
    const start = match.index!;
    const url = match[0].replace(TRAILING_PUNCTUATION, '');
    if (start > last) parts.push({ type: 'text', value: text.slice(last, start) });
    parts.push({ type: 'link', value: url });
    last = start + url.length;
  }

  if (last < text.length) parts.push({ type: 'text', value: text.slice(last) });
  return parts;
}
