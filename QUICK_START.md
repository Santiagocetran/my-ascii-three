# Quick Start Guide

## 📦 Publish Your Package (3 Steps)

### 1. Update Package Name
Edit `package.json`:
```json
"name": "@your-npm-username/ascii-3d-animation"
```

### 2. Build & Publish
```bash
npm run build:lib
npm login
npm publish --access public
```

### 3. Done!
Your package is live at: `https://npmjs.com/package/@your-username/ascii-3d-animation`

---

## 🚀 Use in Your Website

### Install
```bash
npm install @your-username/ascii-3d-animation three
```

### Use
```javascript
import { startModelAnimation } from '@your-username/ascii-3d-animation'

startModelAnimation({
  container: document.getElementById('hero'),
  modelUrl: '/your-model.stl'
})
```

---

## 🔄 Update Your Package

### Make Changes & Republish
```bash
# 1. Edit files in src/
# 2. Update version in package.json (e.g., 1.0.0 → 1.0.1)
# 3. Build and publish:
npm run build:lib
npm publish --access public
```

### Update in Your Website
```bash
npm update @your-username/ascii-3d-animation
```

---

## 🎨 Customize

```javascript
startModelAnimation({
  container: document.getElementById('hero'),
  modelUrl: '/model.stl',
  effectOptions: {
    pixelSize: 3,
    colors: ['#000', '#00ff00', '#ffffff'],
    backgroundColor: 'transparent'
  }
})
```

---

## 📚 Full Documentation

- `SETUP_COMPLETE.md` - Complete overview
- `PUBLISHING.md` - Detailed publishing guide
- `EXAMPLE_USAGE.md` - React, Vue, vanilla JS examples
- `README.md` - API documentation

---

## ✅ What's Already Done

- ✨ Transparent background (default)
- 📦 Package configured for npm
- 🔧 Build system ready
- 📝 Documentation complete
- 🎯 Higher resolution (pixelSize: 3)
- 🌈 Enhanced depth colors (10 colors)
- ⏱️ Longer animation (20 seconds)

**You're ready to publish!** 🎉
