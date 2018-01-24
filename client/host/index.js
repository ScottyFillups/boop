import * as THREE from 'three'
import * as io from 'socket.io-client'
import { getType, getRoomId } from '../util/url-extractor'
import { random } from '../util/math'

const controllers = {}

const socket = io('/')
const rng = random.bind(null, -3, 3)

socket.emit('init', {
  type: getType(),
  roomId: getRoomId()
})

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
const renderer = new THREE.WebGLRenderer()

camera.position.z = 10
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

function animate () {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
}

animate()


socket.on('join', (id) => {
  const geometry = new THREE.BoxGeometry(1,1,1)
  const material = new THREE.MeshNormalMaterial()
  const cube = new THREE.Mesh(geometry, material)

  cube.position.set(rng(),rng(),rng())

  scene.add(cube)

  controllers[id] = {
    mesh: cube
  }
})

socket.on('data', (data) => {
  const cube = controllers[data.id].mesh

  console.log(data.beta, data.gamma, data.alpha)
  cube.rotation.x = data.beta
  cube.rotation.y = data.gamma
  cube.rotation.z = data.alpha
})

console.log(`I am the host! ${getRoomId()}`)
