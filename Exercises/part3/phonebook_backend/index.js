// const { log } = require("console");
const express = require("express")
// const { request } = require("http");
const app = express()
// Morgan middleware
const morgan = require("morgan")
const cors = require("cors")
require("dotenv").config()
const Person = require("./models/person")

// MIDDLEWARES DECLARATION

// to convert body of our post request into string using JSON.stringify(), to print it on console, that's why we're using morgan middleware token.
// morgan.token("body", (request, response) => {
morgan.token("body", (request) => {
  return request.method === "POST" ? JSON.stringify(request.body) : ""
})

// if no route is present for the request then this middleware will run.
const unknownEndpoint = (request, response) => {
  console.log("No route is available to respond to your request.")
  response.status(404).send({
    error: "unknown endpoint, no route is available to handle your request.",
  })
}

// Express error handlers are middleware that are defined with a function that accepts four parameters.
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" })
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

// USING MIDDLEWARES
app.use(express.static("build"))
app.use(cors())
app.use(express.json()) // json parser middleware call
// app.use(morgan("tiny")); // Morgan middleware to use to console.log which is used to print details of our user's http request i.e. in morgan's "tiny" format: request-method, request-path, response-status/code, response'-content-length, response-time

// instead of using "tiny" format, we're gonna use our custom format of morgin to print our desired things on console using morgan middleware, so that we can print our body content aswell, which is being converted into string using JSON.stringify() and printed into console, using following format.
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
)

// Setting up local host port number to which server will be running
const PORT = process.env.PORT
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

// ________HARDOCDED DATA (not in use anymore)_________

// let persons = [
//   {
//     id: 1,
//     name: "Arto Hellas",
//     number: "040-123456",
//   },
//   {
//     id: 2,
//     name: "Ada Lovelace",
//     number: "39-44-5323523",
//   },
//   {
//     id: 3,
//     name: "Dan Abramov",
//     number: "12-43-234345",
//   },
//   {
//     id: 4,
//     name: "Mary Poppendieck",
//     number: "39-23-6423122",
//   },
// ]

// ______HELPING FUNCTIONS_______

// To generate unique random ids (not being used anymore)
// const generateId = () => {
//   let id =
//     Math.floor(Math.random() * (99999 - persons.length + 1)) + persons.length
//   console.log(id, typeof id)
//   return id
// }

// _____ROUTES______

// Route for home page of app
app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>")
})

// To get all persons data
app.get("/api/persons", (request, response) => {
  console.log("getting all")
  // response.json(persons);
  Person.find({}).then((persons) => {
    response.json(persons)
  })
})

// To get information about abount no of persons details in database and time at which request was made
app.get("/info", (request, response) => {
  const date = new Date()
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZoneName: "short",
    hour12: false,
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  }

  response.send(
    `<div>Phonebook has info for 2 people</div>
    <div>${date.toLocaleDateString("en-US", options)}</div>`
  )
})

// To get single person's data
app.get("/api/persons/:id", (request, response, next) => {
  // let id = Number(request.params.id);
  let id = request.params.id
  // const foundPerson = persons.find((i) => i.id === id);

  // if (foundPerson) {
  //   response.json(foundPerson);
  // } else {
  //   response.status(404).end();
  // }

  Person.findById(id)
    .then((person) => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch((error) => next(error))
})

// To delete single person's data
app.delete("/api/persons/:id", (request, response, next) => {
  // let id = Number(request.params.id);
  // persons = persons.filter((i) => i.id !== id);
  // console.log("deleting", persons);
  // response.status(204).end();

  const id = request.params.id
  Person.findByIdAndRemove(id)
    .then((result) => {
      if (result) {
        console.log("Person found and deleted.")
        response.status(204).end()
      } else {
        console.log("Person not found!!")
        response.status(404).end()
      }
    })
    .catch((error) => next(error))
})

app.put("/api/persons/:id", (request, response, next) => {
  // const id = Number(request.params.id);
  // const updatedPerson = { id, ...request.body };
  // console.log("updated person", updatedPerson);
  // console.log("BEFORE", persons);
  // persons = persons.map((person) =>
  //   person.id === updatedPerson.id ? updatedPerson : person
  // );
  // console.log("AFTER", persons);
  // response.json(updatedPerson);

  const id = request.params.id
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }

  // By default, the updatedPerson parameter of the event handler receives the original document without the modifications. But by adding {new: true} as third param which will make updatedPerson to contain updated Person, so it's always best to add it.
  Person.findByIdAndUpdate(id, person, {
    new: true,
    runValidators: true,
    context: "query",
  })
    .then((updatedPerson) => {
      response.json(updatedPerson)
    })
    .catch((error) => next(error))
})

// To add new person's data
app.post("/api/persons", (request, response, next) => {
  let { name, number } = request.body

  if (!name || !number) {
    return response
      .status(400)
      .json({ error: "name or number or both are missing" })
  }

  // Checking if any phonenumber with same name already exists in database or not
  // let checkName = persons.some((person) => person.name === name);
  // if (checkName) {
  //   return response.status(409).json({ error: "name must be unique" });
  // }

  // let newPerson = {
  //   id: generateId(),
  //   name: name,
  //   number: number,
  // };

  // persons = persons.concat(newPerson);

  // response.json(newPerson);

  const person = new Person({ name, number })

  person
    .save()
    .then((savedPerson) => {
      response.json(savedPerson)
    })
    .catch((error) => next(error))
})

app.use(unknownEndpoint) // [this middleware has to be 2nd last middleware call (i.e. right before errorhandler middleware call)]. It is to tell user that no route is present to respond user http request

// this has to be the last loaded middleware.
app.use(errorHandler)
