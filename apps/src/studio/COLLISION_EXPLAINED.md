# How Collision Detection Works: Visual & Interaction Impact

This document explains how `walls.js` and `collidable.js` functions directly impact what you see on screen and how users interact with Play Lab games.

## The Core Functions

### 1. `willCollidableTouchWall()` (walls.js)

**What it does:**
```javascript
willCollidableTouchWall(collidable, xCenter, yCenter) {
  // Adjusts collision rectangle based on movement type
  // Then checks if that rectangle would touch a wall
  return this.willRectTouchWall(xCenter, yCenter, width, height);
}
```

**What you see:**
- **Sprite stops moving** when it would hit a wall
- **Sprite bounces back** or slides along wall edge
- **Debug rectangles** appear (if debug mode enabled) showing collision boundaries

**User interaction impact:**
- When a student's sprite tries to move into a wall, the sprite **visually stops** at the wall boundary
- The sprite **cannot pass through** walls - movement is blocked
- This creates the **maze navigation** gameplay where students must find paths around obstacles

**Real example:**
```
Student runs: "move forward" block
→ Sprite tries to move north
→ willCollidableTouchWall() checks if new position hits wall
→ Returns TRUE (wall detected)
→ Sprite position is NOT updated
→ Sprite stays in place on screen
→ Student sees sprite didn't move
```

---

### 2. `willRectTouchWall()` (tileWalls.js - implementation)

**What it does:**
```javascript
willRectTouchWall(xCenter, yCenter, collidableWidth, collidableHeight) {
  // Converts pixel coordinates to grid coordinates
  // Checks surrounding grid cells for wall tiles
  // Tests if sprite's bounding box overlaps any wall cell
  return true/false;
}
```

**What you see:**
- **Precise wall boundaries** - sprites stop exactly at wall edges
- **Grid-based collision** - walls align to the game grid
- **Visual feedback** - sprite position matches wall layout

**User interaction impact:**
- Creates **snap-to-grid** movement feel in grid-aligned levels
- Ensures sprites **align perfectly** with maze paths
- Makes collision feel **predictable and fair** to students

**Real example:**
```
Maze has wall at grid position (3, 5)
Sprite at (2.8, 5.0) tries to move to (3.2, 5.0)
→ willRectTouchWall() checks grid cell (3, 5)
→ Finds wall tile
→ Calculates overlap between sprite rectangle and wall cell
→ Returns TRUE
→ Movement blocked
→ Sprite visually stops at x=3.0 (wall edge)
```

---

### 3. `startCollision()` / `endCollision()` (collidable.js)

**What they do:**
```javascript
startCollision(key) {
  // Marks that collision with 'key' object just started
  this.collidingWith_[key] = true;
  return true; // New collision started
}

endCollision(key) {
  // Marks that collision with 'key' object just ended
  this.collidingWith_[key] = false;
}
```

**What you see:**
- **"When touch obstacle" blocks fire** - events trigger when collision starts
- **Items disappear** - collectibles vanish when touched
- **Sprite reactions** - sprites can shake, change appearance, or trigger animations
- **Score changes** - points added/removed on collision

**User interaction impact:**
- **Event-driven gameplay** - students can react to collisions with code
- **Game mechanics** - collecting items, avoiding hazards, reaching goals
- **Visual feedback** - immediate response when sprites touch objects

**Real example:**
```
Sprite moves toward collectible item
→ Collision detected between sprite and item
→ startCollision('item_0') called
→ Returns TRUE (new collision)
→ "when get item" block executes
→ Item.beginRemoveElement() called
→ Item fades out and disappears from screen
→ Score increases
→ Student sees item collected and score update
```

---

## The Complete Flow: From User Action to Screen

### Scenario: Student moves sprite into a wall

**Step 1: User Action**
```
Student clicks "move forward" block
```

**Step 2: Code Execution**
```javascript
// In api.js
move(id, spriteIndex, dir) {
  Studio.queueCmd(id, 'move', {
    spriteIndex: spriteIndex,
    dir: Number(dir),
  });
}
```

**Step 3: Game Loop Processes Command**
```javascript
// In studio.js - during game tick
// Sprite tries to move to new position
var newX = sprite.x + speed * direction.x;
var newY = sprite.y + speed * direction.y;
```

**Step 4: Wall Check**
```javascript
// In studio.js line 964
if (Studio.willSpriteTouchWall(sprite, newX, newY)) {
  // Movement blocked!
  newX = origX;  // Keep original position
  newY = origY;
}
```

**Step 5: Visual Update**
```javascript
sprite.x = newX;  // Position NOT changed
sprite.y = newY;  // Position NOT changed
// Sprite.render() called
// Sprite stays in same visual position on screen
```

**What student sees:**
- Sprite **doesn't move** - stays in place
- Sprite **appears to hit an invisible barrier**
- Wall is **visually present** in the background

---

### Scenario: Sprite touches a collectible item

**Step 1: Movement**
```
Sprite moves toward item
```

**Step 2: Collision Detection**
```javascript
// In studio.js - collision check loop
for (var i = 0; i < Studio.items.length; i++) {
  var item = Studio.items[i];
  
  // Check if sprite and item overlap
  if (collisionTest(sprite, item)) {
    if (item.startCollision(spriteIndex)) {
      // NEW collision detected!
```

