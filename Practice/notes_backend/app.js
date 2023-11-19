const express = require("express")
const app = express()
const cors = require("cors")
const config = require("./utils/config")
// const Note = require("./models/note") // MONGODB Model: Note (from modules folder, notes.js file)
const notesRouter = require("./controllers/notes") // importing all notes' related paths exported from notes.js file is now to be used as middleware and will be called as app.use. So, no need to include all routes in app.js (i.e. express app).
const middleware = require("./utils/middleware")
const logger = require("./utils/logger")
const mongoose = require("mongoose")
require("express-async-errors") // * since we have to use try catch block alongwith use of async/await functionality, so this package helps us to remove all the try-catch blocks and still all error would be handled

// Mongoose way of connecting to mongodb:

mongoose.set("strictQuery", false)

logger.info("connecting to", config.MONGODB_URI)

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info("connected to MongoDB")
  })
  .catch((error) => {
    logger.error("error connecting to MongoDB:", error.message)
  })

// // MIDDLEWARE FUNCTIONS

// // simple self made first middleware function
// const requestLogger = (request, response, next) => {
//   console.log("FIRST MIDDLE TO RUN BEFORE EVERY USER REQUEST.")
//   console.log("Method:", request.method)
//   console.log("Path:  ", request.path)
//   console.log("Body:  ", request.body)
//   console.log("---")
//   next()
// }

// // if no route is present for the request then this middleware will run.
// const unknownEndpoint = (request, response) => {
//   console.log("No route is available to respond to your request.")
//   response.status(404).send({
//     error: "unknown endpoint, no route is available to handle your request.",
//   })
// }

// // Express error handlers are middleware that are defined with a function that accepts four parameters.
// const errorHandler = (error, request, response, next) => {
//   console.error(error.message)

//   if (error.name === "CastError") {
//     return response.status(400).send({ error: "malformatted id" })
//   } // since we've added custom mongoose validators in our model, so in else if, we're handling validation errors too if a user posts a data into db which has invalid data format
//   else if (error.name === "ValidationError") {
//     return response.status(400).json({ error: error.message })
//   }

//   next(error)
// }

// Middleware functions have to be taken into use before routes if we want them to be executed before the route event handlers are called.

app.use(express.json()) // [It's recommended to use it as first middleware call.] json parser middleware call. It'd help fetch json data sent in body while giving POST requests. So, if this middleware is not called or is called after POST request route then body of the POST request will be undefined even if data was sent by user in body of POST request.
app.use(cors()) // Now by using cors middleware, we can access requests from url other than on which our frontend application is deployed on. In this case, our frontend application is using localhost's 3000 port but we're trying to implement our backend application on localhost 3001. So, initially our frontend (react or any other) application was not allowing to access resources (i.e. data from backend) of another url i.e. other than port3000. So, by installing cors on backend it's allowing our frontend application to remove the restriction of only fetching resources from one's own url, and now after using this cors middleware, our frontend application would be able to access data from backend that is running on different url.
app.use(middleware.requestLogger) // Personal first middleware made into use (which is declare above)
app.use(express.static("build")) // to fetch all static assets (which include frontend's build folder created), to run with backend app
app.use("/api/notes", notesRouter) // all notes routes are handled in notesRouter obj which is a middleware
// // _____ROUTES______

// // Route for home page of app
// app.get("/", (request, response) => {
//   response.send("<h1>Hello World!</h1>")
// })

// // To receive all notes avaialble in backend
// app.get("/api/notes", (request, response) => {
//   // response.json(notes);
//   Note.find({}).then((notes) => {
//     response.json(notes)
//   })
// })

// // To receive single note fetched by matching id
// app.get("/api/notes/:id", (request, response, next) => {
//   // const id = Number(request.params.id);
//   const id = request.params.id
//   // const foundNote = notes.find((i) => i.id === id);

//   // When note is not found in our notes resource, then no note is sent in response but response status remain 200 OK
//   // So, we're modifying our approach that when no note is found in our resource then instead
//   // of 200 OK, 404 NOT FOUND should be sent in response
//   // end() method means to respond the request without sending any data back

