import * as THREE from 'three'
import { ContactMaterial, Material, Vec3, World, NaiveBroadphase, Plane, Body, Sphere, Cylinder, Box } from 'cannon'
import * as io from 'socket.io-client'
import { getType, getRoomId } from '../util/url-extractor'
import { random } from '../util/math'
import $ from '../util/dom'
import addSky from './sky'

let playerCount = 0
const controllers = {}

const socket = io('/')
const rng = random.bind(null, -3, 3)

socket.emit('init', {
  type: getType(),
  roomId: getRoomId()
})

// Cannon setup
const timestep = 1 / 60
const world = new World()
world.gravity.set(0, -9.81, 0)
world.bradphase = new NaiveBroadphase()
world.solver.iterations = 10

const groundMaterial = new Material('groundMaterial')
const sphereMaterial = new Material('sphereMaterial')

const ground_sphere_cm = new ContactMaterial(groundMaterial, sphereMaterial, {
  friction: 0.3,
  restitution: 0.3,
  contactEquationStiffness: 1e8,
  contactEquationRelaxation: 3,
  frictionEquationStiffness: 1e8,
  frictionEquationRegularizationTime: 3
})
const sphere_sphere_cm = new ContactMaterial(sphereMaterial, sphereMaterial, {
	friction: 0.3,
	restitution: 0.6,
})
world.addContactMaterial(ground_sphere_cm)
world.addContactMaterial(sphere_sphere_cm)

const stageRadius = 7
const stageHeight = 0.25

const stageShape = new Cylinder(stageRadius, stageRadius, stageHeight, 32)
const stageBody = new Body({mass: 0, material: groundMaterial})
stageBody.addShape(stageShape)
stageBody.quaternion.setFromAxisAngle(new Vec3(1, 0, 0), Math.PI / 2)
world.add(stageBody)

// Three.js setup
const ambLight = new THREE.AmbientLight(0xaaaaaa, 0.5)
const pointLight = new THREE.PointLight(0xff0000, 1, 100)
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000000)
const renderer = new THREE.WebGLRenderer()

pointLight.position.set(0, 2, -5)
scene.background = new THREE.Color(0x6aa2fc)
scene.add(ambLight)
scene.add(pointLight)
addSky(scene)

const stageGeometry = new THREE.CylinderGeometry(stageRadius, stageRadius, 0.25, 32)
const stageMaterial = new THREE.MeshLambertMaterial({color: 0xffff00})

for (var i = 0; i < Object.keys(stageGeometry.faces).length; i++) {
  if (stageGeometry.faces[i].normal.y != 0) {
    stageGeometry.faces[i].color.set(0x00ff00)
  }
}
stageMaterial.vertexColors = THREE.FaceColors
const stage = new THREE.Mesh(stageGeometry, stageMaterial)
scene.add(stage)

//Lights
var hemiLight = new THREE.HemisphereLight(0xffffff,0xffffff, 0.6)
hemiLight.color.setHSL(0.6,1,0.6)
hemiLight.groundColor.setHSL(0.095,1,0.75)
hemiLight.position.set(0,50,0)
scene.add(hemiLight)

camera.position.z = 15
camera.position.y = 3
renderer.setSize(window.innerWidth, window.innerHeight)

function updatePhysics () {
  world.step(timestep)
  for (let key in controllers) {
    if (controllers.hasOwnProperty(key)) {
      const sphere = controllers[key].mesh
      const sphereBody = controllers[key].body
      sphere.position.copy(sphereBody.position)
      sphere.quaternion.copy(sphereBody.quaternion)
    }
  }
}

function checkGameWin () {
  for (var key in controllers) {
    if (controllers.hasOwnProperty(key)) {
			const sphereBody = controllers[key].body
			if (sphereBody.position.y < -20 && controllers[key].isAlive){
				playerCount--;
				controllers[key].isAlive = false
			}
		}
	}
	if(playerCount <= 1){
		cancelAnimationFrame(animateReq)
		var winningPlayerName = null
		for (var key in controllers) {
			if (controllers.hasOwnProperty(key)) {
				if (controllers[key].isAlive){
					winningPlayerName = controllers[key].name
					break
				}
			}
		}
		if (winningPlayerName){
			$('#winBannerHeader').innerHTML = `${winningPlayerName} wins!`
		}
		$('#winBanner').classList.remove('hide')
	}
}

var animateReq;
function animate () {
  animateReq = requestAnimationFrame(animate)
  updatePhysics()
	checkGameWin()
  renderer.render(scene, camera)
}


const startLocations = [[2, 2],[2, -2],[-2, 2],[-2, -2]]
socket.on('join', (data) => {
  const $p = document.createElement('p')
  $p.innerHTML = `${data.name} has joined!`
  $p.style.color = data.color
  $('#entry').appendChild($p)

  playerCount++
  if (playerCount >= 2) {
    $('#start').classList.remove('disabled')
    $('#start').disabled = false
    $('#msg').innerHTML = `${4 - playerCount} spots left`
  }

  const size = 0.5

  // Cannon object
  const sphereShape = new Sphere(size)
  const sphereBody = new Body({mass: 1, material: sphereMaterial})
  sphereBody.addShape(sphereShape)
  world.add(sphereBody)

  // Three.js object
  const geometry = new THREE.SphereGeometry(size)
  const material = new THREE.MeshStandardMaterial({ color: data.color })
  const sphere = new THREE.Mesh(geometry, material)

  sphere.position.set(startLocations[playerCount-1][0], size, startLocations[playerCount-1][1])
  sphereBody.position.copy(sphere.position)

  scene.add(sphere)

  controllers[data.id] = {
    mesh: sphere,
    body: sphereBody,
		isAlive: true,
		name: data.name,
  }
})

socket.on('data', (data) => {
  const magnitude = 0.07

  const sphereBody = controllers[data.id].body

  const alpha = data.alpha
  const betaAbs = Math.abs(data.beta)
  const gammaAbs = Math.abs(data.gamma)

  const a = 1 / Math.tan(gammaAbs)
  const b = 1 / Math.tan(betaAbs)
  if (a == Infinity || b == Infinity) {
		  return
 	}
  const c = Math.sqrt(a * a + b * b)
  const d = (a * b) / c
  const theta = Math.atan(1 / d)
  const phi = Math.acos(d / a)

  var offset = data.gamma > 0 ? -Math.PI / 2 : Math.PI / 2
  var direction = (data.beta > 0 && data.gamma < 0) || (data.beta < 0 && data.gamma > 0) ? 1 : -1

  const rotation = alpha + offset + (direction * phi)
  const actualAngle = rotation + (Math.PI / 2)

  sphereBody.applyImpulse(new Vec3(magnitude * Math.cos(actualAngle), 0, -magnitude * Math.sin(actualAngle)), sphereBody.position)
})

console.log(`I am the host! ${getRoomId()}`)

$('#room-id').innerHTML = `Invite code: ${getRoomId()}`

$('#play-game').addEventListener('submit', (e) => {
  e.preventDefault()
  document.body.appendChild(renderer.domElement)
  $('#dom').classList.add('hide')
  animate()
})
