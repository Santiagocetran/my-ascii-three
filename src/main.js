import * as THREE from 'three'
import './style.css'

// 1. SCENE - The container for everything
const scene = new THREE.Scene()

// 2. CAMERA - Your viewpoint
// PerspectiveCamera(fieldOfView, aspectRatio, nearClip, farClip)
const camera = new THREE.PerspectiveCamera(
  75,                                    // FOV in degrees (human eye is ~75)
  window.innerWidth / window.innerHeight, // Aspect ratio
  0.1,                                   // Near clipping plane
  1000                                   // Far clipping plane
)
camera.position.z = 5  // Move camera back so we can see the origin

// 3. RENDERER - Draws the scene
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)  // Add canvas to page

// 4. MESH = GEOMETRY + MATERIAL
const geometry = new THREE.BoxGeometry(1, 1, 1)  // A 1x1x1 cube
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })  // Green
const cube = new THREE.Mesh(geometry, material)
scene.add(cube)  // Add cube to the scene

// 5. ANIMATION LOOP
function animate() {
  // Rotate the cube a tiny bit each frame
  cube.rotation.x += 0.01
  cube.rotation.y += 0.01

  // Render the scene from the camera's perspective
  renderer.render(scene, camera)
}

// Start the loop (runs ~60 times per second)
renderer.setAnimationLoop(animate)