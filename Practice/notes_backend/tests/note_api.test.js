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

// beforeEach(async () => {
//   await Note.deleteMany({})
//   let noteObject = new Note(helper.initialNotes[0])
//   await noteObject.save()
//   noteObject = new Note(helper.initialNotes[1])
//   await noteObject.save()
// })

// beforeEach(async () => {
//   await Note.deleteMany({})
//   console.log("cleared")

//   helper.initialNotes.forEach(async (note) => {
//     let noteObject = new Note(note)
//     await noteObject.save()
//     console.log("saved")
//   })
//   console.log("done")
// })

beforeEach(async () => {
  await Note.deleteMany({})

  const noteObjects = helper.initialNotes.map((note) => new Note(note))
  const promiseArray = noteObjects.map((note) => note.save())
  await Promise.all(promiseArray)
})

describe("when there is initially some notes saved", () => {
  // * test makes an HTTP GET request to the /api/notes url and verifies that the request is responded to with the status code 200.
  // * The test also verifies that the Content-Type header is set to application/json, indicating that the data is in the desired format.
  // * (In content-type's value) The regex starts and ends with a slash /, because the desired string application/json also contains the same slash, it is preceded by a \ so that it is not interpreted as a regex termination character.

  test("notes are returned as json", async () => {
    await api
      .get("/api/notes")
      .expect(200)
      .expect("Content-Type", /application\/json/)
  }, 100000) // This third parameter sets the timeout to 100000 ms. A long timeout ensures that our test won't fail due to the time it takes to run.

  test("all notes are returned", async () => {
    const response = await api.get("/api/notes")

    // expect(response.body).toHaveLength(initialNotes.length)
    expect(response.body).toHaveLength(helper.initialNotes.length)
  }, 100000)

  test("a specific note is within the returned notes", async () => {
    const response = await api.get("/api/notes")

    const contents = response.body.map((r) => r.content)
    expect(contents).toContain("Browser can execute only JavaScript")
  })
})

describe("viewing a specific note", () => {
  // * test to fetch a certain note using get http method

  test("succeeds with a valid id", async () => {
    const notesAtStart = await helper.notesInDb()

    const noteToView = notesAtStart[0]

    const resultNote = await api
      .get(`/api/notes/${noteToView.id}`)
      .expect(200)
      .expect("Content-Type", /application\/json/)

    expect(resultNote.body).toEqual(noteToView)
  })

  test("fails with statuscode 404 if note does not exist", async () => {
    const validNonexistingId = await helper.nonExistingId()

    await api.get(`/api/notes/${validNonexistingId}`).expect(404)
  })

  test("fails with statuscode 400 if id is invalid", async () => {
    const invalidId = "5a3d5da59070081a82a3445"

    await api.get(`/api/notes/${invalidId}`).expect(400)
  })
})

describe("addition of a new note", () => {
  // * We're testing our backend app by posting a data object (note) into database to check if post route is working properly

  test("succeeds with valid data", async () => {
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

    const contents = notesAtEnd.map((n) => n.content)

    expect(contents).toContain("async/await simplifies making async calls")
  })

  // * test to intentionally fail to add data in datbase since we've not add content property in our data object so it should failwith error code 404

  test("fails with status code 400 if data invalid", async () => {
    const newNote = {
      important: true,
    }

    await api.post("/api/notes").send(newNote).expect(400)

    // const response = await api.get("/api/notes")
    const notesAtEnd = await helper.notesInDb()

    // expect(response.body).toHaveLength(initialNotes.length)
    expect(notesAtEnd).toHaveLength(helper.initialNotes.length)
  })
})

describe("deletion of a note", () => {
  // * test to delete a certain note using delete http method

  test("succeeds with status code 204 if id is valid", async () => {
    const notesAtStart = await helper.notesInDb()
    const noteToDelete = notesAtStart[0]

    await api.delete(`/api/notes/${noteToDelete.id}`).expect(204)

    const notesAtEnd = await helper.notesInDb()

    expect(notesAtEnd).toHaveLength(helper.initialNotes.length - 1)

    const contents = notesAtEnd.map((r) => r.content)

    expect(contents).not.toContain(noteToDelete.content)
  })
})

// beforeEach ki purani jaga

test("the first note is about HTTP methods", async () => {
  const response = await api.get("/api/notes")
  expect(response.body[0].content).toBe("HTML is easy")
})

afterAll(async () => {
  await mongoose.connection.close()
})
