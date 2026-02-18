# ASCII 3D Animation

A beautiful bitmap/ASCII effect for rendering animated 3D models with Three.js. Perfect for adding retro, artistic visualizations to your website.

## Features

- 🎨 **Customizable color palettes** - Use any colors you want
- 📦 **Transparent backgrounds** - Seamlessly integrate into any website
- ✨ **Smooth particle animations** - Fade in/out with scatter effects
- 🎯 **High resolution** - Adjustable pixel size for detail
- 🔄 **Automatic rotation** - Built-in 3D model animation
- 🚀 **Easy to use** - Simple API, works with any Three.js setup

## Installation

```bash
npm install @santiagocetran/ascii-3d-animation three
```

## Quick Start

```javascript
import { startModelAnimation } from '@santiagocetran/ascii-3d-animation'

// Start the animation
const controller = startModelAnimation({
  container: document.getElementById('animation-container'),
  modelUrl: '/path/to/your-model.stl',
  effectOptions: {
    // Optional: customize the effect
    pixelSize: 3,
    colors: ['#021a15', '#053a2a', '#074434', '#ABC685', '#E8FF99'],
    backgroundColor: 'transparent'
  }
})

// Handle window resize
window.addEventListener('resize', () => {
  controller.resize()
})

// Clean up when needed
// controller.dispose()
```

## API

### `startModelAnimation(options)`

Creates and starts a 3D model animation with bitmap effects.

#### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `container` | HTMLElement | `document.body` | Container element for the animation |
| `modelUrl` | string | `'/sai-prueba-pagina.stl'` | Path to your STL model file |
| `effectOptions` | object | See below | Customize the visual effect |

#### Effect Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `pixelSize` | number | `3` | Size of each pixel/block (smaller = more detail) |
| `ditherType` | string | `'bayer4x4'` | Dithering algorithm: `'bayer4x4'`, `'bayer8x8'`, or `'variableDot'` |
| `colors` | array | Green gradient | Array of hex colors for the gradient (dark to light) |
| `backgroundColor` | string | `'transparent'` | Background color (use `'transparent'` for overlay) |
| `invert` | boolean | `false` | Invert brightness mapping |
| `minBrightness` | number | `0.05` | Minimum brightness threshold |

#### Returns

An object with methods:

- `resize(width?, height?)` - Update canvas size (defaults to window size)
- `dispose()` - Clean up and remove the animation

## Examples

### Basic Usage with Transparent Background

```javascript
import { startModelAnimation } from '@santiagocetran/ascii-3d-animation'

startModelAnimation({
  container: document.getElementById('hero'),
  modelUrl: '/models/router.stl'
})
```

### Custom Colors and Resolution

```javascript
startModelAnimation({
  container: document.getElementById('hero'),
  modelUrl: '/models/router.stl',
  effectOptions: {
    pixelSize: 2, // Higher resolution
    colors: ['#000000', '#1a1a2e', '#16213e', '#0f3460', '#533483'],
    backgroundColor: '#0a0a0a'
  }
})
```

### Retro Monochrome Style

```javascript
startModelAnimation({
  container: document.getElementById('hero'),
  modelUrl: '/models/router.stl',
  effectOptions: {
    pixelSize: 4,
    ditherType: 'bayer8x8',
    colors: ['#000000', '#00ff00'],
    backgroundColor: 'transparent'
  }
})
```

## Animation Behavior

The animation has three phases:

1. **Fade In** (2.5s) - Particles scatter in from random positions
2. **Show** (20s) - Model rotates and displays normally
3. **Fade Out** (2.5s) - Particles scatter out
4. Loops back to Fade In

## CSS Styling

The animation canvas fills its container. Style the container to position it:

```css
#animation-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1; /* Behind content */
  pointer-events: none; /* Allow clicks through */
}
```

## Browser Support

Works in all modern browsers that support:
- ES6 modules
- Canvas API
- WebGL

## Model Format

Currently supports **STL files**. Your 3D model will be:
- Automatically centered
- Scaled to fit the viewport
- Rotated for optimal viewing

## Development

To modify and test locally:

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build the library
npm run build:lib
```

## License

MIT

## Credits

Built with [Three.js](https://threejs.org/)
