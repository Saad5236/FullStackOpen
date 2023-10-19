// These are functions to test based on our test cases, which are written in tests directory's different files.

// this function takes a string as argument and returns reverse of that string e.g. "sada" -> "adas"
const reverse = (string) => {
  return string.split("").reverse().join("")
}

// this function takes a array as argument and returns average of all elements in array e.g. [1,2,3] -> 2
const average = (array) => {
  const reducer = (sum, item) => {
    return sum + item
  }

  return array.length === 0 ? 0 : array.reduce(reducer, 0) / array.length
}

module.exports = {
  reverse,
  average,
}
