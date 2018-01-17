const router = require('express').Router()
const jwt = require('jsonwebtoken')
const passport = require('../config/auth')
const { User } = require('../models')
const jwtOptions = require('../config/jwt')

router.post('/sessions', passport.authenticate('local'), (req, res) => {
  const payload = { id: req.user.id }
  const token = jwt.sign(payload, jwtOptions.secretOrKey)
  res.json({ token })
})
// 'local' = local authentication

module.exports = router
