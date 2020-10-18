import express from 'express'

import users from '../routes/users'
import auth from '../routes/auth'
import chess from '../routes/rooms/chess'
import chat from '../routes/chat'

import error from '../middleware/error'

export default (app) => {
  app.use(express.json())

  app.use('/api/users', users)
  app.use('/api/auth', auth)
  app.use('/api/rooms/chess', chess)
  app.use('/api/chat', chat)

  app.use(error)
}
