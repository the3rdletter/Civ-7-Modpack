# RHQ AI Mod Documentation

## Overview
**Version:** 2.11  
**Authors:** RomanHoliday, AndyNemmity, Slothoth, Desucrate  
**Purpose:** A comprehensive AI enhancement mod for Civilization VII that improves AI behavior, long-term strategy, and decision-making across all ages and victory paths.

## Project Structure

### Root Files

#### `ai.modinfo` (modinfo.xml)
- **Purpose:** Main mod configuration file
- **Contains:** 
  - Mod metadata (name, version, authors)
  - Dependencies on base game and all three ages (Antiquity, Exploration, Modern)
  - Action criteria for age-specific loading
  - Load order configuration for proper initialization
  - UI script registration

#### `changelog.txt`
- **Purpose:** Version history and patch notes
- **Contains:** Detailed changelog from v1.0 to v2.11, documenting all AI improvements and balance changes

### `/modules/` Directory

#### `/modules/data/`

##### `art_intelligence_core.sql`
- **Purpose:** Core AI configuration and base game modifications
- **Key Features:**
  - Global yield adjustments (production, culture, science, food, gold, diplomacy)
  - Pseudo yield definitions and biases for AI decision-making
  - Construction priority system
  - Unit production biases  
  - Budget allocation settings
  - Maya civilization-specific adjustments
  - Jaguar Slayer unit modifications

#### `/modules/behaviortrees/`

##### `ai_trees.xml`
- **Purpose:** Defines naval superiority behavior tree
- **Contains:** Node-based AI behavior tree for naval operations including:
  - Unit recruitment
  - Naval defense
  - Naval escorts
  - Attack patterns
  - Patrol behaviors

##### `ant_ai_trees.xml`
- **Purpose:** Antiquity-specific AI operations
- **Contains:**
  - Naval superiority operation definitions
  - Target types for naval operations
  - Team composition requirements
  - Operation priorities and limits

#### `/modules/diplomacy/`

##### `all_diplomacy.sql`
- **Purpose:** Diplomatic behavior configuration
- **Contains:** Placeholder for diplomatic priorities and grievance settings

#### `/modules/ops/`

##### `all_ops.sql`
- **Purpose:** Global operation settings
- **Contains:**
  - City founding operation limits (increased to 2)
  - Settlement behavior tree assignment
  - Operation priority adjustments

##### `ant_ops.sql`
- **Purpose:** Antiquity-specific operations
- **Contains:** Placeholder for Antiquity era operations

##### `exploration_ops.sql`
- **Purpose:** Exploration age operations
- **Contains:** City assault operation limit increases

##### `modern_ops.sql`
- **Purpose:** Modern age operations
- **Contains:** City assault operation limit increases

#### `/modules/settlers/`

##### `all_settlers.sql`
- **Purpose:** Global settlement scoring and evaluation system
- **Key Features:**
  - Comprehensive settlement plot evaluation parameters
  - Natural wonder proximity bonuses
  - Resource class scoring
  - Freshwater and coastal adjustments
  - City proximity settings (minimum distance between cities)
  - Resource diversity considerations

##### `ant_settlers.sql`
- **Purpose:** Antiquity-specific settlement adjustments
- **Contains:**
  - Closer city spacing for early game expansion
  - Modified plot evaluation conditions
  - Yield-based scoring adjustments
  - Coastal settlement de-emphasis

#### `/modules/tactical/`

##### `all_tactical.sql`
- **Purpose:** Combat and tactical priorities
- **Contains:** Placeholder for tactical priority ordering

#### `/modules/vict/`

##### `all_vict.sql`
- **Purpose:** Victory path core settings
- **Key Features:**
  - Aggressive AI behavior templates
  - Diplomatic action preferences
  - War declaration biases
  - Sabotage action priorities
  - Lafayette leader-specific adjustments

##### `ant_vict.sql`
- **Purpose:** Antiquity victory conditions
- **Contains:**
  - Victory path strategy definitions (Military, Economic, Cultural, Science)
  - Condition requirements for each victory type
  - Leader trait associations
  - Budget allocations per victory path
  - Building and unit priorities
  - Civilization preferences for leaders
  - Progression tree node biases

##### `exploration_vict.sql`
- **Purpose:** Exploration age victory settings
- **Key Features:**
  - Increased city founding priorities (1500)
  - Town-to-city upgrade emphasis (700)
  - Victory path conditions (Distant Settlements, Resources, Relics)
  - Building priorities (Fishing Quay, Gristmill)
  - Leader-civilization preferences
  - Progression tree node priorities

##### `modern_vict.sql`
- **Purpose:** Modern age victory settings
- **Contains:**
  - Science victory (Space Race) conditions
  - Economic expansion (Railroad) strategies
  - Military ideology settings
  - Air unit priorities
  - Leader-civilization preferences

#### `/modules/vict/sovereign_and_above/`
High difficulty (Sovereign+) specific adjustments:

##### `ant_vict_sovereign_plus.sql`
- **Purpose:** Enhanced Antiquity strategies for highest difficulties
- **Contains:**
  - Wonder construction emphasis
  - Aggressive expansion settings
  - Enhanced science and culture priorities
  - City-specific wonder strategies (45+ production cities)

##### `exploration_vict_sovereign_plus.sql`
- **Purpose:** Enhanced Exploration strategies for highest difficulties
- **Contains:**
  - Increased settlement priorities
  - City defense adjustments
  - High-production city wonder strategies (40+ and 100+ production)

##### `modern_vict_sovereign_plus.sql`
- **Purpose:** Enhanced Modern strategies for highest difficulties
- **Contains:**
  - Air unit priority boosts
  - City defense enhancements
  - Adjusted expansion rates

### `/ui/` Directory

#### `change_banner.js`
- **Purpose:** UI modification script
- **Contains:** Currently empty placeholder for future UI enhancements

## Key AI Improvements

### Expansion & Settlement
- Dramatically increased AI desire to found cities (200→550-1000 depending on era)
- Reduced minimum city distance for denser settlement patterns
- Natural wonder proximity properly valued
- Fresh water settlements prioritized
- Era-specific settlement strategies

### Military Operations
- Increased simultaneous operation limits
- Better army composition (proper melee/ranged ratios)
- Settlers excluded from combat operations
- Lower combat odds thresholds for more aggressive behavior
- Enhanced city defense priorities

### Victory Path Specialization
Each victory path has tailored:
- Building priorities
- Unit production biases
- Yield preferences
- Diplomatic behaviors
- Expansion strategies

### Difficulty Scaling
- Base configurations for all difficulties
- Special "Sovereign and above" configurations for highest difficulties
- Production-based city strategies (wonder construction in high-production cities)

## Load Order
1. Base XML (behavior trees)
2. Base SQL (core settings, operations, diplomacy, settlers, tactical)
3. Victory conditions (all ages)
4. Age-specific settings (Antiquity → Exploration → Modern)

## Compatibility
- Requires base game and all three age DLCs
- Compatible with Steam Workshop
- Affects saved games when enabled

## Testing Notes
- AI settling behavior significantly improved
- Military operations more strategic
- Victory path pursuit more focused
- Higher difficulty AIs properly competitive