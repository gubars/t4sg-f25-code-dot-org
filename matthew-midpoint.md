# Technical Reflection: Environment Compatibility & System Architecture

## Introduction: Architecture Incompatibility Analysis (Windows ARM)
A significant portion of the initial setup involved an investigation into the compatibility of the Code.org repository with Windows ARM hardware (Qualcomm Snapdragon processors). The following analysis details why the development environment is functionally incompatible with this architecture.

### System Specifications
+ **Host:** Windows 11 (ARM64)
+ **Hardware:** Qualcomm Snapdragon
+ **Virtualization:** WSL (Ubuntu for ARM64)

### Investigation Steps & Findings

1. **WSL and Package Repositories:**
   Running `wsl --install -d Ubuntu` on an ARM host deploys the ARM64 Linux kernel and repositories. Consequently, `apt install` commands retrieve ARM-specific binaries rather than the required x86 versions.

2. **Dependency Chain Failures:**
   The repository relies heavily on dependencies that require native C extensions and precompiled binaries specific to the **x86_64** architecture.
   + **Ruby Gems:** Native extensions (e.g., `ffi`, `mysql2`) failed to compile due to missing headers or unsupported architecture errors (`unsupported architecture: arm64-linux`).
   + **Node Packages:** `node-gyp` failed to build multiple packages. `prebuild-install` could not locate binaries for the `linux-arm64` platform.
   + **Toolchain:** Essential tools including `MiniRacer`, `chromedriver`, and `chromedriver-helper` lack valid ARM builds in the required versions.

### Conclusion on Infrastructure
To successfully build and run the environment, an x86-based infrastructure is mandatory (Native macOS, Linux, or x86 Virtualization). The project cannot be compiled on Windows ARM.

---

## Part I: Collision Detection Architecture
Upon establishing a working environment, an analysis of the collision detection logic within `studio.js` revealed that the system relies on two primary modules to handle static environment interactions and dynamic object interactions.

### 1. Wall Collision Prediction (`walls.js`)
This module functions as a predictive system, determining whether a sprite or item will collide with a static boundary before movement occurs.

+ **Primary Interface:** `willCollidableTouchWall(collidable, proposedPosition)`
    + **Function:** Evaluates whether moving to a `proposedPosition` will result in a collision.
    + **Delegation:** This function does not perform the geometric calculation itself. Instead, it delegates to `willRectTouchWall()`, which is implemented polymorphically based on the wall system in use.

+ **Implementation Strategies:**
    + **`TileWalls`:** Utilizes grid-based logic for collision checks.
    + **`CollisionMaskWalls`:** Utilizes bitmap mask checks for pixel-perfect collision.
    + **Architecture:** The base `Walls` class defines the interface, while subclasses implement the specific detection algorithms.

### 2. Object-State Tracking (`collidable.js`)
This module manages the lifecycle of collisions between two dynamic objects (sprites), tracking three distinct states: initiation, continuation, and cessation.

+ **Key Lifecycle Methods:**
    + `startCollision(a, b)`: Triggered a single time when two objects first intersect.
    + `endCollision(a, b)`: Resets the collision state, allowing future collision events to trigger `startCollision` again.

### 3. Integration within the Game Loop (`studio.js`)
The game loop orchestrates these systems in the following sequence per frame:

1. **Pre-Movement Check:** The engine invokes `willCollidableTouchWall()`.
    + *Condition:* If the return value is `true`, movement is restricted.
2. **Post-Movement Check:** The engine evaluates overlapping objects.
    + *Action:* If an overlap is detected, `startCollision()` is invoked to trigger relevant game events.

---

## Part II: Environment Configuration Challenges
During the setup of the development environment on x86 architecture, several configuration conflicts were identified regarding Ruby versioning, the asset pipeline, and memory allocation.

### 1. Ruby Version Architecture Conflicts
+ **Issue:** A discrepancy occurred where the Ruby library version (3.4.7) did not match the executable version (3.2.3).
+ **Root Cause:** The system contained conflicting Ruby installations managed concurrently by Ubuntu Snap, Ubuntu APT, and rbenv. The codebase strictly requires Ruby 3.1.0 via rbenv.
+ **Resolution:**
    1. Complete removal of system-level Ruby installations (Snap and APT).
    2. Reinstallation of `ruby-build`.
    3. Exclusive installation of Ruby 3.1.0 via rbenv to ensure environment isolation.

### 2. Asset Pipeline Failures (`code-studio.css`)
+ **Issue:** The Rails application reported `code-studio.css` as missing, persisting through `rake build` and `yarn build` execution.
+ **Analysis:** This was identified as a downstream effect of the previous Ruby mismatches and silent Webpack failures.
+ **Status:** **This issue was not resolved.** Despite fixing core dependencies, the asset pipeline failed to generate the required CSS file.

### 3. Webpack Memory Allocation
+ **Issue:** Webpack processes terminated silently after 1–2 minutes without explicit error logs.
+ **Root Cause:** The Node.js process exceeded the available memory within the Virtual Machine (approx. 2GB), leading to heap corruption and corrupted `.cache` files in `node_modules`.
+ **Resolution:**
    + Increased the Node memory limit: `export NODE_OPTIONS="--max_old_space_size=4096"`
    + Allocated additional RAM to the VM.