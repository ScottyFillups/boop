function gamify (io, redisClient) {
  io.on('connection', (socket) => {
    socket.on('init', (data) => {
      let hostId
      const { roomId, type } = data

      socket.join(roomId)
      clientType = type

      if (type === 'host') {
        redisClient.set(roomId, socket.id)

        socket.on('disconnect', () => {
          redisClient.set(roomId, '')
          io.to(roomId).emit('die')
        })
      } else {
        redisClient.get(roomId, (err, reply) => {
          if (err) throw err
          hostId = reply
        })

        socket.on('data', (data) => {
          if (hostId && io.sockets.sockets[hostId]) {
            io.sockets.sockets[hostId].emit('data', data)
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
