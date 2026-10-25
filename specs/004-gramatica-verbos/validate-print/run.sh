#!/bin/sh
# Development check of GAMES-6 (not run in CI): prints card sheets to PDF with headless Chrome
# and checks them with pdftotext (letter size, nothing from the screen, no card split).
# Usage: sh specs/004-gramatica-verbos/validate-print/run.sh [output-folder]
set -u
HERE=$(cd "$(dirname "$0")" && pwd)
OUT=${1:-$(mktemp -d)}
CHROME=${CHROME:-"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"}
PROFILE=$(mktemp -d)
mkdir -p "$OUT"
FAIL=0
G3="presentSimple,presentContinuous,pastSimple"
G5="presentSimple,presentContinuous,presentPerfect,pastSimple,pastContinuous,futureWill,futureGoingTo"
ALL="presentSimple,presentContinuous,presentPerfect,presentPerfectContinuous,pastSimple,pastContinuous,pastPerfect,futureWill,futureGoingTo,futureContinuous"
CARDS="presentSimple,presentContinuous,presentPerfect,presentPerfectContinuous,pastSimple,pastContinuous,pastPerfect,futureWill,futureGoingTo,futureContinuous,quantifiers,causative,pastAgo,comparatives,subjectPronouns,possessives,articles,plurals,thereIsAre,prepositionsPlace,prepositionsTime,canCant"

check() { # description, command
    if eval "$2"; then echo "  ✔ $1"; else echo "  ✖ $1"; FAIL=1; fi
}

run_case() { # name, query string, expected number of cards
    pdf="$OUT/$1.pdf"
    "$CHROME" --headless=new --disable-gpu --user-data-dir="$PROFILE" --no-pdf-header-footer \
        --virtual-time-budget=3000 --print-to-pdf="$pdf" "file://$HERE/print-harness.html?$2" >/dev/null 2>&1
    text=$(pdftotext -layout "$pdf" - 2>/dev/null)
    pages=$(pdfinfo "$pdf" 2>/dev/null | awk '/^Pages:/ {print $2}')
    echo "$1: $3 cards, $pages page(s) → $pdf"
    check "letter size (612 x 792 pts)" "pdfinfo '$pdf' | grep -q '612 x 792 pts'"
    check "nothing from the screen" "! printf '%s' \"\$text\" | grep -qE 'SCREEN ONLY|Print this card|Print selected|Menu'"
    check "every card whole on one page" "node '$HERE/check-cards.mjs' '$pdf' '$2'"
}

run_case grammar-4-grade3 "kind=grammar&items=articles,presentSimple,canCant,quantifiers&tenses=$G3" 4
run_case grammar-22-all "kind=grammar&items=$CARDS&tenses=$ALL" 22
run_case verbs-6-grade5 "kind=verbs&items=eat,go,study,get%20up,swim,play&tenses=$G5" 6
run_case verbs-6-grade3 "kind=verbs&items=eat,go,study,get%20up,swim,play&tenses=$G3" 6
# 1 column per sheet (GAMES-8)
run_case grammar-4-grade3-1col "kind=grammar&items=articles,presentSimple,canCant,quantifiers&tenses=$G3&columns=1" 4
run_case verbs-6-grade5-1col "kind=verbs&items=eat,go,study,get%20up,swim,play&tenses=$G5&columns=1" 6
rm -rf "$PROFILE"
echo
[ $FAIL -eq 0 ] && echo "All checks passed. PDFs in $OUT" || echo "Some checks FAILED. PDFs in $OUT"
exit $FAIL
