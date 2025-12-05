# Studio Module Documentation

The `apps/src/studio` directory contains the core game engine and API for **Play Lab** (also called "Studio"), Code.org's visual programming environment where students create interactive games and animations using Blockly blocks or JavaScript.

## Overview

Studio is a sprite-based game engine that powers:
- **Play Lab** levels in Code.org's curriculum
- **Hour of Code** tutorials (Star Wars, Minecraft, Frozen, etc.)
- Student-created games and animations
- Various puzzle types that use sprite movement and interaction

The module provides a complete game loop, sprite management, collision detection, wall systems, and a Blockly/JavaScript API for controlling game elements.

## Key Files and Their Purposes

### Core Engine Files

#### `studio.js` (7,000+ lines)
**Purpose**: Main game engine and application controller

**Key Responsibilities**:
- Initializes and manages the Studio game loop
- Handles Blockly block execution via JSInterpreter
- Manages sprite and item collections
- Processes game commands queued from blocks/JavaScript
- Handles user input (keyboard, touch, gestures)
- Manages game state (WAITING, ACTIVE, OVER)
- Renders the visualization area
- Handles scoring, victory conditions, and game completion
- Integrates with Code Studio's project system for saving/loading

**Key Exports**:
- `Studio` namespace object with game state and methods
- Command queue system (`queueCmd`) for deferred execution
- Event system for game events (collisions, goals, etc.)
- Integration with Blockly workspace and interpreter

**Relationships**:
- Imports from: `api.js`, `blocks.js`, `Sprite.js`, `Item.js`, `walls.js`, `levels.js`
- Used by: Blockly blocks (via generated JavaScript), JavaScript mode levels
- Integrates with: `StudioApp` singleton, Redux store, project system

---

#### `api.js` (~370 lines)
**Purpose**: Blockly API - functions exposed to Blockly blocks

**Key Functions**:
- `setSprite()`, `getSpriteValue()` - Sprite manipulation
- `setBackground()`, `setMap()` - Environment control
- `move()`, `turnRight()`, `turnLeft()` - Movement commands
- `saySprite()` - Speech bubbles
- `playSound()` - Audio playback
- `addGoal()`, `changeScore()` - Game mechanics
- `onEvent()` - Event handlers
- `endGame()` - Game completion

**How it works**:
- Functions queue commands via `Studio.queueCmd()` for deferred execution
- Commands are processed during the game tick loop
- Provides callback support for async operations (e.g., `getSpriteXY`)

**Relationships**:
- Used by: Blockly block generators (in `blocks.js`)
- Calls: `Studio.queueCmd()` to schedule game actions
- Exported to: Blockly workspace JavaScript generation

---

#### `apiJavascript.js` (~290 lines)
**Purpose**: JavaScript/Droplet API - functions for text-based coding levels

**Key Differences from `api.js`**:
- Functions don't require `id` parameter (uses `null` internally)
- Designed for direct JavaScript function calls
- Used in Droplet editor and ACE editor levels

**Example Usage**:
```javascript
// In JavaScript mode:
setSprite(0, "cat");
moveForward();
playSound("pop");
```

**Relationships**:
- Parallel API to `api.js` but for different coding modes
- Used by: JavaScript/Droplet interpreter
- Same underlying `Studio.queueCmd()` system

---

### Sprite and Item System

#### `Sprite.js` (~545 lines)
**Purpose**: Sprite class - animated characters that students control

**Key Features**:
- Extends `Item` class
- Handles sprite animations (walking, idle, emotions)
- Supports both modern spritesheet format and legacy format
- Direction-based animation (8 directions: N, NE, E, SE, S, SW, W, NW)
- Emotion system (NORMAL, HAPPY, ANGRY, SAD)
- Collision detection with walls and other sprites
- Fade in/out effects
- Grid-aligned or free movement

**Key Methods**:
- `setImage()` / `setLegacyImage()` - Load spritesheet
- `display()` - Render sprite with correct animation frame
- `update()` - Update position and animation state
- `startFade()` - Begin fade out animation

**Relationships**:
- Extends: `Item` class
- Uses: `StudioAnimation`, `StudioSpriteSheet` for rendering
- Managed by: `Studio.sprite[]` array in `studio.js`

---

#### `Item.js` (~577 lines)
**Purpose**: Base class for game objects (items, collectibles, hazards)

