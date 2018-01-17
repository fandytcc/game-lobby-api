const request = require('superagent')
const user = require('./fixtures/user.json')
const recipes = require('./fixtures/recipes.json')

const createUrl = (path) => {
  return `${process.env.HOST || `http://localhost:${process.env.PORT || 3030}`}${path}`
}
//use library superagent (API client) to create a client that could connect to our API, and to seed the data in our API(createUrl)

//add a loop to create all recipes from the fixtures
const createRecipes = (token) => {
  return recipes.map((recipe) => {
    return request
      .post(createUrl('/recipes'))
      .set('Authorization', `Bearer ${token}`)
      .send(recipe)
      .then((res) => {
        console.log('Recipe seeded...', res.body.title)
      })
      .catch((err) => {
        console.error('Error seeding recipe!', err)
      })
  })
}

//function to authenticate new User
const authenticate = (email, password) => {
  request
    .post(createUrl('/sessions'))
    .send({ email, password })
    .then((res) => {
      console.log('Authenticated!')
      return createRecipes(res.body.token)
    })
    .catch((err) => {
      console.error('Failed to authenticate!', err.message)
    })
}

request
  .post(createUrl('/users'))
  .send(user)
  .then((res) => {
    console.log('User created!')
    return authenticate(user.email, user.password)
  })
  .catch((err) => {
    console.error('Could not create user', err.message)
    console.log('Trying to continue...')
    authenticate(user.email, user.password)
  })