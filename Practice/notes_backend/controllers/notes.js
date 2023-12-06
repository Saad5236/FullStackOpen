// * All notes related routes are combined here.
// * NOTE: Notice in all routes we've removed try-catch block for error handling as we've used a node package which would automatically handles all errors itself.

const notesRouter = require("express").Router()
const Note = require("../models/note") // MONGODB Model: Note (from modules folder, notes.js file)
const User = require("../models/user")
const jwt = require("jsonwebtoken")

const getTokenFrom = (request) => {
  const authorization = request.get("authorization")
  console.log(authorization)
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    if (authorization.includes("bearer "))
      return authorization.replace("bearer ", "")
    else return authorization.replace("Bearer ", "")
  }
  return null
}

notesRouter.get("/", async (request, response) => {
  // when an HTTP GET request is made to the /api/users route, the user objects would also contain the contents of the user's notes and not just their id. In a relational database, this functionality would be implemented with a join query. When in reality this data is not being saved in the backend db, it's just to present data. We can also specify which field to show from other collection's data object.
  const notes = await Note.find({}).populate("user", { username: 1, name: 1 })
  response.json(notes)
})

notesRouter.get("/:id", async (request, response) => {
  const note = await Note.findById(request.params.id)
  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})

// ese he comment kia kyu k next function unused ha to eslint error produce ker ra
notesRouter.post("/", async (request, response) => {
  const body = request.body

  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  console.log("decodedtoken", decodedToken)
  if (!decodedToken.id) {
    return response.status(401).json({ error: "token invalid" })
  }
  const user = await User.findById(decodedToken.id)

  // const user = await User.findById(body.userId)

  const note = new Note({
    content: body.content,
    important: body.important === undefined ? false : body.important,
    user: user.id,
  })

  const savedNote = await note.save()
  user.notes = user.notes.concat(savedNote._id)
  await user.save()

  response.status(201).json(savedNote)
})

notesRouter.delete("/:id", async (request, response) => {
  await Note.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

notesRouter.put("/:id", async (request, response) => {
  const body = request.body

  const note = {
    content: body.content,
    important: body.important,
  }

  const updatedNote = await Note.findByIdAndUpdate(request.params.id, note, {
    new: true,
  })
  response.json(updatedNote)
})

module.exports = notesRouter
