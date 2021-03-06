import * as io from 'socket.io-client'
import { GyroNorm } from '../vendor/gyronorm.complete.min'
import { getType, getRoomId } from '../util/url-extractor'
import { toRadians } from '../util/math'
import $ from '../util/dom'

const socket = io('/')
const gn = new GyroNorm()

$('#name-form').addEventListener('submit', (e) => {
  e.preventDefault()

  console.log('hi')

  const name = $('#name').value || 'Anonymous'

  socket.emit('init', {
    type: getType(),
    roomId: getRoomId(),
    name: name
  })

  socket.on('color', (color) => {
    document.body.style.backgroundColor = color
  })

  socket.on('die', () => {
    socket.emit('die')
  })

  gn.init().then(function () {
    gn.start((data) => {
      for (let key in data.do) {
        if (data.do.hasOwnProperty(key)) {
          data.do[key] = toRadians(data.do[key])
        }
      }
      socket.emit('data', data.do)
    })
  })

  $('#dom').classList.add('hide')
})

console.log(`I am the controller! ${getRoomId()}`)
