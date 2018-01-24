import * as io from 'socket.io-client'
import { GyroNorm } from '../vendor/gyronorm.complete.min'
import { getType, getRoomId } from '../util/url-extractor'
import { toRadians } from '../util/math'

const socket = io('/')
const gn = new GyroNorm()

socket.emit('init', {
  type: getType(),
  roomId: getRoomId()
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

console.log(`I am the controller! ${getRoomId()}`)
