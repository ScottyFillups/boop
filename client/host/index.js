import * as THREE from 'three'
import * as io from 'socket.io-client'
import { getType, getRoomId } from '../util/url-extractor'

const socket = io('/')

socket.emit('init', {
  type: getType(),
  roomId: getRoomId()
})

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
const renderer = new THREE.WebGLRenderer()

renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const geometry = new THREE.BoxGeometry(2, 2, 2)
const material = new THREE.MeshNormalMaterial()
const cube = new THREE.Mesh(geometry, material)

scene.add(cube)
camera.position.z = 5

function animate() {
    requestAnimationFrame(animate)
    renderer.render(scene, camera)
}

animate()


socket.on('data', (data) => {
  console.log(data.beta, data.gamma, data.alpha)
  cube.rotation.x = data.beta
  cube.rotation.y = data.gamma
  cube.rotation.z = data.alpha
})

console.log(`I am the host! ${getRoomId()}`)
