// jsonwebtoken - to create token, if username & password are matched with our database, we give the user a token instead of using cookie in a broswer session
const passportJWT = require('passport-jwt')

const ExtractJwt = passportJWT.ExtractJwt

module.exports = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SECRET || 'verysecret'
}

  // tell the strategy that we expect tokens to be sent as Bearer tokens in Authorization header "Authorization: Bearer <token here>"
