#!/bin/bash

###############################################################################
# ChatGPT Smart Packager v3
#
# Usage:
#
#   ./package-for-chatgpt.sh compiler runtime
#   ./package-for-chatgpt.sh server tests
#   ./package-for-chatgpt.sh all
#   ./package-for-chatgpt.sh changed
#
###############################################################################

set -e

ZIP_NAME="chatgpt-package.zip"
rm -f "$ZIP_NAME"

INCLUDE=()

add_if_exists() {
    if [ -e "$1" ]; then
        INCLUDE+=("$1")
    fi
}

# ---------------------------------------------------------------------------
# Always include project essentials
# ---------------------------------------------------------------------------

ESSENTIALS=(
    package.json
    package-lock.json
    vite.config.js
    tsconfig.json
    tsconfig.app.json
    tsconfig.node.json
    jsconfig.json
    ARCHITECTURE.md
    README.md
    docs
    config
)

for f in "${ESSENTIALS[@]}"; do
    add_if_exists "$f"
done

# ---------------------------------------------------------------------------
# Handle commands
# ---------------------------------------------------------------------------

for arg in "$@"; do

    if [ "$arg" = "all" ]; then
        add_if_exists src
        add_if_exists server
        add_if_exists scripts
        add_if_exists templates
        add_if_exists tests
        continue
    fi

    if [ "$arg" = "changed" ]; then
        while read file; do
            [ -n "$file" ] && add_if_exists "$file"
        done < <(git diff --name-only HEAD)
        continue
    fi

    # src/<module>
    if [ -d "src/$arg" ]; then
        add_if_exists "src/$arg"
        continue
    fi

    # root folder
    if [ -d "$arg" ]; then
        add_if_exists "$arg"
        continue
    fi

    # individual file
    if [ -f "$arg" ]; then
        add_if_exists "$arg"
        continue
    fi

    echo "⚠ Unknown module: $arg"

done

echo ""
echo "Packaging..."

zip -rq "$ZIP_NAME" "${INCLUDE[@]}" \
-x "*/node_modules/*" \
-x "*/.git/*" \
-x "*/build/*" \
-x "*/output/*" \
-x "*/uploads/*" \
-x "*/audio_cache/*" \
-x "*/public/preview/*" \
-x "*/Images/preview*/*" \
-x "*.zip" \
-x "*.png" \
-x "*.jpg" \
-x "*.jpeg" \
-x "*.gif" \
-x "*.webp" \
-x "*.svg" \
-x "*.pdf" \
-x "*.docx" \
-x "*.pptx" \
-x "*.xlsx" \
-x "*.mp3" \
-x "*.wav" \
-x "*.aac" \
-x "*.ogg" \
-x "*.mp4" \
-x "*.mov" \
-x "*.DS_Store"

echo ""
echo "✅ Package created: $ZIP_NAME"
du -sh "$ZIP_NAME"

echo ""
echo "Included:"
printf "  ✓ %s\n" "${INCLUDE[@]}"