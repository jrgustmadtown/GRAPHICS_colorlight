# Critical Point System Template

A reusable Three.js system for adding glowing "critical points" to 3D objects. Critical points are fixed-size, glowing circles that appear randomly on object surfaces and pulse with a determined color.

### 1. Copy Files to Your Project
```
your-project/
├── critical-point-system.js  (copy this file)
├── your-main.js
└── ...
```

### 2. Import and Initialize
```javascript
import { CriticalPointSystem, CP_COLORS } from './critical-point-system.js';

// In your init function:
const cpSystem = new CriticalPointSystem(scene);
```

### 3. Add Critical Points to Objects
```javascript
// Add 3 red critical points to any object
cpSystem.addCriticalPoints(myObject, 3, CP_COLORS.RED);

// Add 5 cyan critical points
cpSystem.addCriticalPoints(anotherObject, 5, CP_COLORS.CYAN);

// Custom color (hex)
cpSystem.addCriticalPoints(myObject, 2, 0xff8800);
```

### 4. Update in Animation Loop
```javascript
function animate() {
    // ... other animation code ...
    
    // Update critical points (required for pulsing effect)
    cpSystem.updateCriticalPoints();
    
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}
```

## API Reference

### Constructor
```javascript
const cpSystem = new CriticalPointSystem(scene);
```

### Main Methods

#### `addCriticalPoints(object, count, color, options)`
- `object`: THREE.Mesh - The target object
- `count`: Number - How many CPs to add (default: 3)
- `color`: Hex number - CP color (default: 0xff0000)
- `options`: Object - Additional settings
  - `radius`: Number - CP size (default: 0.05)
  - `pulseSpeed`: Number - Animation speed (default: 3)

#### `updateCriticalPoints()`
Call this in your animation loop for pulsing effects.

#### `removeCriticalPoints(object)`
Remove all CPs from a specific object.

#### `clearAllCriticalPoints()`
Remove all CPs from the scene.

#### `changeCriticalPointColor(object, newColor)`
Change CP colors for a specific object.

### Color Presets
```javascript
import { CP_COLORS } from './critical-point-system.js';

CP_COLORS.RED      // 0xff0000
CP_COLORS.GREEN    // 0x00ff00
CP_COLORS.BLUE     // 0x0000ff
CP_COLORS.CYAN     // 0x00ffff
CP_COLORS.MAGENTA  // 0xff00ff
CP_COLORS.YELLOW   // 0xffff00
CP_COLORS.ORANGE   // 0xff8800
CP_COLORS.PURPLE   // 0x8800ff
CP_COLORS.WHITE    // 0xffffff
```

## Examples

### Basic Usage
```javascript
// Create objects
const cube = new THREE.Mesh(
    new THREE.BoxGeometry(2, 2, 2),
    new THREE.MeshLambertMaterial({ color: 0x4488ff })
);
scene.add(cube);

// Add critical points
cpSystem.addCriticalPoints(cube, 4, CP_COLORS.RED);
```

### Advanced Usage
```javascript
// Custom options
cpSystem.addCriticalPoints(myObject, 3, CP_COLORS.CYAN, {
    radius: 0.08,      // Larger CPs
    pulseSpeed: 5      // Faster pulsing
});

// Dynamic color changing
setTimeout(() => {
    cpSystem.changeCriticalPointColor(myObject, CP_COLORS.GREEN);
}, 3000);
```

### Integration with Existing Projects
```javascript
// In your existing Three.js project:

// 1. Import the system
import { CriticalPointSystem, CP_COLORS } from './critical-point-system.js';

// 2. Initialize after creating scene
let cpSystem;
function init() {
    scene = new THREE.Scene();
    // ... your existing setup ...
    
    cpSystem = new CriticalPointSystem(scene);
    
    // Add CPs to existing objects
    cpSystem.addCriticalPoints(existingObject1, 3, CP_COLORS.RED);
    cpSystem.addCriticalPoints(existingObject2, 2, CP_COLORS.BLUE);
}

// 3. Update in your animation loop
function animate() {
    // ... your existing animation code ...
    
    cpSystem.updateCriticalPoints(); // Add this line
    
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}
```

## Supported Geometries

The system automatically positions CPs correctly on:
- **BoxGeometry** - Places on faces
- **SphereGeometry** - Places on surface
- **CylinderGeometry** - Places on sides and caps
- **Other geometries** - Uses bounding box approximation

## Notes

- CPs are positioned to ensure the entire circle is visible on the object surface
- The glow effect uses transparent materials for optimal visual impact
- All CPs maintain consistent size regardless of object scale
- The system is designed to be lightweight and performant
