// MIDDLEWARE FUNCTIONS

// simple self made first middleware function
const requestLogger = (request, response, next) => {
  console.log("FIRST MIDDLE TO RUN BEFORE EVERY USER REQUEST.")
  console.log("Method:", request.method)
  console.log("Path:  ", request.path)
  console.log("Body:  ", request.body)
  console.log("---")
  next()
}

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
  } // since we've added custom mongoose validators in our model, so in else if, we're handling validation errors too if a user posts a data into db which has invalid data format
  else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message })
  } else if (error.name === "JsonWebTokenError") {
    return response.status(401).json({
      error: "invalid token",
    })
  } else if (error.name === "TokenExpiredError") {
    return response.status(401).json({
      error: "token expired",
    })
  }

  next(error)
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
}
