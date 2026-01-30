import './style.css'
import { startModelAnimation } from './animations/modelAnimation.js'

const controller = startModelAnimation()

window.addEventListener('resize', () => {
  if (controller && controller.resize) {
    controller.resize()
  }
})
