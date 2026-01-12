/**
 * Colored ASCII Effect - Maps brightness to depth colors
 * With scatter-to-form animation support
 * Based on Three.js AsciiEffect
 */
class ColoredAsciiEffect {
  constructor(renderer, charSet = ' .:-=+*#%@', options = {}) {
    const fResolution = options.resolution || 0.15
    const iScale = options.scale || 1
    const bInvert = options.invert || false
    const strResolution = options.strResolution || 'low'
    
    // Color palette for depth (dark to bright)
    const colors = options.colors || ['#0d5164', '#c0c2ca', '#ffffff']
    
    // Animation state
    let animationProgress = 0
    let isAnimating = false
    let animationStartTime = 0
    const animationDuration = 2500 // ms
    
    let width, height

    const domElement = document.createElement('div')
    domElement.style.cursor = 'default'

    const oAscii = document.createElement('table')
    domElement.appendChild(oAscii)

    let iWidth, iHeight
    let oImg

    this.setSize = function (w, h) {
      width = w
      height = h
      renderer.setSize(w, h)
      initAsciiSize()
    }

    this.render = function (scene, camera) {
      renderer.render(scene, camera)
      asciifyImage(oAscii)
    }
    
    // Start the scatter animation
    this.startAnimation = function() {
      isAnimating = true
      animationStartTime = performance.now()
      animationProgress = 0
    }
    
    // Check if animation is complete
    this.isAnimationComplete = function() {
      return animationProgress >= 1
    }

    this.domElement = domElement

    function initAsciiSize() {
      iWidth = Math.floor(width * fResolution)
      iHeight = Math.floor(height * fResolution)

      oCanvas.width = iWidth
      oCanvas.height = iHeight

      oImg = renderer.domElement

      oAscii.cellSpacing = '0'
      oAscii.cellPadding = '0'

      const oStyle = oAscii.style
      oStyle.whiteSpace = 'pre'
      oStyle.margin = '0px'
      oStyle.padding = '0px'
      oStyle.letterSpacing = fLetterSpacing + 'px'
      oStyle.fontFamily = strFont
      oStyle.fontSize = fFontSize + 'px'
      oStyle.lineHeight = fLineHeight + 'px'
      oStyle.textAlign = 'left'
      oStyle.textDecoration = 'none'
    }

    const strFont = 'courier new, monospace'
    const oCanvasImg = renderer.domElement
    const oCanvas = document.createElement('canvas')
    
    if (!oCanvas.getContext) return
    
    const oCtx = oCanvas.getContext('2d')
    if (!oCtx.getImageData) return

    const aCharList = charSet.split('')

    const fFontSize = (2 / fResolution) * iScale
    const fLineHeight = (2 / fResolution) * iScale

    let fLetterSpacing = 0

    if (strResolution === 'low') {
      switch (iScale) {
        case 1: fLetterSpacing = -1; break
        case 2:
        case 3: fLetterSpacing = -2.1; break
        case 4: fLetterSpacing = -3.1; break
        case 5: fLetterSpacing = -4.15; break
      }
    }

    if (strResolution === 'medium') {
      switch (iScale) {
        case 1: fLetterSpacing = 0; break
        case 2: fLetterSpacing = -1; break
        case 3: fLetterSpacing = -1.04; break
        case 4:
        case 5: fLetterSpacing = -2.1; break
      }
    }

    if (strResolution === 'high') {
      switch (iScale) {
        case 1:
        case 2: fLetterSpacing = 0; break
        case 3:
        case 4:
        case 5: fLetterSpacing = -1; break
      }
    }

    // Interpolate between colors based on brightness
    function getColorForBrightness(brightness) {
      if (brightness <= 0.5) {
        const t = brightness * 2
        return lerpColor(colors[0], colors[1], t)
      } else {
        const t = (brightness - 0.5) * 2
        return lerpColor(colors[1], colors[2], t)
      }
    }

    function lerpColor(color1, color2, t) {
      const r1 = parseInt(color1.slice(1, 3), 16)
      const g1 = parseInt(color1.slice(3, 5), 16)
      const b1 = parseInt(color1.slice(5, 7), 16)
      
      const r2 = parseInt(color2.slice(1, 3), 16)
      const g2 = parseInt(color2.slice(3, 5), 16)
      const b2 = parseInt(color2.slice(5, 7), 16)
      
      const r = Math.round(r1 + (r2 - r1) * t)
      const g = Math.round(g1 + (g2 - g1) * t)
      const b = Math.round(b1 + (b2 - b1) * t)
      
      return `rgb(${r},${g},${b})`
    }
    
    // Easing function for smooth animation
    function easeOutCubic(t) {
      return 1 - Math.pow(1 - t, 3)
    }
    
    // Seeded random for consistent random values per character position
    function seededRandom(seed) {
      const x = Math.sin(seed * 9999) * 10000
      return x - Math.floor(x)
    }

    function asciifyImage(oAscii) {
      oCtx.clearRect(0, 0, iWidth, iHeight)
      oCtx.drawImage(oCanvasImg, 0, 0, iWidth, iHeight)
      const oImgData = oCtx.getImageData(0, 0, iWidth, iHeight).data

      // Update animation progress
      if (isAnimating) {
        const elapsed = performance.now() - animationStartTime
        animationProgress = Math.min(elapsed / animationDuration, 1)
      }
      
      const easedProgress = easeOutCubic(animationProgress)

      let strChars = ''
      const maxIdx = aCharList.length - 1
      let charIndex = 0

      for (let y = 0; y < iHeight; y += 2) {
        for (let x = 0; x < iWidth; x++) {
          const iOffset = (y * iWidth + x) * 4

          const iRed = oImgData[iOffset]
          const iGreen = oImgData[iOffset + 1]
          const iBlue = oImgData[iOffset + 2]
          const iAlpha = oImgData[iOffset + 3]

          let fBrightness = (0.3 * iRed + 0.59 * iGreen + 0.11 * iBlue) / 255

          // Check if this is a "visible" character (part of the model, not background)
          const isVisible = iAlpha > 0 && fBrightness < 0.95

          if (iAlpha === 0) {
            fBrightness = 1
          }

          let iCharIdx = Math.round((1 - fBrightness) * maxIdx)

          if (bInvert) {
            iCharIdx = maxIdx - iCharIdx
          }

          let strThisChar = aCharList[iCharIdx]

          if (strThisChar === undefined || strThisChar === ' ') {
            strThisChar = '&nbsp;'
          }

          const colorBrightness = bInvert ? fBrightness : (1 - fBrightness)
          const color = getColorForBrightness(colorBrightness)

          // Apply scatter animation only to visible characters
          if (isAnimating && animationProgress < 1 && isVisible) {
            // Generate consistent random offset for this character
            const seed = charIndex * 0.1 + y * 0.01 + x * 0.001
            const randomX = (seededRandom(seed) - 0.5) * 800
            const randomY = (seededRandom(seed + 100) - 0.5) * 600
            const randomRotate = (seededRandom(seed + 200) - 0.5) * 720
            const randomScale = seededRandom(seed + 300) * 2
            
            // Interpolate from scattered to final position
            const currentX = randomX * (1 - easedProgress)
            const currentY = randomY * (1 - easedProgress)
            const currentRotate = randomRotate * (1 - easedProgress)
            const currentScale = randomScale + (1 - randomScale) * easedProgress
            const currentOpacity = easedProgress
            
            strChars += `<span style="color:${color};display:inline-block;transform:translate(${currentX}px,${currentY}px) rotate(${currentRotate}deg) scale(${currentScale});opacity:${currentOpacity}">${strThisChar}</span>`
          } else {
            strChars += `<span style="color:${color}">${strThisChar}</span>`
          }
          
          charIndex++
        }

        strChars += '<br/>'
      }

      oAscii.innerHTML = `<tr><td style="display:block;width:${width}px;height:${height}px;overflow:hidden">${strChars}</td></tr>`
    }
  }
}

export { ColoredAsciiEffect }
