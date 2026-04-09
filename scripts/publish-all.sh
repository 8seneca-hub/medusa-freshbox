#!/bin/bash
# Usage: bash scripts/publish-all.sh <otp>
# Example: bash scripts/publish-all.sh 123456

OTP="$1"
OTP_FLAG=""
if [ -n "$OTP" ]; then
  OTP_FLAG="--otp=$OTP"
fi

cd /Users/leminhchi/Documents/Freshbox/medusa-freshbox

find packages -name "package.json" -not -path "*/node_modules/*" -not -path "*/dist/*" -not -path "*/__*/*" -maxdepth 4 | while read f; do
  dir=$(dirname "$f")
  name=$(node -e "console.log(require('./$f').name || '')")
  if [[ "$name" == @freshbox-medusa/* ]]; then
    published=$(npm view "$name@1.0.3" version 2>/dev/null)
    if [ "$published" != "1.0.3" ]; then
      echo "Publishing $name from $dir..."
      npm publish "$dir" --access public $OTP_FLAG || echo "FAILED: $name"
      sleep 1
    else
      echo "SKIP: $name@1.0.3 already published"
    fi
  fi
done
