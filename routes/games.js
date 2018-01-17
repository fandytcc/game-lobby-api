const router = require('express').Router()
const { game } = require('../models')
const passport = require('../config/auth')

router.get('/games', (req, res, next) => {
  game.find()
    // Newest games first
    .sort({ createdAt: -1 })
    // Send the data in JSON format
    .then((games) => res.json(games))
    // Throw a 500 error if something goes wrong
    .catch((error) => next(error))
  })
  .get('/games/:id', (req, res, next) => {
    const id = req.params.id
    game.findById(id)
      .then((game) => {
        if (!game) { return next() }
        res.json(game)
      })
      .catch((error) => next(error))
  })
  .post('/games', passport.authorize('jwt', { session: false }), (req, res, next) => {
    let newGame = req.body
    newGame.authorId = req.account._id //user authentication before they have the right to create the game

    game.create(newGame)
      .then((game) => res.json(game))
      .catch((error) => next(error))
  })
  .put('/games/:id', (req, res) => {
    const GameId = req.params.id

    game.findById(GameId)
      .then((game) => {
        if(!game) { return next() }

        const updates = req.body

        game.update(updates)
          .then((game) => {
            res.json(game)
          })
          .catch((error) => next(error))
      })
      .catch((error) => next(error))
  })
  // .patch('/games/:id', (req, res) => {
  //   const GameId = req.params.id
  //   let updates = req.body
  //
  //   game.findOneAndUpdate(GameId, update)
  //   game.save(function(err){
  //     .then((game) => {
  //       if(!game) return next()
  //         res.json(game)
  //     })
  //     .catch((error) => next(error))
  // })
  .delete('/games/:id', (req, res) => {
    const GameId = req.params.id

    game.findOneAndRemove(GameId)
      .then((game) => {
        if(!game) return next()
          res.json(game)
      })
      .catch((error) => next(error))
  })

module.exports = router
