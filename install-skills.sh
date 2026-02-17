#!/bin/bash
# Momentum Quest - Skills Installation Script (Mac/Linux)
# This script copies the custom skills to your global Claude Code skills directory

echo "========================================"
echo "Momentum Quest - Installing Skills"
echo "========================================"
echo ""

# Define paths
SKILLS_SOURCE="$(dirname "$0")/docs/skills"
SKILLS_DEST="$HOME/.claude/skills/momentum-quest"

echo "Source: $SKILLS_SOURCE"
echo "Destination: $SKILLS_DEST"
echo ""

# Create destination directory if it doesn't exist
mkdir -p "$HOME/.claude/skills"
mkdir -p "$SKILLS_DEST"

echo "Copying skill files..."
echo ""

# Copy all .md files
cp "$SKILLS_SOURCE"/*.md "$SKILLS_DEST/"

echo ""
echo "========================================"
echo "Installation Complete!"
echo "========================================"
echo ""
echo "Skills installed to: $SKILLS_DEST"
echo ""
echo "You can now use these skills:"
echo "  /game-director"
echo "  /accelerometer-expert"
echo "  /gacha-expert"
echo "  /qa-expert"
echo "  /ui-expert"
echo "  /art-director"
echo "  /performance-expert"
echo "  /audio-expert"
echo "  /content-writer"
echo ""
echo "Happy building!"
echo "========================================"
