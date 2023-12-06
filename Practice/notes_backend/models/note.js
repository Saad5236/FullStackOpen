// _________MONGODB DATABASE SETUP_________

const mongoose = require("mongoose")
// const config = require("../utils/config") // to import MONGOOSE_URI instead of from .env , which not imported in config.js first

// mongoose.set("strictQuery", false)

// // accessing variable MONGODB_URI declared in .env file
// // const url = process.env.MONGODB_URI
// const url = config.MONGODB_URI

// console.log("connecting to", url)

// mongoose
//   .connect(url)
//   .then((result) => {
//     console.log("connected to MongoDB", result)
//   })
//   .catch((error) => {
//     console.log("error connecting to MongoDB:", error.message)
//   })

const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    // validation of entering the data into data base, which includes: minimum length of content should be 5 characters and content field cannot be left empty
    minLength: 5,
    required: true,
  },
  important: Boolean,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
})

// By default, mongodb returned data objects contains __v and _id properties. So, following line of code removes __v property (which is of no use for me) and modifies _id property to id.
noteSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

const Note = mongoose.model("Note", noteSchema)

module.exports = Note
