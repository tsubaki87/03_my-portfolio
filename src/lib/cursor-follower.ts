import { reduceMotion } from './smooth-scroll';

// カーソル追従サークル — 全ページ共通
// マウスの矢印を空色の丸がバネの動きで追いかける。速く動かすほど遅れて引き伸ばされ、
// 止めると少し行き過ぎてから戻るので、矢印の加速度が感じられる。
// リンク等にホバーすると白い丸に変わり、中心に十字が出る。
//
// マウス（細かいポインタ＋ホバー可能）の環境でのみ有効。タッチ端末では何もしない。
// OS の「視差効果を減らす」設定がオンのときは、バネを使わずそのまま矢印に重ねる。

const STIFFNESS = 0.06; // バネの強さ（大きいほど素早く追いつく）
const DAMPING = 0.72; // 速度の減衰（小さいほど早く止まり、大きいほど行き過ぎて揺れる）
const STRETCH = 0.004; // 速度に対する引き伸ばしの強さ
const MAX_STRETCH = 0.35; // 引き伸ばしの上限（0.35 = 最大 1.35 倍）

const HOVER_TARGETS = 'a, button, [role="button"], label, summary, select';

if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  const el = document.createElement('div');
  el.className = 'cursor-follower';
  el.setAttribute('aria-hidden', 'true');
  // 丸（速度で伸び縮みする）と十字（常にまっすぐ）を分けておく
  el.innerHTML =
    '<span class="cursor-follower__circle"></span><span class="cursor-follower__cross"></span>';
  document.body.append(el);
  const circle = el.querySelector<HTMLElement>('.cursor-follower__circle')!;
  document.documentElement.classList.add('has-cursor-follower');

  // 矢印の位置（目標）と丸の位置・速度
  const target = { x: -100, y: -100 };
  const pos = { x: -100, y: -100 };
  const vel = { x: 0, y: 0 };
  let started = false;

  window.addEventListener(
    'pointermove',
    (e) => {
      if (e.pointerType !== 'mouse') return;
      target.x = e.clientX;
      target.y = e.clientY;
      // 最初の1回は矢印の位置から始める（画面外から飛んでこないように）
      if (!started) {
        pos.x = target.x;
        pos.y = target.y;
        started = true;
      }
      el.classList.add('is-visible');
    },
    { passive: true }
  );

  // ウィンドウの外や iframe（地図・YouTube）に入ったら隠す
  document.addEventListener('mouseout', (e) => {
    if (!e.relatedTarget) el.classList.remove('is-visible');
  });

  // リンク等の上では白丸＋十字
  document.addEventListener('mouseover', (e) => {
    const hovering = !!(e.target as Element | null)?.closest?.(HOVER_TARGETS);
    el.classList.toggle('is-hover', hovering);
  });

  // クリック中は少し縮める
  window.addEventListener('pointerdown', () => el.classList.add('is-down'));
  window.addEventListener('pointerup', () => el.classList.remove('is-down'));

  const tick = () => {
    let angle = 0;
    let stretch = 0;

    if (reduceMotion) {
      pos.x = target.x;
      pos.y = target.y;
    } else {
      // バネ：目標との距離に比例して加速し、減衰しながら追いつく
      vel.x = (vel.x + (target.x - pos.x) * STIFFNESS) * DAMPING;
      vel.y = (vel.y + (target.y - pos.y) * STIFFNESS) * DAMPING;
      pos.x += vel.x;
      pos.y += vel.y;

      const speed = Math.hypot(vel.x, vel.y);
      stretch = Math.min(speed * STRETCH, MAX_STRETCH);
      angle = Math.atan2(vel.y, vel.x);
    }

    el.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
    // 進行方向に伸ばし、直交方向に縮める
    circle.style.transform = `rotate(${angle}rad) scale(${1 + stretch}, ${1 - stretch * 0.5})`;

    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}
