# RNK™ Mystix

**Version**: 1.0.0  
**Status**: Production Ready  
**License**: RNK Proprietary  
**Foundry VTT Compatibility**: v13+  
**Game System**: Pathfinder 2nd Edition  
**Module Type**: Premium Paid Module  

---

## Overview

RNK Mystix is a premium module for Pathfinder 2nd Edition that enables Game Masters to assign Hero Points and Mystic Points to actors simultaneously. When rolls are made, both point types contribute bonuses that are totaled together with the base roll result, providing a unified point system for flexible campaign rules.

---

## Quick Start

1. Log in as GM
2. Click the RNK Mystix button in the toolbar
3. Select an actor and assign Hero Points and Mystic Points
4. Points automatically add to all rolls (attacks, skills, saves)
5. Players see their point totals on their character sheets

---

## Features

**GM Point Assignment Hub**:
- Dropdown and search interface for filtering actors
- Organized by type (PCs, NPCs, Mystics)
- Real-time synchronization across all clients

**Synchronized Roll Integration**:
- Hero Points and Mystic Points bonuses automatically added to all roll types
- Attack rolls, skill checks, saves, and custom rolls all benefit
- Roll messages show bonus breakdown

**Visible Point Totals**:
- Point assignments display prominently on character sheets
- All players can see current point values
- Real-time updates when points change

**Flexible Configuration**:
- Set maximum points per type
- Configure default values
- Toggle negative points (debt system for house rules)
- Customize color schemes

**Per-Actor & Global Operations**:
- Reset points individually
- Reset all actors at once
- Bulk assign points to multiple actors
- Perfect for level-up or story events

**Professional Design**:
- Clean, legible interface
- Gold (Hero Points) and purple (Mystic Points) color coding
- Responsive design works on all resolutions
- Fully accessible keyboard navigation

---

## Installation

This is a PREMIUM module for RNK Patreon supporters only.

1. In Foundry VTT, go to **Add-on Modules**
2. Click **Install Module**
3. Paste this manifest URL:
   ```
   https://github.com/RNK-Enterprise/rnk-mystix/releases/latest/download/module.json
   ```
4. Click **Install**
5. Activate the module in your world configuration

### Requirements
- Foundry VTT v13 or higher
- Pathfinder 2nd Edition System
- Active Patreon supporter (Copper tier or higher)

---

## Usage

### Opening the GM Hub

1. Log in as GM
2. Look for the RNK Mystix button in the toolbar (purple icon with star)
3. Click to open the Point Assignment Hub

### Assigning Points

1. In the Point Assignment Hub, use the dropdown or search field
2. Select an actor (organized by PC, NPC, Mystic)
3. Enter desired Hero Point value (gold)
4. Enter desired Mystic Point value (purple)
5. Click **Assign** to apply immediately
6. All connected clients receive the update in real-time

### Executing Rolls

When an actor with assigned points makes any roll:
- Both point bonuses automatically add to the roll total
- The roll message displays the complete breakdown:
  - Base roll result
  - Hero Point bonus
  - Mystic Point bonus
  - Combined total
- No manual adjustments needed

### Resetting Points

**Individual Reset**:
1. Open Point Assignment Hub
2. Find the actor
3. Click "Reset"
4. Choose Hero, Mystic, or Both

**Global Reset**:
1. Click "Options" in the hub header
2. Select "Reset All Actors"
3. Choose point types to reset
4. Confirm

---

## Configuration

Access settings through Foundry's Module Configuration:

### Point Limits

| Setting | Default | Purpose |
|---------|---------|---------|
| Maximum Hero Points | 10 | Highest Hero Points any actor can have |
| Maximum Mystic Points | 10 | Highest Mystic Points any actor can have |

### Behavior

| Setting | Default | Purpose |
|---------|---------|---------|
| Default Hero Points | 0 | Starting value when assigning points |
| Default Mystic Points | 0 | Starting value when assigning points |
| Allow Negative Points | False | Enable debt system for special rules |
| Auto-Announce | True | Announce point changes to all players |

### Display

| Setting | Default | Purpose |
|---------|---------|---------|
| Show Points on Sheet | True | Display point totals on character sheet |
| Color Hero Points | Gold | Customize hero point display color |
| Color Mystic Points | Purple | Customize mystic point display color |

---

## Compatibility

| Feature | Status |
|---------|--------|
| Foundry v13 | Verified |
| Pathfinder 2e System | Full Support |
| Roll Integration | All Roll Types |
| Multiplayer Sync | Full Real-time |
| Actor Types | All Types (PC, NPC, Familiar) |

