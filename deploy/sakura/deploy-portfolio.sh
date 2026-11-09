#!/bin/sh
# ============================================================
# ポートフォリオを hanada87.com（さくら ~/www/hanada87/）に置くスクリプト
#
# - さくらの ~/bin/deploy-portfolio.sh に置き、GitHub Actions 用の SSH 鍵の
#   「強制コマンド」として使う（authorized_keys の command="..."）。
#   この鍵では、このスクリプトしか動かせない。
# - 標準入力で、ビルド結果（dist/client）の tar.gz を受け取る。
# - 置き換えるのは ITEMS と _astro だけ。同じ場所にある 87website・persona・
#   boat_race・w_accounting* などには触れない。
# - 直前の版を ~/portfolio-deploy/prev に控える（戻すときに使う）。
# ============================================================
set -eu
umask 022

WWW="$HOME/www/hanada87"
WORK="$HOME/portfolio-deploy"
# ポートフォリオが使う一番上の名前（新しいページを足したら、ここにも足す）
ITEMS="index.html about projects favicon.ico favicon.svg og-default.png"
# 届いても置かないもの
IGNORE="wrangler.json .assetsignore"

TS=$(date +%Y%m%d-%H%M%S)
NEW="$WORK/incoming-$TS"
OLD="$WORK/old-$TS"
LOCK="$WORK/.lock"

mkdir -p "$WORK"
# 同時に 2 つ動かない
if ! mkdir "$LOCK" 2>/dev/null; then
  echo "ERROR: 別のアップロードが動いています" >&2
  exit 1
fi
trap 'rm -rf "$LOCK" "$NEW" "$OLD"' EXIT
mkdir "$NEW" "$OLD"

# 1) 受け取る（bsdtar は「..」や絶対パスの入ったファイルを展開しない）
tar -xzf - -C "$NEW"

# 2) 中身を確かめる
if [ ! -f "$NEW/index.html" ] || [ ! -d "$NEW/_astro" ] || [ ! -d "$NEW/projects" ]; then
  echo "ERROR: ビルド結果の形が違います（index.html・_astro・projects がない）" >&2
  exit 1
fi
for f in "$NEW"/* "$NEW"/.[!.]*; do
  [ -e "$f" ] || continue
  name=$(basename "$f")
  case " $ITEMS _astro $IGNORE " in
    *" $name "*) ;;
    *) echo "ERROR: 知らない名前「${name}」があります。新しいページなら deploy-portfolio.sh の ITEMS に足してください" >&2
       exit 1 ;;
  esac
done

# 3) 今の版を控える
rm -rf "$WORK/prev.tmp"
mkdir "$WORK/prev.tmp"
for i in $ITEMS _astro; do
  if [ -e "$WWW/$i" ]; then cp -Rp "$WWW/$i" "$WORK/prev.tmp/"; fi
done
rm -rf "$WORK/prev"
mv "$WORK/prev.tmp" "$WORK/prev"

# 4) 新しい _astro（CSS・JS・画像）を先に足す。古いページが読むファイルはまだ残す
mkdir -p "$WWW/_astro"
cp -Rp "$NEW/_astro/." "$WWW/_astro/"

# 5) ページを入れ替える
for i in $ITEMS; do
  if [ -e "$NEW/$i" ]; then
    if [ -e "$WWW/$i" ]; then mv "$WWW/$i" "$OLD/$i"; fi
    mv "$NEW/$i" "$WWW/$i"
  fi
done

# 6) 使われなくなった _astro のファイルを消す
for f in "$WWW/_astro"/* "$WWW/_astro"/.[!.]*; do
  [ -e "$f" ] || continue
  name=$(basename "$f")
  if [ ! -e "$NEW/_astro/$name" ]; then rm -rf "$f"; fi
done

echo "OK: ${TS} に hanada87.com へ置きました"
