// * All notes related routes are combined here.
// * NOTE: Notice in all routes we've removed try-catch block for error handling as we've used a node package which would automatically handles all errors itself.

const notesRouter = require("express").Router()
const Note = require("../models/note") // MONGODB Model: Note (from modules folder, notes.js file)

notesRouter.get("/", async (request, response) => {
  const notes = await Note.find({})
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

  const note = new Note({
    content: body.content,
    important: body.important || false,
  })

  const savedNote = await note.save()
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
