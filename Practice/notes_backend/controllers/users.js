const bcrypt = require("bcrypt")
const usersRouter = require("express").Router()
const User = require("../models/user")

usersRouter.get("/", async (request, response) => {
  // when an HTTP GET request is made to the /api/users route, the user objects would also contain the contents of the user's notes and not just their id. In a relational database, this functionality would be implemented with a join query. When in reality this data is not being saved in the backend db, it's just to present data. We can also specify which field to show from other collection's data object.
  const users = await User.find({}).populate("notes", {
    content: 1,
    important: 1,
  })
  response.json(users)
})

usersRouter.post("/", async (request, response) => {
  const { username, name, password } = request.body

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

module.exports = usersRouter
