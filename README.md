# Three.js Graphics Project

A clean, simple Three.js graphics project using the CS559 Three.js library foundation.

## Quick Start

1. **Start the local server:**
   ```bash
   python3 server.py
   ```
   Or use npm:
   ```bash
   npm start
   ```

2. **Open in browser:**
   - Go to `http://localhost:8080/main.html`

## Project Structure

- `main.html` - Main HTML file with the 3D canvas and controls
- `main.js` - Three.js JavaScript code with scene setup and animation
- `server.py` - Simple Python HTTP server for local development
- `libs/CS559-Three/` - Three.js library (module format)

## Features

- **Interactive 3D Scene**: Multiple geometric shapes with animations
- **Mouse Controls**: 
  - Left click + drag to rotate camera
  - Mouse wheel to zoom
- **UI Controls**:
  - Rotation speed slider
  - Light intensity slider  
  - Color hue slider
  - Camera reset button
- **Lighting**: Ambient and directional lighting with shadows
- **Responsive**: Automatically handles window resizing

## Development

The project uses ES6 modules and requires a local server to run properly. The included Python server handles CORS and serves the correct MIME types for JavaScript modules.

**Different Port**: 
```bash
python3 server.py 3000
```

**Stop Server**: Press `Ctrl+C`

## Customization

Edit `main.js` to:
- Add new 3D objects and shapes
- Modify materials and textures
- Change lighting setup
- Add more interactive controls
- Create custom animations

The Three.js library is already included and ready to use with full ES6 module support.