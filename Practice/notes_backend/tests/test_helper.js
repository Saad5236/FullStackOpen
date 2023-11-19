// This files serves assist to note_api.test.js for testing of notes app. We are providing helper functions which would help intesting backend app and also initial data which needs to push in database (for nly testing purposes) before running all the tests

const Note = require("../models/note")

const initialNotes = [
  {
    content: "HTML is easy",
    important: false,
  },
  {
    content: "Browser can execute only JavaScript",
    important: true,
  },
]

const nonExistingId = async () => {
  const note = new Note({ content: "willremovethissoon" })
  await note.save()
  await note.deleteOne()

  return note._id.toString()
}

const notesInDb = async () => {
  const notes = await Note.find({})
  return notes.map((note) => note.toJSON())
}

module.exports = {
  initialNotes,
  nonExistingId,
  notesInDb,
}
