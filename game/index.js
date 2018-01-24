function gamify (io, redisClient) {
  io.on('connection', (socket) => {
    let hostId

    socket.on('init', (data) => {
      const { roomId, type } = data
      socket.join(roomId)

      console.log('init called')
      if (type === 'host') {
        redisClient.set(roomId, socket.id)
      } else {
        redisClient.get(roomId, (err, reply) => {
          if (err) throw err
          hostId = reply
        })
      }
    })
    socket.on('data', (data) => {
      if (hostId) {
        io.sockets.sockets[hostId].emit('data', data)
      }
    })
  })
}

module.exports = gamify
