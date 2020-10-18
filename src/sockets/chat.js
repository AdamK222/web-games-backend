import mongoose from 'mongoose'

import { ChatMsg, validate } from '../models/Chat' 

const global_chat_name = 'global'

export default (io) => {

  io.on('connection', (socket) => {
    socket.on('join-chat', () => {
      console.log(`${socket.id} joined chat ${global_chat_name}`)
      socket.join(global_chat_name)
    })

    socket.on('leave-chat', () => {
      console.log(`${socket.id} left chat ${global_chat_name}`)
      socket.leave(global_chat_name)
    })

    socket.on('send-msg', async ({user, message}, cb) => {
      const { error } = validate({message})
      if (error) return cb(error.details[0].message)

      const msg = new ChatMsg({
        message,
        user
      })

      await msg.save()

      io.to(global_chat_name).emit('msg', msg)
      cb('')
    })

    socket.on('disconnect', () => {
      console.log(`${socket.id} left`)
    })
  })
}