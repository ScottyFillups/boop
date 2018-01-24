function gamify (io, redisClient) {
  io.on('connection', (socket) => {
    let hostId

    socket.on('init', (data) => {
      const { roomId, type } = data
      socket.join(roomId)

      if (type === 'host') {
        console.log(`host: ${socket.id}`)
        redisClient.set(roomId, socket.id) 
      } else {
        redisClient.get(roomId, (err, reply) => {
          hostId = reply
        })
      }
    })
    socket.on('data', (data) => {
      console.log(`Received ${data}`) 
      if (hostId) {
        console.log(`This was sent to host, ${hostId}`)
        //console.log(io.sockets.sockets)
        io.sockets.sockets[hostId].emit('data', data)
      }
    })
  })
}

module.exports = gamify
