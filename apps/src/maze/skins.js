/**
 * Load Skin for Maze.
 *
 * This file defines all the visual themes and sprite configurations for maze games.
 * Each skin provides a complete visual experience with characters, obstacles, goals,
 * sounds, and animations that match specific educational themes.
 *
 * Asset Specifications:
 * - tiles: A 250x200 set of 20 map images for level backgrounds
 * - goal: A 20x34 goal image that players must reach
 * - background: Number of 400x400 background images. Randomly select one if
 *   specified, otherwise, use background.png.
 * - look: Colour of sonar-like look icon for player guidance
 */

// Import the comprehensive sprite mapping for neighborhood theme (1800+ sprites)
import neighborhoodSprites from './neighborhoodSprites.json';

// Import base skin functionality and utility functions
var skinsBase = require('../skins'); // Core skin loading system
var randomValue = require('../utils').randomValue; // Random selection utility

/**
 * SKIN CONFIGURATIONS
 *
 * Each skin object defines the complete visual and audio experience for a themed maze.
 * Properties can include character sprites, obstacle graphics, sound effects, animations,
 * and behavioral settings that customize the gameplay experience.
 */
var CONFIGS = {
  /**
   * LETTERS SKIN - Educational Alphabet Theme
   * Purpose: Teaches letter recognition through maze navigation
   * Key Features:
   * - No goal sprite (focus on movement learning)
   * - Hidden instructions (cleaner interface for young learners)
   * - Standard character animations
   */
  letters: {
    nonDisappearingPegmanHittingObstacle: true, // Character stays visible when hitting walls
    pegmanHeight: 50, // Character height in pixels
    pegmanWidth: 50, // Character width in pixels
    danceOnLoad: false, // No celebration animation on level start
    goal: '', // Empty goal - focus on movement, not reaching target
    idlePegmanAnimation: 'idle_avatar.gif', // Standing animation file
    movePegmanAnimation: 'move_avatar.png', // Walking animation sprite sheet
    movePegmanAnimationSpeedScale: 1.5, // Animation speed multiplier
    movePegmanAnimationFrameNumber: 9, // Number of frames in walking animation
    hideInstructions: true, // Hide instruction overlay for cleaner UI
  },

  /**
   * BEE SKIN - Nature Pollination Theme
   * Purpose: Teaches about bees, flowers, and pollination through interactive gameplay
   * Key Features:
   * - Flower collection mechanics (red and purple flowers)
   * - Honey production simulation
   * - Cloud hiding animations
   * - Multiple nature-themed sound effects
   * - Interactive nectar collection with speed scaling
   */
  bee: {
    // Obstacle Configuration
    obstacleAnimation: '', // No obstacle animations
    obstacleIdle: 'obstacle.png', // Static obstacle sprite

    // Interactive Nature Elements
    redFlower: 'redFlower.png', // Collectible red flower sprite
    purpleFlower: 'purpleFlower.png', // Collectible purple flower sprite
    honey: 'honey.png', // Honey goal/collectible sprite
    cloud: 'cloud.png', // Cloud obstacle sprite
    cloudAnimation: 'cloud_hide.gif', // Cloud hiding animation

    // Audio System
    beeSound: true, // Enable bee buzzing sound effects
    nectarSound: 'getNectar.mp3', // Sound when collecting nectar
    honeySound: 'makeHoney.mp3', // Sound when making honey

    // Visual Styling
    look: '#000', // Black color for look/sonar icon
    nonDisappearingPegmanHittingObstacle: true, // Bee stays visible when hitting obstacles

    // Character Animation System
    idlePegmanAnimation: 'idle_avatar.gif', // Bee standing animation
    wallPegmanAnimation: 'wall_avatar.png', // Bee hitting wall sprite
    movePegmanAnimation: 'move_avatar.png', // Bee flying/walking animation
    hittingWallAnimation: 'wall.gif', // Bee hitting wall animation
    movePegmanAnimationSpeedScale: 1.5, // Bee movement speed (1.5x normal)
    movePegmanAnimationFrameNumber: 9, // Frames in bee movement animation

    // Action Timing Control
    actionSpeedScale: {
      nectar: 1, // Nectar collection speed multiplier
    },

    // Character Positioning
    pegmanYOffset: 0, // Vertical offset for bee character
    tileSheetWidth: 5, // Width of animation sprite sheet
    pegmanHeight: 50, // Bee character height in pixels
    pegmanWidth: 50, // Bee character width in pixels
  },

  /**
   * COLLECTOR SKIN - Gem Collection Adventure Theme
   * Purpose: Adventure-based maze where players collect gems and navigate obstacles
   * Key Features:
   * - Gem collection mechanics with visual feedback
   * - Multiple gem collection sound effects
   * - Transparent tile ending for seamless level transitions
   * - Celebration dance animation on level start
   */
  collector: {
    // Character Animation System
    wallPegmanAnimation: 'wall_avatar.png', // Character hitting wall sprite
    movePegmanAnimation: 'move_avatar.png', // Character walking animation
    movePegmanAnimationSpeedScale: 1, // Normal walking speed (1x)
    movePegmanAnimationFrameNumber: 8, // 8 frames in walking animation
    pegmanHeight: 50, // Character height in pixels
    pegmanWidth: 50, // Character width in pixels

    // Gem Collection System
    goal: 'gem.png', // Main gem goal sprite
    collectBlock: 'gem_cropped.png', // Gem sprite when collected
    corners: 'corners.png', // Corner/level boundary graphics

    // Audio Feedback System
    collectSounds: ['get_gem_2.mp3', 'get_gem_4.mp3', 'get_gem_6.mp3'], // Multiple gem collection sounds

    // Walk sound works, but the current available audio is a bit too harsh for
    // classroom usage. Temporarily disabling until we get some milder audio
    //walkSound: 'walk.mp3',

    // Visual Styling
    look: '#000', // Black color for look/sonar icon
    transparentTileEnding: true, // Allow seamless level transitions
    nonDisappearingPegmanHittingObstacle: true, // Character stays visible when hitting obstacles
    background: 'background.png', // Background image for the level
    danceOnLoad: true, // Celebration dance animation when level starts
  },

  /**
   * FARMER SKIN - Farming and Agriculture Theme
   * Purpose: Teaches about farming, soil preparation, and agricultural concepts
   * Key Features:
   * - Dirt digging and filling mechanics
   * - Random background selection (4 farm variants)
   * - Ground-level character positioning
   * - Farming sound effects (digging, filling)
   */
  farmer: {
    obstacleIdle: 'obstacle.png', // Static obstacle sprite

    // Farming Mechanics
    dirt: 'dirt.png', // Dirt block sprite for digging/filling
    fillSound: 'fill.mp3', // Sound when filling dirt
    digSound: 'dig.mp3', // Sound when digging dirt

    // Visual Styling
    look: '#000', // Black color for look/sonar icon
    transparentTileEnding: true, // Allow seamless level transitions
    nonDisappearingPegmanHittingObstacle: true, // Character stays visible when hitting obstacles
    background: 'background' + randomValue([0, 1, 2, 3]) + '.png', // Random farm background (4 variants)
    dirtSound: true, // Enable dirt interaction sounds
    pegmanYOffset: -8, // Ground-level character positioning
    danceOnLoad: true, // Celebration dance animation when level starts
  },

  /**
   * HARVESTER SKIN - Crop Collection Theme
   * Purpose: Teaches about different crops and harvesting in agriculture
   * Key Features:
   * - Multiple crop types (corn, pumpkin, sprout, lettuce)
   * - Harvesting mechanics with sound feedback
   * - Random background selection (4 farm variants)
   * - Ground-level character positioning for farming activities
   */
  harvester: {
    obstacleIdle: 'obstacle.png', // Static obstacle sprite

    // Crop Collection System
    corn: 'corn.png', // Corn crop sprite
    pumpkin: 'pumpkin.png', // Pumpkin crop sprite
    sprout: 'sprout.png', // Sprout/seedling sprite
    lettuce: 'lettuce.png', // Lettuce crop sprite

    harvestSound: 'dig.mp3', // Sound when harvesting crops

    // Visual Styling
    look: '#000', // Black color for look/sonar icon
    transparentTileEnding: true, // Allow seamless level transitions
    nonDisappearingPegmanHittingObstacle: true, // Character stays visible when hitting obstacles
    background: 'background' + randomValue([0, 1, 2, 3]) + '.png', // Random farm background (4 variants)
    pegmanYOffset: -8, // Ground-level character positioning
    danceOnLoad: true, // Celebration dance animation when level starts
  },

  /**
   * PVZ (PLANTS VS ZOMBIES) SKIN - Game Franchise Theme
   * Purpose: Popular game-themed maze with animated obstacles and goals
   * Key Features:
   * - Animated goal and obstacle sprites (GIF format)
   * - Larger obstacle scaling for dramatic effect
   * - Ground-level character positioning
   * - Celebration dance on level start
   */
  pvz: {
    // Animated Game Elements
    goalIdle: 'goalIdle.gif', // Animated idle goal sprite
    obstacleIdle: 'obstacleIdle.gif', // Animated idle obstacle sprite
    goalAnimation: 'goal.gif', // Animated goal sprite
    maze_forever: 'maze_forever.png', // Maze background element

    // Visual Scaling
    obstacleScale: 1.4, // Larger obstacles for dramatic effect
    pegmanYOffset: -8, // Ground-level character positioning
    danceOnLoad: true, // Celebration dance animation when level starts
  },

  /**
   * BIRDS SKIN - Bird-themed Adventure
   * Purpose: Bird-themed maze with complex animation system and victory mechanics
   * Key Features:
   * - Multiple animation states (idle, moving, hitting walls, approaching goal)
   * - Animated obstacles with broken tile effects
   * - Turn after victory animation
   * - Enhanced sound system
   * - Larger character size for better visibility
   */
  birds: {
    // Goal and Obstacle System
    goalIdle: 'goalIdle.gif', // Animated idle goal sprite
    obstacleIdle: 'obstacle.png', // Static obstacle sprite
    goalAnimation: 'goal.gif', // Animated goal sprite
    maze_forever: 'maze_forever.png', // Maze background element
    largerObstacleAnimationTiles: 'tiles-broken.png', // Broken tile animation for obstacles

    // Visual Scaling and Effects
    obstacleScale: 1.2, // Slightly larger obstacles
    additionalSound: true, // Enable enhanced sound effects

    // Complex Animation System
    idlePegmanAnimation: 'idle_avatar.gif', // Bird standing animation
    wallPegmanAnimation: 'wall_avatar.png', // Bird hitting wall sprite
    movePegmanAnimation: 'move_avatar.png', // Bird flying/walking animation
    movePegmanAnimationSpeedScale: 1.5, // Bird movement speed (1.5x normal)
    movePegmanAnimationFrameNumber: 9, // Frames in bird movement animation
    hittingWallAnimation: 'wall.gif', // Bird hitting wall animation
    approachingGoalAnimation: 'close_goal.png', // Bird approaching goal sprite

    // Character Specifications
    pegmanHeight: 68, // Larger bird character height
    pegmanWidth: 51, // Bird character width
    pegmanYOffset: -14, // Flying position offset
    turnAfterVictory: true, // Bird turns to face direction after winning
  },

  /**
   * SCRAT (ICE AGE) SKIN - Advanced Sprite Sheet Animation System
   * Purpose: Most complex skin with sophisticated sprite sheet animations and character positioning
   * Key Features:
   * - Sprite sheet-based animations with row/column coordinates
   * - Multiple animation states (idle, hitting walls, celebrating, moving)
   * - Large character size with precise positioning offsets
   * - Turn after victory animation
   * - Enhanced sound system
   */
  scrat: {
    // Basic Goal and Obstacle System
    goalIdle: 'goal.png', // Static goal sprite
    goalAnimation: 'goal.png', // Static goal animation
    maze_forever: 'maze_forever.png', // Maze background element
    largerObstacleAnimationTiles: 'tiles-broken.png', // Broken tile animation for obstacles

    // Audio System
    additionalSound: true, // Enable enhanced sound effects

    // Idle Animation (Sprite Sheet)
    idlePegmanAnimation: 'idle_avatar_sheet.png', // Sprite sheet for idle animation
    idlePegmanAnimationSpeedScale: 1.5, // Idle animation speed
    idlePegmanCol: 4, // Column position in sprite sheet
    idlePegmanRow: 11, // Row position in sprite sheet

    // Hitting Wall Animation (Sprite Sheet)
    hittingWallAnimation: 'wall_avatar_sheet.png', // Sprite sheet for wall collision
    hittingWallAnimationFrameNumber: 20, // Total frames in wall hit animation
    hittingWallAnimationSpeedScale: 1.5, // Wall hit animation speed
    hittingWallPegmanCol: 1, // Column position in wall hit sprite sheet
    hittingWallPegmanRow: 20, // Row position in wall hit sprite sheet

    // Celebration Animation (Sprite Sheet)
    celebrateAnimation: 'jump_acorn_sheet.png', // Sprite sheet for victory celebration
    celebratePegmanCol: 1, // Column position in celebration sprite sheet
    celebratePegmanRow: 9, // Row position in celebration sprite sheet

    // Movement Animation
    movePegmanAnimation: 'move_avatar.png', // Walking animation sprite
    movePegmanAnimationSpeedScale: 1.5, // Movement animation speed
    movePegmanAnimationFrameNumber: 9, // Frames in movement animation

    // Goal Approach Animation
    approachingGoalAnimation: 'close_goal.png', // Sprite when approaching goal

    // Character Specifications (Large Size)
    pegmanHeight: 107, // Large character height
    pegmanWidth: 80, // Character width
    pegmanXOffset: -12, // Horizontal positioning offset
    pegmanYOffset: -30, // Vertical positioning offset
    turnAfterVictory: true, // Character turns after winning
  },

  /**
   * NEIGHBORHOOD SKIN - Urban City Exploration Theme
   * Purpose: Complex urban environment with extensive sprite mapping system
   * Key Features:
   * - Massive sprite mapping system (1800+ sprites from JSON file)
   * - Multiple sprite sheets for different city elements
   * - Large canvas size for detailed city exploration
   * - Paint can tool integration for creativity
   * - Grid-based positioning system
   */
  neighborhood: {
    // Sprite Mapping System
    spriteMap: neighborhoodSprites, // Imported JSON with 1800+ sprite mappings
    sheetRows: {
      // Row counts for each sprite sheet
      'other.png': 3, // Miscellaneous sprites (3 rows)
      'vehicles.png': 7, // Vehicle sprites (7 rows)
      'buildings.png': 26, // Building sprites (26 rows)
      'sidewalk.png': 4, // Sidewalk sprites (4 rows)
      'wall.png': 4, // Wall sprites (4 rows)
    },

    // Character Specifications
    pegmanHeight: 80, // Character height for city exploration
    pegmanWidth: 80, // Character width
    pegmanYOffset: 0, // No vertical offset
    pegmanXOffset: 0, // No horizontal offset
    pegmanSheetWidth: 1280, // Width of character sprite sheet

    // Canvas and Grid System
    squareSize: 80, // Size of each grid square
    svgHeight: 800, // Canvas height in pixels
    svgWidth: 800, // Canvas width in pixels

    // Creative Tools
    paintCan: 'paint_can.png', // Paint can tool sprite for creativity features
  },
};

