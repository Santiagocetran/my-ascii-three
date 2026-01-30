import * as THREE from 'three'
import { STLLoader } from 'three/addons/loaders/STLLoader.js'
import { BitmapEffect } from '../effects/BitmapEffect.js'

const DEFAULT_EFFECT_OPTIONS = {
  pixelSize: 3,
  ditherType: 'bayer4x4',
  colors: ['#021a15', '#053a2a', '#074434', '#0a5845', '#1a7a5e', '#4d9977', '#ABC685', '#E8FF99', '#F7F9CE', '#FFF6E7'],
  backgroundColor: '#0a0a0a',
  invert: false
}

export function startModelAnimation({
  container = document.body,
  modelUrl = '/sai-prueba-pagina.stl',
  effectOptions = {}
} = {}) {
  const scene = new THREE.Scene()

  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  )
  camera.position.set(0, 0.5, 5)
  camera.lookAt(0, 0, 0)

  const renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))

  const mergedEffectOptions = {
    ...DEFAULT_EFFECT_OPTIONS,
    minBrightness: 0.05,
    ...effectOptions
  }
  scene.background = new THREE.Color(mergedEffectOptions.backgroundColor)
  const effect = new BitmapEffect(renderer, mergedEffectOptions)
  effect.setSize(window.innerWidth, window.innerHeight)
  effect.domElement.style.backgroundColor = mergedEffectOptions.backgroundColor
  container.appendChild(effect.domElement)

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.15)
  scene.add(ambientLight)

  const keyLight = new THREE.DirectionalLight(0xffffff, 1.5)
  keyLight.position.set(3, 4, 5)
  scene.add(keyLight)

  const fillLight = new THREE.DirectionalLight(0xffffff, 0.4)
  fillLight.position.set(-4, 2, 3)
  scene.add(fillLight)

  const rimLight = new THREE.DirectionalLight(0xffffff, 0.8)
  rimLight.position.set(0, 2, -5)
  scene.add(rimLight)

  let modelGroup = null
  const loader = new STLLoader()

  loader.load(modelUrl, (geometry) => {
    const material = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.5,
      metalness: 0.1
    })
    const model = new THREE.Mesh(geometry, material)

    geometry.computeBoundingBox()
    const box = geometry.boundingBox
    const size = box.getSize(new THREE.Vector3())

    geometry.center()

    const maxDim = Math.max(size.x, size.y, size.z)
    const scale = 3 / maxDim
    model.scale.setScalar(scale)
    model.rotation.x = -Math.PI / 2

    modelGroup = new THREE.Group()
    modelGroup.add(model)
    scene.add(modelGroup)

    effect.startAnimation('fadeIn')
  })

  let time = 0
  let showPhaseStartTime = 0
  const showPhaseDuration = 20000

  function animate() {
    const currentPhase = effect.getAnimationPhase()
    const now = performance.now()

    if (currentPhase === 'fadeIn' && effect.isAnimationComplete()) {
      effect.startAnimation('show')
      showPhaseStartTime = now
    } else if (currentPhase === 'show') {
      if (now - showPhaseStartTime >= showPhaseDuration) {
        effect.startAnimation('fadeOut')
      }
    } else if (currentPhase === 'fadeOut' && effect.isAnimationComplete()) {
      effect.startAnimation('fadeIn')
    }

    if (modelGroup && currentPhase === 'show') {
      time += 0.015
      modelGroup.rotation.y += 0.006
      modelGroup.rotation.x = Math.sin(time * 0.5) * 0.15
      modelGroup.rotation.z = Math.sin(time * 0.3) * 0.08
    }

    effect.render(scene, camera)
  }

  renderer.setAnimationLoop(animate)

  function resize(width = window.innerWidth, height = window.innerHeight) {
    camera.aspect = width / height
    camera.updateProjectionMatrix()
    effect.setSize(width, height)
  }

  function dispose() {
    renderer.setAnimationLoop(null)
    renderer.dispose()
    if (effect.domElement.parentNode) {
      effect.domElement.parentNode.removeChild(effect.domElement)
    }
  }

  return { resize, dispose }
}
