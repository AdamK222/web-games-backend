import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import express from 'express'
const router = express.Router()

import { auth, checkUser } from '../middleware/auth'
import { validateBy } from '../middleware/validateBy'

import { User, validate } from '../models/User'

router.get('/', async (req,res) => {
  const users = await User.find().select('_id nickname')

  res.send(users)
})

router.get('/:nickname', checkUser, async (req,res) => {
  const user = await User.findOne({ nickname: req.params.nickname })
  if (!user) return res.status(404).send('That user does not exist.')

  const { _id, nickname, email } = user

  if (req.user && req.user._id === _id.toString()) {
    res.send({ _id, nickname, email})
  } else {
    res.send({ _id, nickname})
  }
})

router.post('/', validateBy(validate), async (req,res) => {
  const { nickname, email, password } = req.body
  
  let user = await User.find({ $or: [{nickname},{email}] })
  if (user.length) return res.status(400).send('User already registered.')

  user = new User({nickname, email, password})

  const rounds = 10
  user.password = await bcrypt.hash(user.password, rounds)

  await user.save()
  
  const token = user.generateToken()
  res.header('x-auth-token', token).send({
    _id: user._id,
    nickname,
    email
  })
})

export default router