/**
 * SKIN INHERITANCE AND VARIANTS
 *
 * Night skins and derived skins use JavaScript's object reference system
 * to share base configurations while allowing for asset variations.
 */

// Night skin variants - share base configuration but use different asset folders
// Assets are stored in separate folders with "_night" suffix (e.g., "bee_night/")
CONFIGS.bee_night = CONFIGS.bee; // Bee theme with night-time assets
CONFIGS.farmer_night = CONFIGS.farmer; // Farmer theme with night-time assets

// Derived skin using inheritance - planter inherits from harvester with additional soil sprite
CONFIGS.planter = Object.assign({}, CONFIGS.harvester, {
  soil: 'soil.png', // Additional soil sprite for planting mechanics
});

/**
 * AUDIO ASSET URL GENERATOR
 *
 * Creates dual-format audio URLs for browser compatibility.
 * Most modern browsers support MP3, but OGG provides fallback support.
 *
 * @param {Object} skin - The skin object containing assetUrl method
 * @param {string} mp3Sound - MP3 filename (e.g., "collect.mp3")
 * @returns {Array} Array containing both MP3 and OGG URLs
 */
function soundAssetUrls(skin, mp3Sound) {
  var base = mp3Sound.match(/^(.*)\.mp3$/)[1]; // Extract filename without extension
  return [skin.assetUrl(mp3Sound), skin.assetUrl(base + '.ogg')]; // Return both formats
}

