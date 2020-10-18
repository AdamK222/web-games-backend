import mongoose from 'mongoose'
import Joi from 'joi'

import { Chess } from 'chess.js'

const chess = new Chess()

const chessSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
    maxlength: 20
  },
  creationDate: {
    type: Date,
    default: Date.now()
  },
  fen: {
    type: String,
    default: chess.fen()
  },
  moves: {
    type: Array
  },
  player1: {
    type: mongoose.Schema({
      nickname: {
        type: String,
        minlength: 3,
        maxlength: 20
      },
      color: {
        type: String,
        minlength: 1,
        maxlength: 1
      }
    }),
    required: true
  },
  player2: {
    type: mongoose.Schema({
      nickname: {
        type: String,
        minlength: 3,
        maxlength: 20
      },
      color: {
        type: String,
        minlength: 1,
        maxlength: 1
      }
    }),
    required: true
  }
})

export const ChessRoom = mongoose.model('Chess-Room', chessSchema)

export const validate = (chessRoom) => {
  const schema = {
    name: Joi.string().required().min(3).max(20),
    player2Id: Joi.objectId().required()
  }

  return Joi.validate(chessRoom, schema)
}

export const validateMove = (move) => {
  const schema = {
    from: Joi.string().required().length(2).lowercase(),
    to: Joi.string().required().length(2).lowercase(),
    promotion: Joi.string().length(1).lowercase()
  }

  return Joi.validate(move, schema)
}