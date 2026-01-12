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

// 4. LIGHTING - Creates depth perception through brightness
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2)
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)

const backLight = new THREE.DirectionalLight(0xffffff, 0.4)
backLight.position.set(-3, -2, -5)
scene.add(backLight)

// 5. ASCII EFFECT with depth colors
const effect = new ColoredAsciiEffect(renderer, ' .:-=+*#%@', {
  invert: true,
  colors: ['#0d5164', '#c0c2ca', '#ffffff'] // blue (far/dark) -> grey -> white (close/bright)
})
effect.setSize(window.innerWidth, window.innerHeight)
effect.domElement.style.backgroundColor = '#0a0a0a'
document.body.appendChild(effect.domElement)

// 6. LOAD 3D MODEL
let model = null
let canSpin = false
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
  
  console.log('Model loaded! Size:', size, 'Scale applied:', scale)
  
  scene.add(model)
  
  // Start the scatter-to-form animation
  effect.startAnimation()
  
  // Start spinning after animation completes (2.5s animation + small buffer)
  setTimeout(() => {
    canSpin = true
  }, 2800)
})

// 7. ANIMATION LOOP
function animate() {
  // Spin the model after fade-in completes
  if (model && canSpin) {
    model.rotation.y += 0.008
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
