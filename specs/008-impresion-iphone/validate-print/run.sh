#!/bin/sh
# Development check of GAMES-10 (not run in CI): prints the 12 versions (demos and the
# recorded generated guides, student sheet and answer key), plus a sweep of the GVS demo
# moved down 0-240 mm, with headless Chrome (or WebKit: PRINTER=path/to/webkit-print) and
# checks that every title is on the same page as the start of its first block.
# Usage: sh specs/008-impresion-iphone/validate-print/run.sh [output-folder]
# WebKit (Safari's engine), on a Mac:
#   swiftc -O specs/008-impresion-iphone/validate-print/webkit-print.swift -o /tmp/webkit-print
#   PRINTER=/tmp/webkit-print sh specs/008-impresion-iphone/validate-print/run.sh
set -u
HERE=$(cd "$(dirname "$0")" && pwd)
OUT=${1:-$(mktemp -d)}
mkdir -p "$OUT"
CHROME=${CHROME:-"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"}
PROFILE=$(mktemp -d)
FAIL=0
node "$HERE/make-pages.mjs" "$OUT" >/dev/null || exit 1
for page in "$OUT"/*.html; do
    name=$(basename "$page" .html)
    if [ -n "${PRINTER:-}" ]; then
        "$PRINTER" "$page" "$OUT/$name.pdf" >/dev/null 2>&1
    else
        "$CHROME" --headless=new --disable-gpu --user-data-dir="$PROFILE" --no-pdf-header-footer \
            --virtual-time-budget=3000 --print-to-pdf="$OUT/$name.pdf" "file://$page" >/dev/null 2>&1
    fi
    pages=$(pdfinfo "$OUT/$name.pdf" 2>/dev/null | awk '/^Pages:/ {print $2}')
    keeps=$(node -e 'console.log(require(process.argv[1]).length)' "$OUT/$name.json")
    if node "$HERE/check-keeps.mjs" "$OUT/$name.pdf" "$OUT/$name.json"; then
        echo "  ✔ $name: $pages page(s), $keeps titles with their first block"
    else
        echo "  ✖ $name"; FAIL=1
    fi
done
rm -rf "$PROFILE"
echo
[ $FAIL -eq 0 ] && echo "All checks passed. PDFs in $OUT" || echo "Some checks FAILED. PDFs in $OUT"
exit $FAIL
