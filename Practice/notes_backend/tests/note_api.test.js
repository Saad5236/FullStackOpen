// supertest package helps us write our tests for testing the API.

const mongoose = require("mongoose")
const supertest = require("supertest")
const app = require("../app")

// The test imports the Express application from the app.js module and wraps it with the supertest function into a so-called superagent object.
const api = supertest(app)

// test makes an HTTP GET request to the api/notes url and verifies that the request is responded to with the status code 200.
// The test also verifies that the Content-Type header is set to application/json, indicating that the data is in the desired format.
// (In content-type's value) The regex starts and ends with a slash /, because the desired string application/json also contains the same slash, it is preceded by a \ so that it is not interpreted as a regex termination character.
test("notes are returned as json", async () => {
  await api
    .get("/api/notes")
    .expect(200)
    .expect("Content-Type", /application\/json/)
}, 100000) // This third parameter sets the timeout to 100000 ms. A long timeout ensures that our test won't fail due to the time it takes to run.

afterAll(async () => {
  await mongoose.connection.close()
})
