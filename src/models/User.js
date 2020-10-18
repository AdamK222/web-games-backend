import mongoose from 'mongoose'
import Joi from 'joi'
import jwt from 'jsonwebtoken'

export const userSchema = mongoose.Schema({
  nickname: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
    maxlength: 20
  },
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: 4,
    maxlength: 128
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 1024
  },
  isAdmin: {
    type: Boolean,
    default: false
  }
})

userSchema.methods.generateToken = function() {
  return jwt.sign({
    _id: this._id,
    nickname: this.nickname,
    isAdmin: this.isAdmin
  }, process.env.PRIV_KEY)
}

export const User = mongoose.model('User', userSchema)

export const validate = (user) => {
  const schema = {
    nickname: Joi.string().required().min(3).max(20),
    email: Joi.string().email().required().min(4).max(128),
    password: Joi.string().required().min(8).max(128)
  }

  return Joi.validate(user, schema)
}