**Key Features**:
- Extends `Collidable` for collision detection
- AI behaviors: WANDER, CHASE, FLEE, WATCH_ACTOR, STOP, GRID_ALIGNED
- Grid-based movement system
- Automatic pathfinding toward targets
- Fade animations
- Speed and direction management

**Key Behaviors**:
- **WANDER**: Random movement
- **CHASE**: Moves toward target sprite
- **FLEE**: Moves away from target sprite
- **WATCH_ACTOR**: Turns to face target without moving
- **STOP**: Stationary
- **GRID_ALIGNED**: Grid-snapped movement

**Relationships**:
- Base class for: `Sprite`, `Projectile`
- Extends: `Collidable`
- Managed by: `Studio.items[]` array

---

#### `projectile.js` (~250 lines)
**Purpose**: Projectile class - objects thrown by sprites

**Key Features**:
- Extends `Collidable`
- Direction-based rotation and movement
- Collision detection with sprites and walls
- Customizable appearance via CSS classes
- Speed and animation control

**Usage**:
- Created via `throwProjectile()` API call
- Automatically moves in specified direction
- Removed on collision or boundary exit

**Relationships**:
- Extends: `Collidable`
- Created by: `api.js` `throwProjectile()` function
- Managed by: `Studio.projectiles[]` array

---

### Collision and Physics

#### `collidable.js`
**Purpose**: Base class for objects that can collide

**Key Features**:
- Collision detection between collidables
- Collision state tracking (start/end events)
- Bounding box calculations
- Collision event system

**Relationships**:
- Base class for: `Item`, `Sprite`, `Projectile`
- Used by: Collision detection system in `studio.js`

---

#### `walls.js` (base class)
**Purpose**: Abstract wall system for collision detection

**Key Features**:
- Abstract base class for wall implementations
- `willCollidableTouchWall()` - Main collision check
- Configurable collision rectangle offsets
- Grid-aligned vs free movement support

**Subclasses**:
- `tileWalls.js` - Tile-based walls
- `collisionMaskWalls.js` - Bitmap collision masks
- `obstacleZoneWalls.js` - Zone-based obstacles

**Relationships**:
- Extended by: `tileWalls.js`, `collisionMaskWalls.js`, `obstacleZoneWalls.js`
- Used by: `Sprite` and `Item` movement logic

---

#### `tileWalls.js`
**Purpose**: Grid-based tile wall system

**How it works**:
- Walls defined as 2D grid array
- Each cell can contain wall data
- Fast collision checks using grid coordinates

---

#### `collisionMaskWalls.js`
**Purpose**: Bitmap-based collision detection

**How it works**:
- Uses image masks for precise collision shapes
- More accurate than grid-based but slower
- Used for complex wall shapes

---

#### `obstacleZoneWalls.js`
**Purpose**: Zone-based obstacle system

**How it works**:
- Defines rectangular obstacle zones
- Used for specific level types

---

### Blockly Integration

#### `blocks.js` (~4,000 lines)
**Purpose**: Blockly block definitions and code generation for Studio

**Key Responsibilities**:
- Defines all Blockly blocks available in Studio
- Generates JavaScript code from blocks
- Provides block validation and required block checking
- Handles block categories and toolbox organization
- Manages block parameter lists (sprites, directions, emotions, etc.)

**Block Categories**:
- **Sprites**: Movement, appearance, behavior
- **Events**: When blocks, collision handlers
- **Drawing**: Background, map, colors
- **Sound**: Play sounds
- **Game Logic**: Scoring, goals, game end

**Key Functions**:
- `createToolbox()` - Builds Blockly toolbox
- Block generators for each block type
- Code generators that call `api.js` functions
- Required block validation for level completion

**Relationships**:
- Generates code that calls: `api.js` functions
- Used by: Blockly workspace initialization
- Validates: Required blocks for level completion

---

#### `paramLists.js`
**Purpose**: Parameter value lists for Blockly dropdowns

**Contains**:
- Sprite names and indices
- Direction values
- Emotion values
- Position constants
- Speed values
- Size values

**Relationships**:
- Used by: `blocks.js` for block field definitions
- Referenced by: `constants.js` for enum values

---

### Level and Configuration

#### `levels.js`
**Purpose**: Level configuration and initialization

**Key Features**:
- Parses level JSON configuration
- Initializes sprites, items, walls from level data
- Sets up game parameters (grid size, speeds, etc.)
- Handles level-specific customizations

