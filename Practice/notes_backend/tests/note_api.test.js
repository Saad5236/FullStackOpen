// * supertest package helps us write our tests for testing the API.

const mongoose = require("mongoose")
const supertest = require("supertest")

// * this includes the data to initially add in beforeEach() and helper functions that are being used in writing tests to test backend app's routes and interaction with database
const helper = require("./test_helper")
const app = require("../app")

// * The test imports the Express application from the app.js module and wraps it with the supertest function into a so-called superagent object.
const api = supertest(app)

const Note = require("../models/note")
// const initialNotes = [
//   {
//     content: "HTML is easy",
//     important: false,
//   },
//   {
//     content: "Browser can execute only JavaScript",
//     important: true,
//   },
// ]

// * initialize the database before every test with the beforeEach function. now before running any single test in this file or running all tests, this beforeEach will add two notes to set initial state
// * after connection with db, clearing out all existing data in db and appending two new documents into db so initial state of db is same everytime tests run

beforeEach(async () => {
  await Note.deleteMany({})
  // let noteObject = new Note(initialNotes[0])
  let noteObject = new Note(helper.initialNotes[0])
  await noteObject.save()
  // noteObject = new Note(initialNotes[1])
  noteObject = new Note(helper.initialNotes[1])
  await noteObject.save()
})

// * test makes an HTTP GET request to the /api/notes url and verifies that the request is responded to with the status code 200.
// * The test also verifies that the Content-Type header is set to application/json, indicating that the data is in the desired format.
// * (In content-type's value) The regex starts and ends with a slash /, because the desired string application/json also contains the same slash, it is preceded by a \ so that it is not interpreted as a regex termination character.

test("notes are returned as json", async () => {
  await api
    .get("/api/notes")
    .expect(200)
    .expect("Content-Type", /application\/json/)
}, 100000) // This third parameter sets the timeout to 100000 ms. A long timeout ensures that our test won't fail due to the time it takes to run.

// * We're testing our backend app by posting a data object (note) into database to check if post route is working properly

test("a valid note can be added", async () => {
  const newNote = {
    content: "async/await simplifies making async calls",
    important: true,
  }

  await api
    .post("/api/notes")
    .send(newNote)
    .expect(201)
    .expect("Content-Type", /application\/json/)

  // const response = await api.get("/api/notes")

  // const contents = response.body.map(r => r.content)

  // expect(response.body).toHaveLength(initialNotes.length + 1)

  const notesAtEnd = await helper.notesInDb()
  expect(notesAtEnd).toHaveLength(helper.initialNotes.length + 1)

  const contents = notesAtEnd.map(n => n.content)

  expect(contents).toContain(
    "async/await simplifies making async calls"
  )
})

// * test to intentionally fail to add data in datbase since we've not add content property in our data object so it should failwith error code 404

test("note without content is not added", async () => {
  const newNote = {
    important: true
  }

  await api
    .post("/api/notes")
    .send(newNote)
    .expect(400)

  // const response = await api.get("/api/notes")
  const notesAtEnd = await helper.notesInDb()

  // expect(response.body).toHaveLength(initialNotes.length)
  expect(notesAtEnd).toHaveLength(helper.initialNotes.length)
})

// beforeEach ki purani jaga

// test("there are two notes", async () => {
//   const response = await api.get("/api/notes")
//   expect(response.body).toHaveLength(2)
// })

test("all notes are returned", async () => {
  const response = await api.get("/api/notes")

  // expect(response.body).toHaveLength(initialNotes.length)
  expect(response.body).toHaveLength(helper.initialNotes.length)
})

test("the first note is about HTTP methods", async () => {
  const response = await api.get("/api/notes")
  expect(response.body[0].content).toBe("HTML is easy")
})

test("a specific note is within the returned notes", async () => {
  const response = await api.get("/api/notes")

  const contents = response.body.map(r => r.content)
  expect(contents).toContain(
    "Browser can execute only JavaScript"
  )
})

afterAll(async () => {
  await mongoose.connection.close()
})
