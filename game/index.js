const randomColor = require('randomcolor')

function gamify (io, redisClient) {
  const maxConnections = 5

  io.on('connection', (socket) => {
    socket.on('init', (data) => {
      let hostId
      const { roomId, type, name } = data

      socket.join(roomId)
      clientType = type

      if (type === 'host') {
        redisClient.set(roomId, JSON.stringify({
          id: socket.id,
          locked: false,
          count: 1
        }))

        socket.on('disconnect', () => {
          redisClient.set(roomId, '')
          io.to(roomId).emit('die')
        })

        socket.on('lock', () => {
          redisClient.get(roomId, (err, reply) => {
            redisClient.set(roomId, JSON.stringify(Object.assign(JSON.parse(reply), { locked: true })))
          })
        })
      } else {
        redisClient.get(roomId, (err, reply) => {
          console.log(reply)
          const obj = JSON.parse(reply)

          if (err) throw err

          if (!obj) {
            console.log('room does not exist')
            return
          }

          if (obj.count >= maxConnections || obj.locked) {
            console.log('no join emitted')
            redisClient.set(roomId, JSON.stringify(Object.assign(obj, { locked: true })))
            return
          }

          if (reply !== '' && io.sockets.sockets[obj.id]) {
            const color = randomColor()

            redisClient.set(roomId, JSON.stringify(Object.assign(obj, {
              count: obj.count + 1
            })))
            hostId = obj.id
            io.sockets.sockets[hostId].emit('join', {
              id: socket.id,
              name: name,
              color: color
            })
            socket.emit('color', color)
          }
        })

        socket.on('data', (data) => {
          if (hostId && io.sockets.sockets[hostId]) {
            io.sockets.sockets[hostId].emit('data', Object.assign(data, { id: socket.id }))
          }
        })
        socket.on('die', () => {
          hostId = undefined
        })
      }
    })
  })
}

module.exports = gamify