**Relationships**:
- Called by: `studio.js` during level initialization
- Reads from: Level JSON files from dashboard

---

#### `constants.js` (~425 lines)
**Purpose**: Constants and enums used throughout Studio

**Key Constants**:
- `Direction` - 8-direction enum (N, NE, E, SE, S, SW, W, NW)
- `Emotions` - Emotion states (NORMAL, HAPPY, ANGRY, SAD)
- `SpriteSpeed` - Speed values (VERY_SLOW to VERY_FAST)
- `SpriteSize` - Size multipliers
- `Position` - Grid position constants
- `SquareType` - Maze cell types (OPEN, WALL, SPRITESTART, etc.)
- `BEHAVIOR_*` - Item behavior types
- Animation frame duration defaults
- Collision distance scaling

**Key Functions**:
- `getClosestDirection()` - Convert vector to direction
- `turnLeft90()`, `turnRight90()` - Direction rotation
- Direction lookup tables for animations

**Relationships**:
- Imported by: Most Studio files
- Used by: `Sprite`, `Item`, movement logic, animation system

---

### Rendering and Animation

#### `StudioAnimation.js`
**Purpose**: Animation controller for sprites and items

**Key Features**:
- Manages animation frame timing
- Handles animation sequences (idle, walking, emotions)
- SVG-based rendering
- Frame rate control

**Relationships**:
- Used by: `Sprite`, `Item` classes
- Works with: `StudioSpriteSheet` for frame data

---

#### `StudioSpriteSheet.js`
**Purpose**: Spritesheet parser and frame manager

**Key Features**:
- Parses spritesheet images
- Manages frame coordinates
- Handles packed vs unpacked sheet formats
- Direction and emotion frame mapping

**Relationships**:
- Used by: `StudioAnimation`
- Loaded by: `Sprite.setImage()` / `setLegacyImage()`

---

#### `StudioVisualizationColumn.jsx`
**Purpose**: React component for the game visualization area

**Key Features**:
- Renders SVG game area
- Handles user interactions (click, drag)
- Manages visualization state
- Integrates with Redux

**Relationships**:
- React component used in: Studio app UI
- Renders: SVG elements from `Studio` game state

---

### Specialized Features

#### `cell.js`
**Purpose**: Grid cell utilities

**Key Features**:
- Grid coordinate calculations
- Cell type checking
- Position conversions

---

#### `skins.js`
**Purpose**: Skin/theme configuration

**Key Features**:
- Defines visual themes for different level types
- Configures wall rendering, collision, movement styles
- Used by Hour of Code tutorials (Star Wars, Minecraft, etc.)

**Relationships**:
- Loaded by: `studio.js` during initialization
- Configures: Wall system, sprite appearance, game mechanics

---

#### `starwars/` directory
**Purpose**: Star Wars Hour of Code special effects

**Files**:
- `GlowFilter.js` - Glow effect for lightsabers
- `ImageFilter.js` - Image processing filters
- `skins.js` - Star Wars theme configuration

---

#### `customLogic/` directory
**Purpose**: Level-specific game logic

**Files**:
- `bigGameLogic.js` - Custom logic for "Big Game" levels
- `rocketHeightLogic.js` - Rocket height calculation
- `samBatLogic.js` - Sam & Bat character logic
- `customGameLogic.js` - General custom game mechanics

**Relationships**:
- Called by: `studio.js` for specific level types
- Extends: Standard Studio game mechanics

---

#### `dropletConfig.js`
**Purpose**: Droplet editor configuration for Studio

**Key Features**:
- Defines autocomplete suggestions
- Configures code templates
- Sets up JavaScript mode helpers

**Relationships**:
- Used by: Droplet editor when in Studio context
- Provides: API function hints and templates

---

#### `locale.js`
**Purpose**: Internationalization strings for Studio

**Key Features**:
- Translated strings for UI elements
- Block text translations
- Error messages

**Relationships**:
- Used by: `blocks.js` for block labels
- Imported by: Various Studio files for user-facing text

---

#### `ThreeSliceAudio.js`
**Purpose**: Audio playback with three-slice technique

**Key Features**:
- Efficient audio looping
- Three-slice technique for seamless loops
- Used for background music

**Relationships**:
- Used by: `studio.js` for sound playback
- Called by: `playSound()` API function

---

#### `spriteActions.js`
**Purpose**: Sprite action system

**Key Features**:
- `GridTurn`, `GridMove` - Grid-aligned movement actions
- `ShakeActor` - Shake effect for collisions
- Action queue system

