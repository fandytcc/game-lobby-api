const router = require('express').Router()
const { User } = require('../models')
const passport = require('../config/auth')

// POST /users to create a user (sign up)
router.post('/users', (req, res, next) => {
  User.register(new User({name: req.body.name, email: req.body.email}), req.body.password, (err, user) => {
    if(err) {
      err.status = 422 //Unprocessable Entity
      return next(err)
    }

    const { name, email, _id, createdAt, updatedAt } = user
    res.status(201).send({ name, email, _id, createdAt, updatedAt })
    //or res.status(201).send(user)
    //success - created
  })
})

router.get('/users/me', passport.authorize('jwt', { session: false }), (req, res, next) => {
  //Once authorized, the user data should be in req.account
  if(!req.account) {
    const error = new Error('Unauthorized')
    error.status = 401 //Unauthorized
    next(error)
  }

  res.json(req.account)
})
// .use((req, res, next) => {
//   debugger
// })

module.exports = router
