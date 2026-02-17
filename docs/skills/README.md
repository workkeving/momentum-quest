# Momentum Quest - Expert Skills

This directory contains custom Claude Code skills for the Momentum Quest project.

## What Are These Skills?

These are specialized expert personas that you can invoke while developing Momentum Quest. Each skill provides deep domain expertise in a specific area.

## Available Skills

### Core Team
- `/game-director` ⭐ - Project coordinator, makes architectural decisions
- `/accelerometer-expert` - Movement detection & sensor calibration specialist
- `/gacha-expert` - Reward economy & gacha system designer
- `/qa-expert` - Testing & quality assurance specialist
- `/ui-expert` - Interface design & user experience expert
- `/art-director` - Visual assets, character animation, UI panels

### Specialist Team
- `/performance-expert` - Battery, memory, mobile optimization
- `/audio-expert` - Sound effects & audio feedback
- `/content-writer` - Messaging, UX copy, motivational text

## Installation

To use these skills with Claude Code, they need to be installed in your global skills directory.

### Automatic Installation (Recommended)

**Windows:**
```bash
# From the project root, run:
./install-skills.bat
```

**Mac/Linux:**
```bash
# From the project root, run:
chmod +x install-skills.sh
./install-skills.sh
```

### Manual Installation

Copy all `.md` files from this directory to:

**Windows:**
```
C:\Users\YOUR_USERNAME\.claude\skills\momentum-quest\
```

**Mac/Linux:**
```
~/.claude/skills/momentum-quest/
```

## Using the Skills

Once installed, invoke any skill by typing its name with a forward slash:

```
/game-director
/accelerometer-expert
/ui-expert
```

## How Skills Work

When you invoke a skill, Claude Code loads that expert persona with:
- Specialized knowledge in their domain
- Context about the Momentum Quest project
- Clear responsibilities and deliverables
- Guidelines for their specific role

**Example Use Cases:**
- `/game-director` - When you need high-level architecture decisions
- `/accelerometer-expert` - When movement detection needs tuning
- `/qa-expert` - Before releasing a new feature
- `/art-director` - When planning visual assets

## Development Workflow

1. **Start with `/game-director`** - Get the big picture and plan
2. **Delegate to specialists** - Game Director will call other experts as needed
3. **Invoke directly** - Call any expert when you need their specific expertise

## Updating Skills

If you modify these skill files:

1. Edit the `.md` files in `docs/skills/`
2. Re-run the installation script to update your global skills directory
3. Commit changes to version control

## Version Control

These skills are included in the project repository so:
- ✅ Team members can install them easily
- ✅ Skills evolve with the project
- ✅ Documentation is self-contained

---

**Questions?** Ask `/game-director` for guidance on which expert to consult!