**Relationships**:
- Used by: `Sprite` and `Item` classes
- Called by: Movement API functions

---

## Architecture and Data Flow

### Initialization Flow

1. **Level Load** (`levels.js`)
   - Parses level JSON configuration
   - Initializes wall system based on level type
   - Sets up initial sprites and items

2. **Studio Init** (`studio.js`)
   - Creates SVG visualization area
   - Initializes sprite/item arrays
   - Sets up game loop
   - Configures Blockly workspace

3. **Block Execution**
   - Blocks generate JavaScript via `blocks.js`
   - JavaScript calls `api.js` functions
   - Functions queue commands via `Studio.queueCmd()`
   - Commands execute during game tick

### Game Loop

```
1. Process queued commands (from blocks/JavaScript)
2. Update all sprites (movement, animation)
3. Update all items (AI behavior, movement)
4. Update projectiles (movement, collision)
5. Check collisions
6. Render frame (SVG updates)
7. Check win/lose conditions
8. Repeat
```

### Command Queue System

The `Studio.queueCmd()` system allows blocks/JavaScript to schedule game actions that execute during the game loop:

```javascript
// In api.js:
exports.setSprite = function (id, spriteIndex, value) {
  Studio.queueCmd(id, 'setSprite', {
    spriteIndex: spriteIndex,
    value: value,
  });
};

// In studio.js (during tick):
// Commands are processed and executed
```

## Integration with Code Studio

### Blockly Integration
- Studio blocks are defined in `blocks.js`
- Blocks appear in Blockly toolbox
- Block execution generates JavaScript that calls `api.js`
- Code runs in JSInterpreter for sandboxed execution

### Project System
- Games can be saved/loaded via Code Studio project system
- Level state serialized to JSON
- Sprite/item configurations saved

### Redux Integration
- Uses Redux for UI state (header, progress, etc.)
- `StudioVisualizationColumn` is a React component
- Game state separate from React state

### Level Types
Studio powers various level types:
- **Play Lab** - General sprite-based games
- **Hour of Code** tutorials - Themed versions (Star Wars, Minecraft)
- **K1 Play Lab** - Simplified for kindergarten
- **Custom levels** - Levelbuilder-created variations

## Key Design Patterns

1. **Command Queue**: Deferred execution of game commands
2. **Component Hierarchy**: `Collidable` → `Item` → `Sprite`
3. **Strategy Pattern**: Different wall systems (tile, mask, zone)
4. **State Machine**: Direction transitions via `NextTurn` table
5. **Observer Pattern**: Event system for collisions, goals, etc.

## File Dependencies Graph

```
studio.js (main)
├── api.js → Studio.queueCmd()
├── blocks.js → api.js functions
├── levels.js → Initializes game state
├── Sprite.js → Item.js → Collidable.js
├── Item.js → Collidable.js
├── projectile.js → Collidable.js
├── walls.js (base)
│   ├── tileWalls.js
│   ├── collisionMaskWalls.js
│   └── obstacleZoneWalls.js
├── constants.js (used everywhere)
├── StudioAnimation.js → StudioSpriteSheet.js
└── StudioVisualizationColumn.jsx (React)
```

## Common Use Cases

### Adding a New Block
1. Define block in `blocks.js`
2. Add API function in `api.js`
3. Implement command handler in `studio.js`
4. Add to toolbox in `blocks.js`

### Adding a New Sprite Behavior
1. Add behavior constant to `constants.js`
2. Implement logic in `Item.js` or `Sprite.js`
3. Add API functions in `api.js` if needed
4. Update `blocks.js` if block interface needed

### Creating a Custom Level Type
1. Create custom logic file in `customLogic/`
2. Add skin configuration in `skins.js`
3. Implement level initialization in `levels.js`
4. Add any special blocks in `blocks.js`

## Testing

Studio code is tested via:
- Unit tests for individual classes
- Integration tests for game mechanics
- UI tests for Blockly integration
- Level completion tests

## Performance Considerations

- Game loop runs at ~20 FPS (configurable)
- Collision detection optimized for grid-based movement
- Sprite animations use efficient SVG rendering
- Command queue batches operations
- Large numbers of items may impact performance

## Future Considerations

- Migration to TypeScript (some files already converted)
- Modern React patterns (hooks, context)
- WebGL rendering for better performance
- Improved collision detection algorithms

