#!/bin/sh
# Development check of GAMES-3 (not run in CI): prints the 6 versions of the demos
# (3 guides x student/key) to PDF with headless Chrome and checks them with pdftotext.
# Usage: sh specs/002-imprimir-guias/validate-print/run.sh [output-folder]
set -u
HERE=$(cd "$(dirname "$0")" && pwd)
OUT=${1:-$(mktemp -d)}
CHROME=${CHROME:-"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"}
PROFILE=$(mktemp -d)
FAIL=0

check() { # description, command
    if eval "$2"; then echo "  ✔ $1"; else echo "  ✖ $1"; FAIL=1; fi
}

for kind in gvs rl writing; do
    for version in student key; do
        pdf="$OUT/$kind-$version.pdf"
        "$CHROME" --headless=new --disable-gpu --user-data-dir="$PROFILE" --no-pdf-header-footer \
            --virtual-time-budget=3000 --print-to-pdf="$pdf" \
            "file://$HERE/print-harness.html?kind=$kind&version=$version" >/dev/null 2>&1
        text=$(pdftotext -layout "$pdf" - 2>/dev/null)
        pages=$(pdfinfo "$pdf" 2>/dev/null | awk '/^Pages:/ {print $2}')
        echo "$kind / $version: $pages page(s) → $pdf"
        check "letter size (612 x 792 pts)" "pdfinfo '$pdf' | grep -q '612 x 792 pts'"
        check "nothing from the screen" "! printf '%s' \"\$text\" | grep -qE 'SCREEN ONLY|Check answers|Finish|Anya-chan|Menu'"
        if [ "$version" = key ]; then
            check "marked as ANSWER KEY" "printf '%s' \"\$text\" | grep -q 'ANSWER KEY'"
        else
            check "not marked as answer key" "! printf '%s' \"\$text\" | grep -q 'ANSWER KEY'"
        fi
        case "$kind-$version" in
            gvs-student) check "no causative answers" "! printf '%s' \"\$text\" | grep -qE 'had my car washed|woke up ten minutes'";;
            gvs-key)     check "causative answer and dictation box" "printf '%s' \"\$text\" | grep -q 'had my car washed' && printf '%s' \"\$text\" | grep -q 'Read aloud (dictation)'";;
            rl-student)  check "no listening script" "! printf '%s' \"\$text\" | grep -qE 'My name is Tom|bake sale, and all the money'";;
            rl-key)      check "listening script to read aloud" "printf '%s' \"\$text\" | grep -q 'Read aloud (listening)'";;
            writing-student) check "8 lines and the total" "printf '%s' \"\$text\" | grep -q 'Total'";;
            writing-key) check "grading rubric" "printf '%s' \"\$text\" | grep -q 'Grading rubric'";;
        esac
    done
done
rm -rf "$PROFILE"
echo
[ $FAIL -eq 0 ] && echo "All checks passed. PDFs in $OUT" || echo "Some checks FAILED. PDFs in $OUT"
exit $FAIL
