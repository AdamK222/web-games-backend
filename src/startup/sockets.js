import socketio from 'socket.io'

import chat from '../sockets/chat'
import chess from '../sockets/chess'

export default (http) => {
  const io = socketio(http)

  chat(io)
  chess(io)
}
