import * as io from 'socket.io-client'
import { getType, getRoomId } from '../util/url-extractor'

const socket = io('/')

socket.emit('init', {
  type: getType(),
  roomId: getRoomId()
})

setInterval(function () {
  socket.emit('data', 'ping!')
}, 1000)

console.log(`I am the controller! ${getRoomId()}`)
