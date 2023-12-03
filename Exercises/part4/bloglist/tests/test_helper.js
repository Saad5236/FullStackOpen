// This files serves assist to blog_api.test.js for testing of blogs app. We are providing helper functions which would help intesting backend app and also initial data which needs to push in database (for nly testing purposes) before running all the tests

const Blog = require("../models/blog")

const initialBlogs = [
  {
    title: "This is new blog",
    author: "Saad Atif",
    url: "https://www.google.com",
    likes: 10,
  },
  {
    title: "This is new again blog",
    author: "Saim",
    url: "https://www.youtube.com",
    likes: 20,
  },
]

const nonExistingId = async () => {
  const blog = new Blog({ content: "willremovethissoon" })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map((blog) => blog.toJSON())
}

module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDb,
}
