import mongoose from 'mongoose'
import express from 'express'
const router = express.Router()
import socketio from 'socket.io'

import { ChatMsg, validate } from '../models/Chat'
//import { auth } from '../middleware/auth'
//import { validateBy } from '../middleware/validateBy'

router.get('/', async (req, res) => {
  const messages = await ChatMsg.find()

  res.send(messages)
})

export default router