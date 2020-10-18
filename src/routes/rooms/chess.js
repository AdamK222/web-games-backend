import express from 'express'
const router = express.Router()
import Joi from 'joi'

import { auth } from '../../middleware/auth'
import { validateBy } from '../../middleware/validateBy'

import { ChessRoom, validate } from '../../models/rooms/Chess'
import { User } from '../../models/User'

router.get('/', async (req, res) => {
  const rooms = await ChessRoom.find().select('_id name player1 player2')

  res.send(rooms)
})

// { name, player2Id }
router.post('/', [auth, validateBy(validate)], async (req, res) => {
  const { name, player2Id, turn } = req.body

  const player2 = await User.findById(player2Id)
  if (!player2) return res.status(400).send('Incorrect player Id.')

  let room = await ChessRoom.findOne({ name })
  if (room) return res.status(400).send('That room already exists.')

  const p1white = Math.floor(Math.random() * 2)

  room = new ChessRoom({
    name,
    player1: {
      _id: req.user._id,
      nickname: req.user.nickname,
      color: p1white ? "w" : "b"
    },
    player2: {
      _id: player2._id,
      nickname: player2.nickname,
      color: p1white ? "b" : "w"
    }
  })

  await room.save()

  res.send(room)
})

// Game process

router.get('/:id', async (req, res) => {
  const room = await ChessRoom.findById(req.params.id).select('_id name fen player1 player2 moves')

  res.send(room)
})

export default router;