#!/bin/bash

# Convert JS files to TS files in src directory
find ./src -name "*.js" -type f | while read -r file; do
  ts_file="${file%.js}.tsx"
  echo "Converting $file to $ts_file"
  mv "$file" "$ts_file"
done

# Make basic TypeScript modifications to component files
# This is just a starting point - files will need manual review
find ./src/components -name "*.tsx" -type f | while read -r file; do
  echo "Adding TypeScript annotations to $file"
  sed -i '' 's/const \([a-zA-Z]*\) = () => {/const \1: React.FC = () => {/g' "$file"
  sed -i '' 's/const \([a-zA-Z]*\) = ({\([^)]*\)}) => {/const \1: React.FC<{\2}> = ({\2}) => {/g' "$file"
  sed -i '' '1s/^/import { useTranslation } from '\''react-i18next'\'';\n/' "$file"
  sed -i '' '/^import React/a\\nconst { t } = useTranslation();' "$file"
done

echo "Conversion complete. Please review the files manually for type correctness." 