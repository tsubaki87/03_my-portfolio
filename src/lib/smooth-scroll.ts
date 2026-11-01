import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

// 慣性スクロール（Lenis）— 全ページ共通
// ホイール・トラックパッドのスクロールに慣性をつけ、滑らかに止まるようにする。
// OS の「視差効果を減らす」設定がオンのときは使わない（lenis は null になる）。
//
// このモジュールは Layout.astro で読み込まれる。視差などスクロールに連動する処理は、
// ここから lenis を import して lenis.on('scroll', ...) で同じフレームに同期させる。
// （複数の <script> から import しても、バンドル時に共有されインスタンスは1つになる）

export const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const SCROLL_LERP = 0.08; // 追従の速さ（0〜1）。小さいほど慣性が強く、ゆっくり止まる

export const lenis: Lenis | null = reduceMotion
  ? null
  : new Lenis({ lerp: SCROLL_LERP, autoRaf: true });