**Step 3: Event Trigger**
```javascript
// startCollision() returns TRUE (first time touching)
// Triggers "when get item" event handler
handleCollision(spriteIndex, item.className, true);
```

**Step 4: Item Removal**
```javascript
// Item begins fade animation
item.beginRemoveElement();
// Item opacity decreases over time
// After fade completes, item removed from screen
```

**Step 5: Visual Feedback**
```javascript
// Score updates
Studio.changeScore({value: 10});
// Item fades out (opacity: 1.0 → 0.0)
// Item disappears from screen
```

**What student sees:**
- Item **fades out** (smooth animation)
- Item **disappears** from game area
- Score **increases** (number updates)
- Sprite **continues moving** (not blocked by item)

---

## Visual Debugging: What Developers See

### Debug Rectangles

When debug mode is enabled, collision functions draw rectangles:

```javascript
// In walls.js line 34
this.drawDebugRect('avatarCollision', xCenter, yCenter, width, height);
```

**What appears on screen:**
- **Red rectangles** around sprites showing collision boundaries
- **Green rectangles** showing wall grid cells being checked
- **Yellow lines** showing collision detection paths

**Purpose:**
- Helps developers see **exactly where collisions are detected**
- Shows **collision rectangle size and position**
- Visualizes **grid cell boundaries**

---

## Key Visual Behaviors Explained

### 1. **Sprite Stops at Walls**

**Why:** `willCollidableTouchWall()` returns `true` before position update

**Code path:**
```
move() → queueCmd() → game tick → willSpriteTouchWall() 
→ willCollidableTouchWall() → willRectTouchWall() 
→ returns TRUE → position NOT updated → sprite stays put
```

**Screen result:** Sprite visually frozen at wall boundary

---

### 2. **Items Disappear When Touched**

**Why:** `startCollision()` triggers removal, `beginRemoveElement()` starts fade

**Code path:**
```
collision detected → startCollision() returns TRUE 
→ handleCollision() → beginRemoveElement() 
→ fade animation → removeElement() → item removed from array
```

**Screen result:** Item smoothly fades out and vanishes

---

### 3. **Sprites Can't Overlap Walls**

**Why:** Position update is prevented when `willCollidableTouchWall()` returns `true`

**Code path:**
```
calculate new position → check wall collision 
→ if collision: keep old position → render at old position
```

**Screen result:** Sprite appears to "bounce off" or "slide along" wall

---

### 4. **Collision Events Fire Once**

**Why:** `startCollision()` only returns `true` the first time, `isCollidingWith()` prevents repeats

**Code path:**
```
first touch → startCollision() → returns TRUE → event fires
still touching → startCollision() → returns FALSE → no event
move away → endCollision() → collision cleared
touch again → startCollision() → returns TRUE → event fires again
```

**Screen result:** "When touch obstacle" blocks execute once per touch, not continuously

---

## Performance Impact on Visuals

### Collision Checks Per Frame

For a typical game with:
- 1 sprite
- 5 items
- 1 projectile

**Per frame:**
- 1 wall check (for sprite movement)
- 5 sprite-item collision checks
- 1 sprite-projectile collision check
- 1 sprite-edge collision check

**Total: ~8 collision checks per frame**

At 20 FPS: **~160 collision checks per second**

**Visual impact:**
- Smooth movement (no lag)
- Responsive collision detection
- Real-time item collection
- Immediate wall blocking

---

## User Experience Summary

### What Students Experience:

1. **Movement feels natural** - sprites stop smoothly at walls
2. **Collisions are predictable** - items disappear when touched
3. **Visual feedback is immediate** - no delay between action and result
4. **Game mechanics work reliably** - collision events fire correctly

### What Makes It Work:

- **Precise collision detection** - `willRectTouchWall()` checks exact boundaries
- **State tracking** - `startCollision()`/`endCollision()` prevent duplicate events
- **Position validation** - movement blocked before visual update
- **Smooth animations** - fade effects for item removal

---

## Code Locations for Key Behaviors

| User Sees | Function | File | Line |
|-----------|----------|------|------|
| Sprite stops at wall | `willSpriteTouchWall()` | studio.js | 1922 |
| Item disappears | `startCollision()` → `beginRemoveElement()` | collidable.js, Item.js | 57, 399 |
| Collision event fires | `startCollision()` → `handleCollision()` | collidable.js, studio.js | 57, 1641 |
| Wall boundary check | `willRectTouchWall()` | tileWalls.js | 24 |
| Debug rectangles | `drawDebugRect()` | walls.js | 34 |

---

## Testing the Visual Impact

To see these functions in action:

1. **Enable debug mode:**
   ```javascript
   Studio.showDebugInfo(true);
   ```
   - See collision rectangles
   - See wall grid cells
   - See collision boundaries

2. **Move sprite into wall:**
   - Watch sprite stop exactly at wall edge
   - See debug rectangle at collision point

3. **Touch an item:**
   - Watch item fade out
   - See collision event trigger
   - Observe score update

4. **Check collision state:**
   ```javascript
   sprite.isCollidingWith('wall')  // true when touching wall
   item.isCollidingWith(0)         // true when sprite 0 touching item
   ```

These functions are the **bridge between code and visuals** - every collision check directly determines what appears on screen and how the game responds to user actions.

