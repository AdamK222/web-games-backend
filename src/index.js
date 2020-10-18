import '@babel/polyfill'
import dotenv from 'dotenv'
dotenv.config()

import mongoose from 'mongoose'
import httpServer from 'http'
import express from 'express'
const app = express()
const http = httpServer.Server(app)

import 'express-async-errors'
import morgan from 'morgan'
import helmet from 'helmet'
import compression from 'compression'
import cors from 'cors'

import Joi from 'joi'
import objId from 'joi-objectid'

app.use(cors({
  exposedHeaders: 'x-auth-token'
}))

app.use(morgan('dev'))
app.use(helmet())
app.use(compression())
Joi.objectId = objId(Joi)

import routing from './startup/routing'
import db from './startup/db'
import error from './startup/error'
import socket from './startup/sockets'
error()
routing(app)
db()
socket(http)

const port = process.env.PORT || 3001;
const server = http.listen(port, () => {console.log(`Listening on ${port} ...`)})

export default server