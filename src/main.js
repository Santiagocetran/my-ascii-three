import * as THREE from 'three'
import { AsciiEffect } from 'three/addons/effects/AsciiEffect.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
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
camera.position.z = 5

// 3. RENDERER - Draws the scene
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)

// 4. ASCII EFFECT
const effect = new AsciiEffect(renderer, ' .:-=+*#%@', { invert: true })
effect.setSize(window.innerWidth, window.innerHeight)
effect.domElement.style.color = 'white'
effect.domElement.style.backgroundColor = 'black'
document.body.appendChild(effect.domElement)

// 5. LOAD 3D MODEL
let model = null
const loader = new GLTFLoader()

loader.load('/router-prueba.glb', (gltf) => {
  model = gltf.scene
  
  // Override materials to white so it shows up in ASCII
  model.traverse((child) => {
    if (child.isMesh) {
      child.material = new THREE.MeshBasicMaterial({ color: 0xffffff })
    }
  })
  
  // Auto-center and scale the model
  const box = new THREE.Box3().setFromObject(model)
  const center = box.getCenter(new THREE.Vector3())
  const size = box.getSize(new THREE.Vector3())
  
  // Center the model at origin
  model.position.sub(center)
  
  // Scale to fit nicely (target size ~3 units)
  const maxDim = Math.max(size.x, size.y, size.z)
  const scale = 3 / maxDim
  model.scale.setScalar(scale)
  
  console.log('Model loaded! Size:', size, 'Scale applied:', scale)
  
  scene.add(model)
})

// 6. ANIMATION LOOP
function animate() {
  if (model) {
    model.rotation.y += 0.01
  }

  effect.render(scene, camera)
}

renderer.setAnimationLoop(animate)
