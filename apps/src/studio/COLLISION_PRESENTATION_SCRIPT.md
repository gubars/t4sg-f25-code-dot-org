# Collision Detection System: 2-Minute Overview
## Presentation Script for Code.org Developers

---

Let me walk you through how collision detection works in Studio. It's built around two core modules that handle different aspects of collision.

First, we have `walls.js`. This module is responsible for checking if sprites or items would hit walls before they actually move. The main function here is `willCollidableTouchWall()`. This function takes a collidable object - like a sprite or item - and a proposed position, and it tells you whether that position would cause a collision with a wall.

Now, `willCollidableTouchWall()` doesn't do the actual wall checking itself. Instead, it delegates to `willRectTouchWall()`, which is implemented in subclasses like `tileWalls.js`. The base `Walls` class defines the interface, but each subclass implements its own algorithm - so `TileWalls` does grid-based checking, while `CollisionMaskWalls` does bitmap-based checking. This design lets us swap out wall implementations without changing any of the calling code.

The second module is `collidable.js`, which handles collision state tracking between objects. This is where we manage whether objects are currently colliding with each other. The key functions here are `startCollision()` and `endCollision()`, both taking a key parameter that identifies what you're colliding with.

`startCollision()` is called when two objects first start touching. It returns true if this is a new collision - meaning they weren't already colliding - and false if they're already in a collision state. This prevents duplicate events from firing. When objects separate, we call `endCollision()` to clear that collision state, which allows the same collision to trigger again if they touch later.

All of this comes together in the game loop in `studio.js`. Every frame, before we update sprite positions, we call `willCollidableTouchWall()` to check if the new position would hit a wall. If it would, we don't update the position - that's why sprites stop at walls. Then, during the collision detection phase, we check if objects are overlapping, and if they are, we call `startCollision()` to track the state and trigger events. This two-phase approach - spatial checking first, then state management - gives us reliable collision behavior that students can depend on.