/**
 * MAIN SKIN LOADER FUNCTION
 *
 * This function creates a complete skin configuration by combining properties from
 * three hierarchical sources, with more specific configurations overriding general ones.
 *
 * Hierarchy (most specific to least specific):
 * 1. Individual skin config (from CONFIGS object)
 * 2. Maze-specific defaults (defined in this function)
 * 3. Base skin properties (from skinsBase.load())
 *
 * @param {Function} assetUrl - Function to generate asset URLs for the skin
 * @param {string} id - Skin identifier (e.g., 'bee', 'farmer', 'collector')
 * @returns {Object} Complete skin configuration object
 */
const load = function (assetUrl, id) {
  // (1) Load base properties common across all Blockly apps
  var skin = skinsBase.load(assetUrl, id); // Get base skin from parent module
  var config = CONFIGS[skin.id]; // Get specific skin configuration

  // (2) Set default values for properties common across all maze skins
  // These defaults can be overridden by specific skin configurations
  skin.obstacleScale = 1.0; // Default obstacle size scaling
  skin.obstacleAnimation = skin.assetUrl('obstacle.gif'); // Default obstacle animation
  skin.movePegmanAnimationSpeedScale = 1; // Default animation speed
  skin.look = '#FFF'; // Default look icon color (white)
  skin.background = skin.assetUrl('background.png'); // Default background image
  skin.tiles = skin.assetUrl('tiles.png'); // Default tile sprite
  skin.pegmanHeight = 52; // Default character height
  skin.pegmanWidth = 49; // Default character width
  skin.pegmanYOffset = 0; // Default character vertical offset
  skin.turnAfterVictory = false; // Default: don't turn after winning
  skin.danceOnLoad = false; // Default: no dance animation on load

  // (3) Set up default sound system with dual-format support (MP3 + OGG)
  skin.obstacleSound = soundAssetUrls(skin, 'obstacle.mp3'); // Obstacle collision sound
  skin.wallSound = soundAssetUrls(skin, 'wall.mp3'); // Wall collision sound
  skin.winGoalSound = soundAssetUrls(skin, 'win_goal.mp3'); // Goal achievement sound
  skin.wall0Sound = soundAssetUrls(skin, 'wall0.mp3'); // Wall sound variant 0
  skin.wall1Sound = soundAssetUrls(skin, 'wall1.mp3'); // Wall sound variant 1
  skin.wall2Sound = soundAssetUrls(skin, 'wall2.mp3'); // Wall sound variant 2
  skin.wall3Sound = soundAssetUrls(skin, 'wall3.mp3'); // Wall sound variant 3
  skin.wall4Sound = soundAssetUrls(skin, 'wall4.mp3'); // Wall sound variant 4

  // (4) Apply skin-specific configurations, overriding defaults
  const isAsset = /\.\S{3}$/; // Regex: ends with dot + 3 characters (file extension)
  const isSound = /^(.*)\.mp3$/; // Regex: MP3 sound file

  /**
   * Asset URL Resolver
   * Automatically determines the correct URL generation method based on asset type
   * @param {string} val - Asset filename or value
   * @returns {string|Array} Processed asset URL(s)
   */
  function determineAssetUrl(val) {
    if (isSound.test(val)) {
      // Sound file: generate dual-format URLs (MP3 + OGG)
      val = soundAssetUrls(skin, val);
    } else if (isAsset.test(val)) {
      // Image file: generate standard asset URL
      val = skin.assetUrl(val);
    }
    return val;
  }

  // Apply skin-specific configuration, processing each property
  for (const prop in config) {
    const val = config[prop];
    if (Array.isArray(val)) {
      // Array of assets: process each element
      skin[prop] = val.map(determineAssetUrl);
    } else {
      // Single asset: process directly
      skin[prop] = determineAssetUrl(val);
    }
  }

  return skin; // Return complete, configured skin object
};

export default {load};
