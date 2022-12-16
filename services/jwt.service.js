
import jwt from 'jsonwebtoken'

export function generateAccessToken(username,userId) {
    return jwt.sign({username: username,userId: userId}, process.env.JWT_SECRET, { expiresIn:  process.env.JWT_DURATION });
  }


export function getUserName(req){
  return jwt.verify(req.headers['authorization'].split(' ')[1], process.env.JWT_SECRET).username
}

export function getUserId(req){
  return jwt.verify(req.headers['authorization'].split(' ')[1], process.env.JWT_SECRET).userId
}

export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (token == null || authHeader.split(' ')[0] !== 'Bearer') return res.sendStatus(401)

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    //console.log(err)

    if (err) return res.sendStatus(403)

    req.user = user

    next()
  })
}