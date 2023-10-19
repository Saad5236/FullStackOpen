// importing testing functions
const reverse = require("../utils/for_testing").reverse

// test(): 1st param = a string to describe the test case (can be of your choice), 2nd param = a function in which we'll run our test cases
// first we'll store our result produced by passing data while calling functions written in tests for_tests.js, then in expect() we've to pass our original result we've got from running test function and in toBe we've to pass the value that is expected to be returned from our test function's call. if the value returned from function call is equal to value passed in toBe then test case is passed.
test("reverse of a", () => {
  const result = reverse("a")

  expect(result).toBe("a")
})

test("reverse of react", () => {
  const result = reverse("react")

  expect(result).toBe("tcaer")
})

test("reverse of releveler", () => {
  const result = reverse("releveler")

  expect(result).toBe("releveler")
})

test("palindrome of react", () => {
  const result = reverse("react")

  expect(result).toBe("tkaer")
})