---

## Troubleshooting

### Points Not Appearing on Sheets

**Problem**: Character sheets don't show point values

**Solutions**:
1. Verify "Show Points on Sheet" is enabled in settings
2. Close and reopen the character sheet
3. Ensure the actor has points assigned
4. Check that Pathfinder 2e system is active
5. Try refreshing the browser (Ctrl+F5)

### Rolls Not Getting Bonuses

**Problem**: Rolls aren't adding point bonuses

**Solutions**:
1. Verify points are assigned to the actor
2. Check that module is enabled in world settings
3. Verify the roll is being made by the correct actor
4. Close and reopen the character sheet
5. Check browser console (F12) for errors
6. Try disabling other modules to check for conflicts

### Synchronization Lag

**Problem**: Points don't update immediately on other screens

**Solutions**:
1. Refresh the page if lag persists
2. Check network connection
3. Verify all clients are on the same Foundry version
4. Check server performance (Admin → Server Logs)

### Negative Point Display

**Problem**: Negative points show incorrectly

**Solutions**:
1. Verify "Allow Negative Points" is enabled in settings
2. Check that the value entered is actually negative
3. Try reassigning the points

---

## Advanced Usage

### House Rules with Negative Points

For custom campaign rules, you can enable negative points:

1. In Module Settings, enable "Allow Negative Points"
2. Assign negative values (e.g., -2 Hero Points)
3. This creates a "debt" system useful for narrative mechanics

Example: Curse system where actors lose Hero Point benefits

### Bulk Operations

To assign the same points to multiple actors:

1. Open Point Assignment Hub
2. Click "Bulk Assign"
3. Select multiple actors from the list
4. Enter point values
5. Click "Assign to All"

Perfect for:
- Level-up events (add 2 Hero Points to all PCs)
- Story campaign changes (reduce points for tough climax)
- New party member onboarding

---

## Support RNK Enterprise

RNK Mystix is a premium module designed for Patreon supporters. Your support directly funds:

- Continued development of premium modules
- Bug fixes and compatibility updates
- New features based on community feedback
- Priority support and assistance
- Exclusive early access to modules

**Support RNK on Patreon**: https://www.patreon.com/RagNaroks

### Patreon Tier Benefits

**Copper Tier ($1/month)**:
- Access to RNK Mystix and all premium modules
- Monthly development updates
- Patreon-only Discord channel

**Silver Tier ($5/month)**:
- Copper tier benefits, plus:
- Priority support (24-48 hour response)
- Early access to new modules (1 week before public)
- Feature request consideration

**Gold Tier ($10/month)**:
- Silver tier benefits, plus:
- Exclusive development roadmap access
- Direct influence on what we build next
- Custom module consulting

**Platinum Tier ($25/month)**:
- Gold tier benefits, plus:
- Private Discord channel with developers
- Priority bug fixes
- New module naming rights

---

## Changelog

### v1.0.0 - Initial Release (March 1, 2026)

**Features**:
- GM Point Assignment Hub with dropdown and search
- Synchronized Hero Points and Mystic Points system
- Automatic roll integration for all roll types
- Real-time multiplayer synchronization with socket support
- Per-actor point management and reset functionality
- Bulk operations for multiple actors
- Character sheet integration with point display
- Flexible configuration (limits, defaults, behavior)
- Full Foundry v13 compatibility
- Pathfinder 2e system support
- Professional UI with color-coded point types

**Bug Fixes**: N/A (Initial release)

**Known Issues**: None reported

---

## Contact & Community

- **GitHub Issues**: Report bugs or request features  
  https://github.com/RNK-Enterprise/rnk-mystix/issues

- **Patreon**: Support development  
  https://www.patreon.com/RagNaroks

- **Discord**: Join our community  
  https://discord.com/invite/rnk

- **Email**: Asgardinnovations@protonmail.com

---

## License

RNK Mystix is released under the **RNK Proprietary License**.

This module and all associated assets are the intellectual property of RNK Enterprise. Unauthorized reproduction, modification, or distribution is prohibited.

This is a **premium module** designed for Patreon supporters. Access and use is restricted to active patrons at https://www.patreon.com/RagNaroks

For licensing inquiries, contact: Asgardinnovations@protonmail.com

---

## Credits

**Created by**: Odinn - RNK Enterprise  
**Special Thanks**: Ms. Lisa for endless support and encouragement  

**Inspiration**: The Pathfinder 2e community and Foundry VTT developers

---

Made with dedication by a self-taught developer, retired truck driver, and stroke survivor.

Love and respect from RNK Enterprise — Odinn
