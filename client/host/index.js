import * as THREE from 'three'
import { ContactMaterial, Material, Vec3, World, NaiveBroadphase, Plane, Body, Sphere, Cylinder } from 'cannon'
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

// Cannon setup
const timestep = 1/60
const world = new World()
world.gravity.set(0,-9.81,0)
world.bradphase = new NaiveBroadphase()
world.solver.iterations = 10

const groundMaterial = new Material('groundMaterial')
const ground_ground_cm = new ContactMaterial(groundMaterial, groundMaterial, {
  friction: 0.3,
  restitution: 0.3,
  contactEquationStiffness: 1e8,
  contactEquationRelaxation: 3,
  frictionEquationStiffness: 1e8,
  frictionEquationRegularizationTime: 3,
});
world.addContactMaterial(ground_ground_cm)

const stageRadius = 4
const stageHeight = 0.25

const stageShape = new Cylinder(stageRadius, stageRadius, stageHeight, 32)
const stageBody = new Body({mass: 0, material: groundMaterial})
stageBody.addShape(stageShape)
world.add(stageBody)

// Three.js setup
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
const renderer = new THREE.WebGLRenderer()

//Set up stage object
const stageGeometry = new THREE.CylinderGeometry(4, 4, 0.25, 32)
const stageMaterial = new THREE.MeshBasicMaterial({color: 0xffff00})

for (var i = 0; i < Object.keys(stageGeometry.faces).length; i++){
	if (stageGeometry.faces[i].normal.y != 0){
		stageGeometry.faces[i].color.set(0x00ff00)
	}
}
stageMaterial.vertexColors = THREE.FaceColors
const stage = new THREE.Mesh(stageGeometry, stageMaterial)
scene.add(stage)

camera.position.z = 10
camera.position.y = 3
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
