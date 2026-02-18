# Example Usage in Your Website

After publishing and installing the package, here's how to integrate it into your website:

## HTML Setup

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Website with ASCII 3D Animation</title>
  <style>
    body {
      margin: 0;
      font-family: system-ui, -apple-system, sans-serif;
      min-height: 100vh;
      position: relative;
    }

    /* Container for the 3D animation background */
    #animation-bg {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      pointer-events: none;
    }

    /* Your website content */
    .content {
      position: relative;
      z-index: 1;
      padding: 4rem 2rem;
      max-width: 800px;
      margin: 0 auto;
      color: #E8FF99;
    }

    h1 {
      font-size: 3rem;
      margin-bottom: 1rem;
    }
  </style>
</head>
<body>
  <!-- Background animation container -->
  <div id="animation-bg"></div>

  <!-- Your website content -->
  <div class="content">
    <h1>Welcome to My Website</h1>
    <p>This cool 3D ASCII animation runs in the background!</p>
  </div>

  <script type="module">
    import { startModelAnimation } from '@your-username/ascii-3d-animation'

    const controller = startModelAnimation({
      container: document.getElementById('animation-bg'),
      modelUrl: '/models/your-model.stl'
    })

    window.addEventListener('resize', () => {
      controller.resize()
    })
  </script>
</body>
</html>
```

## React Example

```jsx
import { useEffect, useRef } from 'react'
import { startModelAnimation } from '@your-username/ascii-3d-animation'

export function AnimatedBackground() {
  const containerRef = useRef(null)
  const controllerRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Start the animation
    controllerRef.current = startModelAnimation({
      container: containerRef.current,
      modelUrl: '/models/your-model.stl'
    })

    // Handle resize
    const handleResize = () => {
      controllerRef.current?.resize()
    }
    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
      controllerRef.current?.dispose()
    }
  }, [])

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        pointerEvents: 'none'
      }}
    />
  )
}

// Use in your app
function App() {
  return (
    <>
      <AnimatedBackground />
      <div className="content">
        <h1>My App</h1>
        <p>Content goes here...</p>
      </div>
    </>
  )
}
```

## Vue Example

```vue
<template>
  <div>
    <div ref="animationContainer" class="animation-bg"></div>
    <div class="content">
      <h1>My Vue App</h1>
      <p>Content goes here...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { startModelAnimation } from '@your-username/ascii-3d-animation'

const animationContainer = ref(null)
let controller = null

onMounted(() => {
  controller = startModelAnimation({
    container: animationContainer.value,
    modelUrl: '/models/your-model.stl'
  })

  const handleResize = () => {
    controller?.resize()
  }
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  controller?.dispose()
})
</script>

<style scoped>
.animation-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  pointer-events: none;
}

.content {
  position: relative;
  z-index: 1;
  padding: 4rem 2rem;
}
</style>
```

## Customization Examples

### Different Color Schemes

```javascript
// Cyberpunk theme
startModelAnimation({
  container: document.getElementById('animation-bg'),
  modelUrl: '/model.stl',
  effectOptions: {
    colors: ['#0a0a0a', '#1a1a2e', '#16213e', '#0f3460', '#533483', '#e94560'],
    pixelSize: 4
  }
})

// Ocean theme
startModelAnimation({
  container: document.getElementById('animation-bg'),
  modelUrl: '/model.stl',
  effectOptions: {
    colors: ['#001f3f', '#003366', '#004080', '#0059b3', '#0073e6', '#1a8cff'],
    pixelSize: 3
  }
})

// Monochrome
startModelAnimation({
  container: document.getElementById('animation-bg'),
  modelUrl: '/model.stl',
  effectOptions: {
    colors: ['#000000', '#ffffff'],
    pixelSize: 5,
    ditherType: 'bayer8x8'
  }
})
```

### Positioning Variations

```css
/* Top half only */
#animation-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 50%;
  z-index: -1;
}

/* Sidebar */
#animation-bg {
  position: fixed;
  top: 0;
  right: 0;
  width: 40%;
  height: 100%;
  z-index: -1;
}

/* Full screen with overlay */
#animation-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  opacity: 0.3;
}
```

## Tips

1. **Model Size**: Keep STL files under 5MB for better performance
2. **Colors**: Use 5-10 colors for smooth gradients
3. **Pixel Size**: Lower values (2-3) = more detail, higher CPU usage
4. **Z-Index**: Set to -1 for background, or layer with opacity
5. **Performance**: Use `pixelSize: 4-6` on mobile devices

## Troubleshooting

**Animation not visible?**
- Check z-index values
- Verify container has width/height
- Check model path is correct
- Open browser console for errors

**Performance issues?**
- Increase pixelSize
- Reduce color array length
- Check model polygon count

**Transparent background not working?**
- Make sure you set `backgroundColor: 'transparent'`
- Check parent container background
