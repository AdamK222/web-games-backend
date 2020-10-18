import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import Joi from 'joi'
import express from 'express'
const router = express.Router()

import { User } from '../models/User'

router.post('/', async (req,res) => {
  const { error } = validate(req.body)
  if (error) return res.status(400).send(error.details[0].message)
  
  const { email, password } = req.body

  const user = await User.findOne({ email })
  if (!user) return res.status(400).send('Incorrect email or password.')

  const valid = await bcrypt.compare(password, user.password)
  if (!valid) return res.status(400).send('Incorrect email or password.')

  const token = user.generateToken()
  res.header('x-auth-token', token).send({
    nickname: user.nickname,
    token
  })
})

const validate = (user) => {
  const schema = {
    email: Joi.string().email().required().min(4).max(128),
    password: Joi.string().required().min(8).max(128)
  }

  return Joi.validate(user, schema)
}

export default router