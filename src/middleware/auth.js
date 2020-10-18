import jwt from 'jsonwebtoken'

export const auth = (req, res, next) => {
  const token = req.header('x-auth-token')
  if (!token) return res.status(401).send('You must be logged in to do this.')

  try {
    const decoded = jwt.verify(token, process.env.PRIV_KEY)
    req.user = decoded

    next()
  } catch (ex) {
    res.status(400).send('Invalid token.')
  }
}

export const checkUser = (req, res, next) => {
  const token = req.header('x-auth-token')

  try {
    const decoded = jwt.verify(token, process.env.PRIV_KEY)
    req.user = decoded
  } catch(ex) {}

  next()
}

export const admin = (req, res, next) => {
  const token = req.header('x-auth-token')
  if (!token) return res.status(401).send('You must be logged in to do this.')

  try {
    const decoded = jwt.verify(token, process.env.PRIV_KEY)
    if (!decoded.isAdmin) return res.status(403).send('You are not allowed to do this action.')
    else next()

  } catch (ex) {
    return res.status(400).send('Invalid token.')
  }
}

export const decodeToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.PRIV_KEY)
    return decoded
  } catch (ex) {
    return null
  }
}