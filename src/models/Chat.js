import mongoose from 'mongoose'
import Joi from 'joi'

export const chatMsgSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema({
      nickname: {
        type: String,
        minlength: 3,
        maxlength: 20
      },
      isAdmin: {
        type: Boolean,
        default: false
      }
    }),
    required: true
  },
  message: {
    type: String,
    required: true
  },
  creationDate: {
    type: Date,
    default: Date.now()
  }
})

export const ChatMsg = mongoose.model('Chat-Msg', chatMsgSchema)

export const validate = (msg) => {
  const schema = {
    message: Joi.string().required()
  }

  return Joi.validate(msg, schema)
}