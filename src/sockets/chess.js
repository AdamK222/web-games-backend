import mongoose from 'mongoose'
import { Chess } from 'chess.js'

import { ChessRoom, validateMove } from '../models/rooms/Chess'
import { decodeToken } from '../middleware/auth'

export default (io) => {

  io.on('connection', (socket) => {
    socket.on('join-room-chess', (id) => {
      console.log(`${socket.id} joined chess room ${id}`)
      socket.join(`chess-${id}`)
    })

    socket.on('leave-room-chess', (id) => {
      console.log(`${socket.id} left chess room ${id}`)
      socket.leave(`chess-${id}`)
    })

    socket.on('update-board', async ({authToken, id, move}, cb) => {
      const { error } = validateMove(move)
      if (error) return cb(error.details[0].message)

      const user = decodeToken(authToken)
      if (!user) return cb('Invalid token.')

      let room = await ChessRoom.findById(id)
      if (!room) return cb('That room does not exist.')

      const chess = new Chess(room.fen)
      // Checking for valid user calling this endpoint
      if (user._id !== room.player1._id.toString() && user._id !== room.player2._id.toString())
        return cb('You cannot make moves in this game.')

      let currentPlayerColor = user._id===room.player1._id.toString() ? room.player1.color : room.player2.color
      if (user._id !== room.player1._id.toString() || user._id !== room.player2._id.toString()) {
        if (currentPlayerColor !== chess.turn()) return cb('It is not your turn.')
      }

      const result = chess.move(move)
      if (!result) return cb('Incorrect move.')

      const fen = chess.fen()
      room = await ChessRoom.findByIdAndUpdate(id, { fen, $push: {moves: result}}, {new: true})
      if (!room) return cb('Cannot update room fen.')

      io.to(`chess-${id}`).emit('board', {fen, move: result})
      cb('')
    })

    socket.on('disconnect', () => {
      console.log(`${socket.id} left`)
    })
  })
}