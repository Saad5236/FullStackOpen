const mongoose = require("mongoose")

if (process.argv.length < 3) {
  console.log("give password as argument")
  process.exit(1)
}

const processArgs = process.argv

const url = `mongodb+srv://Saad_Atif:${processArgs[2]}@cluster0.r9vid7i.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.set("strictQuery", false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model("Person", personSchema)

if (processArgs[3] === undefined && processArgs[4] === undefined) {
  Person.find({}).then((result) => {
    console.log("phonebook:")
    result.forEach((person) => {
      console.log(person.name + " " + person.number)
    })
    mongoose.connection.close()
  })
} else {
  const person = new Person({
    name: processArgs[3],
    number: processArgs[4],
  })
  person.save().then((result) => {
    console.log(
      `added ${processArgs[3]} number ${processArgs[4]} to phonebook`,
      result
    )
    mongoose.connection.close()
  })
}