//   // if (foundNote) {
//   //   response.json(foundNote);
//   // } else {
//   //   response.status(404).end();
//   // }

//   Note.findById(id)
//     .then((note) => {
//       if (note) {
//         // if note is found for id specified in url then it'd be returned
//         response.json(note)
//       } else {
//         // if note is not found against given id then 404 (not found) is generated
//         response.status(404).end()
//       }
//     })
//     .catch((error) => next(error))
//   // .catch((error) => {
//   //   // catch block is to handle cases where the promise returned by the findById method is rejected:
//   //   console.log(error);
//   //   // response.status(500).end(); // 505 (internal server error)
//   //   response.status(400).send({ error: "malformatted id" }); // 400 (bad request): To tell that invalid format of id is entered
//   // });
// })

// // Deleting single note among all notes from backend thorugh note's id
// app.delete("/api/notes/:id", (request, response, next) => {
//   // const id = Number(request.params.id);
//   // notes = notes.filter((note) => note.id !== id);
//   // console.log(notes);
//   // response.status(204).end();

//   const id = request.params.id
//   Note.findByIdAndRemove(id)
//     .then((result) => {
//       if (result) {
//         console.log("Note found and deleted.")
//         response.status(204).end()
//       } else {
//         console.log("Note not found!!")
//         response.status(404).end()
//       }
//     })
//     .catch((error) => next(error))
// })

// // To post/save new data on server
// app.post("/api/notes", (request, response, next) => {
//   let body = request.body

//   // We're restricting user to not left content property empty, if new note's content property is found empty
//   // then an error messege will be sent with response code 400
//   if (body.content === undefined) {
//     return response.status(400).json({
//       error: "content missing",
//     })
//   }

//   const note = new Note({
//     content: body.content,
//     important: body.important || false,
//   })

//   note
//     .save()
//     .then((savedNote) => {
//       response.json(savedNote)
//     })
//     .catch((error) => next(error))

//   // const newNote = {
//   //   content: body.content,
//   //   // If new Note's important status is left empty by user then automaticallu its value will be set false.
//   //   // so it's not necessary to give important prop's value
//   //   important: body.important || false,
//   //   id: generateId(),
//   // };

//   // storing our note in backend: could be a database or an array that we're using here.
//   // notes = notes.concat(newNote);

//   // response.json(newNote);
// })

// app.put("/api/notes/:id", (request, response, next) => {
//   // const id = Number(request.params.id);
//   // const updatedNote = request.body;

//   // console.log("BEFORE", notes);
//   // notes = notes.map((note) =>
//   //   note.id === updatedNote.id ? updatedNote : note
//   // );
//   // console.log("AFTER", notes);

//   const id = request.params.id
//   const body = request.body

//   const note = {
//     content: body.content,
//     important: body.important,
//   }

//   // By default, the updatedNote parameter of the event handler receives the original document without the modifications. But by adding {new: true} as third param which will make updatedNote to contain updated note, so it's always best to add it.
//   // We've added: {...runValidators: true, content: "query"} it's because, by default findByIdAndUpdate() method doesn't validate the data that comes for updation of already added data in db (i.e. same validators that were used inside while creating schema, for posting new data), so make validots run while also updating data, we've added this code.
//   Note.findByIdAndUpdate(id, note, {
//     new: true,
//     runValidators: true,
//     context: "query",
//   })
//     .then((updatedNote) => {
//       response.json(updatedNote)
//     })
//     .catch((error) => next(error))
// })

// We're calling this middleware function call in the end bcz, when no route is present to handle
// user's http request then this middleware would run which is written after routes.
app.use(middleware.unknownEndpoint) // [this middleware has to be 2nd last middleware call (i.e. right before errorhandler middleware call)]. It is to tell user that no route is present to respond user http request

// this has to be the last loaded middleware. This is our self created error handler middleware (which we've declared its function above)
app.use(middleware.errorHandler)

module.exports = app
