import * as THREE from 'three'
import { ColoredAsciiEffect } from './ColoredAsciiEffect.js'
import { STLLoader } from 'three/addons/loaders/STLLoader.js'
import './style.css'

// 1. SCENE - The container for everything
const scene = new THREE.Scene()

// 2. CAMERA - Your viewpoint
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)
camera.position.set(0, 0.5, 5)
camera.lookAt(0, 0, 0)

// 3. RENDERER - Draws the scene
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)

// 4. LIGHTING - Dramatic setup for strong depth perception
// Low ambient for dark shadows
const ambientLight = new THREE.AmbientLight(0xffffff, 0.15)
scene.add(ambientLight)

// Strong key light from front-right-top
const keyLight = new THREE.DirectionalLight(0xffffff, 1.5)
keyLight.position.set(3, 4, 5)
scene.add(keyLight)

// Fill light from left (softer)
const fillLight = new THREE.DirectionalLight(0xffffff, 0.4)
fillLight.position.set(-4, 2, 3)
scene.add(fillLight)

// Rim light from behind to define edges
const rimLight = new THREE.DirectionalLight(0xffffff, 0.8)
rimLight.position.set(0, 2, -5)
scene.add(rimLight)

// 5. ASCII EFFECT with depth colors
// Extended character set ordered by visual density (light to heavy) for better quality
// More characters = more brightness levels = better detail
const effect = new ColoredAsciiEffect(renderer, ' .\'`^",:;Il!i><~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$', {
  invert: true,
  resolution: 0.2, // Increased from 0.15 for better detail
  colors: ['#0d5164', '#4a8a9c', '#c0c2ca', '#e8e8e8', '#ffffff'] // blue -> teal -> grey -> light -> white
})
effect.setSize(window.innerWidth, window.innerHeight)
effect.domElement.style.backgroundColor = '#0a0a0a'
document.body.appendChild(effect.domElement)

// 6. LOAD 3D MODEL
let model = null
let modelGroup = null
const loader = new STLLoader()

loader.load('/sai-prueba-pagina.stl', (geometry) => {
  // STL loader returns geometry directly, create a mesh from it
  const material = new THREE.MeshStandardMaterial({ 
    color: 0xffffff,
    roughness: 0.5,
    metalness: 0.1
  })
  model = new THREE.Mesh(geometry, material)
  
  // Auto-center and scale the model
  geometry.computeBoundingBox()
  const box = geometry.boundingBox
  const center = box.getCenter(new THREE.Vector3())
  const size = box.getSize(new THREE.Vector3())
  
  // Center the geometry
  geometry.center()
  
  // Scale to fit nicely (target size ~3 units)
  const maxDim = Math.max(size.x, size.y, size.z)
  const scale = 3 / maxDim
  model.scale.setScalar(scale)
  
  // Rotate 90 degrees on X axis
  model.rotation.x = -Math.PI / 2
  
  // Wrap in group for clean Y-axis spinning
  modelGroup = new THREE.Group()
  modelGroup.add(model)
  
  console.log('Model loaded! Size:', size, 'Scale applied:', scale)
  
  scene.add(modelGroup)
  
  // Start the scatter-to-form animation
  effect.startAnimation('fadeIn')
})

// 7. ANIMATION LOOP
let time = 0
let showPhaseStartTime = 0
const animationDuration = 2500 // ms - must match ColoredAsciiEffect
const showPhaseDuration = 5000 // ms - how long to show the model rotating (increased for better viewing)

function animate() {
  // Handle ASCII animation loop (fade in -> show -> fade out -> repeat)
  const currentPhase = effect.getAnimationPhase()
  const now = performance.now()
  
  if (currentPhase === 'fadeIn' && effect.isAnimationComplete()) {
    // Fade in complete, start show phase with rotation
    effect.startAnimation('show')
    showPhaseStartTime = now
  } else if (currentPhase === 'show') {
    // Check if show phase duration has elapsed
    if (now - showPhaseStartTime >= showPhaseDuration) {
      // Show phase complete, start fade out
      effect.startAnimation('fadeOut')
    }
  } else if (currentPhase === 'fadeOut' && effect.isAnimationComplete()) {
    // Fade out complete, restart fade in
    effect.startAnimation('fadeIn')
  }
  
  // Rotate model only during show phase
  if (modelGroup && currentPhase === 'show') {
    time += 0.015
    
    // Continuous Y rotation to show all sides
    modelGroup.rotation.y += 0.006
    
    // Gentle oscillating tilt to show depth (not full spin)
    modelGroup.rotation.x = Math.sin(time * 0.5) * 0.15  // ±8.5° tilt
    modelGroup.rotation.z = Math.sin(time * 0.3) * 0.08  // ±4.5° roll
  }
  
  effect.render(scene, camera)
}

renderer.setAnimationLoop(animate)

// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  effect.setSize(window.innerWidth, window.innerHeight)
})
