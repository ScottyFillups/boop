import * as io from 'socket.io-client'
import { getType, getRoomId } from '../util/url-extractor'

const socket = io('/')

socket.emit('init', {
  type: getType(),
  roomId: getRoomId()
})

socket.on('data', (data) => {
  console.log(data)
})

console.log(`I am the host! ${getRoomId()}`)
