const mongoose = require("mongoose")

if (process.argv.length < 3) {
  console.log("give password as argument")
  process.exit(1)
}

// ESTABLISHING CONNECTION TO DATABASE

// password of MongoDB Atlas will be passed as a command line parameter
// run command: node filename.js password (here 3rd param is password that's why we use process.argv[2] to access third param)
const password = process.argv[2]

const url = `mongodb+srv://Saad_Atif:${password}@cluster0.r9vid7i.mongodb.net/noteApp?retryWrites=true&w=majority`

mongoose.set("strictQuery", false)
mongoose.connect(url)

// CREATING SCHEMA AND MAKING MODEL FOR THAT

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

// collection name is created by modifying Model name: replace first letter from upper to lowercase then make collection name to plural. e.g. Note -> note -> notes (this is collection name) and perso
const Note = mongoose.model("Note", noteSchema) // mongoose.model(model name, schema variable), Variable name and mongoose.model() method's first parameter should be same

// Creating new note object to be stored in db called noteApp (not used anymore)
// const note = new Note({
//   content: "HTML is Easy",
//   important: true,
// })

// Storing the object (created above) in db using save() method
// note.save().then((result) => {
//   console.log("note saved!");
//   mongoose.connection.close();
// });

// find() is used to find for data objects and return them in an array which is (in this case), result variable (i.e. an array of objects)
Note.find({}).then((result) => {
  result.forEach((note) => {
    console.log(note)
  })
  mongoose.connection.close() // this command closes the database connection
})

// we can also specify our condition based on which find method will filter the objects to be fetched from db, i.e. in this case objects who has important ==  true
// Note.find({ important: true }).then((result) => {
//   result.forEach((note) => {
//     console.log(note);
//   });
//   mongoose.connection.close();
// });
