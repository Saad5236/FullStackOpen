// _________MONGODB DATABASE SETUP_________

const mongoose = require("mongoose")

mongoose.set("strictQuery", false)

// accessing variable MONGODB_URI declared in .env file
const url = process.env.MONGODB_URI

console.log("connecting to", url)

mongoose
  .connect(url)
  .then((result) => {
    console.log("connected to MongoDB", result)
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    validate: {
      validator: function (v) {
        return /^(\d{2,4})-(\d{8,})$/.test(v)
      },
      message: (props) => `${props.value} is not a valid phone number format!`,
    },
    required: [true, "Phone number required"],
  },
})

// By default, mongodb returned data objects contains __v and _id properties. So, following line of code removes __v property (which is of no use for me) and modifies _id property to id.
personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

const Person = mongoose.model("Person", personSchema)

module.exports = Person
